import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../src/utils/colors';

export default function ConnectedAccountsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Connected Accounts</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          
          <Pressable style={styles.accountItem}>
            <Text style={styles.accountIcon}>📱</Text>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Google</Text>
              <Text style={styles.accountStatus}>Connected</Text>
            </View>
            <Text style={styles.accountAction}>Disconnect</Text>
          </Pressable>
          
          <Pressable style={styles.accountItem}>
            <Text style={styles.accountIcon}>🍎</Text>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Apple Health</Text>
              <Text style={styles.accountStatus}>Connected</Text>
            </View>
            <Text style={styles.accountAction}>Disconnect</Text>
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
  accountItem: {
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
  accountIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  accountStatus: {
    fontSize: 14,
    color: colors.sageGreen,
  },
  accountAction: {
    fontSize: 14,
    color: colors.coralAccent,
    fontWeight: '600',
  },
});