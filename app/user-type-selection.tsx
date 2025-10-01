import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<'user' | 'expert' | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedType === 'user') {
      router.push('/create-account');
    } else if (selectedType === 'expert') {
      router.push('/expert-registration');
    }
  };

  return (
    <LinearGradient
      colors={["#3EE0C0", "#6DECB9"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
  <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Join Zenovia</Text>
            <Text style={styles.subtitle}>How would you like to join?</Text>
          </View>
          
          {/* Options Container */}
          <View style={styles.optionsContainer}>
            {/* User Option */}
            <TouchableOpacity
              style={[styles.optionUser, selectedType === 'user' && styles.selectedOption]}
              onPress={() => setSelectedType('user')}
              activeOpacity={0.8}
            >
              <View style={styles.emojiIconContainer}>
                <Text style={styles.emojiIcon}>👩‍🦰</Text>
              </View>
              <Text style={styles.optionTitleUser}>I'm a User</Text>
              <Text style={styles.optionDescriptionUser}>
                Join classes and find wellness experts.
              </Text>
            </TouchableOpacity>

            {/* Expert Option */}
            <TouchableOpacity
              style={[styles.optionExpert, selectedType === 'expert' && styles.selectedOption]}
              onPress={() => setSelectedType('expert')}
              activeOpacity={0.8}
            >
              <View style={styles.emojiIconContainerExpert}>
                <Text style={styles.emojiIconExpert}>⭐</Text>
              </View>
              <Text style={styles.optionTitleExpert}>I'm an Expert</Text>
              <Text style={styles.optionDescriptionExpert}>
                Offer your services as certified provider.
              </Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, !selectedType && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!selectedType}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedType ? ["#00C6A7", "#1D976C"] : ["#ccc", "#999"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink} onPress={() => router.push('/login')}>Log In</Text></Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 18,
    paddingHorizontal: 0,
  },
  optionUser: {
    backgroundColor: '#3EE0C0',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 0,
    minHeight: 140,
    shadowColor: '#3EE0C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  optionExpert: {
    backgroundColor: '#FFE066',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 0,
    minHeight: 140,
    shadowColor: '#FFE066',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedOption: {
    borderWidth: 3,
    borderColor: '#fff',
    transform: [{ scale: 1.03 }],
  },
  emojiIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emojiIcon: {
    fontSize: 40,
  },
  emojiIconContainerExpert: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emojiIconExpert: {
    fontSize: 40,
  },
  optionTitleUser: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescriptionUser: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  optionTitleExpert: {
    fontSize: 22,
    fontWeight: '700',
    color: '#A68A00',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescriptionExpert: {
    fontSize: 16,
    color: '#A68A00',
    textAlign: 'center',
    marginBottom: 4,
  },
  continueButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 0,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#fff',
  },
  loginLink: {
    color: '#FFC300',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
