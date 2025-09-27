import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../src/utils/colors';

export default function LegalScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Legal</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Pressable style={styles.legalItem}>
            <Text style={styles.legalIcon}>📋</Text>
            <View style={styles.legalInfo}>
              <Text style={styles.legalTitle}>Terms of Service</Text>
              <Text style={styles.legalSubtitle}>Read our terms and conditions</Text>
            </View>
            <Text style={styles.legalArrow}>→</Text>
          </Pressable>
          
          <Pressable style={styles.legalItem}>
            <Text style={styles.legalIcon}>🔒</Text>
            <View style={styles.legalInfo}>
              <Text style={styles.legalTitle}>Privacy Policy</Text>
              <Text style={styles.legalSubtitle}>How we protect your data</Text>
            </View>
            <Text style={styles.legalArrow}>→</Text>
          </Pressable>
          
          <Pressable style={styles.legalItem}>
            <Text style={styles.legalIcon}>🍪</Text>
            <View style={styles.legalInfo}>
              <Text style={styles.legalTitle}>Cookie Policy</Text>
              <Text style={styles.legalSubtitle}>How we use cookies</Text>
            </View>
            <Text style={styles.legalArrow}>→</Text>
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
  legalItem: {
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
    color: colors.deepTeal,
    marginBottom: 4,
  },
  legalSubtitle: {
    fontSize: 14,
    color: colors.charcoalGray,
  },
  legalArrow: {
    fontSize: 16,
    color: colors.deepTeal,
  },
});