import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function PersonDetailScreen() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data for the expert - in real app this would come from route params
  const expertData = {
    id: 1,
    name: 'Dr. Anya Sharma',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
    specialization: 'Yoga & Mindfulness Expert',
    experience: '8+ years',
    rating: 4.9,
    totalReviews: 245,
    languages: ['English', 'Hindi', 'Sanskrit'],
    location: 'Mumbai, India',
    about: 'Dr. Anya Sharma is a certified yoga instructor and mindfulness coach with over 8 years of experience. She specializes in Hatha Yoga, Vinyasa Flow, and meditation practices. Her holistic approach combines traditional yogic wisdom with modern wellness techniques.',
    qualifications: [
      'Certified Yoga Instructor (RYT 500)',
      'Master in Yoga Philosophy',
      'Mindfulness Based Stress Reduction (MBSR)',
      'Ayurveda Lifestyle Consultant'
    ],
    services: [
      { name: 'Yoga Session', duration: '60 min', price: '₹800' },
      { name: 'Meditation Class', duration: '45 min', price: '₹600' },
      { name: 'Personal Consultation', duration: '30 min', price: '₹500' }
    ],
    availability: [
      { day: 'Monday', slots: ['9:00 AM', '11:00 AM', '3:00 PM', '5:00 PM'] },
      { day: 'Tuesday', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
      { day: 'Wednesday', slots: ['9:00 AM', '11:00 AM', '3:00 PM', '5:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
      { day: 'Friday', slots: ['9:00 AM', '11:00 AM', '3:00 PM'] },
      { day: 'Saturday', slots: ['10:00 AM', '12:00 PM'] }
    ],
    reviews: [
      {
        id: 1,
        userName: 'Priya Singh',
        rating: 5,
        comment: 'Excellent session! Dr. Anya\'s guidance was very helpful for my stress management.',
        date: 'Oct 2, 2024'
      },
      {
        id: 2,
        userName: 'Rahul Kumar',
        rating: 5,
        comment: 'Amazing yoga techniques. Very professional and knowledgeable.',
        date: 'Sep 28, 2024'
      }
    ]
  };

  const handleBookSession = () => {
    // Navigate to booking screen
    router.push('/booking');
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }

    return stars.join('');
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            {/* About Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.aboutText}>{expertData.about}</Text>
            </View>

            {/* Qualifications */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Qualifications</Text>
              {expertData.qualifications.map((qualification, index) => (
                <View key={index} style={styles.qualificationItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.qualificationText}>{qualification}</Text>
                </View>
              ))}
            </View>

            {/* Services */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Services</Text>
              {expertData.services.map((service, index) => (
                <LinearGradient
                  key={index}
                  colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.serviceCard}
                >
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDuration}>{service.duration}</Text>
                  </View>
                  <Text style={styles.servicePrice}>{service.price}</Text>
                </LinearGradient>
              ))}
            </View>
          </View>
        );

      case 'availability':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Weekly Availability</Text>
            {expertData.availability.map((dayData, index) => (
              <View key={index} style={styles.availabilityDay}>
                <Text style={styles.dayName}>{dayData.day}</Text>
                <View style={styles.slotsContainer}>
                  {dayData.slots.map((slot, slotIndex) => (
                    <View key={slotIndex} style={styles.timeSlot}>
                      <Text style={styles.slotText}>{slot}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews ({expertData.totalReviews})</Text>
              <View style={styles.ratingOverview}>
                <Text style={styles.ratingNumber}>{expertData.rating}</Text>
                <Text style={styles.stars}>{renderStars(expertData.rating)}</Text>
              </View>
            </View>
            
            {expertData.reviews.map((review) => (
              <LinearGradient
                key={review.id}
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.reviewCard}
              >
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.userName}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewStars}>{renderStars(review.rating)}</Text>
                <Text style={styles.reviewText}>{review.comment}</Text>
              </LinearGradient>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#2DD4BF', '#14B8A6', '#0D9488']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Expert Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Expert Profile Card */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.profileCard}
        >
          <Image source={{ uri: expertData.image }} style={styles.expertImage} />
          <Text style={styles.expertName}>{expertData.name}</Text>
          <Text style={styles.specialization}>{expertData.specialization}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{expertData.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{expertData.experience}</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{expertData.totalReviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>{expertData.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>💬</Text>
              <Text style={styles.infoText}>{expertData.languages.join(', ')}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          {['overview', 'availability', 'reviews'].map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTabButton
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Book Session Button */}
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.bookButton}
        >
          <Pressable
            style={styles.bookButtonPress}
            onPress={handleBookSession}
          >
            <Text style={styles.bookButtonText}>Book Session</Text>
          </Pressable>
        </LinearGradient>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  expertImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  expertName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  specialization: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activeTabText: {
    color: '#0D9488',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  qualificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#FFD700',
    marginRight: 12,
    marginTop: 2,
  },
  qualificationText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
    lineHeight: 22,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  availabilityDay: {
    marginBottom: 16,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  slotText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  stars: {
    fontSize: 16,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  reviewDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  reviewStars: {
    fontSize: 14,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  bookButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    marginTop: 20,
  },
  bookButtonPress: {
    padding: 18,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomSpacer: {
    height: 100,
  },
});