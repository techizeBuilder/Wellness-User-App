import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '@/utils/colors';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth
} from '@/utils/dimensions';

export default function NotificationsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <LinearGradient
      colors={['#2DD4BF', '#14B8A6', '#0D9488']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.settingCard}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Enable Notifications</Text>
                <Text style={styles.settingDescription}>Turn all app notifications on or off</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E7EB"
                style={styles.switch}
              />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.bottomSpacer} />
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
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerRight: {
    width: getResponsiveWidth(40),
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: getResponsivePadding(20),
    marginTop: getResponsiveMargin(28),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: getResponsiveMargin(16),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  settingCard: {
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: getResponsiveMargin(4),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getResponsivePadding(8),
  },
  settingInfo: {
    flex: 1,
    marginRight: getResponsiveMargin(16),
  },
  settingTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: 'white',
    marginBottom: getResponsiveMargin(4),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  settingDescription: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: getResponsiveHeight(18),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: getResponsiveMargin(16),
  },
  scheduleCard: {
    borderRadius: getResponsiveBorderRadius(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsivePadding(20),
  },
  scheduleIcon: {
    fontSize: getResponsiveFontSize(24),
    marginRight: getResponsiveMargin(16),
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: 'white',
    marginBottom: getResponsiveMargin(4),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scheduleTime: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scheduleArrow: {
    fontSize: getResponsiveFontSize(16),
    color: 'white',
  },
  bottomSpacer: {
    height: getResponsiveHeight(40),
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});