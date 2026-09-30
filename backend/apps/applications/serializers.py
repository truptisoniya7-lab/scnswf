from rest_framework import serializers
from .models import VolunteerApplication, InternshipApplication, PartnershipRequest


class VolunteerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerApplication
        fields = (
            'id',
            'full_name',
            'email',
            'phone',
            'city',
            'state',
            'areas_of_interest',
            'availability',
            'prior_experience',
            'status',
            'created_at',
        )
        read_only_fields = ('id', 'status', 'created_at')


class InternshipApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipApplication
        fields = (
            'id',
            'full_name',
            'email',
            'phone',
            'college_university',
            'degree_program',
            'current_year',
            'preferred_department',
            'start_date',
            'duration_weeks',
            'statement_of_purpose',
            'resume_url',
            'status',
            'created_at',
        )
        read_only_fields = ('id', 'status', 'created_at')


class PartnershipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnershipRequest
        fields = (
            'id',
            'organization_name',
            'organization_type',
            'contact_person',
            'designation',
            'email',
            'phone',
            'proposed_collaboration',
            'status',
            'created_at',
        )
        read_only_fields = ('id', 'status', 'created_at')
