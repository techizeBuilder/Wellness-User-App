import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';

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
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  brandLetter: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: '#A3C9A8',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 1,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(163, 201, 168, 0.1)',
    top: '20%',
    right: '-10%',
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    bottom: '25%',
    left: '-5%',
  },
});