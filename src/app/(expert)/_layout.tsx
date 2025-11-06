import { Redirect, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import authService from '@/services/authService';

export default function ExpertLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const accountType = await authService.getAccountType();
      // Only allow Expert account type
      setIsAuthenticated(accountType === 'Expert');
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

