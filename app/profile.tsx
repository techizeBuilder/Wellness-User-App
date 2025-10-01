import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Footer from '../src/components/Footer';
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
    <LinearGradient
      colors={['#4DD0E1', '#81C784', '#BA68C8']}
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
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
          style={styles.profileSection}
        >
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
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.3)']}
            style={styles.statsContainer}
          >
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
          </LinearGradient>
        </LinearGradient>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
              style={styles.menuContainer}
            >
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
            </LinearGradient>
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
            <View style={styles.premiumBenefits}>
              <Text style={styles.benefitItem}>✅ Unlimited expert sessions</Text>
              <Text style={styles.benefitItem}>✅ Priority booking</Text>
              <Text style={styles.benefitItem}>✅ Exclusive content</Text>
              <Text style={styles.benefitItem}>✅ Personal wellness tracker</Text>
            </View>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.manageButton}
            >
              <Text style={styles.manageButtonText}>Manage Subscription</Text>
            </LinearGradient>
          </LinearGradient>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <LinearGradient
            colors={['rgba(255, 99, 71, 0.1)', 'rgba(255, 160, 122, 0.2)']}
            style={styles.logoutButton}
          >
            <Pressable
              style={styles.logoutPressable}
              onPress={handleLogout}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>
          </LinearGradient>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
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
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
    color: colors.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
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
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 20,
  },
  section: {
    paddingTop: 24,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
    marginBottom: 16,
    paddingLeft: 4,
  },
  menuContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(77, 208, 225, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: 'rgba(77, 208, 225, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 3,
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
    color: 'rgba(0, 0, 0, 0.6)',
  },
  menuArrow: {
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.4)',
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
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 99, 71, 0.3)',
  },
  logoutPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  bottomSpacer: {
    height: 100,
  },
});