import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiService, handleApiError } from '../src/services/apiService';
import { showErrorToast, showSuccessToast } from '../src/utils/toastConfig';

export default function ExpertRegistrationScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [profession, setProfession] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [bio, setBio] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [availability, setAvailability] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

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

    if (!profession.trim() || !specialization.trim() || !experience.trim()) {
      showErrorToast('Error', 'Please fill in all professional information fields');
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

    // Experience validation
    const expNum = parseInt(experience);
    if (isNaN(expNum) || expNum < 0) {
      showErrorToast('Error', 'Please enter valid years of experience');
      return;
    }

    // Consultation fee validation
    const feeNum = parseFloat(consultationFee);
    if (isNaN(feeNum) || feeNum < 0) {
      showErrorToast('Error', 'Please enter valid consultation fee');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add text fields
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phoneNumber', phoneNumber);
      formData.append('password', password);
      formData.append('profession', profession);
      formData.append('specialization', specialization);
      formData.append('experience', experience);
      formData.append('qualifications', qualifications);
      formData.append('bio', bio);
      formData.append('consultationFee', consultationFee);
      formData.append('availability', availability.split(',').map(s => s.trim()));

      // Add profile image if selected
      if (profileImage) {
        formData.append('profileImage', {
          uri: profileImage.uri,
          type: profileImage.mimeType || 'image/jpeg',
          name: profileImage.fileName || 'profile.jpg',
        } as any);
      }

      // Add documents if selected
      documents.forEach((doc, index) => {
        formData.append('documents', {
          uri: doc.uri,
          type: doc.mimeType || 'application/pdf',
          name: doc.name || `document${index}.pdf`,
        } as any);
      });

      const response = await apiService.registerExpert(formData);
      
      if (response.success) {
        showSuccessToast('Success', 'Expert registration successful!');
        router.replace('/login');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      showErrorToast('Registration Failed', errorMessage);
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
        colors={['#A0F0E4', '#C2F8ED']}
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
              <Text style={styles.inputLabel}>Specialization</Text>
              <TextInput
                style={[styles.input, specialization ? styles.inputFilled : null]}
                placeholder="e.g., Yoga, Meditation, Ayurveda"
                placeholderTextColor="#999"
                value={specialization}
                onChangeText={setSpecialization}
              />
            </View>

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
              <Pressable style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>📎 Choose File</Text>
              </Pressable>
              <Text style={styles.uploadNote}>
                Upload your professional certifications or credentials
              </Text>
            </View>

            <Pressable style={styles.createButton} onPress={handleCreateAccount}>
              <Text style={styles.createButtonText}>Register as Expert</Text>
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
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: 280,
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputFilled: {
    borderColor: '#00C6A7',
    borderWidth: 2,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  eyeIconText: {
    fontSize: 18,
  },
  passwordRequirement: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  createButton: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: '#00C6A7',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#00C6A7',
    fontWeight: '600',
  },
  uploadSection: {
    marginVertical: 20,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
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
    borderColor: '#00C6A7',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#00C6A7',
    fontWeight: '500',
  },
  uploadNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});