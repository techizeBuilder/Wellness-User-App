import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import authService, { ApiError } from '../src/services/authService';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
  screenData
} from '../src/utils/dimensions';
import { showErrorToast, showSuccessToast } from '../src/utils/toastConfig';

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

    console.log(`🚀 === FORGOT PASSWORD BUTTON PRESSED ===`);
    console.log(`📧 Email entered: ${email}`);

    setIsLoading(true);
    try {
      // Use forgotPassword method which has enhanced logging
      const response = await authService.forgotPassword({ email });
      
      console.log(`✅ Forgot password response:`, response);
      
      if (response.success) {
        showSuccessToast('Success', 'OTP sent to your email!');
        // Navigate to OTP verification with email parameter for password reset
        router.push({
          pathname: '/otp-verification',
          params: { email, type: 'password_reset' }
        });
      }
    } catch (error: any) {
      console.error(`❌ Forgot password error:`, error);
      const apiError = error as ApiError;
      showErrorToast('Failed to Send OTP', apiError.message || 'Unable to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
      console.log(`🏁 === FORGOT PASSWORD REQUEST COMPLETE ===`);
    }
  };

  const handleLogin = () => {
    router.push('/login');
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
              Enter your email or phone number to receive{'\n'}a one-time password (OTP).
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email or Phone Number"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Pressable 
              style={[styles.sendButton, isLoading && { opacity: 0.7 }]} 
              onPress={handleSendOTP}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#14B8A6', '#0D9488']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.sendButtonText}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Text>
              </LinearGradient>
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
    minHeight: screenData.height - getResponsiveHeight(100),
  },
  headerContainer: {
    paddingTop: 0,
    paddingBottom: getResponsivePadding(20),
    alignItems: 'flex-start',
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
    marginBottom: getResponsiveMargin(screenData.isSmall ? 40 : 60),
    marginTop: getResponsiveMargin(30),
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
    maxWidth: getResponsiveWidth(400),
    alignSelf: 'center',
    width: '100%',
    marginBottom: getResponsiveMargin(40),
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
    marginTop: getResponsiveMargin(12),
    marginBottom: getResponsiveMargin(24),
    borderRadius: getResponsiveBorderRadius(25),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    minHeight: getResponsiveHeight(screenData.isSmall ? 50 : 56),
  },
  buttonGradient: {
    paddingVertical: getResponsivePadding(screenData.isSmall ? 14 : 16),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: getResponsiveHeight(screenData.isSmall ? 50 : 56),
  },
  sendButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: getResponsiveMargin(20),
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
    paddingTop: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
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