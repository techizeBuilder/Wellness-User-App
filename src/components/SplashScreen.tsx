import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../utils/colors';

const SplashScreen: React.FC = () => {
  const router = useRouter();
  
  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1);

  // Navigate to onboarding after animation
  const navigateToOnboarding = () => {
    router.replace('/onboarding');
  };

  useEffect(() => {
    // Start animations sequence
    const startAnimations = () => {
      // Logo animation - fade in and scale
      logoOpacity.value = withTiming(1, { duration: 800 });
      logoScale.value = withTiming(1, { duration: 800 });

      // Title animation - delayed fade in
      titleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));

      // Subtitle animation - more delayed fade in
      subtitleOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));

      // Navigate after all animations complete
      backgroundOpacity.value = withDelay(2500, 
        withTiming(0, { duration: 500 }, (finished) => {
          if (finished) {
            runOnJS(navigateToOnboarding)();
          }
        })
      );
    };

    startAnimations();
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: withTiming(titleOpacity.value === 1 ? 0 : 20, { duration: 600 }) }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: withTiming(subtitleOpacity.value === 1 ? 0 : 20, { duration: 600 }) }],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <Animated.View style={[{ flex: 1 }, backgroundAnimatedStyle]} className="flex-1">
      <LinearGradient
        colors={[colors.deepTeal, '#006666']}
        style={{ flex: 1 }}
        className="flex-1 justify-center items-center px-8"
      >
        {/* Logo Container */}
        <Animated.View 
          style={logoAnimatedStyle}
          className="items-center mb-8"
        >
          {/* Placeholder for logo - you can replace with actual logo */}
          <View className="w-32 h-32 bg-white rounded-full items-center justify-center mb-4">
            <View className="w-20 h-20 bg-deep-teal rounded-full items-center justify-center">
              <Text className="text-white text-2xl font-bold">Z</Text>
            </View>
          </View>
        </Animated.View>

        {/* Brand Name */}
        <Animated.View style={titleAnimatedStyle} className="items-center mb-4">
          <Text className="text-white text-5xl font-bold tracking-wider text-center">
            Zenovia
          </Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={subtitleAnimatedStyle} className="items-center">
          <Text className="text-white text-lg font-light text-center leading-6 opacity-90">
            Balance Your Mind, Body & Soul
          </Text>
        </Animated.View>

        {/* Decorative elements */}
        <Animated.View 
          style={logoAnimatedStyle}
          className="absolute bottom-20 flex-row items-center"
        >
          <View className="w-8 h-0.5 bg-sage-green mr-3" />
          <View className="w-2 h-2 bg-royal-gold rounded-full mx-1" />
          <View className="w-2 h-2 bg-coral-accent rounded-full mx-1" />
          <View className="w-2 h-2 bg-sage-green rounded-full mx-1" />
          <View className="w-8 h-0.5 bg-sage-green ml-3" />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

export default SplashScreen;