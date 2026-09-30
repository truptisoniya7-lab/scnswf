from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GalleryAlbumViewSet, GalleryImageViewSet

app_name = 'gallery'

router = DefaultRouter()
router.register(r'albums', GalleryAlbumViewSet, basename='gallery-album')

urlpatterns = [
    path('albums/<slug:album_slug>/images/', GalleryImageViewSet.as_view({'get': 'list', 'post': 'create'}), name='album-images'),
    path('', include(router.urls)),
]
