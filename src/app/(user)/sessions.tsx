import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Footer, { FOOTER_HEIGHT } from '@/components/Footer';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '@/utils/dimensions';
import { apiService, handleApiError } from '@/services/apiService';

type Appointment = {
  _id: string;
  expert: {
    _id: string;
    firstName?: string;
    lastName?: string;
    specialization?: string;
    profileImage?: string;
  };
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  consultationMethod: string;
  sessionType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  price: number;
  notes?: string;
  meetingLink?: string;
  cancelledBy?: 'user' | 'expert';
  cancellationReason?: string;
  createdAt: string;
};

export default function SessionsScreen() {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch all bookings without status filter
      const response = await apiService.getUserBookings();
      const bookings = response?.data?.appointments || response?.appointments || [];

      // Sort all bookings by date
      bookings.sort((a: Appointment, b: Appointment) => {
        const dateA = new Date(a.sessionDate).getTime();
        const dateB = new Date(b.sessionDate).getTime();
        if (dateA !== dateB) return dateB - dateA; // Newest first for all
        return b.startTime.localeCompare(a.startTime);
      });

      setAllAppointments(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', handleApiError(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatTime = (timeString: string) => {
    // Convert 24-hour format (HH:MM) to 12-hour format
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const formatConsultationMethod = (method: string) => {
    const labels: Record<string, string> = {
      'video': 'Video Call',
      'audio': 'Audio Call',
      'chat': 'Chat',
      'in-person': 'In-Person'
    };
    return labels[method] || method.charAt(0).toUpperCase() + method.slice(1);
  };

  const handleCancel = async (appointmentId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingId(appointmentId);
              await apiService.updateBookingStatus(appointmentId, 'cancelled', 'Cancelled by user');
              Alert.alert('Success', 'Booking cancelled successfully');
              fetchAllBookings();
            } catch (error) {
              Alert.alert('Error', handleApiError(error));
            } finally {
              setCancellingId(null);
            }
          }
        }
      ]
    );
  };

  const handleReschedule = (appointment: Appointment) => {
    router.push({
      pathname: '/booking',
      params: { expertId: appointment.expert._id }
    });
  };

  const handleJoinSession = (meetingLink?: string) => {
    if (meetingLink) {
      Alert.alert('Join Session', `Opening meeting: ${meetingLink}`);
      // In a real app, this would open the meeting link
    } else {
      Alert.alert('No Meeting Link', 'Meeting link will be provided before the session.');
    }
  };

  const getCurrentSessions = () => {
    let filtered = allAppointments;
    
    if (selectedTab === 'upcoming') {
      filtered = allAppointments.filter(
        (apt) => apt.status === 'pending' || apt.status === 'confirmed'
      );
      // Sort upcoming by date (earliest first)
      filtered.sort((a, b) => {
        const dateA = new Date(a.sessionDate).getTime();
        const dateB = new Date(b.sessionDate).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a.startTime.localeCompare(b.startTime);
      });
    } else if (selectedTab === 'completed') {
      filtered = allAppointments.filter((apt) => apt.status === 'completed');
    } else if (selectedTab === 'cancelled') {
      filtered = allAppointments.filter(
        (apt) => apt.status === 'cancelled' || apt.status === 'rejected'
      );
    }
    
    return filtered;
  };

  const renderSessionCard = (appointment: Appointment) => {
    const isUpcoming = appointment.status === 'pending' || appointment.status === 'confirmed';
    const isCompleted = appointment.status === 'completed';
    const isCancelled = appointment.status === 'cancelled' || appointment.status === 'rejected';

    const expertName = [
      appointment.expert?.firstName,
      appointment.expert?.lastName
    ].filter(Boolean).join(' ') || 'Expert';

    const expertImage = appointment.expert?.profileImage || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(expertName)}&background=37b9a8&color=fff&size=128`;

    const sessionId = appointment._id.substring(appointment._id.length - 6).toUpperCase();

    return (
      <View key={appointment._id} style={styles.sessionCard}>
        <LinearGradient
          colors={['rgba(255, 248, 240, 0.95)', 'rgba(250, 240, 230, 0.9)']}
          style={styles.sessionCardGradient}
        >
          {/* Session Header */}
          <View style={styles.sessionHeader}>
            <Pressable 
              style={styles.expertSection}
              onPress={() => router.push({
                pathname: '/expert-detail',
                params: { id: appointment.expert._id }
              })}
            >
              <Image source={{ uri: expertImage }} style={styles.expertImage} />
              <View style={styles.sessionInfo}>
                <Text style={styles.expertName}>{expertName}</Text>
                <Text style={styles.sessionType}>
                  {formatConsultationMethod(appointment.consultationMethod)} • {appointment.sessionType === 'one-on-one' ? 'One-on-One' : 'Group'}
                </Text>
                <Text style={styles.sessionId}>ID: {sessionId}</Text>
              </View>
            </Pressable>
            <View style={styles.sessionMeta}>
              <Text style={styles.sessionPrice}>₹{appointment.price}</Text>
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
                  {appointment.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Session Details */}
          <View style={styles.sessionDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailText}>{formatDate(appointment.sessionDate)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🕐</Text>
              <Text style={styles.detailText}>{formatTime(appointment.startTime)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>⏱️</Text>
              <Text style={styles.detailText}>{appointment.duration} min</Text>
            </View>
          </View>

          {/* Cancelled Session Reason */}
          {isCancelled && appointment.cancellationReason && (
            <View style={styles.cancelReason}>
              <Text style={styles.cancelReasonText}>
                Reason: {appointment.cancellationReason}
                {appointment.cancelledBy && ` (Cancelled by ${appointment.cancelledBy})`}
              </Text>
            </View>
          )}

          {/* Notes */}
          {appointment.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{appointment.notes}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {isUpcoming && (
              <>
                {appointment.status === 'confirmed' && appointment.meetingLink && (
                  <Pressable 
                    style={styles.joinButton}
                    onPress={() => handleJoinSession(appointment.meetingLink)}
                  >
                    <Text style={styles.joinButtonText}>Join Session</Text>
                  </Pressable>
                )}
                <Pressable 
                  style={styles.rescheduleButton}
                  onPress={() => handleReschedule(appointment)}
                >
                  <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                </Pressable>
                <Pressable 
                  style={[styles.cancelButton, cancellingId === appointment._id && styles.cancelButtonDisabled]}
                  onPress={() => handleCancel(appointment._id)}
                  disabled={cancellingId === appointment._id}
                >
                  {cancellingId === appointment._id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  )}
                </Pressable>
              </>
            )}
            {isCompleted && (
              <View style={styles.completedMessage}>
                <Text style={styles.completedMessageText}>
                  Session completed successfully
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  };

  const upcomingCount = allAppointments.filter(
    apt => apt.status === 'pending' || apt.status === 'confirmed'
  ).length;
  const completedCount = allAppointments.filter(apt => apt.status === 'completed').length;
  const cancelledCount = allAppointments.filter(
    apt => apt.status === 'cancelled' || apt.status === 'rejected'
  ).length;

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
            {upcomingCount} Upcoming • {completedCount} Completed
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['upcoming', 'completed', 'cancelled'].map((tab) => {
          const tabKey = tab as typeof selectedTab;
          const count = tabKey === 'upcoming' ? upcomingCount : 
                       tabKey === 'completed' ? completedCount : cancelledCount;
          return (
            <Pressable
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.activeTab
              ]}
              onPress={() => setSelectedTab(tabKey)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {count > 0 && ` (${count})`}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Sessions List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.sessionsContainer} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchAllBookings(true)}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
        >
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
                  onPress={() => router.push('/(user)/experts')}
                >
                  <Text style={styles.bookButtonText}>Browse Experts</Text>
                </Pressable>
              )}
            </View>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      <Footer activeRoute="sessions" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: getResponsivePadding(50),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveMargin(8),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(2) },
    textShadowRadius: getResponsiveBorderRadius(4),
  },
  headerStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(20),
    alignSelf: 'flex-start',
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: getResponsiveMargin(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: getResponsiveBorderRadius(25),
    padding: getResponsivePadding(4),
    marginBottom: getResponsiveMargin(20),
  },
  tab: {
    flex: 1,
    paddingVertical: getResponsivePadding(12),
    alignItems: 'center',
    borderRadius: getResponsiveBorderRadius(20),
  },
  activeTab: {
    backgroundColor: '#F59E0B',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    fontSize: getResponsiveFontSize(14),
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sessionsContainer: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(20),
  },
  sessionCard: {
    marginBottom: getResponsiveMargin(16),
    borderRadius: getResponsiveBorderRadius(16),
    overflow: 'hidden',
  },
  sessionCardGradient: {
    padding: getResponsivePadding(20),
    borderWidth: 2,
    borderColor: '#FFA726',
    borderRadius: getResponsiveBorderRadius(16),
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(16),
  },
  expertSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expertImage: {
    width: getResponsiveWidth(60),
    height: getResponsiveHeight(60),
    borderRadius: getResponsiveBorderRadius(30),
    marginRight: getResponsiveMargin(16),
    borderWidth: 2,
    borderColor: '#FFA726',
  },
  sessionInfo: {
    flex: 1,
  },
  expertName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: getResponsiveMargin(4),
  },
  sessionType: {
    fontSize: getResponsiveFontSize(14),
    color: '#5D6D7E',
    marginBottom: getResponsiveMargin(2),
  },
  sessionId: {
    fontSize: getResponsiveFontSize(12),
    color: '#85929E',
  },
  sessionMeta: {
    alignItems: 'flex-end',
  },
  sessionPrice: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: getResponsiveMargin(8),
  },
  statusBadge: {
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(12),
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
    fontSize: getResponsiveFontSize(10),
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
    marginBottom: getResponsiveMargin(16),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(12),
  },
  detailItem: {
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: getResponsiveFontSize(16),
    marginBottom: getResponsiveMargin(4),
  },
  detailText: {
    color: '#2C3E50',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
  },
  cancelReason: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(12),
    marginBottom: getResponsiveMargin(16),
  },
  cancelReasonText: {
    color: '#F44336',
    fontSize: getResponsiveFontSize(14),
    textAlign: 'center',
  },
  notesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(12),
    marginBottom: getResponsiveMargin(16),
  },
  notesLabel: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    color: '#374151',
    marginBottom: getResponsiveMargin(4),
  },
  notesText: {
    fontSize: getResponsiveFontSize(14),
    color: '#2C3E50',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: getResponsiveWidth(12),
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#14B8A6',
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: getResponsiveFontSize(14),
  },
  rescheduleButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    alignItems: 'center',
  },
  rescheduleButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: getResponsiveFontSize(14),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    alignItems: 'center',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: getResponsiveFontSize(14),
  },
  completedMessage: {
    flex: 1,
    paddingVertical: getResponsivePadding(12),
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: getResponsiveBorderRadius(8),
  },
  completedMessageText: {
    color: '#2196F3',
    fontWeight: '600',
    fontSize: getResponsiveFontSize(14),
  },
  emptyState: {
    alignItems: 'center',
    padding: getResponsivePadding(40),
    marginTop: getResponsiveMargin(60),
  },
  emptyStateIcon: {
    fontSize: getResponsiveFontSize(64),
    marginBottom: getResponsiveMargin(16),
  },
  emptyStateTitle: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveMargin(8),
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: getResponsiveFontSize(16),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(24),
    lineHeight: getResponsiveHeight(22),
  },
  bookButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: getResponsivePadding(24),
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(25),
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: getResponsiveFontSize(16),
  },
  bottomSpacer: {
    height: FOOTER_HEIGHT + getResponsiveHeight(30),
  },
});
