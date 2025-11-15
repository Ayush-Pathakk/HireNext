from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny
import cloudinary
import cloudinary.uploader
from django.contrib.auth.hashers import check_password
from .models import AppUser, CompanyProfile
from .serializers import (
    AppUserSerializer, CompanyProfileSerializer, 
    LoginSerializer, CompanyRegistrationSerializer
)
import jwt
from datetime import datetime, timedelta
from django.conf import settings

# JWT Token Generation
def generate_jwt_token(user):
    """Generate JWT token with 90-day validity"""
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(days=90),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user"""
    serializer = AppUserSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        token = generate_jwt_token(user)
        
        return Response({
            'success': True,
            'message': 'User registered successfully. Please verify mobile OTP.',
            'data': {
                'user_id': user.id,
                'email': user.email,
                'token': token
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'message': 'Registration failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """User login endpoint"""
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid input',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    try:
        user = AppUser.objects.get(email=email)
        
        if check_password(password, user.password):
            token = generate_jwt_token(user)
            
            return Response({
                'success': True,
                'message': 'Login successful',
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                    'full_name': user.full_name,
                    'token': token
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except AppUser.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_company(request):
    """Register company for authenticated user"""
    serializer = CompanyRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        # Get user from JWT token (you'll need to extract from request.user)
        user = request.user
        
        # Create company with owner
        company = serializer.save(owner=user)

        response_serializer = CompanyRegistrationSerializer(company)
        
        return Response({
            'success': True,
            'message': 'Company registered successfully',
            'data': response_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'message': 'Company registration failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_profile(request):
    """Get company profile for authenticated user"""
    try:
        user = request.user
        # Get the latest company profile for this user
        company = CompanyProfile.objects.filter(owner=user).order_by('-created_at').first()
        
        if not company:
            return Response({
                'success': False,
                'message': 'Company profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CompanyRegistrationSerializer(company)  # Use CompanyRegistrationSerializer
        
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_company_profile(request):
    """Update company profile for authenticated user"""
    try:
        user = request.user
        # Get the latest company profile for this user
        company = CompanyProfile.objects.filter(owner=user).order_by('-created_at').first()
        
        if not company:
            return Response({
                'success': False,
                'message': 'Company profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CompanyRegistrationSerializer(company, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            # Use same serializer for response
            response_serializer = CompanyRegistrationSerializer(company)
            
            return Response({
                'success': True,
                'message': 'Company profile updated successfully',
                'data': response_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'Update failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ViewSets for admin/browsing
class AppUserViewSet(viewsets.ModelViewSet):
    """ViewSet for user CRUD operations"""
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer
    permission_classes = [AllowAny]  # Change to IsAuthenticated in production


class CompanyProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for company CRUD operations"""
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanyProfileSerializer
    permission_classes = [AllowAny]  # Change to IsAuthenticated in production

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_logo(request):
    """Upload company logo to Cloudinary"""
    try:
        user = request.user
        company = CompanyProfile.objects.filter(owner=user).order_by('-created_at').first()
        
        if not company:
            return Response({
                'success': False,
                'message': 'Company profile not found. Please register company first.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get uploaded file
        if 'logo' not in request.FILES:
            return Response({
                'success': False,
                'message': 'No logo file provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        logo_file = request.FILES['logo']
        
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            logo_file,
            folder='company_logos',
            resource_type='image'
        )
        
        # Update company logo URL
        company.company_logo_url = upload_result['secure_url']
        company.save()
        
        return Response({
            'success': True,
            'message': 'Logo uploaded successfully',
            'data': {
                'logo_url': upload_result['secure_url']
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Upload failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_banner(request):
    """Upload company banner to Cloudinary"""
    try:
        user = request.user
        company = CompanyProfile.objects.filter(owner=user).order_by('-created_at').first()
        
        if not company:
            return Response({
                'success': False,
                'message': 'Company profile not found. Please register company first.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get uploaded file
        if 'banner' not in request.FILES:
            return Response({
                'success': False,
                'message': 'No banner file provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        banner_file = request.FILES['banner']
        
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            banner_file,
            folder='company_banners',
            resource_type='image'
        )
        
        # Update company banner URL
        company.company_banner_url = upload_result['secure_url']
        company.save()
        
        return Response({
            'success': True,
            'message': 'Banner uploaded successfully',
            'data': {
                'banner_url': upload_result['secure_url']
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Upload failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['POST'])
def verify_mobile(request):
    """Verify mobile OTP (placeholder - Firebase integration pending)"""
    return Response({
        'success': True,
        'message': 'Mobile verification endpoint ready. Firebase SMS OTP integration pending.'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def verify_email(request):
    """Verify email link (placeholder - Firebase integration pending)"""
    return Response({
        'success': True,
        'message': 'Email verification endpoint ready. Firebase email verification integration pending.'
    }, status=status.HTTP_200_OK)