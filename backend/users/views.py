from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile, Cart
from courses.models import Enrollment, Course
from courses.serializers import CourseSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role', 'user')
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken.'}, status=400)
    user = User.objects.create_user(username=username, email=email, password=password)
    UserProfile.objects.create(user=user, role=role)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': username, 'role': role}, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        role = user.profile.role if hasattr(user, 'profile') else 'user'
        return Response({'token': token.key, 'username': username, 'role': role})
    return Response({'error': 'Invalid credentials.'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out.'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    profile = user.profile
    enrolled = Enrollment.objects.filter(user=user)
    enrolled_courses = CourseSerializer(
        [e.course for e in enrolled], many=True, context={'request': request}
    ).data
    cart = Cart.objects.filter(user=user)
    cart_courses = CourseSerializer(
        [c.course for c in cart], many=True, context={'request': request}
    ).data
    return Response({
        'username': user.username,
        'email': user.email,
        'role': profile.role,
        'enrolled_courses': enrolled_courses,
        'cart_courses': cart_courses,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, course_id):
    course = Course.objects.get(pk=course_id)
    Cart.objects.get_or_create(user=request.user, course=course)
    return Response({'added': True})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, course_id):
    Cart.objects.filter(user=request.user, course_id=course_id).delete()
    return Response({'removed': True})