import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, StatusBar, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/utils/colors';

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
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
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
        <View style={styles.profileSection}>
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
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
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
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>
          
          <View style={styles.infoCard}>
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
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          
          <View style={styles.infoCard}>
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
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacySection}>
          <View style={styles.privacyCard}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <View style={styles.privacyContent}>
              <Text style={styles.privacyTitle}>Privacy Protected</Text>
              <Text style={styles.privacyText}>
                Your personal information is encrypted and secure. We never share your data with third parties.
              </Text>
            </View>
          </View>
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
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.royalGold + '20',
  },
  editButtonText: {
    fontSize: 14,
    color: colors.royalGold,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.white,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.lightMistTeal,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.coralAccent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  changePhotoText: {
    fontSize: 16,
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
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoItem: {
    marginVertical: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightMistTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.deepTeal,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: colors.charcoalGray,
    lineHeight: 22,
  },
  editInput: {
    backgroundColor: colors.warmGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.charcoalGray,
    borderWidth: 2,
    borderColor: colors.lightMistTeal,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightMistTeal,
    marginVertical: 16,
  },
  privacySection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  privacyCard: {
    flexDirection: 'row',
    backgroundColor: colors.sageGreen + '20',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.sageGreen + '30',
  },
  privacyIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: colors.charcoalGray,
    lineHeight: 20,
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.coralAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: 40,
  },
});
