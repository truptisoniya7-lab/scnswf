from django.contrib import admin
from .models import GalleryAlbum, GalleryImage


class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 3


@admin.register(GalleryAlbum)
class GalleryAlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'event_date', 'status', 'created_at')
    list_filter = ('status', 'event_date')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [GalleryImageInline]


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'album', 'caption', 'display_order', 'created_at')
    list_filter = ('album',)
    search_fields = ('caption', 'alt_text')
