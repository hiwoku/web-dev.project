from django.contrib import admin
from .models import UserProfile, Cart

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'balance']
    list_filter = ['role']
    search_fields = ['user__username', 'bio']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'added_at']
    search_fields = ['user__username', 'course__title']