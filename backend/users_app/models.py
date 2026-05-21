from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    USER_TYPE_CHOICES = [
        ('personal', 'Personal'),
        ('company', 'Company'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='personal')
    wishlist_courses = models.ManyToManyField(
        'courses.Course',
        blank=True,
        related_name='wishlisted_by'
    )

    def __str__(self):
        return f'{self.user.username} - {self.user_type}'