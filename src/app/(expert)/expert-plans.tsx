import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  Pressable,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import ExpertFooter from "@/components/ExpertFooter";
import { apiService, handleApiError } from "@/services/apiService";
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsivePadding,
  getResponsiveWidth,
} from "@/utils/dimensions";

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
  createdAt?: string;
  scheduledDate?: string;
  scheduledTime?: string;
};

const PLAN_TYPES = [
  { id: "single", label: "Single Class" },
  { id: "monthly", label: "Monthly Subscription" },
];

const SESSION_FORMAT_OPTIONS: Array<{
  id: "one-on-one" | "one-to-many";
  label: string;
}> = [
  { id: "one-on-one", label: "One-on-One" },
  { id: "one-to-many", label: "Group Session" },
];

const DURATION_OPTIONS = [30, 45, 60, 90, 120];

export default function ExpertPlansScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    type: "single" as "single" | "monthly",
    sessionClassType: "",
    sessionFormat: "one-on-one" as "one-on-one" | "one-to-many",
    price: "",
    duration: "60",
    classesPerMonth: "4",
    monthlyPrice: "",
    isActive: true,
    scheduledDate: "",
    scheduledTime: "",
  });

  const resetForm = () => {
    setFormState({
      name: "",
      description: "",
      type: "single",
      sessionClassType: "",
      sessionFormat: "one-on-one",
      price: "",
      duration: "60",
      classesPerMonth: "4",
      monthlyPrice: "",
      isActive: true,
      scheduledDate: "",
      scheduledTime: "",
    });
    setEditingPlan(null);
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyPlans();
      const planList =
        response?.data?.plans || response?.plans || response?.data || [];
      setPlans(planList);
    } catch (error) {
      Alert.alert("Error", handleApiError(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPlans();
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowForm(true);
    // Format scheduledDate if it exists
    const formattedDate = plan.scheduledDate 
      ? new Date(plan.scheduledDate).toISOString().split('T')[0]
      : "";
    setFormState({
      name: plan.name,
      description: plan.description || "",
      type: plan.type,
      sessionClassType: plan.sessionClassType || "",
      sessionFormat: plan.sessionFormat || "one-on-one",
      price: String(plan.price ?? ""),
      duration: plan.duration ? String(plan.duration) : "60",
      classesPerMonth: plan.classesPerMonth
        ? String(plan.classesPerMonth)
        : "4",
      monthlyPrice: plan.monthlyPrice ? String(plan.monthlyPrice) : "",
      isActive: plan.isActive,
      scheduledDate: formattedDate,
      scheduledTime: plan.scheduledTime || "",
    });
  };

  const validateForm = () => {
    if (!formState.name.trim()) {
      Alert.alert("Validation Error", "Plan name is required.");
      return false;
    }

    if (formState.type === "single") {
      const priceValue = parseFloat(formState.price);
      const durationValue = parseInt(formState.duration, 10);
      if (isNaN(priceValue) || priceValue <= 0) {
        Alert.alert("Validation Error", "Please enter a valid price.");
        return false;
      }
      if (
        isNaN(durationValue) ||
        durationValue < 30 ||
        durationValue > 240 ||
        durationValue % 15 !== 0
      ) {
        Alert.alert(
          "Validation Error",
          "Please select a valid duration (30-240 minutes)."
        );
        return false;
      }
      // For group sessions, date and time are required
      if (formState.sessionFormat === "one-to-many") {
        if (!formState.scheduledDate) {
          Alert.alert("Validation Error", "Please select a date for the group session.");
          return false;
        }
        if (!formState.scheduledTime) {
          Alert.alert("Validation Error", "Please select a time for the group session.");
          return false;
        }
      }
    } else {
      const monthlyPriceValue = parseFloat(formState.monthlyPrice);
      const classesValue = parseInt(formState.classesPerMonth, 10);
      if (isNaN(monthlyPriceValue) || monthlyPriceValue <= 0) {
        Alert.alert(
          "Validation Error",
          "Please enter a valid monthly subscription price."
        );
        return false;
      }
      if (isNaN(classesValue) || classesValue <= 0) {
        Alert.alert(
          "Validation Error",
          "Please enter the number of classes per month."
        );
        return false;
      }
    }

    return true;
  };

  const handleSavePlan = async () => {
    if (!validateForm()) {
      return;
    }

    const payload: Record<string, any> = {
      name: formState.name.trim(),
      type: formState.type,
      description: formState.description.trim() || undefined,
      sessionClassType: formState.sessionClassType.trim() || undefined,
      sessionFormat: formState.sessionFormat,
    };

    if (formState.type === "single") {
      payload.price = parseFloat(formState.price);
      payload.duration = parseInt(formState.duration, 10);
      // For group sessions, include scheduled date and time
      if (formState.sessionFormat === "one-to-many") {
        payload.scheduledDate = formState.scheduledDate;
        payload.scheduledTime = formState.scheduledTime;
      }
    } else {
      payload.price = parseFloat(formState.monthlyPrice);
      payload.monthlyPrice = parseFloat(formState.monthlyPrice);
      payload.classesPerMonth = parseInt(formState.classesPerMonth, 10);
    }

    try {
      setSaving(true);
      if (editingPlan) {
        await apiService.updatePlan(editingPlan._id, {
          ...payload,
          isActive: formState.isActive,
        });
        Alert.alert("Updated", "Plan updated successfully.");
      } else {
        await apiService.createPlan(payload);
        Alert.alert("Created", "Plan created successfully.");
      }
      resetForm();
      setShowForm(false);
      fetchPlans();
    } catch (error) {
      Alert.alert("Error", handleApiError(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = (plan: Plan) => {
    Alert.alert(
      "Delete Plan",
      `Are you sure you want to delete "${plan.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiService.deletePlan(plan._id);
              fetchPlans();
            } catch (error) {
              Alert.alert("Error", handleApiError(error));
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (plan: Plan) => {
    try {
      await apiService.updatePlan(plan._id, { isActive: !plan.isActive });
      fetchPlans();
    } catch (error) {
      Alert.alert("Error", handleApiError(error));
    }
  };

  const renderPlanPrice = (plan: Plan) => {
    if (plan.type === "monthly") {
      return `₹${plan.monthlyPrice?.toLocaleString() || plan.price}/month`;
    }
    return `₹${plan.price.toLocaleString()} per class`;
  };

  const renderPlanMeta = (plan: Plan) => {
    if (plan.type === "monthly") {
      return `${plan.classesPerMonth} classes / month`;
    }
    return `${plan.duration || 60} min session`;
  };

  const formTitle = editingPlan ? "Edit Plan" : "Create Plan";

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0f766e"
        translucent
      />
      <LinearGradient
        colors={["#0f766e", "#0d9488", "#14b8a6"]}
        style={styles.background}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Plan Management</Text>
              <Text style={styles.subtitle}>
                Design class packs and subscriptions for your clients.
              </Text>
            </View>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>{formTitle}</Text>
                <Text style={styles.sectionHint}>
                  {editingPlan
                    ? "Update the selected plan details."
                    : "Create a new offering for your students."}
                </Text>
              </View>
              <Pressable
                style={styles.toggleFormButton}
                onPress={() => {
                  if (showForm && editingPlan) {
                    resetForm();
                  }
                  setShowForm(!showForm);
                }}
              >
                <Text style={styles.toggleFormButtonText}>
                  {showForm ? "Hide" : "New Plan"}
                </Text>
              </Pressable>
            </View>

            {showForm && (
              <View style={styles.form}>
                <Text style={styles.label}>Plan Type</Text>
                <View style={styles.chipRow}>
                  {PLAN_TYPES.map((type) => (
                    <Pressable
                      key={type.id}
                      style={[
                        styles.chip,
                        formState.type === type.id && styles.chipActive,
                      ]}
                      onPress={() =>
                        setFormState((prev) => ({
                          ...prev,
                          type: type.id as "single" | "monthly",
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          formState.type === type.id && styles.chipTextActive,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.label}>Plan Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Power Yoga Drop-in"
                  placeholderTextColor="#9CA3AF"
                  value={formState.name}
                  onChangeText={(text) =>
                    setFormState((prev) => ({ ...prev, name: text }))
                  }
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe the benefits, target audience, and inclusions."
                  placeholderTextColor="#9CA3AF"
                  value={formState.description}
                  onChangeText={(text) =>
                    setFormState((prev) => ({ ...prev, description: text }))
                  }
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.label}>Specialty / Class Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Power Yoga, Prenatal Yoga"
                  placeholderTextColor="#9CA3AF"
                  value={formState.sessionClassType}
                  onChangeText={(text) =>
                    setFormState((prev) => ({
                      ...prev,
                      sessionClassType: text,
                    }))
                  }
                />

                <Text style={styles.label}>Session Format</Text>
                <View style={styles.chipRow}>
                  {SESSION_FORMAT_OPTIONS.map((option) => (
                    <Pressable
                      key={option.id}
                      style={[
                        styles.chip,
                        formState.sessionFormat === option.id &&
                          styles.chipActive,
                      ]}
                      onPress={() =>
                        setFormState((prev) => ({
                          ...prev,
                          sessionFormat: option.id,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          formState.sessionFormat === option.id &&
                            styles.chipTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {formState.type === "single" ? (
                  <>
                    <Text style={styles.label}>Session Duration</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.horizontalScroller}
                    >
                      {DURATION_OPTIONS.map((option) => (
                        <Pressable
                          key={option}
                          style={[
                            styles.durationChip,
                            formState.duration === String(option) &&
                              styles.durationChipActive,
                          ]}
                          onPress={() =>
                            setFormState((prev) => ({
                              ...prev,
                              duration: String(option),
                            }))
                          }
                        >
                          <Text
                            style={[
                              styles.durationChipText,
                              formState.duration === String(option) &&
                                styles.durationChipTextActive,
                            ]}
                          >
                            {option} min
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>

                    <Text style={styles.label}>Price per Class (₹)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 799"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={formState.price}
                      onChangeText={(text) =>
                        setFormState((prev) => ({ ...prev, price: text }))
                      }
                    />

                    {/* Date and Time Selection for Group Sessions */}
                    {formState.sessionFormat === "one-to-many" && (
                      <>
                        <View style={styles.dateTimeSection}>
                          <Text style={styles.label}>Session Schedule</Text>
                          <Text style={styles.dateTimeHint}>
                            Set the date and time for this group session
                          </Text>
                          
                          <View style={styles.dateTimeColumn}>
                            <Pressable
                              style={[
                                styles.dateTimeCard,
                                formState.scheduledDate && styles.dateTimeCardSelected
                              ]}
                              onPress={() => setShowDatePicker(true)}
                            >
                              <View style={styles.dateTimeIconContainer}>
                                <Text style={styles.dateTimeIcon}>📅</Text>
                              </View>
                              <View style={styles.dateTimeContent}>
                                <Text style={styles.dateTimeLabel}>Date</Text>
                                <Text style={[
                                  styles.dateTimeValue,
                                  !formState.scheduledDate && styles.dateTimePlaceholder
                                ]}>
                                  {formState.scheduledDate 
                                    ? new Date(formState.scheduledDate).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })
                                    : 'Select date'}
                                </Text>
                              </View>
                              <Text style={styles.dateTimeArrow}>›</Text>
                            </Pressable>

                            <Pressable
                              style={[
                                styles.dateTimeCard,
                                formState.scheduledTime && styles.dateTimeCardSelected
                              ]}
                              onPress={() => setShowTimePicker(true)}
                            >
                              <View style={styles.dateTimeIconContainer}>
                                <Text style={styles.dateTimeIcon}>🕐</Text>
                              </View>
                              <View style={styles.dateTimeContent}>
                                <Text style={styles.dateTimeLabel}>Time</Text>
                                <Text style={[
                                  styles.dateTimeValue,
                                  !formState.scheduledTime && styles.dateTimePlaceholder
                                ]}>
                                  {formState.scheduledTime 
                                    ? (() => {
                                        const [hours, minutes] = formState.scheduledTime.split(':').map(Number);
                                        const period = hours >= 12 ? 'PM' : 'AM';
                                        const displayHours = hours % 12 || 12;
                                        return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
                                      })()
                                    : 'Select time'}
                                </Text>
                              </View>
                              <Text style={styles.dateTimeArrow}>›</Text>
                            </Pressable>
                          </View>
                        </View>

                        {Platform.OS === 'ios' ? (
                          <>
                            <Modal
                              visible={showDatePicker}
                              transparent
                              animationType="slide"
                              onRequestClose={() => setShowDatePicker(false)}
                            >
                              <View style={styles.pickerModalContainer}>
                                <View style={styles.pickerModalContent}>
                                  <View style={styles.pickerModalHeader}>
                                    <Pressable onPress={() => setShowDatePicker(false)}>
                                      <Text style={styles.pickerModalCancel}>Cancel</Text>
                                    </Pressable>
                                    <Text style={styles.pickerModalTitle}>Select Date</Text>
                                    <Pressable
                                      onPress={() => setShowDatePicker(false)}
                                    >
                                      <Text style={styles.pickerModalDone}>
                                        Done
                                      </Text>
                                    </Pressable>
                                  </View>
                                  <DateTimePicker
                                    value={formState.scheduledDate ? new Date(formState.scheduledDate) : new Date()}
                                    mode="date"
                                    display="spinner"
                                    minimumDate={new Date()}
                                    onChange={(event, selectedDate) => {
                                      if (selectedDate) {
                                        const dateString = selectedDate.toISOString().split('T')[0];
                                        setFormState((prev) => ({ ...prev, scheduledDate: dateString }));
                                      }
                                    }}
                                    style={styles.pickerIOS}
                                  />
                                </View>
                              </View>
                            </Modal>

                            <Modal
                              visible={showTimePicker}
                              transparent
                              animationType="slide"
                              onRequestClose={() => setShowTimePicker(false)}
                            >
                              <View style={styles.pickerModalContainer}>
                                <View style={styles.pickerModalContent}>
                                  <View style={styles.pickerModalHeader}>
                                    <Pressable onPress={() => setShowTimePicker(false)}>
                                      <Text style={styles.pickerModalCancel}>Cancel</Text>
                                    </Pressable>
                                    <Text style={styles.pickerModalTitle}>Select Time</Text>
                                    <Pressable
                                      onPress={() => setShowTimePicker(false)}
                                    >
                                      <Text style={styles.pickerModalDone}>
                                        Done
                                      </Text>
                                    </Pressable>
                                  </View>
                                  <DateTimePicker
                                    value={formState.scheduledTime 
                                      ? (() => {
                                          const [hours, minutes] = formState.scheduledTime.split(':').map(Number);
                                          const date = new Date();
                                          date.setHours(hours, minutes, 0, 0);
                                          return date;
                                        })()
                                      : new Date()}
                                    mode="time"
                                    display="spinner"
                                    is24Hour={false}
                                    onChange={(event, selectedTime) => {
                                      if (selectedTime) {
                                        const hours = String(selectedTime.getHours()).padStart(2, '0');
                                        const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
                                        setFormState((prev) => ({ ...prev, scheduledTime: `${hours}:${minutes}` }));
                                      }
                                    }}
                                    style={styles.pickerIOS}
                                  />
                                </View>
                              </View>
                            </Modal>
                          </>
                        ) : (
                          <>
                            {showDatePicker && (
                              <DateTimePicker
                                value={formState.scheduledDate ? new Date(formState.scheduledDate) : new Date()}
                                mode="date"
                                display="default"
                                minimumDate={new Date()}
                                onChange={(event, selectedDate) => {
                                  setShowDatePicker(false);
                                  if (event.type === 'set' && selectedDate) {
                                    const dateString = selectedDate.toISOString().split('T')[0];
                                    setFormState((prev) => ({ ...prev, scheduledDate: dateString }));
                                  }
                                }}
                              />
                            )}

                            {showTimePicker && (
                              <DateTimePicker
                                value={formState.scheduledTime 
                                  ? (() => {
                                      const [hours, minutes] = formState.scheduledTime.split(':').map(Number);
                                      const date = new Date();
                                      date.setHours(hours, minutes, 0, 0);
                                      return date;
                                    })()
                                  : new Date()}
                                mode="time"
                                display="default"
                                is24Hour={false}
                                onChange={(event, selectedTime) => {
                                  setShowTimePicker(false);
                                  if (event.type === 'set' && selectedTime) {
                                    const hours = String(selectedTime.getHours()).padStart(2, '0');
                                    const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
                                    setFormState((prev) => ({ ...prev, scheduledTime: `${hours}:${minutes}` }));
                                  }
                                }}
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={styles.label}>Classes per Month</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 8"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={formState.classesPerMonth}
                      onChangeText={(text) =>
                        setFormState((prev) => ({
                          ...prev,
                          classesPerMonth: text,
                        }))
                      }
                    />

                    <Text style={styles.label}>Monthly Price (₹)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 3999"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={formState.monthlyPrice}
                      onChangeText={(text) =>
                        setFormState((prev) => ({
                          ...prev,
                          monthlyPrice: text,
                        }))
                      }
                    />
                  </>
                )}

                {editingPlan && (
                  <View style={styles.switchRow}>
                    <Text style={styles.label}>Plan Active</Text>
                    <Switch
                      value={formState.isActive}
                      onValueChange={(value) =>
                        setFormState((prev) => ({ ...prev, isActive: value }))
                      }
                      thumbColor={formState.isActive ? "#059669" : "#9CA3AF"}
                      trackColor={{ false: "#D1D5DB", true: "#A7F3D0" }}
                    />
                  </View>
                )}

                <Pressable
                  style={[
                    styles.primaryButton,
                    saving && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleSavePlan}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {editingPlan ? "Update Plan" : "Create Plan"}
                    </Text>
                  )}
                </Pressable>

                {editingPlan && (
                  <Pressable style={styles.resetButton} onPress={resetForm}>
                    <Text style={styles.resetButtonText}>Reset Form</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Your Plans</Text>
                <Text style={styles.sectionHint}>
                  Activate at least one plan to make booking easier for clients.
                </Text>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingState}>
                <ActivityIndicator color="#0f766e" />
                <Text style={styles.loadingText}>Loading plans...</Text>
              </View>
            ) : plans.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No plans yet</Text>
                <Text style={styles.emptyDescription}>
                  Create your first plan to start offering curated experiences.
                </Text>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Create Plan</Text>
                </Pressable>
              </View>
            ) : (
              plans.map((plan) => (
                <View key={plan._id} style={styles.planCard}>
                  <View style={styles.planHeader}>
                    <View style={styles.planTitleRow}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text
                        style={[
                          styles.planTypeBadge,
                          plan.type === "monthly"
                            ? styles.planBadgeMonthly
                            : styles.planBadgeSingle,
                        ]}
                      >
                        {plan.type === "monthly" ? "Subscription" : "Single"}
                      </Text>
                    </View>
                    <Pressable
                      style={[
                        styles.statusBadge,
                        plan.isActive
                          ? styles.statusBadgeActive
                          : styles.statusBadgeInactive,
                      ]}
                      onPress={() => handleToggleActive(plan)}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          plan.isActive
                            ? styles.statusBadgeTextActive
                            : styles.statusBadgeTextInactive,
                        ]}
                      >
                        {plan.isActive ? "Active" : "Paused"}
                      </Text>
                    </Pressable>
                  </View>

                  {plan.description && (
                    <Text style={styles.planDescription}>{plan.description}</Text>
                  )}

                  <View style={styles.planMetaRow}>
                    <Text style={styles.planMeta}>{renderPlanPrice(plan)}</Text>
                    <Text style={styles.planMeta}>{renderPlanMeta(plan)}</Text>
                  </View>

                  <View style={styles.planMetaRow}>
                    {plan.sessionClassType && (
                      <Text style={styles.planMeta}>
                        {plan.sessionClassType}
                      </Text>
                    )}
                    {plan.sessionFormat && (
                      <Text style={styles.planMeta}>
                        {plan.sessionFormat === "one-on-one"
                          ? "1:1 format"
                          : "Group format"}
                      </Text>
                    )}
                  </View>

                  <View style={styles.actionRow}>
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleEditPlan(plan)}
                    >
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleToggleActive(plan)}
                    >
                      <Text style={styles.actionButtonText}>
                        {plan.isActive ? "Pause" : "Activate"}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => handleDeletePlan(plan)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={{ height: getResponsiveHeight(100) }} />
        </ScrollView>
      </LinearGradient>
      <ExpertFooter activeRoute="plans" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f766e",
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: getResponsiveHeight(60),
    paddingHorizontal: getResponsiveWidth(20),
    paddingBottom: getResponsiveHeight(160),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveHeight(20),
  },
  title: {
    fontSize: getResponsiveFontSize(26),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: getResponsiveFontSize(14),
    color: "rgba(255,255,255,0.8)",
    marginTop: getResponsiveHeight(6),
  },
  sectionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveHeight(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveHeight(16),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: "700",
    color: "#0f172a",
  },
  sectionHint: {
    fontSize: getResponsiveFontSize(13),
    color: "#475569",
    marginTop: getResponsiveHeight(4),
  },
  toggleFormButton: {
    backgroundColor: "#0f766e",
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(10),
    borderRadius: getResponsiveBorderRadius(10),
  },
  toggleFormButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  form: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: getResponsiveFontSize(14),
    color: "#0f172a",
    fontWeight: "600",
    marginTop: getResponsiveHeight(16),
    marginBottom: getResponsiveHeight(6),
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(14),
    color: "#0f172a",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    minHeight: getResponsiveHeight(100),
    textAlignVertical: "top",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: getResponsiveWidth(10),
  },
  chip: {
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(10),
    borderWidth: 1,
    borderColor: "#CBD5F5",
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: "#F8FAFC",
  },
  chipActive: {
    backgroundColor: "#0f766e",
    borderColor: "#0f766e",
  },
  chipText: {
    color: "#475569",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  horizontalScroller: {
    marginBottom: getResponsiveHeight(10),
  },
  durationChip: {
    marginRight: getResponsiveWidth(10),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(10),
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 1,
    borderColor: "#CBD5F5",
    backgroundColor: "#FFFFFF",
  },
  durationChipActive: {
    borderColor: "#0f766e",
    backgroundColor: "#d1fae5",
  },
  durationChipText: {
    color: "#475569",
    fontWeight: "500",
  },
  durationChipTextActive: {
    color: "#0f172a",
    fontWeight: "700",
  },
  primaryButton: {
    marginTop: getResponsiveHeight(24),
    backgroundColor: "#0f766e",
    borderRadius: getResponsiveBorderRadius(12),
    paddingVertical: getResponsivePadding(14),
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: getResponsiveFontSize(16),
  },
  resetButton: {
    marginTop: getResponsiveHeight(12),
    alignItems: "center",
  },
  resetButtonText: {
    color: "#0f766e",
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: getResponsiveHeight(16),
  },
  loadingState: {
    alignItems: "center",
    paddingVertical: getResponsiveHeight(30),
    gap: getResponsiveHeight(10),
  },
  loadingText: {
    color: "#475569",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: getResponsiveHeight(30),
    paddingHorizontal: getResponsiveWidth(20),
    gap: getResponsiveHeight(12),
  },
  emptyTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "700",
    color: "#0f172a",
  },
  emptyDescription: {
    fontSize: getResponsiveFontSize(14),
    color: "#475569",
    textAlign: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#0f766e",
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(10),
    borderRadius: getResponsiveBorderRadius(10),
    marginTop: getResponsiveHeight(4),
  },
  secondaryButtonText: {
    color: "#0f766e",
    fontWeight: "600",
  },
  dateTimeSection: {
    marginTop: getResponsiveHeight(8),
    marginBottom: getResponsiveHeight(4),
  },
  dateTimeHint: {
    fontSize: getResponsiveFontSize(12),
    color: "#64748B",
    marginBottom: getResponsiveHeight(12),
    marginTop: getResponsiveHeight(-4),
  },
  dateTimeColumn: {
    gap: getResponsiveHeight(12),
  },
  dateTimeCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    minHeight: getResponsiveHeight(70),
  },
  dateTimeCardSelected: {
    borderColor: "#0f766e",
    backgroundColor: "#F0FDFA",
  },
  dateTimeIconContainer: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: getResponsiveWidth(10),
  },
  dateTimeIcon: {
    fontSize: getResponsiveFontSize(20),
  },
  dateTimeContent: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: getResponsiveFontSize(11),
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: getResponsiveHeight(2),
  },
  dateTimeValue: {
    fontSize: getResponsiveFontSize(15),
    color: "#0f172a",
    fontWeight: "600",
  },
  dateTimePlaceholder: {
    color: "#9CA3AF",
    fontWeight: "400",
  },
  dateTimeArrow: {
    fontSize: getResponsiveFontSize(20),
    color: "#94A3B8",
    marginLeft: getResponsiveWidth(4),
  },
  pickerModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  pickerModalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: getResponsiveBorderRadius(20),
    borderTopRightRadius: getResponsiveBorderRadius(20),
    paddingBottom: getResponsivePadding(20),
  },
  pickerModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(16),
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  pickerModalCancel: {
    fontSize: getResponsiveFontSize(16),
    color: "#64748B",
    fontWeight: "500",
  },
  pickerModalTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "600",
    color: "#0f172a",
  },
  pickerModalDone: {
    fontSize: getResponsiveFontSize(16),
    color: "#0f766e",
    fontWeight: "600",
  },
  pickerIOS: {
    width: "100%",
    height: getResponsiveHeight(200),
  },
  planCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveHeight(14),
    backgroundColor: "#FFFFFF",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveHeight(8),
  },
  planTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveWidth(10),
  },
  planName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: "700",
    color: "#0f172a",
  },
  planTypeBadge: {
    paddingHorizontal: getResponsivePadding(10),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(12),
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
  },
  planBadgeSingle: {
    backgroundColor: "#E0F2FE",
    color: "#0369A1",
  },
  planBadgeMonthly: {
    backgroundColor: "#FCE7F3",
    color: "#9D174D",
  },
  statusBadge: {
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(20),
    borderWidth: 1,
  },
  statusBadgeActive: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  statusBadgeInactive: {
    borderColor: "#F87171",
    backgroundColor: "#FEF2F2",
  },
  statusBadgeText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: "600",
  },
  statusBadgeTextActive: {
    color: "#047857",
  },
  statusBadgeTextInactive: {
    color: "#B91C1C",
  },
  planDescription: {
    fontSize: getResponsiveFontSize(14),
    color: "#475569",
    marginBottom: getResponsiveHeight(10),
  },
  planMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: getResponsiveHeight(6),
  },
  planMeta: {
    fontSize: getResponsiveFontSize(13),
    color: "#0f172a",
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: getResponsiveHeight(12),
  },
  actionButton: {
    flex: 1,
    marginRight: getResponsiveWidth(8),
    paddingVertical: getResponsivePadding(10),
    borderRadius: getResponsiveBorderRadius(10),
    borderWidth: 1,
    borderColor: "#CBD5F5",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  deleteButton: {
    paddingVertical: getResponsivePadding(10),
    paddingHorizontal: getResponsivePadding(14),
    borderRadius: getResponsiveBorderRadius(10),
    backgroundColor: "#fee2e2",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#B91C1C",
    fontWeight: "700",
  },
});

