from rest_framework import serializers
from .models import ImpactMetric, ImpactStory


class ImpactMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactMetric
        fields = (
            'id',
            'label',
            'value',
            'prefix',
            'suffix',
            'description',
            'icon_name',
            'display_order',
            'is_highlighted',
        )


class ImpactStoryListSerializer(serializers.ModelSerializer):
    program_title = serializers.CharField(source='program.title', read_only=True)

    class Meta:
        model = ImpactStory
        fields = (
            'id',
            'slug',
            'title',
            'beneficiary_name',
            'location',
            'summary',
            'cover_image_url',
            'program_title',
            'published_at',
        )


class ImpactStoryDetailSerializer(serializers.ModelSerializer):
    program_title = serializers.CharField(source='program.title', read_only=True)

    class Meta:
        model = ImpactStory
        fields = (
            'id',
            'slug',
            'title',
            'beneficiary_name',
            'location',
            'summary',
            'full_story',
            'quote',
            'cover_image_url',
            'program',
            'program_title',
            'status',
            'published_at',
            'created_at',
            'updated_at',
        )
