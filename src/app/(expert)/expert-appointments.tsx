import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from '@/components/ExpertFooter';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth,
} from '@/utils/dimensions';
import { apiService, handleApiError } from '@/services/apiService';

const { width } = Dimensions.get('window');

type Appointment = {
  _id: string;
  user: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
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
  agoraChannelName?: string;
};

export default function ExpertAppointmentsScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const statusFilters = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

  useEffect(() => {
    fetchAppointments();
  }, [selectedStatus]);

  const fetchAppointments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let status: string | undefined;
      if (selectedStatus !== 'All') {
        status = selectedStatus.toLowerCase();
      }

      const response = await apiService.getExpertBookings({ status });
      const bookings = response?.data?.appointments || [];

      // Sort by date (earliest first for upcoming, newest first for past)
      bookings.sort((a: Appointment, b: Appointment) => {
        const dateA = new Date(a.sessionDate).getTime();
        const dateB = new Date(b.sessionDate).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a.startTime.localeCompare(b.startTime);
      });

      setAppointments(bookings);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Don't show alert on initial load, just log
      if (!isRefresh) {
        // Could show a toast or error message here
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return 'Today';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const formatConsultationMethod = (method: string) => {
    const labels: Record<string, string> = {
      'video': 'Video Call',
      'audio': 'Audio Call',
      'chat': 'Chat',
      'in-person': 'In-Person'
    };
    return labels[method] || method;
  };

  const getAppointmentDateTimes = (appointment: Appointment) => {
    const sessionDate = new Date(appointment.sessionDate);
    const [startHour, startMin] = appointment.startTime.split(':').map(Number);
    const [endHour, endMin] = appointment.endTime.split(':').map(Number);

    const startDateTime = new Date(sessionDate);
    startDateTime.setHours(startHour, startMin, 0, 0);

    const endDateTime = new Date(sessionDate);
    endDateTime.setHours(endHour, endMin, 0, 0);

    return { startDateTime, endDateTime };
  };

  const canJoinVideoCall = (appointment: Appointment) => {
    if (appointment.consultationMethod !== 'video' || appointment.status !== 'confirmed') {
      return false;
    }
    const { startDateTime, endDateTime } = getAppointmentDateTimes(appointment);
    const now = new Date();
    const joinOpensAt = new Date(startDateTime.getTime() - 5 * 60 * 1000);
    const joinClosesAt = new Date(endDateTime.getTime() + 15 * 60 * 1000);
    return now >= joinOpensAt && now <= joinClosesAt;
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string, reason?: string) => {
    try {
      setUpdatingId(appointmentId);
      await apiService.updateBookingStatus(appointmentId, newStatus.toLowerCase(), reason);
      await fetchAppointments();
      if (showCancelModal) {
        setShowCancelModal(false);
        setAppointmentToCancel(null);
        setCancellationReason('');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', handleApiError(error));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelPress = (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
    setCancellationReason('');
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!appointmentToCancel) return;
    
    if (!cancellationReason.trim()) {
      Alert.alert('Required', 'Please provide a reason for cancellation');
      return;
    }

    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment? This action cannot be undone.',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => handleStatusUpdate(appointmentToCancel._id, 'cancelled', cancellationReason.trim())
        }
      ]
    );
  };

  const handleJoinSession = async (appointment: Appointment) => {
    if (joiningId) return;
    try {
      setJoiningId(appointment._id);
      const response = await apiService.getAgoraToken(appointment._id);
      const payload = response?.data || response;
      const agoraData = payload?.data || payload;

      if (!agoraData?.token || !agoraData?.channelName || !agoraData?.appId) {
        throw new Error('Unable to start video session. Please try again.');
      }

      router.push({
        pathname: '/video-call',
        params: {
          appId: encodeURIComponent(String(agoraData.appId)),
          channelName: encodeURIComponent(String(agoraData.channelName)),
          token: encodeURIComponent(String(agoraData.token)),
          uid: encodeURIComponent(String(agoraData.uid ?? '')),
          role: encodeURIComponent(String(agoraData.role || 'host')),
          displayName: encodeURIComponent('Expert')
        }
      });
    } catch (error) {
      Alert.alert('Unable to Join', handleApiError(error));
    } finally {
      setJoiningId(null);
    }
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    // Could navigate to appointment detail screen
    console.log('Appointment pressed:', appointment._id);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const user = appointment.user || {};
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
    const matchesSearch = !searchQuery || 
      userName.includes(searchQuery.toLowerCase()) ||
      (appointment.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Filter appointments for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAppointments = filteredAppointments.filter(apt => {
    const aptDate = new Date(apt.sessionDate);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() === today.getTime();
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Compact Header */}
      <View style={styles.compactHeader}>
        <Text style={styles.headerTitle}>My Schedule</Text>
        <Text style={styles.headerSubtitle}>Manage your appointments and availability</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search appointments..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusFilters.map((status) => (
            <Pressable
              key={status}
              style={[
                styles.filterChip,
                selectedStatus === status && styles.filterChipActive
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.filterChipText,
                selectedStatus === status && styles.filterChipTextActive
              ]}>
                {status}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Appointments List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.appointmentsContainer} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchAppointments(true)}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
        >
          <Text style={styles.sectionTitle}>
            {selectedStatus === 'All' 
              ? `All Appointments (${filteredAppointments.length})` 
              : `${selectedStatus} Appointments (${filteredAppointments.length})`}
          </Text>
          
          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No appointments found</Text>
            </View>
          ) : (
            filteredAppointments.map((appointment) => {
              const user = appointment.user || {};
              const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
              const userImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=37b9a8&color=fff&size=128`;
              const isUpdating = updatingId === appointment._id;

              return (
                <View
                  key={appointment._id}
                  style={styles.appointmentCard}
                >
                  <Pressable
                    style={styles.appointmentCardPressable}
                    onPress={() => handleAppointmentPress(appointment)}
                  >
                    <Image source={{ uri: userImage }} style={styles.patientImage} />
                    <View style={styles.appointmentInfo}>
                      <View style={styles.appointmentHeader}>
                        <Text style={styles.patientName}>{userName}</Text>
                        <View style={[
                          styles.statusBadge,
                          { 
                            backgroundColor: appointment.status === 'confirmed' ? '#059669' : 
                                           appointment.status === 'pending' ? '#F59E0B' :
                                           appointment.status === 'completed' ? '#2196F3' :
                                           '#F44336'
                          }
                        ]}>
                          <Text style={styles.statusText}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Text>
                        </View>
                      </View>
                      
                      <Text style={styles.appointmentTime}>
                        {formatDate(appointment.sessionDate)} • {formatTimeRange(appointment.startTime, appointment.endTime)}
                      </Text>
                      <Text style={styles.appointmentType}>
                        {formatConsultationMethod(appointment.consultationMethod)} • {appointment.sessionType === 'one-on-one' ? 'One-on-One' : 'Group'}
                      </Text>
                      {appointment.notes && (
                        <Text style={styles.appointmentNotes}>{appointment.notes}</Text>
                      )}
                      
                      <View style={styles.appointmentFooter}>
                        <View style={styles.appointmentActions}>
                          {appointment.status === 'pending' && (
                            <View style={styles.actionButtons}>
                              <Pressable
                                style={[styles.confirmButton, isUpdating && styles.buttonDisabled]}
                                onPress={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                  <Text style={styles.confirmButtonText}>Confirm</Text>
                                )}
                              </Pressable>
                              <Pressable
                                style={[styles.rejectButton, isUpdating && styles.buttonDisabled]}
                                onPress={() => handleStatusUpdate(appointment._id, 'rejected')}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                  <Text style={styles.rejectButtonText}>Reject</Text>
                                )}
                              </Pressable>
                            </View>
                          )}
                          {appointment.status === 'confirmed' && appointment.consultationMethod === 'video' && (
                            <View style={styles.confirmedActions}>
                              <Pressable
                                style={[
                                  styles.joinButton,
                                  (!canJoinVideoCall(appointment) || joiningId === appointment._id) && styles.buttonDisabled
                                ]}
                                onPress={() => handleJoinSession(appointment)}
                                disabled={!canJoinVideoCall(appointment) || joiningId === appointment._id}
                              >
                                {joiningId === appointment._id ? (
                                  <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                  <Text style={styles.joinButtonText}>
                                    {canJoinVideoCall(appointment) ? 'Join Video Call' : 'Join Opens Soon'}
                                  </Text>
                                )}
                              </Pressable>
                              {!canJoinVideoCall(appointment) && (
                                <Text style={styles.waitingText}>Join link unlocks 5 min before start</Text>
                              )}
                              <Pressable
                                style={[styles.cancelButton, isUpdating && styles.buttonDisabled]}
                                onPress={() => handleCancelPress(appointment)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                  <Text style={styles.cancelButtonText}>Cancel</Text>
                                )}
                              </Pressable>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </View>
              );
            })
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* Cancel Appointment Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowCancelModal(false);
          setAppointmentToCancel(null);
          setCancellationReason('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Appointment</Text>
            {appointmentToCancel && (
              <>
                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel}>Patient: </Text>
                    {`${appointmentToCancel.user?.firstName || ''} ${appointmentToCancel.user?.lastName || ''}`.trim() || 'User'}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel}>Date: </Text>
                    {formatDate(appointmentToCancel.sessionDate)} • {formatTimeRange(appointmentToCancel.startTime, appointmentToCancel.endTime)}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel}>Type: </Text>
                    {formatConsultationMethod(appointmentToCancel.consultationMethod)}
                  </Text>
                </View>
                <Text style={styles.modalLabel}>Cancellation Reason *</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Please provide a reason for cancelling this appointment..."
                  placeholderTextColor="#9CA3AF"
                  value={cancellationReason}
                  onChangeText={setCancellationReason}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => {
                      setShowCancelModal(false);
                      setAppointmentToCancel(null);
                      setCancellationReason('');
                    }}
                  >
                    <Text style={styles.modalButtonCancelText}>Keep Appointment</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, styles.modalButtonConfirm, !cancellationReason.trim() && styles.modalButtonDisabled]}
                    onPress={handleConfirmCancel}
                    disabled={!cancellationReason.trim() || updatingId === appointmentToCancel._id}
                  >
                    {updatingId === appointmentToCancel._id ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.modalButtonConfirmText}>Cancel Appointment</Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <ExpertFooter activeRoute="appointments" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2da898ff',
  },
  compactHeader: {
    alignItems: 'flex-start',
    paddingTop: getResponsiveHeight(50),
    paddingHorizontal: getResponsiveWidth(20),
    paddingBottom: getResponsiveHeight(24),
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: getResponsiveHeight(8),
    textAlign: 'left',
  },
  headerSubtitle: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'left',
  },
  searchContainer: {
    paddingHorizontal: getResponsiveWidth(20),
    marginBottom: getResponsiveHeight(20),
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    fontSize: getResponsiveFontSize(16),
    color: '#1F2937',
  },
  filtersContainer: {
    paddingLeft: getResponsiveWidth(20),
    marginBottom: getResponsiveHeight(24),
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(16),
    marginRight: getResponsiveMargin(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterChipActive: {
    backgroundColor: '#575623ff',
    borderColor: '#575623ff',
  },
  filterChipText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  filterChipTextActive: {
    color: '#ffffff',
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
  appointmentsContainer: {
    flex: 1,
    paddingHorizontal: getResponsiveWidth(20),
    paddingTop: getResponsiveHeight(8),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveHeight(20),
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveMargin(20),
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  appointmentCardPressable: {
    flexDirection: 'row',
    padding: getResponsivePadding(16),
  },
  patientImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveHeight(4),
  },
  patientName: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: getResponsiveWidth(8),
    paddingVertical: getResponsiveHeight(4),
    borderRadius: getResponsiveBorderRadius(12),
    marginLeft: getResponsiveWidth(8),
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(10),
    fontWeight: '600',
  },
  appointmentTime: {
    fontSize: getResponsiveFontSize(12),
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: getResponsiveHeight(2),
  },
  appointmentType: {
    fontSize: getResponsiveFontSize(11),
    color: '#575623ff',
    fontWeight: '600',
    marginBottom: getResponsiveHeight(4),
  },
  appointmentNotes: {
    fontSize: getResponsiveFontSize(10),
    color: '#444',
    lineHeight: getResponsiveHeight(12),
    marginBottom: getResponsiveHeight(8),
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentActions: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: getResponsiveWidth(8),
  },
  confirmButton: {
    backgroundColor: '#059669',
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
  },
  confirmButtonText: {
    fontSize: getResponsiveFontSize(11),
    color: '#ffffff',
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
  },
  rejectButtonText: {
    fontSize: getResponsiveFontSize(11),
    color: '#ffffff',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  joinButton: {
    backgroundColor: '#2da898ff',
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
    shadowColor: '#2da898ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  joinButtonText: {
    fontSize: getResponsiveFontSize(11),
    color: '#ffffff',
    fontWeight: '600',
  },
  waitingText: {
    fontSize: getResponsiveFontSize(11),
    color: '#6B7280',
    fontStyle: 'italic',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: EXPERT_FOOTER_HEIGHT + getResponsiveHeight(60),
  },
  confirmedActions: {
    flexDirection: 'row',
    gap: getResponsiveWidth(8),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
  },
  cancelButtonText: {
    fontSize: getResponsiveFontSize(11),
    color: '#ffffff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: getResponsiveWidth(20),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(20),
    padding: getResponsivePadding(24),
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getResponsiveHeight(16),
    textAlign: 'center',
  },
  modalInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    marginBottom: getResponsiveHeight(16),
  },
  modalInfoText: {
    fontSize: getResponsiveFontSize(14),
    color: '#374151',
    marginBottom: getResponsiveHeight(4),
  },
  modalInfoLabel: {
    fontWeight: '600',
    color: '#1F2937',
  },
  modalLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: getResponsiveHeight(8),
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(14),
    color: '#1F2937',
    minHeight: getResponsiveHeight(100),
    marginBottom: getResponsiveHeight(20),
    backgroundColor: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: getResponsiveWidth(12),
  },
  modalButton: {
    flex: 1,
    paddingVertical: getResponsiveHeight(12),
    borderRadius: getResponsiveBorderRadius(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  modalButtonCancelText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#374151',
  },
  modalButtonConfirm: {
    backgroundColor: '#F44336',
  },
  modalButtonConfirmText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
});
