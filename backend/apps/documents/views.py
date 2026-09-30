from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from .models import AnnualReport, Document
from .serializers import AnnualReportSerializer, DocumentSerializer
from apps.core.permissions import ReadOnlyOrAdmin


@extend_schema(tags=['Documents'])
class AnnualReportViewSet(viewsets.ModelViewSet):
    """List and access organization annual reports."""
    serializer_class = AnnualReportSerializer
    permission_classes = [ReadOnlyOrAdmin]
    queryset = AnnualReport.objects.all().order_by('display_order', '-published_date')


@extend_schema(tags=['Documents'])
class DocumentViewSet(viewsets.ModelViewSet):
    """List public compliance, registration, and policy documents."""
    serializer_class = DocumentSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return Document.objects.all().order_by('display_order', '-created_at')
        return Document.objects.filter(is_public=True).order_by('display_order', '-created_at')
