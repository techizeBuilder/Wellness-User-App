import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import authService, { ApiError } from '../src/services/authService';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
} from '../src/utils/dimensions';
import { showErrorToast, showSuccessToast } from '../src/utils/toastConfig';

export default function OTPVerificationScreen() {
  const { email, type } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  // Refs for auto-focus and auto-fill
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Auto-fill OTP when pasted
  const handleOtpPaste = (text: string, index: number) => {
    // If text is longer than 1 character, it's likely a paste operation
    if (text.length > 1) {
      // Extract only digits and take first 6
      const digits = text.replace(/\\D/g, '').slice(0, 6);
      const newOtp = [...otp];
      
      // Fill from current index
      for (let i = 0; i < digits.length && (index + i) < 6; i++) {
        newOtp[index + i] = digits[i];
      }
      
      setOtp(newOtp);
      
      // Focus the last filled input or next empty one
      const lastFilledIndex = Math.min(index + digits.length - 1, 5);
      const nextEmptyIndex = newOtp.findIndex((digit, idx) => idx > lastFilledIndex && digit === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
      
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
      }, 100);
      
      return;
    }
    
    // Single character input
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input if value is entered
    if (text && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 100);
    }
  };

  // Handle backspace to move to previous input
  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 100);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      showErrorToast('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    if (!email) {
      showErrorToast('Error', 'Email not found. Please start the process again.');
      router.push('/forgot-password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyPasswordResetOTP({
        email: email as string,
        otp: otpCode,
        type: 'password_reset'
      });
      
      showSuccessToast('Success', 'OTP verified successfully!');
      // Navigate to reset password screen with the reset token
      router.push({
        pathname: '/reset-password',
        params: { 
          email, 
          resetToken: response.data?.resetToken || ''
        }
      });
    } catch (error) {
      const apiError = error as ApiError;
      showErrorToast('Verification Failed', apiError.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showErrorToast('Error', 'Email not found. Please start the process again.');
      router.push('/forgot-password');
      return;
    }

    setResendLoading(true);
    try {
      const response = await authService.requestPasswordReset({ email: email as string });
      
      showSuccessToast('Success', 'New OTP sent to your email!');
      // Clear current OTP
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      const apiError = error as ApiError;
      showErrorToast('Failed to Resend', apiError.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleChangeEmail = () => {
    // Navigate back to enter email/phone
    router.back();
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
          {/* Header with close button */}
          <View style={styles.headerContainer}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
          </View>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Verify Your Account</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to your email.{'\n'}Please enter it below to continue.
            </Text>
          </View>

          {/* OTP Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => handleOtpPaste(text, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="numeric"
                  maxLength={6} // Allow paste of full OTP
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Resend Section */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <Pressable onPress={handleResendCode} disabled={resendLoading}>
                <Text style={styles.resendLink}>
                  {resendLoading ? 'Sending...' : 'Resend'}
                </Text>
              </Pressable>
            </View>

            {/* Verify Button */}
            <Pressable 
              style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]} 
              onPress={handleVerify}
              disabled={isLoading}
            >
              <Text style={styles.verifyButtonText}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </Text>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(20),
    paddingTop: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(20),
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
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2da898ff',
    marginBottom: 12,
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#E1E5E9',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    color: '#2da898ff',
    backgroundColor: '#FFFFFF',
  },
  resendContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  resendText: {
    fontSize: 16,
    color: '#666',
  },
  resendLink: {
    fontSize: 16,
    color: '#2da898ff',
    fontWeight: '600',
  },
  changeEmailLink: {
    fontSize: 16,
    color: '#2da898ff',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  verifyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#2da898ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});