from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VolunteerApplicationViewSet,
    InternshipApplicationViewSet,
    PartnershipRequestViewSet,
)

app_name = 'applications'

router = DefaultRouter()
router.register(r'volunteer', VolunteerApplicationViewSet, basename='volunteer-application')
router.register(r'internship', InternshipApplicationViewSet, basename='internship-application')
router.register(r'partnership', PartnershipRequestViewSet, basename='partnership-request')

urlpatterns = [
    path('', include(router.urls)),
]
