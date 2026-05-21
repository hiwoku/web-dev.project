from django.urls import path
from .views import (
    register_user,
    login_user,
    logout_user,
    ProfileAPIView,
    MyEnrollmentsAPIView,
    add_to_cart,
    remove_from_cart,
)

urlpatterns = [
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/logout/', logout_user, name='logout'),
    path('auth/profile/', ProfileAPIView.as_view(), name='profile'),
    path('auth/my-courses/', MyEnrollmentsAPIView.as_view(), name='my-courses'),
    path('auth/cart/<int:course_id>/add/', add_to_cart, name='add-to-cart'),
    path('auth/cart/<int:course_id>/remove/', remove_from_cart, name='remove-from-cart'),
]