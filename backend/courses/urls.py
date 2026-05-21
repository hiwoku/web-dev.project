from django.urls import path
from .views import (
    CourseListAPIView,
    CourseDetailAPIView,
    enroll_course,
    purchase_course,
    CategoryListAPIView,
    AddReviewAPIView,
)

urlpatterns = [
    path('courses/', CourseListAPIView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailAPIView.as_view(), name='course-detail'),
    path('courses/<int:pk>/enroll/', enroll_course, name='course-enroll'),
    path('courses/<int:pk>/purchase/', purchase_course, name='course-purchase'),
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('reviews/add/', AddReviewAPIView.as_view(), name='review-add'),
]