/**
 * Console Override for Clean Registration Experience
 * This file suppresses console errors for validation scenarios
 */

// Store original console methods
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

// List of validation-related error patterns to suppress
const VALIDATION_PATTERNS = [
  'already registered',
  'email is already registered',
  'FormData Error response data',
  'FormData API request failed',
  'All FormData API endpoints failed',
  'validation_error',
  'duplicate_error'
];

// Check if a message contains validation-related content
const isValidationMessage = (message: string): boolean => {
  return VALIDATION_PATTERNS.some(pattern => 
    message.toLowerCase().includes(pattern.toLowerCase())
  );
};

// Override console.error to suppress validation errors
console.error = (...args: any[]) => {
  // Convert all arguments to strings and check for validation patterns
  const fullMessage = args.map(arg => 
    typeof arg === 'string' ? arg : JSON.stringify(arg)
  ).join(' ');
  
  // Only suppress if it's a validation-related error
  if (isValidationMessage(fullMessage)) {
    return; // Silently ignore validation errors
  }
  
  // For non-validation errors, use original console.error
  originalConsoleError.apply(console, args);
};

// Override console.log to suppress validation logs
console.log = (...args: any[]) => {
  // Convert all arguments to strings and check for validation patterns
  const fullMessage = args.map(arg => 
    typeof arg === 'string' ? arg : JSON.stringify(arg)
  ).join(' ');
  
  // Only suppress if it's a validation-related log
  if (isValidationMessage(fullMessage)) {
    return; // Silently ignore validation logs
  }
  
  // For non-validation logs, use original console.log
  originalConsoleLog.apply(console, args);
};

// Export utility to restore original console if needed
export const restoreConsole = () => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
};

// Export validation checker for other modules
export const isValidationError = (error: any): boolean => {
  if (!error) return false;
  const message = error.message || error.toString() || '';
  return isValidationMessage(message);
};