import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import {
    fontSizes,
    getResponsiveBorderRadius,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth,
    screenData
} from '../src/utils/dimensions';

export default function Index() {
  const [animatedValues] = useState(() => 
    'ZENOVIA'.split('').map(() => new Animated.Value(0))
  );
  const [taglineAnimation] = useState(new Animated.Value(0));
  const [pulseAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    const letterAnimations = animatedValues.map((animValue, index) =>
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    const taglineAnim = Animated.timing(taglineAnimation, {
      toValue: 1,
      duration: 800,
      delay: 800,
      useNativeDriver: true,
    });

    const createPulseAnimation = () => 
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

    Animated.parallel([
      ...letterAnimations,
      taglineAnim,
    ]).start();

    createPulseAnimation().start();

    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <Animated.View style={[
        styles.content,
        { transform: [{ scale: pulseAnimation }] }
      ]}>
        <View style={styles.brandContainer}>
          {'ZENOVIA'.split('').map((letter, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.brandLetter,
                {
                  opacity: animatedValues[index],
                  transform: [{
                    translateY: animatedValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  }],
                },
              ]}
            >
              {letter}
            </Animated.Text>
          ))}
        </View>

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineAnimation,
              transform: [{
                translateY: taglineAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          Balance Your Mind, Body & Soul
        </Animated.Text>
      </Animated.View>

      <View style={styles.decorativeElements}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004D4D',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(20),
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    marginBottom: getResponsiveMargin(screenData.isSmall ? 20 : 30),
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  brandLetter: {
    fontSize: screenData.isSmall ? fontSizes.xxxl * 1.2 : fontSizes.xxxl * 1.6,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: getResponsiveMargin(screenData.isSmall ? 1 : 2),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: screenData.isSmall ? fontSizes.md : fontSizes.lg,
    color: '#A3C9A8',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 1,
    paddingHorizontal: getResponsivePadding(20),
    lineHeight: screenData.isSmall ? fontSizes.md * 1.4 : fontSizes.lg * 1.4,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle1: {
    position: 'absolute',
    width: getResponsiveWidth(screenData.isSmall ? 150 : 200),
    height: getResponsiveHeight(screenData.isSmall ? 150 : 200),
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 75 : 100),
    backgroundColor: 'rgba(163, 201, 168, 0.1)',
    top: '20%',
    right: screenData.isSmall ? '-15%' : '-10%',
  },
  circle2: {
    position: 'absolute',
    width: getResponsiveWidth(screenData.isSmall ? 120 : 150),
    height: getResponsiveHeight(screenData.isSmall ? 120 : 150),
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 60 : 75),
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    bottom: '25%',
    left: screenData.isSmall ? '-10%' : '-5%',
  },
});