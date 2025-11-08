import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiService } from '@/services/apiService';
import { authService } from '@/services/authService';
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

export default function VerifyRegistrationOTPScreen() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [hasAutoVerified, setHasAutoVerified] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  
  // Refs for auto-focus and auto-fill
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const handleVerifyRef = useRef<() => Promise<void>>();

  const handleVerify = useCallback(async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      showErrorToast('Error', 'Please enter the complete 6-digit OTP');
      return;
    }

    if (!email) {
      showErrorToast('Error', 'Email not found. Please start the registration process again.');
      router.push('/(auth)/create-account');
      return;
    }

    // Prevent multiple verification attempts
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.verifyRegistrationOTP({
        email: email as string,
        otp: otpCode
      });
      
      if (response.success) {
        // Store token and account type for automatic login
        const responseData = response.data || response;
        if (responseData.token) {
          await apiService.setToken(responseData.token);
          const accountType = responseData.accountType || 'User';
          await authService.setAccountType(accountType);
          
          showSuccessToast('Success', 'Account created successfully!');
          
          // Redirect to user dashboard (auto-login)
          router.replace('/(user)/dashboard');
        } else {
          // Fallback if token is not in response
          showSuccessToast('Success', 'Account created successfully! Please log in.');
          router.replace('/(auth)/login');
        }
      } else {
        showErrorToast('Verification Failed', response.message || 'Failed to verify OTP');
        setHasFailed(true);
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to verify OTP. Please try again.';
      showErrorToast('Verification Failed', errorMessage);
      setHasFailed(true);
    } finally {
      setIsLoading(false);
    }
  }, [otp, email, isLoading]);

  // Store handleVerify in ref to avoid dependency issues
  useEffect(() => {
    handleVerifyRef.current = handleVerify;
  }, [handleVerify]);

  // Auto-verify when all 6 digits are entered (only once, and only if not failed)
  useEffect(() => {
    const otpCode = otp.join('');
    if (otpCode.length === 6 && !isLoading && !hasAutoVerified && !hasFailed) {
      setHasAutoVerified(true);
      // Auto verify after a short delay to ensure user sees the complete OTP
      const timeoutId = setTimeout(() => {
        if (handleVerifyRef.current) {
          handleVerifyRef.current();
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else if (otpCode.length < 6) {
      // Reset flags when user clears OTP
      setHasAutoVerified(false);
      setHasFailed(false);
    }
  }, [otp.join(''), isLoading, hasAutoVerified, hasFailed]);

  // Handle OTP input change
  const handleOtpChange = (text: string, index: number) => {
    // Remove non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    
    // Reset failed state when user starts typing again
    if (hasFailed) {
      setHasFailed(false);
      setHasAutoVerified(false);
    }
    
    // Handle paste operation (multiple digits)
    if (numericText.length > 1) {
      const digits = numericText.slice(0, 6);
      const newOtp = [...otp];
      
      // Fill from current index
      for (let i = 0; i < digits.length && (index + i) < 6; i++) {
        newOtp[index + i] = digits[i];
      }
      
      setOtp(newOtp);
      
      // Focus the appropriate input
      const lastFilledIndex = Math.min(index + digits.length - 1, 5);
      setTimeout(() => {
        inputRefs.current[lastFilledIndex]?.focus();
      }, 50);
      
      return;
    }
    
    // Single digit input
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    // Auto focus next input if value is entered
    if (numericText && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 50);
    }
  };

  // Handle backspace to move to previous input
  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      // Clear previous input and move focus
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 50);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showErrorToast('Error', 'Email not found. Please start the registration process again.');
      router.push('/(auth)/create-account');
      return;
    }

    setResendLoading(true);
    try {
      // Navigate back to create-account with the email pre-filled
      // This will trigger a new registration request which will resend the OTP
      router.push({
        pathname: '/(auth)/create-account',
        params: { email: email as string, resend: 'true' }
      });
      showSuccessToast('Info', 'Please complete the registration form again to receive a new OTP.');
    } catch (error: any) {
      showErrorToast('Failed to Resend', error?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
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
          {/* Header with close button */}
          <View style={styles.headerContainer}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
          </View>

          {/* Main Content Container */}
          <View style={styles.mainContent}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                {`We've sent a 6-digit code to\n${email || 'your email'}\nPlease enter it below to complete your registration.`}
              </Text>
            </View>

          {/* OTP Form Section */}
          <View style={styles.formContainer}>
            {/* OTP Input Container */}
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

            {/* Resend Section */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>{"Didn't receive the code? "}</Text>
              <Pressable onPress={handleResendCode} disabled={resendLoading}>
                <Text style={styles.resendLink}>
                  {resendLoading ? 'Processing...' : 'Resend'}
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
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </Text>
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
    paddingTop: getResponsiveHeight(50),
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
  mainContent: {
    alignItems: 'center',
    marginTop: getResponsiveMargin(0),
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
    marginBottom: getResponsiveMargin(screenData.isSmall ? 25 : 35),
    paddingHorizontal: getResponsivePadding(20),
  },
  title: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 28 : screenData.isMedium ? 32 : 36),
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: getResponsiveMargin(16),
    textAlign: 'center',
    letterSpacing: 0.5,
    flexWrap: 'nowrap',
  },
  subtitle: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 16 : screenData.isMedium ? 17 : 18),
    color: colors.white,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize(screenData.isSmall ? 24 : screenData.isMedium ? 26 : 28),
    fontWeight: '400',
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 10 : 0),
    opacity: 0.95,
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
  verifyButton: {
    backgroundColor: '#2da898ff',
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 16 : 18),
    paddingHorizontal: getResponsivePadding(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getResponsiveMargin(25),
    marginBottom: getResponsiveMargin(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    minHeight: getResponsiveHeight(screenData.isSmall ? 50 : 56),
    width: '100%',
    alignSelf: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
});

