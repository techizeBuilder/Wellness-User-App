// Authentication Service - Handles all auth-related API calls
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URLS } from "@/config/apiConfig";

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
  type: "email_verification" | "password_reset";
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
    this.baseUrl = API_URLS.AUTH.LOGIN.replace("/auth/login", ""); // Extract base URL
  }

  // Test network connectivity
  private async testConnectivity(): Promise<boolean> {
    try {
      const healthUrl = this.baseUrl + "/health";

      const response = await fetch(healthUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Helper method to make API requests
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // Test connectivity first for debugging
      const isConnected = await this.testConnectivity();

      console.log(`🌐 Making request to: ${url}`);

      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      console.log(
        `📡 Response status: ${response.status} ${response.statusText}`
      );

      const data = await response.json();

      if (!response.ok) {
        // Log only the status for debugging, not the full error details
        console.log(`📡 API responded with status: ${response.status}`);
        throw {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          errors: data.errors || [],
        } as ApiError;
      }

      console.log(`✅ Request successful for ${url}`);

      return data;
    } catch (error: any) {
      // Check for network connectivity issues
      if (
        error.message?.includes("Network request failed") ||
        error.message?.includes("fetch")
      ) {
        console.log(
          `🔌 Network connectivity issue detected. Check if backend server is running on port 3001`
        );
      }

      // If it's already a formatted error, throw it as is
      if (error.success === false) {
        throw error;
      }

      // Format network or other errors
      throw {
        success: false,
        message:
          error.message ||
          "Network error. Please check your connection and ensure backend server is running.",
        errors: [],
      } as ApiError;
    }
  }

  // 1. Login API
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>(
      API_URLS.AUTH.LOGIN,
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    // Store token and account type in AsyncStorage for future requests
    if (response.success && response.data) {
      const { user, token, accountType } = response.data;

      if (token) {
        await this.storeToken(token);
      }

      // Store account type if available
      const userAccountType = accountType || "User";
      await this.storeAccountType(userAccountType);

      // Store complete user data for dashboard and profile display
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: (user as any).phone,
        // More robust name extraction with multiple fallbacks
        name:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName ||
              user.lastName ||
              (user as any).name ||
              (user as any).username ||
              user.email.split("@")[0] ||
              "User",
        fullName:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : (user as any).name || (user as any).username || null,
        isEmailVerified: user.isEmailVerified,
        accountType: userAccountType,
        userType: (user as any).userType,
        // Copy profile data from backend response
        profileImage: (user as any).profileImage,
        avatar: (user as any).profileImage, // Use profileImage as avatar fallback
        specialization:
          (user as any).specialization ||
          (userAccountType === "Expert"
            ? "Wellness Expert & Certified Therapist"
            : null),
        rating:
          (user as any).rating || (userAccountType === "Expert" ? 4.9 : null),
        experience: (user as any).experience,
        verificationStatus: (user as any).verificationStatus,
        // Default stats - can be enhanced later with real data
        totalPatients: userAccountType === "Expert" ? 89 : null,
        totalEarnings: userAccountType === "Expert" ? 12500 : null,
        thisWeekEarnings: userAccountType === "Expert" ? 1850 : null,
        appointmentsToday: userAccountType === "Expert" ? 6 : null,
        totalSessions: userAccountType === "Expert" ? 420 : 24,
        upcomingAppointments: userAccountType === "Expert" ? 3 : null,
        patientSatisfaction: userAccountType === "Expert" ? 98 : null,
        completedSessions: userAccountType !== "Expert" ? 24 : null,
        totalHours: userAccountType !== "Expert" ? 156 : null,
        expertsWorkedWith: userAccountType !== "Expert" ? 3 : null,
      };

      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      console.log(
        "✅ User data stored with correct backend response structure:",
        userData
      );
    }

    return response;
  }

  // 2. Forgot Password - Step 1: Send OTP
  async requestPasswordReset(
    request: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    return this.makeRequest<ForgotPasswordResponse>(
      API_URLS.AUTH.FORGOT_PASSWORD,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  // Alias for convenience - same as requestPasswordReset
  async forgotPassword(
    request: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
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
  async verifyPasswordResetOTP(
    request: VerifyOTPRequest
  ): Promise<VerifyOTPResponse> {
    return this.makeRequest<VerifyOTPResponse>(API_URLS.AUTH.VERIFY_OTP, {
      method: "POST",
      body: JSON.stringify({
        ...request,
        type: "password_reset", // Ensure correct type
      }),
    });
  }

  // 4. Reset Password - Step 3: Change Password
  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    return this.makeRequest<ResetPasswordResponse>(
      API_URLS.AUTH.RESET_PASSWORD,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  // Token management methods
  private async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem("authToken", token);
      console.log("✅ Token stored successfully in AsyncStorage");
    } catch (error) {
      console.error("❌ Error storing token:", error);
      throw error;
    }
  }

  private async storeAccountType(accountType: string): Promise<void> {
    try {
      await AsyncStorage.setItem("accountType", accountType);
      console.log("✅ Account type stored successfully in AsyncStorage");
    } catch (error) {
      console.error("❌ Error storing account type:", error);
      throw error;
    }
  }

  async getAccountType(): Promise<string | null> {
    try {
      const accountType = await AsyncStorage.getItem("accountType");
      return accountType;
    } catch (error) {
      console.error("❌ Error retrieving account type:", error);
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      return token;
    } catch (error) {
      console.error("❌ Error retrieving token:", error);
      return null;
    }
  }

  async storeAuthData({
    token,
    accountType,
    user,
  }: {
    token: string;
    accountType: string;
    user: any;
  }): Promise<void> {
    try {
      // Store token
      await this.storeToken(token);

      // Store account type
      await this.storeAccountType(accountType);

      // Store complete user data using same logic as login
      const userData = {
        id: user.id || user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        // More robust name extraction with multiple fallbacks
        name:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName ||
              user.lastName ||
              user.name ||
              user.username ||
              user.email.split("@")[0] ||
              "User",
        fullName:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.name || user.username || null,
        isEmailVerified: user.isEmailVerified,
        accountType: accountType,
        userType: user.userType,
        // Copy profile data from backend response
        profileImage: user.profileImage,
        avatar: user.profileImage, // Use profileImage as avatar fallback
        specialization:
          user.specialization ||
          (accountType === "Expert"
            ? "Wellness Expert & Certified Therapist"
            : null),
        rating: user.rating || (accountType === "Expert" ? 4.9 : null),
        experience: user.experience,
        verificationStatus: user.verificationStatus,
        // Default stats - can be enhanced later with real data
        totalPatients: accountType === "Expert" ? 89 : null,
        totalEarnings: accountType === "Expert" ? 12500 : null,
        thisWeekEarnings: accountType === "Expert" ? 1850 : null,
        appointmentsToday: accountType === "Expert" ? 6 : null,
        totalSessions: accountType === "Expert" ? 420 : 24,
        upcomingAppointments: accountType === "Expert" ? 3 : null,
        patientSatisfaction: accountType === "Expert" ? 98 : null,
        completedSessions: accountType !== "Expert" ? 24 : null,
        totalHours: accountType !== "Expert" ? 156 : null,
        expertsWorkedWith: accountType !== "Expert" ? 3 : null,
      };

      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      console.log(
        "✅ Auth data stored successfully for auto-login after registration"
      );
    } catch (error) {
      console.error("❌ Error storing auth data:", error);
      throw error;
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("accountType");
      console.log(
        "✅ Token and account type removed successfully from AsyncStorage"
      );
    } catch (error) {
      console.error("❌ Error removing token:", error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    await this.removeToken();
    await AsyncStorage.removeItem("accountType");
    await AsyncStorage.removeItem("userData");
    console.log("User data cleared on logout");
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
