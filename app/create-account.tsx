import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiService, handleApiError } from '../src/services/apiService';
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
import { showErrorToast, showSuccessToast } from '../src/utils/toastConfig';

export default function CreateAccountScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    // Validation
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
      showErrorToast('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorToast('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      showErrorToast('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Phone number validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      showErrorToast('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.register({
        fullName,
        email,
        phoneNumber,
        password
      });
      
      if (response.success) {
        showSuccessToast('Success', 'Account created successfully!');
        // Navigate to login or dashboard
        router.replace('/login');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      showErrorToast('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
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
                style={[styles.input, email ? styles.inputFilled : null]}
                placeholder="you@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={[styles.input, phoneNumber ? styles.inputFilled : null]}
                placeholder="(123) 456-7890"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

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
                Must be at least 8 characters.
              </Text>
            </View>

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
    marginBottom: getResponsiveMargin(screenData.isSmall ? 24 : 40),
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
  inputGroup: {
    marginBottom: getResponsiveMargin(16),
  },
  inputLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: '#575623ff',
    marginBottom: getResponsiveMargin(8),
    paddingLeft: getResponsivePadding(11),
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
  inputFilled: {
    borderColor: '#2da898ff',
    borderWidth: 2,
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
    minHeight: getResponsiveHeight(screenData.isSmall ? 48 : 54),
  },
  eyeIcon: {
    position: 'absolute',
    right: getResponsivePadding(20),
    top: getResponsivePadding(screenData.isSmall ? 14 : 16),
    padding: getResponsivePadding(4),
  },
  eyeIconText: {
    fontSize: getResponsiveFontSize(18),
  },
  passwordRequirement: {
    fontSize: fontSizes.xs,
    color: '#575623ff',
    marginTop: getResponsiveMargin(7),
    paddingLeft: getResponsivePadding(11),
  },
  createButton: {
    backgroundColor: '#2da898ff',
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 16 : 18),
    alignItems: 'center',
    marginTop: getResponsiveMargin(30),
    marginBottom: getResponsiveMargin(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    minHeight: getResponsiveHeight(screenData.isSmall ? 50 : 56),
  },
  createButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getResponsiveMargin(20),
    flexWrap: 'wrap',
  },
  loginText: {
    fontSize: fontSizes.md,
    color: '#575623ff',
  },
  loginLink: {
    fontSize: fontSizes.md,
    color: '#575623ff',
    fontWeight: '600',
    textDecorationLine: 'none',
  },
});