from django.contrib import admin
from .models import AnnualReport, Document


@admin.register(AnnualReport)
class AnnualReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'fiscal_year', 'published_date', 'display_order', 'created_at')
    list_filter = ('fiscal_year', 'published_date')
    search_fields = ('title', 'fiscal_year', 'description')


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_public', 'display_order', 'created_at')
    list_filter = ('category', 'is_public')
    search_fields = ('title', 'description')
