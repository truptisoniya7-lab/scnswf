from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet, TeamMemberViewSet

app_name = 'partners'

router = DefaultRouter()
router.register(r'partners', PartnerViewSet, basename='partner')
router.register(r'team', TeamMemberViewSet, basename='team-member')

urlpatterns = [
    path('', include(router.urls)),
]
