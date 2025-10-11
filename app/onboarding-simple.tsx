import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  fontSizes,
  getResponsivePadding
} from '../src/utils/dimensions';

export default function OnboardingSimple() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Simple Onboarding Screen</Text>
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
  text: {
    color: '#FFFFFF',
    fontSize: fontSizes.xxl,
    textAlign: 'center',
  },
});