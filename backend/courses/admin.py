from django.contrib import admin
from .models import Category, Company, Course, Video, Enrollment, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'average_rating', 'created_at']
    search_fields = ['name']
    filter_horizontal = ['members']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'instructor', 'level', 'price', 'is_free', 'average_rating', 'created_at']
    list_filter = ['level', 'is_free', 'category']
    search_fields = ['title', 'description']

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'is_free_preview']
    list_filter = ['is_free_preview']
    ordering = ['course', 'order']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'enrolled_at', 'completed']
    list_filter = ['completed']
    search_fields = ['user__username', 'course__title']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'review_type', 'course', 'company', 'rating', 'created_at']
    list_filter = ['review_type', 'rating']
    search_fields = ['user__username', 'comment']