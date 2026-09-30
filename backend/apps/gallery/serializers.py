from rest_framework import serializers
from .models import GalleryAlbum, GalleryImage


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ('id', 'image_url', 'caption', 'alt_text', 'display_order', 'created_at')


class GalleryAlbumListSerializer(serializers.ModelSerializer):
    image_count = serializers.IntegerField(source='images.count', read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = (
            'id',
            'slug',
            'title',
            'description',
            'cover_image_url',
            'event_date',
            'image_count',
            'created_at',
        )


class GalleryAlbumDetailSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = (
            'id',
            'slug',
            'title',
            'description',
            'cover_image_url',
            'event_date',
            'status',
            'images',
            'created_at',
            'updated_at',
        )
