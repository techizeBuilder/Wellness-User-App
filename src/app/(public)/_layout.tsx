import { Redirect, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import authService from '@/services/authService';

export default function PublicLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
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

  // If user is authenticated, redirect to appropriate dashboard
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

