from rest_framework import serializers
from .models import AnnualReport, Document


class AnnualReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnualReport
        fields = (
            'id',
            'fiscal_year',
            'title',
            'description',
            'file_url',
            'file_size_bytes',
            'cover_image_url',
            'published_date',
            'display_order',
            'created_at',
        )


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = (
            'id',
            'title',
            'category',
            'description',
            'file_url',
            'file_size_bytes',
            'is_public',
            'display_order',
            'created_at',
        )
