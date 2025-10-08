import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Footer from '../src/components/Footer';

export default function SessionsScreen() {
  const [selectedTab, setSelectedTab] = useState('upcoming');

  const upcomingSessions = [
    {
      id: 1,
      expertName: 'Dr. Anya Sharma',
      expertImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      sessionType: 'Yoga Session',
      date: 'Today',
      time: '3:30 PM',
      duration: '60 min',
      status: 'upcoming',
      sessionId: 'YG001',
      price: '₹800',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 2,
      expertName: 'Dr. Rohan Verma',
      expertImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      sessionType: 'Ayurveda Consultation',
      date: 'Tomorrow',
      time: '10:00 AM',
      duration: '45 min',
      status: 'upcoming',
      sessionId: 'AY002',
      price: '₹600',
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst'
    },
    {
      id: 3,
      expertName: 'Dr. Priya Kapoor',
      expertImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      sessionType: 'Diet Planning',
      date: 'Oct 3',
      time: '2:00 PM',
      duration: '30 min',
      status: 'upcoming',
      sessionId: 'DT003',
      price: '₹500',
      meetingLink: 'https://meet.google.com/diet-plan-session'
    }
  ];

  const completedSessions = [
    {
      id: 4,
      expertName: 'Dr. Anya Sharma',
      expertImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      sessionType: 'Meditation Session',
      date: 'Sep 28',
      time: '5:00 PM',
      duration: '45 min',
      status: 'completed',
      sessionId: 'MD004',
      price: '₹700',
      rating: 4.9,
      feedback: 'Amazing session! Very peaceful and relaxing.'
    },
    {
      id: 5,
      expertName: 'Arjun Patel',
      expertImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      sessionType: 'Fitness Training',
      date: 'Sep 25',
      time: '6:30 AM',
      duration: '60 min',
      status: 'completed',
      sessionId: 'FT005',
      price: '₹900',
      rating: 4.8,
      feedback: 'Great workout session with excellent guidance.'
    }
  ];

  const cancelledSessions = [
    {
      id: 6,
      expertName: 'Dr. Rohan Verma',
      expertImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      sessionType: 'Ayurveda Consultation',
      date: 'Sep 20',
      time: '11:00 AM',
      duration: '45 min',
      status: 'cancelled',
      sessionId: 'AY006',
      price: '₹600',
      reason: 'Rescheduled by expert'
    }
  ];

  const getCurrentSessions = () => {
    switch (selectedTab) {
      case 'upcoming':
        return upcomingSessions;
      case 'completed':
        return completedSessions;
      case 'cancelled':
        return cancelledSessions;
      default:
        return upcomingSessions;
    }
  };

  const handleJoinSession = (meetingLink: string) => {
    // In a real app, this would open the meeting link
    alert(`Opening meeting: ${meetingLink}`);
  };

  const handleReschedule = (sessionId: string) => {
    // In a real app, this would navigate to reschedule page
    alert(`Reschedule session ${sessionId}`);
  };

  const handleCancel = (sessionId: string) => {
    // In a real app, this would handle cancellation
    alert(`Cancel session ${sessionId}`);
  };

  const handleRateSession = (sessionId: string) => {
    // In a real app, this would open rating modal
    alert(`Rate session ${sessionId}`);
  };

  const renderSessionCard = (session: any) => {
    const isUpcoming = session.status === 'upcoming';
    const isCompleted = session.status === 'completed';
    const isCancelled = session.status === 'cancelled';

    return (
      <View key={session.id} style={styles.sessionCard}>
        <LinearGradient
          colors={['rgba(255, 248, 240, 0.95)', 'rgba(250, 240, 230, 0.9)']}
          style={styles.sessionCardGradient}
        >
          {/* Session Header */}
          <View style={styles.sessionHeader}>
            <Pressable 
              style={styles.expertSection}
              onPress={() => router.push('/person-detail')}
            >
              <Image source={{ uri: session.expertImage }} style={styles.expertImage} />
              <View style={styles.sessionInfo}>
                <Text style={styles.expertName}>{session.expertName}</Text>
                <Text style={styles.sessionType}>{session.sessionType}</Text>
                <Text style={styles.sessionId}>ID: {session.sessionId}</Text>
              </View>
            </Pressable>
            <View style={styles.sessionMeta}>
              <Text style={styles.sessionPrice}>{session.price}</Text>
              <View style={[
                styles.statusBadge,
                isUpcoming && styles.upcomingBadge,
                isCompleted && styles.completedBadge,
                isCancelled && styles.cancelledBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  isUpcoming && styles.upcomingText,
                  isCompleted && styles.completedText,
                  isCancelled && styles.cancelledText
                ]}>
                  {session.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Session Details */}
          <View style={styles.sessionDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailText}>{session.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🕐</Text>
              <Text style={styles.detailText}>{session.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>⏱️</Text>
              <Text style={styles.detailText}>{session.duration}</Text>
            </View>
          </View>

          {/* Completed Session Feedback */}
          {isCompleted && (
            <View style={styles.completedSection}>
              {session.feedback ? (
                <View style={styles.feedbackContainer}>
                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingLabel}>Your Rating:</Text>
                    <View style={styles.starContainer}>
                      <Text style={styles.ratingStars}>⭐ {session.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.feedbackTextContainer}>
                    <Text style={styles.feedbackLabel}>Your Feedback:</Text>
                    <Text style={styles.feedbackText}>"{session.feedback}"</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.noRatingContainer}>
                  <Text style={styles.noRatingText}>Session completed - Rate your experience!</Text>
                </View>
              )}
            </View>
          )}

          {/* Cancelled Session Reason */}
          {isCancelled && session.reason && (
            <View style={styles.cancelReason}>
              <Text style={styles.cancelReasonText}>Reason: {session.reason}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {isUpcoming && (
              <>
                <Pressable 
                  style={styles.joinButton}
                  onPress={() => handleJoinSession(session.meetingLink)}
                >
                  <Text style={styles.joinButtonText}>Join Session</Text>
                </Pressable>
                <Pressable 
                  style={styles.rescheduleButton}
                  onPress={() => handleReschedule(session.sessionId)}
                >
                  <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                </Pressable>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => handleCancel(session.sessionId)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </>
            )}
            {isCompleted && (
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.rateButton}
              >
                <Pressable 
                  style={styles.rateButtonPress}
                  onPress={() => handleRateSession(session.sessionId)}
                >
                  <Text style={styles.rateButtonText}>
                    {session.feedback ? 'Update Rating' : 'Rate Session'}
                  </Text>
                </Pressable>
              </LinearGradient>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#2DD4BF', '#14B8A6', '#0D9488']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Sessions</Text>
        <View style={styles.headerStats}>
          <Text style={styles.statsText}>
            {upcomingSessions.length} Upcoming • {completedSessions.length} Completed
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab
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

      {/* Sessions List */}
      <ScrollView style={styles.sessionsContainer} showsVerticalScrollIndicator={false}>
        {getCurrentSessions().length > 0 ? (
          getCurrentSessions().map((session) => renderSessionCard(session))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📅</Text>
            <Text style={styles.emptyStateTitle}>No {selectedTab} sessions</Text>
            <Text style={styles.emptyStateText}>
              {selectedTab === 'upcoming' 
                ? 'Book a session with an expert to get started!' 
                : `No ${selectedTab} sessions found.`}
            </Text>
            {selectedTab === 'upcoming' && (
              <Pressable 
                style={styles.bookButton}
                onPress={() => router.push('/experts')}
              >
                <Text style={styles.bookButtonText}>Browse Experts</Text>
              </Pressable>
            )}
          </View>
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Footer activeRoute="sessions" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#F59E0B',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  sessionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sessionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sessionCardGradient: {
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFA726',
    borderRadius: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expertSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expertImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FFA726',
  },
  sessionInfo: {
    flex: 1,
  },
  expertName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: '#5D6D7E',
    marginBottom: 2,
  },
  sessionId: {
    fontSize: 12,
    color: '#85929E',
  },
  sessionMeta: {
    alignItems: 'flex-end',
  },
  sessionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: '#4CAF50',
  },
  completedBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
  },
  cancelledBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  upcomingText: {
    color: '#FFFFFF',
  },
  completedText: {
    color: '#2196F3',
  },
  cancelledText: {
    color: '#F44336',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 12,
    borderRadius: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  detailText: {
    color: '#2C3E50',
    fontSize: 12,
    fontWeight: '600',
  },
  feedbackSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedbackText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  cancelReason: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  cancelReasonText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#14B8A6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rescheduleButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rescheduleButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rateButton: {
    flex: 1,
    borderRadius: 12,
    marginTop: 8,
  },
  rateButtonPress: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  completedSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  feedbackContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  starContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingStars: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  feedbackTextContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 12,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  noRatingContainer: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  noRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  bookButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 100,
  },
});
