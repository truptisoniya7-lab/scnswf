from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'entity_type', 'entity_id', 'user', 'created_at')
    list_filter = ('action', 'entity_type', 'created_at')
    search_fields = ('entity_id', 'entity_type', 'action')
    readonly_fields = ('id', 'user', 'action', 'entity_type', 'entity_id', 'changes', 'ip_address', 'created_at', 'updated_at')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
