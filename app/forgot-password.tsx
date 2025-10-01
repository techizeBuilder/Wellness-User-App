import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleSendOTP = () => {
    router.push('/otp-verification');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#4DD0E1" />
      
      <LinearGradient
        colors={['#4DD0E1', '#26C6DA', '#00BCD4']}
        style={styles.backgroundGradient}
      >
        {/* Back Button */}
        <View style={styles.headerContainer}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email or phone number to receive{'\n'}a one-time password (OTP).
            </Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="Email or Phone Number"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Pressable style={styles.sendButton} onPress={handleSendOTP}>
              <LinearGradient
                colors={['#26C6DA', '#00ACC1']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.sendButtonText}>Send OTP</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.loginText}>Remember your password? </Text>
            <Pressable onPress={handleLogin}>
              <Text style={styles.loginLink}>Log In</Text>
            </Pressable>
          </View>
        </View>
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
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  backArrow: {
    fontSize: 24,
    color: '#2C5B5B',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2C5B5B',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A6B6B',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  formSection: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
    color: '#26C6DA',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  sendButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: 40,
  },
  loginText: {
    fontSize: 16,
    color: '#2C5B5B',
    fontWeight: '400',
  },
  loginLink: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
});