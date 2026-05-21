from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Company
from .serializers import CompanySerializer


class CompanyListAPIView(generics.ListAPIView):
    queryset = Company.objects.all().order_by('name')
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]


class CompanyDetailAPIView(generics.RetrieveAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}