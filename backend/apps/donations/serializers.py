from rest_framework import serializers
from .models import Donation, DonationTransaction


class DonationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = (
            'id',
            'donor_name',
            'donor_email',
            'donor_phone',
            'donor_pan',
            'is_anonymous',
            'amount',
            'currency',
            'program',
            'status',
            'receipt_number',
            'created_at',
        )
        read_only_fields = ('id', 'status', 'receipt_number', 'created_at')


class DonationTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationTransaction
        fields = (
            'id',
            'donation',
            'gateway_order_id',
            'gateway_payment_id',
            'status',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')
