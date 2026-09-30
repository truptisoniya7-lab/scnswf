from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgramViewSet, ProgramServiceViewSet

app_name = 'programs'

router = DefaultRouter()
router.register(r'', ProgramViewSet, basename='program')

urlpatterns = [
    path('<slug:program_slug>/services/', ProgramServiceViewSet.as_view({'get': 'list'}), name='program-services'),
    path('', include(router.urls)),
]
