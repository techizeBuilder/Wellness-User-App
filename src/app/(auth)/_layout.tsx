import { Redirect, Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import authService from '@/services/authService';

export default function AuthLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        // Verify onboarding completion
        const onboardingStatus = await authService.verifyOnboardingComplete();
        
        if (!onboardingStatus.isComplete && onboardingStatus.requiresOnboarding && onboardingStatus.userData) {
          // Onboarding incomplete - redirect to appropriate onboarding screen
          const userData = onboardingStatus.userData;
          const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || '';
          const routeParams = {
            isGoogleFlow: 'true',
            googleUserId: userData.id,
            fullName,
            email: userData.email || ''
          };

          if (userData.userType === 'expert') {
            router.replace({
              pathname: '/(expert)/expert-registration',
              params: routeParams
            });
          } else {
            router.replace({
              pathname: '/(auth)/create-account',
              params: routeParams
            });
          }
          return;
        }

        // Get account type to determine redirect
        const type = await authService.getAccountType();
        setAccountType(type);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or return a loading screen
  }

  // If user is authenticated and onboarding complete, redirect to appropriate dashboard (block auth pages)
  if (isAuthenticated) {
    if (accountType === 'Expert') {
      return <Redirect href="/(expert)/expert-dashboard" />;
    } else {
      return <Redirect href="/(user)/dashboard" />;
    }
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    />
  );
}

