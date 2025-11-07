// Authentication Service - Handles all auth-related API calls
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URLS } from '@/config/apiConfig';

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
    accountType?: string; // Add accountType to handle User vs Expert
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
      const healthUrl = this.baseUrl + '/health';
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Helper method to make API requests
  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      // Test connectivity first for debugging
      const isConnected = await this.testConnectivity();
      
      console.log(`🌐 Making request to: ${url}`);
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };
      
      const response = await fetch(url, config);
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        // Log only the status for debugging, not the full error details
        console.log(`📡 API responded with status: ${response.status}`);
        throw {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          errors: data.errors || []
        } as ApiError;
      }

      console.log(`✅ Request successful for ${url}`);

      return data;
    } catch (error: any) {
      // Check for network connectivity issues
      if (error.message?.includes('Network request failed') || error.message?.includes('fetch')) {
        console.log(`🔌 Network connectivity issue detected. Check if backend server is running on port 3001`);
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

    // Store token and account type in AsyncStorage for future requests
    if (response.success && response.data.token) {
      await this.storeToken(response.data.token);
      
      // Store account type if available
      const accountType = response.data.accountType || 'User';
      await this.storeAccountType(accountType);
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
    console.log(`🔑 Processing forgot password request`);
    
    try {
      const result = await this.requestPasswordReset(request);
      console.log(`🔑 Forgot password request completed successfully`);
      return result;
    } catch (error) {
      console.log(`🔑 Forgot password request failed`);
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
      await AsyncStorage.setItem('authToken', token);
      console.log('✅ Token stored successfully in AsyncStorage');
    } catch (error) {
      console.error('❌ Error storing token:', error);
      throw error;
    }
  }

  private async storeAccountType(accountType: string): Promise<void> {
    try {
      await AsyncStorage.setItem('accountType', accountType);
      console.log('✅ Account type stored successfully in AsyncStorage');
    } catch (error) {
      console.error('❌ Error storing account type:', error);
      throw error;
    }
  }

  async getAccountType(): Promise<string | null> {
    try {
      const accountType = await AsyncStorage.getItem('accountType');
      return accountType;
    } catch (error) {
      console.error('❌ Error retrieving account type:', error);
      return null;
    }
  }

  // Public method to store account type (for registration flows)
  async setAccountType(accountType: string): Promise<void> {
    await this.storeAccountType(accountType);
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error('❌ Error retrieving token:', error);
      return null;
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('accountType');
      console.log('✅ Token and account type removed successfully from AsyncStorage');
    } catch (error) {
      console.error('❌ Error removing token:', error);
      throw error;
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