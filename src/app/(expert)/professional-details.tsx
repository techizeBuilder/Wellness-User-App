import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from '@/components/ExpertFooter';
import apiService from '@/services/apiService';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsivePadding,
    getResponsiveWidth,
} from '@/utils/dimensions';

export default function ProfessionalDetailsScreen() {
  const [about, setAbout] = useState('');
  const [perSessionCost, setPerSessionCost] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const textAreaRef = useRef<TextInput>(null);

  useEffect(() => {
    loadExpertProfile();
  }, []);

  const loadExpertProfile = async () => {
    try {
      setInitialLoading(true);
      const response = await apiService.getCurrentExpertProfile();
      if (response.success && response.data?.expert) {
        const expert = response.data.expert;
        setAbout(expert.bio || '');
        setPerSessionCost(expert.hourlyRate?.toString() || '');
      }
    } catch (error) {
      console.error('Error loading expert profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!about.trim()) {
      Alert.alert('Validation Error', 'Please enter information about yourself');
      return;
    }

    const cost = parseFloat(perSessionCost);
    if (isNaN(cost) || cost < 0) {
      Alert.alert('Validation Error', 'Per session cost must be a valid number (minimum 0)');
      return;
    }

    if (cost > 100000) {
      Alert.alert('Validation Error', 'Per session cost cannot exceed ₹1,00,000');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.updateExpertProfile({
        bio: about.trim(),
        hourlyRate: cost
      });

      if (response.success) {
        Alert.alert('Success', 'Professional details updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to update professional details');
      }
    } catch (error: any) {
      console.error('Error updating professional details:', error);
      Alert.alert('Error', error.message || 'Failed to update professional details');
    } finally {
      setLoading(false);
    }
  };

  const handlePerSessionCostChange = (text: string) => {
    // Only allow numbers and decimal point
    const numericValue = text.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return;
    }

    // Limit to 100000
    const numValue = parseFloat(numericValue);
    if (!isNaN(numValue) && numValue > 100000) {
      return;
    }

    setPerSessionCost(numericValue);
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2DD4BF" translucent />
        <LinearGradient
          colors={['#2da898ff', '#abeee6ff']}
          style={styles.backgroundGradient}
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2DD4BF" translucent />
      
      <LinearGradient
        colors={['#2da898ff', '#abeee6ff']}
        style={styles.backgroundGradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              // Scroll to text area when it's focused
              if (isTextAreaFocused) {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }
            }}
          >
          {/* Header */}
          <View style={styles.headerSection}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.title}>Professional Details</Text>
            <Text style={styles.subtitle}>Update your professional information</Text>
          </View>

          {/* About Section */}
          <View style={styles.card}>
            <Text style={styles.label}>About</Text>
            <Text style={styles.labelHint}>Tell patients about yourself, your expertise, and approach</Text>
            <TextInput
              ref={textAreaRef}
              style={styles.textArea}
              value={about}
              onChangeText={setAbout}
              placeholder="Enter information about yourself, your qualifications, experience, and approach to wellness..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={1000}
              onFocus={() => {
                setIsTextAreaFocused(true);
                // Scroll to text area when focused
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
              onBlur={() => {
                setIsTextAreaFocused(false);
              }}
            />
            <Text style={styles.characterCount}>{about.length}/1000</Text>
          </View>

          {/* Per Session Cost Section */}
          <View style={styles.card}>
            <Text style={styles.label}>Per Session Cost (₹)</Text>
            <Text style={styles.labelHint}>Set your consultation fee per session</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.numberInput}
                value={perSessionCost}
                onChangeText={handlePerSessionCostChange}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>
            <Text style={styles.inputHint}>Minimum: ₹0 | Maximum: ₹1,00,000</Text>
          </View>

          {/* Save Button */}
          <Pressable 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </Pressable>

          <View style={{ height: EXPERT_FOOTER_HEIGHT + 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
      <ExpertFooter activeRoute="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004D4D',
  },
  backgroundGradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: getResponsiveHeight(50),
    paddingHorizontal: getResponsiveWidth(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
  },
  headerSection: {
    marginBottom: getResponsiveHeight(24),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsiveHeight(16),
  },
  backArrow: {
    fontSize: getResponsiveFontSize(20),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveHeight(8),
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#E5F3F3',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveHeight(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  label: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: getResponsiveHeight(4),
  },
  labelHint: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    marginBottom: getResponsiveHeight(12),
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(14),
    color: '#1F2937',
    minHeight: getResponsiveHeight(150),
    backgroundColor: '#FFFFFF',
  },
  characterCount: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    textAlign: 'right',
    marginTop: getResponsiveHeight(4),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: getResponsiveBorderRadius(12),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: getResponsivePadding(12),
  },
  currencySymbol: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '600',
    color: '#1F2937',
    marginRight: getResponsiveWidth(8),
  },
  numberInput: {
    flex: 1,
    fontSize: getResponsiveFontSize(16),
    color: '#1F2937',
    paddingVertical: getResponsivePadding(12),
  },
  inputHint: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    marginTop: getResponsiveHeight(8),
  },
  saveButton: {
    backgroundColor: '#059669',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    alignItems: 'center',
    marginTop: getResponsiveHeight(8),
    marginBottom: getResponsiveHeight(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
  },
});

