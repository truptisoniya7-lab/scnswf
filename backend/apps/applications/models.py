from django.conf import settings
from django.db import models
from apps.core.models import SoftDeleteModel


class VolunteerApplication(SoftDeleteModel):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )

    full_name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    areas_of_interest = models.JSONField(default=list, blank=True)
    availability = models.CharField(max_length=50)
    prior_experience = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_volunteer_applications'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Volunteer: {self.full_name} ({self.status})"


class InternshipApplication(SoftDeleteModel):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )

    full_name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=20)
    college_university = models.CharField(max_length=200)
    degree_program = models.CharField(max_length=150)
    current_year = models.CharField(max_length=50)
    preferred_department = models.CharField(max_length=100)
    start_date = models.DateField()
    duration_weeks = models.IntegerField()
    statement_of_purpose = models.TextField()
    resume_url = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_internship_applications'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Internship: {self.full_name} ({self.status})"


class PartnershipRequest(SoftDeleteModel):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )

    ORG_TYPE_CHOICES = (
        ('corporate', 'Corporate'),
        ('government', 'Government'),
        ('academic', 'Academic'),
        ('ngo', 'NGO'),
        ('other', 'Other'),
    )

    organization_name = models.CharField(max_length=200)
    organization_type = models.CharField(max_length=50, choices=ORG_TYPE_CHOICES, default='corporate')
    contact_person = models.CharField(max_length=150)
    designation = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=20)
    proposed_collaboration = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_partnership_requests'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Partnership: {self.organization_name} ({self.status})"
