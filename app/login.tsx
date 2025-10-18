import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AppleLogo from '../src/components/AppleLogo';
import GoogleLogo from '../src/components/GoogleLogo';
import authService, { ApiError } from '../src/services/authService';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveMargin,
  getResponsivePadding,
  screenData
} from '../src/utils/dimensions';
import { showErrorToast, showSuccessToast } from '../src/utils/toastConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      showErrorToast('Error', 'Please enter both email and password');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorToast('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        showSuccessToast('Success', 'Login successful!');
        // Navigate to main dashboard after login
        router.replace('/dashboard');
      }
    } catch (error: any) {
      const apiError = error as ApiError;
      showErrorToast('Login Failed', apiError.message || 'Please check your credentials and try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/user-type-selection');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2DD4BF" translucent />
      
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
            <Text style={styles.title}>Welcome to Zenovia</Text>
            <Text style={styles.subtitle}>Join our community of wellness{'\n'}enthusiasts and experts.</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Email or Phone"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Text style={styles.eyeText}>
                    {isPasswordVisible ? '�' : '👁️'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Login Button */}
            <Pressable 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Continuing...' : 'Continue'}
              </Text>
            </Pressable>

            {/* Forgot Password Link */}
            <Pressable style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>

            {/* OR Divider */}
            <View style={styles.orContainer}>
              <Text style={styles.orText}>Or continue with</Text>
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <Pressable style={styles.socialButton}>
                <GoogleLogo />
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>

              <Pressable style={styles.socialButton}>
                <AppleLogo />
                <Text style={styles.socialButtonText}>Apple</Text>
              </Pressable>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <Pressable onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Pressable>
            </View>

            {/* Terms and Privacy */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
              </Text>
              <Pressable onPress={() => router.push('/terms-of-service')}>
                <Text style={styles.termsLink}>Terms of Service</Text>
              </Pressable>
              <Text style={styles.termsText}> and </Text>
              <Pressable onPress={() => router.push('/privacy-policy')}>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Pressable>
              <Text style={styles.termsText}>.</Text>
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
    justifyContent: 'center',
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(40),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(60),
    paddingTop: getResponsivePadding(screenData.isSmall ? 60 : 80),
  },
  title: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 28 : 32),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(12),
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: getResponsiveMargin(20),
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: getResponsiveBorderRadius(25),
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 14 : 16),
    fontSize: getResponsiveFontSize(16),
    color: '#374151',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: getResponsiveBorderRadius(25),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 14 : 16),
    fontSize: getResponsiveFontSize(16),
    color: '#374151',
  },
  eyeButton: {
    paddingHorizontal: getResponsivePadding(15),
    paddingVertical: getResponsivePadding(10),
  },
  eyeText: {
    fontSize: getResponsiveFontSize(18),
  },
  loginButton: {
    backgroundColor: '#2da898ff',
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 16 : 18),
    alignItems: 'center',
    marginBottom: getResponsiveMargin(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(30),
  },
  forgotPasswordText: {
    fontSize: getResponsiveFontSize(14),
    color: '#575623ff',
    fontWeight: '600',
  },
  orContainer: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(30),
  },
  orText: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getResponsiveMargin(30),
    gap: getResponsiveMargin(12),
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 12 : 14),
    paddingHorizontal: getResponsivePadding(16),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  socialButtonText: {
    fontSize: getResponsiveFontSize(14),
    color: '#374151',
    fontWeight: '600',
    marginLeft: getResponsiveMargin(8),
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(30),
  },
  signUpText: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: getResponsiveFontSize(14),
    color: '#575623ff',
    fontWeight: '700',
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getResponsivePadding(20),
    marginTop: getResponsiveMargin(1),
  },
  termsText: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    lineHeight: 18,
  },
  termsLink: {
    fontSize: getResponsiveFontSize(12),
    color: '#575623ff', // Gold accent color matching Zenovia brand
    lineHeight: 18,
    fontWeight: '600',
    textDecorationLine: 'none',
  },
});