import { Redirect, Stack, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import authService from '@/services/authService';

export default function ExpertLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuthenticatedUser = await authService.isAuthenticated();
      const accountType = await authService.getAccountType();
      
      // DEBUG: Log what we're checking
      console.log('🔍 ExpertLayout - Auth check:', {
        isAuthenticated: isAuthenticatedUser,
        accountType: accountType,
        pathname: pathname
      });
      
      // CRITICAL: Only allow Expert account type AND authenticated users
      // If accountType is not explicitly "Expert", deny access
      const isExpert = accountType === 'Expert';
      
      if (isAuthenticatedUser && !isExpert) {
        console.error('❌ ExpertLayout: User is authenticated but accountType is not Expert! accountType:', accountType);
        // Safety: Clear potentially incorrect accountType if it's not null but also not "Expert" or "User"
        if (accountType && accountType !== 'User' && accountType !== 'Expert') {
          console.warn('⚠️ ExpertLayout: Clearing invalid accountType:', accountType);
          await authService.setAccountType('User');
        }
      }
      
      setIsAuthenticated(isAuthenticatedUser && isExpert);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if current route is expert-registration (public route)
  const isRegistrationRoute = pathname?.includes('expert-registration') ?? false;

  // If we're still loading auth, show loading screen
  // But if we're on registration route, allow it immediately
  if (isLoading && !isRegistrationRoute) {
    return null; // Or return a loading screen
  }

  // Allow access to registration routes without authentication
  if (isRegistrationRoute) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    );
  }

  // For all other expert routes, require authentication
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
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

