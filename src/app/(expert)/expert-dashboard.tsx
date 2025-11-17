import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from "@/components/ExpertFooter";
import authService from "@/services/authService";
import { apiService } from "@/services/apiService";
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsivePadding,
  getResponsiveWidth,
} from "@/utils/dimensions";
import { resolveProfileImageUrl } from "@/utils/imageHelpers";

const { width } = Dimensions.get("window");

export default function ExpertDashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [quickNoteText, setQuickNoteText] = useState("");
  const [expertProfile, setExpertProfile] = useState<{
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    specialization?: string;
  } | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Check account type and fetch expert profile on component mount
  useEffect(() => {
    const checkAccountTypeAndFetchProfile = async () => {
      try {
        const accountType = await authService.getAccountType();
        console.log("Expert Dashboard - Account Type:", accountType);

        // If user is not an Expert, redirect to user dashboard
        if (accountType !== "Expert") {
          console.log("Redirecting non-expert to user dashboard");
          router.replace("/(user)/dashboard");
          return;
        }

        // Fetch expert profile
        try {
          const response = await apiService.getCurrentExpertProfile();
          if (response.success && response.data?.expert) {
            setExpertProfile({
              firstName: response.data.expert.firstName,
              lastName: response.data.expert.lastName,
              profileImage:
                resolveProfileImageUrl(response.data.expert.profileImage) ||
                undefined,
              specialization: response.data.expert.specialization,
            });
          }
        } catch (error) {
          console.error("Error fetching expert profile:", error);
        } finally {
          setIsLoadingProfile(false);
        }
      } catch (error) {
        console.error("Error checking account type:", error);
        setIsLoadingProfile(false);
      }
    };

    checkAccountTypeAndFetchProfile();
  }, []);

  // Dummy data for expert dashboard
  const expertData = {
    name: "Dr. Sarah Johnson",
    specialization: "Mental Health Counselor",
    rating: 4.9,
    totalPatients: 112,
    totalEarnings: 12500,
    monthlyEarnings: 12450,
    dailyEarnings: 450,
    weeklyEarnings: 3200,
    thisWeekEarnings: 1850,
    appointmentsToday: 6,
    upcomingAppointments: 3,
    patientSatisfaction: 98,
    profileImage:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    activeSubscribers: 34,
    lastPayout: 4200,
    lastPayoutDate: "29 Oct 2025",
    nextPayoutDate: "05 Nov 2025",
    totalSessionsThisMonth: 38,
    clientFeedback: "amazing progress",
  };

  const todaysAppointments = [
    {
      id: 1,
      time: "9:00 AM",
      client: "Aarav Patel",
      service: "Yoga (Prenatal)",
    },
    {
      id: 2,
      time: "11:30 AM",
      client: "Nisha Mehra",
      service: "Ayurveda (Lifestyle)",
    },
    {
      id: 3,
      time: "4:00 PM",
      client: "Rohan Verma",
      service: "Diet Plan (PCOS)",
    },
    {
      id: 4,
      time: "6:30 PM",
      client: "Tanya Singh",
      service: "Mental Wellness (Stress)",
    },
  ];

  const notifications = [
    { id: 1, icon: "🔔", text: "5 New Bookings" },
    { id: 2, icon: "✅", text: "2 Plan Renewals" },
    { id: 3, icon: "💬", text: "3 Unread Chat Messages" },
    { id: 4, icon: "📦", text: "1 Subscription Upgrade" },
  ];

  const activeSubscriptions = [
    {
      category: "Yoga",
      subscribers: 12,
      sessionsLeft: 3,
      renewalDate: "04 Nov",
    },
    {
      category: "Ayurveda",
      subscribers: 8,
      sessionsLeft: 1,
      renewalDate: "03 Nov",
    },
    {
      category: "Diet",
      subscribers: 9,
      sessionsLeft: 2,
      renewalDate: "06 Nov",
    },
    {
      category: "Mental Wellness",
      subscribers: 5,
      sessionsLeft: 4,
      renewalDate: "07 Nov",
    },
  ];

  const [earningsTimeframe, setEarningsTimeframe] = useState<
    "Daily" | "Weekly" | "Monthly" | "Total"
  >("Monthly");

  const saveQuickNote = () => {
    if (quickNoteText.trim()) {
      Alert.alert("Note Saved", "Your quick note has been saved successfully!");
      setQuickNoteText("");
      setModalVisible(false);
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
            {/* Expert Profile Info */}
            {expertProfile && (
              <View style={styles.expertInfoSection}>
                <View style={styles.expertInfo}>
                  {expertProfile.profileImage ? (
                    <Image
                      source={{ uri: expertProfile.profileImage }}
                      style={styles.expertAvatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.expertAvatar,
                        styles.expertAvatarPlaceholder,
                      ]}
                    >
                      <Text style={styles.expertAvatarText}>
                        {expertProfile.firstName?.[0] || "E"}
                        {expertProfile.lastName?.[0] || ""}
                      </Text>
                    </View>
                  )}
                  <View style={styles.expertDetails}>
                    <Text style={styles.expertName}>
                      Hi, {expertProfile.firstName} {expertProfile.lastName}
                    </Text>
                    {expertProfile.specialization && (
                      <Text style={styles.expertSpecialization}>
                        {expertProfile.specialization} Expert
                      </Text>
                    )}
                  </View>
                </View>
                <Pressable
                  onPress={() => router.push("/(user)/profile")}
                  style={styles.profileButton}
                >
                  <Text style={styles.profileButtonText}>Profile</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Today's Appointments */}
          <View style={styles.appointmentsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                👩‍⚕ Today&apos;s Appointments
              </Text>
              <Pressable
                style={styles.manageAvailabilityButton}
                onPress={() => router.push("/(expert)/manage-availability")}
              >
                <Text style={styles.manageAvailabilityButtonText}>
                  Manage Sessions
                </Text>
              </Pressable>
            </View>
            <View style={styles.appointmentsTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Time</Text>
                <Text style={styles.tableHeaderText}>Client</Text>
                <Text style={styles.tableHeaderText}>Service</Text>
              </View>
              {todaysAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{appointment.time}</Text>
                  <Text style={styles.tableCell}>{appointment.client}</Text>
                  <Text style={styles.tableCell}>{appointment.service}</Text>
                </View>
              ))}
            </View>
            <View style={styles.sectionDivider} />
          </View>

          {/* Earnings Overview */}
          <View style={styles.earningsContainer}>
            <Text style={styles.sectionTitle}>💰 Earnings Overview</Text>
            <View style={styles.earningsTabs}>
              <Pressable
                style={[
                  styles.earningsTab,
                  earningsTimeframe === "Daily" && styles.earningsTabActive,
                ]}
                onPress={() => setEarningsTimeframe("Daily")}
              >
                <Text
                  style={[
                    styles.earningsTabText,
                    earningsTimeframe === "Daily" &&
                      styles.earningsTabTextActive,
                  ]}
                >
                  Daily
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.earningsTab,
                  earningsTimeframe === "Weekly" && styles.earningsTabActive,
                ]}
                onPress={() => setEarningsTimeframe("Weekly")}
              >
                <Text
                  style={[
                    styles.earningsTabText,
                    earningsTimeframe === "Weekly" &&
                      styles.earningsTabTextActive,
                  ]}
                >
                  Weekly
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.earningsTab,
                  earningsTimeframe === "Monthly" && styles.earningsTabActive,
                ]}
                onPress={() => setEarningsTimeframe("Monthly")}
              >
                <Text
                  style={[
                    styles.earningsTabText,
                    earningsTimeframe === "Monthly" &&
                      styles.earningsTabTextActive,
                  ]}
                >
                  Monthly
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.earningsTab,
                  earningsTimeframe === "Total" && styles.earningsTabActive,
                ]}
                onPress={() => setEarningsTimeframe("Total")}
              >
                <Text
                  style={[
                    styles.earningsTabText,
                    earningsTimeframe === "Total" &&
                      styles.earningsTabTextActive,
                  ]}
                >
                  Total
                </Text>
              </Pressable>
            </View>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsAmount}>
                ₹
                {earningsTimeframe === "Daily"
                  ? expertData.dailyEarnings
                  : earningsTimeframe === "Weekly"
                  ? expertData.weeklyEarnings
                  : earningsTimeframe === "Monthly"
                  ? expertData.monthlyEarnings
                  : expertData.totalEarnings}
                {earningsTimeframe === "Monthly" ? " (This Month)" : ""}
              </Text>
              <Text style={styles.activeSubscribersText}>
                Active Subscribers: {expertData.activeSubscribers}
              </Text>
              <View style={styles.payoutInfo}>
                <Text style={styles.payoutText}>
                  🔸 Last Payout: ₹{expertData.lastPayout} (
                  {expertData.lastPayoutDate})
                </Text>
                <Text style={styles.payoutText}>
                  🔸 Next Payout Date: {expertData.nextPayoutDate}
                </Text>
              </View>
            </View>
            <View style={styles.sectionDivider} />
          </View>

          {/* Notifications */}
          <View style={styles.notificationsContainer}>
            <Text style={styles.sectionTitle}>📢 Notifications</Text>
            <View style={styles.notificationsCard}>
              {notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <Text style={styles.notificationIcon}>
                    {notification.icon}
                  </Text>
                  <Text style={styles.notificationText}>
                    {notification.text}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.sectionDivider} />
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <Pressable
                style={styles.quickActionButton}
                onPress={() =>
                  Alert.alert("Start Consultation", "Starting consultation...")
                }
              >
                <Text style={styles.quickActionIcon}>🟩</Text>
                <Text style={styles.quickActionText}>Start Consultation</Text>
              </Pressable>
              <Pressable
                style={styles.quickActionButton}
                onPress={() => router.push("/(expert)/expert-appointments")}
              >
                <Text style={styles.quickActionIcon}>📅</Text>
                <Text style={styles.quickActionText}>View Calendar</Text>
              </Pressable>
              <Pressable
                style={styles.quickActionButton}
                onPress={() => router.push("/(expert)/expert-earnings")}
              >
                <Text style={styles.quickActionIcon}>📊</Text>
                <Text style={styles.quickActionText}>Check Earnings</Text>
              </Pressable>
              <Pressable
                style={styles.quickActionButton}
                onPress={() =>
                  Alert.alert("Manage Plans", "Opening plan management...")
                }
              >
                <Text style={styles.quickActionIcon}>⚙</Text>
                <Text style={styles.quickActionText}>Manage Plans</Text>
              </Pressable>
              <Pressable
                style={styles.quickActionButton}
                onPress={() =>
                  Alert.alert("Payout History", "Opening payout history...")
                }
              >
                <Text style={styles.quickActionIcon}>💳</Text>
                <Text style={styles.quickActionText}>Payout History</Text>
              </Pressable>
            </View>
            <View style={styles.sectionDivider} />
          </View>

          {/* Active Subscriptions */}
          <View style={styles.subscriptionsContainer}>
            <Text style={styles.sectionTitle}>📈 Active Subscriptions</Text>
            <View style={styles.subscriptionsTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Category</Text>
                <Text style={styles.tableHeaderText}>Subscribers</Text>
                <Text style={styles.tableHeaderText}>Sessions Left</Text>
                <Text style={styles.tableHeaderText}>Renewal Date</Text>
              </View>
              {activeSubscriptions.map((subscription, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{subscription.category}</Text>
                  <Text style={styles.tableCell}>
                    {subscription.subscribers}
                  </Text>
                  <Text style={styles.tableCell}>
                    {subscription.sessionsLeft}
                  </Text>
                  <Text style={styles.tableCell}>
                    {subscription.renewalDate}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.sectionDivider} />
          </View>

          {/* Expert Performance Summary */}
          <View style={styles.performanceContainer}>
            <Text style={styles.sectionTitle}>
              🧘‍♀ Expert Performance Summary
            </Text>
            <View style={styles.performanceCard}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceIcon}>⭐</Text>
                <Text style={styles.performanceText}>
                  Avg Rating: {expertData.rating}
                </Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceIcon}>🧍</Text>
                <Text style={styles.performanceText}>
                  Total Clients: {expertData.totalPatients}
                </Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceIcon}>🗓</Text>
                <Text style={styles.performanceText}>
                  Total Sessions This Month: {expertData.totalSessionsThisMonth}
                </Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceIcon}>💬</Text>
                <Text style={styles.performanceText}>
                  Client Feedback: &quot;{expertData.clientFeedback}&quot;
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: EXPERT_FOOTER_HEIGHT + 20 }} />
        </ScrollView>

        {/* Quick Note Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Quick Note</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Enter your note..."
                placeholderTextColor="#9CA3AF"
                value={quickNoteText}
                onChangeText={setQuickNoteText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveQuickNote}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
      <ExpertFooter activeRoute="expert-dashboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004D4D",
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: getResponsiveHeight(50),
    paddingHorizontal: getResponsiveWidth(20),
  },
  headerSection: {
    marginBottom: getResponsiveHeight(24),
    alignItems: "center",
  },
  zenoviaTitle: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveHeight(8),
    letterSpacing: 2,
  },
  zenoviaTagline: {
    fontSize: getResponsiveFontSize(14),
    color: "#E5F3F3",
    marginBottom: getResponsiveHeight(12),
  },
  headerDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: getResponsiveHeight(16),
  },
  expertInfoSection: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: getResponsiveHeight(12),
  },
  expertInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expertAvatar: {
    width: getResponsiveWidth(60),
    height: getResponsiveWidth(60),
    borderRadius: getResponsiveWidth(30),
    marginRight: getResponsiveWidth(12),
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  expertAvatarPlaceholder: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  expertAvatarText: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  expertDetails: {
    flex: 1,
  },
  expertName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveHeight(2),
  },
  expertSpecialization: {
    fontSize: getResponsiveFontSize(14),
    color: "#E5F3F3",
  },
  profileButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: getResponsiveWidth(16),
    paddingVertical: getResponsiveHeight(8),
    borderRadius: getResponsiveBorderRadius(20),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  profileButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
  },
  sectionDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginTop: getResponsiveHeight(16),
  },
  appointmentsTable: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(12),
    overflow: "hidden",
    marginTop: getResponsiveHeight(12),
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#059669",
    paddingVertical: getResponsiveHeight(12),
    paddingHorizontal: getResponsiveWidth(12),
  },
  tableHeaderText: {
    flex: 1,
    fontSize: getResponsiveFontSize(14),
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: getResponsiveHeight(12),
    paddingHorizontal: getResponsiveWidth(12),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableCell: {
    flex: 1,
    fontSize: getResponsiveFontSize(13),
    color: "#1F2937",
    textAlign: "center",
  },
  quickActionsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveHeight(12),
  },
  earningsTabs: {
    flexDirection: "row",
    marginTop: getResponsiveHeight(12),
    marginBottom: getResponsiveHeight(12),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: getResponsiveBorderRadius(8),
    padding: getResponsivePadding(4),
  },
  earningsTab: {
    flex: 1,
    paddingVertical: getResponsiveHeight(8),
    alignItems: "center",
    borderRadius: getResponsiveBorderRadius(6),
  },
  earningsTabActive: {
    backgroundColor: "#FFFFFF",
  },
  earningsTabText: {
    fontSize: getResponsiveFontSize(14),
    color: "#FFFFFF",
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  earningsTabTextActive: {
    color: "#059669",
    fontWeight: "bold",
    // No shadow & offset if active
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  activeSubscribersText: {
    fontSize: getResponsiveFontSize(14),
    color: "#1F2937",
    marginTop: getResponsiveHeight(12),
    textAlign: "center",
  },
  payoutInfo: {
    marginTop: getResponsiveHeight(12),
  },
  payoutText: {
    fontSize: getResponsiveFontSize(13),
    color: "#4B5563",
    marginBottom: getResponsiveHeight(6),
  },
  notificationsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  notificationsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    marginTop: getResponsiveHeight(12),
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveHeight(12),
  },
  notificationIcon: {
    fontSize: getResponsiveFontSize(20),
    marginRight: getResponsiveWidth(12),
  },
  notificationText: {
    fontSize: getResponsiveFontSize(14),
    color: "#1F2937",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: getResponsiveHeight(12),
    gap: getResponsiveWidth(12),
  },
  quickActionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(12),
    paddingVertical: getResponsivePadding(16),
    paddingHorizontal: getResponsivePadding(4),
    alignItems: "center",
    width: (width - 60 - getResponsiveWidth(16)) / 3,
    marginBottom: getResponsiveHeight(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: getResponsiveFontSize(24),
    marginBottom: getResponsiveHeight(8),
  },
  quickActionText: {
    fontSize: getResponsiveFontSize(12),
    color: "#1F2937",
    fontWeight: "600",
    textAlign: "center",
  },
  subscriptionsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  subscriptionsTable: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(12),
    overflow: "hidden",
    marginTop: getResponsiveHeight(12),
  },
  performanceContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  performanceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(20),
    marginTop: getResponsiveHeight(12),
  },
  performanceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveHeight(16),
  },
  performanceIcon: {
    fontSize: getResponsiveFontSize(20),
    marginRight: getResponsiveWidth(12),
  },
  performanceText: {
    fontSize: getResponsiveFontSize(14),
    color: "#1F2937",
    flex: 1,
  },
  appointmentsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveHeight(12),
  },
  manageAvailabilityButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(16),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  manageAvailabilityButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
  },
  seeAllText: {
    fontSize: getResponsiveFontSize(14),
    color: "#FCD34D",
    fontWeight: "600",
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveHeight(12),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F59E0B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  appointmentAvatarContainer: {
    borderWidth: 2,
    borderColor: "#F59E0B",
    borderRadius: getResponsiveWidth(28),
    padding: 2,
    marginRight: getResponsiveWidth(12),
  },
  appointmentAvatar: {
    width: getResponsiveWidth(50),
    height: getResponsiveWidth(50),
    borderRadius: getResponsiveWidth(25),
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentPatientName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: getResponsiveHeight(4),
  },
  appointmentMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveHeight(6),
  },
  appointmentTime: {
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
    marginLeft: getResponsiveWidth(4),
  },
  appointmentDuration: {
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
    marginLeft: getResponsiveWidth(4),
  },
  appointmentType: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentTypeText: {
    fontSize: getResponsiveFontSize(12),
    color: "#059669",
    marginLeft: getResponsiveWidth(4),
    fontWeight: "600",
  },
  inPersonIcon: {
    fontSize: getResponsiveFontSize(16),
  },
  appointmentActions: {
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: "#059669",
    paddingHorizontal: getResponsiveWidth(16),
    paddingVertical: getResponsiveHeight(8),
    borderRadius: getResponsiveBorderRadius(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(14),
    fontWeight: "bold",
    textAlign: "center",
  },
  patientsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  viewMoreButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    alignItems: "center",
    marginTop: getResponsiveHeight(8),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  viewMoreText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveHeight(16),
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#F59E0B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  patientLeftSection: {
    flex: 1,
    flexDirection: "row",
  },
  patientAvatarContainer: {
    borderWidth: 2,
    borderColor: "#F59E0B",
    borderRadius: getResponsiveWidth(27),
    padding: 2,
    marginRight: getResponsiveWidth(16),
    alignSelf: "flex-start",
  },
  patientAvatar: {
    width: getResponsiveWidth(50),
    height: getResponsiveWidth(50),
    borderRadius: getResponsiveWidth(25),
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: getResponsiveHeight(4),
  },
  patientCondition: {
    fontSize: getResponsiveFontSize(14),
    color: "#059669",
    fontWeight: "600",
    marginBottom: getResponsiveHeight(4),
  },
  patientEmail: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
    marginBottom: getResponsiveHeight(8),
  },
  sessionInfo: {
    fontSize: getResponsiveFontSize(12),
    color: "#4B5563",
    marginBottom: getResponsiveHeight(2),
  },
  totalSessions: {
    fontSize: getResponsiveFontSize(12),
    color: "#1F2937",
    fontWeight: "600",
    marginTop: getResponsiveHeight(4),
  },
  progressBadge: {
    alignSelf: "flex-start",
    marginTop: getResponsiveHeight(8),
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveHeight(8),
  },
  starsText: {
    fontSize: getResponsiveFontSize(14),
    marginRight: getResponsiveWidth(8),
  },
  sessionTime: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
  },
  patientDescription: {
    fontSize: getResponsiveFontSize(14),
    color: "#4B5563",
    lineHeight: getResponsiveHeight(20),
    marginTop: getResponsiveHeight(4),
  },
  progressText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: "bold",
  },
  earningsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  earningsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  earningsHeader: {
    alignItems: "center",
    marginBottom: getResponsiveHeight(16),
  },
  earningsTitle: {
    fontSize: getResponsiveFontSize(16),
    color: "#6B7280",
    marginBottom: getResponsiveHeight(4),
  },
  earningsAmount: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: "bold",
    color: "#059669",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(24),
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: getResponsiveHeight(16),
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: getResponsiveBorderRadius(8),
    padding: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(16),
    color: "#1F2937",
    height: getResponsiveHeight(100),
    marginBottom: getResponsiveHeight(16),
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    marginHorizontal: getResponsiveWidth(6),
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  saveButton: {
    backgroundColor: "#059669",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    textAlign: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    textAlign: "center",
  },
});
