from django.contrib import admin
from .models import Program, ProgramService


class ProgramServiceInline(admin.TabularInline):
    model = ProgramService
    extra = 1


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'display_order', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'summary', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProgramServiceInline]


@admin.register(ProgramService)
class ProgramServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'program', 'display_order')
    list_filter = ('program',)
    search_fields = ('title', 'description')
