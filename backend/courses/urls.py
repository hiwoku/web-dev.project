from django.urls import path
from . import views

urlpatterns = [
    path('courses/', views.CourseListCreateView.as_view(), name='course-list'),
    path('courses/<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('courses/<int:course_id>/enroll/', views.enroll_course, name='enroll-course'),
    path('courses/<int:course_id>/purchase/', views.purchase_course, name='purchase-course'),
    path('companies/', views.CompanyListCreateView.as_view(), name='company-list'),
    path('companies/<int:pk>/', views.CompanyDetailView.as_view(), name='company-detail'),
    path('reviews/', views.add_review, name='add-review'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
]