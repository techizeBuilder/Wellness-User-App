import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
  screenData
} from '../src/utils/dimensions';

const { width, height } = Dimensions.get('window');

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
  const [selectedType, setSelectedType] = useState<'user' | 'expert' | null>(null);
  
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

  const handleContinue = () => {
    if (selectedType === 'user') {
      router.push('/create-account');
    } else if (selectedType === 'expert') {
      router.push('/expert-registration');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A0F0E4" />
      
      <LinearGradient
        colors={['#2da898ff', '#abeee6ff']}
        style={styles.backgroundGradient}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
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
                <Text style={styles.optionTitle}>I'm a User</Text>
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
                <Text style={styles.optionTitle}>I'm an Expert</Text>
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
                >
                  <Text style={styles.buttonText}>
                    Continue as {selectedType === 'user' ? 'User' : 'Expert'}
                  </Text>
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
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>

             {/* Footer Section */}
            <View style={styles.termsContainer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our{' '}
              </Text>
              <Pressable onPress={() => router.push('/terms-of-service')}>
                <Text style={styles.termsLink}>Terms of Service</Text>
              </Pressable>
              <Text style={styles.footerText}> and </Text>
              <Pressable onPress={() => router.push('/privacy-policy')}>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Pressable>
              <Text style={styles.footerText}>.</Text>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 20 : screenData.isMedium ? 24 : 32),
    paddingTop: getResponsiveHeight(screenData.isSmall ? 40 : 60),
    paddingBottom: getResponsiveHeight(30),
    justifyContent: 'center',
    minHeight: screenData.height - getResponsiveHeight(100),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(screenData.isSmall ? 30 : 40),
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: '700',
    color: '#f3f3f3ff',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(12),
    letterSpacing: -0.8,
    lineHeight: fontSizes.xxxl * 1.1,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: '#f3f3f3ff',
    textAlign: 'center',
    lineHeight: fontSizes.md * 1.5,
    fontWeight: '400',
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 10 : 0),
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    minHeight: getResponsiveHeight(screenData.isSmall ? 140 : 160),
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
    width: getResponsiveWidth(screenData.isSmall ? 56 : 64),
    height: getResponsiveHeight(screenData.isSmall ? 56 : 64),
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 28 : 32),
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(16),
  },
  selectedIconContainer: {
    backgroundColor: '#2da898ff',
  },
  optionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: getResponsiveMargin(8),
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
    paddingVertical: getResponsivePadding(screenData.isSmall ? 16 : 18),
    alignItems: 'center',
    marginTop: getResponsiveMargin(24),
    marginBottom: getResponsiveMargin(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    minHeight: getResponsiveHeight(screenData.isSmall ? 50 : 56),
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
