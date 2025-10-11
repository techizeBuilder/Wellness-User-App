import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12 Pro as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const getResponsiveWidth = (size: number): number => {
  return Math.round((size * SCREEN_WIDTH) / BASE_WIDTH);
};

export const getResponsiveHeight = (size: number): number => {
  return Math.round((size * SCREEN_HEIGHT) / BASE_HEIGHT);
};

export const getResponsiveFontSize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  
  // Limit font scaling to prevent too large or too small text
  if (newSize < 10) return 10;
  if (newSize > 40) return 40;
  
  return Math.round(newSize);
};

export const getResponsivePadding = (size: number): number => {
  return getResponsiveWidth(size);
};

export const getResponsiveMargin = (size: number): number => {
  return getResponsiveWidth(size);
};

export const getResponsiveBorderRadius = (size: number): number => {
  return getResponsiveWidth(size);
};

// Device type detection
export const isSmallDevice = (): boolean => SCREEN_WIDTH < 375;
export const isMediumDevice = (): boolean => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = (): boolean => SCREEN_WIDTH >= 414;
export const isTablet = (): boolean => SCREEN_WIDTH >= 768;

// Responsive spacing values
export const spacing = {
  xs: getResponsiveWidth(4),
  sm: getResponsiveWidth(8),
  md: getResponsiveWidth(16),
  lg: getResponsiveWidth(24),
  xl: getResponsiveWidth(32),
  xxl: getResponsiveWidth(48),
};

// Responsive font sizes
export const fontSizes = {
  xs: getResponsiveFontSize(12),
  sm: getResponsiveFontSize(14),
  md: getResponsiveFontSize(16),
  lg: getResponsiveFontSize(18),
  xl: getResponsiveFontSize(20),
  xxl: getResponsiveFontSize(24),
  xxxl: getResponsiveFontSize(32),
};

export const screenData = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: isSmallDevice(),
  isMedium: isMediumDevice(),
  isLarge: isLargeDevice(),
  isTablet: isTablet(),
};