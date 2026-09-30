from rest_framework import serializers
from .models import Partner, TeamMember


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = (
            'id',
            'name',
            'partner_type',
            'logo_url',
            'website_url',
            'description',
            'display_order',
            'is_active',
            'created_at',
        )


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = (
            'id',
            'name',
            'role_title',
            'category',
            'bio',
            'photo_url',
            'linkedin_url',
            'display_order',
            'is_active',
            'created_at',
        )
