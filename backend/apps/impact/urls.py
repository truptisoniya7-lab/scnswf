from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ImpactMetricViewSet, ImpactStoryViewSet

app_name = 'impact'

router = DefaultRouter()
router.register(r'metrics', ImpactMetricViewSet, basename='impact-metric')
router.register(r'stories', ImpactStoryViewSet, basename='impact-story')

urlpatterns = [
    path('', include(router.urls)),
]
