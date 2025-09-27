import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../src/utils/colors';

export default function ProfileScreen() {
  const handleBackPress = () => {
    router.back();
  };

  const handleLogout = () => {
    router.replace('/login');
  };

  const profileSections = [
    {
      title: 'ACCOUNT',
      items: [
        { 
          icon: '📧', 
          title: 'Contact Info', 
          subtitle: 'sophia.bennett@gmail.com', 
          action: () => router.push('/contact-info')
        },
        { 
          icon: '💖', 
          title: 'Health Preferences', 
          subtitle: 'Manage your wellness goals', 
          action: () => router.push('/health-preferences')
        },
        { 
          icon: '💳', 
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
          subtitle: 'Push notifications and alerts', 
          action: () => router.push('/notifications')
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
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
              source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b2e5?w=120&h=120&fit=crop&crop=face' }}
              style={styles.profileImage}
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
                  <View style={styles.iconContainer}>
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </Pressable>
            ))}
          </View>
        ))}

        {/* Premium Badge */}
        <View style={styles.premiumSection}>
          <View style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <View style={styles.premiumIconContainer}>
                <Text style={styles.premiumIcon}>👑</Text>
              </View>
              <View style={styles.premiumInfo}>
                <Text style={styles.premiumTitle}>Premium Member</Text>
                <Text style={styles.premiumSubtitle}>Unlimited access to all features</Text>
              </View>
            </View>
            <View style={styles.premiumBenefits}>
              <Text style={styles.benefitItem}>✅ Unlimited expert sessions</Text>
              <Text style={styles.benefitItem}>✅ Priority booking</Text>
              <Text style={styles.benefitItem}>✅ Exclusive content</Text>
              <Text style={styles.benefitItem}>✅ Personal wellness tracker</Text>
            </View>
            <Pressable style={styles.manageButton}>
              <Text style={styles.manageButtonText}>Manage Subscription</Text>
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/experts')}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Experts</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>📅</Text>
          <Text style={styles.navLabel}>Sessions</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/content')}>
          <Text style={styles.navIcon}>📱</Text>
          <Text style={styles.navLabel}>Content</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Text style={[styles.navIcon, styles.navIconActive]}>👤</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
        </Pressable>
      </View>
    </View>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.lightMistTeal,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.white,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.royalGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 14,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: colors.charcoalGray,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.charcoalGray,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.lightMistTeal,
    marginHorizontal: 20,
  },
  section: {
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.charcoalGray,
    letterSpacing: 1,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.warmGray,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightMistTeal,
  },
  menuItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightMistTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: colors.charcoalGray,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.charcoalGray,
    fontWeight: 'bold',
  },
  premiumSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  premiumCard: {
    backgroundColor: colors.royalGold + '10',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.royalGold + '30',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.royalGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  premiumIcon: {
    fontSize: 20,
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: colors.charcoalGray,
  },
  premiumBenefits: {
    marginBottom: 20,
  },
  benefitItem: {
    fontSize: 14,
    color: colors.deepTeal,
    marginBottom: 8,
    fontWeight: '500',
  },
  manageButton: {
    backgroundColor: colors.royalGold,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coralAccent + '10',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.coralAccent + '30',
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.coralAccent,
  },
  bottomSpacer: {
    height: 90,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightMistTeal,
    paddingTop: 8,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: colors.charcoalGray,
  },
  navIconActive: {
    color: colors.deepTeal,
  },
  navLabel: {
    fontSize: 11,
    color: colors.charcoalGray,
    fontWeight: '500',
  },
  navLabelActive: {
    color: colors.deepTeal,
    fontWeight: '600',
  },
});