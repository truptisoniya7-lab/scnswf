from django.db import models
from apps.core.models import TimeStampedModel


class Partner(TimeStampedModel):
    PARTNER_TYPE_CHOICES = (
        ('corporate', 'Corporate'),
        ('government', 'Government'),
        ('academic', 'Academic'),
        ('ngo', 'NGO / Community'),
    )

    name = models.CharField(max_length=150)
    partner_type = models.CharField(max_length=50, choices=PARTNER_TYPE_CHOICES, default='corporate')
    logo_url = models.TextField()
    website_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class TeamMember(TimeStampedModel):
    CATEGORY_CHOICES = (
        ('leadership', 'Leadership'),
        ('trustee', 'Board of Trustees'),
        ('advisory', 'Advisory Board'),
        ('staff', 'Core Staff'),
    )

    name = models.CharField(max_length=150)
    role_title = models.CharField(max_length=150)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='leadership')
    bio = models.TextField(blank=True)
    photo_url = models.TextField(blank=True)
    linkedin_url = models.URLField(blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} - {self.role_title}"
