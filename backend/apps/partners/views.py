from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from .models import Partner, TeamMember
from .serializers import PartnerSerializer, TeamMemberSerializer
from apps.core.permissions import ReadOnlyOrAdmin


@extend_schema(tags=['Partners'])
class PartnerViewSet(viewsets.ModelViewSet):
    """List partners and supporters."""
    serializer_class = PartnerSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return Partner.objects.all()
        return Partner.objects.filter(is_active=True)


@extend_schema(tags=['Team'])
class TeamMemberViewSet(viewsets.ModelViewSet):
    """List leadership and team members."""
    serializer_class = TeamMemberSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return TeamMember.objects.all()
        return TeamMember.objects.filter(is_active=True)
