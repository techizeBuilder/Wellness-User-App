import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from "@/components/ExpertFooter";
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsivePadding,
  getResponsiveWidth,
} from "@/utils/dimensions";

const { width } = Dimensions.get("window");

export default function AppointmentDetailScreen() {
  const params = useLocalSearchParams();

  const { appointmentId, patientName, time, type, status, notes } = params;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "#059669";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#DC2626";
      default:
        return "#6B7280";
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
          {/* Header */}
          <View style={styles.headerSection}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.title}>Appointment Details</Text>
            <View style={styles.headerRight} />
          </View>

          {/* Appointment Info Card */}
          <View style={styles.appointmentInfoCard}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.patientName}>{patientName}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(status as string) },
                ]}
              >
                <Text style={styles.statusText}>
                  {(status as string)?.charAt(0).toUpperCase() +
                    (status as string)?.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time:</Text>
                <Text style={styles.detailValue}>{time}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{type}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={styles.detailValue}>{notes}</Text>
              </View>
            </View>
          </View>

          {/* Patient Information */}
          <View style={styles.patientInfoCard}>
            <Text style={styles.sectionTitle}>Patient Information</Text>

            <View style={styles.patientDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{patientName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Previous Sessions:</Text>
                <Text style={styles.detailValue}>12</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Progress:</Text>
                <Text style={styles.detailValue}>Excellent</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Session:</Text>
                <Text style={styles.detailValue}>Yesterday</Text>
              </View>
            </View>
          </View>

          {/* Session Preparation */}
          <View style={styles.preparationCard}>
            <Text style={styles.sectionTitle}>Session Preparation</Text>

            <View style={styles.preparationList}>
              <Text style={styles.preparationItem}>
                ✅ Review patient notes
              </Text>
              <Text style={styles.preparationItem}>
                ✅ Check session materials
              </Text>
              <Text style={styles.preparationItem}>
                ✅ Test video connection
              </Text>
              <Text style={styles.preparationItem}>✅ Prepare exercises</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsCard}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.actionButtonsContainer}>
              <Pressable style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Join Session</Text>
              </Pressable>

              <Pressable style={[styles.actionButton, styles.secondaryButton]}>
                <Text
                  style={[styles.actionButtonText, styles.secondaryButtonText]}
                >
                  Send Message
                </Text>
              </Pressable>
            </View>

            <View style={styles.actionButtonsContainer}>
              <Pressable style={[styles.actionButton, styles.warningButton]}>
                <Text style={styles.actionButtonText}>Reschedule</Text>
              </Pressable>

              <Pressable style={[styles.actionButton, styles.dangerButton]}>
                <Text style={styles.actionButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>

          {/* Session Notes */}
          <View style={styles.notesCard}>
            <Text style={styles.sectionTitle}>Session Notes</Text>

            <View style={styles.notesContainer}>
              <Text style={styles.notesPlaceholder}>
                Tap to add notes for this session...
              </Text>
            </View>

            <Pressable style={styles.addNoteButton}>
              <Text style={styles.addNoteButtonText}>Add Note</Text>
            </Pressable>
          </View>

          <View style={{ height: EXPERT_FOOTER_HEIGHT + 20 }} />
        </ScrollView>
      </LinearGradient>
      <ExpertFooter activeRoute="appointments" />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: getResponsiveHeight(24),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveWidth(40),
    borderRadius: getResponsiveWidth(20),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: getResponsiveFontSize(20),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  title: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerRight: {
    width: getResponsiveWidth(40),
  },
  appointmentInfoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveHeight(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveHeight(16),
  },
  patientName: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderRadius: getResponsiveBorderRadius(16),
  },
  statusText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  appointmentDetails: {
    gap: getResponsiveHeight(12),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: getResponsiveFontSize(14),
    color: "#1F2937",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  patientInfoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveHeight(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: getResponsiveHeight(16),
  },
  patientDetails: {
    gap: getResponsiveHeight(12),
  },
  preparationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveHeight(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  preparationList: {
    gap: getResponsiveHeight(8),
  },
  preparationItem: {
    fontSize: getResponsiveFontSize(14),
    color: "#4B5563",
    lineHeight: getResponsiveHeight(20),
  },
  quickActionsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveHeight(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: getResponsiveHeight(12),
  },
  actionButton: {
    backgroundColor: "#2DD4BF",
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(20),
    borderRadius: getResponsiveBorderRadius(12),
    flex: 0.48,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#2DD4BF",
  },
  warningButton: {
    backgroundColor: "#F59E0B",
  },
  dangerButton: {
    backgroundColor: "#DC2626",
  },
  actionButtonText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#2DD4BF",
  },
  notesCard: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveHeight(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  notesContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: getResponsiveBorderRadius(8),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveHeight(12),
    minHeight: getResponsiveHeight(80),
  },
  notesPlaceholder: {
    fontSize: getResponsiveFontSize(14),
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  addNoteButton: {
    backgroundColor: "#2DD4BF",
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    alignItems: "center",
  },
  addNoteButtonText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
