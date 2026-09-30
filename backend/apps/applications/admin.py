from django.contrib import admin
from .models import VolunteerApplication, InternshipApplication, PartnershipRequest


@admin.register(VolunteerApplication)
class VolunteerApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'city', 'status', 'created_at')
    list_filter = ('status', 'city', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'city')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(InternshipApplication)
class InternshipApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'college_university', 'preferred_department', 'status', 'created_at')
    list_filter = ('status', 'preferred_department', 'created_at')
    search_fields = ('full_name', 'email', 'college_university')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PartnershipRequest)
class PartnershipRequestAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'organization_type', 'contact_person', 'email', 'status', 'created_at')
    list_filter = ('status', 'organization_type', 'created_at')
    search_fields = ('organization_name', 'contact_person', 'email')
    readonly_fields = ('created_at', 'updated_at')
