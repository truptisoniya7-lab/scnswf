from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = (
            'id',
            'slug',
            'title',
            'description',
            'location',
            'start_date',
            'end_date',
            'cover_image_url',
            'registration_link',
            'status',
            'created_at',
            'updated_at',
        )
