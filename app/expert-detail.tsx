import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '../src/utils/dimensions';

export default function ExpertDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Mock expert data - in a real app this would come from an API
  const expert = {
    id: 1, 
    name: 'Dr. Anya Sharma',
    title: 'Certified Yoga Master & Wellness Expert',
    specialty: 'Yoga & Meditation',
    experience: '5 years experience',
    rating: 4.9,
    reviews: 156,
    price: '$75',
    sessionPrice: '₹800/session',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
    verified: true,
    about: 'Dr. Anya Sharma is a certified Yoga master with over 5 years of experience dedicated to helping individuals find inner peace and physical well-being through ancient practices. She specializes in Hatha Yoga, Vinyasa Flow, and meditation techniques that transform both body and mind.',
    specialties: ['Hatha Yoga', 'Vinyasa Flow', 'Meditation', 'Pranayama', 'Stress Management'],
    languages: ['English', 'Hindi', 'Sanskrit'],
    education: 'RYT 500-Hour Certified, Masters in Yoga Philosophy from Rishikesh Yoga Institute',
    certifications: ['RYT 500-Hour Certified', 'Meditation Teacher Training', 'Ayurveda Wellness Coach'],
    sessionTypes: ['1-on-1 Private Sessions', 'Group Classes', 'Online Consultations', 'Workshop Facilitation'],
    achievements: ['Featured in Yoga Journal', '1000+ students taught', 'Wellness retreat leader', 'TEDx Speaker on Mindfulness'],
    consultationAreas: ['Stress & Anxiety Management', 'Physical Flexibility', 'Mental Clarity', 'Spiritual Growth', 'Pain Relief'],
    availabilityNote: 'Available Mon-Sat, 9 AM - 6 PM IST'
  };

  const timeSlots = [
    '09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'
  ];

  const dates = [
    { date: '27', day: 'Today', available: true },
    { date: '28', day: 'Tomorrow', available: true },
    { date: '29', day: 'Sun', available: false },
    { date: '30', day: 'Mon', available: true },
    { date: '01', day: 'Tue', available: true },
    { date: '02', day: 'Wed', available: true },
  ];

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5.0,
      comment: 'Amazing yoga sessions! Dr. Anya helped me improve my flexibility and find inner peace.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b2e5?w=50&h=50&fit=crop&crop=face',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Mike Chen',
      rating: 4.8,
      comment: 'Very knowledgeable and patient instructor. The meditation techniques are life-changing.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      date: '1 month ago'
    }
  ];

  const suggestedExperts = [
    {
      id: 2,
      name: 'Dr. Rohan Verma',
      specialty: 'Ayurveda',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Arjun Patel',
      specialty: 'Meditation',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Dr. Priya Singh',
      specialty: 'Nutrition',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Rahul Sharma',
      specialty: 'Fitness',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 6,
      name: 'Dr. Meera Joshi',
      specialty: 'Mental Health',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1594824475520-b1de9d1b7a34?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 7,
      name: 'Vikram Kumar',
      specialty: 'Yoga Therapy',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
    }
  ];

  const handleBackPress = () => {
    router.back();
  };

  const handleBookSession = () => {
    if (selectedDate && selectedTime) {
      // In a real app, this would handle booking logic
      alert(`Session booked with ${expert.name} on ${selectedDate} at ${selectedTime}`);
    } else {
      alert('Please select a date and time');
    }
  };

  return (
    <LinearGradient
        colors={['#37b9a8ff', '#37b9a8ff', '#37b9a8ff']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Image */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: expert.image }} style={styles.headerImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
            locations={[0, 0.5, 1]}
            style={styles.headerGradient}
          >
            <Pressable style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <View style={styles.headerInfo}>
              <View style={styles.expertNameContainer}>
                <Text style={styles.expertNameWhite}>Dr. Anya </Text>
                <Text style={styles.expertNameYellow}>Sharma</Text>
              </View>
              <Text style={styles.expertTitle}>{expert.title}</Text>
              <Text style={styles.headerDescription}>
                Certified yoga instructor specializing in Hatha and Vinyasa Flow with 5+ years of experience helping students find inner peace.
              </Text>
              <View style={styles.expertMeta}>
                <Text style={styles.expertSpecialty}>{expert.specialty}</Text>
                {expert.verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                  </View>
                )}
              </View>
              
              {/* Netflix-style Action Buttons */}
              <View style={styles.actionButtons}>
                <Pressable style={styles.playButton} onPress={handleBookSession}>
                  <Text style={styles.playIcon}>▶</Text>
                  <Text style={styles.playText}>Book Session</Text>
                </Pressable>
                <Pressable style={styles.infoButton}>
                  <Text style={styles.infoIcon}>ⓘ</Text>
                  <Text style={styles.infoText}>More Info</Text>
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>⭐</Text>
            </View>
            <Text style={styles.statNumber}>{expert.rating}</Text>
            <Text style={styles.statLabel}>{expert.reviews} reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>🎯</Text>
            </View>
            <Text style={styles.statNumber}>5 years</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>💰</Text>
            </View>
            <Text style={styles.statNumber}>{expert.sessionPrice}</Text>
            <Text style={styles.statLabel}>Per session</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{expert.about}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Specialties:</Text>
              <Text style={styles.detailValue}>{expert.specialties.join(', ')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Languages:</Text>
              <Text style={styles.detailValue}>{expert.languages.join(', ')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Education:</Text>
              <Text style={styles.detailValue}>{expert.education}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Certifications:</Text>
              <Text style={styles.detailValue}>{expert.certifications.join(', ')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Session Types:</Text>
              <Text style={styles.detailValue}>{expert.sessionTypes.join(', ')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Consultation Areas:</Text>
              <Text style={styles.detailValue}>{expert.consultationAreas.join(', ')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Availability:</Text>
              <Text style={styles.detailValue}>{expert.availabilityNote}</Text>
            </View>
          </View>
        </View>

        {/* Availability Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          
          {/* Date Selection */}
          <Text style={styles.subTitle}>Select Date</Text>
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

          {/* Time Selection */}
          <Text style={styles.subTitle}>Select Time</Text>
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

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews ({expert.reviews})</Text>
            <Pressable>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: review.image }} style={styles.reviewerImage} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        {/* Suggested Experts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Experts</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            pagingEnabled={false}
            decelerationRate="fast"
            snapToInterval={140}
            snapToAlignment="start"
            contentContainerStyle={styles.suggestedScrollContainer}
          >
            {suggestedExperts.map((suggestedExpert) => (
              <Pressable
                key={suggestedExpert.id}
                style={styles.suggestedCard}
                onPress={() => router.push(`/expert-detail?id=${suggestedExpert.id}`)}
              >
                <Image source={{ uri: suggestedExpert.image }} style={styles.suggestedImage} />
                <Text style={styles.suggestedName}>{suggestedExpert.name}</Text>
                <Text style={styles.suggestedSpecialty}>{suggestedExpert.specialty}</Text>
                <Text style={styles.suggestedRating}>⭐ {suggestedExpert.rating}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  headerContainer: {
    height: getResponsiveHeight(500),
    position: 'relative',
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getResponsiveHeight(8) },
    shadowOpacity: 0.3,
    shadowRadius: getResponsiveBorderRadius(12),
    elevation: 8,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: getResponsivePadding(50),
    paddingBottom: getResponsivePadding(40),
    paddingHorizontal: getResponsivePadding(24),
  },
  backButton: {
    width: getResponsiveWidth(44),
    height: getResponsiveHeight(44),
    borderRadius: getResponsiveBorderRadius(22),
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getResponsiveHeight(4) },
    shadowOpacity: 0.4,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 6,
  },
  backArrow: {
    fontSize: getResponsiveFontSize(20),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerInfo: {
    alignItems: 'flex-start',
  },
  expertName: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: getResponsiveMargin(6),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(3) },
    textShadowRadius: getResponsiveBorderRadius(6),
  },
  expertNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(6),
  },
  expertNameWhite: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(3) },
    textShadowRadius: getResponsiveBorderRadius(6),
  },
  expertNameYellow: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    color: '#F59E0B',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(3) },
    textShadowRadius: getResponsiveBorderRadius(6),
  },
  expertTitle: {
    fontSize: getResponsiveFontSize(18),
    color: '#F59E0B',
    fontWeight: '600',
    marginBottom: getResponsiveMargin(8),
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(2) },
    textShadowRadius: getResponsiveBorderRadius(4),
  },
  headerDescription: {
    fontSize: getResponsiveFontSize(16),
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: getResponsiveHeight(22),
    marginBottom: getResponsiveMargin(12),
    maxWidth: '90%',
  },
  expertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveWidth(12),
  },
  expertSpecialty: {
    fontSize: getResponsiveFontSize(18),
    color: '#F59E0B',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(2) },
    textShadowRadius: getResponsiveBorderRadius(4),
  },
  verifiedBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(12),
  },
  verifiedText: {
    fontSize: getResponsiveFontSize(12),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getResponsiveMargin(20),
    gap: getResponsiveWidth(16),
  },
  playButton: {
    backgroundColor: '#14B8A6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(24),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(6),
    borderWidth: 2,
    borderColor: '#F59E0B',
    minWidth: getResponsiveWidth(140),
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
    marginRight: getResponsiveMargin(8),
  },
  playText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoButton: {
    backgroundColor: 'rgba(109, 109, 110, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(6),
    borderWidth: 2,
    borderColor: '#F59E0B',
    minWidth: getResponsiveWidth(120),
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
    marginRight: getResponsiveMargin(8),
  },
  infoText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: getResponsiveMargin(20),
    marginTop: getResponsiveMargin(20),
    borderRadius: getResponsiveBorderRadius(20),
    paddingVertical: getResponsivePadding(24),
    paddingHorizontal: getResponsivePadding(20),
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: getResponsiveHeight(8) },
    shadowOpacity: 0.3,
    shadowRadius: getResponsiveBorderRadius(20),
    elevation: 12,
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: getResponsiveWidth(32),
    height: getResponsiveHeight(32),
    borderRadius: getResponsiveBorderRadius(16),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  statIcon: {
    fontSize: getResponsiveFontSize(16),
  },
  statNumber: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: getResponsiveMargin(4),
  },
  statLabel: {
    fontSize: getResponsiveFontSize(12),
    color: '#666666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: getResponsiveHeight(30),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: getResponsiveMargin(16),
  },
  section: {
    paddingHorizontal: getResponsivePadding(20),
    paddingTop: getResponsivePadding(32),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(16),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: getResponsiveMargin(16),
  },
  seeAllText: {
    fontSize: getResponsiveFontSize(14),
    color: '#F59E0B',
    fontWeight: '600',
  },
  aboutText: {
    fontSize: getResponsiveFontSize(16),
    color: '#333333',
    lineHeight: getResponsiveHeight(24),
    marginBottom: getResponsiveMargin(20),
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  detailRow: {
    marginBottom: getResponsiveMargin(12),
  },
  detailLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: getResponsiveMargin(4),
  },
  detailValue: {
    fontSize: getResponsiveFontSize(14),
    color: '#333333',
    lineHeight: getResponsiveHeight(20),
  },
  subTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: getResponsiveMargin(12),
    marginTop: getResponsiveMargin(8),
  },
  datesContainer: {
    marginBottom: getResponsiveMargin(24),
  },
  dateCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: getResponsiveBorderRadius(12),
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(16),
    marginRight: getResponsiveMargin(12),
    alignItems: 'center',
    minWidth: getResponsiveWidth(70),
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  dateCardDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  dateCardSelected: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  dateNumber: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: getResponsiveMargin(4),
  },
  dateDay: {
    fontSize: getResponsiveFontSize(12),
    color: '#666666',
    fontWeight: '500',
  },
  dateTextDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveWidth(12),
  },
  timeSlot: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(20),
    borderRadius: getResponsiveBorderRadius(20),
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  timeSlotSelected: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  timeSlotText: {
    fontSize: getResponsiveFontSize(14),
    color: '#333333',
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveMargin(16),
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(12),
  },
  reviewerImage: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    marginRight: getResponsiveMargin(12),
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: '#333333',
    marginBottom: getResponsiveMargin(4),
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveWidth(12),
  },
  reviewRating: {
    fontSize: getResponsiveFontSize(12),
    color: '#FFD700',
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: getResponsiveFontSize(12),
    color: '#666666',
  },
  reviewComment: {
    fontSize: getResponsiveFontSize(14),
    color: '#333333',
    lineHeight: getResponsiveHeight(20),
  },
  suggestedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    marginRight: getResponsiveMargin(16),
    alignItems: 'center',
    width: getResponsiveWidth(120),
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  suggestedImage: {
    width: getResponsiveWidth(60),
    height: getResponsiveHeight(60),
    borderRadius: getResponsiveBorderRadius(30),
    marginBottom: getResponsiveMargin(12),
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  suggestedName: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(4),
  },
  suggestedSpecialty: {
    fontSize: getResponsiveFontSize(12),
    color: '#666666',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  suggestedRating: {
    fontSize: getResponsiveFontSize(12),
    color: '#FFD700',
    fontWeight: 'bold',
  },
  suggestedScrollContainer: {
    paddingRight: getResponsivePadding(20),
  },
  bottomSpacer: {
    height: getResponsiveHeight(100),
  },
  bookingFooter: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(16),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  bookButton: {
    borderRadius: getResponsiveBorderRadius(12),
    overflow: 'hidden',
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonGradient: {
    paddingVertical: getResponsivePadding(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: getResponsiveBorderRadius(12),
  },
  bookButtonText: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});