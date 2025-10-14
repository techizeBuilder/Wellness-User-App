import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Footer, { FOOTER_HEIGHT } from '../src/components/Footer';
import { colors } from '../src/utils/colors';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
  screenData
} from '../src/utils/dimensions';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const handleBackPress = () => {
    router.back();
  };

  const handleLogout = () => {
    router.replace('/login');
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Simulate clearing notifications when disabled
    if (notificationsEnabled) {
      setUnreadNotifications(0);
    } else {
      setUnreadNotifications(3);
    }
  };

  const profileSections = [
    {
      title: 'ACCOUNT',
      items: [
        { 
          icon: '📧', 
          iconColor: '#2DD4BF',
          title: 'Contact Info', 
          subtitle: 'sophia.bennett@gmail.com', 
          action: () => router.push('/contact-info')
        },
        { 
          icon: '💖', 
          iconColor: '#2DD4BF',
          title: 'Health Preferences', 
          subtitle: 'Manage your wellness goals', 
          action: () => router.push('/health-preferences')
        },
        { 
          icon: '💳', 
          iconColor: '#2DD4BF',
          title: 'Payment Methods', 
          subtitle: 'Cards and billing info', 
          action: () => router.push('/payment-methods')
        },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { 
          icon: '🔔', 
          title: 'Notifications', 
          subtitle: notificationsEnabled ? 'All notifications enabled' : 'Notifications disabled',
          action: () => router.push('/notifications'),
          hasNotificationBadge: true,
          notificationCount: unreadNotifications,
          isEnabled: notificationsEnabled
        },
        { 
          icon: '🌐', 
          title: 'Language', 
          subtitle: 'English', 
          action: () => router.push('/language')
        },
        { 
          icon: '🔗', 
          title: 'Connected Accounts', 
          subtitle: 'Google, Apple Health', 
          action: () => router.push('/connected-accounts')
        },
      ]
    },
    {
      title: 'MORE',
      items: [
        { 
          icon: '📋', 
          title: 'Subscription Details', 
          subtitle: 'Premium plan active', 
          action: () => router.push('/subscription-details')
        },
        { 
          icon: '❓', 
          title: 'Help & Support', 
          subtitle: 'FAQs and contact support', 
          action: () => router.push('/help-support')
        },
        { 
          icon: '⚖️', 
          title: 'Legal', 
          subtitle: 'Terms and privacy policy', 
          action: () => router.push('/legal')
        },
      ]
    }
  ];

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
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face' }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <Pressable style={styles.editButton}>
              <Text style={styles.editIcon}>✏️</Text>
            </Pressable>
          </View>
          <Text style={styles.profileName}>Sophia Bennett</Text>
          <Text style={styles.profileSubtitle}>Yoga & Meditation Enthusiast</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Experts</Text>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuContainer}>
              {section.items.map((item, itemIndex) => (
                <Pressable
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex === section.items.length - 1 && styles.menuItemLast
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[
                      styles.iconContainer,
                      item.hasNotificationBadge && !item.isEnabled && styles.iconContainerDisabled
                    ]}>
                      <Text style={[
                        styles.menuIcon,
                        item.hasNotificationBadge && !item.isEnabled && styles.menuIconDisabled
                      ]}>
                        {item.icon}
                      </Text>
                      {item.hasNotificationBadge && item.notificationCount > 0 && (
                        <View style={styles.notificationBadge}>
                          <Text style={styles.notificationBadgeText}>
                            {item.notificationCount > 9 ? '9+' : item.notificationCount}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.menuItemContent}>
                      <View style={styles.titleRow}>
                        <Text style={styles.menuItemTitle}>{item.title}</Text>
                        {item.hasNotificationBadge && (
                          <View style={[
                            styles.statusIndicator,
                            item.isEnabled ? styles.statusEnabled : styles.statusDisabled
                          ]}>
                            <Text style={styles.statusText}>
                              {item.isEnabled ? 'ON' : 'OFF'}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.menuItemSubtitle,
                        item.hasNotificationBadge && !item.isEnabled && styles.menuItemSubtitleDisabled
                      ]}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.menuArrow}>›</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Premium Badge */}
        <View style={styles.premiumSection}>
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 248, 220, 0.3)']}
            style={styles.premiumCard}
          >
            <View style={styles.premiumHeader}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.premiumIconContainer}
              >
                <Text style={styles.premiumIcon}>👑</Text>
              </LinearGradient>
              <View style={styles.premiumInfo}>
                <Text style={styles.premiumTitle}>Premium Member</Text>
                <Text style={styles.premiumSubtitle}>Unlimited access to all features</Text>
              </View>
            </View>

            {/* Subscription Details */}
            <View style={styles.subscriptionDetails}>
              <View style={styles.subscriptionRow}>
                <Text style={styles.subscriptionLabel}>Plan:</Text>
                <Text style={styles.subscriptionValue}>Annual Premium</Text>
              </View>
              <View style={styles.subscriptionRow}>
                <Text style={styles.subscriptionLabel}>Next billing:</Text>
                <Text style={styles.subscriptionValue}>Nov 14, 2025</Text>
              </View>
              <View style={styles.subscriptionRow}>
                <Text style={styles.subscriptionLabel}>Amount:</Text>
                <Text style={styles.subscriptionValue}>$99.99/year</Text>
              </View>
            </View>

            <View style={styles.premiumBenefits}>
              <Text style={styles.benefitItem}>✅ Unlimited expert sessions</Text>
              <Text style={styles.benefitItem}>✅ Priority booking</Text>
              <Text style={styles.benefitItem}>✅ Exclusive content</Text>
              <Text style={styles.benefitItem}>✅ Personal wellness tracker</Text>
            </View>
            <LinearGradient
              colors={['#FFD700', '#FF8C00', '#FF6347']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.manageButton}
            >
              <Text style={styles.manageButtonText}>Manage Subscription</Text>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Pressable
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Footer activeRoute="profile" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: getResponsiveHeight(screenData.isSmall ? 40 : 50),
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 16 : 20),
    paddingBottom: getResponsivePadding(16),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: fontSizes.lg,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerRight: {
    width: getResponsiveWidth(40),
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: getResponsivePadding(screenData.isSmall ? 30 : 40),
    marginHorizontal: 0,
    marginTop: 0,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: getResponsiveMargin(20),
  },
  profileImage: {
    width: getResponsiveWidth(screenData.isSmall ? 100 : 120),
    height: getResponsiveHeight(screenData.isSmall ? 100 : 120),
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 50 : 60),
    borderWidth: 4,
    borderColor: '#F59E0B',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: getResponsiveWidth(screenData.isSmall ? 28 : 32),
    height: getResponsiveHeight(screenData.isSmall ? 28 : 32),
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 14 : 16),
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  editIcon: {
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  profileName: {
    fontSize: screenData.isSmall ? fontSizes.xxl : fontSizes.xxl + 4,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: getResponsiveMargin(4),
    textAlign: 'center',
  },
  profileSubtitle: {
    fontSize: fontSizes.md,
    color: '#666666',
    marginBottom: getResponsiveMargin(32),
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(20),
    paddingVertical: getResponsivePadding(20),
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 24 : 32),
    marginHorizontal: getResponsiveMargin(screenData.isSmall ? 16 : 20),
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
    minWidth: getResponsiveWidth(60),
  },
  statNumber: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: getResponsiveMargin(4),
  },
  statLabel: {
    fontSize: getResponsiveFontSize(14),
    color: '#666666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: getResponsiveHeight(30),
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: getResponsiveMargin(20),
  },
  section: {
    paddingTop: getResponsivePadding(24),
    paddingHorizontal: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(8),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    marginBottom: getResponsiveMargin(16),
    paddingLeft: getResponsivePadding(4),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: '#2DD4BF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getResponsiveMargin(16),
  },
  menuIcon: {
    fontSize: getResponsiveFontSize(16),
    color: colors.white,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: '#22201eff',
    marginBottom: getResponsiveMargin(4),
  },
  menuItemSubtitle: {
    fontSize: getResponsiveFontSize(14),
    color: '#666666',
  },
  menuArrow: {
    fontSize: getResponsiveFontSize(20),
    color: '#F59E0B',
    fontWeight: 'bold',
  },
  premiumSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  premiumCard: {
    backgroundColor: colors.royalGold + '10',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    borderWidth: 2,
    borderColor: colors.royalGold + '30',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(16),
  },
  premiumIconContainer: {
    width: getResponsiveWidth(50),
    height: getResponsiveHeight(50),
    borderRadius: getResponsiveBorderRadius(25),
    backgroundColor: colors.royalGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getResponsiveMargin(16),
  },
  premiumIcon: {
    fontSize: getResponsiveFontSize(20),
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: getResponsiveMargin(4),
  },
  premiumSubtitle: {
    fontSize: getResponsiveFontSize(14),
    color: colors.charcoalGray,
  },
  premiumBenefits: {
    marginBottom: getResponsiveMargin(20),
  },
  subscriptionDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: getResponsiveBorderRadius(10),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveMargin(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  subscriptionLabel: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    fontWeight: '500',
  },
  subscriptionValue: {
    fontSize: getResponsiveFontSize(14),
    color: '#1F2937',
    fontWeight: '600',
  },
  benefitItem: {
    fontSize: getResponsiveFontSize(14),
    color: colors.deepTeal,
    marginBottom: getResponsiveMargin(8),
    fontWeight: '500',
  },
  manageButton: {
    backgroundColor: colors.royalGold,
    paddingVertical: getResponsivePadding(14),
    paddingHorizontal: getResponsivePadding(20),
    borderRadius: getResponsiveBorderRadius(12),
    alignItems: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  manageButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '700',
    color: '#000000',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  bottomSpacer: {
    height: FOOTER_HEIGHT + getResponsiveHeight(30), // Footer height + extra padding
  },
  // Enhanced Notification Styles
  iconContainerDisabled: {
    opacity: 0.6,
  },
  menuIconDisabled: {
    opacity: 0.7,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4444',
    borderRadius: getResponsiveBorderRadius(10),
    minWidth: getResponsiveWidth(20),
    height: getResponsiveHeight(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(10),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(4),
  },
  statusIndicator: {
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(2),
    borderRadius: getResponsiveBorderRadius(10),
    borderWidth: 1,
  },
  statusEnabled: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  statusDisabled: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderColor: '#F44336',
  },
  statusText: {
    fontSize: getResponsiveFontSize(10),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuItemSubtitleDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});