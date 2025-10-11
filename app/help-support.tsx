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

export default function HelpSupportScreen() {
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How can we help you?</Text>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.helpItem}
          >
            <Pressable style={styles.helpContent}>
              <Text style={styles.helpIcon}>❓</Text>
              <View style={styles.helpInfo}>
                <Text style={styles.helpTitle}>FAQs</Text>
                <Text style={styles.helpSubtitle}>Find answers to common questions</Text>
              </View>
              <Text style={styles.helpArrow}>→</Text>
            </Pressable>
          </LinearGradient>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.helpItem}
          >
            <Pressable style={styles.helpContent}>
              <Text style={styles.helpIcon}>💬</Text>
              <View style={styles.helpInfo}>
                <Text style={styles.helpTitle}>Live Chat</Text>
                <Text style={styles.helpSubtitle}>Chat with our support team</Text>
              </View>
              <Text style={styles.helpArrow}>→</Text>
            </Pressable>
          </LinearGradient>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.helpItem}
          >
            <Pressable style={styles.helpContent}>
              <Text style={styles.helpIcon}>📧</Text>
              <View style={styles.helpInfo}>
                <Text style={styles.helpTitle}>Contact Us</Text>
                <Text style={styles.helpSubtitle}>Send us an email</Text>
              </View>
              <Text style={styles.helpArrow}>→</Text>
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
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(2),
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(2),
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
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: getResponsiveMargin(16),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(2),
  },
  helpItem: {
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveMargin(12),
  },
  helpContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsivePadding(20),
  },
  helpIcon: {
    fontSize: getResponsiveFontSize(24),
    marginRight: getResponsiveMargin(16),
  },
  helpInfo: {
    flex: 1,
  },
  helpTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: 'white',
    marginBottom: getResponsiveMargin(4),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(2),
  },
  helpSubtitle: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  helpArrow: {
    fontSize: getResponsiveFontSize(16),
    color: 'white',
  },
});