import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '../src/utils/colors';

export default function NotificationsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [expertMessages, setExpertMessages] = useState(true);
  const [contentUpdates, setContentUpdates] = useState(false);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  const [weeklyNewsletter, setWeeklyNewsletter] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <LinearGradient
      colors={['#4DD0E1', '#81C784', '#BA68C8']}
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
        {/* Push Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Push Notifications</Text>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.settingCard}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive notifications on your device</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: colors.warmGray, true: colors.sageGreen + '50' }}
                thumbColor={pushNotifications ? colors.sageGreen : colors.charcoalGray}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Session Reminders</Text>
                <Text style={styles.settingDescription}>Get reminded about upcoming sessions</Text>
              </View>
              <Switch
                value={sessionReminders}
                onValueChange={setSessionReminders}
                trackColor={{ false: colors.warmGray, true: colors.sageGreen + '50' }}
                thumbColor={sessionReminders ? colors.sageGreen : colors.charcoalGray}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Expert Messages</Text>
                <Text style={styles.settingDescription}>Notifications from your wellness experts</Text>
              </View>
              <Switch
                value={expertMessages}
                onValueChange={setExpertMessages}
                trackColor={{ false: colors.warmGray, true: colors.sageGreen + '50' }}
                thumbColor={expertMessages ? colors.sageGreen : colors.charcoalGray}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Content Updates</Text>
                <Text style={styles.settingDescription}>New articles and wellness content</Text>
              </View>
              <Switch
                value={contentUpdates}
                onValueChange={setContentUpdates}
                trackColor={{ false: colors.warmGray, true: colors.sageGreen + '50' }}
                thumbColor={contentUpdates ? colors.sageGreen : colors.charcoalGray}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Email Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📧 Email Notifications</Text>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.settingCard}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive updates via email</Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: colors.warmGray, true: colors.sageGreen + '50' }}
                thumbColor={emailNotifications ? colors.sageGreen : colors.charcoalGray}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Weekly Newsletter</Text>
                <Text style={styles.settingDescription}>Weekly wellness tips and updates</Text>
              </View>
              <Switch
                value={weeklyNewsletter}
                onValueChange={setWeeklyNewsletter}
                trackColor={{ false: colors.warmGray, true: colors.sageGreen + '50' }}
                thumbColor={weeklyNewsletter ? colors.sageGreen : colors.charcoalGray}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Promotional Emails</Text>
                <Text style={styles.settingDescription}>Special offers and promotions</Text>
              </View>
              <Switch
                value={promotionalEmails}
                onValueChange={setPromotionalEmails}
                trackColor={{ false: colors.warmGray, true: colors.sageGreen + '50' }}
                thumbColor={promotionalEmails ? colors.sageGreen : colors.charcoalGray}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Sound & Vibration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 Sound & Vibration</Text>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.settingCard}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Sound</Text>
                <Text style={styles.settingDescription}>Play sound for notifications</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.warmGray, true: colors.sageGreen + '50' }}
                thumbColor={soundEnabled ? colors.sageGreen : colors.charcoalGray}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Vibration</Text>
                <Text style={styles.settingDescription}>Vibrate for notifications</Text>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: colors.warmGray, true: colors.sageGreen + '50' }}
                thumbColor={vibrationEnabled ? colors.sageGreen : colors.charcoalGray}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Notification Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Notification Schedule</Text>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.scheduleCard}
          >
            <Pressable style={styles.scheduleItem}>
              <Text style={styles.scheduleIcon}>🌅</Text>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleTitle}>Quiet Hours</Text>
                <Text style={styles.scheduleTime}>10:00 PM - 7:00 AM</Text>
              </View>
              <Text style={styles.scheduleArrow}>→</Text>
            </Pressable>
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
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  settingCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightMistTeal,
    marginVertical: 16,
  },
  scheduleCard: {
    borderRadius: 16,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  scheduleIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scheduleTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scheduleArrow: {
    fontSize: 16,
    color: 'white',
  },
  bottomSpacer: {
    height: 40,
  },
});