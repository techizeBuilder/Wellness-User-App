/**
 * Route type definitions for Expo Router
 * This provides type safety for route navigation
 */

// Define all valid routes in the app
export type AuthRoute = 
  | '/(auth)/login'
  | '/(auth)/create-account'
  | '/(auth)/forgot-password'
  | '/(auth)/reset-password'
  | '/(auth)/otp-verification'
  | '/(auth)/otp-verification-new'
  | '/(auth)/user-type-selection';

export type PublicRoute =
  | '/(public)/onboarding'
  | '/(public)/onboarding-simple'
  | '/(public)/legal'
  | '/(public)/privacy-policy'
  | '/(public)/terms-of-service'
  | '/(public)/cookie-policy';

export type UserRoute =
  | '/(user)/dashboard'
  | '/(user)/experts'
  | '/(user)/sessions'
  | '/(user)/content'
  | '/(user)/profile'
  | '/(user)/payment-methods'
  | '/(user)/contact-info'
  | '/(user)/health-preferences'
  | '/(user)/connected-accounts'
  | '/(user)/subscription-details'
  | '/(user)/notifications'
  | '/(user)/language'
  | '/(user)/help-support'
  | '/(user)/expert-detail'
  | '/(user)/booking'
  | '/(user)/appointment-detail';

export type ExpertRoute =
  | '/(expert)/expert-dashboard'
  | '/(expert)/expert-dashboard-new'
  | '/(expert)/expert-appointments'
  | '/(expert)/expert-patients'
  | '/(expert)/expert-earnings'
  | '/(expert)/expert-registration'
  | '/(expert)/expert-registration-new'
  | '/(expert)/patient-detail'
  | '/(expert)/all-reviews';

export type SharedRoute =
  | '/person-detail'
  | '/index';

export type AppRoute = AuthRoute | PublicRoute | UserRoute | ExpertRoute | SharedRoute;

// Extend expo-router types
declare module 'expo-router' {
  import { Href } from 'expo-router';
  
  // Override router.push and router.replace to accept our typed routes
  export interface Router {
    push: {
      (href: AppRoute | Href): void;
      (href: { pathname: AppRoute; params?: Record<string, any> }): void;
    };
    replace: {
      (href: AppRoute | Href): void;
      (href: { pathname: AppRoute; params?: Record<string, any> }): void;
    };
  }
}

