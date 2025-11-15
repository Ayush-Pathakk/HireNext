import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyProfile } from '../api/apiService';
import { logout } from '../store/authSlice';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await getCompanyProfile(token);
      if (response.success) {
        setCompany(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch company');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!company) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="brand">HireNext.</h1>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
        <div className="no-company">
          <p>No company profile found</p>
          <button onClick={() => navigate('/company-registration')} className="btn-primary">
            Register Company
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="brand">HireNext.</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="company-banner">
          {company.company_banner_url && (
            <img src={company.company_banner_url} alt="Banner" />
          )}
        </div>

        <div className="company-header">
          {company.company_logo_url && (
            <img src={company.company_logo_url} alt="Logo" className="company-logo" />
          )}
          <div>
            <h2>{company.company_name}</h2>
            <p>{company.industry_type}</p>
          </div>
        </div>

        <div className="company-details">
          <div className="detail-section">
            <h3>About</h3>
            <p>{company.about_company || 'No description provided'}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <label>Organization Type:</label>
              <span>{company.organizations_type || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Team Size:</label>
              <span>{company.team_size || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Website:</label>
              <span>{company.company_website || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{company.headquarter_mail_id || 'N/A'}</span>
            </div>
          </div>

          {company.social_links && (
            <div className="detail-section">
              <h3>Social Media</h3>
              <div className="social-links">
                {company.social_links.linkedin && <a href={company.social_links.linkedin} target="_blank">LinkedIn</a>}
                {company.social_links.facebook && <a href={company.social_links.facebook} target="_blank">Facebook</a>}
                {company.social_links.twitter && <a href={company.social_links.twitter} target="_blank">Twitter</a>}
                {company.social_links.instagram && <a href={company.social_links.instagram} target="_blank">Instagram</a>}
                {company.social_links.youtube && <a href={company.social_links.youtube} target="_blank">YouTube</a>}
              </div>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/company-registration')} className="btn-edit">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Dashboard;