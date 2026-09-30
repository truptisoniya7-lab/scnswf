from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from .models import Event
from .serializers import EventSerializer
from apps.core.permissions import ReadOnlyOrAdmin


@extend_schema(tags=['Events'])
class EventViewSet(viewsets.ModelViewSet):
    """List and manage community events."""
    lookup_field = 'slug'
    serializer_class = EventSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return Event.objects.all()
        return Event.objects.exclude(status='cancelled')
