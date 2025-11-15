from rest_framework import serializers
from .models import AppUser, CompanyProfile
from django.contrib.auth.hashers import make_password

class AppUserSerializer(serializers.ModelSerializer):
    """Serializer for user registration and profile"""
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = AppUser
        fields = [
            'id', 'email', 'password', 'full_name', 'signup_type',
            'gender', 'mobile_no', 'is_mobile_verified', 
            'is_email_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_mobile_verified', 'is_email_verified']
    
    def create(self, validated_data):
        """Hash password before saving"""
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class CompanyProfileSerializer(serializers.ModelSerializer):
    """Serializer for company profile"""
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)
    
    class Meta:
        model = CompanyProfile
        fields = [
            'id', 'owner', 'owner_email', 'owner_name', 'company_name',
            'address', 'city', 'state', 'country', 'postal_code',
            'website', 'logo_url', 'banner_url', 'industry',
            'founded_date', 'description', 'social_links',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CompanyRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for company registration (without owner field in request)"""
    
    class Meta:
        model = CompanyProfile
        fields = [
            'company_name', 'about_company', 'organizations_type', 
            'industry_type', 'team_size', 'year_of_establishment',
            'company_website', 'company_app_link', 'company_vision',
            'company_logo_url', 'company_banner_url', 'headquarter_phone_no',
            'headquarter_mail_id', 'social_links', 'map_location_url', 
            'careers_link'
        ]