// Global keep awake error handler
// This should be imported as early as possible in the app

const isKeepAwakeError = (error: any): boolean => {
  const message = error?.reason?.message || error?.message || String(error);
  return message.includes('keep awake') || 
         message.includes('Unable to activate keep awake') ||
         message.includes('keep-awake') ||
         message.includes('ExpoKeepAwake');
};

// Detect environment
const isWeb = typeof window !== 'undefined' && typeof window.addEventListener === 'function';
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// Set up global error handlers for keep awake issues
export const setupKeepAwakeErrorHandlers = () => {
  if (isWeb) {
    // For web environment
    const handleUnhandledRejection = (event: any) => {
      if (isKeepAwakeError(event)) {
        console.warn('[SUPPRESSED] Keep awake error:', event.reason?.message || event.reason);
        event.preventDefault();
        return true;
      }
      return false;
    };

    const handleError = (event: any) => {
      if (isKeepAwakeError(event)) {
        console.warn('[SUPPRESSED] Keep awake error:', event.error?.message || event.error);
        event.preventDefault();
        return true;
      }
      return false;
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  } else {
    // For React Native environment
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args) => {
      const message = args.join(' ');
      if (isKeepAwakeError({ message })) {
        console.warn('[SUPPRESSED] Keep awake error:', message);
        return;
      }
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      if (isKeepAwakeError({ message })) {
        return; // Completely suppress keep awake warnings
      }
      originalConsoleWarn.apply(console, args);
    };

    // Handle React Native's global error handler if available
    try {
      const globalWithErrorUtils = global as any;
      const originalHandler = globalWithErrorUtils.ErrorUtils?.getGlobalHandler();
      if (globalWithErrorUtils.ErrorUtils && typeof globalWithErrorUtils.ErrorUtils.setGlobalHandler === 'function') {
        globalWithErrorUtils.ErrorUtils.setGlobalHandler((error: any, isFatal: boolean) => {
          if (isKeepAwakeError(error)) {
            console.warn('[SUPPRESSED] Keep awake error:', error.message || error);
            return;
          }
          if (originalHandler) {
            originalHandler(error, isFatal);
          }
        });
      }
    } catch (e) {
      // Ignore if ErrorUtils is not available
    }

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      // Note: We don't restore the original error handler to avoid potential issues
    };
  }
};

// Auto-setup on import
try {
  setupKeepAwakeErrorHandlers();
} catch (error) {
  console.warn('Failed to setup keep awake error handlers:', error);
}