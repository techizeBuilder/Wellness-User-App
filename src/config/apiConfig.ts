// API Configuration - Single source of truth for all API endpoints
import { BASE_URL, UPLOADS_BASE_URL } from './environment';

// Export the configuration
export const UPLOADS_URL = UPLOADS_BASE_URL;

// Endpoint paths
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    VERIFY_REGISTRATION_OTP: '/auth/verify-registration-otp',
    LOGIN: '/auth/login',
    GOOGLE_MOBILE_LOGIN: '/auth/google/mobile',
    GOOGLE_COMPLETE_ONBOARDING: '/auth/google/complete-onboarding',
    GOOGLE_UPDATE_USER_PROFILE: '/auth/google/update-user-profile',
    GOOGLE_UPDATE_EXPERT_PROFILE: '/auth/google/update-expert-profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
    GET_USER: '/auth/me',
    PROFILE: '/auth/profile',
  },
  EXPERTS: {
    REGISTER: '/experts/register',
    LOGIN: '/experts/login',
    LIST: '/experts',
    DETAIL: '/experts',
    PROFILE: '/experts/me',
    UPDATE_PROFILE: '/experts/profile',
    BANK_ACCOUNT: '/experts/bank-account',
  }
};

// Helper function to build full URLs
export const buildUrl = (endpoint: string) => `${BASE_URL}${endpoint}`;

// Export commonly used full URLs for reference
export const API_URLS = {
  AUTH: {
    REGISTER: buildUrl(ENDPOINTS.AUTH.REGISTER),
    VERIFY_REGISTRATION_OTP: buildUrl(ENDPOINTS.AUTH.VERIFY_REGISTRATION_OTP),
    LOGIN: buildUrl(ENDPOINTS.AUTH.LOGIN),
    GOOGLE_MOBILE_LOGIN: buildUrl(ENDPOINTS.AUTH.GOOGLE_MOBILE_LOGIN),
    GOOGLE_COMPLETE_ONBOARDING: buildUrl(ENDPOINTS.AUTH.GOOGLE_COMPLETE_ONBOARDING),
    GOOGLE_UPDATE_USER_PROFILE: buildUrl(ENDPOINTS.AUTH.GOOGLE_UPDATE_USER_PROFILE),
    GOOGLE_UPDATE_EXPERT_PROFILE: buildUrl(ENDPOINTS.AUTH.GOOGLE_UPDATE_EXPERT_PROFILE),
    FORGOT_PASSWORD: buildUrl(ENDPOINTS.AUTH.FORGOT_PASSWORD),
    SEND_OTP: buildUrl(ENDPOINTS.AUTH.SEND_OTP),
    VERIFY_OTP: buildUrl(ENDPOINTS.AUTH.VERIFY_OTP),
    RESET_PASSWORD: buildUrl(ENDPOINTS.AUTH.RESET_PASSWORD),
    GET_USER: buildUrl(ENDPOINTS.AUTH.GET_USER),
    PROFILE: buildUrl(ENDPOINTS.AUTH.PROFILE),
  },
  EXPERTS: {
    REGISTER: buildUrl(ENDPOINTS.EXPERTS.REGISTER),
    LIST: buildUrl(ENDPOINTS.EXPERTS.LIST),
    DETAIL: (id: string) => buildUrl(`${ENDPOINTS.EXPERTS.DETAIL}/${id}`),
    PROFILE: buildUrl(ENDPOINTS.EXPERTS.PROFILE),
    UPDATE_PROFILE: buildUrl(ENDPOINTS.EXPERTS.UPDATE_PROFILE),
    BANK_ACCOUNT: buildUrl(ENDPOINTS.EXPERTS.BANK_ACCOUNT),
  }
};