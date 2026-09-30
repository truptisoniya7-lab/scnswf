from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import ContactMessage, NewsletterSubscriber
from .serializers import ContactMessageSerializer, NewsletterSubscriberSerializer


class ContactPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return bool(request.user and request.user.is_staff)


@extend_schema(tags=['Contact'])
class ContactMessageViewSet(viewsets.ModelViewSet):
    """Submit inquiries and manage inbox for staff."""
    queryset = ContactMessage.objects.filter(is_deleted=False)
    serializer_class = ContactMessageSerializer
    permission_classes = [ContactPermission]

    def perform_create(self, serializer):
        instance = serializer.save()
        if instance.is_newsletter_opt_in and instance.email:
            NewsletterSubscriber.objects.get_or_create(
                email=instance.email,
                defaults={'source': 'contact_form'}
            )


@extend_schema(tags=['Contact'])
class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    """Subscribe to the foundation newsletter."""
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [ContactPermission]
