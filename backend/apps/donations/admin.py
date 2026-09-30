from django.contrib import admin
from .models import Donation, DonationTransaction


class DonationTransactionInline(admin.TabularInline):
    model = DonationTransaction
    extra = 0
    readonly_fields = ('gateway_order_id', 'gateway_payment_id', 'status', 'created_at')


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('id', 'donor_name', 'amount', 'currency', 'status', 'receipt_number', 'created_at')
    list_filter = ('status', 'currency', 'created_at')
    search_fields = ('donor_name', 'donor_email', 'receipt_number')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [DonationTransactionInline]


@admin.register(DonationTransaction)
class DonationTransactionAdmin(admin.ModelAdmin):
    list_display = ('gateway_order_id', 'donation', 'gateway_payment_id', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('gateway_order_id', 'gateway_payment_id')
