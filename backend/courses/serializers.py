from rest_framework import serializers
from .models import Course, Enrollment, Category, Video, Review


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_url', 'order', 'is_free_preview']


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'rating', 'comment', 'created_at', 'review_type']

    def get_username(self, obj):
        return obj.user.username if obj.user else 'Unknown'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class CourseSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    is_in_cart = serializers.SerializerMethodField()
    videos = VideoSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    short_description = serializers.SerializerMethodField()
    is_free = serializers.SerializerMethodField()
    duration_hours = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()
    instructor_name = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'short_description',
            'price',
            'is_free',
            'category',
            'category_name',
            'company',
            'company_name',
            'level',
            'duration_hours',
            'skills',
            'thumbnail',
            'average_rating',
            'videos',
            'reviews',
            'is_enrolled',
            'is_in_cart',
            'created_at',
            'instructor_name',
        ]
        read_only_fields = ['created_at']

    def get_thumbnail(self, obj):
        request = self.context.get('request')
        if obj.thumbnail:
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_company_name(self, obj):
        return obj.company.name if obj.company else None

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return Enrollment.objects.filter(user=request.user, course=obj).exists()

    def get_is_in_cart(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        if not hasattr(request.user, 'profile'):
            return False
        return request.user.profile.wishlist_courses.filter(id=obj.id).exists()

    def get_short_description(self, obj):
        if obj.description:
            return obj.description[:120]
        return ''

    def get_is_free(self, obj):
        return float(obj.price) == 0

    def get_duration_hours(self, obj):
        return 0

    def get_skills(self, obj):
        return []

    def get_instructor_name(self, obj):
        return obj.instructor or 'Unknown instructor'


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'course_title', 'enrolled_at']
        read_only_fields = ['user', 'enrolled_at']

    def get_course_title(self, obj):
        return obj.course.title


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['course', 'company', 'rating', 'comment', 'review_type']