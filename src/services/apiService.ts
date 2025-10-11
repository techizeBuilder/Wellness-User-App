// API Configuration and Service Layer
import { BASE_URL, ENDPOINTS } from '../config/apiConfig';

// API Client Class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    // Try multiple base URLs for React Native compatibility
    const baseUrls = [
      this.baseUrl,
      'http://localhost:3001/api',
      'http://10.0.2.2:3001/api',
      'http://127.0.0.1:3001/api'
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
        const token = this.getToken();
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
  private getToken(): string | null {
    // For React Native, you might want to use AsyncStorage
    // For now, we'll use a simple variable
    return globalThis.authToken || null;
  }

  setToken(token: string): void {
    globalThis.authToken = token;
  }

  removeToken(): void {
    globalThis.authToken = null;
  }

  // Authentication APIs
  async register(userData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) {
    // Split fullName into firstName and lastName
    const nameParts = userData.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Transform to match backend expectations
    const backendData = {
      firstName,
      lastName,
      email: userData.email,
      phone: userData.phoneNumber,
      password: userData.password
    };
    
    return this.request(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
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
    this.removeToken();
    return { success: true, message: 'Logged out successfully' };
  }

  // Expert APIs
  async registerExpert(formData: FormData) {
    return this.request(ENDPOINTS.EXPERTS.REGISTER, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let the browser set it
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: formData,
    });
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
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};