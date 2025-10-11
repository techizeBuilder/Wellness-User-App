// Authentication Service - Handles all auth-related API calls
import { API_URLS } from '../config/apiConfig';

// Types for API requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isEmailVerified: boolean;
    };
    token: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  type: 'email_verification' | 'password_reset';
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  data?: {
    resetToken: string;
    expiresIn: string;
  };
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
  resetToken: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URLS.AUTH.LOGIN.replace('/auth/login', ''); // Extract base URL
  }

  // Test network connectivity
  private async testConnectivity(): Promise<boolean> {
    try {
      console.log(`🔌 Testing connectivity to backend...`);
      const healthUrl = this.baseUrl + '/health';
      console.log(`🏥 Health check URL: ${healthUrl}`);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`🏥 Health check response: ${response.status}`);
      return response.ok;
    } catch (error) {
      console.error(`❌ Connectivity test failed:`, error);
      return false;
    }
  }

  // Helper method to make API requests
  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      // Test connectivity first for debugging
      const isConnected = await this.testConnectivity();
      console.log(`🔌 Backend connectivity: ${isConnected ? 'CONNECTED' : 'FAILED'}`);
      
      console.log(`🌐 Making request to: ${url}`);
      console.log(`📤 Request options:`, JSON.stringify(options, null, 2));
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      console.log(`📋 Final config:`, JSON.stringify(config, null, 2));
      
      const response = await fetch(url, config);
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      console.log(`📥 Response data from ${url}:`, JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error(`❌ HTTP Error: ${response.status} - ${data.message || 'Unknown error'}`);
        throw {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          errors: data.errors || []
        } as ApiError;
      }

      console.log(`✅ Request successful for ${url}`);
      return data;
    } catch (error: any) {
      console.error(`❌ API Error for ${url}:`, error);
      console.error(`❌ Error type:`, typeof error);
      console.error(`❌ Error details:`, JSON.stringify(error, null, 2));
      
      // Check for network connectivity issues
      if (error.message?.includes('Network request failed') || error.message?.includes('fetch')) {
        console.error(`🔌 Network connectivity issue detected. Check if backend server is running on port 3001`);
      }
      
      // If it's already a formatted error, throw it as is
      if (error.success === false) {
        throw error;
      }
      
      // Format network or other errors
      throw {
        success: false,
        message: error.message || 'Network error. Please check your connection and ensure backend server is running.',
        errors: []
      } as ApiError;
    }
  }

  // 1. Login API
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>(
      API_URLS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    // Store token in AsyncStorage/SecureStore for future requests
    if (response.success && response.data.token) {
      await this.storeToken(response.data.token);
    }

    return response;
  }

  // 2. Forgot Password - Step 1: Send OTP
  async requestPasswordReset(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return this.makeRequest<ForgotPasswordResponse>(
      API_URLS.AUTH.FORGOT_PASSWORD,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  // Alias for convenience - same as requestPasswordReset
  async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    console.log(`🔑 === FORGOT PASSWORD REQUEST START ===`);
    console.log(`🔑 Email: ${request.email}`);
    console.log(`🔑 Target URL: ${API_URLS.AUTH.FORGOT_PASSWORD}`);
    console.log(`🔑 Base URL extracted: ${this.baseUrl}`);
    
    try {
      const result = await this.requestPasswordReset(request);
      console.log(`🔑 === FORGOT PASSWORD SUCCESS ===`);
      return result;
    } catch (error) {
      console.error(`🔑 === FORGOT PASSWORD FAILED ===`);
      console.error(`🔑 Error:`, error);
      throw error;
    }
  }

  // 3. Verify OTP - Step 2: Get Reset Token
  async verifyPasswordResetOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    return this.makeRequest<VerifyOTPResponse>(
      API_URLS.AUTH.VERIFY_OTP,
      {
        method: 'POST',
        body: JSON.stringify({
          ...request,
          type: 'password_reset' // Ensure correct type
        }),
      }
    );
  }

  // 4. Reset Password - Step 3: Change Password
  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return this.makeRequest<ResetPasswordResponse>(
      API_URLS.AUTH.RESET_PASSWORD,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  // Token management methods
  private async storeToken(token: string): Promise<void> {
    try {
      // For React Native, use AsyncStorage or SecureStore
      if (typeof window !== 'undefined') {
        // Web environment
        localStorage.setItem('authToken', token);
      } else {
        // React Native - you might want to use AsyncStorage or SecureStore
        // await AsyncStorage.setItem('authToken', token);
        console.log('Token would be stored in AsyncStorage:', token);
      }
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      if (typeof window !== 'undefined') {
        // Web environment
        return localStorage.getItem('authToken');
      } else {
        // React Native
        // return await AsyncStorage.getItem('authToken');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  async removeToken(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        // Web environment
        localStorage.removeItem('authToken');
      } else {
        // React Native
        // await AsyncStorage.removeItem('authToken');
        console.log('Token would be removed from AsyncStorage');
      }
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    await this.removeToken();
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;