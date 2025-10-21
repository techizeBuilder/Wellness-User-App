// API Configuration and Service Layer
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, ENDPOINTS } from '../config/apiConfig';
import { ENV_CONFIG } from '../config/environment';

// API Client Class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    // Try multiple base URLs based on environment
    const isProduction = ENV_CONFIG.CURRENT_ENV === 'production';
    
    const baseUrls = isProduction ? [
      this.baseUrl, // Production URL from config
      'https://apiwellness.shrawantravels.com/api' // Backup production URL
    ] : [
      this.baseUrl,
      'http://192.168.1.3:3001/api', // Your computer's network IP (primary)
      'http://10.0.2.2:3001/api', // Android emulator fallback
      'http://localhost:3001/api', // iOS simulator fallback
      'http://127.0.0.1:3001/api' // Local machine fallback
    ];

    let lastError: Error | null = null;

    for (const baseUrl of baseUrls) {
      try {
        const url = `${baseUrl}${endpoint}`;
        console.log(`🌐 Trying API request to: ${url}`);
        
        const config: RequestInit = {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        };

        // Add auth token if available
        const token = await this.getToken();
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        const response = await fetch(url, config);
        
        if (!response.ok) {
          const data = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ API request successful to: ${url}`);
        return data;
        
      } catch (error) {
        lastError = error as Error;
        console.log(`❌ API request failed for ${baseUrl}${endpoint}:`, error);
        continue;
      }
    }

    console.error('❌ All API endpoints failed. Last error:', lastError);
    throw lastError || new Error('Network request failed - all endpoints unreachable');
  }

  // Token management
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  }

  // Authentication APIs
  async register(userData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    profileImage?: any; // For future image support
  }) {
    // Split fullName into firstName and lastName
    const nameParts = userData.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName; // Use first name as last name if no last name provided
    
    // For now, use JSON registration (image upload can be added later)
    const registrationData = {
      firstName,
      lastName,
      email: userData.email,
      phone: userData.phoneNumber,
      password: userData.password
    };
    
    console.log('Sending registration data:', registrationData);
    
    return this.request(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  private async requestFormData(endpoint: string, options: RequestInit = {}): Promise<any> {
    // Try multiple base URLs based on environment
    const isProduction = ENV_CONFIG.CURRENT_ENV === 'production';
    
    const baseUrls = isProduction ? [
      this.baseUrl, // Production URL from config
      'https://apiwellness.shrawantravels.com/api' // Backup production URL
    ] : [
      this.baseUrl,
      'http://192.168.1.3:3001/api', // Your computer's network IP (primary)
      'http://10.0.2.2:3001/api', // Android emulator fallback
      'http://localhost:3001/api', // iOS simulator fallback
      'http://127.0.0.1:3001/api' // Local machine fallback
    ];

    let lastError: Error | null = null;

    for (const baseUrl of baseUrls) {
      try {
        const url = `${baseUrl}${endpoint}`;
        console.log(`🌐 Trying FormData API request to: ${url}`);
        
        const config: RequestInit = {
          ...options,
          headers: {
            // Don't set Content-Type for FormData - let browser handle it
            ...options.headers,
          },
        };

        // Add auth token if available
        const token = await this.getToken();
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        const response = await fetch(url, config);
        
        if (!response.ok) {
          const data = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ FormData API request successful to: ${url}`);
        return data;
        
      } catch (error) {
        lastError = error as Error;
        console.log(`❌ FormData API request failed for ${baseUrl}${endpoint}:`, error);
        continue;
      }
    }

    console.error('❌ All FormData API endpoints failed. Last error:', lastError);
    throw lastError || new Error('Network request failed - all endpoints unreachable');
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      await this.setToken(response.token);
    }
    
    return response;
  }

  async forgotPassword(email: string) {
    return this.request(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async sendOTP(email: string) {
    return this.request(ENDPOINTS.AUTH.SEND_OTP, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(data: { email: string; otp: string }) {
    return this.request(ENDPOINTS.AUTH.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: { email: string; otp: string; newPassword: string }) {
    return this.request(ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    await this.removeToken();
    return { success: true, message: 'Logged out successfully' };
  }

  // Expert APIs
  async registerExpert(formData: FormData) {
    return this.requestFormData(ENDPOINTS.EXPERTS.REGISTER, {
      method: 'POST',
      body: formData,
    });
  }

  async loginExpert(credentials: { email: string; password: string }) {
    const response = await this.request(ENDPOINTS.EXPERTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data && response.data.token) {
      await this.setToken(response.data.token);
    }
    
    return response;
  }

  async getExpertProfile(expertId: string) {
    return this.request(`${ENDPOINTS.EXPERTS.DETAIL}/${expertId}`);
  }

  async getAllExperts() {
    return this.request(ENDPOINTS.EXPERTS.LIST);
  }

  // User profile APIs
  async getUserProfile() {
    return this.request(ENDPOINTS.AUTH.PROFILE);
  }

  async updateUserProfile(userData: any) {
    return this.request(ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export types for TypeScript
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface ExpertRegistrationData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  profession: string;
  specialization: string;
  experience: number;
  qualifications: string;
  bio: string;
  consultationFee: number;
  availability: string[];
  profileImage?: File;
  documents?: File[];
}

export interface ForgotPasswordData {
  email: string;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

// Error handling utility
export const handleApiError = (error: any): string => {
  console.log('API Error Details:', error);
  
  // Check if it's a validation error with details
  if (error.message && error.message.includes('validation')) {
    return error.message;
  }
  
  // Check for specific error messages
  if (error.message) {
    // Clean up common error messages
    const message = error.message;
    if (message.includes('User with this email already exists')) {
      return 'An account with this email already exists. Please use a different email or try logging in.';
    }
    if (message.includes('User with this phone number already exists')) {
      return 'An account with this phone number already exists. Please use a different number.';
    }
    if (message.includes('Password must contain')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
    }
    if (message.includes('Network request failed')) {
      return 'Network connection failed. Please check your internet connection and try again.';
    }
    return message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Check if it's a fetch error
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network connection failed. Please check your internet connection and try again.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};