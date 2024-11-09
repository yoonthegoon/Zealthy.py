from django.contrib.auth.models import User
from rest_framework import serializers

from .models import OnboardingUser, Page


class OnboardingUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = OnboardingUser
        exclude = ["user"]


class PageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Page
        fields = "__all__"


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        exclude = ["password", "user_permissions"]