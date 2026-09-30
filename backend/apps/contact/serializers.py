from rest_framework import serializers
from .models import ContactMessage, NewsletterSubscriber


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = (
            'id',
            'name',
            'email',
            'phone',
            'subject',
            'message',
            'is_newsletter_opt_in',
            'status',
            'created_at',
        )
        read_only_fields = ('id', 'status', 'created_at')


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ('id', 'email', 'source', 'created_at')
        read_only_fields = ('id', 'created_at')
