from django.db import models
from apps.core.models import TimeStampedModel
from apps.programs.models import Program


class ImpactMetric(TimeStampedModel):
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50)
    prefix = models.CharField(max_length=10, blank=True)
    suffix = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, blank=True)
    display_order = models.IntegerField(default=0)
    is_highlighted = models.BooleanField(default=False)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"{self.prefix}{self.value}{self.suffix} - {self.label}"


class ImpactStory(TimeStampedModel):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    )

    slug = models.SlugField(max_length=160, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    beneficiary_name = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    summary = models.TextField()
    full_story = models.TextField()
    quote = models.TextField(blank=True)
    cover_image_url = models.TextField(blank=True)
    program = models.ForeignKey(
        Program,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='impact_stories'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', db_index=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Impact Stories'
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title
