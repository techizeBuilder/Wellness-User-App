import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '@/utils/dimensions';
import { apiService, handleApiError } from '@/services/apiService';
import { initiatePayment, formatAmount } from '@/services/paymentService';
import { getProfileImageWithFallback } from '@/utils/imageHelpers';

type Expert = {
  _id: string;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  hourlyRate?: number;
  profileImage?: string;
  consultationMethods?: string[];
  sessionType?: string[];
  rating?: {
    average?: number;
  };
};

type Appointment = {
  _id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  consultationMethod: string;
  sessionType: string;
  notes?: string;
};

type PlanDetails = {
  _id: string;
  name: string;
  type: "single" | "monthly";
  price: number;
  monthlyPrice?: number;
  classesPerMonth?: number;
  duration?: number;
  sessionFormat?: "one-on-one" | "one-to-many";
};

type PlanSessionSelection = {
  sessionDate: string;
  startTime: string;
  duration: number;
  consultationMethod: string;
  sessionType: string;
};

export default function BookingScreen() {
  const params = useLocalSearchParams();
  
  const [expertId, setExpertId] = useState<string>('');
  const [paramsExtracted, setParamsExtracted] = useState(false);
  const [requestedPlanId, setRequestedPlanId] = useState<string | null>(null);
  const [plans, setPlans] = useState<PlanDetails[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [planSessions, setPlanSessions] = useState<PlanSessionSelection[]>([]);

  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  // Safely extract params in useEffect to avoid bridge serialization issues
  useEffect(() => {
    if (paramsExtracted) {
      return;
    }

    try {
      console.log('Booking screen params:', params);
      
      // Handle params that might be arrays (expo-router behavior)
      const getParam = (key: string): string | undefined => {
        try {
          const value = params[key];
          console.log(`Param ${key}:`, value, typeof value);
          if (value === null || value === undefined) return undefined;
          if (Array.isArray(value)) {
            const first = value[0];
            return first ? String(first) : undefined;
          }
          const str = String(value);
          // Filter out invalid string representations
          if (str === 'null' || str === 'undefined' || str === '') return undefined;
          return str;
        } catch (error) {
          console.error(`Error getting param ${key}:`, error);
          return undefined;
        }
      };
      
      const extractedExpertId = getParam('expertId') || '';
      const extractedMode = getParam('mode');
      const extractedPlanId = getParam('planId');
      
      console.log('Extracted params:', { extractedExpertId, extractedMode });
      
      // Validate expertId before setting state
      if (!extractedExpertId || extractedExpertId.trim() === '') {
        console.error('Expert ID is missing from params');
        Alert.alert('Error', 'Expert ID is required');
        router.back();
        return;
      }

      const isRescheduleAttempt = extractedMode === 'reschedule';

      if (isRescheduleAttempt) {
        Alert.alert(
          'Rescheduling Unavailable',
          'Sessions can no longer be rescheduled. Please cancel your booking and create a new one instead.'
        );
      }

      setExpertId(extractedExpertId);
      setRequestedPlanId(extractedPlanId || null);
      setSelectedPlanId(extractedPlanId || null);
      setParamsExtracted(true);
    } catch (error) {
      console.error('Error extracting params:', error);
      Alert.alert('Error', 'Failed to load booking screen. Please try again.');
      router.back();
    }
  }, [params, paramsExtracted]);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedConsultationMethod, setSelectedConsultationMethod] = useState('');
  const [selectedSessionType, setSelectedSessionType] = useState('');
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingAnim] = useState(new Animated.Value(1));

  const sessionDurations = [30, 60, 90, 120];

const getPlanId = (plan: PlanDetails | null | undefined): string => {
  if (!plan) return '';
  const rawId: any = (plan as any)._id ?? (plan as any).id ?? null;
  if (typeof rawId === 'string') return rawId;
  if (typeof rawId === 'number') return String(rawId);
  if (rawId && typeof rawId === 'object') {
    if (typeof rawId.$oid === 'string') {
      return rawId.$oid;
    }
    if (typeof rawId.toHexString === 'function') {
      const hex = rawId.toHexString();
      if (hex && hex !== '[object Object]') return hex;
    }
    if (typeof rawId.toString === 'function') {
      const str = rawId.toString();
      if (str && str !== '[object Object]') {
        return str;
      }
    }
  }
  return '';
};

  // Generate dates for the next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      
      dates.push({
        date: dateString,
        day: dayNumber,
        dayName,
        fullDate: date
      });
    }
    return dates;
  };

  const dates = generateDates();
  const selectedPlan = useMemo(
    () => plans.find((plan) => getPlanId(plan) === selectedPlanId) || null,
    [plans, selectedPlanId]
  );

  const isPlanBooking = !!selectedPlan;
  const isMonthlyPlan = selectedPlan?.type === "monthly";
  const lockedSessionType = selectedPlan?.sessionFormat;
  const lockedDuration = selectedPlan?.duration;

  useEffect(() => {
    // Only fetch expert data after params are extracted and expertId is available
    if (paramsExtracted && expertId && expertId.trim() !== '') {
      fetchExpertData();
    }
  }, [expertId, paramsExtracted]);

  useEffect(() => {
    if (!paramsExtracted || !expertId || expertId.trim() === '') {
      setPlans([]);
      return;
    }

    let isMounted = true;

    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const response = await apiService.getExpertPlans(expertId);
        const planResponse =
          response?.data?.plans || response?.plans || response?.data || [];
        if (isMounted) {
          setPlans(Array.isArray(planResponse) ? planResponse : []);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        if (isMounted) {
          setPlans([]);
        }
      } finally {
        if (isMounted) {
          setPlansLoading(false);
        }
      }
    };

    fetchPlans();

    return () => {
      isMounted = false;
    };
  }, [expertId, paramsExtracted]);

  useEffect(() => {
    if (!plans.length) {
      setSelectedPlanId(null);
      return;
    }

    setSelectedPlanId((current) => {
      if (current && plans.some((plan) => getPlanId(plan) === current)) {
        return current;
      }

      if (requestedPlanId && plans.some((plan) => getPlanId(plan) === requestedPlanId)) {
        return requestedPlanId;
      }

      return null;
    });
  }, [plans, requestedPlanId]);

  useEffect(() => {
    setPlanSessions([]);
    if (!selectedPlan) {
      setSelectedDuration(60);
      return;
    }

    if (selectedPlan.duration) {
      setSelectedDuration(selectedPlan.duration);
    }

    if (selectedPlan.sessionFormat) {
      setSelectedSessionType(selectedPlan.sessionFormat);
    }
  }, [selectedPlanId, selectedPlan]);

  useEffect(() => {
    if (expert && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate, expert]);

  const fetchExpertData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getExpertProfile(expertId);
      const expertData = response?.data?.expert || response?.expert || response;
      setExpert(expertData);
      
      // Set default consultation method and session type
      if (expertData.consultationMethods && expertData.consultationMethods.length > 0) {
        const allowedMethods = expertData.consultationMethods.filter(
          (method: string) => method?.toLowerCase() !== 'chat'
        );
        setSelectedConsultationMethod(allowedMethods[0] || '');
      }
      if (expertData.sessionType && expertData.sessionType.length > 0) {
        setSelectedSessionType(expertData.sessionType[0]);
      }
    } catch (error) {
      Alert.alert('Error', handleApiError(error));
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlanSession = () => {
    if (!selectedPlan || selectedPlan.type !== "monthly") {
      return;
    }

    if (planSessions.length >= (selectedPlan.classesPerMonth || 0)) {
      Alert.alert(
        "Limit reached",
        "You have already scheduled all classes for this subscription."
      );
      return;
    }

    if (!selectedDate || !selectedTime) {
      Alert.alert("Missing slot", "Please select a date and time first.");
      return;
    }

    if (!selectedConsultationMethod || !selectedSessionType) {
      Alert.alert(
        "Missing format",
        "Please select consultation method and session type."
      );
      return;
    }

    const duplicate = planSessions.find(
      (session) =>
        session.sessionDate === selectedDate && session.startTime === selectedTime
    );
    if (duplicate) {
      Alert.alert(
        "Duplicate slot",
        "This date and time is already part of your plan schedule."
      );
      return;
    }

    const newSession: PlanSessionSelection = {
      sessionDate: selectedDate,
      startTime: selectedTime,
      duration: selectedPlan.duration || selectedDuration,
      consultationMethod: selectedConsultationMethod,
      sessionType: selectedPlan.sessionFormat || selectedSessionType,
    };

    setPlanSessions((prev) => [...prev, newSession]);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleRemovePlanSession = (index: number) => {
    setPlanSessions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const fetchAvailableSlots = async () => {
    if (!expertId || !selectedDate) return;
    
    try {
      setLoadingSlots(true);
      const response = await apiService.getAvailableSlots(expertId, selectedDate);
      let slots = response?.data?.availableSlots || [];
      
      // Filter out past time slots if the selected date is today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateObj = new Date(selectedDate);
      selectedDateObj.setHours(0, 0, 0, 0);
      
      if (selectedDateObj.getTime() === today.getTime()) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        const currentTotal = currentHour * 60 + currentMin;
        
        slots = slots.filter((slot: string) => {
          const [hour, min] = slot.split(':').map(Number);
          const slotTotal = hour * 60 + min;
          return slotTotal >= currentTotal;
        });
      }
      
      setAvailableSlots(slots);
      
      // Reset selected time when the available slots refresh
      if (!slots.includes(selectedTime)) {
        setSelectedTime('');
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatTime = (time: string) => {
    // Convert 24-hour format (HH:MM) to 12-hour format
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const calculatePrice = () => {
    if (selectedPlan) {
      if (selectedPlan.type === "monthly") {
        return selectedPlan.monthlyPrice || selectedPlan.price || 0;
      }
      return selectedPlan.price || 0;
    }
    if (!expert || !expert.hourlyRate) return 0;
    return Math.round((expert.hourlyRate * selectedDuration) / 60);
  };

  const planSessionsRequired = selectedPlan?.classesPerMonth || 0;
  const baseSlotReady =
    !!selectedDate &&
    !!selectedTime &&
    !!selectedConsultationMethod &&
    !!selectedSessionType;
  const planReady = selectedPlan
    ? selectedPlan.type === "monthly"
      ? planSessionsRequired > 0 &&
        planSessions.length === planSessionsRequired &&
        planSessions.every(
          (session) =>
            session.sessionDate &&
            session.startTime &&
            session.consultationMethod &&
            session.sessionType
        )
      : !!selectedDate && !!selectedTime
    : baseSlotReady;
  const isBookDisabled = booking || !planReady;

  const bookingCtaLabel = () => {
    if (selectedPlan) {
      if (selectedPlan.type === "monthly") {
        return `Start Plan • ₹${calculatePrice().toLocaleString()}`;
      }
      return `Book ${selectedPlan.name}`;
    }
    return `Confirm Booking - ₹${calculatePrice()}`;
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleBooking = async () => {
    if (!selectedPlan) {
      if (!selectedDate || !selectedTime || !selectedConsultationMethod || !selectedSessionType) {
        Alert.alert('Missing Information', 'Please fill in all required fields.');
        return;
      }
    } else if (selectedPlan.type === "single") {
      if (!selectedDate || !selectedTime) {
        Alert.alert('Missing Information', 'Please select the date and time for this plan.');
        return;
      }
    } else if (selectedPlan.type === "monthly") {
      if (planSessions.length !== (selectedPlan.classesPerMonth || 0)) {
        Alert.alert(
          'Schedule Pending',
          `Please schedule all ${selectedPlan.classesPerMonth || 0} classes before confirming.`
        );
        return;
      }
    }

    // Animate button press
    Animated.sequence([
      Animated.timing(bookingAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bookingAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      setBooking(true);
      
      let bookingResponse: any;
      let amount = 0;
      let appointmentId: string | undefined;
      let planId: string | undefined;
      
      if (selectedPlan) {
        if (selectedPlan.type === "monthly") {
          bookingResponse = await apiService.createBooking({
            expertId,
            planId: selectedPlan._id,
            planType: selectedPlan.type,
            planSessions: planSessions,
            notes: notes || undefined,
          });

          amount = selectedPlan.monthlyPrice || 0;
          planId = selectedPlan._id;
        } else {
          bookingResponse = await apiService.createBooking({
            expertId,
            planId: selectedPlan._id,
            planType: selectedPlan.type,
            planSessions: [
              {
                sessionDate: selectedDate,
                startTime: selectedTime,
                duration: selectedPlan.duration || selectedDuration,
                consultationMethod: selectedConsultationMethod,
                sessionType: selectedSessionType,
              },
            ],
            notes: notes || undefined,
          });

          amount = selectedPlan.price || 0;
          planId = selectedPlan._id;
          
          // Get appointment ID from response
          if (bookingResponse.data?.appointment?._id) {
            appointmentId = bookingResponse.data.appointment._id;
          } else if (bookingResponse.data?.appointment?.[0]?._id) {
            appointmentId = bookingResponse.data.appointment[0]._id;
          }
        }
      } else {
        // Create new booking
        bookingResponse = await apiService.createBooking({
          expertId,
          sessionDate: selectedDate,
          startTime: selectedTime,
          duration: selectedDuration,
          consultationMethod: selectedConsultationMethod,
          sessionType: selectedSessionType,
          notes: notes || undefined
        });

        // Calculate amount from hourly rate
        const hourlyRate = expert?.hourlyRate || 0;
        amount = Math.round((hourlyRate * selectedDuration) / 60);
        
        // Get appointment ID from response
        if (bookingResponse.data?.appointment?._id) {
          appointmentId = bookingResponse.data.appointment._id;
        }
      }

      // If amount is 0 or no appointment/plan ID, skip payment
      if (amount <= 0) {
        Alert.alert(
          'Booking Successful!',
          'Your booking has been created successfully. Waiting for expert confirmation.',
          [
            {
              text: 'View Bookings',
              onPress: () => router.push('/sessions'),
            },
            { text: 'OK', onPress: () => router.back() },
          ]
        );
        return;
      }

      // Initiate payment
      const paymentResult = await initiatePayment({
        amount,
        currency: 'INR',
        appointmentId,
        planId,
        description: selectedPlan 
          ? `Payment for ${selectedPlan.name}`
          : `Payment for ${selectedDuration}-minute session with ${expert?.firstName} ${expert?.lastName}`
      });

      if (paymentResult.success) {
        Alert.alert(
          'Payment Successful!',
          selectedPlan?.type === "monthly"
            ? `All ${selectedPlan.classesPerMonth || 0} classes have been scheduled and payment completed. Waiting for expert confirmation.`
            : selectedPlan
            ? `${selectedPlan.name} has been booked and payment completed successfully.`
            : `Your ${selectedDuration}-minute session has been booked and payment completed successfully. Waiting for expert confirmation.`,
          [
            {
              text: 'View Bookings',
              onPress: () => router.push('/sessions'),
            },
            { text: 'OK', onPress: () => router.back() },
          ]
        );
      } else {
        // Payment failed or cancelled
        if (paymentResult.error === 'Payment cancelled') {
          Alert.alert(
            'Payment Cancelled',
            'Your booking has been created but payment was cancelled. Please complete the payment to confirm your booking.',
            [
              {
                text: 'Retry Payment',
                onPress: () => {
                  // You can implement retry payment logic here
                  router.push('/sessions');
                },
              },
              { text: 'OK', onPress: () => router.back() },
            ]
          );
        } else {
          Alert.alert(
            'Payment Failed',
            paymentResult.error || 'Payment could not be processed. Your booking has been created but is pending payment.',
            [
              {
                text: 'View Bookings',
                onPress: () => router.push('/sessions'),
              },
              { text: 'OK', onPress: () => router.back() },
            ]
          );
        }
      }
    } catch (error) {
      Alert.alert('Booking Failed', handleApiError(error));
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9', '#e2e8f0']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading expert details...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!expert) {
    return (
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9', '#e2e8f0']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Expert not found</Text>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  const expertName = [expert.firstName, expert.lastName].filter(Boolean).join(' ') || 'Expert';
  const expertImage = getProfileImageWithFallback(expert.profileImage, expertName) || `https://ui-avatars.com/api/?name=${encodeURIComponent(expertName)}&background=37b9a8&color=fff&size=128`;
  const rating = expert.rating?.average || 0;
  const availableConsultationMethods = Array.isArray(expert.consultationMethods)
    ? expert.consultationMethods.filter((method) => method.toLowerCase() !== 'chat')
    : [];

  return (
    <LinearGradient
      colors={['#f8fafc', '#f1f5f9', '#e2e8f0']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Book Session</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Expert Summary Card */}
        <View style={styles.expertCard}>
          <Image source={{ uri: expertImage }} style={styles.expertImage} />
          <View style={styles.expertInfo}>
            <Text style={styles.expertName}>{expertName}</Text>
            <Text style={styles.expertSpecialty}>{expert.specialization || 'Specialist'}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {rating > 0 ? rating.toFixed(1) : 'New'}</Text>
              <Text style={styles.basePrice}>
                {expert.hourlyRate ? `₹${expert.hourlyRate}/hr` : 'Contact for price'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Plan</Text>
          <Text style={styles.planSectionHint}>
            Pick one of the expert&apos;s plans or continue with a standard one-off session.
          </Text>
          {plansLoading ? (
            <View style={styles.planSummaryCard}>
              <ActivityIndicator size="small" color="#10b981" />
              <Text style={styles.planSummaryLoadingText}>Loading plans…</Text>
            </View>
          ) : plans.length > 0 ? (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.planChoiceScrollContent}
                style={styles.planChoiceScroll}
              >
                {plans.map((plan) => {
                  const planId = getPlanId(plan);
                  const active = planId !== '' && selectedPlanId === planId;
                  const priceLabel =
                    plan.type === "monthly"
                      ? `₹${(plan.monthlyPrice || plan.price).toLocaleString()}/month`
                      : `₹${plan.price.toLocaleString()} per class`;
                  const metaLabel =
                    plan.type === "monthly"
                      ? `${plan.classesPerMonth || 0} classes per month`
                      : `${plan.duration || 60} minute session`;
                  return (
                    <Pressable
                      key={planId || plan.name}
                      style={[styles.planChoiceCard, active && styles.planChoiceCardActive]}
                      onPress={() => planId && setSelectedPlanId(planId)}
                      disabled={!planId}
                    >
                      <View
                        style={[
                          styles.planChoiceTypePill,
                          plan.type === "monthly"
                            ? styles.planChoiceTypeMonthly
                            : styles.planChoiceTypeSingle,
                        ]}
                      >
                        <Text style={styles.planChoiceTypeText}>
                          {plan.type === "monthly" ? "Monthly" : "Single"}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.planChoiceTitle,
                          active && styles.planChoiceTitleActive,
                        ]}
                      >
                        {plan.name}
                      </Text>
                      <Text style={styles.planChoiceMeta}>{metaLabel}</Text>
                      <Text
                        style={[
                          styles.planChoicePrice,
                          active && styles.planChoiceTitleActive,
                        ]}
                      >
                        {priceLabel}
                      </Text>
                      {plan.sessionClassType && (
                        <Text style={styles.planChoiceDescription}>
                          Focus: {plan.sessionClassType}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
              {selectedPlan && (
                <View style={styles.planSummaryCard}>
                  <Text style={styles.planSummaryLabel}>Selected Plan</Text>
                  <Text style={styles.planSummaryName}>{selectedPlan.name}</Text>
                  <Text style={styles.planSummaryMeta}>
                    {selectedPlan.type === "monthly"
                      ? `${selectedPlan.classesPerMonth || 0} classes / month`
                      : `${selectedPlan.duration || 60} minute session`}
                  </Text>
                  <Text style={styles.planSummaryPrice}>
                    {selectedPlan.type === "monthly"
                      ? `₹${(selectedPlan.monthlyPrice || selectedPlan.price).toLocaleString()} / month`
                      : `₹${selectedPlan.price.toLocaleString()} per class`}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.planSummaryCard}>
              <Text style={styles.planSummaryLabel}>Plans</Text>
              <Text style={styles.planSummaryEmptyText}>
                This expert hasn’t published plans yet. You can still book a single session.
              </Text>
            </View>
          )}
        </View>

        {/* Consultation Method Selection - Session Format */}
        {availableConsultationMethods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Format</Text>
            <View style={styles.optionsContainer}>
              {availableConsultationMethods.map((method) => {
                const methodLabels: Record<string, string> = {
                  'video': 'Video Call',
                  'audio': 'Audio Call',
                  'in-person': 'In-Person'
                };
                const displayLabel = methodLabels[method] || method.charAt(0).toUpperCase() + method.slice(1);
                return (
                  <Pressable
                    key={method}
                    style={[
                      styles.optionCard,
                      selectedConsultationMethod === method && styles.optionCardSelected
                    ]}
                    onPress={() => setSelectedConsultationMethod(method)}
                  >
                    <Text style={[
                      styles.optionLabel,
                      selectedConsultationMethod === method && styles.optionLabelSelected
                    ]}>
                      {displayLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Session Type Selection */}
        {expert.sessionType && expert.sessionType.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Type</Text>
            <View style={styles.optionsContainer}>
              {expert.sessionType.map((type) => {
                const typeLabels: Record<string, string> = {
                  'one-on-one': 'One-on-One',
                  'one-to-many': 'Group Session'
                };
                const typeDisabled = !!lockedSessionType && type !== lockedSessionType;
                return (
                  <Pressable
                    key={type}
                    style={[
                      styles.optionCard,
                      selectedSessionType === type && styles.optionCardSelected,
                      typeDisabled && styles.optionCardDisabled
                    ]}
                    onPress={() => !typeDisabled && setSelectedSessionType(type)}
                    disabled={typeDisabled}
                  >
                    <Text style={[
                      styles.optionLabel,
                      selectedSessionType === type && styles.optionLabelSelected,
                      typeDisabled && styles.optionLabelDisabled
                    ]}>
                      {typeLabels[type] || type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Session Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Duration</Text>
          {lockedDuration ? (
            <Text style={styles.lockedDurationText}>
              This plan uses fixed {lockedDuration}-minute sessions.
            </Text>
          ) : (
            <View style={styles.durationContainer}>
              {sessionDurations.map((duration) => (
                <Pressable
                  key={duration}
                  style={[
                    styles.durationCard,
                    selectedDuration === duration && styles.durationCardSelected
                  ]}
                  onPress={() => setSelectedDuration(duration)}
                >
                  <Text style={[
                    styles.durationLabel,
                    selectedDuration === duration && styles.durationLabelSelected
                  ]}>
                    {duration} min
                  </Text>
                  {expert.hourlyRate && (
                  <Text style={[
                    styles.durationPrice,
                      selectedDuration === duration && styles.durationPriceSelected
                  ]}>
                      ₹{Math.round((expert.hourlyRate * duration) / 60)}
                  </Text>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
            {dates.map((dateItem, index) => (
              <Pressable
                key={index}
                style={[
                  styles.dateCard,
                  selectedDate === dateItem.date && styles.dateCardSelected
                ]}
                onPress={() => setSelectedDate(dateItem.date)}
              >
                <Text style={[
                  styles.dateNumber,
                  selectedDate === dateItem.date && styles.dateTextSelected
                ]}>
                  {dateItem.day}
                </Text>
                <Text style={[
                  styles.dateDay,
                  selectedDate === dateItem.date && styles.dateTextSelected
                ]}>
                  {dateItem.dayName}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        {selectedDate && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
            {loadingSlots ? (
              <View style={styles.loadingSlotsContainer}>
                <ActivityIndicator size="small" color="#10b981" />
                <Text style={styles.loadingSlotsText}>Loading available slots...</Text>
              </View>
            ) : availableSlots.length > 0 ? (
          <View style={styles.timeSlotsContainer}>
                {availableSlots.map((time) => (
              <Pressable
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTime === time && styles.timeSlotTextSelected
                ]}>
                      {formatTime(time)}
                </Text>
              </Pressable>
            ))}
          </View>
            ) : (
              <Text style={styles.noSlotsText}>No available slots for this date</Text>
            )}
          </View>
        )}

        {isMonthlyPlan && selectedPlan?.classesPerMonth ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Scheduled Classes ({planSessions.length}/{selectedPlan.classesPerMonth || 0})
            </Text>
            <Text style={styles.planSessionsHint}>
              Pick a date and time above, then tap "Add Class" to queue it.
            </Text>
            {planSessions.length === 0 ? (
              <Text style={styles.planSessionsEmpty}>
                No classes scheduled yet. Add each session to finalize your subscription.
              </Text>
            ) : (
              planSessions.map((session, index) => (
                <View key={`${session.sessionDate}-${session.startTime}`} style={styles.planSessionCard}>
                  <View>
                    <Text style={styles.planSessionTitle}>Class {index + 1}</Text>
                    <Text style={styles.planSessionMeta}>
                      {session.sessionDate} • {formatTime(session.startTime)}
                    </Text>
                    <Text style={styles.planSessionMeta}>
                      {session.duration} min • {session.sessionType === "one-on-one" ? "1:1" : "Group"} ({session.consultationMethod})
                    </Text>
                  </View>
                  <Pressable
                    style={styles.planSessionRemove}
                    onPress={() => handleRemovePlanSession(index)}
                  >
                    <Text style={styles.planSessionRemoveText}>Remove</Text>
                  </Pressable>
                </View>
              ))
            )}
            <Pressable
              style={[
                styles.addSessionButton,
                (planSessions.length >= (selectedPlan.classesPerMonth || 0) ||
                  !selectedDate ||
                  !selectedTime) && styles.addSessionButtonDisabled,
              ]}
              onPress={handleAddPlanSession}
              disabled={
                planSessions.length >= (selectedPlan.classesPerMonth || 0) ||
                !selectedDate ||
                !selectedTime
              }
            >
              <Text style={styles.addSessionButtonText}>Add Class</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special requirements or notes..."
            placeholderTextColor="#9ca3af"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Price Summary */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                {selectedPlan
                  ? selectedPlan.type === "monthly"
                    ? `${selectedPlan.classesPerMonth || 0} classes plan`
                    : selectedPlan.name
                  : `Session (${selectedDuration} min)`}
              </Text>
              <Text style={styles.priceValue}>₹{calculatePrice()}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{calculatePrice()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Book Button */}
      <View style={styles.bookingFooter}>
        <Animated.View style={[styles.bookButtonContainer, { transform: [{ scale: bookingAnim }] }]}>
          <Pressable 
            style={[styles.bookButton, isBookDisabled && styles.bookButtonDisabled]} 
            onPress={handleBooking}
            disabled={isBookDisabled}
          >
            {booking ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.bookButtonText}>
                {bookingCtaLabel()}
              </Text>
            )}
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(20),
    paddingTop: getResponsivePadding(50),
    paddingBottom: getResponsivePadding(20),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(4),
    elevation: 2,
  },
  backArrow: {
    fontSize: getResponsiveFontSize(18),
    color: '#374151',
    fontWeight: 'bold',
  },
  backButtonText: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  headerSpacer: {
    width: getResponsiveWidth(40),
  },
  expertCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(20),
    padding: getResponsivePadding(16),
    borderRadius: getResponsiveBorderRadius(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(4),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 4,
  },
  planSummaryCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: getResponsiveBorderRadius(12),
    marginHorizontal: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(20),
    padding: getResponsivePadding(16),
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  planSummaryLoadingText: {
    marginTop: getResponsiveMargin(8),
    color: '#065F46',
    fontSize: getResponsiveFontSize(12),
    textAlign: 'center',
  },
  planSummaryLabel: {
    fontSize: getResponsiveFontSize(12),
    color: '#047857',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  planSummaryName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '700',
    color: '#064E3B',
    marginTop: getResponsiveMargin(4),
  },
  planSummaryMeta: {
    fontSize: getResponsiveFontSize(12),
    color: '#047857',
    marginTop: getResponsiveMargin(2),
  },
  planSummaryPrice: {
    fontSize: getResponsiveFontSize(16),
    color: '#0F172A',
    fontWeight: '700',
    marginTop: getResponsiveMargin(8),
  },
  planSummaryEmptyText: {
    fontSize: getResponsiveFontSize(13),
    color: '#065F46',
    marginTop: getResponsiveMargin(4),
    lineHeight: getResponsiveHeight(18),
  },
  planChoiceScroll: {
    marginVertical: getResponsiveMargin(16),
  },
  planChoiceScrollContent: {
    paddingRight: getResponsivePadding(10),
  },
  planChoiceCard: {
    width: getResponsiveWidth(220),
    marginRight: getResponsiveMargin(12),
    backgroundColor: '#ffffff',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  planChoiceCardActive: {
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  planChoiceTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '700',
    color: '#0f172a',
  },
  planChoiceTitleActive: {
    color: '#047857',
  },
  planChoiceMeta: {
    fontSize: getResponsiveFontSize(12),
    color: '#4b5563',
    marginTop: getResponsiveMargin(4),
  },
  planChoicePrice: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#0f172a',
    marginTop: getResponsiveMargin(8),
  },
  planChoiceTypePill: {
    alignSelf: 'flex-start',
    borderRadius: getResponsiveBorderRadius(999),
    paddingHorizontal: getResponsivePadding(10),
    paddingVertical: getResponsivePadding(4),
    marginBottom: getResponsiveMargin(8),
  },
  planChoiceTypeText: {
    fontSize: getResponsiveFontSize(10),
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planChoiceTypeMonthly: {
    backgroundColor: 'rgba(59,130,246,0.15)',
  },
  planChoiceTypeSingle: {
    backgroundColor: 'rgba(16,185,129,0.15)',
  },
  planChoiceDescription: {
    fontSize: getResponsiveFontSize(11),
    color: '#6b7280',
    marginTop: getResponsiveMargin(6),
  },
  expertImage: {
    width: getResponsiveWidth(60),
    height: getResponsiveHeight(60),
    borderRadius: getResponsiveBorderRadius(30),
    marginRight: getResponsiveMargin(12),
  },
  expertInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  expertName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: getResponsiveMargin(4),
  },
  expertSpecialty: {
    fontSize: getResponsiveFontSize(14),
    color: '#6b7280',
    marginBottom: getResponsiveMargin(8),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: getResponsiveFontSize(12),
    color: '#f59e0b',
    fontWeight: '600',
  },
  basePrice: {
    fontSize: getResponsiveFontSize(12),
    color: '#6b7280',
  },
  section: {
    marginHorizontal: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(24),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: getResponsiveMargin(16),
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveMargin(12),
  },
  optionCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minWidth: getResponsiveWidth(100),
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  optionLabel: {
    fontSize: getResponsiveFontSize(14),
    color: '#1f2937',
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  optionCardDisabled: {
    opacity: 0.6,
  },
  optionLabelDisabled: {
    opacity: 0.6,
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveMargin(12),
  },
  lockedDurationText: {
    fontSize: getResponsiveFontSize(13),
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(10),
  },
  durationCard: {
    flex: 1,
    minWidth: getResponsiveWidth(80),
    backgroundColor: '#ffffff',
    padding: getResponsivePadding(16),
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.05,
    shadowRadius: getResponsiveBorderRadius(4),
    elevation: 2,
  },
  durationCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  durationLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: getResponsiveMargin(4),
  },
  durationLabelSelected: {
    color: '#10b981',
  },
  durationPrice: {
    fontSize: getResponsiveFontSize(12),
    color: '#6b7280',
  },
  durationPriceSelected: {
    color: '#059669',
    fontWeight: 'bold',
  },
  datesContainer: {
    paddingRight: getResponsivePadding(20),
  },
  dateCard: {
    backgroundColor: '#ffffff',
    padding: getResponsivePadding(16),
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginRight: getResponsiveMargin(12),
    minWidth: getResponsiveWidth(80),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.05,
    shadowRadius: getResponsiveBorderRadius(4),
    elevation: 2,
  },
  dateCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  dateNumber: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: getResponsiveMargin(4),
  },
  dateTextSelected: {
    color: '#10b981',
  },
  dateDay: {
    fontSize: getResponsiveFontSize(12),
    color: '#6b7280',
  },
  loadingSlotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
  },
  loadingSlotsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveMargin(12),
  },
  timeSlot: {
    backgroundColor: '#ffffff',
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minWidth: getResponsiveWidth(100),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.05,
    shadowRadius: getResponsiveBorderRadius(4),
    elevation: 2,
  },
  timeSlotSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  timeSlotText: {
    fontSize: getResponsiveFontSize(14),
    color: '#1f2937',
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  noSlotsText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    padding: 20,
  },
  planSessionsHint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: getResponsiveMargin(8),
  },
  planSessionsEmpty: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: getResponsiveMargin(12),
    fontStyle: 'italic',
  },
  planSessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: getResponsivePadding(12),
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: getResponsiveBorderRadius(12),
    marginBottom: getResponsiveMargin(10),
    backgroundColor: '#ffffff',
  },
  planSessionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  planSessionMeta: {
    fontSize: 12,
    color: '#475569',
    marginTop: getResponsiveMargin(2),
  },
  planSessionRemove: {
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderRadius: getResponsiveBorderRadius(8),
    backgroundColor: '#fee2e2',
  },
  planSessionRemoveText: {
    color: '#b91c1c',
    fontWeight: '600',
  },
  addSessionButton: {
    marginTop: getResponsiveMargin(10),
    backgroundColor: '#10b981',
    borderRadius: getResponsiveBorderRadius(10),
    alignItems: 'center',
    paddingVertical: getResponsivePadding(12),
  },
  addSessionButtonDisabled: {
    opacity: 0.5,
  },
  addSessionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  notesInput: {
    backgroundColor: '#ffffff',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    borderWidth: 2,
    borderColor: '#e5e7eb',
    fontSize: getResponsiveFontSize(14),
    color: '#1f2937',
    minHeight: getResponsiveHeight(100),
    textAlignVertical: 'top',
  },
  priceSection: {
    marginHorizontal: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(100),
  },
  priceCard: {
    backgroundColor: '#ffffff',
    padding: getResponsivePadding(20),
    borderRadius: getResponsiveBorderRadius(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(4),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(12),
  },
  priceLabel: {
    fontSize: getResponsiveFontSize(14),
    color: '#6b7280',
  },
  priceValue: {
    fontSize: getResponsiveFontSize(14),
    color: '#1f2937',
    fontWeight: '500',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: getResponsiveMargin(12),
  },
  totalLabel: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#10b981',
  },
  bottomSpacer: {
    height: getResponsiveHeight(40),
  },
  bookingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(20),
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(-4),
    },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 8,
  },
  bookButtonContainer: {
    width: '100%',
  },
  bookButton: {
    backgroundColor: '#10b981',
    paddingVertical: getResponsivePadding(16),
    borderRadius: getResponsiveBorderRadius(12),
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(8),
    },
    shadowOpacity: 0.3,
    shadowRadius: getResponsiveBorderRadius(12),
    elevation: 8,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    fontSize: getResponsiveFontSize(16),
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
