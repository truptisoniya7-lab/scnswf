from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import User
from .serializers import UserSerializer


@extend_schema(tags=['Auth'])
class CustomTokenObtainPairView(TokenObtainPairView):
    """Obtain JWT access and refresh token pair."""
    pass


@extend_schema(tags=['Auth'])
class CustomTokenRefreshView(TokenRefreshView):
    """Refresh JWT access token."""
    pass


@extend_schema(tags=['Accounts'])
class CurrentUserView(generics.RetrieveAPIView):
    """Get profile of current authenticated user."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response({'data': serializer.data})
