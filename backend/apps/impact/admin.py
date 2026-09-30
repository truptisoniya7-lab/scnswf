from django.contrib import admin
from .models import ImpactMetric, ImpactStory


@admin.register(ImpactMetric)
class ImpactMetricAdmin(admin.ModelAdmin):
    list_display = ('label', 'value', 'prefix', 'suffix', 'display_order', 'is_highlighted')
    list_filter = ('is_highlighted',)
    search_fields = ('label', 'description')


@admin.register(ImpactStory)
class ImpactStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'program', 'status', 'published_at')
    list_filter = ('status', 'published_at', 'program')
    search_fields = ('title', 'beneficiary_name', 'summary', 'full_story')
    prepopulated_fields = {'slug': ('title',)}
