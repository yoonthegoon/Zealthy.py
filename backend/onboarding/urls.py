from django.urls import include, path
from rest_framework import routers

from .views import OnboardingUserViewSet, PageViewSet, UserViewSet

router = routers.DefaultRouter()
router.register("auth-users", UserViewSet)
router.register("users", OnboardingUserViewSet)
router.register("pages", PageViewSet)

urlpatterns = [path("", include(router.urls))]
