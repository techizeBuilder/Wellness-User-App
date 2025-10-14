import { Platform } from 'react-native';

// Helper to get the correct API URL based on platform
const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.1.4:3001/api'; // Use PC's IP for real device connectivity
  } else if (Platform.OS === 'ios') {
    return 'http://192.168.1.4:3001/api'; // Use PC's IP for real device connectivity
  } else {
    return 'http://192.168.1.4:3001/api'; // Use PC's IP for web/other platforms
  }
};

const getUploadsBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.1.4:3001/uploads'; // Use PC's IP for real device connectivity
  } else if (Platform.OS === 'ios') {
    return 'http://192.168.1.4:3001/uploads'; // Use PC's IP for real device connectivity
  } else {
    return 'http://192.168.1.4:3001/uploads'; // Use PC's IP for web/other platforms
  }
};

interface EnvConfig {
  API_BASE_URL: string;
  UPLOADS_BASE_URL: string;
  DEBUG: boolean;
}

export const ENV_CONFIG = {
  // Current environment - change this to switch environments
  CURRENT_ENV: 'production' as 'development' | 'staging' | 'production',
  
  // Development settings - Dynamic API URL based on platform
  development: {
    API_BASE_URL: getApiBaseUrl(),
    UPLOADS_BASE_URL: getUploadsBaseUrl(),
    DEBUG: true,
  } as EnvConfig,
  
  // Staging settings  
  staging: {
    API_BASE_URL: 'https://staging-api.yourapp.com/api',
    UPLOADS_BASE_URL: 'https://staging-api.yourapp.com/uploads',
    DEBUG: true,
  } as EnvConfig,
  
  // Production settings
  production: {
    API_BASE_URL: 'https://helthbackend.onrender.com/api',
    UPLOADS_BASE_URL: 'https://helthbackend.onrender.com/uploads',
    DEBUG: false,
  } as EnvConfig
};

// Get current environment configuration
export const getCurrentEnvConfig = (): EnvConfig => {
  return ENV_CONFIG[ENV_CONFIG.CURRENT_ENV];
};

// Instructions for changing environment:
// 1. Update ENV_CONFIG.CURRENT_ENV to 'development', 'staging', or 'production'
// 2. Update the respective environment URLs above
// 3. Rebuild the app

console.log(`🌍 App running in ${ENV_CONFIG.CURRENT_ENV} mode`);
console.log(`🔗 API Base URL: ${getCurrentEnvConfig().API_BASE_URL}`);