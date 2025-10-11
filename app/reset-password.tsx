import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import authService, { ApiError } from '../src/services/authService';
import { colors } from '../src/utils/colors';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '../src/utils/dimensions';
import { showErrorToast, showSuccessToast } from '../src/utils/toastConfig';

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
      router.push('/forgot-password');
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
      router.push('/login');
    } catch (error) {
      const apiError = error as ApiError;
      showErrorToast('Reset Failed', apiError.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Create a new password for your Zenovia account.
        </Text>
      </View>

      <View style={styles.form}>
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
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={[styles.resetButton, isLoading && { opacity: 0.7 }]} 
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#14B8A6', '#0D9488']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.resetButtonText}>
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={styles.backToLogin} onPress={() => router.push('/login')}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2DD4BF',
  },
  header: {
    paddingTop: getResponsivePadding(50),
    paddingHorizontal: getResponsivePadding(24),
    paddingBottom: getResponsivePadding(40),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsiveMargin(24),
  },
  backArrow: {
    fontSize: getResponsiveFontSize(20),
    color: colors.deepTeal,
    fontWeight: 'bold',
  },
  title: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: getResponsiveMargin(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#666',
    lineHeight: getResponsiveHeight(22),
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(24),
  },
  inputContainer: {
    position: 'relative',
    marginBottom: getResponsiveMargin(20),
  },
  inputLabel: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: colors.deepTeal,
    marginBottom: getResponsiveMargin(8),
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(12),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(16),
    fontSize: getResponsiveFontSize(16),
    color: '#333333',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  eyeIcon: {
    position: 'absolute',
    right: getResponsiveWidth(16),
    top: getResponsiveHeight(44),
    padding: getResponsivePadding(4),
  },
  eyeIconText: {
    fontSize: getResponsiveFontSize(16),
  },
  requirement: {
    fontSize: getResponsiveFontSize(14),
    color: '#666',
    marginTop: getResponsiveMargin(8),
    paddingHorizontal: getResponsivePadding(4),
  },
  footer: {
    paddingHorizontal: getResponsivePadding(24),
    paddingBottom: getResponsivePadding(40),
  },
  resetButton: {
    borderRadius: getResponsiveBorderRadius(12),
    overflow: 'hidden',
    marginBottom: getResponsiveMargin(16),
    shadowColor: colors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: getResponsivePadding(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.5,
  },
  backToLogin: {
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: getResponsiveFontSize(16),
    color: '#F59E0B',
    fontWeight: '600',
  },
});