import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '@/utils/dimensions';

export default function BookingScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('60');
  const [selectedPackage, setSelectedPackage] = useState('single');
  const [bookingAnim] = useState(new Animated.Value(1));

  // Sample expert data - in real app this would come from params/props
  const expert = {
    name: 'Dr. Anya Sharma',
    title: 'Certified Yoga Master & Wellness Expert',
    specialty: 'Yoga & Meditation',
    rating: 4.9,
    price: 800,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
  };

  const timeSlots = [
    '09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'
  ];

  const dates = [
    { date: '27', day: 'Today', dayName: 'Mon', available: true },
    { date: '28', day: 'Tomorrow', dayName: 'Tue', available: true },
    { date: '29', day: 'Sun', dayName: 'Wed', available: false },
    { date: '30', day: 'Mon', dayName: 'Thu', available: true },
    { date: '01', day: 'Tue', dayName: 'Fri', available: true },
    { date: '02', day: 'Wed', dayName: 'Sat', available: true },
  ];

  const sessionDurations = [
    { value: '30', label: '30 min', price: 600 },
    { value: '60', label: '60 min', price: 800 },
    { value: '90', label: '90 min', price: 1100 },
  ];

  const packages = [
    { 
      value: 'single', 
      label: 'Single Session', 
      description: 'One-time session',
      discount: 0,
      popular: false
    },
    { 
      value: 'weekly', 
      label: 'Weekly Package', 
      description: '4 sessions per month',
      discount: 15,
      popular: true
    },
    { 
      value: 'monthly', 
      label: 'Monthly Package', 
      description: '8 sessions per month',
      discount: 25,
      popular: false
    },
  ];

  const calculatePrice = () => {
    const baseDuration = sessionDurations.find(d => d.value === selectedDuration);
    if (!baseDuration) return 0;
    
    const selectedPkg = packages.find(p => p.value === selectedPackage);
    if (!selectedPkg) return baseDuration.price;
    
    const discountedPrice = baseDuration.price * (1 - selectedPkg.discount / 100);
    return Math.round(discountedPrice);
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select both date and time for your session.');
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

    // Show confirmation
    Alert.alert(
      'Booking Confirmed!',
      `Your ${selectedDuration}-minute session with ${expert.name} is scheduled for ${selectedDate} at ${selectedTime}.\n\nTotal Cost: ₹${calculatePrice()}`,
      [
        { text: 'View Details', onPress: () => console.log('View Details') },
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

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
          <Image source={{ uri: expert.image }} style={styles.expertImage} />
          <View style={styles.expertInfo}>
            <Text style={styles.expertName}>{expert.name}</Text>
            <Text style={styles.expertSpecialty}>{expert.specialty}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {expert.rating}</Text>
              <Text style={styles.basePrice}>₹{expert.price}/session</Text>
            </View>
          </View>
        </View>

        {/* Session Package Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Package</Text>
          <View style={styles.packagesContainer}>
            {packages.map((pkg) => (
              <Pressable
                key={pkg.value}
                style={[
                  styles.packageCard,
                  selectedPackage === pkg.value && styles.packageCardSelected,
                  pkg.popular && styles.packageCardPopular
                ]}
                onPress={() => setSelectedPackage(pkg.value)}
              >
                {pkg.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>POPULAR</Text>
                  </View>
                )}
                <Text style={[
                  styles.packageLabel,
                  selectedPackage === pkg.value && styles.packageLabelSelected
                ]}>
                  {pkg.label}
                </Text>
                <Text style={[
                  styles.packageDescription,
                  selectedPackage === pkg.value && styles.packageDescriptionSelected
                ]}>
                  {pkg.description}
                </Text>
                {pkg.discount > 0 && (
                  <View style={styles.discountContainer}>
                    <Text style={styles.discountText}>{pkg.discount}% OFF</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Session Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Duration</Text>
          <View style={styles.durationContainer}>
            {sessionDurations.map((duration) => (
              <Pressable
                key={duration.value}
                style={[
                  styles.durationCard,
                  selectedDuration === duration.value && styles.durationCardSelected
                ]}
                onPress={() => setSelectedDuration(duration.value)}
              >
                <Text style={[
                  styles.durationLabel,
                  selectedDuration === duration.value && styles.durationLabelSelected
                ]}>
                  {duration.label}
                </Text>
                <Text style={[
                  styles.durationPrice,
                  selectedDuration === duration.value && styles.durationPriceSelected
                ]}>
                  ₹{duration.price}
                </Text>
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
                  !dateItem.available && styles.dateCardDisabled,
                  selectedDate === dateItem.date && styles.dateCardSelected
                ]}
                disabled={!dateItem.available}
                onPress={() => setSelectedDate(dateItem.date)}
              >
                <Text style={[
                  styles.dateNumber,
                  !dateItem.available && styles.dateTextDisabled,
                  selectedDate === dateItem.date && styles.dateTextSelected
                ]}>
                  {dateItem.date}
                </Text>
                <Text style={[
                  styles.dateDay,
                  !dateItem.available && styles.dateTextDisabled,
                  selectedDate === dateItem.date && styles.dateTextSelected
                ]}>
                  {dateItem.day}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((time) => (
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
                  {time}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Session ({selectedDuration} min)</Text>
              <Text style={styles.priceValue}>₹{expert.price}</Text>
            </View>
            {selectedPackage !== 'single' && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Package Discount</Text>
                <Text style={styles.discountValue}>
                  -{packages.find(p => p.value === selectedPackage)?.discount}%
                </Text>
              </View>
            )}
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
          <Pressable style={styles.bookButton} onPress={handleBooking}>
            <Text style={styles.bookButtonText}>
              Confirm Booking - ₹{calculatePrice()}
            </Text>
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
  packagesContainer: {
    flexDirection: 'row',
    gap: getResponsiveMargin(12),
  },
  packageCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: getResponsivePadding(16),
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: getResponsiveHeight(2),
    },
    shadowOpacity: 0.05,
    shadowRadius: getResponsiveBorderRadius(4),
    elevation: 2,
  },
  packageCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  packageCardPopular: {
    borderColor: '#f59e0b',
  },
  popularBadge: {
    position: 'absolute',
    top: getResponsivePadding(-8),
    left: getResponsivePadding(12),
    backgroundColor: '#f59e0b',
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(8),
  },
  popularText: {
    fontSize: getResponsiveFontSize(10),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  packageLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: getResponsiveMargin(4),
  },
  packageLabelSelected: {
    color: '#10b981',
  },
  packageDescription: {
    fontSize: getResponsiveFontSize(12),
    color: '#6b7280',
    marginBottom: getResponsiveMargin(8),
  },
  packageDescriptionSelected: {
    color: '#059669',
  },
  discountContainer: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: getResponsivePadding(6),
    paddingVertical: getResponsivePadding(2),
    borderRadius: getResponsiveBorderRadius(4),
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: getResponsiveFontSize(10),
    fontWeight: 'bold',
    color: '#92400e',
  },
  durationContainer: {
    flexDirection: 'row',
    gap: getResponsiveMargin(12),
  },
  durationCard: {
    flex: 1,
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
  dateCardDisabled: {
    backgroundColor: '#f9fafb',
    opacity: 0.5,
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
  dateTextDisabled: {
    color: '#9ca3af',
  },
  dateDay: {
    fontSize: getResponsiveFontSize(12),
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
  priceSection: {
    marginHorizontal: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(100), // Space for fixed button
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
  discountValue: {
    fontSize: getResponsiveFontSize(14),
    color: '#dc2626',
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
  bookButtonText: {
    fontSize: getResponsiveFontSize(16),
    color: '#ffffff',
    fontWeight: 'bold',
  },
});