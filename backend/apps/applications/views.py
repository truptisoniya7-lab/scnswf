from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions
from .models import VolunteerApplication, InternshipApplication, PartnershipRequest
from .serializers import (
    VolunteerApplicationSerializer,
    InternshipApplicationSerializer,
    PartnershipRequestSerializer,
)
from apps.core.permissions import IsApplicationsReviewer


class CreateOnlyOrReviewerPermission(permissions.BasePermission):
    """Allows anyone to POST, but only reviewers to GET/PUT/DELETE."""
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_superuser or getattr(request.user, 'role', '') in ['super_admin', 'applications_reviewer'])
        )


@extend_schema(tags=['Applications'])
class VolunteerApplicationViewSet(viewsets.ModelViewSet):
    """Submit and review volunteer applications."""
    queryset = VolunteerApplication.objects.filter(is_deleted=False)
    serializer_class = VolunteerApplicationSerializer
    permission_classes = [CreateOnlyOrReviewerPermission]


@extend_schema(tags=['Applications'])
class InternshipApplicationViewSet(viewsets.ModelViewSet):
    """Submit and review internship applications."""
    queryset = InternshipApplication.objects.filter(is_deleted=False)
    serializer_class = InternshipApplicationSerializer
    permission_classes = [CreateOnlyOrReviewerPermission]


@extend_schema(tags=['Applications'])
class PartnershipRequestViewSet(viewsets.ModelViewSet):
    """Submit and review partnership requests."""
    queryset = PartnershipRequest.objects.filter(is_deleted=False)
    serializer_class = PartnershipRequestSerializer
    permission_classes = [CreateOnlyOrReviewerPermission]
