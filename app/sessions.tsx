import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/utils/colors';

export default function SessionsScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingSessions = [
    {
      id: 1,
      title: 'Morning Yoga Flow',
      instructor: 'Dr. Anya Sharma',
      time: 'Today, 8:00 AM',
      duration: '45 min',
      participants: 12,
      maxParticipants: 15,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop',
      category: 'Yoga',
      price: '$25',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Ayurvedic Consultation',
      instructor: 'Dr. Rohan Verma',
      time: 'Today, 2:00 PM',
      duration: '30 min',
      participants: 1,
      maxParticipants: 1,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop',
      category: 'Ayurveda',
      price: '$50',
      status: 'confirmed'
    },
    {
      id: 3,
      title: 'Meditation Session',
      instructor: 'Arjun Patel',
      time: 'Tomorrow, 6:00 AM',
      duration: '60 min',
      participants: 8,
      maxParticipants: 10,
      image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=120&h=120&fit=crop',
      category: 'Meditation',
      price: '$20',
      status: 'pending'
    }
  ];

  const pastSessions = [
    {
      id: 4,
      title: 'Evening Yoga',
      instructor: 'Dr. Anya Sharma',
      time: 'Yesterday, 6:00 PM',
      duration: '60 min',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&h=120&fit=crop',
      category: 'Yoga',
      status: 'completed'
    },
    {
      id: 5,
      title: 'Diet Planning Session',
      instructor: 'Dr. Priya Kapoor',
      time: 'Last Week',
      duration: '45 min',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop',
      category: 'Diet',
      status: 'completed'
    }
  ];

  const handleBackPress = () => {
    router.back();
  };

  const handleSessionPress = (sessionId: number) => {
    router.push(`/session-detail?id=${sessionId}`);
  };

  const handleBookSession = () => {
    router.push('/experts');
  };

  const renderSessionCard = (session: any) => (
    <Pressable 
      key={session.id} 
      style={styles.sessionCard}
      onPress={() => handleSessionPress(session.id)}
    >
      <Image source={{ uri: session.image }} style={styles.sessionImage} />
      <View style={styles.sessionContent}>
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(session.category) }]}>
            <Text style={styles.categoryText}>{session.category}</Text>
          </View>
        </View>
        <Text style={styles.sessionInstructor}>With {session.instructor}</Text>
        <View style={styles.sessionDetails}>
          <Text style={styles.sessionTime}>{session.time}</Text>
          <Text style={styles.sessionDuration}>• {session.duration}</Text>
          {session.participants && (
            <Text style={styles.sessionParticipants}>• {session.participants}/{session.maxParticipants || session.participants} joined</Text>
          )}
        </View>
        {session.price && (
          <Text style={styles.sessionPrice}>{session.price}</Text>
        )}
        {session.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {session.rating}</Text>
            <Text style={styles.ratingLabel}>Your Rating</Text>
          </View>
        )}
      </View>
      <View style={styles.sessionActions}>
        {activeTab === 'upcoming' ? (
          <View>
            <Pressable style={[styles.actionButton, styles.joinButton]}>
              <Text style={styles.joinButtonText}>Join</Text>
            </Pressable>
            {session.status === 'pending' && (
              <Pressable style={[styles.actionButton, styles.cancelButton]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View>
            <Pressable style={[styles.actionButton, styles.rebookButton]}>
              <Text style={styles.rebookButtonText}>Book Again</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.reviewButton]}>
              <Text style={styles.reviewButtonText}>Review</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Yoga': return colors.sageGreen + '20';
      case 'Ayurveda': return colors.deepTeal + '20';
      case 'Diet': return colors.coralAccent + '20';
      case 'Meditation': return colors.royalGold + '20';
      default: return colors.warmGray;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Sessions</Text>
        <Pressable style={styles.calendarButton}>
          <Text style={styles.calendarIcon}>📅</Text>
        </Pressable>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming ({upcomingSessions.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past Sessions ({pastSessions.length})
          </Text>
        </Pressable>
      </View>

      {/* Sessions List */}
      <ScrollView style={styles.sessionsContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'upcoming' ? (
          <>
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(renderSessionCard)
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📅</Text>
                <Text style={styles.emptyTitle}>No Upcoming Sessions</Text>
                <Text style={styles.emptyDescription}>
                  Book a session with our wellness experts to start your journey.
                </Text>
                <Pressable style={styles.bookSessionButton} onPress={handleBookSession}>
                  <LinearGradient
                    colors={[colors.coralAccent, '#E55A50']}
                    style={styles.bookSessionGradient}
                  >
                    <Text style={styles.bookSessionText}>Book Your First Session</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            )}
          </>
        ) : (
          <>
            {pastSessions.length > 0 ? (
              pastSessions.map(renderSessionCard)
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🕒</Text>
                <Text style={styles.emptyTitle}>No Past Sessions</Text>
                <Text style={styles.emptyDescription}>
                  Your completed sessions will appear here.
                </Text>
              </View>
            )}
          </>
        )}
        
        {/* Quick Stats */}
        {activeTab === 'past' && pastSessions.length > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Your Wellness Journey</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>15</Text>
                <Text style={styles.statLabel}>Total Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12.5</Text>
                <Text style={styles.statLabel}>Hours Practiced</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>4.8</Text>
                <Text style={styles.statLabel}>Avg Rating</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Experts Met</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable style={styles.fab} onPress={handleBookSession}>
        <LinearGradient
          colors={[colors.coralAccent, '#E55A50']}
          style={styles.fabGradient}
        >
          <Text style={styles.fabText}>+</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightMistTeal,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightMistTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.deepTeal,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.deepTeal,
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightMistTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    fontSize: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.warmGray,
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.white,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    color: colors.charcoalGray,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.deepTeal,
    fontWeight: '600',
  },
  sessionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: colors.warmGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.charcoalGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  sessionContent: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.deepTeal,
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.deepTeal,
  },
  sessionInstructor: {
    fontSize: 14,
    color: colors.charcoalGray,
    marginBottom: 6,
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTime: {
    fontSize: 12,
    color: colors.royalGold,
    fontWeight: '600',
  },
  sessionDuration: {
    fontSize: 12,
    color: colors.charcoalGray,
    marginLeft: 4,
  },
  sessionParticipants: {
    fontSize: 12,
    color: colors.sageGreen,
    marginLeft: 4,
  },
  sessionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.coralAccent,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.royalGold,
  },
  ratingLabel: {
    fontSize: 12,
    color: colors.charcoalGray,
  },
  sessionActions: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: colors.sageGreen,
  },
  joinButtonText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: colors.coralAccent + '20',
    borderWidth: 1,
    borderColor: colors.coralAccent,
  },
  cancelButtonText: {
    fontSize: 12,
    color: colors.coralAccent,
    fontWeight: '600',
  },
  rebookButton: {
    backgroundColor: colors.deepTeal,
  },
  rebookButtonText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  reviewButton: {
    backgroundColor: colors.royalGold + '20',
    borderWidth: 1,
    borderColor: colors.royalGold,
  },
  reviewButtonText: {
    fontSize: 12,
    color: colors.royalGold,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.charcoalGray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  bookSessionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookSessionGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  bookSessionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  statsContainer: {
    marginTop: 24,
    padding: 20,
    backgroundColor: colors.lightMistTeal,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.charcoalGray,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: colors.coralAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
  },
});