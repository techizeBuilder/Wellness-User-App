import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function BookingScreen() {
  const params = useLocalSearchParams();
  
  const [expertId, setExpertId] = useState<string>('');
  const [appointmentId, setAppointmentId] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<string | undefined>(undefined);
  const [isReschedule, setIsReschedule] = useState(false);
  const [paramsExtracted, setParamsExtracted] = useState(false);

  const [expert, setExpert] = useState<Expert | null>(null);
  const [existingAppointment, setExistingAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  // Safely extract params in useEffect to avoid bridge serialization issues
  useEffect(() => {
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
      const extractedAppointmentId = getParam('appointmentId');
      const extractedMode = getParam('mode');
      
      console.log('Extracted params:', { extractedExpertId, extractedAppointmentId, extractedMode });
      
      // Validate expertId before setting state
      if (!extractedExpertId || extractedExpertId.trim() === '') {
        console.error('Expert ID is missing from params');
        Alert.alert('Error', 'Expert ID is required');
        router.back();
        return;
      }
      
      setExpertId(extractedExpertId);
      setAppointmentId(extractedAppointmentId);
      setMode(extractedMode);
      setIsReschedule(extractedMode === 'reschedule' && !!extractedAppointmentId);
      setParamsExtracted(true);
    } catch (error) {
      console.error('Error extracting params:', error);
      Alert.alert('Error', 'Failed to load booking screen. Please try again.');
      router.back();
    }
  }, [params]);
  
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

  useEffect(() => {
    // Only fetch expert data after params are extracted and expertId is available
    if (paramsExtracted && expertId && expertId.trim() !== '') {
      fetchExpertData();
    }
  }, [expertId, paramsExtracted]);

  useEffect(() => {
    if (isReschedule && appointmentId) {
      fetchExistingAppointment();
    }
  }, [isReschedule, appointmentId]);

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
        setSelectedConsultationMethod(expertData.consultationMethods[0]);
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

  const fetchExistingAppointment = async () => {
    if (!appointmentId) return;
    
    try {
      const response = await apiService.getUserBookings();
      const appointments = response?.data?.appointments || response?.appointments || [];
      
      // Compare IDs as strings to handle both string and object IDs
      const appointment = appointments.find((apt: any) => {
        const aptId = typeof apt._id === 'string' ? apt._id : String(apt._id);
        return aptId === appointmentId;
      });
      
      if (appointment) {
        setExistingAppointment(appointment);
        // Pre-fill form with existing appointment data
        const date = new Date(appointment.sessionDate);
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        setSelectedDate(dateString);
        setSelectedTime(appointment.startTime);
        setSelectedDuration(appointment.duration);
        setSelectedConsultationMethod(appointment.consultationMethod);
        setSelectedSessionType(appointment.sessionType);
        setNotes(appointment.notes || '');
      } else {
        Alert.alert('Error', 'Appointment not found. Please try again.');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching existing appointment:', error);
      Alert.alert('Error', handleApiError(error));
      router.back();
    }
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
      
      // If rescheduling and the current time slot is still available, keep it selected
      // Otherwise, reset selected time when date changes
      if (!isReschedule || !slots.includes(selectedTime)) {
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
    if (!expert || !expert.hourlyRate) return 0;
    return Math.round((expert.hourlyRate * selectedDuration) / 60);
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedConsultationMethod || !selectedSessionType) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
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
      
      if (isReschedule && appointmentId) {
        // Reschedule existing booking
        const response = await apiService.rescheduleBooking(appointmentId, {
          sessionDate: selectedDate,
          startTime: selectedTime,
          duration: selectedDuration
        });

        Alert.alert(
          'Reschedule Successful!',
          'Your appointment has been rescheduled successfully. Waiting for expert confirmation.',
          [
            { 
              text: 'View Bookings', 
              onPress: () => {
                router.push('/sessions');
              }
            },
            { 
              text: 'OK', 
              onPress: () => router.back()
            }
          ]
        );
      } else {
        // Create new booking
        const response = await apiService.createBooking({
          expertId,
          sessionDate: selectedDate,
          startTime: selectedTime,
          duration: selectedDuration,
          consultationMethod: selectedConsultationMethod,
          sessionType: selectedSessionType,
          notes: notes || undefined
        });

        Alert.alert(
          'Booking Successful!',
          `Your ${selectedDuration}-minute session has been booked successfully. Waiting for expert confirmation.`,
          [
            { 
              text: 'View Bookings', 
              onPress: () => {
                router.push('/sessions');
              }
            },
            { 
              text: 'OK', 
              onPress: () => router.back()
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(isReschedule ? 'Reschedule Failed' : 'Booking Failed', handleApiError(error));
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
  const expertImage = expert.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(expertName)}&background=37b9a8&color=fff&size=128`;
  const rating = expert.rating?.average || 0;

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
          <Text style={styles.headerTitle}>{isReschedule ? 'Reschedule Session' : 'Book Session'}</Text>
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

        {/* Consultation Method Selection - Session Format */}
        {expert.consultationMethods && expert.consultationMethods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Format {isReschedule && '(Cannot be changed)'}</Text>
            <View style={styles.optionsContainer}>
              {expert.consultationMethods.map((method) => {
                const methodLabels: Record<string, string> = {
                  'video': 'Video Call',
                  'audio': 'Audio Call',
                  'chat': 'Chat',
                  'in-person': 'In-Person'
                };
                const displayLabel = methodLabels[method] || method.charAt(0).toUpperCase() + method.slice(1);
                return (
                  <Pressable
                    key={method}
                    style={[
                      styles.optionCard,
                      selectedConsultationMethod === method && styles.optionCardSelected,
                      isReschedule && styles.optionCardDisabled
                    ]}
                    onPress={() => !isReschedule && setSelectedConsultationMethod(method)}
                    disabled={isReschedule}
                  >
                    <Text style={[
                      styles.optionLabel,
                      selectedConsultationMethod === method && styles.optionLabelSelected,
                      isReschedule && styles.optionLabelDisabled
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
            <Text style={styles.sectionTitle}>Session Type {isReschedule && '(Cannot be changed)'}</Text>
            <View style={styles.optionsContainer}>
              {expert.sessionType.map((type) => {
                const typeLabels: Record<string, string> = {
                  'one-on-one': 'One-on-One',
                  'one-to-many': 'Group Session'
                };
                return (
                  <Pressable
                    key={type}
                    style={[
                      styles.optionCard,
                      selectedSessionType === type && styles.optionCardSelected,
                      isReschedule && styles.optionCardDisabled
                    ]}
                    onPress={() => !isReschedule && setSelectedSessionType(type)}
                    disabled={isReschedule}
                  >
                    <Text style={[
                      styles.optionLabel,
                      selectedSessionType === type && styles.optionLabelSelected,
                      isReschedule && styles.optionLabelDisabled
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
              <Text style={styles.priceLabel}>Session ({selectedDuration} min)</Text>
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
            style={[styles.bookButton, booking && styles.bookButtonDisabled]} 
            onPress={handleBooking}
            disabled={booking || !selectedDate || !selectedTime || !selectedConsultationMethod || !selectedSessionType}
          >
            {booking ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.bookButtonText}>
                {isReschedule ? 'Reschedule Session' : `Confirm Booking - ₹${calculatePrice()}`}
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
