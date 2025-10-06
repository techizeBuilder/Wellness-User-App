import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Join Zenovia</Text>
            <Text style={styles.subtitle}>How would you like to join?</Text>
          </View>
          
          {/* Form Section */}
          <View style={styles.formSection}>
            {/* User Option */}
            <TouchableOpacity
              style={[styles.optionCard, selectedType === 'user' && styles.selectedOption]}
              onPress={() => setSelectedType('user')}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, selectedType === 'user' && styles.selectedIconContainer]}>
                <Text style={styles.icon}>👩‍🦰</Text>
              </View>
              <Text style={styles.optionTitle}>I'm a User</Text>
              <Text style={styles.optionDescription}>
                Join classes and find wellness experts.
              </Text>
            </TouchableOpacity>

            {/* Expert Option */}
            <TouchableOpacity
              style={[styles.optionCard, selectedType === 'expert' && styles.selectedOption]}
              onPress={() => setSelectedType('expert')}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, selectedType === 'expert' && styles.selectedIconContainer]}>
                <Text style={styles.icon}>⭐</Text>
              </View>
              <Text style={styles.optionTitle}>I'm an Expert</Text>
              <Text style={styles.optionDescription}>
                Offer your services as certified provider.
              </Text>
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.continueButton, !selectedType && styles.disabledButton]}
              onPress={handleContinue}
              disabled={!selectedType}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={selectedType ? ['#14B8A6', '#0D9488'] : ['#ccc', '#999']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f3f3f3ff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#f3f3f3ff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 160,
  },
  selectedOption: {
    borderColor: '#14B8A6',
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedIconContainer: {
    backgroundColor: '#14B8A6',
  },
  icon: {
    fontSize: 32,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  continueButton: {
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },
  loginLink: {
    fontSize: 16,
    color: '#575623ff',
    fontWeight: 'bold',
  },
  footerSection: {
    marginTop: 'auto',
    paddingTop: 16,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
});
