import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiService } from '@/services/apiService';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth
} from '@/utils/dimensions';
import { handleRegistrationError, logErrorSafely } from '@/utils/errorHandler';
import { showErrorToast, showSuccessToast } from '@/utils/toastConfig';

export default function ExpertRegistrationScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [bio, setBio] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);

  const specializationOptions = [
    'Yoga',
    'Meditation', 
    'Ayurveda',
    'Nutrition',
    'Fitness',
    'Mental Health',
    'Other'
  ];

  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0]);
        showSuccessToast('Success', 'Profile image selected');
      }
    } catch (error) {
      showErrorToast('Error', 'Failed to pick image');
    }
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: true,
      });

      if (!result.canceled) {
        setDocuments([...documents, ...result.assets]);
        showSuccessToast('Success', `${result.assets.length} document(s) selected`);
      }
    } catch (error) {
      showErrorToast('Error', 'Failed to pick documents');
    }
  };

  const handleCreateAccount = async () => {
    // Validation
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
      showErrorToast('Error', 'Please fill in all basic information fields');
      return;
    }

    if (!specialization.trim()) {
      showErrorToast('Error', 'Please select your specialization');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorToast('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      showErrorToast('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Experience validation (only if provided)
    if (experience.trim() && (isNaN(parseInt(experience)) || parseInt(experience) < 0)) {
      showErrorToast('Error', 'Please enter valid years of experience');
      return;
    }

    // Consultation fee validation (only if provided)
    if (consultationFee.trim() && (isNaN(parseFloat(consultationFee)) || parseFloat(consultationFee) < 0)) {
      showErrorToast('Error', 'Please enter valid consultation fee');
      return;
    }

    setIsLoading(true);
    try {
      // Split fullName into firstName and lastName
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || fullName;
      const lastName = nameParts.slice(1).join(' ') || firstName; // Use first name as last name if no last name provided
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add text fields with correct field names that backend expects
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('phone', phoneNumber); // Backend expects 'phone', not 'phoneNumber'
      formData.append('password', password);
      formData.append('specialization', specialization);
      
      // Add optional fields only if they have values
      if (experience && experience.trim()) {
        formData.append('experience', experience);
      }
      if (bio && bio.trim()) {
        formData.append('bio', bio);
      }
      if (consultationFee && consultationFee.trim()) {
        formData.append('hourlyRate', consultationFee); // Backend expects 'hourlyRate'
      }
      if (qualifications && qualifications.trim()) {
        formData.append('qualifications', qualifications);
      }

      // Add profile image if selected (backend expects 'profileImage' field)
      if (profileImage) {
        formData.append('profileImage', {
          uri: profileImage.uri,
          type: profileImage.mimeType || 'image/jpeg',
          name: profileImage.fileName || 'profile.jpg',
        } as any);
      }

      console.log('FormData contents:');
      console.log('firstName:', firstName);
      console.log('lastName:', lastName);
      console.log('email:', email);
      console.log('phone:', phoneNumber);
      console.log('specialization:', specialization);
      console.log('experience:', experience || 'not provided');
      console.log('hasProfileImage:', !!profileImage);

      // Debug: Log all required fields to ensure they're not empty
      console.log('=== REQUIRED FIELDS CHECK ===');
      console.log('firstName valid:', firstName && firstName.trim().length > 0);
      console.log('lastName valid:', lastName && lastName.trim().length > 0);
      console.log('email valid:', email && email.trim().length > 0);
      console.log('phone valid:', phoneNumber && phoneNumber.trim().length > 0);
      console.log('password valid:', password && password.trim().length > 0);
      console.log('specialization valid:', specialization && specialization.trim().length > 0);

      // Note: Documents handling might need separate endpoint - backend uses single('profileImage')
      // For now, we'll skip documents to get basic registration working
      if (documents.length > 0) {
        console.log(`Note: ${documents.length} documents selected but will be uploaded separately`);
      }

      const response = await apiService.registerExpert(formData);
      
      if (response.success) {
        showSuccessToast('Success', 'Expert registration successful!');
        router.replace('/login');
      }
    } catch (error) {
      // Use enhanced error handling to avoid console spam for validation errors
      const errorInfo = handleRegistrationError(error);
      logErrorSafely(error, 'Expert registration error');
      showErrorToast('Registration Failed', errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#A0F0E4" />
      
      <LinearGradient
        colors={['#2da898ff', '#abeee6ff']}
        style={styles.backgroundGradient}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>BECOME A ZENOVIA EXPERT</Text>
            <Text style={styles.subtitle}>Join our community of wellness professionals.</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={[styles.input, fullName ? styles.inputFilled : null]}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, email ? styles.inputFilled : null]}
                placeholder="you@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={[styles.input, phoneNumber ? styles.inputFilled : null]}
                placeholder="(123) 456-7890"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Years of Experience (Optional)</Text>
              <TextInput
                style={[styles.input, experience ? styles.inputFilled : null]}
                placeholder="e.g., 5"
                placeholderTextColor="#999"
                value={experience}
                onChangeText={setExperience}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Specialization</Text>
              <Pressable 
                style={[styles.dropdownButton, specialization ? styles.inputFilled : null]}
                onPress={() => setShowSpecializationDropdown(true)}
              >
                <Text style={[styles.dropdownText, !specialization && styles.dropdownPlaceholder]}>
                  {specialization || 'Select your specialization'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </Pressable>
            </View>

            {/* Specialization Dropdown Modal */}
            <Modal
              visible={showSpecializationDropdown}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowSpecializationDropdown(false)}
              statusBarTranslucent={false}
              presentationStyle="overFullScreen"
            >
              <View style={styles.modalOverlay}>
                <Pressable 
                  style={styles.modalBackdrop}
                  onPress={() => setShowSpecializationDropdown(false)}
                />
                <View style={styles.dropdownModal}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.dropdownTitle}>Select Specialization</Text>
                    <Pressable 
                      style={styles.closeButton}
                      onPress={() => setShowSpecializationDropdown(false)}
                    >
                      <Text style={styles.closeButtonText}>✕</Text>
                    </Pressable>
                  </View>
                  <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
                    {specializationOptions.map((option) => (
                      <Pressable
                        key={option}
                        style={[
                          styles.dropdownOption,
                          specialization === option && styles.dropdownOptionSelected
                        ]}
                        onPress={() => {
                          setSpecialization(option);
                          setShowSpecializationDropdown(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownOptionText,
                          specialization === option && styles.dropdownOptionTextSelected
                        ]}>
                          {option}
                        </Text>
                        {specialization === option && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, password ? styles.inputFilled : null]}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <Pressable 
                  style={styles.eyeIcon}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Text style={styles.eyeIconText}>
                    {isPasswordVisible ? '🙈' : '👁️'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>Upload Certification</Text>
              <Pressable style={styles.uploadCard} onPress={pickDocuments}>
                <View style={styles.uploadCardContent}>
                  <Text style={styles.uploadIcon}>📎</Text>
                  <Text style={styles.uploadTitle}>Drag & Drop or Click to Upload</Text>
                  <Text style={styles.uploadDescription}>
                    Upload your professional certifications or credentials
                  </Text>
                  <Text style={styles.uploadFormats}>
                    Supported formats: PDF, JPG, PNG (Max 5MB)
                  </Text>
                </View>
              </Pressable>
              {documents.length > 0 && (
                <View style={styles.uploadedFiles}>
                  <Text style={styles.uploadedFilesTitle}>Uploaded Files:</Text>
                  {documents.map((doc, index) => (
                    <View key={index} style={styles.uploadedFileItem}>
                      <Text style={styles.uploadedFileName}>{doc.name}</Text>
                      <Pressable 
                        onPress={() => setDocuments(documents.filter((_, i) => i !== index))}
                        style={styles.removeFileButton}
                      >
                        <Text style={styles.removeFileText}>✕</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <Pressable style={styles.createButton} onPress={handleCreateAccount}>
              <Text style={styles.createButtonText}>Submit Application</Text>
            </Pressable>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Pressable onPress={handleLogin}>
                <Text style={styles.loginLink}>Log In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: getResponsivePadding(80),
    paddingHorizontal: getResponsivePadding(24),
    paddingBottom: getResponsivePadding(40),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: getResponsiveMargin(40),
  },
  title: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: getResponsiveMargin(8),
    textAlign: 'center',
    lineHeight: getResponsiveHeight(38),
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#ffffff',
    textAlign: 'center',
    maxWidth: getResponsiveWidth(300),
    lineHeight: getResponsiveHeight(22),
    opacity: 0.95,
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: getResponsiveMargin(20),
  },
  inputLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#575623ff',
    marginBottom: getResponsiveMargin(8),
    paddingLeft: getResponsivePadding(10),
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: getResponsiveBorderRadius(25),
    padding: getResponsivePadding(16),
    fontSize: getResponsiveFontSize(16),
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 4,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  inputFilled: {
    borderColor: '#2da898ff',
    borderWidth: 2,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: '#ffffff',
    borderRadius: getResponsiveBorderRadius(25),
    padding: getResponsivePadding(16),
    paddingRight: getResponsivePadding(50),
    fontSize: getResponsiveFontSize(16),
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 4,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  eyeIcon: {
    position: 'absolute',
    right: getResponsivePadding(16),
    top: getResponsivePadding(16),
    padding: getResponsivePadding(4),
  },
  eyeIconText: {
    fontSize: getResponsiveFontSize(18),
  },
  passwordRequirement: {
    fontSize: 12,
    color: '#575623ff',
    marginTop: 4,
  },
  createButton: {
    marginTop: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(20),
    borderRadius: getResponsiveBorderRadius(25),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(4),
    },
    shadowOpacity: 0.2,
    shadowRadius: getResponsiveBorderRadius(6),
    elevation: 4,
    backgroundColor: '#2da898ff',
    paddingVertical: getResponsivePadding(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(20),
  },
  loginText: {
    fontSize: getResponsiveFontSize(16),
    color: '#575623ff',
  },
  loginLink: {
    fontSize: getResponsiveFontSize(16),
    color: '#575623ff',
    fontWeight: '600',
    textDecorationLine: 'none',
  },
  uploadSection: {
    marginBottom: getResponsiveMargin(20),
  },
  uploadLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#575623ff',
    marginBottom: getResponsiveMargin(8),
    paddingLeft: getResponsivePadding(16),
  },
  uploadButton: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#2da898ff',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#2da898ff',
    fontWeight: '600',
  },
  uploadNote: {
    fontSize: 12,
    color: '#575623ff',
    marginTop: 4,
    textAlign: 'center',
  },
  // Dropdown styles
  dropdownButton: {
    backgroundColor: '#ffffff',
    borderRadius: getResponsiveBorderRadius(25),
    padding: getResponsivePadding(16),
    fontSize: getResponsiveFontSize(16),
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 4,
    borderWidth: 2,
    borderColor: '#F59E0B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: getResponsiveFontSize(16),
    color: '#333',
    flex: 1,
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  dropdownArrow: {
    fontSize: getResponsiveFontSize(12),
    color: '#666',
    marginLeft: getResponsiveMargin(8),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
    elevation: 999999,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: getResponsiveBorderRadius(16),
    margin: getResponsiveMargin(20),
    maxHeight: '70%',
    width: '85%',
    maxWidth: getResponsiveWidth(350),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(10),
    },
    shadowOpacity: 0.3,
    shadowRadius: getResponsiveBorderRadius(20),
    elevation: 50,
    zIndex: 1000000,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(10),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    width: getResponsiveWidth(30),
    height: getResponsiveHeight(30),
    borderRadius: getResponsiveBorderRadius(15),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: getResponsiveFontSize(16),
    color: '#666',
    fontWeight: 'bold',
  },
  optionsContainer: {
    padding: getResponsivePadding(20),
    paddingTop: getResponsivePadding(10),
  },
  dropdownOption: {
    padding: getResponsivePadding(16),
    borderRadius: getResponsiveBorderRadius(12),
    marginBottom: getResponsiveMargin(8),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownOptionSelected: {
    backgroundColor: '#2da898ff',
    borderColor: '#2da898ff',
  },
  dropdownOptionText: {
    fontSize: getResponsiveFontSize(16),
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: getResponsiveFontSize(16),
    color: '#fff',
    fontWeight: 'bold',
  },
  // Enhanced upload styles
  uploadCard: {
    backgroundColor: '#ffffff',
    borderRadius: getResponsiveBorderRadius(25),
    padding: getResponsivePadding(24),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(4),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(12),
    elevation: 6,
    borderWidth: 2,
    borderColor: '#2da898ff',
    borderStyle: 'dashed',
    minHeight: getResponsiveHeight(120),
  },
  uploadCardContent: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: getResponsiveFontSize(32),
    marginBottom: getResponsiveMargin(12),
  },
  uploadTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: '#2da898ff',
    marginBottom: getResponsiveMargin(8),
    textAlign: 'center',
  },
  uploadDescription: {
    fontSize: getResponsiveFontSize(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(8),
    lineHeight: getResponsiveHeight(20),
  },
  uploadFormats: {
    fontSize: getResponsiveFontSize(12),
    color: '#999',
    textAlign: 'center',
  },
  uploadedFiles: {
    marginTop: getResponsiveMargin(16),
  },
  uploadedFilesTitle: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#333',
    marginBottom: getResponsiveMargin(8),
  },
  uploadedFileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    marginBottom: getResponsiveMargin(8),
  },
  uploadedFileName: {
    fontSize: getResponsiveFontSize(14),
    color: '#333',
    flex: 1,
  },
  removeFileButton: {
    padding: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(12),
    backgroundColor: '#ff4757',
    width: getResponsiveWidth(24),
    height: getResponsiveHeight(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeFileText: {
    color: '#fff',
    fontSize: getResponsiveFontSize(12),
    fontWeight: 'bold',
  },
});