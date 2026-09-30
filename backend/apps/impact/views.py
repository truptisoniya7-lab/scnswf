from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions
from .models import ImpactMetric, ImpactStory
from .serializers import ImpactMetricSerializer, ImpactStoryListSerializer, ImpactStoryDetailSerializer
from apps.core.permissions import ReadOnlyOrAdmin


@extend_schema(tags=['Impact'])
class ImpactMetricViewSet(viewsets.ModelViewSet):
    """List public impact metrics; managed by admins."""
    serializer_class = ImpactMetricSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        return ImpactMetric.objects.all().order_by('display_order')


@extend_schema(tags=['Impact'])
class ImpactStoryViewSet(viewsets.ModelViewSet):
    """List and retrieve impact stories."""
    lookup_field = 'slug'
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return ImpactStory.objects.all().select_related('program')
        return ImpactStory.objects.filter(status='published').select_related('program')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ImpactStoryDetailSerializer
        return ImpactStoryListSerializer
