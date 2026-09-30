from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions
from .models import GalleryAlbum, GalleryImage
from .serializers import (
    GalleryAlbumListSerializer,
    GalleryAlbumDetailSerializer,
    GalleryImageSerializer,
)
from apps.core.permissions import ReadOnlyOrAdmin


@extend_schema(tags=['Gallery'])
class GalleryAlbumViewSet(viewsets.ModelViewSet):
    """List and retrieve gallery albums."""
    lookup_field = 'slug'
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return GalleryAlbum.objects.all().prefetch_related('images')
        return GalleryAlbum.objects.filter(status='published').prefetch_related('images')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return GalleryAlbumDetailSerializer
        return GalleryAlbumListSerializer


@extend_schema(tags=['Gallery'])
class GalleryImageViewSet(viewsets.ModelViewSet):
    """View and manage individual images in albums."""
    serializer_class = GalleryImageSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        album_slug = self.kwargs.get('album_slug')
        if album_slug:
            return GalleryImage.objects.filter(album__slug=album_slug).order_by('display_order')
        return GalleryImage.objects.all().order_by('display_order')
