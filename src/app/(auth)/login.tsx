import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AppleLogo from "@/components/AppleLogo";
import GoogleLogo from "@/components/GoogleLogo";
import authService, { ApiError } from "@/services/authService";
import {
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from "@/config/environment";
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveMargin,
  getResponsivePadding,
  screenData,
} from "@/utils/dimensions";
import { showErrorToast, showSuccessToast } from "@/utils/toastConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isGoogleConfigured = useMemo(
    () =>
      Boolean(
        GOOGLE_WEB_CLIENT_ID || GOOGLE_ANDROID_CLIENT_ID || GOOGLE_IOS_CLIENT_ID
      ),
    []
  );
  console.log(
    GOOGLE_WEB_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_IOS_CLIENT_ID
  );
  // Configure Google Sign-In on mount
  useEffect(() => {
    if (isGoogleConfigured) {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
        // androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
        iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
    }
  }, [isGoogleConfigured]);

  const handleLogin = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      showErrorToast("Error", "Please enter both email and password");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorToast("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting unified login with:", { email, password: "***" });

      // Use the regular auth service which now hits the unified login endpoint
      const response = await authService.login({ email, password });

      // Check if OTP verification is required (always required for user login now)
      if ((response as any).requiresVerification) {
        showSuccessToast(
          "OTP Sent",
          "Please verify your login with the OTP sent to your email."
        );

        // Redirect to OTP verification screen for login
        router.push({
          pathname: "/(auth)/verify-login-otp",
          params: { email },
        });
        return;
      }

      if (response.success) {
        const accountType = (response as any).data?.accountType || "User";
        showSuccessToast("Success", `${accountType} login successful!`);

        // Redirect to appropriate dashboard based on account type
        if (accountType === "Expert") {
          router.replace("/(expert)/expert-dashboard");
        } else {
          router.replace("/(user)/dashboard");
        }
      }
    } catch (error: any) {
      console.log("Login failed:", error);
      const apiError = error as ApiError;
      showErrorToast(
        "Login Failed",
        apiError.message || "Please check your credentials and try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const handleSignUp = () => {
    router.push("/(auth)/user-type-selection");
  };

  const handleGoogleSignIn = async () => {
    if (!isGoogleConfigured) {
      showErrorToast(
        "Unavailable",
        "Google sign-in is not configured. Please contact support."
      );
      return;
    }

    try {
      setIsGoogleLoading(true);

      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Sign in with Google
      const { data } = await GoogleSignin.signIn();

      const idToken = data?.idToken;
      // const user = data?.user;

      if (!idToken) {
        showErrorToast(
          "Google Sign-In Failed",
          "No ID token returned by Google."
        );
        return;
      }

      // Send ID token to backend
      const loginResponse = await authService.loginWithGoogle(idToken);

      // Check if account selection is required (new user) or onboarding incomplete
      if (loginResponse.requiresAccountSelection) {
        const userData = loginResponse.data.user;
        const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || '';
        
        // If userType is already set, skip role selection and go directly to registration form
        const userType = (userData as any).userType as 'user' | 'expert' | undefined;
        if (userType) {
          const routeParams = {
            isGoogleFlow: 'true',
            googleUserId: userData.id,
            fullName,
            email: userData.email || ''
          };
          
          if (userType === 'expert') {
            showSuccessToast("Welcome Back!", "Please complete your expert profile.");
            router.push({
              pathname: "/(expert)/expert-registration",
              params: routeParams
            });
          } else {
            showSuccessToast("Welcome Back!", "Please complete your profile.");
            router.push({
              pathname: "/(auth)/create-account",
              params: routeParams
            });
          }
        } else {
          // New user - show role selection
          showSuccessToast(
            "Welcome!",
            "Please choose your account type to continue."
          );
          router.push({
            pathname: "/(auth)/user-type-selection",
            params: { 
              isGoogleFlow: 'true',
              googleUserId: userData.id,
              fullName,
              email: userData.email || ''
            },
          });
        }
        return;
      }

      // Existing user - proceed to dashboard
      if (loginResponse.success && loginResponse.data.token) {
        const accountType = loginResponse.data.accountType || "User";
        showSuccessToast("Success", `${accountType} login successful!`);

        if (accountType === "Expert") {
          router.replace("/(expert)/expert-dashboard");
        } else {
          router.replace("/(user)/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);

      if (error.code === "SIGN_IN_CANCELLED") {
        // User cancelled, don't show error
        return;
      }

      const apiError = error as ApiError;
      showErrorToast(
        "Google Sign-In Failed",
        apiError.message || "Something went wrong while signing in with Google."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Welcome to Zenovia</Text>
            <Text style={styles.subtitle}>
              Join our community of wellness{"\n"}enthusiasts and experts.
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Text style={styles.eyeText}>
                    {isPasswordVisible ? "�" : "👁️"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Login Button */}
            <Pressable
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Continuing..." : "Continue"}
              </Text>
            </Pressable>

            {/* Forgot Password Link */}
            <Pressable
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>

            {/* OR Divider */}
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Or continue with</Text>
              <View style={styles.orLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <Pressable
                style={[
                  styles.socialButton,
                  (!isGoogleConfigured || isGoogleLoading) &&
                    styles.socialButtonDisabled,
                ]}
                onPress={handleGoogleSignIn}
                disabled={!isGoogleConfigured || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color="#374151" />
                ) : (
                  <GoogleLogo />
                )}
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>

              <Pressable style={styles.socialButton}>
                <AppleLogo />
                <Text style={styles.socialButtonText}>Apple</Text>
              </Pressable>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                Don&apos;t have an account?{" "}
              </Text>
              <Pressable onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Pressable>
            </View>

            {/* Terms and Privacy */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{" "}
              </Text>
              <Pressable onPress={() => router.push("/terms-of-service")}>
                <Text style={styles.termsLink}>Terms of Service</Text>
              </Pressable>
              <Text style={styles.termsText}> and </Text>
              <Pressable onPress={() => router.push("/privacy-policy")}>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Pressable>
              <Text style={styles.termsText}>.</Text>
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
    justifyContent: "center",
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 30 : 40),
    minHeight: screenData.height - getResponsivePadding(60),
  },
  headerSection: {
    alignItems: "center",
    marginBottom: getResponsiveMargin(screenData.isSmall ? 35 : 45),
    paddingTop: getResponsivePadding(screenData.isSmall ? 20 : 30),
  },
  title: {
    fontSize: getResponsiveFontSize(
      screenData.isSmall ? 34 : screenData.isMedium ? 38 : 42
    ),
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: getResponsiveMargin(16),
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: getResponsiveFontSize(
      screenData.isSmall ? 16 : screenData.isMedium ? 17 : 18
    ),
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.95,
    lineHeight: getResponsiveFontSize(
      screenData.isSmall ? 24 : screenData.isMedium ? 26 : 28
    ),
    fontWeight: "400",
  },
  formContainer: {
    alignItems: "stretch",
  },
  inputContainer: {
    marginBottom: getResponsiveMargin(screenData.isSmall ? 18 : 20),
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#FFD700",
    borderRadius: getResponsiveBorderRadius(25),
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 14 : 16),
    fontSize: getResponsiveFontSize(16),
    color: "#374151",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
    borderRadius: getResponsiveBorderRadius(25),
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 14 : 16),
    fontSize: getResponsiveFontSize(16),
    color: "#374151",
  },
  eyeButton: {
    paddingHorizontal: getResponsivePadding(15),
    paddingVertical: getResponsivePadding(10),
  },
  eyeText: {
    fontSize: getResponsiveFontSize(18),
  },
  loginButton: {
    backgroundColor: "#2da898ff",
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 16 : 18),
    alignItems: "center",
    marginBottom: getResponsiveMargin(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  loginButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginBottom: getResponsiveMargin(30),
  },
  forgotPasswordText: {
    fontSize: getResponsiveFontSize(14),
    color: "#575623ff",
    fontWeight: "600",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveMargin(30),
    paddingHorizontal: getResponsivePadding(20),
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  orText: {
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
    fontWeight: "500",
    paddingHorizontal: getResponsivePadding(16),
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: getResponsiveMargin(30),
    gap: getResponsiveMargin(12),
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: getResponsiveBorderRadius(25),
    paddingVertical: getResponsivePadding(screenData.isSmall ? 12 : 14),
    paddingHorizontal: getResponsivePadding(16),
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  socialButtonDisabled: {
    opacity: 0.5,
  },
  socialButtonText: {
    fontSize: getResponsiveFontSize(14),
    color: "#374151",
    fontWeight: "600",
    marginLeft: getResponsiveMargin(8),
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: getResponsiveMargin(screenData.isSmall ? 20 : 25),
  },
  signUpText: {
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
  },
  signUpLink: {
    fontSize: getResponsiveFontSize(14),
    color: "#575623ff",
    fontWeight: "700",
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: getResponsivePadding(20),
    marginTop: getResponsiveMargin(0),
    paddingBottom: getResponsivePadding(screenData.isSmall ? 10 : 15),
  },
  termsText: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
    lineHeight: 18,
  },
  termsLink: {
    fontSize: getResponsiveFontSize(12),
    color: "#575623ff", // Gold accent color matching Zenovia brand
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "none",
  },
});
