from django.contrib import admin
from .models import Partner, TeamMember


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'partner_type', 'display_order', 'is_active', 'created_at')
    list_filter = ('partner_type', 'is_active')
    search_fields = ('name', 'description')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role_title', 'category', 'display_order', 'is_active', 'created_at')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'role_title', 'bio')
