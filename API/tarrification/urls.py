from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import OpportuniteViewSet

router = DefaultRouter()
router.register(r"opportunites", OpportuniteViewSet, basename="opportunite")

urlpatterns = [
    path("", include(router.urls)),
]
