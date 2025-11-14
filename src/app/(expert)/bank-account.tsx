import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from "@/components/ExpertFooter";
import apiService from "@/services/apiService";
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
} from "@/utils/dimensions";

export default function BankAccountScreen() {
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountType, setAccountType] = useState<"savings" | "current">("savings");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadBankAccount();
  }, []);

  const loadBankAccount = async () => {
    try {
      setInitialLoading(true);
      const response = await apiService.getBankAccount();
      if (response.success && response.data?.bankAccount) {
        const bankAccount = response.data.bankAccount;
        setAccountHolderName(bankAccount.accountHolderName || "");
        setAccountNumber(bankAccount.accountNumber || "");
        setBankName(bankAccount.bankName || "");
        setIfscCode(bankAccount.ifscCode || "");
        setBranchName(bankAccount.branchName || "");
        setAccountType(bankAccount.accountType || "savings");
      }
    } catch (error) {
      console.error("Error loading bank account:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!accountHolderName.trim()) {
      Alert.alert("Validation Error", "Please enter account holder name");
      return;
    }

    if (!accountNumber.trim()) {
      Alert.alert("Validation Error", "Please enter account number");
      return;
    }

    if (!/^\d{9,18}$/.test(accountNumber.trim())) {
      Alert.alert(
        "Validation Error",
        "Account number must be between 9 and 18 digits"
      );
      return;
    }

    if (!bankName.trim()) {
      Alert.alert("Validation Error", "Please enter bank name");
      return;
    }

    if (!ifscCode.trim()) {
      Alert.alert("Validation Error", "Please enter IFSC code");
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifscCode.trim())) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid IFSC code (e.g., ABCD0123456)"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.createOrUpdateBankAccount({
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bankName.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        branchName: branchName.trim() || undefined,
        accountType,
      });

      if (response.success) {
        Alert.alert("Success", "Bank account details saved successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to save bank account details");
      }
    } catch (error: any) {
      console.error("Error saving bank account:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to save bank account details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <LinearGradient
        colors={["#2DD4BF", "#14B8A6", "#0D9488"]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#2DD4BF", "#14B8A6", "#0D9488"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Bank Account</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🏦 Bank Account Details</Text>
            <Text style={styles.infoText}>
              Add your bank account details to receive payments. Your information is secure and encrypted.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Account Holder Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Holder Name *</Text>
              <TextInput
                style={[
                  styles.input,
                  accountHolderName ? styles.inputFilled : null,
                ]}
                placeholder="Enter account holder name"
                placeholderTextColor="#999"
                value={accountHolderName}
                onChangeText={setAccountHolderName}
                autoCapitalize="words"
              />
            </View>

            {/* Account Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number *</Text>
              <TextInput
                style={[styles.input, accountNumber ? styles.inputFilled : null]}
                placeholder="Enter account number (9-18 digits)"
                placeholderTextColor="#999"
                value={accountNumber}
                onChangeText={(text) => {
                  // Only allow digits
                  const digitsOnly = text.replace(/\D/g, "");
                  setAccountNumber(digitsOnly);
                }}
                keyboardType="numeric"
                maxLength={18}
              />
            </View>

            {/* Bank Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bank Name *</Text>
              <TextInput
                style={[styles.input, bankName ? styles.inputFilled : null]}
                placeholder="Enter bank name"
                placeholderTextColor="#999"
                value={bankName}
                onChangeText={setBankName}
                autoCapitalize="words"
              />
            </View>

            {/* IFSC Code */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>IFSC Code *</Text>
              <TextInput
                style={[styles.input, ifscCode ? styles.inputFilled : null]}
                placeholder="Enter IFSC code (e.g., ABCD0123456)"
                placeholderTextColor="#999"
                value={ifscCode}
                onChangeText={(text) => {
                  // Convert to uppercase and limit to 11 characters
                  const upperText = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
                  setIfscCode(upperText.substring(0, 11));
                }}
                autoCapitalize="characters"
                maxLength={11}
              />
            </View>

            {/* Branch Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Branch Name (Optional)</Text>
              <TextInput
                style={[styles.input, branchName ? styles.inputFilled : null]}
                placeholder="Enter branch name"
                placeholderTextColor="#999"
                value={branchName}
                onChangeText={setBranchName}
                autoCapitalize="words"
              />
            </View>

            {/* Account Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Type *</Text>
              <View style={styles.accountTypeContainer}>
                <Pressable
                  style={[
                    styles.accountTypeButton,
                    accountType === "savings" && styles.accountTypeButtonActive,
                  ]}
                  onPress={() => setAccountType("savings")}
                >
                  <Text
                    style={[
                      styles.accountTypeText,
                      accountType === "savings" &&
                        styles.accountTypeTextActive,
                    ]}
                  >
                    Savings
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.accountTypeButton,
                    accountType === "current" && styles.accountTypeButtonActive,
                  ]}
                  onPress={() => setAccountType("current")}
                >
                  <Text
                    style={[
                      styles.accountTypeText,
                      accountType === "current" &&
                        styles.accountTypeTextActive,
                    ]}
                  >
                    Current
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <LinearGradient
                colors={["#2DD4BF", "#14B8A6"]}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? "Saving..." : "Save Bank Account"}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      <ExpertFooter activeRoute="profile" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: getResponsiveFontSize(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: getResponsivePadding(50),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(16),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: getResponsiveFontSize(24),
    color: "#ffffff",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerRight: {
    width: getResponsiveWidth(40),
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    marginBottom: getResponsivePadding(24),
    marginTop: getResponsivePadding(8),
  },
  infoTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: getResponsivePadding(8),
  },
  infoText: {
    fontSize: getResponsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: getResponsiveHeight(20),
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: getResponsiveMargin(20),
  },
  label: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: getResponsiveMargin(8),
    paddingLeft: getResponsivePadding(4),
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    fontSize: getResponsiveFontSize(16),
    color: "#333333",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  inputFilled: {
    borderColor: "#2DD4BF",
  },
  accountTypeContainer: {
    flexDirection: "row",
    gap: getResponsiveWidth(12),
  },
  accountTypeButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  accountTypeButtonActive: {
    backgroundColor: "#ffffff",
    borderColor: "#2DD4BF",
  },
  accountTypeText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    color: "#ffffff",
  },
  accountTypeTextActive: {
    color: "#2DD4BF",
  },
  saveButton: {
    marginTop: getResponsiveMargin(24),
    borderRadius: getResponsiveBorderRadius(12),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    paddingVertical: getResponsivePadding(16),
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#ffffff",
  },
  bottomSpacer: {
    height: EXPERT_FOOTER_HEIGHT + getResponsiveHeight(20),
  },
});

