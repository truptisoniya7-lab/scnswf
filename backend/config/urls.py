"""Root URL configuration for SCNSWF project."""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from apps.core.views import HealthCheckView

urlpatterns = [
    # Health checks (top-level and API-scoped)
    path('health/', HealthCheckView.as_view(), name='root-health-check'),
    path('api/v1/health/', HealthCheckView.as_view(), name='api-health-check'),

    # Django Admin
    path('admin/', admin.site.urls),

    # OpenAPI / Swagger Documentation
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API v1 Domain Endpoints
    path('api/v1/accounts/', include('apps.accounts.urls', namespace='accounts')),
    path('api/v1/programs/', include('apps.programs.urls', namespace='programs')),
    path('api/v1/impact/', include('apps.impact.urls', namespace='impact')),
    path('api/v1/gallery/', include('apps.gallery.urls', namespace='gallery')),
    path('api/v1/events/', include('apps.events.urls', namespace='events')),
    path('api/v1/partners/', include('apps.partners.urls', namespace='partners')),
    path('api/v1/applications/', include('apps.applications.urls', namespace='applications')),
    path('api/v1/contact/', include('apps.contact.urls', namespace='contact')),
    path('api/v1/donations/', include('apps.donations.urls', namespace='donations')),
    path('api/v1/documents/', include('apps.documents.urls', namespace='documents')),
]
