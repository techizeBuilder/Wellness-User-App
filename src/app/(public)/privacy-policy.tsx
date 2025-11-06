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

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
          style={styles.contentCard}
        >
          <Text style={styles.sectionTitle}>Privacy Policy for Zenovia Wellness App</Text>
          <Text style={styles.paragraph}>
            At Zenovia, accessible from our mobile application, one of our main priorities 
            is the privacy of our users. This Privacy Policy document contains types of 
            information that is collected and recorded by Zenovia and how we use it.
          </Text>

          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.subTitle}>Personal Information</Text>
          <Text style={styles.paragraph}>
            When you register for an account, we may collect personal information such as:
          </Text>
          <Text style={styles.bulletPoint}>• Name and contact information</Text>
          <Text style={styles.bulletPoint}>• Email address and phone number</Text>
          <Text style={styles.bulletPoint}>• Date of birth and gender</Text>
          <Text style={styles.bulletPoint}>• Health and wellness preferences</Text>
          <Text style={styles.bulletPoint}>• Payment information for premium services</Text>

          <Text style={styles.subTitle}>Health Information</Text>
          <Text style={styles.paragraph}>
            With your explicit consent, we may collect health-related information to 
            provide personalized wellness recommendations:
          </Text>
          <Text style={styles.bulletPoint}>• Fitness goals and activity levels</Text>
          <Text style={styles.bulletPoint}>• Dietary preferences and restrictions</Text>
          <Text style={styles.bulletPoint}>• Wellness session feedback and progress</Text>

          <Text style={styles.subTitle}>Usage Data</Text>
          <Text style={styles.paragraph}>
            We automatically collect certain information when you use our app:
          </Text>
          <Text style={styles.bulletPoint}>• Device information and operating system</Text>
          <Text style={styles.bulletPoint}>• App usage patterns and feature interactions</Text>
          <Text style={styles.bulletPoint}>• Session duration and frequency</Text>

          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the collected information for various purposes:
          </Text>
          <Text style={styles.bulletPoint}>• To provide and maintain our wellness services</Text>
          <Text style={styles.bulletPoint}>• To personalize your wellness experience</Text>
          <Text style={styles.bulletPoint}>• To process payments and manage subscriptions</Text>
          <Text style={styles.bulletPoint}>• To communicate with you about our services</Text>
          <Text style={styles.bulletPoint}>• To improve our app and develop new features</Text>
          <Text style={styles.bulletPoint}>• To ensure the security of our platform</Text>

          <Text style={styles.sectionTitle}>Information Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell, trade, or otherwise transfer your personal information to 
            third parties without your consent, except in the following circumstances:
          </Text>
          <Text style={styles.bulletPoint}>• With wellness experts when you book sessions</Text>
          <Text style={styles.bulletPoint}>• With payment processors for transaction handling</Text>
          <Text style={styles.bulletPoint}>• When required by law or to protect our rights</Text>
          <Text style={styles.bulletPoint}>• With your explicit consent for specific services</Text>

          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your personal information:
          </Text>
          <Text style={styles.bulletPoint}>• Encryption of sensitive data in transit and at rest</Text>
          <Text style={styles.bulletPoint}>• Regular security assessments and updates</Text>
          <Text style={styles.bulletPoint}>• Limited access to personal data on a need-to-know basis</Text>
          <Text style={styles.bulletPoint}>• Secure payment processing through trusted partners</Text>

          <Text style={styles.sectionTitle}>Your Rights and Choices</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Access, update, or delete your personal information</Text>
          <Text style={styles.bulletPoint}>• Opt-out of marketing communications</Text>
          <Text style={styles.bulletPoint}>• Request a copy of your data</Text>
          <Text style={styles.bulletPoint}>• Withdraw consent for optional data processing</Text>

          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal information only as long as necessary to provide our 
            services and fulfill the purposes outlined in this policy. When you delete 
            your account, we will securely delete your personal information within 30 days.
          </Text>

          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our service is not intended for children under 13 years of age. We do not 
            knowingly collect personal information from children under 13. If you become 
            aware that a child has provided us with personal information, please contact us.
          </Text>

          <Text style={styles.sectionTitle}>International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Your information may be transferred to and maintained on computers located 
            outside of your jurisdiction where data protection laws may differ. We ensure 
            appropriate safeguards are in place for such transfers.
          </Text>

          <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update our Privacy Policy from time to time. We will notify you of any 
            changes by posting the new Privacy Policy on this page and updating the 
            "last updated" date.
          </Text>

          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us through 
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