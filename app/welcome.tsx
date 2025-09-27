import React from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/utils/colors';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#FFF8E1', '#F5F5DC', '#E8F5E8']}
        style={styles.backgroundGradient}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Meditation Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.meditationCircle}>
            <Text style={styles.meditationEmoji}>🧘‍♀️</Text>
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Find your inner peace{'\n'}with Zenovia</Text>
          <Text style={styles.subtitle}>
            Connect with certified experts in Yoga, Ayurveda, Diet, Meditation, and Fitness to achieve your wellness goals
          </Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.getStartedButton}>
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.primaryButtonGradient}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={styles.logInButton}>
          <Text style={styles.logInButtonText}>Log In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  illustrationContainer: {
    marginBottom: 60,
  },
  meditationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  meditationEmoji: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 50,
  },
  getStartedButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logInButton: {
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  logInButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
});