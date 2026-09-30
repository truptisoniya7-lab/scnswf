from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions
from .models import Program, ProgramService
from .serializers import ProgramListSerializer, ProgramDetailSerializer, ProgramServiceSerializer
from apps.core.permissions import ReadOnlyOrAdmin


@extend_schema(tags=['Programs'])
class ProgramViewSet(viewsets.ModelViewSet):
    """
    Public list/detail of published programs; full management for admins.
    """
    lookup_field = 'slug'
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return Program.objects.all().prefetch_related('services')
        return Program.objects.filter(status='published').prefetch_related('services')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProgramDetailSerializer
        return ProgramListSerializer


@extend_schema(tags=['Programs'])
class ProgramServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public read-only view of program services.
    """
    serializer_class = ProgramServiceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        program_slug = self.kwargs.get('program_slug')
        if program_slug:
            return ProgramService.objects.filter(program__slug=program_slug)
        return ProgramService.objects.all()
