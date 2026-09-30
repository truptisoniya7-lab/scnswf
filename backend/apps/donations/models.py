from django.db import models
from apps.core.models import SoftDeleteModel, TimeStampedModel
from apps.programs.models import Program


class Donation(SoftDeleteModel):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    donor_name = models.CharField(max_length=150)
    donor_email = models.EmailField(db_index=True)
    donor_phone = models.CharField(max_length=20, blank=True)
    donor_pan = models.CharField(max_length=20, blank=True)
    is_anonymous = models.BooleanField(default=False)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    program = models.ForeignKey(
        Program,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='donations'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    payment_gateway = models.CharField(max_length=50, default='razorpay')
    receipt_number = models.CharField(max_length=50, blank=True, null=True, unique=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Donation {self.id}: {self.currency} {self.amount} by {self.donor_name} ({self.status})"


class DonationTransaction(TimeStampedModel):
    STATUS_CHOICES = (
        ('initiated', 'Initiated'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    )

    donation = models.ForeignKey(Donation, on_delete=models.CASCADE, related_name='transactions')
    gateway_order_id = models.CharField(max_length=100, db_index=True)
    gateway_payment_id = models.CharField(max_length=100, blank=True, db_index=True)
    gateway_signature = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='initiated')
    raw_response = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Transaction {self.gateway_order_id} ({self.status})"
