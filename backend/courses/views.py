from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView

from .models import Course, Enrollment, Category, Review
from .serializers import (
    CourseSerializer,
    EnrollmentSerializer,
    CategorySerializer,
    ReviewCreateSerializer,
    ReviewSerializer
)


class CourseListAPIView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Course.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        level = self.request.query_params.get('level')
        company = self.request.query_params.get('company')

        if search:
            queryset = queryset.filter(title__icontains=search)
        if category:
            queryset = queryset.filter(category_id=category)
        if level:
            queryset = queryset.filter(level=level)
        if company:
            queryset = queryset.filter(company_id=company)

        return queryset

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'profile') or self.request.user.profile.user_type != 'company':
            raise PermissionDenied('Only company accounts can create courses.')
        serializer.save()


class CourseDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_context(self):
        return {'request': self.request}

    def update(self, request, *args, **kwargs):
        course = self.get_object()
        if course.company and course.company.user != request.user:
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        course = self.get_object()
        if course.company and course.company.user != request.user:
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_course(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

    enrollment, created = Enrollment.objects.get_or_create(
        user=request.user,
        course=course
    )

    serializer = EnrollmentSerializer(enrollment)
    return Response(
        {
            'message': 'Enrolled successfully.' if created else 'Already enrolled.',
            'enrollment': serializer.data
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_course(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

    if float(course.price) <= 0:
        return Response(
            {'error': 'This course is free. Use enroll instead.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    enrollment, created = Enrollment.objects.get_or_create(
        user=request.user,
        course=course
    )

    serializer = EnrollmentSerializer(enrollment)
    return Response(
        {
            'message': 'Payment successful and course unlocked.' if created else 'Course already purchased.',
            'enrollment': serializer.data
        },
        status=status.HTTP_200_OK
    )


class AddReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        review_type = serializer.validated_data.get('review_type')
        course = serializer.validated_data.get('course')
        company = serializer.validated_data.get('company')

        if review_type == 'course':
            if not course:
                return Response({'error': 'Course is required.'}, status=status.HTTP_400_BAD_REQUEST)

            enrolled = Enrollment.objects.filter(
                user_id=request.user.id,
                course_id=course.id
            ).exists()

            if not enrolled:
                return Response(
                    {'error': 'You must be enrolled to review this course.'},
                    status=status.HTTP_403_FORBIDDEN
                )

        if review_type == 'company':
            if not company:
                return Response({'error': 'Company is required.'}, status=status.HTTP_400_BAD_REQUEST)

        review = serializer.save(user=request.user)
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)