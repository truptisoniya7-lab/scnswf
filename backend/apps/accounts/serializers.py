from rest_framework import serializers
from .models import User, AdminProfile


class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        fields = ('phone', 'avatar_url', 'created_at', 'updated_at')


class UserSerializer(serializers.ModelSerializer):
    profile = AdminProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'role',
            'is_staff',
            'is_superuser',
            'is_active',
            'profile',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'is_staff', 'is_superuser')
