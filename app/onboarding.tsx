import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "WELCOME TO ZENOVIA",
      subtitle: "Your personal wellness companion for yoga, meditation, and healthy living.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&q=80"
    },
    {
      title: "Connect with Experts",
      subtitle: "Access certified professionals in Yoga, Ayurveda, Diet, Meditation, and Fitness.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80"
    },
    {
      title: "Personalized Experience",
      subtitle: "Get customized wellness plans tailored to your unique goals and preferences.",
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop&q=80"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/user-type-selection');
    }
  };

  const currentStepData = steps[currentStep] || steps[0];

  // Zenovia Logo Component
  const ZenoviaLogo = () => (
    <View style={styles.logoContainer}>
      <Image 
        source={require('../assets/images/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <Text style={styles.logoText}>ZENOVIA</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A4A4A" translucent />
      
      <LinearGradient
        colors={['#0A4A4A', '#1A5A5A', '#2A6A6A']}
        style={styles.backgroundGradient}
      >
        {/* Header with Logo */}
        <View style={styles.header}>
          <ZenoviaLogo />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Image Container */}
          <View style={styles.imageContainer}>
            {currentStepData?.image && (
              <Image 
                source={{ uri: currentStepData.image }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.imageOverlay}>
              <View style={styles.overlayIcon}>
                <Image 
                  source={require('../assets/images/logo.png')}
                  style={styles.overlayLogoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContent}>
            <Text style={styles.title}>{currentStepData?.title || 'Welcome'}</Text>
            <Text style={styles.subtitle}>{currentStepData?.subtitle || 'Loading...'}</Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Progress Indicators */}
          <View style={styles.progressContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: index === currentStep ? '#F59E0B' : 'rgba(255, 255, 255, 0.3)',
                    width: index === currentStep ? 24 : 8,
                  }
                ]}
              />
            ))}
          </View>

          {/* Next Button */}
          <Pressable style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A4A4A',
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F59E0B',
    letterSpacing: 2,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 40,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  overlayIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(10, 74, 74, 0.95)',
    borderWidth: 2,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayLogoImage: {
    width: 32,
    height: 32,
    tintColor: '#F59E0B',
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButton: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  buttonArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});