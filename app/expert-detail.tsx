import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, StatusBar } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/utils/colors';

export default function ExpertDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Mock expert data - in a real app this would come from an API
  const expert = {
    id: 1,
    name: 'Dr. Anya Sharma',
    specialty: 'Yoga',
    experience: '5 years experience',
    rating: 4.9,
    reviews: 156,
    price: '$75',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
    verified: true,
    about: 'Dr. Anya Sharma is a certified Yoga master with over 5 years of experience dedicated to helping individuals find inner peace and physical well-being through ancient practices. She specializes in Hatha Yoga, Vinyasa Flow, and meditation techniques.',
    specialties: ['Hatha Yoga', 'Vinyasa Flow', 'Meditation', 'Pranayama'],
    languages: ['English', 'Hindi', 'Sanskrit'],
    education: 'RYT 500-Hour Certified, Masters in Yoga Philosophy',
    achievements: ['Featured in Yoga Journal', '1000+ students taught', 'Wellness retreat leader']
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Image */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: expert.image }} style={styles.headerImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.headerGradient}
          >
            <Pressable style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <View style={styles.headerInfo}>
              <Text style={styles.expertName}>{expert.name}</Text>
              <View style={styles.expertMeta}>
                <Text style={styles.expertSpecialty}>{expert.specialty}</Text>
                {expert.verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>⭐ {expert.rating}</Text>
            <Text style={styles.statLabel}>{expert.reviews} reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{expert.experience}</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{expert.price}</Text>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

      {/* Book Session Button */}
      <View style={styles.bookingFooter}>
        <Pressable
          style={[styles.bookButton, (!selectedDate || !selectedTime) && styles.bookButtonDisabled]}
          onPress={handleBookSession}
        >
          <LinearGradient
            colors={selectedDate && selectedTime ? [colors.sageGreen, '#8BB085'] : ['#CCC', '#AAA']}
            style={styles.bookButtonGradient}
          >
            <Text style={styles.bookButtonText}>Book Session</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    height: 300,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerInfo: {
    alignItems: 'flex-start',
  },
  expertName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  expertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expertSpecialty: {
    fontSize: 16,
    color: colors.royalGold,
    fontWeight: '600',
  },
  verifiedBadge: {
    backgroundColor: colors.sageGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: 'bold',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.charcoalGray,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.lightMistTeal,
    marginHorizontal: 16,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.royalGold,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 16,
    color: colors.charcoalGray,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: colors.lightMistTeal,
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: colors.charcoalGray,
    lineHeight: 20,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.deepTeal,
    marginBottom: 12,
    marginTop: 8,
  },
  datesContainer: {
    marginBottom: 24,
  },
  dateCard: {
    backgroundColor: colors.warmGray,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 1,
    borderColor: colors.lightMistTeal,
  },
  dateCardDisabled: {
    backgroundColor: colors.lightMistTeal,
    opacity: 0.5,
  },
  dateCardSelected: {
    backgroundColor: colors.sageGreen,
    borderColor: colors.sageGreen,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  dateDay: {
    fontSize: 12,
    color: colors.charcoalGray,
    fontWeight: '500',
  },
  dateTextDisabled: {
    color: colors.charcoalGray,
  },
  dateTextSelected: {
    color: colors.white,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    backgroundColor: colors.warmGray,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightMistTeal,
  },
  timeSlotSelected: {
    backgroundColor: colors.sageGreen,
    borderColor: colors.sageGreen,
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.charcoalGray,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: colors.white,
  },
  reviewCard: {
    backgroundColor: colors.warmGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewRating: {
    fontSize: 12,
    color: colors.royalGold,
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 12,
    color: colors.charcoalGray,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.charcoalGray,
    lineHeight: 20,
  },
  suggestedCard: {
    backgroundColor: colors.warmGray,
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    width: 120,
  },
  suggestedImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  suggestedName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.deepTeal,
    textAlign: 'center',
    marginBottom: 4,
  },
  suggestedSpecialty: {
    fontSize: 12,
    color: colors.charcoalGray,
    textAlign: 'center',
    marginBottom: 8,
  },
  suggestedRating: {
    fontSize: 12,
    color: colors.royalGold,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 100,
  },
  bookingFooter: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightMistTeal,
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
});