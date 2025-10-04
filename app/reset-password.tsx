import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../src/utils/colors';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleResetPassword = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      // Navigate to login or success screen
      router.push('/login');
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
        <Pressable style={styles.resetButton} onPress={handleResetPassword}>
          <LinearGradient
            colors={['#14B8A6', '#0D9488']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.resetButtonText}>Reset Password</Text>
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
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  backArrow: {
    fontSize: 20,
    color: colors.deepTeal,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.deepTeal,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333333',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 44,
    padding: 4,
  },
  eyeIconText: {
    fontSize: 16,
  },
  requirement: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  resetButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
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
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.5,
  },
  backToLogin: {
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '600',
  },
});