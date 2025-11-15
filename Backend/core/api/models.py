from django.db import models

class AppUser(models.Model):
    """User model for authentication and profile"""
    email = models.EmailField(max_length=255, unique=True)
    password = models.TextField()  # Store hashed password
    full_name = models.CharField(max_length=255)
    signup_type = models.CharField(max_length=1, default='e')  # 'e' for email
    gender = models.CharField(max_length=1)  # 'm', 'f', 'o'
    mobile_no = models.CharField(max_length=20, unique=True)
    is_mobile_verified = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'users'

    def __str__(self):
        return self.email
    
    @property
    def is_authenticated(self):
        return True
    
    @property
    def is_anonymous(self):
        return False

class CompanyProfile(models.Model):
    """Company profile linked to user"""
    owner = models.ForeignKey(AppUser, on_delete=models.CASCADE, db_column='owner_id')
    company_name = models.CharField(max_length=255, db_column='company_name')
    about_company = models.TextField(blank=True, null=True, db_column='about_company')
    organizations_type = models.CharField(max_length=100, blank=True, null=True, db_column='organizations_type')
    industry_type = models.CharField(max_length=100, blank=True, null=True, db_column='industry_type')
    team_size = models.CharField(max_length=50, blank=True, null=True, db_column='team_size')
    year_of_establishment = models.DateField(blank=True, null=True, db_column='year_of_establishment')
    company_website = models.TextField(blank=True, null=True, db_column='company_website')
    company_app_link = models.TextField(blank=True, null=True, db_column='company_app_link')
    company_vision = models.TextField(blank=True, null=True, db_column='company_vision')
    company_logo_url = models.TextField(blank=True, null=True, db_column='company_logo_url')
    company_banner_url = models.TextField(blank=True, null=True, db_column='company_banner_url')
    headquarter_phone_no = models.CharField(max_length=20, blank=True, null=True, db_column='headquarter_phone_no')
    headquarter_mail_id = models.CharField(max_length=255, blank=True, null=True, db_column='headquarter_mail_id')
    social_links = models.JSONField(blank=True, null=True, db_column='social_links')
    map_location_url = models.TextField(blank=True, null=True, db_column='map_location_url')
    careers_link = models.TextField(blank=True, null=True, db_column='careers_link')
    is_claimed = models.BooleanField(default=False, db_column='is_claimed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'company_profile'

    def __str__(self):
        return self.company_name