from django.contrib import admin
from django.urls import path, include
from courses.views import CategoryListAPIView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('courses.urls')),
    path('api/', include('companies.urls')),
    path('api/', include('users_app.urls')),
    path('api/categories/', CategoryListAPIView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)