import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post('/auth/login', data);
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
};

// Company APIs
export const registerCompany = async (data, token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const response = await api.post('/company/register', data);
  return response.data;
};

export const getCompanyProfile = async (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const response = await api.get('/company/profile');
  return response.data;
};

export const uploadLogo = async (formData, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/company/upload-logo`,  // ← Changed hyphen to underscore
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const uploadBanner = async (formData, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/company/upload-banner`,  // ← Changed hyphen to underscore
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export default api;

export const updateCompanyProfile = async (data, token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const response = await api.put('/company/profile/update', data);
  return response.data;
};