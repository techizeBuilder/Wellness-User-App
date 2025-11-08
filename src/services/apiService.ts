// API Configuration and Service Layer
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS } from "@/config/apiConfig";
import { BASE_URL } from "@/config/environment";

// API Client Class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;

    if (__DEV__) {
      console.log(`🌐 API request to: ${url}`);
    }

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
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

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData = null;
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          errorData = await response.json();
          // Check if it's a validation error - if so, don't log anything
          const isValidationError =
            errorData.message &&
            (errorData.message.includes("already registered") ||
              errorData.message.includes("validation") ||
              errorData.type === "validation_error");

          // Only log error data in development mode for non-validation errors
          if (__DEV__ && !isValidationError) {
            console.log("Error response data:", errorData);
          }

          // Handle validation errors specifically
          if (errorData.type === "validation_error" && errorData.errors) {
            errorMessage = errorData.message || errorData.errors.join(", ");
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }

          // Create a more detailed error object
          const customError = new Error(errorMessage);
          if (errorData.type) {
            (customError as any).type = errorData.type;
          }
          if (errorData.errors) {
            (customError as any).errors = errorData.errors;
          }
          throw customError;
        } catch (parseError) {
          // If JSON parsing fails, check if the error is not the JSON parsing itself
          if (
            parseError instanceof Error &&
            parseError.message !== errorMessage
          ) {
            throw parseError; // Re-throw our custom error
          }
          // Use status text if JSON parsing fails
          errorMessage = response.statusText || errorMessage;
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      if (__DEV__) {
        console.log(`✅ API request successful`);
      }
      return data;
    } catch (error) {
      // Check if it's a validation error - if so, don't log anything
      const isValidationError =
        error instanceof Error &&
        (error.message.includes("already registered") ||
          error.message.includes("validation") ||
          (error as any).type === "validation_error");

      // Only log detailed failure information in development mode for non-validation errors
      if (__DEV__ && !isValidationError) {
        console.error(`❌ API request failed:`, error);
      }
      throw error;
    }
  }

  // Token management
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      if (__DEV__) {
        console.error("Error retrieving token:", error);
      }
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem("authToken", token);
    } catch (error) {
      if (__DEV__) {
        console.error("Error storing token:", error);
      }
      throw error;
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem("authToken");
    } catch (error) {
      if (__DEV__) {
        console.error("Error removing token:", error);
      }
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
    const nameParts = userData.fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || firstName; // Use first name as last name if no last name provided

    // For now, use JSON registration (image upload can be added later)
    const registrationData = {
      firstName,
      lastName,
      email: userData.email,
      phone: userData.phoneNumber,
      password: userData.password,
    };

    if (__DEV__) {
      console.log("Sending registration data:", registrationData);
    }

    return this.request(ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(registrationData),
    });
  }

  private async requestFormData(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    // Validate FormData
    if (options.body && !(options.body instanceof FormData)) {
      throw new Error(
        "Body must be a FormData instance for multipart requests"
      );
    }

    const url = `${this.baseUrl}${endpoint}`;

    if (__DEV__) {
      console.log(`🌐 FormData API request to: ${url}`);
    }

    const config: RequestInit = {
      ...options,
      headers: {
        // Don't set Content-Type for FormData - let the system handle multipart boundary
        ...((options.headers as Record<string, string>) || {}),
      },
    };

    // Remove any manually set Content-Type for FormData
    if (config.headers && "Content-Type" in config.headers) {
      delete (config.headers as any)["Content-Type"];
    }

    // Add auth token if available
    const token = await this.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorType = null;

        try {
          const errorData = await response.json();
          // Check if it's a validation error - if so, don't log anything
          const isValidationError =
            errorData.message &&
            (errorData.message.includes("already registered") ||
              errorData.message.includes("validation") ||
              errorData.type === "validation_error");

          // Only log detailed error data in development mode for non-validation errors
          if (__DEV__ && !isValidationError) {
            console.log("FormData Error response data:", errorData);
          }

          errorMessage = errorData.message || errorData.error || errorMessage;
          errorType = errorData.type;

          // Create a more detailed error object for validation errors
          const customError = new Error(errorMessage);
          if (errorType) {
            (customError as any).type = errorType;
          }
          throw customError;
        } catch (parseError) {
          // If JSON parsing fails, use status text
          if (
            parseError instanceof Error &&
            parseError.message !== errorMessage
          ) {
            throw parseError; // Re-throw our custom error
          }
          errorMessage = response.statusText || errorMessage;
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      if (__DEV__) {
        console.log(`✅ FormData API request successful`);
      }
      return data;
    } catch (error) {
      // Check if it's a validation error - if so, don't log anything
      const isValidationError =
        error instanceof Error &&
        (error.message.includes("already registered") ||
          error.message.includes("validation") ||
          (error as any).type === "validation_error");

      // Only log FormData failure information in development mode for non-validation errors
      if (__DEV__ && !isValidationError) {
        console.error(`❌ FormData API request failed:`, error);
      }
      throw error;
    }
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request(ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      await this.setToken(response.token);
    }

    return response;
  }

  async forgotPassword(email: string) {
    return this.request(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async sendOTP(email: string) {
    return this.request(ENDPOINTS.AUTH.SEND_OTP, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(data: { email: string; otp: string }) {
    return this.request(ENDPOINTS.AUTH.VERIFY_OTP, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async verifyRegistrationOTP(data: { email: string; otp: string }) {
    return this.request(ENDPOINTS.AUTH.VERIFY_REGISTRATION_OTP, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    return this.request(ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout() {
    await this.removeToken();
    return { success: true, message: "Logged out successfully" };
  }

  // Expert APIs
  async registerExpert(formData: FormData) {
    return this.requestFormData(ENDPOINTS.EXPERTS.REGISTER, {
      method: "POST",
      body: formData,
    });
  }

  async loginExpert(credentials: { email: string; password: string }) {
    const response = await this.request(ENDPOINTS.EXPERTS.LOGIN, {
      method: "POST",
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

  async getCurrentExpertProfile() {
    return this.request(ENDPOINTS.EXPERTS.PROFILE);
  }

  async getAllExperts() {
    return this.request(ENDPOINTS.EXPERTS.LIST);
  }

  // User profile APIs
  async getUserProfile() {
    return this.request(ENDPOINTS.AUTH.GET_USER);
  }

  async updateUserProfile(userData: any) {
    return this.request(ENDPOINTS.AUTH.PROFILE, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;

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
  // Only log detailed error information in development mode
  if (__DEV__) {
    console.log("API Error Details:", error);
  }

  // Check if it's a validation error with details
  if (error.type === "validation_error") {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors.join(", ");
    }
    return error.message || "Validation error occurred";
  }

  // Check if it's a duplicate error
  if (error.type === "duplicate_error") {
    return error.message || "Duplicate data found";
  }

  // Check for specific error messages
  if (error.message) {
    // Clean up common error messages
    const message = error.message;

    // Handle our new email validation messages
    if (message.includes("already registered as a user account")) {
      return "This email is already registered as a user account. Please use a different email or try logging in.";
    }
    if (message.includes("already registered as an expert account")) {
      return "This email is already registered as an expert account. Please use a different email.";
    }
    if (message.includes("already registered in the system")) {
      return "This email is already registered. Please use a different email or try logging in.";
    }
    if (
      message.includes("phone number is already registered as a user account")
    ) {
      return "This phone number is already registered as a user account. Please use a different number.";
    }
    if (
      message.includes(
        "phone number is already registered as an expert account"
      )
    ) {
      return "This phone number is already registered as an expert account. Please use a different number.";
    }
    if (message.includes("phone number is already registered in the system")) {
      return "This phone number is already registered. Please use a different number.";
    }

    // Legacy error message handling (for backward compatibility)
    if (message.includes("User with this email already exists")) {
      return "An account with this email already exists. Please use a different email or try logging in.";
    }
    if (message.includes("User with this phone number already exists")) {
      return "An account with this phone number already exists. Please use a different number.";
    }
    if (message.includes("Expert with this email already exists")) {
      return "An expert account with this email already exists. Please use a different email.";
    }

    if (message.includes("Password must contain")) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
    }
    if (message.includes("Network request failed")) {
      return "Network connection failed. Please check your internet connection and try again.";
    }
    return message;
  }

  if (typeof error === "string") {
    return error;
  }

  // Check if it's a fetch error
  if (
    error.name === "TypeError" &&
    error.message &&
    error.message.includes("fetch")
  ) {
    return "Network connection failed. Please check your internet connection and try again.";
  }

  return "An unexpected error occurred. Please try again.";
};
