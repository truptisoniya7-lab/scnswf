from django.db import models
from apps.core.models import TimeStampedModel


class AnnualReport(TimeStampedModel):
    fiscal_year = models.CharField(max_length=20, unique=True, db_index=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file_url = models.TextField()
    file_size_bytes = models.BigIntegerField(default=0)
    cover_image_url = models.TextField(blank=True)
    published_date = models.DateField()
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', '-published_date']

    def __str__(self):
        return f"{self.title} ({self.fiscal_year})"


class Document(TimeStampedModel):
    CATEGORY_CHOICES = (
        ('policy', 'Policy'),
        ('financial', 'Financial Audit'),
        ('registration', 'Registration & 12A/80G'),
        ('csr', 'CSR Document'),
        ('other', 'Other'),
    )

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='policy')
    description = models.TextField(blank=True)
    file_url = models.TextField()
    file_size_bytes = models.BigIntegerField(default=0)
    is_public = models.BooleanField(default=True, db_index=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"{self.title} [{self.category}]"
