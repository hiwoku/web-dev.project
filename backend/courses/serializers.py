from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Enrollment, Review, Category


# --- ModelSerializers ---

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'price', 'level',
                  'category', 'category_name', 'instructor', 'instructor_name',
                  'average_rating', 'created_at']
        read_only_fields = ['instructor', 'created_at']

    def get_instructor_name(self, obj):
        return obj.instructor.get_full_name() or obj.instructor.username

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return None
        return round(sum(r.rating for r in reviews) / len(reviews), 1)


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'course_title', 'enrolled_at']
        read_only_fields = ['user', 'enrolled_at']

    def get_course_title(self, obj):
        return obj.course.title


# --- Plain Serializers (non-model) ---

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if not data.get('username') or not data.get('password'):
            raise serializers.ValidationError('Both username and password are required.')
        return data


class ContactFormSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    message = serializers.CharField(max_length=1000)

    def validate_message(self, value):
        if len(value) < 10:
            raise serializers.ValidationError('Message must be at least 10 characters.')
        return value