import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { colors } from '@/utils/colors';
import {
  fontSizes,
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth
} from '@/utils/dimensions';
import { apiService, handleApiError } from '@/services/apiService';
import authService from '@/services/authService';

export default function ContactInfoScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [accountType, setAccountType] = useState<'User' | 'Expert' | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialProfile, setInitialProfile] = useState<{
    fullName: string;
    email: string;
    phone: string;
  } | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const storedAccountType = await authService.getAccountType();
      const normalizedAccountType =
        storedAccountType === 'Expert' ? 'Expert' : 'User';
      setAccountType(normalizedAccountType);

      let profilePayload: any = null;

      if (normalizedAccountType === 'Expert') {
        const response = await apiService.getCurrentExpertProfile();
        profilePayload =
          response?.data?.expert ??
          response?.expert ??
          response?.data ??
          null;
      } else {
        const response = await apiService.getUserProfile();
        profilePayload =
          response?.data?.user ??
          response?.user ??
          response?.data ??
          null;
      }

      if (!profilePayload) {
        throw new Error('Unable to load profile details.');
      }

      const firstName = profilePayload.firstName ?? '';
      const lastName = profilePayload.lastName ?? '';
      const composedName =
        [firstName, lastName].filter(Boolean).join(' ').trim() ||
        profilePayload.name ||
        'User';

      const userEmail = profilePayload.email ?? '';
      const userPhone = profilePayload.phone ?? '';

      setFullName(composedName);
      setEmail(userEmail);
      setPhone(userPhone);
      setInitialProfile({
        fullName: composedName,
        email: userEmail,
        phone: userPhone,
      });
    } catch (error) {
      const message = handleApiError(error);
      Alert.alert('Error', message);
    } finally {
      setProfileLoading(false);
      setIsEditing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    if (initialProfile) {
      setFullName(initialProfile.fullName);
      setEmail(initialProfile.email);
      setPhone(initialProfile.phone);
    }
  }, [initialProfile]);

  const handleSave = useCallback(async () => {
    if (!fullName.trim()) {
      Alert.alert('Validation', 'Please enter your full name.');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Validation', 'Please enter your phone number.');
      return;
    }

    const trimmedName = fullName.trim();
    const nameParts = trimmedName.split(/\s+/);
    const firstName = nameParts.shift() || '';
    const lastName = nameParts.join(' ') || firstName;
    const trimmedPhone = phone.trim();

    setSaving(true);
    try {
      if (accountType === 'Expert') {
        await apiService.updateExpertProfile({
          firstName,
          lastName,
          phone: trimmedPhone,
        });
      } else {
        await apiService.updateUserProfile({
          firstName,
          lastName,
          phone: trimmedPhone,
        });
      }

      setFullName(trimmedName);
      setPhone(trimmedPhone);
      setInitialProfile({
        fullName: trimmedName,
        email,
        phone: trimmedPhone,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Contact info updated successfully.');
    } catch (error) {
      const message = handleApiError(error);
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  }, [accountType, fullName, phone, email]);

  const handleEditToggle = useCallback(() => {
    if (profileLoading || saving) {
      return;
    }
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  }, [handleCancel, isEditing, profileLoading, saving]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2da898ff" />
      
      <LinearGradient
        colors={['#2da898ff', '#abeee6ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Contact Info</Text>
          <Pressable
            style={[
              styles.editButton,
              (profileLoading || saving) && styles.editButtonDisabled,
            ]}
            onPress={handleEditToggle}
            disabled={profileLoading || saving}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </Pressable>
        </View>

        {profileLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.loadingText}>Loading contact info…</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Section */}
            <View style={styles.profileCard}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImageText}>
                    {fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '👤'}
                  </Text>
                </View>
                {isEditing && (
                  <Pressable style={styles.changePhotoButton}>
                    <Text style={styles.changePhotoText}>📸</Text>
                  </Pressable>
                )}
              </View>
              <Text style={styles.profileName}>{fullName || 'Your Name'}</Text>
              <Text style={styles.profileSubtitle}>
                {email || 'Email not available'}
              </Text>
            </View>

            {/* Contact Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Details</Text>
              <View style={styles.sectionTitleSpacer} />

              {/* Full Name Card */}
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Text style={styles.infoIcon}>👤</Text>
                  <Text style={styles.infoLabel}>Full Name</Text>
                </View>
                {isEditing ? (
                  <TextInput
                    style={styles.editInput}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                ) : (
                  <Text style={styles.infoValue}>
                    {fullName || 'Not provided'}
                  </Text>
                )}
              </View>

              {/* Email Card */}
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Text style={styles.infoIcon}>✉️</Text>
                  <Text style={styles.infoLabel}>Email Address</Text>
                </View>
                <Text style={[styles.infoValue, styles.infoValueMuted]}>
                  {email || 'Not provided'}
                </Text>
                {isEditing && (
                  <Text style={styles.helperText}>
                    Email cannot be changed from this screen.
                  </Text>
                )}
              </View>

              {/* Phone Card */}
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Text style={styles.infoIcon}>📱</Text>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                </View>
                {isEditing ? (
                  <TextInput
                    style={styles.editInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+91 98765 43210"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>
                    {phone || 'Not provided'}
                  </Text>
                )}
              </View>
            </View>

            {/* Privacy Section */}
            <View style={styles.privacyCard}>
              <Text style={styles.privacyIcon}>🔒</Text>
              <View style={styles.privacyContent}>
                <Text style={styles.privacyTitle}>Privacy Protected</Text>
                <Text style={styles.privacyText}>
                  Your personal information is encrypted and secure. We never share your data with third parties.
                </Text>
              </View>
            </View>

            {/* Save Button */}
            {isEditing && (
              <Pressable
                style={[
                  styles.saveButton,
                  saving && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </Text>
              </Pressable>
            )}
          </ScrollView>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: getResponsiveFontSize(20),
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.white,
  },
  editButton: {
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(25),
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonDisabled: {
    opacity: 0.6,
  },
  editButtonText: {
    fontSize: fontSizes.md,
    color: colors.white,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(30),
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getResponsivePadding(32),
    paddingBottom: getResponsivePadding(60),
  },
  loadingText: {
    marginTop: getResponsiveMargin(16),
    fontSize: fontSizes.md,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.85,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(20),
    alignItems: 'center',
    marginBottom: getResponsiveMargin(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: getResponsiveMargin(10),
  },
  profileImagePlaceholder: {
    width: getResponsiveWidth(100),
    height: getResponsiveHeight(100),
    borderRadius: getResponsiveBorderRadius(50),
    backgroundColor: '#E8F5F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#2da898ff',
    shadowColor: '#2da898ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageText: {
    fontSize: getResponsiveFontSize(42),
    color: '#2da898ff',
    fontWeight: '700',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: getResponsiveWidth(30),
    height: getResponsiveHeight(30),
    borderRadius: getResponsiveBorderRadius(15),
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  changePhotoText: {
    fontSize: getResponsiveFontSize(14),
  },
  profileName: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: getResponsiveMargin(4),
    textAlign: 'center',
  },
  profileSubtitle: {
    fontSize: fontSizes.md,
    color: 'rgba(45, 168, 152, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: getResponsiveMargin(18),
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: getResponsiveMargin(4),
  },
  sectionTitleSpacer: {
    height: getResponsiveHeight(12),
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: getResponsiveBorderRadius(18),
    padding: getResponsivePadding(18),
    marginBottom: getResponsiveMargin(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  infoIcon: {
    fontSize: getResponsiveFontSize(20),
    marginRight: getResponsiveMargin(12),
    width: getResponsiveWidth(24),
  },
  infoLabel: {
    fontSize: fontSizes.md,
    color: '#2da898ff',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: fontSizes.md,
    color: 'rgba(45, 168, 152, 0.9)',
    lineHeight: getResponsiveHeight(22),
    marginLeft: getResponsiveMargin(36),
    fontWeight: '600',
  },
  infoValueMuted: {
    color: 'rgba(45, 168, 152, 0.75)',
  },
  editInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: getResponsiveBorderRadius(10),
    paddingHorizontal: getResponsivePadding(14),
    paddingVertical: getResponsivePadding(12),
    fontSize: fontSizes.md,
    color: '#333333',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginLeft: getResponsiveMargin(36),
    marginTop: getResponsiveMargin(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  helperText: {
    marginTop: getResponsiveMargin(8),
    marginLeft: getResponsiveMargin(36),
    fontSize: fontSizes.sm,
    color: '#F59E0B',
    fontStyle: 'italic',
  },
  multilineInput: {
    minHeight: getResponsiveHeight(60),
    textAlignVertical: 'top',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: getResponsiveBorderRadius(18),
    padding: getResponsivePadding(18),
    marginBottom: getResponsiveMargin(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  privacyIcon: {
    fontSize: getResponsiveFontSize(28),
    marginRight: getResponsiveMargin(14),
    alignSelf: 'flex-start',
    marginTop: getResponsiveMargin(2),
  },
  privacyContent: {
    flex: 1,
    alignSelf: 'center',
  },
  privacyTitle: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: '#2da898ff',
    marginBottom: getResponsiveMargin(6),
  },
  privacyText: {
    fontSize: fontSizes.sm,
    color: 'rgba(45, 168, 152, 0.9)',
    lineHeight: getResponsiveHeight(20),
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2da898ff',
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(18),
    paddingHorizontal: getResponsivePadding(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getResponsiveMargin(24),
    marginBottom: getResponsiveMargin(24),
    shadowColor: '#2da898ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    alignSelf: 'center',
    minWidth: getResponsiveWidth(200),
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.white,
  },
});
