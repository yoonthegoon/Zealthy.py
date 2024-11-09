from django.contrib.auth.models import User
from rest_framework import permissions, viewsets

from .models import OnboardingUser, Page
from .serializers import OnboardingUserSerializer, PageSerializer, UserSerializer


class OnboardingUserViewSet(viewsets.ModelViewSet):
    queryset = OnboardingUser.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = OnboardingUserSerializer


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = PageSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = UserSerializer
