// API Configuration - Single source of truth for all API endpoints
import { getCurrentEnvConfig } from './environment';

// Get current environment configuration
const currentConfig = getCurrentEnvConfig();

// Export the current configuration
export const BASE_URL = currentConfig.API_BASE_URL;
export const UPLOADS_URL = currentConfig.UPLOADS_BASE_URL;

// Endpoint paths
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/profile',
  },
  EXPERTS: {
    REGISTER: '/experts/register',
    LIST: '/experts',
    DETAIL: '/experts',
  }
};

// Helper function to build full URLs
export const buildUrl = (endpoint: string) => `${BASE_URL}${endpoint}`;

// Export commonly used full URLs for reference
export const API_URLS = {
  AUTH: {
    REGISTER: buildUrl(ENDPOINTS.AUTH.REGISTER),
    LOGIN: buildUrl(ENDPOINTS.AUTH.LOGIN),
    FORGOT_PASSWORD: buildUrl(ENDPOINTS.AUTH.FORGOT_PASSWORD),
    SEND_OTP: buildUrl(ENDPOINTS.AUTH.SEND_OTP),
    VERIFY_OTP: buildUrl(ENDPOINTS.AUTH.VERIFY_OTP),
    RESET_PASSWORD: buildUrl(ENDPOINTS.AUTH.RESET_PASSWORD),
    PROFILE: buildUrl(ENDPOINTS.AUTH.PROFILE),
  },
  EXPERTS: {
    REGISTER: buildUrl(ENDPOINTS.EXPERTS.REGISTER),
    LIST: buildUrl(ENDPOINTS.EXPERTS.LIST),
    DETAIL: (id: string) => buildUrl(`${ENDPOINTS.EXPERTS.DETAIL}/${id}`),
  }
};