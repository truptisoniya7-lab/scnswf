from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Donation, DonationTransaction
from .serializers import DonationCreateSerializer, DonationTransactionSerializer


@extend_schema(tags=['Donations'])
class DonationViewSet(viewsets.ModelViewSet):
    """Initiate and verify donations."""
    serializer_class = DonationCreateSerializer

    def get_permissions(self):
        if self.action in ['create', 'verify']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        return Donation.objects.filter(is_deleted=False)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def verify(self, request):
        """Webhook/callback endpoint to verify payment transactions."""
        return Response(
            {"status": "received", "message": "Transaction verification stub."},
            status=status.HTTP_200_OK
        )
