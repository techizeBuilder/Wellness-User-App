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

export default function ConnectedAccountsScreen() {
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
        <Text style={styles.headerTitle}>Connected Accounts</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.accountItem}
          >
            <Pressable style={styles.accountContent}>
              <Text style={styles.accountIcon}>📱</Text>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>Google</Text>
                <Text style={styles.accountStatus}>Connected</Text>
              </View>
              <Text style={styles.accountAction}>Disconnect</Text>
            </Pressable>
          </LinearGradient>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.accountItem}
          >
            <Pressable style={styles.accountContent}>
              <Text style={styles.accountIcon}>🍎</Text>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>Apple Health</Text>
                <Text style={styles.accountStatus}>Connected</Text>
              </View>
              <Text style={styles.accountAction}>Disconnect</Text>
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
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: getResponsiveMargin(16),
  },
  accountItem: {
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveMargin(12),
  },
  accountContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsivePadding(20),
  },
  accountIcon: {
    fontSize: getResponsiveFontSize(24),
    marginRight: getResponsiveMargin(16),
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: 'white',
    marginBottom: getResponsiveMargin(4),
  },
  accountStatus: {
    fontSize: getResponsiveFontSize(14),
    color: '#81C784',
  },
  accountAction: {
    fontSize: getResponsiveFontSize(14),
    color: '#FF6B6B',
    fontWeight: '600',
  },
});