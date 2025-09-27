import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/utils/colors';

export default function UserTypeSelectionScreen() {
  const [selectedType, setSelectedType] = useState<'user' | 'expert' | null>(null);

  const handleContinue = () => {
    if (selectedType === 'user') {
      router.push('/create-account');
    } else if (selectedType === 'expert') {
      router.push('/expert-registration');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Join Zenovia</Text>
        <Text style={styles.subtitle}>How would you like to join?</Text>

        <View style={styles.optionsContainer}>
          <Pressable
            style={[
              styles.optionCard,
              selectedType === 'user' && styles.selectedCard
            ]}
            onPress={() => setSelectedType('user')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.userIcon}>🧘‍♀️</Text>
            </View>
            <Text style={styles.optionTitle}>I'm a User</Text>
            <Text style={styles.optionDescription}>
              Join classes and find wellness experts.
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.optionCard,
              selectedType === 'expert' && styles.selectedCard
            ]}
            onPress={() => setSelectedType('expert')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.expertIcon}>🌟</Text>
            </View>
            <Text style={styles.optionTitle}>I'm an Expert</Text>
            <Text style={styles.optionDescription}>
              Offer your services as a certified provider.
            </Text>
          </Pressable>
        </View>

        <Pressable 
          style={[styles.continueButton, !selectedType && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedType}
        >
          <LinearGradient
            colors={selectedType ? [colors.coralAccent, '#E55A50'] : ['#E1E5E9', '#E1E5E9']}
            style={styles.buttonGradient}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedType && styles.disabledButtonText
            ]}>
              Continue
            </Text>
          </LinearGradient>
        </Pressable>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Pressable onPress={handleLogin}>
            <Text style={styles.loginLink}>Log In</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
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
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: colors.deepTeal,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.deepTeal,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E1E5E9',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: colors.royalGold,
    backgroundColor: colors.royalGold + '10',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.royalGold + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userIcon: {
    fontSize: 32,
  },
  expertIcon: {
    fontSize: 32,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.5,
  },
  disabledButtonText: {
    color: '#999',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: colors.royalGold,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});