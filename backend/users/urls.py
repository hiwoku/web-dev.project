from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('cart/<int:course_id>/add/', views.add_to_cart, name='cart-add'),
    path('cart/<int:course_id>/remove/', views.remove_from_cart, name='cart-remove'),
]