from django.db import models
from apps.core.models import TimeStampedModel


class Event(TimeStampedModel):
    STATUS_CHOICES = (
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    slug = models.SlugField(max_length=160, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    start_date = models.DateTimeField(db_index=True)
    end_date = models.DateTimeField(null=True, blank=True)
    cover_image_url = models.TextField(blank=True)
    registration_link = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming', db_index=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return self.title
