import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TabNavigation from '../components/TabNavigation';
import FileUpload from '../components/FileUpload';
import FormInput from '../components/FormInput';
import FormTextarea from '../components/FormTextarea';
import FormSelect from '../components/FormSelect';
import { registerCompany, uploadLogo, uploadBanner } from '../api/apiService';
import { updateCompanyData } from '../store/companySlice';
import './CompanyRegistration.css';

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Step 1: Company Info
    company_name: '',
    about_company: '',
    company_logo_url: '',
    company_banner_url: '',
    logoFile: null,      // ← ADD THIS
    bannerFile: null,     
    
    // Step 2: Founding Info
    organizations_type: '',
    industry_type: '',
    team_size: '',
    year_of_establishment: '',
    company_website: '',
    company_vision: '',
    careers_link: '',
    
    // Step 3: Social Media
    social_links: {
      linkedin: '',
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
    
    // Step 4: Contact
    headquarter_phone_no: '',
    headquarter_mail_id: '',
    map_location_url: ''
  });

  useEffect(() => {
  // Fetch existing company data if editing
  const fetchExistingCompany = async () => {
    try {
      const response = await getCompanyProfile(token);
      if (response.success && response.data) {
        setFormData({
          company_name: response.data.company_name || '',
          // ... rest of mapping
        });
      }
    } catch (err) {
      console.log('No existing company found, starting fresh');
    }
  };

  fetchExistingCompany();
}, [token]);

  const steps = [
    { label: 'Company Info', icon: '🏢' },
    { label: 'Founding Info', icon: '📋' },
    { label: 'Social Media Profile', icon: '🌐' },
    { label: 'Contact', icon: '📞' }
  ];

  const industryOptions = [
    'Fintech',
    'Engineering',
    'Software & IT',
    'Edtech',
    'Oil & Gas',
    'Healthcare',
    'E-commerce',
    'Manufacturing',
    'Other'
  ];

  const organizationTypes = [
    'Private Limited',
    'Public Limited',
    'Startup',
    'Non-Profit',
    'Government',
    'Partnership',
    'Sole Proprietorship'
  ];

  const teamSizes = [
    '1-10',
    '10-50',
    '50-100',
    '100-500',
    '500-1000',
    '1000+'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleLogoUpload = async (file) => {
  // Just store the file, don't upload yet
  setFormData(prev => ({
    ...prev,
    logoFile: file  // Store file temporarily
  }));
};

const handleBannerUpload = async (file) => {
  // Just store the file, don't upload yet
  setFormData(prev => ({
    ...prev,
    bannerFile: file  // Store file temporarily
  }));
};

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
  setLoading(true);
  setError('');

  try {
    // Check if company exists (editing mode)
    let response;
    try {
      const existing = await getCompanyProfile(token);
      if (existing.success && existing.data) {
        // Update existing company
        response = await updateCompanyProfile(formData, token);
      }
    } catch {
      // Create new company
      response = await registerCompany(formData, token);
    }
    
    if (response.success) {
      // Upload images if provided
      if (formData.logoFile) {
        const logoFormData = new FormData();
        logoFormData.append('logo', formData.logoFile);
        await uploadLogo(logoFormData, token);
      }
      
      if (formData.bannerFile) {
        const bannerFormData = new FormData();
        bannerFormData.append('banner', formData.bannerFile);
        await uploadBanner(bannerFormData, token);
      }
      
      dispatch(updateCompanyData(formData));
      alert('Company saved successfully!');
      navigate('/dashboard');
    } else {
      setError(response.message || 'Save failed');
    }
  } catch (err) {
    setError('Failed to save company');
  } finally {
    setLoading(false);
  }
};

  const getProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  return (
    <div className="company-registration">
      <div className="registration-header">
        <h1 className="brand">HireNext.</h1>
        <div className="progress-indicator">
          <span className="progress-text">Setup Progress</span>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${getProgress()}%` }}></div>
          </div>
          <span className="progress-percentage">{Math.round(getProgress())}% Completed</span>
        </div>
      </div>

      <div className="registration-content">
        <TabNavigation 
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          steps={steps}
        />

        {error && <div className="error-message">{error}</div>}

        <div className="form-container">
          {/* STEP 1: Company Info */}
          {currentStep === 0 && (
            <div className="form-step">
              <h2 className="step-title">Logo & Banner Image</h2>
              
              <div className="upload-row">
                <FileUpload
                  label="Upload Logo"
                  onUpload={handleLogoUpload}
                  currentImage={formData.company_logo_url}
                  type="logo"
                />
                
                <FileUpload
                  label="Banner Image"
                  onUpload={handleBannerUpload}
                  currentImage={formData.company_banner_url}
                  type="banner"
                />
              </div>

              <FormInput
                label="Company name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Enter your company name"
                required
              />

              <FormTextarea
                label="About Us"
                name="about_company"
                value={formData.about_company}
                onChange={handleChange}
                placeholder="Write down about your company here. Let the candidate know who we are..."
                rows={6}
              />
            </div>
          )}

          {/* STEP 2: Founding Info */}
          {currentStep === 1 && (
            <div className="form-step">
              <FormSelect
                label="Organization Type"
                name="organizations_type"
                value={formData.organizations_type}
                onChange={handleChange}
                options={organizationTypes}
                placeholder="Private Limited"
              />

              <FormSelect
                label="Industry Types"
                name="industry_type"
                value={formData.industry_type}
                onChange={handleChange}
                options={industryOptions}
                placeholder="Select"
              />

              <FormSelect
                label="Team Size"
                name="team_size"
                value={formData.team_size}
                onChange={handleChange}
                options={teamSizes}
                placeholder="Select team size"
              />

              <FormInput
                label="Year of Establishment"
                name="year_of_establishment"
                type="date"
                value={formData.year_of_establishment}
                onChange={handleChange}
              />

              <FormInput
                label="Company Website"
                name="company_website"
                type="url"
                value={formData.company_website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
              />

              <FormInput
                label="Official Careers Link"
                name="careers_link"
                type="url"
                value={formData.careers_link}
                onChange={handleChange}
                placeholder="https://yourcompany.com/careers"
              />

              <FormTextarea
                label="Company Vision"
                name="company_vision"
                value={formData.company_vision}
                onChange={handleChange}
                placeholder="Tell us about your company vision..."
                rows={4}
              />
            </div>
          )}

          {/* STEP 3: Social Media */}
          {currentStep === 2 && (
            <div className="form-step">
              <div className="social-input">
                <div className="social-icon">in</div>
                <input
                  type="url"
                  placeholder="linkedin.com/username"
                  value={formData.social_links.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                />
                {formData.social_links.linkedin && (
                  <button 
                    className="remove-btn"
                    onClick={() => handleSocialChange('linkedin', '')}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="social-input">
                <div className="social-icon">f</div>
                <input
                  type="url"
                  placeholder="facebook.com/username"
                  value={formData.social_links.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                />
                {formData.social_links.facebook && (
                  <button 
                    className="remove-btn"
                    onClick={() => handleSocialChange('facebook', '')}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="social-input">
                <div className="social-icon">𝕏</div>
                <input
                  type="url"
                  placeholder="twitter.com/username"
                  value={formData.social_links.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                />
                {formData.social_links.twitter && (
                  <button 
                    className="remove-btn"
                    onClick={() => handleSocialChange('twitter', '')}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="social-input">
                <div className="social-icon">📷</div>
                <input
                  type="url"
                  placeholder="instagram.com/username"
                  value={formData.social_links.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                />
                {formData.social_links.instagram && (
                  <button 
                    className="remove-btn"
                    onClick={() => handleSocialChange('instagram', '')}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="social-input">
                <div className="social-icon">▶</div>
                <input
                  type="url"
                  placeholder="youtube.com/username"
                  value={formData.social_links.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                />
                {formData.social_links.youtube && (
                  <button 
                    className="remove-btn"
                    onClick={() => handleSocialChange('youtube', '')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Contact */}
          {currentStep === 3 && (
            <div className="form-step">
              <FormInput
                label="Headquarter Phone Number"
                name="headquarter_phone_no"
                type="tel"
                value={formData.headquarter_phone_no}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />

              <FormInput
                label="Headquarter Email"
                name="headquarter_mail_id"
                type="email"
                value={formData.headquarter_mail_id}
                onChange={handleChange}
                placeholder="contact@company.com"
              />

              <FormInput
                label="Map Location URL"
                name="map_location_url"
                type="url"
                value={formData.map_location_url}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          {currentStep > 0 && (
            <button className="btn-secondary" onClick={handlePrevious}>
              Previous
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button className="btn-primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;