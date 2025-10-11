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
    getResponsivePadding
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
            <Text style={styles.title}>Welcome to Zenovia</Text>
            <Text style={styles.subtitle}>Join our community of wellness{'\n'}enthusiasts and experts.</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>Login</Text>
            
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
                    {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Forgot Password Link */}
            <Pressable style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>

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

            {/* OR Divider */}
            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <Pressable style={styles.socialButton}>
                <GoogleLogo width={24} height={24} />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </Pressable>

              <Pressable style={styles.socialButton}>
                <AppleLogo width={24} height={24} />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </Pressable>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <Pressable onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Pressable>
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
    paddingVertical: getResponsivePadding(20),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(40),
    paddingTop: getResponsivePadding(40),
  },
  title: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: getResponsiveMargin(20),
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  loginTitle: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(24),
  },
  inputContainer: {
    marginBottom: getResponsiveMargin(16),
  },
  inputLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#374151',
    marginBottom: getResponsiveMargin(8),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: getResponsiveBorderRadius(12),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(16),
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: getResponsiveBorderRadius(12),
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(16),
    color: '#1F2937',
  },
  eyeButton: {
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
  },
  eyeText: {
    fontSize: getResponsiveFontSize(18),
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: getResponsiveMargin(24),
  },
  forgotPasswordText: {
    fontSize: getResponsiveFontSize(14),
    color: '#2da898ff',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2da898ff',
    borderRadius: getResponsiveBorderRadius(12),
    paddingVertical: getResponsivePadding(16),
    alignItems: 'center',
    marginBottom: getResponsiveMargin(24),
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(24),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  orText: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    marginHorizontal: getResponsiveMargin(16),
    fontWeight: '500',
  },
  socialButtonsContainer: {
    marginBottom: getResponsiveMargin(24),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: getResponsiveBorderRadius(12),
    paddingVertical: getResponsivePadding(12),
    marginBottom: getResponsiveMargin(12),
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontSize: getResponsiveFontSize(16),
    color: '#374151',
    fontWeight: '600',
    marginLeft: getResponsiveMargin(12),
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: getResponsiveFontSize(14),
    color: '#2da898ff',
    fontWeight: '600',
  },
});