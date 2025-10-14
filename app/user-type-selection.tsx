import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
  screenData
} from '../src/utils/dimensions';

const { width, height } = Dimensions.get('window');

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<'user' | 'expert' | null>(null);
  const router = useRouter();

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
            <TouchableOpacity
              style={[styles.optionCard, selectedType === 'user' && styles.selectedOption]}
              onPress={() => setSelectedType('user')}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, selectedType === 'user' && styles.selectedIconContainer]}>
                <Text style={styles.icon}>👩‍🦰</Text>
              </View>
              <Text style={styles.optionTitle}>I'm a User</Text>
              <Text style={styles.optionDescription}>
                Join classes and find wellness experts.
              </Text>
            </TouchableOpacity>

            {/* Expert Option */}
            <TouchableOpacity
              style={[styles.optionCard, selectedType === 'expert' && styles.selectedOption]}
              onPress={() => setSelectedType('expert')}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, selectedType === 'expert' && styles.selectedIconContainer]}>
                <Text style={styles.icon}>⭐</Text>
              </View>
              <Text style={styles.optionTitle}>I'm an Expert</Text>
              <Text style={styles.optionDescription}>
                Offer your services as certified provider.
              </Text>
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.continueButton, !selectedType && styles.disabledButton]}
              onPress={handleContinue}
              disabled={!selectedType}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Text>
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
    fontWeight: 'bold',
    color: '#f3f3f3ff',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(12),
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
  icon: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 28 : 32),
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
    backgroundColor: '#2da898ff',
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
  footerText: {
    fontSize: fontSizes.xs,
    color: '#666666',
    textAlign: 'center',
    lineHeight: fontSizes.xs * 1.5,
    opacity: 0.8,
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 20 : 0),
  },
});
