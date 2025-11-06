import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
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
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </Pressable>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section */}
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>👤</Text>
              </View>
              {isEditing && (
                <Pressable style={styles.changePhotoButton}>
                  <Text style={styles.changePhotoText}>📸</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.profileName}>{fullName}</Text>
            <Text style={styles.profileSubtitle}>Yoga & Meditation Enthusiast</Text>
          </View>

          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
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
                />
              ) : (
                <Text style={styles.infoValue}>{fullName}</Text>
              )}
            </View>

            {/* Email Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoIcon}>📧</Text>
                <Text style={styles.infoLabel}>Email Address</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{email}</Text>
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
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{phone}</Text>
              )}
            </View>

            {/* Date of Birth Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoIcon}>🎂</Text>
                <Text style={styles.infoLabel}>Date of Birth</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="Enter your date of birth"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.infoValue}>{dateOfBirth}</Text>
              )}
            </View>
          </View>

          {/* Address Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Information</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoIcon}>🏠</Text>
                <Text style={styles.infoLabel}>Home Address</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={[styles.editInput, styles.multilineInput]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                />
              ) : (
                <Text style={styles.infoValue}>{address}</Text>
              )}
            </View>
          </View>

          {/* Emergency Contact Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoIcon}>🚨</Text>
                <Text style={styles.infoLabel}>Emergency Contact</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                  placeholder="Name - Phone number"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.infoValue}>{emergencyContact}</Text>
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
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </Pressable>
          )}
        </ScrollView>
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
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  editButtonText: {
    fontSize: fontSizes.sm,
    color: colors.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(30),
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(24),
    alignItems: 'center',
    marginBottom: getResponsiveMargin(24),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: getResponsiveMargin(16),
  },
  profileImagePlaceholder: {
    width: getResponsiveWidth(120),
    height: getResponsiveHeight(120),
    borderRadius: getResponsiveBorderRadius(60),
    backgroundColor: '#E8F5F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2da898ff',
  },
  profileImageText: {
    fontSize: getResponsiveFontSize(50),
    color: '#2da898ff',
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
    color: '#333333',
    marginBottom: getResponsiveMargin(4),
    textAlign: 'center',
  },
  profileSubtitle: {
    fontSize: fontSizes.md,
    color: '#666666',
    textAlign: 'center',
  },
  section: {
    marginBottom: getResponsiveMargin(24),
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: getResponsiveMargin(12),
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(16),
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
    color: '#333333',
    lineHeight: getResponsiveHeight(22),
    marginLeft: getResponsiveMargin(36),
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
  multilineInput: {
    minHeight: getResponsiveHeight(60),
    textAlignVertical: 'top',
  },
  privacyCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(20),
  },
  privacyIcon: {
    fontSize: getResponsiveFontSize(24),
    marginRight: getResponsiveMargin(16),
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: '#2da898ff',
    marginBottom: getResponsiveMargin(8),
  },
  privacyText: {
    fontSize: fontSizes.sm,
    color: '#666666',
    lineHeight: getResponsiveHeight(18),
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
  saveButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.white,
  },
});
