import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import authService, { ApiError } from '@/services/authService';
import { showErrorToast } from '@/utils/toastConfig';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
  screenData
} from '@/utils/dimensions';

// Custom SVG Icon Components
const UserIcon = ({ size = 40, isSelected = false }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Head */}
    <Circle 
      cx="20" 
      cy="13" 
      r="6" 
      stroke={isSelected ? "#F59E0B" : "#14B8A6"} 
      strokeWidth="2" 
      fill="none" 
    />
    {/* Body/Torso */}
    <Path 
      d="M8 36C8 29 13 24 20 24S32 29 32 36" 
      stroke={isSelected ? "#F59E0B" : "#14B8A6"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      fill="none"
    />
    {/* Business Shirt Collar */}
    <Path 
      d="M16 24L18 27L20 25L22 27L24 24" 
      stroke={isSelected ? "#F59E0B" : "#14B8A6"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    {/* Tie */}
    <Path 
      d="M20 25V32" 
      stroke={isSelected ? "#F59E0B" : "#14B8A6"} 
      strokeWidth="1.5" 
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

const ExpertIcon = ({ size = 40, isSelected = false }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Graduation Cap Base */}
    <Path 
      d="M6 18L20 12L34 18L20 24L6 18Z" 
      stroke={isSelected ? "#F59E0B" : "#14B8A6"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    {/* Cap Top */}
    <Path 
      d="M14 20V26C14 28 16.5 30 20 30S26 28 26 26V20" 
      stroke={isSelected ? "#F59E0B" : "#14B8A6"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    {/* Tassel */}
    <Path 
      d="M32 20V25" 
      stroke={isSelected ? "#F59E0B" : "#14B8A6"} 
      strokeWidth="2" 
      strokeLinecap="round"
      fill="none"
    />
    <Circle 
      cx="32" 
      cy="27" 
      r="1.5" 
      fill={isSelected ? "#F59E0B" : "#14B8A6"}
    />
    {/* Academic Excellence Star */}
    <Path 
      d="M20 6L21.5 9.5L25 10L22.5 12.5L23 16L20 14.5L17 16L17.5 12.5L15 10L18.5 9.5L20 6Z" 
      stroke={isSelected ? "#F59E0B" : "#14B8A6"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export default function UserTypeSelection() {
  const params = useLocalSearchParams();
  const isGoogleFlow = params.isGoogleFlow === 'true';
  const googleUserId = params.googleUserId as string | undefined;
  const googleFullName = params.fullName as string | undefined;
  const googleEmail = params.email as string | undefined;

  const [selectedType, setSelectedType] = useState<'user' | 'expert' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation refs for card scaling
  const userCardScale = useRef(new Animated.Value(1)).current;
  const expertCardScale = useRef(new Animated.Value(1)).current;

  const animateCardPress = (cardType: 'user' | 'expert') => {
    const scaleValue = cardType === 'user' ? userCardScale : expertCardScale;
    
    // Scale up to 1.05x then back to 1x
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRoleSelection = (type: 'user' | 'expert') => {
    setSelectedType(type);
    animateCardPress(type);
  };

  const handleContinue = async () => {
    if (!selectedType) return;

    setIsLoading(true);
    try {
      // If Google flow, complete onboarding first to set account type
      if (isGoogleFlow && googleUserId) {
        const accountType = selectedType === 'expert' ? 'Expert' : 'User';
        const response = await authService.completeGoogleOnboarding({
          googleUserId,
          accountType,
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to complete onboarding');
        }
      }

      const routeParams: any = {};
      if (isGoogleFlow && googleUserId) {
        routeParams.isGoogleFlow = 'true';
        routeParams.googleUserId = googleUserId;
        if (googleFullName) routeParams.fullName = googleFullName;
        if (googleEmail) routeParams.email = googleEmail;
      }

      if (selectedType === 'user') {
        router.push({
          pathname: '/(auth)/create-account',
          params: routeParams
        });
      } else if (selectedType === 'expert') {
        router.push({
          pathname: '/(expert)/expert-registration',
          params: routeParams
        });
      }
    } catch (error: any) {
      console.error('Onboarding completion error:', error);
      const apiError = error as ApiError;
      showErrorToast(
        'Error',
        apiError.message || 'Failed to complete setup. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A0F0E4" />
      
      <LinearGradient
        colors={['#2da898ff', '#abeee6ff']}
        style={styles.backgroundGradient}
      >
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Join Zenovia</Text>
            <Text style={styles.subtitle}>How would you like to join?</Text>
          </View>
          
          {/* Form Section */}
          <View style={styles.formSection}>
            {/* User Option */}
            <Animated.View style={{ transform: [{ scale: userCardScale }] }}>
              <TouchableOpacity
                style={[styles.optionCard, selectedType === 'user' && styles.selectedOption]}
                onPress={() => handleRoleSelection('user')}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, selectedType === 'user' && styles.selectedIconContainer]}>
                  <UserIcon size={50} isSelected={selectedType === 'user'} />
                </View>
                <Text style={styles.optionTitle}>I&apos;m a User</Text>
                <Text style={styles.optionDescription}>
                  Join classes and find wellness experts.
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Expert Option */}
            <Animated.View style={{ transform: [{ scale: expertCardScale }] }}>
              <TouchableOpacity
                style={[styles.optionCard, selectedType === 'expert' && styles.selectedOption]}
                onPress={() => handleRoleSelection('expert')}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, selectedType === 'expert' && styles.selectedIconContainer]}>
                  <ExpertIcon size={50} isSelected={selectedType === 'expert'} />
                </View>
                <Text style={styles.optionTitle}>I&apos;m an Expert</Text>
                <Text style={styles.optionDescription}>
                  Offer your services as certified provider.
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Continue Button */}
            {selectedType ? (
              <LinearGradient
                colors={['#F59E0B', '#D97706', '#B45309']}
                style={styles.continueButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity
                  style={styles.gradientButtonContent}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>
                      Continue as {selectedType === 'user' ? 'User' : 'Expert'}
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                style={[styles.continueButton, styles.disabledButton]}
                disabled={true}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            )}

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>

             {/* Footer Section */}
            <View style={styles.termsContainer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our{' '}
              </Text>
              <Pressable onPress={() => router.push('/(public)/terms-of-service')}>
                <Text style={styles.termsLink}>Terms of Service</Text>
              </Pressable>
              <Text style={styles.footerText}> and </Text>
              <Pressable onPress={() => router.push('/(public)/privacy-policy')}>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Pressable>
              <Text style={styles.footerText}>.</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 20 : screenData.isMedium ? 24 : 32),
    paddingTop: getResponsiveHeight(screenData.isSmall ? 80 : 100),
    paddingBottom: getResponsiveHeight(30),
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(screenData.isSmall ? 30 : 40),
  },
  title: {
    fontSize: screenData.isSmall ? 36 : screenData.isMedium ? 42 : 48,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(16),
    letterSpacing: -0.5,
    lineHeight: screenData.isSmall ? 40 : screenData.isMedium ? 46 : 52,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: screenData.isSmall ? 18 : screenData.isMedium ? 20 : 22,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: screenData.isSmall ? 24 : screenData.isMedium ? 26 : 28,
    fontWeight: '400',
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 20 : 10),
    opacity: 0.95,
  },
  formSection: {
    flex: 1,
    justifyContent: 'flex-start',
    maxWidth: getResponsiveWidth(400),
    alignSelf: 'center',
    width: '100%',
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(screenData.isSmall ? 20 : 24),
    alignItems: 'center',
    marginBottom: getResponsiveMargin(16),
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    minHeight: getResponsiveHeight(screenData.isSmall ? 130 : 150),
  },
  selectedOption: {
    borderColor: '#2da898ff',
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: '#2da898ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  iconContainer: {
    width: getResponsiveWidth(screenData.isSmall ? 60 : 70),
    height: getResponsiveHeight(screenData.isSmall ? 60 : 70),
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 30 : 35),
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(16),
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  selectedIconContainer: {
    backgroundColor: '#2da898ff',
    borderColor: '#2da898ff',
    borderWidth: 3,
  },
  optionTitle: {
    fontSize: screenData.isSmall ? 20 : 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: getResponsiveMargin(10),
    textAlign: 'center',
  },
optionDescription: {
    fontSize: fontSizes.sm,
    color: '#666666',
    textAlign: 'center',
    lineHeight: fontSizes.sm * 1.4,
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 8 : 0),
  },
continueButton: {
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 14 : 16),
    alignItems: 'center',
    marginTop: getResponsiveMargin(16),
    marginBottom: getResponsiveMargin(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    minHeight: getResponsiveHeight(screenData.isSmall ? 45 : 50),
  },
  gradientButtonContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: getResponsiveMargin(16),
    flexWrap: 'wrap',
  },
  loginText: {
    fontSize: fontSizes.md,
    color: '#666666',
    fontWeight: '400',
  },
  loginLink: {
    fontSize: fontSizes.md,
    color: '#575623ff',
    fontWeight: 'bold',
  },
  footerSection: {
    marginTop: 'auto',
    paddingTop: getResponsivePadding(16),
    paddingBottom: getResponsivePadding(8),
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getResponsivePadding(20),
  },
  footerText: {
    fontSize: fontSizes.xs,
    color: '#666666',
    lineHeight: fontSizes.xs * 1.5,
    opacity: 0.8,
  },
  termsLink: {
    fontSize: fontSizes.xs,
    color: '#575623ff', // Gold accent color matching Zenovia brand
    lineHeight: fontSizes.xs * 1.5,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
