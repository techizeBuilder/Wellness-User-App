import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    // Simple dummy authentication - accepts any email/password
    if (email.trim() && password.trim()) {
      // Navigate to main dashboard after login
      router.replace('/dashboard');
    } else {
      alert('Please enter both email and password');
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
        colors={['#A0F0E4', '#C2F8ED']}
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
            <Text style={styles.subtitle}>
              Join our community of wellness{'\n'}enthusiasts and experts.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email or Phone"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
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

            <Pressable style={styles.continueButton} onPress={handleLogin}>
              <LinearGradient
                colors={['#00C6A7', '#1D976C']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </LinearGradient>
            </Pressable>

            <Pressable style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>

            <View style={styles.socialButtonsContainer}>
              <Pressable style={styles.socialButton}>
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.socialText}>Google</Text>
              </Pressable>
              
              <Pressable style={styles.socialButton}>
                <Text style={styles.appleIcon}>🍎</Text>
                <Text style={styles.socialText}>Apple</Text>
              </Pressable>
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <Pressable onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Text>
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
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A5D5D',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A7575',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  passwordInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingRight: 60,
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  eyeIcon: {
    position: 'absolute',
    right: 24,
    top: 20,
    padding: 4,
  },
  eyeIconText: {
    fontSize: 20,
    color: '#666666',
  },
  continueButton: {
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#1A5D5D',
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  appleIcon: {
    fontSize: 18,
  },
  socialText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },
  signUpLink: {
    fontSize: 16,
    color: '#F4B400',
    fontWeight: 'bold',
  },
  footerSection: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
});