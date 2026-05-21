from django.urls import path
from .views import CompanyListAPIView, CompanyDetailAPIView

urlpatterns = [
    path('companies/', CompanyListAPIView.as_view(), name='company-list'),
    path('companies/<int:pk>/', CompanyDetailAPIView.as_view(), name='company-detail'),
]