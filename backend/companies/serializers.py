from rest_framework import serializers
from .models import Company
from courses.models import Course


class CompanyCourseSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'price',
            'level',
            'instructor',
            'category_name',
            'thumbnail',
            'created_at',
            'thumbnail',
        ]

    def get_thumbnail(self, obj):
        request = self.context.get('request')
        if obj.thumbnail:
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
    
    def get_category_name(self, obj):
        return obj.category.name if obj.category else None


class CompanySerializer(serializers.ModelSerializer):
    courses = CompanyCourseSerializer(many=True, read_only=True)

    class Meta:
        model = Company
        fields = [
            'id',
            'name',
            'description',
            'city',
            'address',
            'website',
            'email',
            'phone',
            'created_at',
            'logo',
            'courses',
        ]
