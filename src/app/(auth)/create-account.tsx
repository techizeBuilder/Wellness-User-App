import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiService } from '@/services/apiService';
import { authService } from '@/services/authService';
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
import { handleRegistrationError, logErrorSafely } from '@/utils/errorHandler';
import { showErrorToast, showSuccessToast } from '@/utils/toastConfig';

export default function CreateAccountScreen() {
  const params = useLocalSearchParams();
  const isGoogleFlow = params.isGoogleFlow === 'true';
  const googleUserId = params.googleUserId as string | undefined;
  const googleFullName = params.fullName as string | undefined;
  const googleEmail = params.email as string | undefined;

  const [fullName, setFullName] = useState(googleFullName || '');
  const [email, setEmail] = useState(googleEmail || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill Google data on mount
  useEffect(() => {
    if (isGoogleFlow) {
      if (googleFullName) setFullName(googleFullName);
      if (googleEmail) setEmail(googleEmail);
    }
  }, [isGoogleFlow, googleFullName, googleEmail]);

  const handleCreateAccount = async () => {
    // Basic validation - password not required for Google flow
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || (!isGoogleFlow && !password.trim())) {
      showErrorToast('Validation Error', 'Please fill in all required fields');
      return;
    }

    // Name validation - ensure we have at least first name
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length < 1 || nameParts[0].length < 2) {
      showErrorToast('Validation Error', 'Please enter your full name (at least first name with 2+ characters)');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorToast('Validation Error', 'Please enter a valid email address');
      return;
    }

    // Enhanced password validation - only for non-Google flow
    if (!isGoogleFlow && password.length < 6) {
      showErrorToast('Validation Error', 'Password must be at least 6 characters long');
      return;
    }

    // Phone number validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      showErrorToast('Validation Error', 'Please enter a valid phone number (at least 10 digits)');
      return;
    }

    setIsLoading(true);
    try {
      // Handle Google flow differently
      if (isGoogleFlow && googleUserId) {
        // Split full name into first and last
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || fullName;
        const lastName = nameParts.slice(1).join(' ') || firstName;

        // Update Google user profile
        const response = await authService.updateGoogleUserProfile({
          userId: googleUserId,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          phone: phoneNumber.replace(/\D/g, ''),
        });

        if (response.success) {
          showSuccessToast('Success', 'Profile updated successfully!');
          router.replace('/(user)/dashboard');
        } else {
          showErrorToast('Registration Failed', response.message || 'Unknown error occurred');
        }
      } else {
        // Regular registration flow
        const response = await apiService.register({
          fullName,
          email,
          phoneNumber,
          password
        });
        
        if (response.success) {
          // OTP has been sent, redirect to OTP verification screen
          showSuccessToast('OTP Sent', 'Please check your email for the verification code.');
          
          // Redirect to OTP verification screen with email
          router.push({
            pathname: '/(auth)/verify-registration-otp',
            params: { email }
          });
        } else {
          showErrorToast('Registration Failed', response.message || 'Unknown error occurred');
        }
      }
    } catch (error) {
      // Use enhanced error handling to avoid console spam for validation errors
      const errorInfo = handleRegistrationError(error);
      logErrorSafely(error, 'Registration error');
      showErrorToast('Registration Failed', errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <LinearGradient
      colors={['#2da898ff', '#abeee6ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#A0F0E4" />
      
        <View style={styles.mainContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your wellness journey with us.</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={[styles.input, fullName ? styles.inputFilled : null]}
                placeholder="John Doe"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[
                  styles.input, 
                  email ? styles.inputFilled : null,
                  isGoogleFlow && styles.inputDisabled
                ]}
                placeholder="you@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isGoogleFlow}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={[styles.input, phoneNumber ? styles.inputFilled : null]}
                placeholder="+91 98765 43210"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            {!isGoogleFlow && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, password ? styles.inputFilled : null]}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                  />
                  <Pressable 
                    style={styles.eyeIcon}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <Text style={styles.eyeIconText}>
                      {isPasswordVisible ? '🙈' : '👁️'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.passwordRequirement}>
                  Must be at least 6 characters.
                </Text>
              </View>
            )}

            <Pressable 
              style={[styles.createButton, isLoading && styles.createButtonDisabled]} 
              onPress={handleCreateAccount}
              disabled={isLoading}
            >
              <Text style={styles.createButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Pressable>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Pressable onPress={handleLogin}>
                <Text style={styles.loginLink}>Log In</Text>
              </Pressable>
            </View>
          </View>
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 20 : screenData.isMedium ? 24 : 32),
    paddingTop: getResponsiveHeight(screenData.isSmall ? 60 : 80),
    paddingBottom: getResponsiveHeight(screenData.isSmall ? 40 : 50),
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(screenData.isSmall ? 25 : 30),
    marginTop: getResponsiveMargin(screenData.isSmall ? 0 : 10),
  },
  title: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 34 : screenData.isMedium ? 38 : 42),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(12),
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 14 : screenData.isMedium ? 16 : 17),
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: getResponsiveFontSize(screenData.isSmall ? 20 : screenData.isMedium ? 24 : 26),
    fontWeight: '400',
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 10 : 0),
    opacity: 0.95,
  },
  formSection: {
    maxWidth: getResponsiveWidth(400),
    alignSelf: 'center',
    width: '100%',
  },
  inputGroup: {
    marginBottom: getResponsiveMargin(screenData.isSmall ? 14 : 16),
  },
  inputLabel: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 13 : 14),
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: getResponsiveMargin(8), 
    paddingLeft: getResponsivePadding(12),
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
    minHeight: getResponsiveHeight(screenData.isSmall ? 45 : 50),
  },
  inputFilled: {
    borderColor: '#2da898ff',
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.7,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(25),
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 14 : 16),
    paddingRight: getResponsivePadding(55),
    fontSize: fontSizes.md,
    color: '#333333',
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: getResponsiveHeight(screenData.isSmall ? 45 : 50),
  },
  eyeIcon: {
    position: 'absolute',
    right: getResponsivePadding(20),
    top: getResponsivePadding(screenData.isSmall ? 12 : 14),
    padding: getResponsivePadding(4),
  },
  eyeIconText: {
    fontSize: getResponsiveFontSize(18),
  },
  passwordRequirement: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 12 : 13),
    color: '#6b7280',
    marginTop: getResponsiveMargin(8),
    paddingLeft: getResponsivePadding(12),
    fontWeight: '400',
  },
  createButton: {
    backgroundColor: '#2da898ff',
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 16 : 18),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getResponsiveMargin(screenData.isSmall ? 20 : 25),
    marginBottom: getResponsiveMargin(screenData.isSmall ? 15 : 20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    minHeight: getResponsiveHeight(screenData.isSmall ? 50 : 54),
  },
  createButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: getResponsiveFontSize(screenData.isSmall ? 16 : screenData.isMedium ? 17 : 18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getResponsiveMargin(screenData.isSmall ? 10 : 15),
    marginBottom: getResponsiveMargin(screenData.isSmall ? 15 : 20),
    flexWrap: 'wrap',
    paddingHorizontal: getResponsivePadding(20),
  },
  loginText: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 14 : 15),
    color: '#4a5568',
    textAlign: 'center',
  },
  loginLink: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 14 : 15),
    color: '#575623ff',
    fontWeight: '600',
    textDecorationLine: 'none q',
  },
});
