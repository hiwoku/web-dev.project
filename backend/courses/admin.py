from django.contrib import admin
from .models import Course, Video, Review, Category, Enrollment

admin.site.register(Course)
admin.site.register(Video)
admin.site.register(Review)
admin.site.register(Category)
admin.site.register(Enrollment)