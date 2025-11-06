import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/utils/colors';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '@/utils/dimensions';

export default function CookiePolicyScreen() {
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
        <Text style={styles.headerTitle}>Cookie Policy</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
          style={styles.contentCard}
        >
          <Text style={styles.sectionTitle}>Cookie Policy for Zenovia Wellness App</Text>
          <Text style={styles.paragraph}>
            This Cookie Policy explains how Zenovia ("we", "our", or "us") uses cookies 
            and similar technologies when you use our mobile application.
          </Text>

          <Text style={styles.sectionTitle}>What Are Cookies?</Text>
          <Text style={styles.paragraph}>
            Cookies are small text files that are placed on your device when you use our 
            app. They help us provide a better user experience by remembering your 
            preferences and improving app functionality.
          </Text>

          <Text style={styles.sectionTitle}>Types of Cookies We Use</Text>
          
          <Text style={styles.subTitle}>Essential Cookies</Text>
          <Text style={styles.paragraph}>
            These cookies are necessary for the app to function properly and cannot be 
            disabled. They include:
          </Text>
          <Text style={styles.bulletPoint}>• Authentication and login session management</Text>
          <Text style={styles.bulletPoint}>• Security and fraud prevention</Text>
          <Text style={styles.bulletPoint}>• App functionality and navigation</Text>

          <Text style={styles.subTitle}>Performance Cookies</Text>
          <Text style={styles.paragraph}>
            These cookies help us understand how users interact with our app:
          </Text>
          <Text style={styles.bulletPoint}>• Anonymous usage analytics</Text>
          <Text style={styles.bulletPoint}>• App performance monitoring</Text>
          <Text style={styles.bulletPoint}>• Error tracking and debugging</Text>

          <Text style={styles.subTitle}>Preference Cookies</Text>
          <Text style={styles.paragraph}>
            These cookies remember your choices and personalize your experience:
          </Text>
          <Text style={styles.bulletPoint}>• Language and region preferences</Text>
          <Text style={styles.bulletPoint}>• Wellness goal settings</Text>
          <Text style={styles.bulletPoint}>• App theme and display preferences</Text>

          <Text style={styles.sectionTitle}>Third-Party Cookies</Text>
          <Text style={styles.paragraph}>
            We may use third-party services that set their own cookies:
          </Text>
          <Text style={styles.bulletPoint}>• Analytics providers (anonymized data)</Text>
          <Text style={styles.bulletPoint}>• Payment processors (secure transactions)</Text>
          <Text style={styles.bulletPoint}>• Video content providers (embedded wellness content)</Text>

          <Text style={styles.sectionTitle}>Managing Cookies</Text>
          <Text style={styles.paragraph}>
            You can manage cookie preferences through your device settings:
          </Text>
          <Text style={styles.bulletPoint}>• Enable or disable cookies in app settings</Text>
          <Text style={styles.bulletPoint}>• Clear stored data through device storage settings</Text>
          <Text style={styles.bulletPoint}>• Reset app preferences to default</Text>

          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.paragraph}>
            Different types of cookies are stored for different periods:
          </Text>
          <Text style={styles.bulletPoint}>• Session cookies: Deleted when you close the app</Text>
          <Text style={styles.bulletPoint}>• Persistent cookies: Stored until expiration or manual deletion</Text>
          <Text style={styles.bulletPoint}>• Preference cookies: Stored until you change or reset them</Text>

          <Text style={styles.sectionTitle}>Your Consent</Text>
          <Text style={styles.paragraph}>
            By using our app, you consent to our use of cookies as described in this policy. 
            You can withdraw consent at any time by adjusting your app settings or 
            contacting us directly.
          </Text>

          <Text style={styles.sectionTitle}>Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Cookie Policy from time to time. Any changes will be 
            posted within the app and will take effect immediately upon posting.
          </Text>

          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions about our use of cookies, please contact us through 
            the app's support section or at privacy@zenovia.com.
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
  subTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: colors.teal,
    marginTop: getResponsiveMargin(15),
    marginBottom: getResponsiveMargin(8),
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