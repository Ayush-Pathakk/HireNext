from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AppUserViewSet, CompanyProfileViewSet,
    register_user, login_user, register_company,
    get_company_profile, update_company_profile,
    upload_logo, upload_banner, verify_mobile, verify_email
)

# Router for ViewSets
router = DefaultRouter()
router.register(r'users', AppUserViewSet, basename='user')
router.register(r'companies', CompanyProfileViewSet, basename='company')

urlpatterns = [
    # Authentication endpoints
    path('auth/register', register_user, name='register'),
    path('auth/login', login_user, name='login'),
    path('auth/verify-mobile', verify_mobile, name='verify-mobile'),
    path('auth/verify-email', verify_email, name='verify-email'),
    
    # Company endpoints
    path('company/register', register_company, name='company-register'),
    path('company/profile', get_company_profile, name='company-profile'),
    path('company/profile/update', update_company_profile, name='company-update'),
    path('company/upload-logo', upload_logo, name='upload-logo'),
    path('company/upload-banner', upload_banner, name='upload-banner'),
    
    # Include router URLs
    path('', include(router.urls)),
]