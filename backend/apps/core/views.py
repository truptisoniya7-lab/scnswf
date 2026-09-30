from django.db import connection
from django.utils import timezone
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthCheckView(APIView):
    """
    Health check endpoint to verify backend service status and database connectivity.
    """
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Service Health Check",
        description="Returns system status, current server time, and database connectivity state.",
        responses={
            200: inline_serializer(
                name='HealthCheckResponse',
                fields={
                    'status': serializers.CharField(),
                    'timestamp': serializers.DateTimeField(),
                    'version': serializers.CharField(),
                    'database': serializers.CharField(),
                }
            )
        }
    )
    def get(self, request, *args, **kwargs):
        db_status = "connected"
        http_status = status.HTTP_200_OK

        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                row = cursor.fetchone()
                if not row or row[0] != 1:
                    db_status = "unavailable"
                    http_status = status.HTTP_503_SERVICE_UNAVAILABLE
        except Exception as e:
            db_status = f"disconnected: {str(e)}"
            http_status = status.HTTP_503_SERVICE_UNAVAILABLE

        payload = {
            "status": "healthy" if http_status == status.HTTP_200_OK else "degraded",
            "timestamp": timezone.now().isoformat(),
            "version": "1.0.0",
            "database": db_status
        }
        return Response(payload, status=http_status)
