from django.conf import settings
from django.db import models
from apps.core.models import SoftDeleteModel, TimeStampedModel


class ContactMessage(SoftDeleteModel):
    STATUS_CHOICES = (
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('archived', 'Archived'),
    )

    name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread', db_index=True)
    is_newsletter_opt_in = models.BooleanField(default=False)
    replied_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replied_contact_messages'
    )
    replied_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} from {self.name} ({self.status})"


class NewsletterSubscriber(TimeStampedModel):
    email = models.EmailField(unique=True, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    source = models.CharField(max_length=50, default='website')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.email
