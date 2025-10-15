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

export default function TermsOfServiceScreen() {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
          style={styles.contentCard}
        >
          <Text style={styles.sectionTitle}>Welcome to Zenovia Wellness App</Text>
          <Text style={styles.paragraph}>
            These Terms of Service ("Terms") govern your use of the Zenovia Wellness App 
            mobile application operated by Zenovia ("us", "we", or "our").
          </Text>

          <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using this application, you accept and agree to be bound by 
            the terms and provision of this agreement. If you do not agree to abide by 
            the above, please do not use this service.
          </Text>

          <Text style={styles.sectionTitle}>Use License</Text>
          <Text style={styles.paragraph}>
            Permission is granted to temporarily download one copy of Zenovia Wellness App 
            for personal, non-commercial transitory viewing only. This is the grant of a 
            license, not a transfer of title, and under this license you may not:
          </Text>
          <Text style={styles.bulletPoint}>• Modify or copy the materials</Text>
          <Text style={styles.bulletPoint}>• Use the materials for commercial purpose or for any public display</Text>
          <Text style={styles.bulletPoint}>• Attempt to reverse engineer any software contained in the app</Text>
          <Text style={styles.bulletPoint}>• Remove any copyright or other proprietary notations</Text>

          <Text style={styles.sectionTitle}>User Accounts</Text>
          <Text style={styles.paragraph}>
            When you create an account with us, you must provide information that is 
            accurate, complete, and current at all times. You are responsible for 
            safeguarding the password and for all activities that occur under your account.
          </Text>

          <Text style={styles.sectionTitle}>Health Information Disclaimer</Text>
          <Text style={styles.paragraph}>
            The wellness content provided in this app is for informational purposes only 
            and is not intended as a substitute for professional medical advice, diagnosis, 
            or treatment. Always seek the advice of qualified health providers with any 
            questions you may have regarding a medical condition.
          </Text>

          <Text style={styles.sectionTitle}>Expert Services</Text>
          <Text style={styles.paragraph}>
            Our platform connects you with certified wellness experts. While we verify 
            expert credentials, you are responsible for making informed decisions about 
            the services you choose to use.
          </Text>

          <Text style={styles.sectionTitle}>Payment Terms</Text>
          <Text style={styles.paragraph}>
            Payment for expert sessions and premium features is processed securely through 
            our payment partners. All fees are non-refundable unless otherwise stated in 
            our refund policy.
          </Text>

          <Text style={styles.sectionTitle}>Privacy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. Our Privacy Policy explains how we collect, 
            use, and protect your information when you use our service.
          </Text>

          <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            In no event shall Zenovia or its suppliers be liable for any damages arising 
            out of the use or inability to use the materials on this app, even if Zenovia 
            or an authorized representative has been notified orally or in writing of the 
            possibility of such damage.
          </Text>

          <Text style={styles.sectionTitle}>Governing Law</Text>
          <Text style={styles.paragraph}>
            These terms and conditions are governed by and construed in accordance with 
            the laws and regulations applicable in your jurisdiction.
          </Text>

          <Text style={styles.sectionTitle}>Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right, at our sole discretion, to modify or replace these Terms 
            at any time. If a revision is material, we will try to provide at least 30 days 
            notice prior to any new terms taking effect.
          </Text>

          <Text style={styles.lastUpdated}>Last updated: October 15, 2025</Text>
        </LinearGradient>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: getResponsiveFontSize(20),
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  headerRight: {
    width: getResponsiveWidth(40),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(20),
  },
  contentCard: {
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '700',
    color: colors.darkTeal,
    marginTop: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(10),
  },
  paragraph: {
    fontSize: getResponsiveFontSize(14),
    color: colors.darkGray,
    lineHeight: 22,
    marginBottom: getResponsiveMargin(12),
  },
  bulletPoint: {
    fontSize: getResponsiveFontSize(14),
    color: colors.darkGray,
    lineHeight: 22,
    marginBottom: getResponsiveMargin(8),
    marginLeft: getResponsiveMargin(10),
  },
  lastUpdated: {
    fontSize: getResponsiveFontSize(12),
    color: colors.gray,
    textAlign: 'center',
    marginTop: getResponsiveMargin(20),
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: getResponsiveHeight(40),
  },
});