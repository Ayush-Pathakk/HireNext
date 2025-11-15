import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import companyReducer from './companySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
  },
});

export default store;