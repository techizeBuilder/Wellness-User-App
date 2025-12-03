import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiService } from '@/services/apiService';
import { colors } from '@/utils/colors';
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

type Step = 'request' | 'verify' | 'reset';

export default function ResetPasswordScreen() {
  const [step, setStep] = useState<Step>('request');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  
  // Refs for OTP inputs
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const requestOTP = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.requestPasswordResetOTP();
      if (response.success) {
        showSuccessToast('OTP Sent', 'Please check your email for the OTP code');
        setStep('verify');
      } else {
        showErrorToast('Error', response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      showErrorToast('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await requestOTP();
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOTP = useCallback(async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      showErrorToast('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.verifyPasswordResetOTP(otpCode);
      if (response.success) {
        setOtpVerified(true);
        setStep('reset');
        showSuccessToast('Verified', 'OTP verified successfully. Please set your new password');
      } else {
        showErrorToast('Error', response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      showErrorToast('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  }, [otp]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    const otpCode = otp.join('');
    if (otpCode.length === 6 && step === 'verify' && !isLoading && !otpVerified) {
      const timer = setTimeout(() => {
        handleVerifyOTP();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [otp.join(''), step, isLoading, otpVerified, handleVerifyOTP]);

  const handleOtpChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      const digits = numericText.slice(0, 6);
      const newOtp = [...otp];
      
      for (let i = 0; i < digits.length && (index + i) < 6; i++) {
        newOtp[index + i] = digits[i];
      }
      
      setOtp(newOtp);
      
      const lastFilledIndex = Math.min(index + digits.length - 1, 5);
      setTimeout(() => {
        inputRefs.current[lastFilledIndex]?.focus();
      }, 50);
      
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    if (numericText && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 50);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 50);
    }
  };

  const handleResetPassword = async () => {
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

    if (!otpVerified) {
      showErrorToast('Error', 'Please verify OTP first');
      return;
    }

    setIsLoading(true);
    try {
      const otpCode = otp.join('');
      const response = await apiService.resetPasswordWithOTP(otpCode, newPassword);
      if (response.success) {
        showSuccessToast('Success', 'Password reset successfully!');
        router.back();
      } else {
        showErrorToast('Error', response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      showErrorToast('Error', error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2da898ff" />
      
      <LinearGradient
        colors={['#2DD4BF', '#14B8A6', '#0D9488']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
          </View>

          {/* Title Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {step === 'request' && 'We\'ll send an OTP to your email to verify your identity'}
              {step === 'verify' && 'Enter the 6-digit OTP sent to your email'}
              {step === 'reset' && 'Create a new password for your account'}
            </Text>
          </View>

          {/* Request OTP Step */}
          {step === 'request' && (
            <View style={styles.formContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={colors.white} />
              ) : (
                <Pressable 
                  style={styles.button} 
                  onPress={requestOTP}
                >
                  <Text style={styles.buttonText}>Send OTP</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Verify OTP Step */}
          {step === 'verify' && (
            <View style={styles.formContainer}>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref: any) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      digit ? styles.otpInputFilled : null
                    ]}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                    autoFocus={index === 0}
                    placeholder=""
                  />
                ))}
              </View>

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>{"Didn't receive the code? "}</Text>
                <Pressable onPress={handleResendOTP} disabled={resendLoading}>
                  <Text style={styles.resendLink}>
                    {resendLoading ? 'Processing...' : 'Resend'}
                  </Text>
                </Pressable>
              </View>

              <Pressable 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleVerifyOTP}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Reset Password Step */}
          {step === 'reset' && (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={styles.passwordInput}
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
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={styles.passwordInput}
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
              </View>

              <Text style={styles.requirement}>
                Password must be at least 6 characters long
              </Text>

              <Pressable 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Text>
              </Pressable>
            </View>
          )}
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
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(25),
    paddingHorizontal: getResponsivePadding(10),
    width: '100%',
  },
  otpInput: {
    width: getResponsiveWidth(screenData.isSmall ? 45 : 50),
    height: getResponsiveHeight(screenData.isSmall ? 55 : 60),
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: getResponsiveBorderRadius(12),
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: '#333333',
    backgroundColor: colors.white,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: getResponsiveWidth(2),
  },
  otpInputFilled: {
    borderColor: '#2da898ff',
    borderWidth: 2,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(20),
    flexWrap: 'wrap',
    width: '100%',
  },
  resendText: {
    fontSize: fontSizes.md,
    color: '#575623ff',
  },
  resendLink: {
    fontSize: fontSizes.md,
    color: '#575623ff',
    fontWeight: '600',
    textDecorationLine: 'none',
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
  passwordInputWrapper: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: colors.white,
    borderRadius: getResponsiveBorderRadius(12),
    paddingHorizontal: getResponsivePadding(16),
    paddingRight: getResponsivePadding(50),
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
    top: getResponsiveHeight(16),
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
  button: {
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
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: colors.white,
  },
});

