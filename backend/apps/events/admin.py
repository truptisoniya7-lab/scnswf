from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'start_date', 'status', 'created_at')
    list_filter = ('status', 'start_date')
    search_fields = ('title', 'location', 'description')
    prepopulated_fields = {'slug': ('title',)}
