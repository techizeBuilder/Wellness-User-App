export const colors = {
  // Zenovia Brand Colors - Primary (Core Identity)
  deepTeal: '#004D4D',        // Trust, Calmness, Healing
  royalGold: '#FFD700',       // Luxury, Premium, Prosperity
  
  // Secondary Colors (Support & Balance)
  white: '#FFFFFF',           // Clean UI, Wellness purity
  coralAccent: '#FF6F61',     // Warmth, Call-to-action highlights
  sageGreen: '#A3C9A8',       // Ayurveda, Herbal balance
  
  // Neutral Shades (Readability & Depth)
  lightMistTeal: '#E6F2F2',   // Dashboard / section backgrounds
  warmGray: '#F5F5F5',        // Cards & neutral zones
  charcoalGray: '#333333',    // Text body
  
  // Extended Palette
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#004D4D',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#FFD700',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Neutral Colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Background gradients
  gradients: {
    primary: ['#004D4D', '#A3C9A8'],
    gold: ['#FFD700', '#FFA500'],
    wellness: ['#A3C9A8', '#E8F5E8'],
    coral: ['#FF6F61', '#FFB3A7'],
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
};