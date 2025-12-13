import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from "@/components/ExpertFooter";
import apiService, { handleApiError } from "@/services/apiService";
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsivePadding,
  getResponsiveWidth,
} from "@/utils/dimensions";
import { UPLOADS_URL } from "@/config/apiConfig";

const AVAILABLE_SESSION_TYPES = ["video", "audio"];
const AVAILABLE_SESSION_FORMATS = ["one-on-one", "one-to-many"];

export default function ProfessionalDetailsScreen() {
  const [about, setAbout] = useState("");
  const [education, setEducation] = useState("");
  const [perSessionCost, setPerSessionCost] = useState("");
  const [sessionTypes, setSessionTypes] = useState<string[]>([]);
  const [sessionFormats, setSessionFormats] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [certificates, setCertificates] = useState<any[]>([]);
  const [uploadingCertificates, setUploadingCertificates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const textAreaRef = useRef<TextInput>(null);
  const educationTextAreaRef = useRef<TextInput>(null);

  useEffect(() => {
    loadExpertProfile();
  }, []);

  const loadExpertProfile = async () => {
    try {
      setInitialLoading(true);
      const response = await apiService.getCurrentExpertProfile();
      if (response.success && response.data?.expert) {
        const expert = response.data.expert;
        setAbout(expert.bio || "");
        setEducation(expert.education || "");
        setPerSessionCost(expert.hourlyRate?.toString() || "");
        // Filter to only include valid session types
        const validTypes = (expert.consultationMethods || []).filter((type: string) =>
          AVAILABLE_SESSION_TYPES.includes(type.toLowerCase())
        );
        setSessionTypes(validTypes);
        // Load session formats
        const validFormats = (expert.sessionType || []).filter((type: string) =>
          AVAILABLE_SESSION_FORMATS.includes(type.toLowerCase())
        );
        setSessionFormats(validFormats);
        // Load specialties
        setSpecialties(expert.specialties || []);
        // Load certificates
        if (expert.certificates && Array.isArray(expert.certificates)) {
          setCertificates(expert.certificates.map((cert: any) => ({
            ...cert,
            url: cert.url || (cert.filename ? `${UPLOADS_URL}/documents/${cert.filename}` : null)
          })));
        }
      }
    } catch (error) {
      console.error("Error loading expert profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!about.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter information about yourself"
      );
      return;
    }

    const cost = parseFloat(perSessionCost);
    if (isNaN(cost) || cost < 0) {
      Alert.alert(
        "Validation Error",
        "Per session cost must be a valid number (minimum 0)"
      );
      return;
    }

    if (cost > 100000) {
      Alert.alert(
        "Validation Error",
        "Per session cost cannot exceed ₹1,00,000"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.updateExpertProfile({
        bio: about.trim(),
        education: education.trim(),
        hourlyRate: cost,
        consultationMethods: sessionTypes,
        sessionType: sessionFormats,
        specialties: specialties,
      });

      if (response.success) {
        Alert.alert("Success", "Professional details updated successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.message || "Failed to update professional details"
        );
      }
    } catch (error: any) {
      console.error("Error updating professional details:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to update professional details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePerSessionCostChange = (text: string) => {
    // Only allow numbers and decimal point
    const numericValue = text.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
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

  const handleToggleSessionType = (type: string) => {
    if (sessionTypes.includes(type)) {
      setSessionTypes(sessionTypes.filter((t) => t !== type));
    } else {
      setSessionTypes([...sessionTypes, type]);
    }
  };

  const handleToggleSessionFormat = (format: string) => {
    if (sessionFormats.includes(format)) {
      setSessionFormats(sessionFormats.filter((f) => f !== format));
    } else {
      setSessionFormats([...sessionFormats, format]);
    }
  };

  const handleAddSpecialty = () => {
    const trimmed = newSpecialty.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties([...specialties, trimmed]);
      setNewSpecialty("");
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  const handlePickCertificates = async () => {
    try {
      const currentCount = certificates.length;
      const remainingSlots = 3 - currentCount;
      
      if (remainingSlots <= 0) {
        Alert.alert("Limit Reached", "You can upload a maximum of 3 certificates.");
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: remainingSlots > 1,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const selectedFiles = result.assets || [];
      if (selectedFiles.length === 0) {
        return;
      }

      if (currentCount + selectedFiles.length > 3) {
        Alert.alert("Limit Exceeded", `You can only upload ${remainingSlots} more certificate(s).`);
        return;
      }

      setUploadingCertificates(true);

      const filesToUpload = selectedFiles.map((file) => ({
        uri: file.uri,
        name: file.name || "certificate.pdf",
        type: file.mimeType || "application/pdf",
      }));

      const response = await apiService.uploadCertificates(filesToUpload);

      if (response.success && response.data?.certificates) {
        setCertificates(response.data.certificates);
        Alert.alert("Success", "Certificates uploaded successfully");
      } else {
        Alert.alert("Error", response.message || "Failed to upload certificates");
      }
    } catch (error: any) {
      console.error("Error uploading certificates:", error);
      Alert.alert("Error", handleApiError(error));
    } finally {
      setUploadingCertificates(false);
    }
  };

  const handleDeleteCertificate = async (certificateId: string) => {
    try {
      const response = await apiService.deleteCertificate(certificateId);
      if (response.success) {
        setCertificates(certificates.filter((cert) => cert._id !== certificateId && cert.filename !== certificateId));
        Alert.alert("Success", "Certificate deleted successfully");
      } else {
        Alert.alert("Error", response.message || "Failed to delete certificate");
      }
    } catch (error: any) {
      console.error("Error deleting certificate:", error);
      Alert.alert("Error", handleApiError(error));
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#2DD4BF"
          translucent
        />
        <LinearGradient
          colors={["#2da898ff", "#abeee6ff"]}
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
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2DD4BF"
        translucent
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <LinearGradient
          colors={["#2da898ff", "#abeee6ff"]}
          style={styles.backgroundGradient}
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
              <Pressable
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backArrow}>←</Text>
              </Pressable>
              <Text style={styles.title}>Professional Details</Text>
              <Text style={styles.subtitle}>
                Update your professional information
              </Text>
            </View>

            {/* About Section */}
            <View style={styles.card}>
              <Text style={styles.label}>About</Text>
              <Text style={styles.labelHint}>
                Tell patients about yourself, your expertise, and approach
              </Text>
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

            {/* Education Section */}
            <View style={styles.card}>
              <Text style={styles.label}>Education</Text>
              <Text style={styles.labelHint}>
                Describe your educational background and qualifications
              </Text>
              <TextInput
                ref={educationTextAreaRef}
                style={styles.textArea}
                value={education}
                onChangeText={setEducation}
                placeholder="Enter your educational background, degrees, certifications, and training..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={1000}
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
              />
              <Text style={styles.characterCount}>{education.length}/1000</Text>
            </View>

            {/* Specialties Section */}
            <View style={styles.card}>
              <Text style={styles.label}>Specialties</Text>
              <Text style={styles.labelHint}>
                Add your yoga specialties (e.g., Power Yoga, Meditation Yoga, Prenatal Yoga)
              </Text>
              
              {/* Add Specialty Input */}
              <View style={styles.addSpecialtyContainer}>
                <TextInput
                  style={styles.specialtyInput}
                  value={newSpecialty}
                  onChangeText={setNewSpecialty}
                  placeholder="Enter specialty name"
                  placeholderTextColor="#9CA3AF"
                  onSubmitEditing={handleAddSpecialty}
                />
                <Pressable
                  style={styles.addButton}
                  onPress={handleAddSpecialty}
                  disabled={!newSpecialty.trim()}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
              </View>

              {/* Specialties List */}
              {specialties.length > 0 && (
                <View style={styles.specialtiesList}>
                  {specialties.map((specialty, index) => (
                    <View key={index} style={styles.specialtyChip}>
                      <Text style={styles.specialtyChipText}>{specialty}</Text>
                      <Pressable
                        onPress={() => handleRemoveSpecialty(specialty)}
                        style={styles.removeSpecialtyButton}
                      >
                        <Text style={styles.removeSpecialtyText}>×</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Certificates Section */}
            <View style={styles.card}>
              <Text style={styles.label}>Certificates (Max 3 PDFs)</Text>
              <Text style={styles.labelHint}>
                Upload your professional certificates (Yoga Alliance, RYT-200, etc.)
              </Text>
              
              <Pressable
                style={[styles.uploadButton, uploadingCertificates && styles.uploadButtonDisabled]}
                onPress={handlePickCertificates}
                disabled={uploadingCertificates || certificates.length >= 3}
              >
                <Text style={styles.uploadButtonText}>
                  {uploadingCertificates
                    ? "Uploading..."
                    : certificates.length >= 3
                    ? "Maximum 3 certificates"
                    : `Upload Certificate${certificates.length > 0 ? "s" : ""} (${certificates.length}/3)`}
                </Text>
              </Pressable>

              {/* Certificates List */}
              {certificates.length > 0 && (
                <View style={styles.certificatesList}>
                  {certificates.map((cert, index) => (
                    <View key={cert._id || index} style={styles.certificateItem}>
                      <Text style={styles.certificateName} numberOfLines={1}>
                        {cert.originalName || cert.filename || `Certificate ${index + 1}`}
                      </Text>
                      <Pressable
                        onPress={() => handleDeleteCertificate(cert._id || cert.filename)}
                        style={styles.deleteCertificateButton}
                      >
                        <Text style={styles.deleteCertificateText}>Delete</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Session Types Section */}
            <View style={styles.card}>
              <View style={styles.sectionDividerTop} />
              <Text style={styles.label}>Session Types</Text>
              <Text style={styles.labelHint}>
                Select the types of sessions you offer (you can select multiple)
              </Text>
              
              {/* Session Types Selection */}
              <View style={styles.sessionTypesContainer}>
                {AVAILABLE_SESSION_TYPES.map((type) => {
                  const isSelected = sessionTypes.includes(type);
                  return (
                    <Pressable
                      key={type}
                      style={[
                        styles.sessionTypeOption,
                        isSelected && styles.sessionTypeOptionSelected,
                      ]}
                      onPress={() => handleToggleSessionType(type)}
                    >
                      <View style={styles.checkboxContainer}>
                        <View
                          style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected,
                          ]}
                        >
                          {isSelected && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </View>
                        <Text style={styles.sessionTypeIcon}>
                          {type === "video" ? "📹" : "🎤"}
                        </Text>
                        <Text
                          style={[
                            styles.sessionTypeOptionText,
                            isSelected && styles.sessionTypeOptionTextSelected,
                          ]}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Session Format Section */}
            <View style={styles.card}>
              <View style={styles.sectionDividerTop} />
              <Text style={styles.label}>Session Format</Text>
              <Text style={styles.labelHint}>
                Select whether you offer one-on-one sessions, group sessions, or both
              </Text>
              
              {/* Session Format Selection */}
              <View style={styles.sessionTypesContainer}>
                {AVAILABLE_SESSION_FORMATS.map((format) => {
                  const isSelected = sessionFormats.includes(format);
                  const displayName = format === "one-on-one" ? "One-on-One" : "One-to-Many";
                  return (
                    <Pressable
                      key={format}
                      style={[
                        styles.sessionTypeOption,
                        isSelected && styles.sessionTypeOptionSelected,
                      ]}
                      onPress={() => handleToggleSessionFormat(format)}
                    >
                      <View style={styles.checkboxContainer}>
                        <View
                          style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected,
                          ]}
                        >
                          {isSelected && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </View>
                        <Text style={styles.sessionTypeIcon}>
                          {format === "one-on-one" ? "👤" : "👥"}
                        </Text>
                        <Text
                          style={[
                            styles.sessionTypeOptionText,
                            isSelected && styles.sessionTypeOptionTextSelected,
                          ]}
                        >
                          {displayName}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Per Session Cost Section */}
            <View style={styles.card}>
              <Text style={styles.label}>Per Session Cost (₹)</Text>
              <Text style={styles.labelHint}>
                Set your consultation fee per session
              </Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.numberInput}
                  value={perSessionCost}
                  onChangeText={handlePerSessionCostChange}
                  placeholder="10000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                />
              </View>
              <Text style={styles.inputHint}>
                Minimum: ₹0 | Maximum: ₹1,00,000
              </Text>
              <Text style={styles.microText}>
                Most experts charge ₹800 – ₹2,000 per session
              </Text>
            </View>

            {/* Save Button */}
              <Pressable
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? "Saving..." : "Save Changes"}
                </Text>
              </Pressable>

            <View style={{ height: getResponsiveHeight(100) }} />
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
      {/* <ExpertFooter activeRoute="profile" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#abeee6ff",
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
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: getResponsiveFontSize(16),
    color: "#FFFFFF",
  },
  headerSection: {
    marginBottom: getResponsiveHeight(24),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: getResponsiveHeight(16),
  },
  backArrow: {
    fontSize: getResponsiveFontSize(20),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  title: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveHeight(8),
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: "#E5F3F3",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveHeight(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  label: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: getResponsiveHeight(4),
  },
  labelHint: {
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
    marginBottom: getResponsiveHeight(12),
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(14),
    color: "#1F2937",
    minHeight: getResponsiveHeight(150),
    backgroundColor: "#FFFFFF",
  },
  characterCount: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
    textAlign: "right",
    marginTop: getResponsiveHeight(4),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: getResponsiveBorderRadius(12),
    backgroundColor: "#FFFFFF",
    paddingHorizontal: getResponsivePadding(12),
  },
  currencySymbol: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "600",
    color: "#1F2937",
    marginRight: getResponsiveWidth(8),
  },
  numberInput: {
    flex: 1,
    fontSize: getResponsiveFontSize(16),
    color: "#1F2937",
    paddingVertical: getResponsivePadding(12),
  },
  inputHint: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
    marginTop: getResponsiveHeight(8),
  },
  microText: {
    fontSize: getResponsiveFontSize(11),
    color: "#9CA3AF",
    marginTop: getResponsiveHeight(6),
    fontStyle: "italic",
  },
  sectionDividerTop: {
    height: getResponsiveHeight(1),
    backgroundColor: "#E5E7EB",
    marginBottom: getResponsiveHeight(16),
    marginTop: getResponsiveHeight(-4),
  },
  saveButtonContainer: {
    position: "sticky",
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    paddingTop: getResponsiveHeight(16),
    paddingBottom: getResponsiveHeight(20),
    marginTop: getResponsiveHeight(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButton: {
    backgroundColor: "#059669",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(18),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
  },
  sessionTypesContainer: {
    marginTop: getResponsiveHeight(12),
    gap: getResponsiveHeight(12),
  },
  sessionTypeOption: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(18),
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionTypeOptionSelected: {
    borderColor: "#059669",
    backgroundColor: "#F0FDF4",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  sessionTypeIcon: {
    fontSize: getResponsiveFontSize(20),
    marginLeft: getResponsiveWidth(8),
    marginRight: getResponsiveWidth(8),
  },
  checkbox: {
    width: getResponsiveWidth(24),
    height: getResponsiveHeight(24),
    borderRadius: getResponsiveBorderRadius(6),
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: getResponsiveWidth(12),
  },
  checkboxSelected: {
    borderColor: "#059669",
    backgroundColor: "#059669",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
  },
  sessionTypeOptionText: {
    fontSize: getResponsiveFontSize(16),
    color: "#1F2937",
    fontWeight: "500",
  },
  sessionTypeOptionTextSelected: {
    color: "#059669",
    fontWeight: "600",
  },
  addSpecialtyContainer: {
    flexDirection: "row",
    gap: getResponsiveWidth(8),
    marginTop: getResponsiveHeight(12),
  },
  specialtyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(14),
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#059669",
    borderRadius: getResponsiveBorderRadius(12),
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(12),
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
  },
  specialtiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: getResponsiveWidth(8),
    marginTop: getResponsiveHeight(12),
  },
  specialtyChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#059669",
    borderRadius: getResponsiveBorderRadius(20),
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
  },
  specialtyChipText: {
    fontSize: getResponsiveFontSize(14),
    color: "#059669",
    fontWeight: "500",
    marginRight: getResponsiveWidth(8),
  },
  removeSpecialtyButton: {
    width: getResponsiveWidth(20),
    height: getResponsiveHeight(20),
    borderRadius: getResponsiveBorderRadius(10),
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
  },
  removeSpecialtyText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    lineHeight: getResponsiveFontSize(16),
  },
  uploadButton: {
    backgroundColor: "#059669",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    alignItems: "center",
    marginTop: getResponsiveHeight(12),
  },
  uploadButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
  },
  certificatesList: {
    marginTop: getResponsiveHeight(12),
    gap: getResponsiveHeight(8),
  },
  certificateItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
  },
  certificateName: {
    flex: 1,
    fontSize: getResponsiveFontSize(14),
    color: "#1F2937",
    marginRight: getResponsiveWidth(8),
  },
  deleteCertificateButton: {
    backgroundColor: "#EF4444",
    borderRadius: getResponsiveBorderRadius(8),
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
  },
  deleteCertificateText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
  },
});
