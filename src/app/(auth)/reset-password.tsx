import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import authService, { ApiError } from '@/services/authService';
import { colors } from '@/utils/colors';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth
} from '@/utils/dimensions';
import { showErrorToast, showSuccessToast } from '@/utils/toastConfig';

export default function ResetPasswordScreen() {
  const { email, resetToken } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    // Validation
    if (!newPassword || !confirmPassword) {
      showErrorToast('Error', 'Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorToast('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      showErrorToast('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!email || !resetToken) {
      showErrorToast('Error', 'Session expired. Please start the process again.');
      router.push('/(auth)/forgot-password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword({
        password: newPassword,
        confirmPassword: confirmPassword,
        resetToken: resetToken as string
      });
      
      showSuccessToast('Success', 'Password reset successfully!');
      // Navigate to login screen
      router.push('/(auth)/login');
    } catch (error) {
      const apiError = error as ApiError;
      showErrorToast('Reset Failed', apiError.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2da898ff" />
      
      <LinearGradient
        colors={['#2da898ff', '#abeee6ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with back button */}
          <View style={styles.headerContainer}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
          </View>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Create a new password for your Zenovia account.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!isNewPasswordVisible}
          />
          <Pressable 
            style={styles.eyeIcon}
            onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
          >
            <Text style={styles.eyeIconText}>
              {isNewPasswordVisible ? '🙈' : '👁️'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
          />
          <Pressable 
            style={styles.eyeIcon}
            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          >
            <Text style={styles.eyeIconText}>
              {isConfirmPasswordVisible ? '🙈' : '👁️'}
            </Text>
          </Pressable>
        </View>

            <Text style={styles.requirement}>
              Password must be at least 8 characters long
            </Text>

            {/* Reset Button */}
            <Pressable 
              style={[styles.resetButton, isLoading && styles.resetButtonDisabled]} 
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Text>
            </Pressable>

            {/* Back to Login */}
            <Pressable style={styles.backToLogin} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </Pressable>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: getResponsivePadding(20),
    paddingTop: getResponsiveHeight(20),
    paddingBottom: getResponsiveHeight(30),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(20),
    paddingTop: getResponsivePadding(20),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: getResponsiveFontSize(20),
    color: colors.white,
    fontWeight: 'bold',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(30),
    paddingHorizontal: getResponsivePadding(20),
  },
  title: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: getResponsiveMargin(12),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: colors.white,
    lineHeight: getResponsiveHeight(22),
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    alignItems: 'center',
    maxWidth: getResponsiveWidth(400),
    alignSelf: 'center',
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: getResponsiveMargin(20),
    width: '100%',
  },
  inputLabel: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: '#575623ff',
    marginBottom: getResponsiveMargin(8),
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: getResponsiveBorderRadius(12),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(16),
    fontSize: getResponsiveFontSize(16),
    color: '#333333',
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eyeIcon: {
    position: 'absolute',
    right: getResponsiveWidth(16),
    top: getResponsiveHeight(44),
    padding: getResponsivePadding(4),
    zIndex: 1,
  },
  eyeIconText: {
    fontSize: getResponsiveFontSize(18),
    color: '#666',
  },
  requirement: {
    fontSize: getResponsiveFontSize(14),
    color: '#575623ff',
    marginTop: getResponsiveMargin(8),
    marginBottom: getResponsiveMargin(30),
    paddingHorizontal: getResponsivePadding(4),
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#2da898ff',
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(16),
    paddingHorizontal: getResponsivePadding(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    minHeight: getResponsiveHeight(56),
    width: '80%',
    alignSelf: 'center',
  },
  resetButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  resetButtonText: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: colors.white,
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: getResponsiveMargin(10),
  },
  backToLoginText: {
    fontSize: getResponsiveFontSize(16),
    color: '#575623ff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
