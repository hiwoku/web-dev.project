from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from django.db.models import Q, Avg
from .models import Course, Company, Review, Enrollment, Category
from .serializers import CourseSerializer, CompanySerializer, ReviewSerializer, EnrollmentSerializer, CategorySerializer

# --- Course CBVs ---
class CourseListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Course.objects.all()
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        is_free = self.request.query_params.get('is_free')
        sort = self.request.query_params.get('sort')
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))
        if category:
            qs = qs.filter(category__id=category)
        if is_free is not None:
            qs = qs.filter(is_free=(is_free.lower() == 'true'))
        if sort == 'rating':
            qs = sorted(qs, key=lambda c: c.average_rating, reverse=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# --- Company CBVs ---
class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        company = serializer.save(owner=self.request.user)
        self.request.user.profile.role = 'company_rep'
        self.request.user.profile.save()

class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# --- Review FBV ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request):
    review_type = request.data.get('review_type')
    if review_type == 'course':
        course_id = request.data.get('course')
        if not Enrollment.objects.filter(user=request.user, course_id=course_id).exists():
            return Response({'error': 'You must be enrolled to review this course.'}, status=403)
    elif review_type == 'company':
        company_id = request.data.get('company')
        company = Company.objects.get(pk=company_id)
        enrolled_in_company = Enrollment.objects.filter(
            user=request.user, course__company=company
        ).exists()
        if not enrolled_in_company:
            return Response({'error': 'You must have completed a course from this company.'}, status=403)
    serializer = ReviewSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# --- Enrollment FBV ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_course(request, course_id):
    course = Course.objects.get(pk=course_id)
    if not course.is_free:
        return Response({'error': 'Payment required.'}, status=402)
    enrollment, created = Enrollment.objects.get_or_create(user=request.user, course=course)
    return Response({'enrolled': True, 'created': created})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_course(request, course_id):
    course = Course.objects.get(pk=course_id)
    # Simulate payment — in production, integrate Stripe or similar
    Enrollment.objects.get_or_create(user=request.user, course=course)
    return Response({'success': True, 'message': 'Payment successful. You are now enrolled.'})

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]