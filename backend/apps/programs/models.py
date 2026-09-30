from django.db import models
from apps.core.models import TimeStampedModel


class Program(TimeStampedModel):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    )

    slug = models.SlugField(max_length=160, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    summary = models.TextField()
    description = models.TextField()
    problem_addressed = models.TextField(blank=True)
    geographical_coverage = models.TextField(blank=True)
    cover_image_url = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', db_index=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.title


class ProgramService(TimeStampedModel):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon_name = models.CharField(max_length=50, blank=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f"{self.title} ({self.program.title})"
