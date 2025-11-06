import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/utils/colors';

const { width, height } = Dimensions.get('window');

interface OnboardingStepProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onNext: () => void;
  backgroundColor?: string;
  children?: React.ReactNode;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  subtitle,
  buttonText,
  onNext,
  backgroundColor = colors.deepTeal,
  children,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <LinearGradient
        colors={[backgroundColor, backgroundColor + '88']}
        style={styles.gradient}
      >
        {/* Content Area */}
        <View style={styles.content}>
          {/* Custom children content (like images or cards) */}
          {children && (
            <View style={styles.childrenContainer}>
              {children}
            </View>
          )}
          
          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onNext}>
            <LinearGradient
              colors={[colors.royalGold, colors.gold[400]]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childrenContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    maxWidth: 300,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.deepTeal,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingStep;