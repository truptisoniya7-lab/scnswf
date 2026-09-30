from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnnualReportViewSet, DocumentViewSet

app_name = 'documents'

router = DefaultRouter()
router.register(r'annual-reports', AnnualReportViewSet, basename='annual-report')
router.register(r'files', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
]
