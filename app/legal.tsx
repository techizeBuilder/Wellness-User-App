import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '../src/utils/colors';

export default function LegalScreen() {
  return (
    <LinearGradient
      colors={['#2DD4BF', '#14B8A6', '#0D9488']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Legal</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.legalItem}
          >
            <Pressable style={styles.legalContent}>
              <Text style={styles.legalIcon}>📋</Text>
              <View style={styles.legalInfo}>
                <Text style={styles.legalTitle}>Terms of Service</Text>
                <Text style={styles.legalSubtitle}>Read our terms and conditions</Text>
              </View>
              <Text style={styles.legalArrow}>→</Text>
            </Pressable>
          </LinearGradient>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.legalItem}
          >
            <Pressable style={styles.legalContent}>
              <Text style={styles.legalIcon}>🔒</Text>
              <View style={styles.legalInfo}>
                <Text style={styles.legalTitle}>Privacy Policy</Text>
                <Text style={styles.legalSubtitle}>How we protect your data</Text>
              </View>
              <Text style={styles.legalArrow}>→</Text>
            </Pressable>
          </LinearGradient>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.legalItem}
          >
            <Pressable style={styles.legalContent}>
              <Text style={styles.legalIcon}>🍪</Text>
              <View style={styles.legalInfo}>
                <Text style={styles.legalTitle}>Cookie Policy</Text>
                <Text style={styles.legalSubtitle}>How we use cookies</Text>
              </View>
              <Text style={styles.legalArrow}>→</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightMistTeal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  legalItem: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  legalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  legalIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  legalInfo: {
    flex: 1,
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  legalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  legalArrow: {
    fontSize: 16,
    color: 'white',
  },
});