from django.contrib.auth.models import User
from rest_framework import serializers
from courses.models import Enrollment, Course


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=['personal', 'company'])

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
            'password_confirm',
            'user_type',
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})

        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Username already exists.'})

        if data.get('email') and User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email already exists.'})

        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')

        user_type = validated_data.pop('user_type')
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        user.profile.user_type = user_type
        user.profile.save()

        return user


class CourseCardSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    instructor_name = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'price',
            'level',
            'category_name',
            'company_name',
            'instructor_name',
            'is_enrolled',
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_company_name(self, obj):
        return obj.company.name if obj.company else None

    def get_instructor_name(self, obj):
        return obj.instructor or 'Instructor'

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return Enrollment.objects.filter(user=request.user, course=obj).exists()


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()
    enrolled_courses = serializers.SerializerMethodField()
    cart_courses = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'full_name',
            'email',
            'user_type',
            'enrolled_courses',
            'cart_courses',
        ]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_user_type(self, obj):
        return obj.profile.user_type if hasattr(obj, 'profile') else 'personal'

    def get_enrolled_courses(self, obj):
        courses = [
            enrollment.course
            for enrollment in Enrollment.objects.filter(user=obj).select_related(
                'course',
                'course__category',
                'course__company'
            )
        ]
        return CourseCardSerializer(
            courses,
            many=True,
            context=self.context
        ).data

    def get_cart_courses(self, obj):
        courses = obj.profile.wishlist_courses.select_related('category', 'company').all()
        return CourseCardSerializer(
            courses,
            many=True,
            context=self.context
        ).data


class MyEnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'course_title', 'company_name', 'enrolled_at']

    def get_course_title(self, obj):
        return obj.course.title

    def get_company_name(self, obj):
        return obj.course.company.name if obj.course.company else None