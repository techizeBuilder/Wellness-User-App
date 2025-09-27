import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/utils/colors';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Embrace Your Journey",
      subtitle: "Discover yourself as you physically start your wellness journey with personalized guidance.",
      icon: "🧘‍♀️",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80"
    },
    {
      title: "Your Journey to Wellness",
      subtitle: "Just a few simple steps to personalize your experience and connect with certified experts.",
      icon: "🌱",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&q=80"
    },
    {
      title: "Find Your Flow",
      subtitle: "Strengthen your inner connection to wellness through yoga, meditation, and mindful living.",
      icon: "🧘‍♂️",
      imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop&q=80"
    },
    {
      title: "You're All Set ✨",
      subtitle: "Start exploring expert guidance and transform your lifestyle with Zenovia's comprehensive wellness program.",
      icon: "🚀",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/login');
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.deepTeal} translucent />
      
      <LinearGradient
        colors={[colors.deepTeal, '#003333']}
        style={styles.backgroundGradient}
      />

      {/* Decorative Background Elements */}
      <View style={styles.decorativeElements}>
        <View style={[styles.circle1, { backgroundColor: 'rgba(255, 215, 0, 0.08)' }]} />
        <View style={[styles.circle2, { backgroundColor: 'rgba(163, 201, 168, 0.12)' }]} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index <= currentStep ? colors.royalGold : 'rgba(255, 255, 255, 0.3)',
                  width: index <= currentStep ? 32 : 8,
                }
              ]}
            />
          ))}
        </View>

        <View style={styles.mainContent}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: currentStepData.imageUrl }}
              style={styles.stepImage}
              resizeMode="cover"
            />
            <View style={styles.iconOverlay}>
              <Text style={styles.iconEmoji}>{currentStepData.icon}</Text>
            </View>
          </View>

          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
        </View>

        <Pressable style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={[colors.royalGold, '#E6C200']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepTeal,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -100,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: 100,
    left: -50,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 60,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  imageContainer: {
    width: width * 0.8,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
    position: 'relative',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 77, 77, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.royalGold,
  },
  iconEmoji: {
    fontSize: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  nextButton: {
    marginHorizontal: 32,
    marginBottom: 50,
    borderRadius: 28,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
});