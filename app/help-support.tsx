import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../src/utils/colors';

export default function HelpSupportScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
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
          
          <Pressable style={styles.helpItem}>
            <Text style={styles.helpIcon}>❓</Text>
            <View style={styles.helpInfo}>
              <Text style={styles.helpTitle}>FAQs</Text>
              <Text style={styles.helpSubtitle}>Find answers to common questions</Text>
            </View>
            <Text style={styles.helpArrow}>→</Text>
          </Pressable>
          
          <Pressable style={styles.helpItem}>
            <Text style={styles.helpIcon}>💬</Text>
            <View style={styles.helpInfo}>
              <Text style={styles.helpTitle}>Live Chat</Text>
              <Text style={styles.helpSubtitle}>Chat with our support team</Text>
            </View>
            <Text style={styles.helpArrow}>→</Text>
          </Pressable>
          
          <Pressable style={styles.helpItem}>
            <Text style={styles.helpIcon}>📧</Text>
            <View style={styles.helpInfo}>
              <Text style={styles.helpTitle}>Contact Us</Text>
              <Text style={styles.helpSubtitle}>Send us an email</Text>
            </View>
            <Text style={styles.helpArrow}>→</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
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
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightMistTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.deepTeal,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.deepTeal,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 16,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  helpIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  helpInfo: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  helpSubtitle: {
    fontSize: 14,
    color: colors.charcoalGray,
  },
  helpArrow: {
    fontSize: 16,
    color: colors.deepTeal,
  },
});