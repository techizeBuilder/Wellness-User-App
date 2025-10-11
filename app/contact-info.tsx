import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../src/utils/colors';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '../src/utils/dimensions';

export default function ContactInfoScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('Sophia Bennett');
  const [email, setEmail] = useState('sophia.dev@personal.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [address, setAddress] = useState('123 Wellness Street, San Francisco, CA 94102');
  const [dateOfBirth, setDateOfBirth] = useState('March 15, 1990');
  const [emergencyContact, setEmergencyContact] = useState('John Bennett - +1 (555) 987-6543');

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Contact info saved');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
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
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Contact Info</Text>
        <Pressable 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
          style={styles.profileSection}
        >
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b2e5?w=150&h=150&fit=crop&crop=face' }}
              style={styles.profileImage}
            />
            {isEditing && (
              <Pressable style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>📸</Text>
              </Pressable>
            )}
          </View>
          <Text style={styles.profileName}>{fullName}</Text>
          <Text style={styles.profileSubtitle}>Yoga & Meditation Enthusiast</Text>
        </LinearGradient>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.infoCard}
          >
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>👤</Text>
                </View>
                <Text style={styles.infoLabel}>Full Name</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                />
              ) : (
                <Text style={styles.infoValue}>{fullName}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>📧</Text>
                </View>
                <Text style={styles.infoLabel}>Email Address</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{email}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>📱</Text>
                </View>
                <Text style={styles.infoLabel}>Phone Number</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{phone}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>🎂</Text>
                </View>
                <Text style={styles.infoLabel}>Date of Birth</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="Enter your date of birth"
                />
              ) : (
                <Text style={styles.infoValue}>{dateOfBirth}</Text>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.infoCard}
          >
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>🏠</Text>
                </View>
                <Text style={styles.infoLabel}>Home Address</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={[styles.editInput, styles.multilineInput]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  multiline
                  numberOfLines={3}
                />
              ) : (
                <Text style={styles.infoValue}>{address}</Text>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.infoCard}
          >
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>🚨</Text>
                </View>
                <Text style={styles.infoLabel}>Emergency Contact</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                  placeholder="Name - Phone number"
                />
              ) : (
                <Text style={styles.infoValue}>{emergencyContact}</Text>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacySection}>
          <LinearGradient
            colors={['rgba(129, 199, 132, 0.1)', 'rgba(200, 230, 201, 0.2)']}
            style={styles.privacyCard}
          >
            <Text style={styles.privacyIcon}>🔒</Text>
            <View style={styles.privacyContent}>
              <Text style={styles.privacyTitle}>Privacy Protected</Text>
              <Text style={styles.privacyText}>
                Your personal information is encrypted and secure. We never share your data with third parties.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Save Button */}
        {isEditing && (
          <View style={styles.actionSection}>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <LinearGradient
                colors={[colors.coralAccent, '#E55A50']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}

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
    paddingTop: getResponsivePadding(50),
    paddingHorizontal: getResponsivePadding(20),
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
    fontSize: getResponsiveFontSize(18),
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: colors.white,
  },
  editButton: {
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(16),
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  editButtonText: {
    fontSize: getResponsiveFontSize(14),
    color: colors.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: getResponsivePadding(32),
    marginHorizontal: getResponsiveMargin(20),
    marginTop: getResponsiveMargin(16),
    borderRadius: getResponsiveBorderRadius(20),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: getResponsiveMargin(16),
  },
  profileImage: {
    width: getResponsiveWidth(120),
    height: getResponsiveHeight(120),
    borderRadius: getResponsiveBorderRadius(60),
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: getResponsiveWidth(36),
    height: getResponsiveHeight(36),
    borderRadius: getResponsiveBorderRadius(18),
    backgroundColor: colors.coralAccent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  changePhotoText: {
    fontSize: getResponsiveFontSize(16),
  },
  profileName: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: getResponsiveMargin(4),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(2),
  },
  profileSubtitle: {
    fontSize: getResponsiveFontSize(16),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    paddingHorizontal: getResponsivePadding(20),
    marginTop: getResponsiveMargin(24),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: getResponsiveMargin(16),
    paddingLeft: getResponsivePadding(4),
  },
  infoCard: {
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: getResponsiveHeight(3) },
    shadowOpacity: 0.4,
    shadowRadius: getResponsiveBorderRadius(6),
    elevation: 4,
    marginBottom: getResponsiveMargin(8),
  },
  infoItem: {
    marginVertical: getResponsiveMargin(8),
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(12),
  },
  iconContainer: {
    width: getResponsiveWidth(32),
    height: getResponsiveHeight(32),
    borderRadius: getResponsiveBorderRadius(16),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getResponsiveMargin(12),
  },
  icon: {
    fontSize: getResponsiveFontSize(16),
  },
  infoLabel: {
    fontSize: getResponsiveFontSize(14),
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(1),
  },
  infoValue: {
    fontSize: getResponsiveFontSize(16),
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: getResponsiveHeight(22),
  },
  editInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: getResponsiveBorderRadius(12),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(16),
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  multilineInput: {
    minHeight: getResponsiveHeight(80),
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: getResponsiveMargin(16),
  },
  privacySection: {
    paddingHorizontal: getResponsivePadding(20),
    marginTop: getResponsiveMargin(24),
  },
  privacyCard: {
    flexDirection: 'row',
    backgroundColor: colors.sageGreen + '20',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    borderWidth: 1,
    borderColor: colors.sageGreen + '30',
  },
  privacyIcon: {
    fontSize: getResponsiveFontSize(24),
    marginRight: getResponsiveMargin(16),
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: getResponsiveMargin(8),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(1),
  },
  privacyText: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: getResponsiveHeight(20),
  },
  actionSection: {
    paddingHorizontal: getResponsivePadding(20),
    marginTop: getResponsiveMargin(32),
  },
  saveButton: {
    borderRadius: getResponsiveBorderRadius(16),
    overflow: 'hidden',
    shadowColor: colors.coralAccent,
    shadowOffset: { width: 0, height: getResponsiveHeight(4) },
    shadowOpacity: 0.3,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 6,
  },
  saveButtonGradient: {
    paddingVertical: getResponsivePadding(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: getResponsiveHeight(40),
  },
});
