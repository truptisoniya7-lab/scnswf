from django.db import models
from apps.core.models import TimeStampedModel


class GalleryAlbum(TimeStampedModel):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    )

    slug = models.SlugField(max_length=160, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cover_image_url = models.TextField(blank=True)
    event_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', db_index=True)

    class Meta:
        ordering = ['-event_date', '-created_at']

    def __str__(self):
        return self.title


class GalleryImage(TimeStampedModel):
    album = models.ForeignKey(GalleryAlbum, on_delete=models.CASCADE, related_name='images')
    image_url = models.TextField()
    caption = models.CharField(max_length=255, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.caption or f"Image {self.id} for {self.album.title}"
