import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

export default function RootLayout() {
  // Handle unhandled promise rejections to prevent keep awake errors
  useEffect(() => {
    // Suppress keep awake errors globally
    const suppressKeepAwakeErrors = () => {
      if (Platform.OS === 'web') {
        const handleUnhandledRejection = (event: any) => {
          const message = event.reason?.message || '';
          if (message.includes('keep awake') || 
              message.includes('Unable to activate keep awake') ||
              message.includes('keep-awake')) {
            console.warn('Keep awake error suppressed:', message);
            event.preventDefault();
            return;
          }
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        
        return () => {
          window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
      } else {
        // For React Native - override console methods to suppress keep awake errors
        const originalError = console.error;
        const originalWarn = console.warn;

        console.error = (...args) => {
          const message = args.join(' ');
          if (message.includes('keep awake') || 
              message.includes('Unable to activate keep awake') ||
              message.includes('keep-awake')) {
            console.warn('Keep awake error suppressed:', message);
            return;
          }
          originalError.apply(console, args);
        };

        console.warn = (...args) => {
          const message = args.join(' ');
          if (message.includes('keep awake') || 
              message.includes('Unable to activate keep awake') ||
              message.includes('keep-awake')) {
            return; // Completely suppress keep awake warnings
          }
          originalWarn.apply(console, args);
        };

        return () => {
          console.error = originalError;
          console.warn = originalWarn;
        };
      }
    };

    const cleanup = suppressKeepAwakeErrors();
    return cleanup;
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Stack 
          screenOptions={{
            headerShown: false, // This removes the header with route names
            contentStyle: { backgroundColor: '#004D4D' },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="onboarding-simple" />
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
