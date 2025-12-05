import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from "@/components/ExpertFooter";
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
  getResponsiveWidth,
} from "@/utils/dimensions";
import { apiService, handleApiError } from "@/services/apiService";
import { UPLOADS_URL } from "@/config/apiConfig";

type AppointmentFeedbackItem = {
  _id?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  submittedAt?: string;
  sessionDate?: string;
  startTime?: string;
  endTime?: string;
};

type Appointment = {
  _id: string;
  user: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  consultationMethod: string;
  sessionType: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  price: number;
  notes?: string;
  meetingLink?: string;
  agoraChannelName?: string;
  feedbackRating?: number;
  feedbackComment?: string;
  feedbackSubmittedAt?: string;
  feedbackEntries?: AppointmentFeedbackItem[];
  feedbackHistory?: AppointmentFeedbackItem[];
  feedbacks?: AppointmentFeedbackItem[];
  createdAt?: string;
  updatedAt?: string;
  prescription?: {
    url?: string;
    originalName?: string;
    uploadedAt?: string;
  };
};

type Plan = {
  _id: string;
  name: string;
  type: "single" | "monthly";
  description?: string;
  sessionClassType?: string;
  sessionFormat?: "one-on-one" | "one-to-many";
  price: number;
  duration?: number;
  classesPerMonth?: number;
  monthlyPrice?: number;
  isActive: boolean;
};

type DerivedFeedbackEntry = {
  id: string;
  appointmentId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  sessionDate?: string;
  startTime?: string;
  endTime?: string;
};

const FEEDBACK_PREVIEW_LIMIT = 2;
const STAR_SCALE = [1, 2, 3, 4, 5];
const PRESCRIPTION_MAX_SIZE = 5 * 1024 * 1024; // 5MB

const buildUserDisplayName = (user?: Appointment["user"]) => {
  if (!user) {
    return "Client";
  }
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (fullName.length > 0) {
    return fullName;
  }
  if (user.email) {
    return user.email;
  }
  return "Client";
};

const getSafeTimestamp = (value?: string) => {
  if (!value) {
    return 0;
  }
  const date = new Date(value);
  const millis = date.getTime();
  return Number.isNaN(millis) ? 0 : millis;
};

const pickFeedbackSourceArray = (
  appointment: Appointment
): AppointmentFeedbackItem[] | undefined => {
  const candidates = [
    appointment.feedbackEntries,
    appointment.feedbackHistory,
    appointment.feedbacks,
  ];
  return candidates.find(
    (entries) => Array.isArray(entries) && entries.length > 0
  );
};

const deriveFeedbackEntries = (
  appointment: Appointment
): DerivedFeedbackEntry[] => {
  const userName = buildUserDisplayName(appointment.user);
  const sourceEntries =
    pickFeedbackSourceArray(appointment) ||
    (typeof appointment.feedbackRating === "number"
      ? [
          {
            _id: `${appointment._id}-feedback`,
            rating: appointment.feedbackRating,
            comment: appointment.feedbackComment,
            createdAt: appointment.feedbackSubmittedAt,
            submittedAt: appointment.feedbackSubmittedAt,
            sessionDate: appointment.sessionDate,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
          } as AppointmentFeedbackItem,
        ]
      : []);

  return sourceEntries
    .map((entry, index) => {
      if (!entry) {
        return null;
      }
      const ratingValue =
        typeof entry.rating === "number"
          ? entry.rating
          : typeof appointment.feedbackRating === "number"
          ? appointment.feedbackRating
          : null;

      if (ratingValue === null || Number.isNaN(ratingValue)) {
        return null;
      }

      const createdAt =
        entry.createdAt ||
        entry.submittedAt ||
        appointment.feedbackSubmittedAt ||
        appointment.sessionDate ||
        appointment.createdAt;

      return {
        id: entry._id || `${appointment._id}-feedback-${index}`,
        appointmentId: appointment._id,
        userName,
        rating: ratingValue,
        comment: entry.comment ?? appointment.feedbackComment ?? undefined,
        createdAt,
        sessionDate: entry.sessionDate || appointment.sessionDate,
        startTime: entry.startTime || appointment.startTime,
        endTime: entry.endTime || appointment.endTime,
      };
    })
    .filter((entry) => entry !== null) as DerivedFeedbackEntry[];
};

export default function ExpertAppointmentsScreen() {
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [uploadingPrescriptionId, setUploadingPrescriptionId] = useState<
    string | null
  >(null);
  const [expandedFeedbackAppointments, setExpandedFeedbackAppointments] =
    useState<Record<string, boolean>>({});
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] =
    useState<Appointment | null>(null);
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [loadingPatientDetails, setLoadingPatientDetails] = useState(false);
  const [showGroupSessionModal, setShowGroupSessionModal] = useState(false);
  const [groupPlans, setGroupPlans] = useState<Plan[]>([]);
  const [selectedGroupPlanId, setSelectedGroupPlanId] = useState<string | null>(
    null
  );
  const [groupSessionDate, setGroupSessionDate] = useState("");
  const [groupStartTime, setGroupStartTime] = useState("");
  const [groupDuration, setGroupDuration] = useState("60");
  const [groupConsultationMethod, setGroupConsultationMethod] = useState<
    "video" | "audio" | "chat" | "in-person"
  >("video");
  const [creatingGroupSession, setCreatingGroupSession] = useState(false);

  const statusFilters = [
    "All",
    "Confirmed",
    "Pending",
    "Completed",
    "Cancelled",
  ];

  const renderRatingStars = (value: number) => (
    <View style={styles.feedbackStarsRow}>
      {STAR_SCALE.map((star) => (
        <Text
          key={star}
          style={[
            styles.feedbackStar,
            star <= value
              ? styles.feedbackStarFilled
              : styles.feedbackStarEmpty,
          ]}
        >
          ★
        </Text>
      ))}
    </View>
  );

  const feedbackEntriesByAppointment = useMemo(() => {
    return appointments.reduce<Record<string, DerivedFeedbackEntry[]>>(
      (acc, appointment) => {
        acc[appointment._id] = deriveFeedbackEntries(appointment);
        return acc;
      },
      {}
    );
  }, [appointments]);

  // const allFlattenedFeedbackEntries = useMemo(
  //   () => Object.values(feedbackEntriesByAppointment).flat(),
  //   [feedbackEntriesByAppointment]
  // );

  const buildAbsoluteUrl = (relative?: string | null) => {
    if (!relative) {
      return null;
    }
    if (/^https?:\/\//i.test(relative)) {
      return relative;
    }
    if (relative.startsWith("/")) {
      return `${UPLOADS_URL}${relative}`;
    }
    return `${UPLOADS_URL}/${relative}`;
  };

  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${datePart} • ${timePart}`;
  };

  const handleOpenPrescription = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        throw new Error("Unsupported URL");
      }
      await Linking.openURL(url);
    } catch (error) {
      console.error("Unable to open prescription:", error);
      Alert.alert("Unable to open file", "Please try again later.");
    }
  };

  const handlePrescriptionUpload = async (appointment: Appointment) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset || !asset.uri) {
        Alert.alert("Upload failed", "Unable to read the selected file.");
        return;
      }

      if (asset.size && asset.size > PRESCRIPTION_MAX_SIZE) {
        Alert.alert("File too large", "Please select a PDF smaller than 5MB.");
        return;
      }

      setUploadingPrescriptionId(appointment._id);

      await apiService.uploadPrescription(appointment._id, {
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
      });

      Alert.alert(
        "Success",
        appointment.prescription?.url
          ? "Prescription replaced."
          : "Prescription uploaded."
      );
      await fetchAppointments();
    } catch (error) {
      console.error("Prescription upload failed:", error);
      Alert.alert("Upload failed", handleApiError(error));
    } finally {
      setUploadingPrescriptionId(null);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  useEffect(() => {
    setExpandedFeedbackAppointments({});
  }, [appointments.length]);

  const fetchAppointments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let status: string | undefined;
      if (selectedStatus !== "All") {
        status = selectedStatus.toLowerCase();
      }

      const response = await apiService.getExpertBookings({ status });
      const bookings: Appointment[] = response?.data?.appointments || [];

      const sortedBookings = [...bookings].sort((a, b) => {
        const createdDiff =
          getSafeTimestamp(b.createdAt || b.sessionDate) -
          getSafeTimestamp(a.createdAt || a.sessionDate);
        if (createdDiff !== 0) {
          return createdDiff;
        }
        return (
          getSafeTimestamp(b.sessionDate) - getSafeTimestamp(a.sessionDate)
        );
      });

      setAppointments(sortedBookings);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Don't show alert on initial load, just log
      if (!isRefresh) {
        // Could show a toast or error message here
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openGroupSessionModal = async () => {
    try {
      setCreatingGroupSession(true);
      const response = await apiService.getMyPlans();
      const payload = response?.data || response;
      const plans: Plan[] = payload?.plans || payload?.data?.plans || [];
      const eligible = plans.filter(
        (plan) =>
          plan.type === "monthly" &&
          plan.sessionFormat === "one-to-many" &&
          plan.isActive
      );
      setGroupPlans(eligible);
      if (eligible.length > 0 && !selectedGroupPlanId) {
        setSelectedGroupPlanId(eligible[0]._id);
      }
      setShowGroupSessionModal(true);
    } catch (error) {
      Alert.alert("Error", handleApiError(error));
    } finally {
      setCreatingGroupSession(false);
    }
  };

  const handleCreateGroupSession = async () => {
    if (
      !selectedGroupPlanId ||
      !groupSessionDate ||
      !groupStartTime ||
      !groupDuration
    ) {
      Alert.alert(
        "Missing details",
        "Please select a plan and fill all fields."
      );
      return;
    }
    const durationNumber = parseInt(groupDuration, 10);
    if (isNaN(durationNumber) || durationNumber <= 0) {
      Alert.alert(
        "Invalid duration",
        "Please enter a valid duration in minutes."
      );
      return;
    }
    try {
      setCreatingGroupSession(true);
      await apiService.createGroupSessionForPlan({
        planId: selectedGroupPlanId,
        sessionDate: groupSessionDate,
        startTime: groupStartTime,
        duration: durationNumber,
        consultationMethod: groupConsultationMethod,
      });
      setShowGroupSessionModal(false);
      setGroupSessionDate("");
      setGroupStartTime("");
      setGroupDuration("60");
      await fetchAppointments(true);
      Alert.alert(
        "Scheduled",
        "Group session scheduled for all active subscribers."
      );
    } catch (error) {
      Alert.alert("Error", handleApiError(error));
    } finally {
      setCreatingGroupSession(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return "Today";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const formatFeedbackMeta = (
    sessionDate?: string,
    startTime?: string,
    endTime?: string
  ) => {
    const parts: string[] = [];
    if (sessionDate) {
      parts.push(formatDate(sessionDate));
    }
    if (startTime && endTime) {
      parts.push(formatTimeRange(startTime, endTime));
    }
    return parts.join(" • ");
  };

  const formatFeedbackDateLabel = (value?: string) => {
    if (!value) {
      return "";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatConsultationMethod = (method: string) => {
    const labels: Record<string, string> = {
      video: "Video Call",
      audio: "Audio Call",
      chat: "Chat",
      "in-person": "In-Person",
    };
    return labels[method] || method;
  };

  const getAppointmentDateTimes = (appointment: Appointment) => {
    const sessionDate = new Date(appointment.sessionDate);
    const [startHour, startMin] = appointment.startTime.split(":").map(Number);
    const [endHour, endMin] = appointment.endTime.split(":").map(Number);

    const startDateTime = new Date(sessionDate);
    startDateTime.setHours(startHour, startMin, 0, 0);

    const endDateTime = new Date(sessionDate);
    endDateTime.setHours(endHour, endMin, 0, 0);

    return { startDateTime, endDateTime };
  };

  const isRealtimeConsultation = (method?: string) => {
    if (!method) return false;
    return method === "video" || method === "audio";
  };

  const getJoinCtaLabel = (method?: string) => {
    if (method === "audio") {
      return "Join Audio Call";
    }
    return "Join Video Call";
  };

  // Helper to get join status for better UI messaging
  const getJoinStatus = (
    appointment: Appointment
  ): "too-early" | "available" | "ended" | "not-applicable" => {
    if (
      !isRealtimeConsultation(appointment.consultationMethod) ||
      appointment.status !== "confirmed"
    ) {
      return "not-applicable";
    }
    const { startDateTime, endDateTime } = getAppointmentDateTimes(appointment);
    const now = new Date();
    const joinOpensAt = new Date(startDateTime.getTime() - 5 * 60 * 1000);
    const joinClosesAt = new Date(endDateTime.getTime() + 15 * 60 * 1000);

    if (now < joinOpensAt) {
      return "too-early";
    }
    if (now > joinClosesAt) {
      return "ended";
    }
    return "available";
  };

  const canMarkSessionCompleted = (appointment: Appointment) => {
    if (appointment.status !== "confirmed") {
      return false;
    }
    const { startDateTime } = getAppointmentDateTimes(appointment);
    return new Date() >= startDateTime;
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    newStatus: string,
    reason?: string
  ) => {
    try {
      setUpdatingId(appointmentId);
      await apiService.updateBookingStatus(
        appointmentId,
        newStatus.toLowerCase(),
        reason
      );
      await fetchAppointments();
      if (showCancelModal) {
        setShowCancelModal(false);
        setAppointmentToCancel(null);
        setCancellationReason("");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", handleApiError(error));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelPress = (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
    setCancellationReason("");
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!appointmentToCancel) return;

    if (!cancellationReason.trim()) {
      Alert.alert("Required", "Please provide a reason for cancellation");
      return;
    }

    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment? This action cannot be undone.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () =>
            handleStatusUpdate(
              appointmentToCancel._id,
              "cancelled",
              cancellationReason.trim()
            ),
        },
      ]
    );
  };

  const handleJoinSession = async (appointment: Appointment) => {
    if (joiningId) return;
    try {
      setJoiningId(appointment._id);
      const response = await apiService.getAgoraToken(appointment._id);
      const payload = response?.data || response;
      const agoraData = payload?.data || payload;

      if (!agoraData?.token || !agoraData?.channelName || !agoraData?.appId) {
        throw new Error("Unable to start session. Please try again.");
      }

      router.push({
        pathname: "/video-call",
        params: {
          appId: encodeURIComponent(String(agoraData.appId)),
          channelName: encodeURIComponent(String(agoraData.channelName)),
          token: encodeURIComponent(String(agoraData.token)),
          uid: encodeURIComponent(String(agoraData.uid ?? "")),
          role: encodeURIComponent(String(agoraData.role || "host")),
          displayName: encodeURIComponent("Expert"),
          mediaType: encodeURIComponent(
            String(
              agoraData.mediaType || appointment.consultationMethod || "video"
            )
          ),
        },
      });
    } catch (error) {
      Alert.alert("Unable to Join", handleApiError(error));
    } finally {
      setJoiningId(null);
    }
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    console.log("Opening patient details for appointment:", appointment._id);
    console.log("Patient user data:", appointment.user);
    setSelectedAppointmentForDetails(appointment);
    setShowPatientDetailsModal(true);
    if (appointment.user?._id) {
      fetchPatientDetails(appointment.user._id);
    } else {
      setLoadingPatientDetails(false);
    }
  };

  const fetchPatientDetails = async (userId: string) => {
    try {
      setLoadingPatientDetails(true);
      console.log("Fetching patient details for userId:", userId);

      // Try to fetch full user details including health information
      try {
        const response = await apiService.getUserById(userId);
        console.log("Patient details response:", response);

        // Extract user data from response
        const userData =
          response?.data?.user || response?.user || response?.data || null;
        if (userData) {
          setPatientDetails(userData);
          console.log("Patient details set:", userData);
        } else {
          console.log("No user data in response, using appointment data");
          setPatientDetails(null);
        }
      } catch (apiError) {
        console.log(
          "API endpoint not available, using appointment data:",
          apiError
        );
        // If the endpoint doesn't exist, we'll use appointment data
        setPatientDetails(null);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      // Continue with appointment data
      setPatientDetails(null);
    } finally {
      setLoadingPatientDetails(false);
    }
  };

  const toggleFeedbackExpansion = (appointmentId: string) => {
    setExpandedFeedbackAppointments((prev) => ({
      ...prev,
      [appointmentId]: !prev[appointmentId],
    }));
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const user = appointment.user;
    const userName = `${user?.firstName || ""} ${user?.lastName || ""}`
      .trim()
      .toLowerCase();
    const matchesSearch =
      !searchQuery ||
      userName.includes(searchQuery.toLowerCase()) ||
      (appointment.notes || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Filter appointments for today
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);
  // const todayAppointments = filteredAppointments.filter(apt => {
  //   const aptDate = new Date(apt.sessionDate);
  //   aptDate.setHours(0, 0, 0, 0);
  //   return aptDate.getTime() === today.getTime();
  // });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Compact Header */}
      <View style={styles.compactHeader}>
        <Text style={styles.headerTitle}>My Schedule</Text>
        <Text style={styles.headerSubtitle}>
          Manage your appointments and availability
        </Text>
        <Pressable
          style={styles.groupSessionButton}
          onPress={openGroupSessionModal}
        >
          <Text style={styles.groupSessionButtonText}>
            {creatingGroupSession ? "Loading..." : "Schedule Group Session"}
          </Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search appointments..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((status) => (
            <Pressable
              key={status}
              style={[
                styles.filterChip,
                selectedStatus === status && styles.filterChipActive,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedStatus === status && styles.filterChipTextActive,
                ]}
              >
                {status}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* {recentFeedbackEntries.length > 0 && (
        <View style={styles.feedbackHighlightsContainer}>
          <Text style={styles.feedbackHighlightsTitle}>Recent Feedback</Text>
          {recentFeedbackEntries.map((entry, index) => {
            const submittedLabel = formatFeedbackDateLabel(entry.createdAt || entry.sessionDate);
            const sessionMeta = formatFeedbackMeta(entry.sessionDate, entry.startTime, entry.endTime);

            return (
              <View
                key={entry.id}
                style={[
                  styles.feedbackHighlightCard,
                  index === recentFeedbackEntries.length - 1 && styles.feedbackHighlightCardLast,
                ]}
              >
                <View style={styles.feedbackHighlightHeader}>
                  <Text style={styles.feedbackHighlightName}>{entry.userName}</Text>
                  {!!submittedLabel && (
                    <Text style={styles.feedbackHighlightTimestamp}>{submittedLabel}</Text>
                  )}
                </View>
                {renderRatingStars(entry.rating)}
                {entry.comment ? (
                  <Text style={styles.feedbackHighlightComment} numberOfLines={2}>
                    {entry.comment}
                  </Text>
                ) : (
                  <Text style={styles.feedbackHighlightPlaceholder}>
                    Rated this session {entry.rating}/5
                  </Text>
                )}
                {!!sessionMeta && (
                  <Text style={styles.feedbackHighlightMeta}>{sessionMeta}</Text>
                )}
              </View>
            );
          })}
        </View>
      )} */}

      {/* Appointments List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.appointmentsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchAppointments(true)}
              tintColor="#FFFFFF"
              colors={["#FFFFFF"]}
            />
          }
        >
          <Text style={styles.sectionTitle}>
            {selectedStatus === "All"
              ? `All Appointments (${filteredAppointments.length})`
              : `${selectedStatus} Appointments (${filteredAppointments.length})`}
          </Text>

          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No appointments found</Text>
            </View>
          ) : (
            filteredAppointments.map((appointment) => {
              const user = appointment.user;
              const userName = buildUserDisplayName(user);
              const userImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userName
              )}&background=37b9a8&color=fff&size=128`;
              const isUpdating = updatingId === appointment._id;
              const prescriptionUrl = buildAbsoluteUrl(
                appointment.prescription?.url
              );
              const prescriptionUploadedText = formatTimestamp(
                appointment.prescription?.uploadedAt
              );
              const appointmentFeedbackEntries =
                feedbackEntriesByAppointment[appointment._id] || [];
              const feedbackCount = appointmentFeedbackEntries.length;
              const isFeedbackExpanded =
                !!expandedFeedbackAppointments[appointment._id];
              const visibleFeedbackEntries =
                !isFeedbackExpanded && feedbackCount > FEEDBACK_PREVIEW_LIMIT
                  ? appointmentFeedbackEntries.slice(0, FEEDBACK_PREVIEW_LIMIT)
                  : appointmentFeedbackEntries;
              const averageFeedbackRating =
                feedbackCount > 0
                  ? appointmentFeedbackEntries.reduce(
                      (sum, entry) => sum + entry.rating,
                      0
                    ) / feedbackCount
                  : 0;

              return (
                <View key={appointment._id} style={styles.appointmentCard}>
                  <Pressable
                    style={styles.appointmentCardPressable}
                    onPress={() => handleAppointmentPress(appointment)}
                  >
                    <View style={styles.avatarSection}>
                      <Image
                        source={{ uri: userImage }}
                        style={styles.patientImage}
                      />
                      <Pressable
                        style={[
                          styles.showPatientDetailsButton,
                          styles.detailsButtonCompact,
                        ]}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleAppointmentPress(appointment);
                        }}
                      >
                        <Ionicons name="eye" size={16} color="#FFFFFF" />
                        <Text style={styles.showPatientDetailsButtonText}>
                          Details
                        </Text>
                      </Pressable>
                    </View>
                    <View style={styles.appointmentInfo}>
                      <View style={styles.appointmentHeader}>
                        <Text style={styles.patientName}>{userName}</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor:
                                appointment.status === "confirmed"
                                  ? "#059669"
                                  : appointment.status === "pending"
                                  ? "#F59E0B"
                                  : appointment.status === "completed"
                                  ? "#2196F3"
                                  : "#F44336",
                            },
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.appointmentTime}>
                        {formatDate(appointment.sessionDate)} •{" "}
                        {formatTimeRange(
                          appointment.startTime,
                          appointment.endTime
                        )}
                      </Text>
                      <Text style={styles.appointmentType}>
                        {formatConsultationMethod(
                          appointment.consultationMethod
                        )}{" "}
                        •{" "}
                        {appointment.sessionType === "one-on-one"
                          ? "One-on-One"
                          : "Group"}
                      </Text>
                      {appointment.notes && (
                        <Text style={styles.appointmentNotes}>
                          {appointment.notes}
                        </Text>
                      )}

                      {appointment.status === "completed" &&
                        !appointment.prescription?.url && (
                          <Pressable
                            style={[
                              styles.prescriptionActionButton,
                              uploadingPrescriptionId === appointment._id &&
                                styles.buttonDisabled,
                            ]}
                            onPress={() =>
                              handlePrescriptionUpload(appointment)
                            }
                            disabled={
                              uploadingPrescriptionId === appointment._id
                            }
                          >
                            {uploadingPrescriptionId === appointment._id ? (
                              <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                              <Text style={styles.prescriptionActionButtonText}>
                                Upload Prescription (PDF)
                              </Text>
                            )}
                          </Pressable>
                        )}

                      {appointment.prescription?.url && (
                        <View style={styles.prescriptionContainer}>
                          <View style={styles.prescriptionHeader}>
                            <Text style={styles.prescriptionTitle}>
                              Prescription
                            </Text>
                            {prescriptionUrl && (
                              <Pressable
                                onPress={() =>
                                  handleOpenPrescription(prescriptionUrl)
                                }
                              >
                                <Text style={styles.prescriptionLink}>
                                  Download PDF
                                </Text>
                              </Pressable>
                            )}
                          </View>
                          {appointment.prescription?.originalName && (
                            <Text
                              style={styles.prescriptionMeta}
                              numberOfLines={1}
                            >
                              {appointment.prescription.originalName}
                            </Text>
                          )}
                          {prescriptionUploadedText ? (
                            <Text style={styles.prescriptionMeta}>
                              {prescriptionUploadedText}
                            </Text>
                          ) : null}
                          <Pressable
                            style={[
                              styles.replaceButton,
                              uploadingPrescriptionId === appointment._id &&
                                styles.buttonDisabled,
                            ]}
                            onPress={() =>
                              handlePrescriptionUpload(appointment)
                            }
                            disabled={
                              uploadingPrescriptionId === appointment._id
                            }
                          >
                            {uploadingPrescriptionId === appointment._id ? (
                              <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                              <Text style={styles.replaceButtonText}>
                                Replace PDF
                              </Text>
                            )}
                          </Pressable>
                        </View>
                      )}

                      {feedbackCount > 0 && (
                        <View style={styles.appointmentFeedback}>
                          <View style={styles.appointmentFeedbackHeader}>
                            <Text style={styles.appointmentFeedbackTitle}>
                              Client feedback
                              {feedbackCount > 1 ? ` (${feedbackCount})` : ""}
                            </Text>
                            {renderRatingStars(averageFeedbackRating)}
                          </View>
                          {visibleFeedbackEntries.map((entry, index) => {
                            const cardMeta = formatFeedbackMeta(
                              entry.sessionDate,
                              entry.startTime,
                              entry.endTime
                            );
                            const timestampLabel = formatFeedbackDateLabel(
                              entry.createdAt || entry.sessionDate
                            );

                            return (
                              <View
                                key={entry.id}
                                style={[
                                  styles.feedbackEntry,
                                  index === 0 && styles.feedbackEntryFirst,
                                ]}
                              >
                                <View style={styles.feedbackEntryHeader}>
                                  <Text style={styles.feedbackEntryName}>
                                    {entry.userName}
                                  </Text>
                                  {!!timestampLabel && (
                                    <Text style={styles.feedbackEntryTimestamp}>
                                      {timestampLabel}
                                    </Text>
                                  )}
                                </View>
                                {renderRatingStars(entry.rating)}
                                {entry.comment ? (
                                  <Text
                                    style={styles.appointmentFeedbackComment}
                                    numberOfLines={3}
                                  >
                                    {entry.comment}
                                  </Text>
                                ) : (
                                  <Text
                                    style={
                                      styles.appointmentFeedbackPlaceholder
                                    }
                                  >
                                    Client rated this session {entry.rating}/5
                                  </Text>
                                )}
                                {!!cardMeta && (
                                  <Text style={styles.feedbackEntryMeta}>
                                    {cardMeta}
                                  </Text>
                                )}
                              </View>
                            );
                          })}
                          {feedbackCount > FEEDBACK_PREVIEW_LIMIT && (
                            <Pressable
                              style={styles.feedbackToggleButton}
                              onPress={() =>
                                toggleFeedbackExpansion(appointment._id)
                              }
                            >
                              <Text style={styles.feedbackToggleText}>
                                {isFeedbackExpanded
                                  ? "Show less feedback"
                                  : "View more feedback"}
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      )}

                      <View style={styles.appointmentFooter}>
                        <View style={styles.appointmentActions}>
                          {appointment.status === "pending" && (
                            <View style={styles.actionButtons}>
                              <Pressable
                                style={[
                                  styles.confirmButton,
                                  isUpdating && styles.buttonDisabled,
                                ]}
                                onPress={() =>
                                  handleStatusUpdate(
                                    appointment._id,
                                    "confirmed"
                                  )
                                }
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                  />
                                ) : (
                                  <Text style={styles.confirmButtonText}>
                                    Confirm
                                  </Text>
                                )}
                              </Pressable>
                              <Pressable
                                style={[
                                  styles.rejectButton,
                                  isUpdating && styles.buttonDisabled,
                                ]}
                                onPress={() =>
                                  handleStatusUpdate(
                                    appointment._id,
                                    "rejected"
                                  )
                                }
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                  />
                                ) : (
                                  <Text style={styles.rejectButtonText}>
                                    Reject
                                  </Text>
                                )}
                              </Pressable>
                            </View>
                          )}
                          {appointment.status === "confirmed" && (
                            <View style={styles.confirmedActions}>
                              {(() => {
                                const canComplete =
                                  canMarkSessionCompleted(appointment);
                                const joinStatus = getJoinStatus(appointment);
                                const showJoin =
                                  isRealtimeConsultation(
                                    appointment.consultationMethod
                                  ) &&
                                  !canComplete &&
                                  joinStatus !== "ended";

                                return (
                                  <>
                                    {showJoin && (
                                      <Pressable
                                        style={[
                                          styles.joinButton,
                                          (joinStatus !== "available" ||
                                            joiningId === appointment._id) &&
                                            styles.buttonDisabled,
                                        ]}
                                        onPress={() =>
                                          handleJoinSession(appointment)
                                        }
                                        disabled={
                                          joinStatus !== "available" ||
                                          joiningId === appointment._id
                                        }
                                      >
                                        {joiningId === appointment._id ? (
                                          <ActivityIndicator
                                            size="small"
                                            color="#FFFFFF"
                                          />
                                        ) : (
                                          <Text style={styles.joinButtonText}>
                                            {joinStatus === "available"
                                              ? getJoinCtaLabel(
                                                  appointment.consultationMethod
                                                )
                                              : "Join Opens Soon"}
                                          </Text>
                                        )}
                                      </Pressable>
                                    )}
                                    {canComplete && (
                                      <Pressable
                                        style={[
                                          styles.completeButton,
                                          isUpdating && styles.buttonDisabled,
                                        ]}
                                        onPress={() =>
                                          handleStatusUpdate(
                                            appointment._id,
                                            "completed"
                                          )
                                        }
                                        disabled={isUpdating}
                                      >
                                        {isUpdating ? (
                                          <ActivityIndicator
                                            size="small"
                                            color="#FFFFFF"
                                          />
                                        ) : (
                                          <Text
                                            style={styles.completeButtonText}
                                          >
                                            Mark as Completed
                                          </Text>
                                        )}
                                      </Pressable>
                                    )}
                                    {getJoinStatus(appointment) !== "ended" && (
                                      <Pressable
                                        style={[
                                          styles.cancelButton,
                                          isUpdating && styles.buttonDisabled,
                                        ]}
                                        onPress={() =>
                                          handleCancelPress(appointment)
                                        }
                                        disabled={isUpdating}
                                      >
                                        {isUpdating ? (
                                          <ActivityIndicator
                                            size="small"
                                            color="#FFFFFF"
                                          />
                                        ) : (
                                          <Text style={styles.cancelButtonText}>
                                            Cancel
                                          </Text>
                                        )}
                                      </Pressable>
                                    )}
                                  </>
                                );
                              })()}
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </View>
              );
            })
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* Patient Details Modal */}
      <Modal
        visible={showPatientDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowPatientDetailsModal(false);
          setSelectedAppointmentForDetails(null);
          setPatientDetails(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.patientDetailsModalContent}>
            <View style={styles.patientDetailsModalHeader}>
              <Text style={styles.patientDetailsModalTitle}>
                Patient Details
              </Text>
              <Pressable
                style={styles.closeModalButton}
                onPress={() => {
                  setShowPatientDetailsModal(false);
                  setSelectedAppointmentForDetails(null);
                  setPatientDetails(null);
                }}
              >
                <Text style={styles.closeModalButtonText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.patientDetailsModalBody}>
              {loadingPatientDetails ? (
                <View style={styles.patientDetailsLoadingContainer}>
                  <ActivityIndicator size="large" color="#2da898ff" />
                  <Text style={styles.patientDetailsLoadingText}>
                    Loading patient details...
                  </Text>
                </View>
              ) : selectedAppointmentForDetails ? (
                <ScrollView
                  style={styles.patientDetailsScrollView}
                  contentContainerStyle={styles.patientDetailsScrollViewContent}
                  showsVerticalScrollIndicator={false}
                >
                  {(() => {
                    // Use fetched patient details if available, otherwise use appointment user data
                    const user =
                      patientDetails || selectedAppointmentForDetails.user;
                    console.log("Rendering modal with user:", user);
                    console.log("Patient details state:", patientDetails);
                    console.log(
                      "Appointment user:",
                      selectedAppointmentForDetails.user
                    );

                    const userName = buildUserDisplayName(user);
                    const userImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userName
                    )}&background=37b9a8&color=fff&size=128`;

                    if (!user) {
                      return (
                        <View style={styles.patientDetailsLoadingContainer}>
                          <Text style={styles.patientDetailsLoadingText}>
                            No patient information available
                          </Text>
                        </View>
                      );
                    }

                    // Extract health information
                    const bloodGroup = user.bloodGroup || null;
                    const weight = user.weightKg ? `${user.weightKg} kg` : null;
                    const bloodPressure = user.bloodPressure || null;
                    const gender = user.gender || null;
                    const dateOfBirth = user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : null;
                    const phone = user.phone || null;
                    const healthProfileUpdatedAt = user.healthProfileUpdatedAt
                      ? formatTimestamp(user.healthProfileUpdatedAt)
                      : null;

                    return (
                      <>
                        {/* Patient Header */}
                        <View style={styles.patientDetailsHeader}>
                          <Image
                            source={{ uri: userImage }}
                            style={styles.patientDetailsImage}
                          />
                          <Text style={styles.patientDetailsName}>
                            {userName || "Patient"}
                          </Text>
                          {user?.email && (
                            <Text style={styles.patientDetailsEmail}>
                              {user.email}
                            </Text>
                          )}
                        </View>

                        {/* Basic Information */}
                        <View style={styles.patientDetailsSection}>
                          <Text style={styles.patientDetailsSectionTitle}>
                            Basic Information
                          </Text>
                          <View style={styles.patientDetailsCard}>
                            <View style={styles.patientDetailsRow}>
                              <Text style={styles.patientDetailsLabel}>
                                Name:
                              </Text>
                              <Text style={styles.patientDetailsValue}>
                                {userName}
                              </Text>
                            </View>
                            {user?.email && (
                              <View style={styles.patientDetailsRow}>
                                <Text style={styles.patientDetailsLabel}>
                                  Email:
                                </Text>
                                <Text style={styles.patientDetailsValue}>
                                  {user.email}
                                </Text>
                              </View>
                            )}
                            {user?.phone && (
                              <View style={styles.patientDetailsRow}>
                                <Text style={styles.patientDetailsLabel}>
                                  Phone:
                                </Text>
                                <Text style={styles.patientDetailsValue}>
                                  {user.phone}
                                </Text>
                              </View>
                            )}
                            <View style={styles.patientDetailsRow}>
                              <Text style={styles.patientDetailsLabel}>
                                Appointment Date:
                              </Text>
                              <Text style={styles.patientDetailsValue}>
                                {formatDate(
                                  selectedAppointmentForDetails.sessionDate
                                )}
                              </Text>
                            </View>
                            <View style={styles.patientDetailsRow}>
                              <Text style={styles.patientDetailsLabel}>
                                Time:
                              </Text>
                              <Text style={styles.patientDetailsValue}>
                                {formatTimeRange(
                                  selectedAppointmentForDetails.startTime,
                                  selectedAppointmentForDetails.endTime
                                )}
                              </Text>
                            </View>
                            <View style={styles.patientDetailsRow}>
                              <Text style={styles.patientDetailsLabel}>
                                Consultation Method:
                              </Text>
                              <Text style={styles.patientDetailsValue}>
                                {formatConsultationMethod(
                                  selectedAppointmentForDetails.consultationMethod
                                )}
                              </Text>
                            </View>
                            <View style={styles.patientDetailsRow}>
                              <Text style={styles.patientDetailsLabel}>
                                Session Type:
                              </Text>
                              <Text style={styles.patientDetailsValue}>
                                {selectedAppointmentForDetails.sessionType ===
                                "one-on-one"
                                  ? "One-on-One"
                                  : "Group"}
                              </Text>
                            </View>
                            <View style={styles.patientDetailsRow}>
                              <Text style={styles.patientDetailsLabel}>
                                Status:
                              </Text>
                              <Text style={styles.patientDetailsValue}>
                                {selectedAppointmentForDetails.status
                                  .charAt(0)
                                  .toUpperCase() +
                                  selectedAppointmentForDetails.status.slice(1)}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Appointment Notes */}
                        {selectedAppointmentForDetails.notes && (
                          <View style={styles.patientDetailsSection}>
                            <Text style={styles.patientDetailsSectionTitle}>
                              Appointment Notes
                            </Text>
                            <View style={styles.patientDetailsCard}>
                              <Text style={styles.patientDetailsNotesText}>
                                {selectedAppointmentForDetails.notes}
                              </Text>
                            </View>
                          </View>
                        )}

                        {/* Health Information */}
                        <View style={styles.patientDetailsSection}>
                          <Text style={styles.patientDetailsSectionTitle}>
                            Health Information
                          </Text>
                          <View style={styles.patientDetailsCard}>
                            {bloodGroup ||
                            weight ||
                            bloodPressure ||
                            gender ||
                            dateOfBirth ? (
                              <>
                                {bloodGroup && (
                                  <View style={styles.patientDetailsRow}>
                                    <Text style={styles.patientDetailsLabel}>
                                      Blood Group:
                                    </Text>
                                    <Text style={styles.patientDetailsValue}>
                                      {bloodGroup}
                                    </Text>
                                  </View>
                                )}
                                {weight && (
                                  <View style={styles.patientDetailsRow}>
                                    <Text style={styles.patientDetailsLabel}>
                                      Weight:
                                    </Text>
                                    <Text style={styles.patientDetailsValue}>
                                      {weight}
                                    </Text>
                                  </View>
                                )}
                                {bloodPressure && (
                                  <View style={styles.patientDetailsRow}>
                                    <Text style={styles.patientDetailsLabel}>
                                      Blood Pressure:
                                    </Text>
                                    <Text style={styles.patientDetailsValue}>
                                      {bloodPressure} mmHg
                                    </Text>
                                  </View>
                                )}
                                {gender && (
                                  <View style={styles.patientDetailsRow}>
                                    <Text style={styles.patientDetailsLabel}>
                                      Gender:
                                    </Text>
                                    <Text style={styles.patientDetailsValue}>
                                      {gender.charAt(0).toUpperCase() +
                                        gender.slice(1)}
                                    </Text>
                                  </View>
                                )}
                                {dateOfBirth && (
                                  <View style={styles.patientDetailsRow}>
                                    <Text style={styles.patientDetailsLabel}>
                                      Date of Birth:
                                    </Text>
                                    <Text style={styles.patientDetailsValue}>
                                      {dateOfBirth}
                                    </Text>
                                  </View>
                                )}
                                {phone && (
                                  <View style={styles.patientDetailsRow}>
                                    <Text style={styles.patientDetailsLabel}>
                                      Phone:
                                    </Text>
                                    <Text style={styles.patientDetailsValue}>
                                      {phone}
                                    </Text>
                                  </View>
                                )}
                                {healthProfileUpdatedAt && (
                                  <View style={styles.patientDetailsRow}>
                                    <Text style={styles.patientDetailsLabel}>
                                      Last Updated:
                                    </Text>
                                    <Text style={styles.patientDetailsValue}>
                                      {healthProfileUpdatedAt}
                                    </Text>
                                  </View>
                                )}
                              </>
                            ) : (
                              <>
                                <Text
                                  style={styles.patientDetailsPlaceholderText}
                                >
                                  No health information available. Patient has
                                  not updated their health profile yet.
                                </Text>
                              </>
                            )}
                          </View>
                        </View>

                        {/* Feedback Section */}
                        {feedbackEntriesByAppointment[
                          selectedAppointmentForDetails._id
                        ]?.length > 0 && (
                          <View style={styles.patientDetailsSection}>
                            <Text style={styles.patientDetailsSectionTitle}>
                              Patient Feedback
                            </Text>
                            <View style={styles.patientDetailsCard}>
                              {feedbackEntriesByAppointment[
                                selectedAppointmentForDetails._id
                              ].map((entry) => (
                                <View
                                  key={entry.id}
                                  style={styles.patientDetailsFeedbackEntry}
                                >
                                  <View
                                    style={styles.patientDetailsFeedbackHeader}
                                  >
                                    <Text
                                      style={styles.patientDetailsFeedbackDate}
                                    >
                                      {formatFeedbackDateLabel(
                                        entry.createdAt || entry.sessionDate
                                      )}
                                    </Text>
                                    {renderRatingStars(entry.rating)}
                                  </View>
                                  {entry.comment && (
                                    <Text
                                      style={
                                        styles.patientDetailsFeedbackComment
                                      }
                                    >
                                      {entry.comment}
                                    </Text>
                                  )}
                                </View>
                              ))}
                            </View>
                          </View>
                        )}
                      </>
                    );
                  })()}
                </ScrollView>
              ) : (
                <View style={styles.patientDetailsLoadingContainer}>
                  <Text style={styles.patientDetailsLoadingText}>
                    No appointment selected
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Appointment Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowCancelModal(false);
          setAppointmentToCancel(null);
          setCancellationReason("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Appointment</Text>
            {appointmentToCancel && (
              <>
                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel}>Patient: </Text>
                    {`${appointmentToCancel.user?.firstName || ""} ${
                      appointmentToCancel.user?.lastName || ""
                    }`.trim() || "User"}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel}>Date: </Text>
                    {formatDate(appointmentToCancel.sessionDate)} •{" "}
                    {formatTimeRange(
                      appointmentToCancel.startTime,
                      appointmentToCancel.endTime
                    )}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel}>Type: </Text>
                    {formatConsultationMethod(
                      appointmentToCancel.consultationMethod
                    )}
                  </Text>
                </View>
                <Text style={styles.modalLabel}>Cancellation Reason *</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Please provide a reason for cancelling this appointment..."
                  placeholderTextColor="#9CA3AF"
                  value={cancellationReason}
                  onChangeText={setCancellationReason}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => {
                      setShowCancelModal(false);
                      setAppointmentToCancel(null);
                      setCancellationReason("");
                    }}
                  >
                    <Text style={styles.modalButtonCancelText}>
                      Keep Appointment
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.modalButton,
                      styles.modalButtonConfirm,
                      !cancellationReason.trim() && styles.modalButtonDisabled,
                    ]}
                    onPress={handleConfirmCancel}
                    disabled={
                      !cancellationReason.trim() ||
                      updatingId === appointmentToCancel._id
                    }
                  >
                    {updatingId === appointmentToCancel._id ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.modalButtonConfirmText}>
                        Cancel Appointment
                      </Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Group Session Modal */}
      <Modal
        visible={showGroupSessionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGroupSessionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedule Group Session</Text>
            {groupPlans.length === 0 ? (
              <Text style={styles.modalInfoText}>
                You do not have any active monthly group plans yet.
              </Text>
            ) : (
              <>
                <Text style={styles.modalLabel}>Plan</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: getResponsiveHeight(16) }}
                >
                  {groupPlans.map((plan) => (
                    <Pressable
                      key={plan._id}
                      style={[
                        styles.filterChip,
                        selectedGroupPlanId === plan._id &&
                          styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedGroupPlanId(plan._id)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedGroupPlanId === plan._id &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {plan.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                <Text style={styles.modalLabel}>Session Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="2025-01-15"
                  placeholderTextColor="#9CA3AF"
                  value={groupSessionDate}
                  onChangeText={setGroupSessionDate}
                />

                <Text style={styles.modalLabel}>Start Time (HH:MM, 24h)</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="18:30"
                  placeholderTextColor="#9CA3AF"
                  value={groupStartTime}
                  onChangeText={setGroupStartTime}
                />

                <Text style={styles.modalLabel}>Duration (minutes)</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="60"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={groupDuration}
                  onChangeText={setGroupDuration}
                />

                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setShowGroupSessionModal(false)}
                    disabled={creatingGroupSession}
                  >
                    <Text style={styles.modalButtonCancelText}>Close</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={handleCreateGroupSession}
                    disabled={creatingGroupSession}
                  >
                    {creatingGroupSession ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.modalButtonConfirmText}>
                        Schedule
                      </Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <ExpertFooter activeRoute="appointments" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2da898ff",
  },
  compactHeader: {
    alignItems: "flex-start",
    paddingTop: getResponsiveHeight(50),
    paddingHorizontal: getResponsiveWidth(20),
    paddingBottom: getResponsiveHeight(24),
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: getResponsiveHeight(8),
    textAlign: "left",
  },
  headerSubtitle: {
    fontSize: getResponsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "left",
  },
  searchContainer: {
    paddingHorizontal: getResponsiveWidth(20),
    marginBottom: getResponsiveHeight(20),
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(12),
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(8),
    fontSize: getResponsiveFontSize(16),
    color: "#1F2937",
  },
  filtersContainer: {
    paddingLeft: getResponsiveWidth(20),
    marginBottom: getResponsiveHeight(24),
  },
  feedbackHighlightsContainer: {
    marginHorizontal: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(24),
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
  },
  feedbackHighlightsTitle: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(16),
    fontWeight: "700",
    marginBottom: getResponsiveHeight(12),
  },
  feedbackHighlightCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    marginBottom: getResponsiveMargin(12),
  },
  feedbackHighlightCardLast: {
    marginBottom: 0,
  },
  feedbackHighlightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedbackHighlightName: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    marginRight: getResponsiveWidth(8),
  },
  feedbackHighlightTimestamp: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
  },
  feedbackHighlightComment: {
    fontSize: getResponsiveFontSize(13),
    color: "#374151",
    marginTop: getResponsiveHeight(6),
  },
  feedbackHighlightPlaceholder: {
    fontSize: getResponsiveFontSize(13),
    color: "#6B7280",
    fontStyle: "italic",
    marginTop: getResponsiveHeight(6),
  },
  feedbackHighlightMeta: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
    marginTop: getResponsiveHeight(8),
  },
  feedbackStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveHeight(4),
  },
  feedbackStar: {
    fontSize: getResponsiveFontSize(14),
    marginRight: 2,
  },
  feedbackStarFilled: {
    color: "#F59E0B",
  },
  feedbackStarEmpty: {
    color: "#D1D5DB",
  },
  groupSessionButton: {
    marginTop: getResponsiveHeight(12),
    paddingHorizontal: getResponsiveWidth(16),
    paddingVertical: getResponsiveHeight(8),
    backgroundColor: "#575623ff",
    borderRadius: getResponsiveBorderRadius(20),
    alignSelf: "flex-start",
  },
  groupSessionButtonText: {
    color: "#ffffff",
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
  },
  filterChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(16),
    marginRight: getResponsiveMargin(8),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  filterChipActive: {
    backgroundColor: "#575623ff",
    borderColor: "#575623ff",
  },
  filterChipText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 16,
  },
  appointmentsContainer: {
    flex: 1,
    paddingHorizontal: getResponsiveWidth(20),
    paddingTop: getResponsiveHeight(8),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: getResponsiveHeight(20),
  },
  appointmentCard: {
    backgroundColor: "#ffffff",
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveMargin(20),
    borderWidth: 2,
    borderColor: "#F59E0B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  appointmentCardPressable: {
    flexDirection: "row",
    padding: getResponsivePadding(12),
  },
  avatarSection: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 12,
  },
  patientImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: getResponsiveHeight(8),
    borderWidth: 3,
    borderColor: "#F59E0B",
  },
  appointmentInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveHeight(2),
  },
  patientName: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: getResponsiveWidth(8),
    paddingVertical: getResponsiveHeight(4),
    borderRadius: getResponsiveBorderRadius(12),
    marginLeft: getResponsiveWidth(8),
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(10),
    fontWeight: "600",
  },
  appointmentTime: {
    fontSize: getResponsiveFontSize(12),
    color: "#1F2937",
    fontWeight: "600",
    marginBottom: getResponsiveHeight(1),
  },
  appointmentType: {
    fontSize: getResponsiveFontSize(11),
    color: "#575623ff",
    fontWeight: "600",
    marginBottom: getResponsiveHeight(2),
  },
  appointmentNotes: {
    fontSize: getResponsiveFontSize(10),
    color: "#444",
    lineHeight: getResponsiveHeight(12),
    marginBottom: getResponsiveHeight(4),
  },
  prescriptionActionButton: {
    backgroundColor: "#2563EB",
    paddingVertical: getResponsiveHeight(8),
    paddingHorizontal: getResponsiveWidth(12),
    borderRadius: getResponsiveBorderRadius(10),
    alignItems: "center",
    marginBottom: getResponsiveHeight(6),
  },
  prescriptionActionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: getResponsiveFontSize(12),
  },
  prescriptionContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    marginBottom: getResponsiveHeight(6),
    backgroundColor: "#F9FAFB",
  },
  prescriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveHeight(6),
  },
  prescriptionTitle: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: "700",
    color: "#111827",
  },
  prescriptionLink: {
    fontSize: getResponsiveFontSize(12),
    color: "#2563EB",
    fontWeight: "600",
  },
  prescriptionMeta: {
    fontSize: getResponsiveFontSize(11),
    color: "#4B5563",
    marginBottom: getResponsiveHeight(4),
  },
  replaceButton: {
    backgroundColor: "#059669",
    paddingVertical: getResponsiveHeight(8),
    borderRadius: getResponsiveBorderRadius(10),
    alignItems: "center",
    marginTop: getResponsiveHeight(6),
  },
  replaceButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: getResponsiveFontSize(12),
  },
  appointmentFeedback: {
    backgroundColor: "#F9FAFB",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: getResponsiveHeight(6),
  },
  appointmentFeedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: getResponsiveHeight(4),
  },
  appointmentFeedbackTitle: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: "700",
    color: "#111827",
  },
  appointmentFeedbackComment: {
    fontSize: getResponsiveFontSize(12),
    color: "#374151",
  },
  appointmentFeedbackPlaceholder: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
    fontStyle: "italic",
  },
  feedbackEntry: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: getResponsiveHeight(8),
    marginTop: getResponsiveHeight(8),
  },
  feedbackEntryFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
    marginTop: 0,
  },
  feedbackEntryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: getResponsiveHeight(4),
  },
  feedbackEntryName: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: getResponsiveWidth(8),
  },
  feedbackEntryTimestamp: {
    fontSize: getResponsiveFontSize(11),
    color: "#6B7280",
  },
  feedbackEntryMeta: {
    fontSize: getResponsiveFontSize(11),
    color: "#6B7280",
    marginTop: getResponsiveHeight(4),
  },
  feedbackToggleButton: {
    marginTop: getResponsiveHeight(8),
    alignSelf: "flex-start",
    paddingVertical: getResponsiveHeight(4),
  },
  feedbackToggleText: {
    fontSize: getResponsiveFontSize(12),
    color: "#2563EB",
    fontWeight: "600",
  },
  appointmentFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: "auto",
  },
  appointmentActions: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: getResponsiveWidth(8),
  },
  confirmButton: {
    backgroundColor: "#059669",
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
  },
  confirmButtonText: {
    fontSize: getResponsiveFontSize(11),
    color: "#ffffff",
    fontWeight: "600",
  },
  rejectButton: {
    backgroundColor: "#F44336",
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
  },
  rejectButtonText: {
    fontSize: getResponsiveFontSize(11),
    color: "#ffffff",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  joinButton: {
    backgroundColor: "#2da898ff",
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
    shadowColor: "#2da898ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    minWidth: getResponsiveWidth(100),
  },
  joinButtonText: {
    fontSize: getResponsiveFontSize(11),
    color: "#ffffff",
    fontWeight: "600",
  },
  completeButton: {
    backgroundColor: "#0EA5E9",
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    minWidth: getResponsiveWidth(100),
  },
  completeButtonText: {
    fontSize: getResponsiveFontSize(11),
    color: "#ffffff",
    fontWeight: "600",
  },
  waitingText: {
    fontSize: getResponsiveFontSize(11),
    color: "#6B7280",
    fontStyle: "italic",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  bottomSpacer: {
    height: EXPERT_FOOTER_HEIGHT + getResponsiveHeight(60),
  },
  confirmedActions: {
    flexDirection: "row",
    gap: getResponsiveWidth(8),
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
    minWidth: getResponsiveWidth(80),
  },
  cancelButtonText: {
    fontSize: getResponsiveFontSize(11),
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: getResponsiveWidth(20),
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(24),
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: getResponsiveHeight(16),
    textAlign: "center",
  },
  modalInfo: {
    backgroundColor: "#F3F4F6",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    marginBottom: getResponsiveHeight(16),
  },
  modalInfoText: {
    fontSize: getResponsiveFontSize(14),
    color: "#374151",
    marginBottom: getResponsiveHeight(4),
  },
  modalInfoLabel: {
    fontWeight: "600",
    color: "#1F2937",
  },
  modalLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: getResponsiveHeight(8),
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(14),
    color: "#1F2937",
    minHeight: getResponsiveHeight(100),
    marginBottom: getResponsiveHeight(20),
    backgroundColor: "#FFFFFF",
  },
  modalButtons: {
    flexDirection: "row",
    gap: getResponsiveWidth(12),
  },
  modalButton: {
    flex: 1,
    paddingVertical: getResponsiveHeight(12),
    borderRadius: getResponsiveBorderRadius(12),
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  modalButtonCancelText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
    color: "#374151",
  },
  modalButtonConfirm: {
    backgroundColor: "#F44336",
  },
  modalButtonConfirmText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  showPatientDetailsButton: {
    backgroundColor: "#2da898ff",
    paddingVertical: getResponsiveHeight(6),
    paddingHorizontal: getResponsiveWidth(12),
    borderRadius: getResponsiveBorderRadius(12),
    alignItems: "center",
    alignSelf: "stretch",
  },
  detailsButtonCompact: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: getResponsiveWidth(4),
  },
  showPatientDetailsButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(11),
    fontWeight: "600",
    textAlign: "center",
  },
  patientDetailsModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: getResponsiveBorderRadius(20),
    width: "100%",
    maxWidth: 500,
    height: "75%",
    maxHeight: 600,
    overflow: "hidden",
    flexDirection: "column",
  },
  patientDetailsModalBody: {
    flex: 1,
    minHeight: 400,
    maxHeight: 500,
  },
  patientDetailsModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: getResponsiveWidth(20),
    paddingTop: getResponsiveHeight(20),
    paddingBottom: getResponsiveHeight(16),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  patientDetailsModalTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeModalButton: {
    width: getResponsiveWidth(32),
    height: getResponsiveWidth(32),
    borderRadius: getResponsiveWidth(16),
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButtonText: {
    fontSize: getResponsiveFontSize(18),
    color: "#6B7280",
    fontWeight: "bold",
  },
  patientDetailsScrollView: {
    flex: 1,
  },
  patientDetailsScrollViewContent: {
    paddingHorizontal: getResponsiveWidth(20),
    paddingTop: getResponsiveHeight(16),
    paddingBottom: getResponsiveHeight(40),
    flexGrow: 1,
  },
  patientDetailsLoadingContainer: {
    padding: getResponsivePadding(40),
    alignItems: "center",
    justifyContent: "center",
  },
  patientDetailsLoadingText: {
    marginTop: getResponsiveHeight(12),
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
  },
  patientDetailsHeader: {
    alignItems: "center",
    paddingVertical: getResponsiveHeight(24),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: getResponsiveHeight(16),
  },
  patientDetailsImage: {
    width: getResponsiveWidth(100),
    height: getResponsiveWidth(100),
    borderRadius: getResponsiveWidth(50),
    marginBottom: getResponsiveHeight(12),
    borderWidth: 3,
    borderColor: "#2da898ff",
  },
  patientDetailsName: {
    fontSize: getResponsiveFontSize(22),
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: getResponsiveHeight(4),
  },
  patientDetailsEmail: {
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
  },
  patientDetailsSection: {
    marginBottom: getResponsiveHeight(20),
    width: "100%",
  },
  patientDetailsSectionTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: getResponsiveHeight(12),
  },
  patientDetailsCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: "100%",
  },
  patientDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: getResponsiveHeight(12),
  },
  patientDetailsLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
    color: "#6B7280",
    flex: 1,
  },
  patientDetailsValue: {
    fontSize: getResponsiveFontSize(14),
    color: "#1F2937",
    flex: 1,
    textAlign: "right",
  },
  patientDetailsNotesText: {
    fontSize: getResponsiveFontSize(14),
    color: "#374151",
    lineHeight: getResponsiveFontSize(20),
  },
  patientDetailsPlaceholderText: {
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
    lineHeight: getResponsiveFontSize(20),
    fontStyle: "italic",
    marginBottom: getResponsiveHeight(8),
  },
  patientDetailsPlaceholderSubtext: {
    fontSize: getResponsiveFontSize(12),
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  patientDetailsFeedbackEntry: {
    marginBottom: getResponsiveHeight(16),
    paddingBottom: getResponsiveHeight(16),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  patientDetailsFeedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveHeight(8),
  },
  patientDetailsFeedbackDate: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
  },
  patientDetailsFeedbackComment: {
    fontSize: getResponsiveFontSize(14),
    color: "#374151",
    lineHeight: getResponsiveFontSize(20),
  },
});
