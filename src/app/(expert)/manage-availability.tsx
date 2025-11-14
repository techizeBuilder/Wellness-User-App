import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from "@/components/ExpertFooter";
import { apiService } from "@/services/apiService";
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsivePadding,
  getResponsiveWidth,
} from "@/utils/dimensions";

interface TimeRange {
  id: string;
  startTime: string;
  endTime: string;
}

interface DayAvailability {
  day: string;
  dayName: string;
  isOpen: boolean;
  timeRanges: TimeRange[];
}

const defaultAvailability: DayAvailability[] = [
  { day: "Sunday", dayName: "S", isOpen: false, timeRanges: [] },
  { day: "Monday", dayName: "M", isOpen: false, timeRanges: [] },
  { day: "Tuesday", dayName: "T", isOpen: false, timeRanges: [] },
  { day: "Wednesday", dayName: "W", isOpen: false, timeRanges: [] },
  { day: "Thursday", dayName: "T", isOpen: false, timeRanges: [] },
  { day: "Friday", dayName: "F", isOpen: false, timeRanges: [] },
  { day: "Saturday", dayName: "S", isOpen: false, timeRanges: [] },
];

export default function ManageAvailabilityScreen() {

  const [availability, setAvailability] =
    useState<DayAvailability[]>(defaultAvailability);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showPicker, setShowPicker] = useState<{
    dayIndex: number;
    rangeId: string;
    field: "startTime" | "endTime";
  } | null>(null);
  const [tempTime, setTempTime] = useState<Date | null>(null);

  const loadAvailability = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getExpertAvailability();
      if (response.success && response.data?.availability) {
        // Add IDs to time ranges if they don't have them (for backward compatibility)
        const availabilityWithIds = response.data.availability.map(
          (day: DayAvailability) => ({
            ...day,
            timeRanges: day.timeRanges.map((range: any) => ({
              ...range,
              id: range.id || Date.now().toString() + Math.random().toString(),
            })),
          })
        );
        setAvailability(availabilityWithIds);
      }
    } catch (error: any) {
      console.error("Error loading availability:", error);
      // If error, use default availability
      setAvailability(defaultAvailability);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const toggleDay = (index: number) => {
    const updated = [...availability];
    updated[index].isOpen = !updated[index].isOpen;
    // If closing the day, clear all time ranges
    if (!updated[index].isOpen) {
      updated[index].timeRanges = [];
    } else if (updated[index].timeRanges.length === 0) {
      // If opening and no ranges exist, add an empty one
      updated[index].timeRanges = [
        {
          id: Date.now().toString(),
          startTime: "",
          endTime: "",
        },
      ];
    }
    setAvailability(updated);
  };

  const addTimeRange = (dayIndex: number) => {
    const updated = [...availability];
    updated[dayIndex].timeRanges.push({
      id: Date.now().toString(),
      startTime: "",
      endTime: "",
    });
    setAvailability(updated);
  };

  const removeTimeRange = (dayIndex: number, rangeId: string) => {
    const updated = [...availability];
    updated[dayIndex].timeRanges = updated[dayIndex].timeRanges.filter(
      (range) => range.id !== rangeId
    );
    setAvailability(updated);
  };

  const timeStringToDate = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours || 9, minutes || 0, 0, 0);
    return date;
  };

  const dateToTimeString = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const openTimePicker = (
    dayIndex: number,
    rangeId: string,
    field: "startTime" | "endTime"
  ) => {
    console.log("Opening time picker:", { dayIndex, rangeId, field });
    const range = availability[dayIndex].timeRanges.find(
      (r) => r.id === rangeId
    );
    const currentTime = range?.[field] || "09:00";
    // If time is empty, use 9 AM as default
    const timeToUse = currentTime || "09:00";
    setTempTime(timeStringToDate(timeToUse));
    setShowPicker({ dayIndex, rangeId, field });
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    console.log("Time change event:", event.type, selectedDate);
    if (Platform.OS === "android") {
      // Android picker closes automatically, so we need to handle both "set" and "dismissed"
      if (showPicker) {
        if (event.type === "set" && selectedDate) {
          const timeString = dateToTimeString(selectedDate);
          console.log("Setting time:", timeString);
          const updated = [...availability];
          const range = updated[showPicker.dayIndex].timeRanges.find(
            (r) => r.id === showPicker.rangeId
          );
          if (range) {
            range[showPicker.field] = timeString;
          }
          setAvailability(updated);
        }
        // Always close the picker after handling
        setShowPicker(null);
      }
    } else if (Platform.OS === "ios") {
      // For iOS, update tempTime as user scrolls
      if (selectedDate) {
        setTempTime(selectedDate);
      }
      if (event.type === "dismissed") {
        setShowPicker(null);
        setTempTime(null);
      }
    }
  };

  const handleIOSDone = () => {
    if (tempTime && showPicker) {
      const timeString = dateToTimeString(tempTime);
      const updated = [...availability];
      const range = updated[showPicker.dayIndex].timeRanges.find(
        (r) => r.id === showPicker.rangeId
      );
      if (range) {
        range[showPicker.field] = timeString;
      }
      setAvailability(updated);
    }
    setShowPicker(null);
    setTempTime(null);
  };

  const formatTimeForDisplay = (time: string): string => {
    if (!time || time.trim() === "") return "";
    const [hours, minutes] = time.split(":");
    if (!hours || !minutes) return "";
    const hour = parseInt(hours, 10);
    if (isNaN(hour)) return "";
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const validateTimeRange = (start: string, end: string): boolean => {
    if (!start || !end) return false;
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    return endTotal > startTotal;
  };

  const handleSave = async () => {
    // Validate all time ranges
    for (const day of availability) {
      if (day.isOpen) {
        if (day.timeRanges.length === 0) {
          Alert.alert(
            "Validation Error",
            `Please add at least one time range for ${day.day}`
          );
          return;
        }
        for (const range of day.timeRanges) {
          if (!validateTimeRange(range.startTime, range.endTime)) {
            Alert.alert(
              "Validation Error",
              `Invalid time range for ${day.day}. End time must be after start time.`
            );
            return;
          }
        }
      }
    }

    try {
      setSaving(true);
      // Remove IDs from time ranges before sending to backend (backend doesn't store them)
      const availabilityToSave = availability.map((day) => ({
        day: day.day,
        dayName: day.dayName,
        isOpen: day.isOpen,
        timeRanges: day.timeRanges.map((range) => ({
          startTime: range.startTime,
          endTime: range.endTime,
        })),
      }));

      const response = await apiService.updateExpertAvailability(
        availabilityToSave
      );
      if (response.success) {
        Alert.alert("Success", "Session times updated successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.message || "Failed to update session times"
        );
      }
    } catch (error: any) {
      console.error("Error saving availability:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to save session times. Please try again."
      );
    } finally {
      setSaving(false);
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
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Manage Sessions</Text>
            <View style={styles.headerRight} />
          </View>

          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsText}>
              Set your weekly session times. Toggle each day on/off and add time
              ranges when open. Tap on the time fields to select your session times.
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingText}>Loading session times...</Text>
            </View>
          ) : (
            <>
              {/* Days List */}
              {availability.map((day, dayIndex) => (
                <View key={day.day} style={styles.dayCard}>
                  <View style={styles.dayHeader}>
                    <View style={styles.dayHeaderLeft}>
                      <View
                        style={[
                          styles.dayBadge,
                          day.isOpen && styles.dayBadgeOpen,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayBadgeText,
                            day.isOpen && styles.dayBadgeTextOpen,
                          ]}
                        >
                          {day.dayName}
                        </Text>
                      </View>
                      <Text style={styles.dayName}>{day.day}</Text>
                    </View>
                    <Switch
                      value={day.isOpen}
                      onValueChange={() => toggleDay(dayIndex)}
                      trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                      thumbColor={day.isOpen ? "#FFFFFF" : "#9CA3AF"}
                    />
                  </View>

                  {day.isOpen && (
                    <View style={styles.timeRangesContainer}>
                      <Text style={styles.timeRangesLabel}>Time Ranges:</Text>
                      {day.timeRanges.map((range, rangeIndex) => (
                        <View key={range.id} style={styles.timeRangeRow}>
                          <View style={styles.timeInputContainer}>
                            <Text style={styles.timeInputLabel}>From</Text>
                            <Pressable
                              style={styles.timePickerButton}
                              onPress={() => {
                                console.log("Start time button pressed");
                                openTimePicker(dayIndex, range.id, "startTime");
                              }}
                              android_ripple={{ color: "#E5E7EB" }}
                            >
                              <Text style={styles.timePickerButtonText}>
                                {formatTimeForDisplay(range.startTime) ||
                                  "Select time"}
                              </Text>
                              <Text style={styles.timePickerIcon}>🕐</Text>
                            </Pressable>
                          </View>

                          <View style={styles.timeInputContainer}>
                            <Text style={styles.timeInputLabel}>To</Text>
                            <Pressable
                              style={styles.timePickerButton}
                              onPress={() => {
                                console.log("End time button pressed");
                                openTimePicker(dayIndex, range.id, "endTime");
                              }}
                              android_ripple={{ color: "#E5E7EB" }}
                            >
                              <Text style={styles.timePickerButtonText}>
                                {formatTimeForDisplay(range.endTime) ||
                                  "Select time"}
                              </Text>
                              <Text style={styles.timePickerIcon}>🕐</Text>
                            </Pressable>
                          </View>

                          {day.timeRanges.length > 1 && (
                            <Pressable
                              style={styles.removeButton}
                              onPress={() =>
                                removeTimeRange(dayIndex, range.id)
                              }
                            >
                              <Text style={styles.removeButtonText}>✕</Text>
                            </Pressable>
                          )}
                        </View>
                      ))}

                      <Pressable
                        style={styles.addTimeRangeButton}
                        onPress={() => addTimeRange(dayIndex)}
                      >
                        <Text style={styles.addTimeRangeButtonText}>
                          + Add Time Range
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  {!day.isOpen && <Text style={styles.closedText}>Closed</Text>}
                </View>
              ))}

              {/* Save Button */}
              <Pressable
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Sessions</Text>
                )}
              </Pressable>
            </>
          )}

          <View style={{ height: EXPERT_FOOTER_HEIGHT + 20 }} />
        </ScrollView>
      </LinearGradient>
      <ExpertFooter activeRoute="expert-dashboard" />

      {/* Time Picker Modal/Component - Rendered outside LinearGradient for proper z-index */}
      {showPicker && Platform.OS === "ios" && (
        <Modal
          visible={!!showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowPicker(null);
            setTempTime(null);
          }}
          statusBarTranslucent={false}
          presentationStyle="overFullScreen"
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalOverlayPressable}
              onPress={() => {
                setShowPicker(null);
                setTempTime(null);
              }}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Pressable
                  onPress={() => {
                    setShowPicker(null);
                    setTempTime(null);
                  }}
                  style={styles.modalCancelButton}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
                <Text style={styles.modalTitle}>Select Time</Text>
                <Pressable
                  onPress={handleIOSDone}
                  style={styles.modalDoneButton}
                >
                  <Text style={styles.modalDoneText}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={
                  tempTime ||
                  timeStringToDate(
                    availability[showPicker.dayIndex].timeRanges.find(
                      (r) => r.id === showPicker.rangeId
                    )?.[showPicker.field] || "09:00"
                  )
                }
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={styles.dateTimePicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={timeStringToDate(
            availability[showPicker.dayIndex].timeRanges.find(
              (r) => r.id === showPicker.rangeId
            )?.[showPicker.field] || "09:00"
          )}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: getResponsiveHeight(24),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: getResponsiveFontSize(24),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerRight: {
    width: getResponsiveWidth(40),
  },
  instructionsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveHeight(20),
  },
  instructionsText: {
    fontSize: getResponsiveFontSize(14),
    color: "#4B5563",
    lineHeight: getResponsiveHeight(20),
  },
  dayCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveHeight(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveHeight(12),
  },
  dayHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayBadge: {
    width: getResponsiveWidth(32),
    height: getResponsiveHeight(32),
    borderRadius: getResponsiveBorderRadius(16),
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: getResponsiveWidth(12),
  },
  dayBadgeOpen: {
    backgroundColor: "#10B981",
  },
  dayBadgeText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "bold",
    color: "#6B7280",
  },
  dayBadgeTextOpen: {
    color: "#FFFFFF",
  },
  dayName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "600",
    color: "#1F2937",
  },
  closedText: {
    fontSize: getResponsiveFontSize(14),
    color: "#9CA3AF",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: getResponsiveHeight(8),
  },
  timeRangesContainer: {
    marginTop: getResponsiveHeight(12),
    paddingTop: getResponsiveHeight(12),
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  timeRangesLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "600",
    color: "#374151",
    marginBottom: getResponsiveHeight(12),
  },
  timeRangeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: getResponsiveHeight(12),
    gap: getResponsiveWidth(8),
  },
  timeInputContainer: {
    flex: 1,
  },
  timeInputLabel: {
    fontSize: getResponsiveFontSize(12),
    color: "#6B7280",
    marginBottom: getResponsiveHeight(4),
  },
  timePickerButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: getResponsiveBorderRadius(8),
    padding: getResponsivePadding(12),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timePickerButtonText: {
    fontSize: getResponsiveFontSize(14),
    color: "#1F2937",
    fontWeight: "500",
  },
  timePickerIcon: {
    fontSize: getResponsiveFontSize(16),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalOverlayPressable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: getResponsiveBorderRadius(20),
    borderTopRightRadius: getResponsiveBorderRadius(20),
    paddingBottom: getResponsivePadding(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 50,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: getResponsivePadding(16),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalCancelButton: {
    padding: getResponsivePadding(8),
  },
  modalCancelText: {
    fontSize: getResponsiveFontSize(16),
    color: "#6B7280",
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "600",
    color: "#1F2937",
  },
  modalDoneButton: {
    padding: getResponsivePadding(8),
  },
  modalDoneText: {
    fontSize: getResponsiveFontSize(16),
    color: "#10B981",
    fontWeight: "600",
  },
  dateTimePicker: {
    width: "100%",
    height: getResponsiveHeight(200),
  },
  removeButton: {
    width: getResponsiveWidth(36),
    height: getResponsiveHeight(36),
    borderRadius: getResponsiveBorderRadius(18),
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: getResponsiveHeight(20),
  },
  removeButtonText: {
    fontSize: getResponsiveFontSize(18),
    color: "#DC2626",
    fontWeight: "bold",
  },
  addTimeRangeButton: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#10B981",
    borderStyle: "dashed",
    borderRadius: getResponsiveBorderRadius(8),
    padding: getResponsivePadding(12),
    alignItems: "center",
    marginTop: getResponsiveHeight(8),
  },
  addTimeRangeButtonText: {
    fontSize: getResponsiveFontSize(14),
    color: "#10B981",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#10B981",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    alignItems: "center",
    marginTop: getResponsiveHeight(24),
    marginBottom: getResponsiveHeight(16),
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: getResponsiveHeight(40),
  },
  loadingText: {
    marginTop: getResponsiveHeight(12),
    fontSize: getResponsiveFontSize(14),
    color: "#6B7280",
  },
});
