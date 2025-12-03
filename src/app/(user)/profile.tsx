import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import ExpertFooter from '@/components/ExpertFooter';
import Footer, { FOOTER_HEIGHT } from '@/components/Footer';
import authService from '@/services/authService';
import apiService from '@/services/apiService';
import { handleApiError } from '@/services/apiService';
import { colors } from '@/utils/colors';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
  screenData
} from '@/utils/dimensions';
import { resolveProfileImageUrl } from '@/utils/imageHelpers';
import { showErrorToast, showSuccessToast } from '@/utils/toastConfig';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isExpert, setIsExpert] = useState(false);
  const [userData, setUserData] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
    specialization?: string;
  } | null>(null);
  const [expertData, setExpertData] = useState<any>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const params = useLocalSearchParams();

  const formatProfileImage = (value?: string | null) => {
    const resolved = resolveProfileImageUrl(value);
    return resolved || undefined;
  };

  useEffect(() => {
    const checkAccountTypeAndFetchProfile = async () => {
      try {
        const accountType = await authService.getAccountType();
        setIsExpert(accountType === 'Expert');

        // Fetch user or expert profile data
        try {
          if (accountType === 'Expert') {
            const response = await apiService.getCurrentExpertProfile();
            if (response.success && response.data?.expert) {
              const expertProfile = response.data.expert;
              setExpertData(expertProfile);
              setUserData({
                firstName: expertProfile.firstName,
                lastName: expertProfile.lastName,
                email: expertProfile.email,
                profileImage: formatProfileImage(expertProfile.profileImage),
                specialization: expertProfile.specialization,
              });
            }
          } else {
            const response = await apiService.getUserProfile();
            if (response.success && response.data?.user) {
              const currentUser = response.data.user;
              setUserData({
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
                profileImage: formatProfileImage(currentUser.profileImage),
              });
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } catch (error) {
        console.error('Error checking account type:', error);
      }
    };

    checkAccountTypeAndFetchProfile();
  }, []);

  const handleBackPress = () => {
    // Navigate back to appropriate dashboard based on account type
    if (isExpert) {
      router.push('/(expert)/expert-dashboard');
    } else {
      router.push('/(user)/dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
      router.replace('/(auth)/login');
    }
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

  const expertProfileSections = useMemo(() => [
    {
      title: 'PROFESSIONAL',
      items: [
        {
          icon: '📧',
          iconColor: '#2DD4BF',
          title: 'Contact Info',
          subtitle: userData?.email || 'dr.sophia@wellness.com',
          action: () => router.push('/(user)/contact-info')
        },
        {
          icon: '🏥',
          iconColor: '#2DD4BF',
          title: 'Professional Details',
          subtitle: 'Qualifications & certifications',
          action: () => router.push('/(expert)/professional-details')
        },
        {
          icon: '🗂️',
          iconColor: '#2DD4BF',
          title: 'Plans',
          subtitle: 'Manage class packs & subscriptions',
          action: () => router.push('/(expert)/expert-plans')
        },
        {
          icon: '💰',
          iconColor: '#2DD4BF',
          title: 'Earnings & Payouts',
          subtitle: 'Payment settings',
          action: () => router.push('/(expert)/expert-earnings')
        },
        {
          icon: '🏦',
          iconColor: '#2DD4BF',
          title: 'Bank Account',
          subtitle: 'Manage bank account details',
          action: () => router.push('/(expert)/bank-account')
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
          action: () => router.push('/(user)/notifications'),
          hasNotificationBadge: true,
          notificationCount: unreadNotifications,
          isEnabled: notificationsEnabled
        },
        {
          icon: '⏰',
          iconColor: '#2DD4BF',
          title: 'Manage Sessions',
          subtitle: 'Set your weekly session times',
          action: () => router.push('/(expert)/manage-availability')
        },
        {
          icon: '🔒',
          iconColor: '#2DD4BF',
          title: 'Reset Password',
          subtitle: 'Change your account password',
          action: () => router.push('/(user)/reset-password')
        },
      ]
    },
    {
      title: 'MORE',
      items: [
        {
          icon: '⚖️',
          title: 'Legal',
          subtitle: 'Terms and privacy policy',
          action: () => router.push('/(public)/legal')
        },
      ]
    }
  ], [userData, notificationsEnabled, unreadNotifications]);

  const userProfileSections = useMemo(() => [
    {
      title: 'ACCOUNT',
      items: [
        {
          icon: '📧',
          iconColor: '#2DD4BF',
          title: 'Contact Info',
          subtitle: userData?.email || 'sophia.bennett@gmail.com',
          action: () => router.push('/(user)/contact-info')
        },
        {
          icon: '🩺',
          iconColor: '#2DD4BF',
          title: 'Health Details',
          subtitle: 'Blood group, weight & BP',
          action: () => router.push('/(user)/health-vitals')
        },
        {
          icon: '📜',
          iconColor: '#2DD4BF',
          title: 'Payment History',
          subtitle: 'View all your payments',
          action: () => router.push('/(user)/payment-history')
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
          action: () => router.push('/(user)/notifications'),
          hasNotificationBadge: true,
          notificationCount: unreadNotifications,
          isEnabled: notificationsEnabled
        },
        {
          icon: '🔒',
          iconColor: '#2DD4BF',
          title: 'Reset Password',
          subtitle: 'Change your account password',
          action: () => router.push('/(user)/reset-password')
        },
      ]
    },
    {
      title: 'MORE',
      items: [
        {
          icon: '⚖️',
          title: 'Legal',
          subtitle: 'Terms and privacy policy',
          action: () => router.push('/(public)/legal')
        },
      ]
    }
  ], [userData, notificationsEnabled, unreadNotifications]);

  const profileSections = isExpert ? expertProfileSections : userProfileSections;

  const handleProfileImagePress = () => {
    if (isUploadingImage) {
      return;
    }

    const options = [
      {
        text: 'Take Photo',
        onPress: () => pickImage('camera'),
      },
      {
        text: 'Choose from Library',
        onPress: () => pickImage('library'),
      },
      {
        text: 'Cancel',
        style: 'cancel' as const,
      },
    ];

    if (Platform.OS === 'ios') {
      Alert.alert('Update Profile Photo', 'Select an option', options);
    } else {
      Alert.alert('Update Profile Photo', '', options);
    }
  };

  const pickImage = async (type: 'camera' | 'library') => {
    try {
      let permissionGranted = true;

      if (type === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        permissionGranted = permission.status === 'granted';
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        permissionGranted = permission.status === 'granted';
      }

      if (!permissionGranted) {
        showErrorToast('Permission Needed', 'Please grant access to continue.');
        return;
      }

      const pickerOptions: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      const result =
        type === 'camera'
          ? await ImagePicker.launchCameraAsync(pickerOptions)
          : await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (!result.canceled && result.assets?.length) {
        await uploadProfileImage(result.assets[0]);
      }
    } catch (error) {
      showErrorToast('Image Error', 'Unable to select image. Please try again.');
    }
  };

  const uploadProfileImage = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      setIsUploadingImage(true);

      const formData = new FormData();
      formData.append('profileImage', {
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: asset.fileName || `profile-${Date.now()}.jpg`,
      } as any);

      const response = isExpert
        ? await apiService.updateExpertProfileWithImage(formData)
        : await apiService.updateUserProfileWithImage(formData);

      if (response.success) {
        const updatedProfile = isExpert ? response.data?.expert : response.data?.user;
        if (updatedProfile) {
          setUserData((prev) => ({
            firstName: updatedProfile.firstName ?? prev?.firstName,
            lastName: updatedProfile.lastName ?? prev?.lastName,
            email: updatedProfile.email ?? prev?.email,
            profileImage: formatProfileImage(updatedProfile.profileImage),
            specialization: updatedProfile.specialization ?? prev?.specialization,
          }));
          showSuccessToast('Profile Updated', 'Your profile photo has been updated.');
        } else {
          showErrorToast('Upload Failed', response.message || 'Could not update profile photo.');
        }
      } else {
        showErrorToast('Upload Failed', response.message || 'Could not update profile photo.');
      }
    } catch (error) {
      const message = handleApiError(error);
      showErrorToast('Upload Failed', message);
    } finally {
      setIsUploadingImage(false);
    }
  };

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
            {userData?.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {userData?.firstName?.[0]?.toUpperCase() || 'U'}
                  {userData?.lastName?.[0]?.toUpperCase() || ''}
                </Text>
              </View>
            )}
            {isUploadingImage && (
              <View style={styles.imageOverlay}>
                <ActivityIndicator color={colors.white} size="small" />
              </View>
            )}
            <Pressable
              style={[styles.editButton, isUploadingImage && styles.editButtonDisabled]}
              onPress={handleProfileImagePress}
              disabled={isUploadingImage}
            >
              {isUploadingImage ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.editIcon}>📷</Text>
              )}
            </Pressable>
          </View>
          <Text style={styles.profileName}>
            {isExpert && userData?.firstName 
              ? `Dr. ${userData.firstName} ${userData.lastName || ''}`.trim()
              : userData?.firstName && userData?.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData?.firstName || 'User'}
          </Text>
          <Text style={styles.profileSubtitle}>
            {isExpert 
              ? userData?.specialization 
                ? `${userData.specialization} Expert`
                : 'Wellness Expert & Certified Therapist'
              : userData?.email || 'Yoga & Meditation Enthusiast'}
          </Text>
          
          <View style={styles.statsContainer}>
            {isExpert ? (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>89</Text>
                  <Text style={styles.statLabel}>Patients</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>420</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>4.9</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </>
            ) : (
              <>
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
              </>
            )}
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

      {/* Render appropriate footer based on account type */}
      {isExpert ? (
        <ExpertFooter activeRoute="profile" />
      ) : (
        <Footer activeRoute="profile" />
      )}
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
    paddingTop: getResponsiveHeight(screenData.isSmall ? 24 : 30),
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 12 : 16),
    paddingBottom: getResponsivePadding(8),
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
    paddingVertical: getResponsivePadding(screenData.isSmall ? 16 : 20),
    marginHorizontal: 0,
    marginTop: 0,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: getResponsiveMargin(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: getResponsiveWidth(screenData.isSmall ? 92 : 110),
    height: getResponsiveHeight(screenData.isSmall ? 92 : 110),
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 46 : 55),
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  profileImagePlaceholder: {
    width: getResponsiveWidth(screenData.isSmall ? 92 : 110),
    height: getResponsiveHeight(screenData.isSmall ? 92 : 110),
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 46 : 55),
    borderWidth: 3,
    borderColor: '#F59E0B',
    backgroundColor: '#2DD4BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: getResponsiveFontSize(screenData.isSmall ? 32 : 40),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: getResponsiveBorderRadius(screenData.isSmall ? 50 : 60),
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
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
  editButtonDisabled: {
    opacity: 0.7,
  },
  editIcon: {
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  profileName: {
    fontSize: screenData.isSmall ? fontSizes.xxl : fontSizes.xxl + 4,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveMargin(4),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileSubtitle: {
    fontSize: fontSizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: getResponsiveMargin(18),
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(14),
    paddingVertical: getResponsivePadding(10),
    paddingHorizontal: getResponsivePadding(screenData.isSmall ? 14 : 18),
    marginHorizontal: getResponsiveMargin(screenData.isSmall ? 12 : 16),
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
    height: getResponsiveHeight(26),
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: getResponsiveMargin(14),
  },
  section: {
    paddingTop: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(16),
    marginBottom: getResponsiveMargin(2),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: getResponsiveMargin(10),
    paddingLeft: getResponsivePadding(4),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
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
    width: getResponsiveWidth(36),
    height: getResponsiveHeight(36),
    borderRadius: getResponsiveBorderRadius(18),
    backgroundColor: '#2DD4BF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getResponsiveMargin(12),
  },
  menuIcon: {
    fontSize: getResponsiveFontSize(16),
    color: colors.white,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: getResponsiveFontSize(15),
    fontWeight: '600',
    color: '#22201eff',
    marginBottom: getResponsiveMargin(2),
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
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  premiumCard: {
    backgroundColor: colors.royalGold + '10',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    borderWidth: 1.5,
    borderColor: colors.royalGold + '30',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  premiumIconContainer: {
    width: getResponsiveWidth(44),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveBorderRadius(22),
    backgroundColor: colors.royalGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getResponsiveMargin(12),
  },
  premiumIcon: {
    fontSize: getResponsiveFontSize(20),
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: getResponsiveFontSize(17),
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: getResponsiveMargin(2),
  },
  premiumSubtitle: {
    fontSize: getResponsiveFontSize(14),
    color: colors.charcoalGray,
  },
  premiumBenefits: {
    marginBottom: getResponsiveMargin(8),
  },
  subscriptionDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: getResponsiveBorderRadius(8),
    padding: getResponsivePadding(10),
    marginBottom: getResponsiveMargin(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(6),
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
    fontSize: getResponsiveFontSize(12),
    color: colors.deepTeal,
    marginBottom: getResponsiveMargin(4),
    fontWeight: '500',
  },
  manageButton: {
    backgroundColor: colors.royalGold,
    paddingVertical: getResponsivePadding(10),
    paddingHorizontal: getResponsivePadding(16),
    borderRadius: getResponsiveBorderRadius(10),
    alignItems: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  manageButtonText: {
    fontSize: getResponsiveFontSize(15),
    fontWeight: '700',
    color: '#000000',
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  logoutSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
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
    height: FOOTER_HEIGHT + getResponsiveHeight(12), // Footer height + slimmer padding
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
  expertAnalyticsButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Expert Performance White Card Styles
  expertPerformanceWhiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: getResponsiveHeight(4),
  },
  expertPerformanceIconContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getResponsiveWidth(16),
  },
  expertPerformanceButton: {
    backgroundColor: '#10B981',
    borderRadius: getResponsiveBorderRadius(8),
    paddingVertical: getResponsiveHeight(10),
    alignItems: 'center',
    marginTop: getResponsiveHeight(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expertPerformanceButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});