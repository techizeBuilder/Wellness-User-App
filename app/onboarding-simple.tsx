import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
  },
});