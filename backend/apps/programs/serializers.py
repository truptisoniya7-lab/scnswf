from rest_framework import serializers
from .models import Program, ProgramService


class ProgramServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramService
        fields = ('id', 'title', 'description', 'icon_name', 'display_order')


class ProgramListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = (
            'id',
            'slug',
            'title',
            'summary',
            'cover_image_url',
            'status',
            'display_order',
            'created_at',
        )


class ProgramDetailSerializer(serializers.ModelSerializer):
    services = ProgramServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Program
        fields = (
            'id',
            'slug',
            'title',
            'summary',
            'description',
            'problem_addressed',
            'geographical_coverage',
            'cover_image_url',
            'status',
            'display_order',
            'services',
            'created_at',
            'updated_at',
        )
