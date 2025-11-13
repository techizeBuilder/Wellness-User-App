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
  requiresAccountSelection?: boolean;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isEmailVerified: boolean;
      userType?: 'user' | 'expert'; // Include userType for incomplete onboarding
    };
    token?: string;
    accountType?: string; // Add accountType to handle User vs Expert
  };
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface CompleteOnboardingRequest {
  googleUserId: string;
  accountType: 'Expert' | 'User';
}

export interface CompleteOnboardingResponse {
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
    accountType: string;
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

  // Verify onboarding completion by fetching user profile
  async verifyOnboardingComplete(): Promise<{
    isComplete: boolean;
    requiresOnboarding?: boolean;
    userData?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      userType?: 'user' | 'expert';
      phone?: string;
      authProvider?: string;
    };
  }> {
    try {
      const token = await this.getToken();
      if (!token) {
        return { isComplete: false };
      }

      // Fetch user profile to check onboarding status
      const response = await this.makeRequest<{
        success: boolean;
        data: {
          user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone?: string;
            userType?: 'user' | 'expert';
            authProvider?: string;
            isEmailVerified?: boolean;
          };
        };
      }>(API_URLS.AUTH.GET_USER, {
        method: 'GET',
      });

      if (!response.success || !response.data?.user) {
        return { isComplete: false };
      }

      const user = response.data.user;
      const isGoogleUser = user.authProvider === 'google';

      // Check if onboarding is complete
      // For Google users: phone is required
      if (isGoogleUser) {
        const hasValidPhone = user.phone && 
          user.phone.trim() !== '' && 
          user.phone !== '0000000000' && 
          /^[+]?[\d\s\-\(\)]{10,}$/.test(user.phone);

        if (!hasValidPhone) {
          return {
            isComplete: false,
            requiresOnboarding: true,
            userData: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              userType: user.userType,
              phone: user.phone,
              authProvider: user.authProvider,
            },
          };
        }
      }

      // For experts, check if Expert record exists with specialization
      // This is especially important for Google OAuth experts
      if (user.userType === 'expert') {
        try {
          // Try to fetch expert profile to check if specialization exists
          const expertResponse = await this.makeRequest<{
            success: boolean;
            data: {
              expert: {
                specialization?: string;
              };
            };
          }>(API_URLS.EXPERTS.PROFILE, {
            method: 'GET',
          });

          const hasSpecialization = expertResponse.success && 
            expertResponse.data?.expert?.specialization &&
            expertResponse.data.expert.specialization.trim() !== '';

          if (!hasSpecialization) {
            return {
              isComplete: false,
              requiresOnboarding: true,
              userData: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType,
                phone: user.phone,
                authProvider: user.authProvider,
              },
            };
          }
        } catch (error) {
          // If expert profile doesn't exist or fetch fails, onboarding is incomplete
          // This is expected for Google OAuth experts who haven't completed onboarding
          console.error('Error fetching expert profile for onboarding check:', error);
          return {
            isComplete: false,
            requiresOnboarding: true,
            userData: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              userType: user.userType,
              phone: user.phone,
              authProvider: user.authProvider,
            },
          };
        }
      }

      // Onboarding is complete
      return {
        isComplete: true,
        userData: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          phone: user.phone,
          authProvider: user.authProvider,
        },
      };
    } catch (error) {
      console.error('Error verifying onboarding:', error);
      // If token is invalid, return incomplete
      return { isComplete: false };
    }
  }

  // Google Login API
  async loginWithGoogle(idToken: string): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>(
      API_URLS.AUTH.GOOGLE_MOBILE_LOGIN,
      {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      }
    );

    // Only store token if account selection is not required
    if (response.success && !response.requiresAccountSelection && response.data.token) {
      await this.storeToken(response.data.token);
      const accountType = response.data.accountType || 'User';
      await this.storeAccountType(accountType);
    }

    return response;
  }

  // Complete Google Onboarding
  async completeGoogleOnboarding(request: CompleteOnboardingRequest): Promise<CompleteOnboardingResponse> {
    const response = await this.makeRequest<CompleteOnboardingResponse>(
      API_URLS.AUTH.GOOGLE_COMPLETE_ONBOARDING,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    // Store token and account type after onboarding
    if (response.success && response.data.token) {
      await this.storeToken(response.data.token);
      await this.storeAccountType(response.data.accountType);
    }

    return response;
  }

  // Update Google User Profile (for onboarding)
  async updateGoogleUserProfile(request: {
    userId: string;
    firstName?: string;
    lastName?: string;
    phone: string;
  }): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>(
      API_URLS.AUTH.GOOGLE_UPDATE_USER_PROFILE,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    return response;
  }

  // Update Google Expert Profile (for onboarding)
  async updateGoogleExpertProfile(request: {
    userId: string;
    firstName?: string;
    lastName?: string;
    phone: string;
    specialization: string;
    experience?: number;
    bio?: string;
    hourlyRate?: number;
  }): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>(
      API_URLS.AUTH.GOOGLE_UPDATE_EXPERT_PROFILE,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    return response;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;