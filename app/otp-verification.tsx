import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/utils/colors';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input if value is entered
    if (value && index < 5) {
      const nextInput = `otp-input-${index + 1}`;
      // Focus next input (implementation would need ref management)
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      // Navigate to main app after successful verification
      router.push('/welcome');
    }
  };

  const handleResendCode = () => {
    // Implement resend code logic
    console.log('Resend code');
  };

  const handleChangeEmail = () => {
    // Navigate back to enter email/phone
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.push('/login')}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        
        <Text style={styles.title}>Verify Your Account</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to your email. Please enter it below to continue.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <Pressable onPress={handleResendCode}>
            <Text style={styles.resendLink}>Resend</Text>
          </Pressable>
        </View>

        <Pressable onPress={handleChangeEmail}>
          <Text style={styles.changeEmailLink}>Change email address</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.verifyButton} onPress={handleVerify}>
          <LinearGradient
            colors={[colors.deepTeal, '#003D3D']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: colors.charcoalGray,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.deepTeal,
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
    color: colors.deepTeal,
    backgroundColor: colors.white,
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
    color: colors.royalGold,
    fontWeight: '600',
  },
  changeEmailLink: {
    fontSize: 16,
    color: colors.royalGold,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  verifyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.deepTeal,
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
    color: colors.white,
    letterSpacing: 0.5,
  },
});