import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import authService, { ApiError } from '@/services/authService';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
  screenData
} from '@/utils/dimensions';
import { showErrorToast, showSuccessToast } from '@/utils/toastConfig';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    // Email validation
    if (!email.trim()) {
      showErrorToast('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorToast('Error', 'Please enter a valid email address');
      return;
    }

    console.log(`🚀 Forgot password button pressed`);

    setIsLoading(true);
    try {
      // Use forgotPassword method which has enhanced logging
      const response = await authService.forgotPassword({ email });
      
      if (response.success) {
        showSuccessToast('Success', 'OTP sent to your email!');
        // Navigate to OTP verification with email parameter for password reset
        router.push({
          pathname: '/(auth)/otp-verification',
          params: { email, type: 'password_reset' }
        });
      }
    } catch (error: any) {
      const apiError = error as ApiError;
      showErrorToast('Failed to Send OTP', apiError.message || 'Unable to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
      console.log(`🏁 Forgot password request complete`);
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
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
          {/* Header */}
          <View style={styles.headerContainer}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
          </View>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email number to receive{'\n'}a one-time password (OTP).
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Pressable 
              style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
              onPress={handleSendOTP}
              disabled={isLoading}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Text>
            </Pressable>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Remember your password? </Text>
              <Pressable onPress={handleLogin}>
                <Text style={styles.loginLink}>Log In</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
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
    paddingTop: getResponsiveHeight(screenData.isSmall ? 50 : 60),
    paddingBottom: getResponsiveHeight(40),
    justifyContent: 'center',
    minHeight: screenData.height - getResponsiveHeight(80),
  },
  headerContainer: {
    position: 'absolute',
    top: getResponsiveHeight(screenData.isSmall ? 50 : 60),
    left: getResponsivePadding(screenData.isSmall ? 20 : screenData.isMedium ? 24 : 32),
    zIndex: 10,
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backArrow: {
    fontSize: fontSizes.lg,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(screenData.isSmall ? 25 : 35),
    marginTop: getResponsiveMargin(0),
  },
  title: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 32 : screenData.isMedium ? 36 : 40),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(16),
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 16 : screenData.isMedium ? 17 : 18),
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: getResponsiveFontSize(screenData.isSmall ? 24 : screenData.isMedium ? 26 : 28),
    fontWeight: '400',
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 10 : 0),
    opacity: 0.95,
  },
  formSection: {
    maxWidth: getResponsiveWidth(400),
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: getResponsivePadding(4),
  },
  inputContainer: {
    marginBottom: getResponsiveMargin(16),
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(25),
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 14 : 16),
    fontSize: fontSizes.md,
    color: '#333333',
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: getResponsiveHeight(screenData.isSmall ? 48 : 54),
  },
  sendButton: {
    backgroundColor: '#2da898ff',
    marginTop: getResponsiveMargin(12),
    marginBottom: getResponsiveMargin(24),
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 16 : 18),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    minHeight: getResponsiveHeight(screenData.isSmall ? 50 : 56),
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: getResponsiveMargin(screenData.isSmall ? 15 : 20),
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
    marginTop: getResponsiveMargin(screenData.isSmall ? 20 : 30),
    paddingBottom: getResponsivePadding(20),
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
