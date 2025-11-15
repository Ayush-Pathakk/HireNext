import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companyData: {
    company_name: '',
    about_company: '',
    company_logo_url: '',
    company_banner_url: '',
    organizations_type: '',
    industry_type: '',
    team_size: '',
    year_of_establishment: '',
    company_website: '',
    company_vision: '',
    careers_link: '',
    social_links: {
      linkedin: '',
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
    headquarter_phone_no: '',
    headquarter_mail_id: '',
    map_location_url: ''
  },
  loading: false,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    updateCompanyData: (state, action) => {
      state.companyData = { ...state.companyData, ...action.payload };
    },
    resetCompanyData: (state) => {
      state.companyData = initialState.companyData;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { updateCompanyData, resetCompanyData, setLoading } = companySlice.actions;
export default companySlice.reducer;