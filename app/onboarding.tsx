import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import {
    fontSizes,
    getResponsiveBorderRadius,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth,
    screenData
} from '../src/utils/dimensions';

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
    paddingTop: getResponsiveHeight(screenData.isSmall ? 50 : 60),
    paddingBottom: getResponsivePadding(30),
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: getResponsiveWidth(screenData.isSmall ? 70 : 80),
    height: getResponsiveHeight(screenData.isSmall ? 70 : 80),
    marginBottom: getResponsiveMargin(12),
  },
  logoText: {
    fontSize: screenData.isSmall ? fontSizes.xxl : fontSizes.xxl + 4,
    fontWeight: 'bold',
    color: '#F59E0B',
    letterSpacing: 2,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 20 : 24),
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: getResponsiveHeight(screenData.isSmall ? 240 : 280),
    borderRadius: getResponsiveBorderRadius(24),
    overflow: 'hidden',
    marginBottom: getResponsiveMargin(screenData.isSmall ? 30 : 40),
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
    bottom: getResponsivePadding(20),
    right: getResponsivePadding(20),
  },
  overlayIcon: {
    width: getResponsiveWidth(screenData.isSmall ? 48 : 56),
    height: getResponsiveHeight(screenData.isSmall ? 48 : 56),
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 24 : 28),
    backgroundColor: 'rgba(10, 74, 74, 0.95)',
    borderWidth: 2,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayLogoImage: {
    width: getResponsiveWidth(screenData.isSmall ? 28 : 32),
    height: getResponsiveHeight(screenData.isSmall ? 28 : 32),
    tintColor: '#F59E0B',
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(12),
  },
  title: {
    fontSize: screenData.isSmall ? fontSizes.xxl + 4 : fontSizes.xxxl,
    fontWeight: 'bold',
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(16),
    lineHeight: screenData.isSmall ? fontSizes.xxl + 10 : fontSizes.xxxl + 6,
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 10 : 0),
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: fontSizes.md * 1.5,
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 16 : 8),
  },
  bottomSection: {
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 20 : 24),
    paddingBottom: getResponsivePadding(screenData.isSmall ? 40 : 50),
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(screenData.isSmall ? 30 : 40),
  },
  progressDot: {
    height: getResponsiveHeight(4),
    borderRadius: getResponsiveBorderRadius(2),
    marginHorizontal: getResponsiveMargin(4),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButton: {
    borderRadius: getResponsiveBorderRadius(28),
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
    paddingVertical: getResponsivePadding(screenData.isSmall ? 16 : 18),
    paddingHorizontal: getResponsivePadding(32),
    minHeight: getResponsiveHeight(screenData.isSmall ? 50 : 56),
  },
  buttonText: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: getResponsiveMargin(8),
  },
  buttonArrow: {
    fontSize: fontSizes.lg,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});