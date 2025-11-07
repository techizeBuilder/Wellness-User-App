import { Redirect, Stack, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import authService from '@/services/authService';

export default function UserLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const accountType = await authService.getAccountType();
      const isAuthenticatedUser = await authService.isAuthenticated();
      
      // Check if current route is profile (shared route for both users and experts)
      const isProfileRoute = pathname?.includes('/profile') ?? false;
      
      // Allow access if:
      // 1. User account type OR
      // 2. Expert accessing profile route (shared route) OR
      // 3. Authenticated but no account type set yet
      if (isProfileRoute) {
        // Profile is shared - allow both users and experts
        setIsAuthenticated(isAuthenticatedUser);
      } else {
        // Other user routes - only allow User account type
        setIsAuthenticated((accountType === 'User' || accountType === null) && isAuthenticatedUser);
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

