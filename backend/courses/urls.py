from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.user_login, name='user-login'),
    path('logout/', views.user_logout, name='user-logout'),
    path('courses/', views.CourseListAPIView.as_view(), name='course-list'),
    path('courses/<int:pk>/', views.CourseDetailAPIView.as_view(), name='course-detail'),
    path('courses/<int:pk>/enroll/', views.enroll_course, name='course-enroll'),
]