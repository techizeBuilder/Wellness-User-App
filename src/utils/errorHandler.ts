/**
 * Enhanced Error Handler - Provides clean user experience without console spam
 */

// Validation error types that should not produce console errors
const VALIDATION_ERROR_PATTERNS = [
  'already registered',
  'email is already registered',
  'phone number is already registered',
  'User with this email already exists',
  'Expert with this email already exists',
  'validation_error',
  'duplicate_error'
];

// Check if an error is a validation error (expected user behavior)
const isValidationError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = error.message || error.toString() || '';
  const errorType = error.type || '';
  
  return VALIDATION_ERROR_PATTERNS.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase()) || 
    errorType.toLowerCase().includes(pattern.toLowerCase())
  );
};

// Enhanced error handling utility that provides user-friendly messages without console noise
export const handleRegistrationError = (error: any): { 
  message: string; 
  isValidationError: boolean;
  shouldShowConsoleError: boolean;
} => {
  const isValidation = isValidationError(error);
  
  // Never show console errors for validation scenarios
  const shouldShowConsoleError = false; // Completely disable console errors
  
  let message = 'An unexpected error occurred. Please try again.';
  
  if (error?.message) {
    const errorMessage = error.message;
    
    // Handle our specific validation messages
    if (errorMessage.includes('already registered as a user account')) {
      message = 'This email is already registered as a user account. Please use a different email or try logging in.';
    } else if (errorMessage.includes('already registered as an expert account')) {
      message = 'This email is already registered as an expert account. Please use a different email.';
    } else if (errorMessage.includes('already registered in the system')) {
      message = 'This email is already registered. Please use a different email or try logging in.';
    } else if (errorMessage.includes('phone number is already registered as a user account')) {
      message = 'This phone number is already registered as a user account. Please use a different number.';
    } else if (errorMessage.includes('phone number is already registered as an expert account')) {
      message = 'This phone number is already registered as an expert account. Please use a different number.';
    } else if (errorMessage.includes('phone number is already registered in the system')) {
      message = 'This phone number is already registered. Please use a different number.';
    } else if (errorMessage.includes('All FormData API endpoints failed') || errorMessage.includes('Network request failed')) {
      message = 'Network connection failed. Please check your internet connection and try again.';
    } else if (error.type === 'validation_error') {
      message = error.errors ? error.errors.join(', ') : errorMessage;
    } else if (errorMessage.includes('User with this email already exists')) {
      message = 'An account with this email already exists. Please use a different email or try logging in.';
    } else if (errorMessage.includes('Expert with this email already exists')) {
      message = 'An expert account with this email already exists. Please use a different email.';
    } else {
      message = errorMessage;
    }
  }
  
  return {
    message,
    isValidationError: isValidation,
    shouldShowConsoleError
  };
};

// Silent error handler that never logs to console
export const logErrorSafely = (error: any, context: string = 'Error') => {
  // Completely suppress all console logging for a clean user experience
  // No console output in any environment to prevent spam
  return; // Silent - no console output at all
};