from rest_framework import serializers
from .models import Course, Company, Review, Enrollment, Video, Category
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_url', 'video_file', 'order', 'is_free_preview']

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'rating', 'comment', 'created_at', 'review_type']
        read_only_fields = ['user']

    def get_username(self, obj):
        return obj.user.username

class CourseSerializer(serializers.ModelSerializer):
    average_rating = serializers.ReadOnlyField()
    category_name = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    videos = VideoSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id','title','description','short_description','price','is_free',
            'category','category_name','company','company_name','level',
            'duration_hours','skills','thumbnail','average_rating',
            'videos','reviews','is_enrolled','created_at'
        ]
        read_only_fields = ['instructor']

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_company_name(self, obj):
        return obj.company.name if obj.company else None

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(user=request.user).exists()
        return False

class CompanySerializer(serializers.ModelSerializer):
    average_rating = serializers.ReadOnlyField()
    courses_count = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Company
        fields = ['id','name','description','logo','website','average_rating','courses_count','reviews','created_at']
        read_only_fields = ['owner']

    def get_courses_count(self, obj):
        return obj.courses.count()

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id','user','course','enrolled_at','completed']
        read_only_fields = ['user']