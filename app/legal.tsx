import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '../src/utils/colors';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth
} from '../src/utils/dimensions';

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
    paddingTop: getResponsivePadding(50),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(16),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: getResponsiveFontSize(18),
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    width: getResponsiveWidth(40),
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: getResponsivePadding(20),
    paddingTop: getResponsivePadding(24),
  },
  legalItem: {
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveMargin(12),
  },
  legalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsivePadding(20),
  },
  legalIcon: {
    fontSize: getResponsiveFontSize(24),
    marginRight: getResponsiveMargin(16),
  },
  legalInfo: {
    flex: 1,
  },
  legalTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: 'white',
    marginBottom: getResponsiveMargin(4),
  },
  legalSubtitle: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  legalArrow: {
    fontSize: getResponsiveFontSize(16),
    color: 'white',
  },
});