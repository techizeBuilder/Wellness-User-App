import AsyncStorage from "@react-native-async-storage/async-storage";
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
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from "@/components/ExpertFooter";
import authService from "@/services/authService";
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsivePadding,
  getResponsiveWidth,
} from "@/utils/dimensions";

const { width, height } = Dimensions.get("window");

// SVG Icons for Expert Dashboard
const CalendarIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth="2"
    />
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" />
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" />
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" />
  </Svg>
);

const DollarIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="1" x2="12" y2="23" stroke={color} strokeWidth="2" />
    <Path
      d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

const UsersIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" />
  </Svg>
);

const TrendingUpIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth="2" />
    <Path d="M17 6h6v6" stroke={color} strokeWidth="2" />
  </Svg>
);

const ClockIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" />
  </Svg>
);

const VideoIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 7l-7 5 7 5V7z" stroke={color} strokeWidth="2" />
    <Rect
      x="1"
      y="5"
      width="15"
      height="14"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

const StarIcon = ({ size = 24, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

export default function ExpertDashboardScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("Monthly");
  const [modalVisible, setModalVisible] = useState(false);
  const [quickNoteText, setQuickNoteText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expertData, setExpertData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to safely extract values from potential objects
  const safeValue = (value, fallback) => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "object") {
      // Handle common object structures
      if (value.average !== undefined) return value.average;
      if (value.count !== undefined) return value.count;
      if (value.amount !== undefined) return value.amount;
      if (value.value !== undefined) return value.value;
      return fallback;
    }
    return value;
  };

  // Earnings data based on timeframe
  const getEarningsData = () => {
    switch (selectedTimeframe) {
      case "Daily":
        return {
          amount: "₹420",
          label: "(Today)",
          subscribers: 34,
        };
      case "Weekly":
        return {
          amount: "₹3,150",
          label: "(This Week)",
          subscribers: 34,
        };
      case "Monthly":
        return {
          amount: "₹12,450",
          label: "(This Month)",
          subscribers: 34,
        };
      case "Total":
        return {
          amount: "₹1,85,600",
          label: "(All Time)",
          subscribers: 34,
        };
      default:
        return {
          amount: "₹12,450",
          label: "(This Month)",
          subscribers: 34,
        };
    }
  };

  // Get payout information based on selected timeframe
  const getPayoutInfo = () => {
    switch (selectedTimeframe) {
      case "Daily":
        return {
          lastPayout: "₹420",
          lastDate: "04 Nov 2025",
          nextDate: "05 Nov 2025",
        };
      case "Weekly":
        return {
          lastPayout: "₹2,800",
          lastDate: "29 Oct 2025",
          nextDate: "05 Nov 2025",
        };
      case "Monthly":
        return {
          lastPayout: "₹4,200",
          lastDate: "29 Oct 2025",
          nextDate: "05 Nov 2025",
        };
      case "Total":
        return {
          lastPayout: "₹4,200",
          lastDate: "29 Oct 2025",
          nextDate: "05 Nov 2025",
        };
      default:
        return {
          lastPayout: "₹4,200",
          lastDate: "29 Oct 2025",
          nextDate: "05 Nov 2025",
        };
    }
  };

  // Check account type and fetch expert data on component mount
  useEffect(() => {
    const checkAccountTypeAndFetchData = async () => {
      try {
        setLoading(true);
        const accountType = await authService.getAccountType();
        console.log("Expert Dashboard - Account Type:", accountType);

        // If user is not an Expert, redirect to user dashboard
        if (accountType !== "Expert") {
          console.log("Redirecting non-expert to user dashboard");
          router.replace("/dashboard");
          return;
        }

        // Fetch logged-in expert data from AsyncStorage
        const userDataString = await AsyncStorage.getItem("userData");
        const userData = userDataString ? JSON.parse(userDataString) : null;

        console.log("Expert Dashboard - Raw userData:", userData);

        if (userData) {
          const extractedData = {
            name:
              safeValue(userData.name, null) ||
              safeValue(userData.fullName, null) ||
              (userData.firstName && userData.lastName
                ? userData.firstName + " " + userData.lastName
                : null) ||
              "Expert",
            specialization: safeValue(
              userData.specialization,
              "Wellness Expert & Certified Therapist"
            ),
            rating: safeValue(userData.rating, 4.9),
            totalPatients: safeValue(userData.totalPatients, 89),
            totalEarnings: safeValue(userData.totalEarnings, 12500),
            thisWeekEarnings: safeValue(userData.thisWeekEarnings, 1850),
            appointmentsToday: safeValue(userData.appointmentsToday, 6),
            totalSessions: safeValue(userData.totalSessions, 420),
            upcomingAppointments: safeValue(userData.upcomingAppointments, 3),
            patientSatisfaction: safeValue(userData.patientSatisfaction, 98),
            profileImage:
              userData.profileImage ||
              userData.avatar ||
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
          };
          console.log(
            "Expert Dashboard - Extracted expertData:",
            extractedData
          );
          setExpertData(extractedData);
        } else {
          // Fallback data if no user data available
          setExpertData({
            name: "Expert",
            specialization: "Wellness Expert & Certified Therapist",
            rating: 4.9,
            totalPatients: 89,
            totalEarnings: 12500,
            thisWeekEarnings: 1850,
            appointmentsToday: 6,
            totalSessions: 420,
            upcomingAppointments: 3,
            patientSatisfaction: 98,
            profileImage:
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
          });
        }
      } catch (error) {
        console.error("Error checking account type or fetching data:", error);
        // Set fallback data on error
        setExpertData({
          name: "Expert",
          specialization: "Wellness Expert & Certified Therapist",
          rating: 4.9,
          totalPatients: 89,
          totalEarnings: 12500,
          thisWeekEarnings: 1850,
          appointmentsToday: 6,
          totalSessions: 420,
          upcomingAppointments: 3,
          patientSatisfaction: 98,
          profileImage:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAccountTypeAndFetchData();
  }, []);

  const upcomingAppointments = [
    {
      id: 1,
      patientName: "John Smith",
      time: "10:00 AM",
      type: "Video Call",
      duration: "45 min",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      serviceType: "Meditation Guidance",
    },
    {
      id: 2,
      patientName: "Emily Davis",
      time: "2:30 PM",
      type: "In-Person",
      duration: "60 min",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      serviceType: "Yoga Therapy",
    },
    {
      id: 3,
      patientName: "Michael Brown",
      time: "4:15 PM",
      type: "Video Call",
      duration: "30 min",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      serviceType: "Physical Wellness",
    },
  ];

  const recentPatients = [
    {
      id: 1,
      name: "Lisa Wilson",
      lastSession: "Yesterday",
      nextSession: "Tomorrow",
      progress: "Excellent",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      condition: "Anxiety Management",
      email: "lisa.wilson@email.com",
      totalSessions: 12,
    },
    {
      id: 2,
      name: "David Chen",
      lastSession: "2 days ago",
      nextSession: "Friday",
      progress: "Good",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      condition: "Stress Management",
      email: "david.chen@email.com",
      totalSessions: 8,
    },
    {
      id: 3,
      name: "Sarah Johnson",
      lastSession: "Last week",
      nextSession: "Monday",
      progress: "Good",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      condition: "Sleep Disorders",
      email: "sarah.j@email.com",
      totalSessions: 5,
    },
    {
      id: 4,
      name: "Michael Brown",
      lastSession: "3 days ago",
      nextSession: "Next week",
      progress: "Excellent",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      condition: "Depression Support",
      email: "m.brown@email.com",
      totalSessions: 15,
    },
  ];

  const filteredPatients = recentPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfilePress = () => {
    router.push("/profile");
  };

  const handleAppointmentPress = (appointmentId: number) => {
    Alert.alert(
      "Appointment Details",
      `View details for appointment ${appointmentId}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "View",
          onPress: () => console.log(`Viewing appointment ${appointmentId}`),
        },
      ]
    );
  };

  const handlePatientPress = (patientId: number) => {
    Alert.alert(
      "Patient Profile",
      `View patient profile for patient ${patientId}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "View",
          onPress: () => console.log(`Viewing patient ${patientId}`),
        },
      ]
    );
  };

  const handleQuickNote = () => {
    setModalVisible(true);
  };

  const saveQuickNote = () => {
    if (quickNoteText.trim()) {
      Alert.alert("Note Saved", "Your quick note has been saved successfully!");
      setQuickNoteText("");
      setModalVisible(false);
    }
  };

  // Quick Action Handlers
  const handleStartConsultation = () => {
    Alert.alert("Start Consultation", "Choose consultation type:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Video Call",
        onPress: () => console.log("Starting video consultation"),
      },
      {
        text: "Audio Call",
        onPress: () => console.log("Starting audio consultation"),
      },
    ]);
  };

  const handleViewCalendar = () => {
    router.push("/expert-appointments");
  };

  const handleCheckEarnings = () => {
    const earningsData = getEarningsData();
    // Show earnings overview in a modal or navigate to detailed view
    Alert.alert(
      "Earnings Overview",
      `Total earnings ${earningsData.label.toLowerCase()}: ${
        earningsData.amount
      }\nActive Subscribers: ${earningsData.subscribers}`
    );
  };

  const handleManagePlans = () => {
    Alert.alert("Manage Plans", "Choose an option:", [
      { text: "Cancel", style: "cancel" },
      { text: "View Plans", onPress: () => console.log("Viewing plans") },
      {
        text: "Create New Plan",
        onPress: () => console.log("Creating new plan"),
      },
    ]);
  };

  const handlePayoutHistory = () => {
    const payoutData = getPayoutInfo();
    Alert.alert(
      "Payout History",
      `Last Payout: ${payoutData.lastPayout} (${payoutData.lastDate})\nNext Payout: ${payoutData.nextDate}`,
      [
        { text: "OK" },
        {
          text: "View Details",
          onPress: () => router.push("/expert-earnings"),
        },
      ]
    );
  };

  // Quick Actions data
  const quickActionsData = [
    {
      id: 1,
      title: "Start\nConsultation",
      icon: "start",
      onPress: handleStartConsultation,
      color: "#10B981",
    },
    {
      id: 2,
      title: "View\nCalendar",
      icon: "calendar",
      onPress: handleViewCalendar,
      color: "#059669",
    },
    {
      id: 3,
      title: "Check\nEarnings",
      icon: "earnings",
      onPress: handleCheckEarnings,
      color: "#047857",
    },
    {
      id: 4,
      title: "Manage\nPlans",
      icon: "settings",
      onPress: handleManagePlans,
      color: "#065F46",
    },
    {
      id: 5,
      title: "Payout\nHistory",
      icon: "payout",
      onPress: handlePayoutHistory,
      color: "#064E3B",
    },
  ];

  // Render individual action button
  const renderActionButton = (item: any, index: number) => {
    const renderIcon = () => {
      switch (item.icon) {
        case "start":
          return <Text style={styles.startIcon}>🟩</Text>;
        case "calendar":
          return <CalendarIcon size={18} color="#FFFFFF" />;
        case "earnings":
          return <TrendingUpIcon size={18} color="#FFFFFF" />;
        case "settings":
          return <Text style={styles.gearIcon}>⚙️</Text>;
        case "payout":
          return <Text style={styles.cardIcon}>💳</Text>;
        default:
          return <Text style={styles.startIcon}>🔸</Text>;
      }
    };

    return (
      <Pressable
        key={item.id}
        style={[styles.sliderActionButton, { backgroundColor: item.color }]}
        onPress={item.onPress}
      >
        <View style={styles.actionButtonIconContainer}>
          <View style={styles.iconBackground}>{renderIcon()}</View>
        </View>
        <Text style={styles.actionButtonText}>{item.title}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2da898ff"
        translucent
      />

      {loading ? (
        <View style={[styles.backgroundGradient, styles.loadingContainer]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.backgroundGradient}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.headerTop}>
                <View style={styles.expertInfo}>
                  <Image
                    source={{ uri: expertData?.profileImage }}
                    style={styles.expertAvatar}
                  />
                  <View style={styles.expertDetails}>
                    <Text style={styles.expertName}>
                      {String(expertData?.name || "Expert")}
                    </Text>
                    <Text style={styles.expertSpecialization}>
                      {String(
                        expertData?.specialization ||
                          "Wellness Expert & Certified Therapist"
                      )}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>
                        ⭐ {String(expertData?.rating || "4.9")}
                      </Text>
                      <Text style={styles.ratingLabel}>Expert Rating</Text>
                    </View>
                  </View>
                </View>
                <Pressable
                  onPress={handleProfilePress}
                  style={styles.profileButton}
                >
                  <Text style={styles.profileButtonText}>Profile</Text>
                </Pressable>
              </View>
            </View>

            {/* Quick Stats Grid */}
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <CalendarIcon size={32} color="#2DD4BF" />
                  <Text style={styles.statNumber}>
                    {String(expertData?.appointmentsToday || "6")}
                  </Text>
                  <Text style={styles.statLabel}>Today's Sessions</Text>
                </View>
                <View style={styles.statCard}>
                  <DollarIcon size={32} color="#2DD4BF" />
                  <Text style={styles.statNumber}>
                    ${String(expertData?.thisWeekEarnings || "1850")}
                  </Text>
                  <Text style={styles.statLabel}>This Week</Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <UsersIcon size={32} color="#2DD4BF" />
                  <Text style={styles.statNumber}>
                    {String(expertData?.totalPatients || "156")}
                  </Text>
                  <Text style={styles.statLabel}>Total Patients</Text>
                </View>
                <View style={styles.statCard}>
                  <TrendingUpIcon size={32} color="#2DD4BF" />
                  <Text style={styles.statNumber}>
                    {String(expertData?.patientSatisfaction || "98")}%
                  </Text>
                  <Text style={styles.statLabel}>Satisfaction</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.actionButtonsSlider}
                decelerationRate="fast"
                snapToInterval={getResponsiveWidth(146)}
                snapToAlignment="start"
                pagingEnabled={false}
                bounces={false}
              >
                <Pressable
                  style={[styles.actionButton, { backgroundColor: "#059669" }]}
                  onPress={handleStartConsultation}
                >
                  <View style={styles.actionButtonIconContainer}>
                    <View style={styles.iconBackground}>
                      <Text style={styles.startIcon}>🟩</Text>
                    </View>
                  </View>
                  <Text style={styles.actionButtonText}>
                    Start{"\n"}Consultation
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: "#059669" }]}
                  onPress={handleViewCalendar}
                >
                  <View style={styles.actionButtonIconContainer}>
                    <View style={styles.iconBackground}>
                      <CalendarIcon size={20} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={styles.actionButtonText}>
                    View{"\n"}Calendar
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: "#059669" }]}
                  onPress={() => router.push("/expert-earnings")}
                >
                  <View style={styles.actionButtonIcon}>
                    <Text style={styles.actionButtonEmoji}>�</Text>
                  </View>
                  <Text style={styles.actionButtonText}>
                    Check{"\n"}Earnings
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: "#059669" }]}
                  onPress={() => router.push("/expert-registration")}
                >
                  <View style={styles.actionButtonIcon}>
                    <Text style={styles.actionButtonEmoji}>⚙</Text>
                  </View>
                  <Text style={styles.actionButtonText}>Manage{"\n"}Plans</Text>
                </Pressable>
              </ScrollView>
            </View>

            {/* Today's Appointments */}
            <View style={styles.appointmentsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Appointments</Text>
                <Pressable onPress={() => router.push("/expert-appointments")}>
                  <Text style={styles.seeAllText}>See All</Text>
                </Pressable>
              </View>

              {upcomingAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.appointmentCard}>
                  <View style={styles.appointmentAvatarContainer}>
                    <Image
                      source={{ uri: appointment.avatar }}
                      style={styles.appointmentAvatar}
                    />
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.appointmentPatientName}>
                      {appointment.patientName}
                    </Text>
                    <View style={styles.serviceTypeBadgeContainer}>
                      <View
                        style={[
                          styles.serviceTypeBadge,
                          {
                            backgroundColor:
                              appointment.serviceType === "Meditation Guidance"
                                ? "#8B5CF6"
                                : appointment.serviceType === "Yoga Therapy"
                                ? "#F59E0B"
                                : appointment.serviceType ===
                                  "Physical Wellness"
                                ? "#EF4444"
                                : "#6B7280",
                          },
                        ]}
                      >
                        <Text style={styles.serviceTypeText} numberOfLines={1}>
                          {appointment.serviceType}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.appointmentMeta}>
                      <ClockIcon size={16} color="#6B7280" />
                      <Text style={styles.appointmentTime}>
                        {appointment.time} • {appointment.duration}
                      </Text>
                    </View>
                    <View style={styles.appointmentType}>
                      {appointment.type === "Video Call" ? (
                        <VideoIcon size={16} color="#059669" />
                      ) : (
                        <Text style={styles.inPersonIcon}>🏥</Text>
                      )}
                      <Text style={styles.appointmentTypeText}>
                        {appointment.type}
                      </Text>
                    </View>
                  </View>
                  <Pressable style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Join</Text>
                  </Pressable>
                </View>
              ))}
            </View>

            {/* Recent Patients */}
            <View style={styles.patientsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Patients</Text>
                <Pressable onPress={() => router.push("/expert-patients")}>
                  <Text style={styles.seeAllText}>See All</Text>
                </Pressable>
              </View>

              {recentPatients.slice(0, 3).map((patient) => (
                <Pressable
                  key={patient.id}
                  style={styles.patientCard}
                  onPress={() =>
                    router.push({
                      pathname: "/patient-detail",
                      params: {
                        patientId: patient.id,
                        patientName: patient.name,
                        patientAvatar: patient.avatar,
                        lastSession: patient.lastSession,
                        nextSession: patient.nextSession,
                        progress: patient.progress,
                      },
                    })
                  }
                >
                  <View style={styles.patientLeftSection}>
                    <View style={styles.patientAvatarContainer}>
                      <Image
                        source={{ uri: patient.avatar }}
                        style={styles.patientAvatar}
                      />
                    </View>
                    <View style={styles.patientDetails}>
                      <Text style={styles.patientName}>{patient.name}</Text>
                      <Text style={styles.patientCondition}>
                        {patient.condition}
                      </Text>
                      <Text style={styles.patientEmail}>{patient.email}</Text>
                      <Text style={styles.sessionInfo}>
                        Last: {patient.lastSession}
                      </Text>
                      <Text style={styles.sessionInfo}>
                        Next: {patient.nextSession}
                      </Text>
                      <Text style={styles.totalSessions}>
                        Total Sessions: {patient.totalSessions}
                      </Text>
                    </View>
                    <View style={styles.progressBadge}>
                      <Text
                        style={[
                          styles.progressText,
                          {
                            backgroundColor:
                              patient.progress === "Excellent"
                                ? "#059669"
                                : "#F59E0B",
                            color: "#FFFFFF",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 16,
                            fontSize: 12,
                            fontWeight: "bold",
                          },
                        ]}
                      >
                        {patient.progress}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Earnings Overview */}
            <View style={styles.earningsContainer}>
              <Text style={styles.sectionTitle}>Earnings Overview</Text>
              <View style={styles.earningsCard}>
                {/* Timeframe Selector */}
                <View style={styles.timeframeSelector}>
                  {["Daily", "Weekly", "Monthly", "Total"].map((period) => (
                    <Pressable
                      key={period}
                      style={[
                        styles.timeframePill,
                        selectedTimeframe === period &&
                          styles.timeframePillActive,
                      ]}
                      onPress={() => setSelectedTimeframe(period)}
                    >
                      <Text
                        style={[
                          styles.timeframeText,
                          selectedTimeframe === period &&
                            styles.timeframeTextActive,
                        ]}
                      >
                        {period}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Current Month Earnings */}
                <View style={styles.currentEarnings}>
                  <Text style={styles.currentEarningsAmount}>
                    {getEarningsData().amount}
                  </Text>
                  <Text style={styles.earningsLabel}>
                    {getEarningsData().label}
                  </Text>
                </View>

                {/* Active Subscribers */}
                <View style={styles.subscribersInfo}>
                  <Text style={styles.subscribersText}>
                    Active Subscribers:{" "}
                    <Text style={styles.subscribersNumber}>
                      {getEarningsData().subscribers}
                    </Text>
                  </Text>
                </View>

                {/* Payout Information */}
                <View style={styles.payoutInfo}>
                  <View style={styles.payoutRow}>
                    <Text style={styles.payoutText}>
                      🔸 Last Payout:{" "}
                      <Text style={styles.payoutAmount}>
                        {getPayoutInfo().lastPayout}
                      </Text>{" "}
                      ({getPayoutInfo().lastDate})
                    </Text>
                  </View>
                  <View style={styles.payoutRow}>
                    <Text style={styles.payoutText}>
                      🔸 Next Payout Date:{" "}
                      <Text style={styles.payoutDate}>
                        {getPayoutInfo().nextDate}
                      </Text>
                    </Text>
                  </View>
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
        </View>
      )}
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
    backgroundColor: "#2DD4BF",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: getResponsiveHeight(50),
    paddingHorizontal: getResponsiveWidth(20),
  },
  headerSection: {
    marginBottom: getResponsiveHeight(20),
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  expertDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: getResponsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: getResponsiveHeight(2),
  },
  expertName: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveHeight(2),
  },
  expertSpecialization: {
    fontSize: getResponsiveFontSize(14),
    color: "#E5F3F3",
    marginBottom: getResponsiveHeight(4),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "bold",
    color: "#FCD34D",
    marginRight: getResponsiveWidth(8),
  },
  ratingLabel: {
    fontSize: getResponsiveFontSize(12),
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
  statsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: getResponsiveHeight(12),
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    alignItems: "center",
    width: (width - 60) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: getResponsiveHeight(8),
    marginBottom: getResponsiveHeight(4),
  },
  statLabel: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
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
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButtonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: getResponsiveHeight(12),
  },
  actionButtonsSlider: {
    paddingLeft: getResponsiveWidth(20),
    paddingRight: getResponsiveWidth(40),
    flexGrow: 1,
  },
  sliderActionButton: {
    backgroundColor: "#059669",
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(20),
    alignItems: "center",
    justifyContent: "center",
    width: getResponsiveWidth(120),
    height: getResponsiveHeight(120),
    marginRight: getResponsiveWidth(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButton: {
    backgroundColor: "#059669",
    borderRadius: getResponsiveBorderRadius(24),
    padding: getResponsivePadding(16),
    alignItems: "center",
    justifyContent: "center",
    width: getResponsiveWidth(130),
    minHeight: getResponsiveHeight(80),
    marginRight: getResponsiveWidth(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: getResponsiveHeight(12),
  },
  actionButtonIconContainer: {
    marginBottom: getResponsiveHeight(8),
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(12),
    alignItems: "center",
    justifyContent: "center",
    width: getResponsiveWidth(48),
    height: getResponsiveHeight(48),
  },
  actionButtonIcon: {
    marginBottom: getResponsiveHeight(6),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: getResponsiveBorderRadius(8),
    padding: getResponsivePadding(6),
  },
  actionButtonEmoji: {
    fontSize: getResponsiveFontSize(20),
  },
  startIcon: {
    fontSize: getResponsiveFontSize(16),
  },
  gearIcon: {
    fontSize: getResponsiveFontSize(16),
  },
  cardIcon: {
    fontSize: getResponsiveFontSize(16),
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(12),
    fontWeight: "700",
    textAlign: "center",
    lineHeight: getResponsiveFontSize(15),
    marginTop: getResponsiveHeight(8),
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
  serviceTypeBadgeContainer: {
    alignItems: "flex-start",
    marginBottom: getResponsiveHeight(6),
  },
  appointmentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: getResponsiveHeight(6),
  },
  serviceTypeBadge: {
    paddingHorizontal: getResponsiveWidth(6),
    paddingVertical: getResponsiveHeight(2),
    borderRadius: getResponsiveBorderRadius(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    alignSelf: "flex-start",
  },
  serviceTypeBadgeText: {
    fontSize: getResponsiveFontSize(12),
    marginRight: getResponsiveWidth(4),
  },
  serviceTypeText: {
    fontSize: getResponsiveFontSize(9),
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
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
    fontSize: getResponsiveFontSize(32),
    fontWeight: "bold",
    color: "#059669",
  },
  earningsBreakdown: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  earningsStat: {
    alignItems: "center",
  },
  earningsStatLabel: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
    marginBottom: getResponsiveHeight(4),
  },
  earningsStatValue: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    color: "#1F2937",
  },
  // New Earnings Overview Styles
  timeframeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: getResponsiveHeight(20),
    backgroundColor: "rgba(45, 168, 152, 0.1)",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(4),
  },
  timeframePill: {
    paddingVertical: getResponsiveHeight(8),
    paddingHorizontal: getResponsiveWidth(12),
    borderRadius: getResponsiveBorderRadius(8),
  },
  timeframePillActive: {
    backgroundColor: "#2DD4BF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeframeText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
    color: "#6B7280",
  },
  timeframeTextActive: {
    color: "#FFFFFF",
  },
  currentEarnings: {
    alignItems: "center",
    marginBottom: getResponsiveHeight(16),
  },
  currentEarningsAmount: {
    fontSize: getResponsiveFontSize(36),
    fontWeight: "bold",
    color: "#059669",
    marginBottom: getResponsiveHeight(4),
  },
  earningsLabel: {
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
    fontWeight: "500",
  },
  subscribersInfo: {
    alignItems: "center",
    marginBottom: getResponsiveHeight(20),
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
  },
  subscribersText: {
    fontSize: getResponsiveFontSize(14),
    color: "#374151",
    fontWeight: "500",
  },
  subscribersNumber: {
    fontWeight: "bold",
    color: "#059669",
  },
  payoutInfo: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: getResponsiveBorderRadius(8),
    padding: getResponsivePadding(12),
  },
  payoutRow: {
    marginBottom: getResponsiveHeight(8),
  },
  payoutText: {
    fontSize: getResponsiveFontSize(13),
    color: "#374151",
    lineHeight: getResponsiveFontSize(18),
  },
  payoutAmount: {
    fontWeight: "bold",
    color: "#059669",
  },
  payoutDate: {
    fontWeight: "bold",
    color: "#F59E0B",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(18),
    fontWeight: "600",
  },
});
