import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
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
import { getProfileImageWithFallback } from '@/utils/imageHelpers';
import { UPLOADS_URL } from '@/config/apiConfig';

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
  agoraChannelName?: string;
  cancelledBy?: 'user' | 'expert';
  cancellationReason?: string;
  createdAt: string;
  feedbackRating?: number;
  feedbackComment?: string;
  feedbackSubmittedAt?: string;
  prescription?: {
    url?: string;
    originalName?: string;
    uploadedAt?: string;
  };
};

export default function SessionsScreen() {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackAppointment, setFeedbackAppointment] = useState<Appointment | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [downloadingPrescriptionId, setDownloadingPrescriptionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const ratingScale = [1, 2, 3, 4, 5];
  const dateFilters = [
    { label: 'All dates', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Last 7 days', value: 'week' },
    { label: 'This month', value: 'month' }
  ] as const;
  const renderStaticStars = (value: number) => {
    return (
      <View style={styles.feedbackStarsRow}>
        {ratingScale.map((star) => (
          <Text
            key={star}
            style={[
              styles.feedbackStar,
              star <= value ? styles.starFilled : styles.starEmpty
            ]}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  const getPrescriptionUrl = (appointment: Appointment) => {
    const relative = appointment.prescription?.url;
    if (!relative) return null;
    if (/^https?:\/\//i.test(relative)) return relative;
    // If the relative URL already starts with /uploads/, remove it to avoid duplication
    if (relative.startsWith('/uploads/')) {
      // Extract the path after /uploads/ and construct the full URL
      const pathAfterUploads = relative.replace(/^\/uploads\//, '');
      return `${UPLOADS_URL}/${pathAfterUploads}`;
    }
    if (relative.startsWith('/')) return `${UPLOADS_URL}${relative}`;
    return `${UPLOADS_URL}/${relative}`;
  };

  const handleDownloadPrescription = async (url: string, appointment: Appointment) => {
    try {
      setDownloadingPrescriptionId(appointment._id);
      
      // Get the filename from the prescription or generate one
      const fileName = appointment.prescription?.originalName || 
        `prescription-${appointment._id.substring(appointment._id.length - 6)}.pdf`;
      
      // Create a file URI in the cache directory
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      
      // Download the file
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);
      
      if (downloadResult.status !== 200) {
        throw new Error('Failed to download file');
      }
      
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        // Share/open the file (this will allow user to save to downloads or open with an app)
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save Prescription',
          UTI: 'com.adobe.pdf'
        });
      } else {
        // Fallback: open the file URL if sharing is not available
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Download Complete', `File saved to: ${fileUri}`);
        }
      }
    } catch (error) {
      console.error('Unable to download prescription:', error);
      Alert.alert('Download Failed', 'Unable to download the prescription. Please try again later.');
    } finally {
      setDownloadingPrescriptionId(null);
    }
  };


  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Refresh bookings when screen comes into focus (e.g., after payment)
  useFocusEffect(
    useCallback(() => {
      fetchAllBookings();
    }, [])
  );

  const fetchAllBookings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch all bookings without status filter (use high limit to get all bookings)
      const response = await apiService.getUserBookings({ limit: 1000 });
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

  const openFeedbackModal = (appointment: Appointment) => {
    setFeedbackAppointment(appointment);
    setFeedbackRating(appointment.feedbackRating || 0);
    setFeedbackComment(appointment.feedbackComment || '');
    setFeedbackModalVisible(true);
  };

  const closeFeedbackModal = (force = false) => {
    if (feedbackSubmitting && !force) return;
    setFeedbackModalVisible(false);
    setFeedbackAppointment(null);
    setFeedbackRating(0);
    setFeedbackComment('');
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackAppointment) return;
    if (!feedbackRating) {
      Alert.alert('Required', 'Please select a rating to continue.');
      return;
    }

    const trimmedComment = feedbackComment.trim();
    setFeedbackSubmitting(true);
    try {
      await apiService.submitFeedback(feedbackAppointment._id, {
        rating: feedbackRating,
        comment: trimmedComment || undefined
      });

      setAllAppointments((prev) =>
        prev.map((apt) =>
          apt._id === feedbackAppointment._id
            ? {
                ...apt,
                feedbackRating,
                feedbackComment: trimmedComment || undefined,
                feedbackSubmittedAt: new Date().toISOString()
              }
            : apt
        )
      );

      Alert.alert('Thank you!', 'Your feedback has been submitted.');
      closeFeedbackModal(true);
    } catch (error) {
      Alert.alert('Error', handleApiError(error));
    } finally {
      setFeedbackSubmitting(false);
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

  const isRealtimeConsultation = (method?: string) => {
    if (!method) return false;
    return method === 'video' || method === 'audio';
  };

  const getJoinCtaLabel = (method?: string) => {
    if (method === 'audio') {
      return 'Join Audio Call';
    }
    return 'Join Video Call';
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

  const canJoinRealtimeSession = (appointment: Appointment) => {
    if (!isRealtimeConsultation(appointment.consultationMethod) || appointment.status !== 'confirmed') {
      return false;
    }
    const { startDateTime, endDateTime } = getAppointmentDateTimes(appointment);
    const now = new Date();
    const joinOpensAt = new Date(startDateTime.getTime() - 5 * 60 * 1000);
    const joinClosesAt = new Date(endDateTime.getTime() + 15 * 60 * 1000);
    return now >= joinOpensAt && now <= joinClosesAt;
  };

  // Helper to get join status for better UI messaging
  const getJoinStatus = (appointment: Appointment): 'too-early' | 'available' | 'ended' | 'not-applicable' => {
    if (!isRealtimeConsultation(appointment.consultationMethod) || appointment.status !== 'confirmed') {
      return 'not-applicable';
    }
    const { startDateTime, endDateTime } = getAppointmentDateTimes(appointment);
    const now = new Date();
    const joinOpensAt = new Date(startDateTime.getTime() - 5 * 60 * 1000);
    
    if (now < joinOpensAt) {
      return 'too-early';
    }
    // Session has ended if current time is after the end time
    if (now > endDateTime) {
      return 'ended';
    }
    return 'available';
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

  const handleJoinSession = async (appointment: Appointment) => {
    if (joiningId) return;
    try {
      setJoiningId(appointment._id);
      const response = await apiService.getAgoraToken(appointment._id);
      const payload = response?.data || response;
      const agoraData = payload?.data || payload;

      if (!agoraData?.token || !agoraData?.channelName || !agoraData?.appId) {
        throw new Error('Unable to start session. Please try again.');
      }

      router.push({
        pathname: '/video-call',
        params: {
          appId: encodeURIComponent(String(agoraData.appId)),
          channelName: encodeURIComponent(String(agoraData.channelName)),
          token: encodeURIComponent(String(agoraData.token)),
          uid: encodeURIComponent(String(agoraData.uid ?? '')),
          role: encodeURIComponent(String(agoraData.role || 'audience')),
          displayName: encodeURIComponent('You'),
          mediaType: encodeURIComponent(
            String(agoraData.mediaType || appointment.consultationMethod || 'video')
          )
        }
      });
    } catch (error) {
      Alert.alert('Unable to Join', handleApiError(error));
    } finally {
      setJoiningId(null);
    }
  };

  const matchesDateFilter = (appointment: Appointment) => {
    if (dateFilter === 'all') return true;
    const appointmentDate = new Date(appointment.sessionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter === 'today') {
      return (
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getDate() === today.getDate()
      );
    }

    if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return appointmentDate >= weekAgo && appointmentDate <= new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }

    if (dateFilter === 'month') {
      return (
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointmentDate.getMonth() === today.getMonth()
      );
    }

    return true;
  };

  const matchesSearchQuery = (appointment: Appointment) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const expertName = [
      appointment.expert?.firstName,
      appointment.expert?.lastName
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const notes = appointment.notes?.toLowerCase() || '';
    const sessionType = appointment.consultationMethod?.toLowerCase() || '';
    const shortId = appointment._id.substring(appointment._id.length - 6).toLowerCase();

    return (
      expertName.includes(query) ||
      notes.includes(query) ||
      sessionType.includes(query) ||
      shortId.includes(query)
    );
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

  const getFilteredSessions = () => {
    const sessions = getCurrentSessions()
      .filter(matchesSearchQuery)
      .filter(matchesDateFilter);
    return sessions;
  };

  const renderSessionCard = (appointment: Appointment) => {
    const isUpcoming = appointment.status === 'pending' || appointment.status === 'confirmed';
    const isCompleted = appointment.status === 'completed';
    const isCancelled = appointment.status === 'cancelled' || appointment.status === 'rejected';

    const expertName = [
      appointment.expert?.firstName,
      appointment.expert?.lastName
    ].filter(Boolean).join(' ') || 'Expert';

    const expertImage = getProfileImageWithFallback(
      appointment.expert?.profileImage,
      expertName
    ) || `https://ui-avatars.com/api/?name=${encodeURIComponent(expertName)}&background=37b9a8&color=fff&size=128`;

    const sessionId = appointment._id.substring(appointment._id.length - 6).toUpperCase();
    const prescriptionUrl = getPrescriptionUrl(appointment);
    const prescriptionUploadedAt = appointment.prescription?.uploadedAt
      ? new Date(appointment.prescription.uploadedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      : null;

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

          {prescriptionUrl && (
            <View style={styles.prescriptionCard}>
              <View style={styles.prescriptionHeader}>
                <Text style={styles.prescriptionTitle}>Prescription</Text>
                <Pressable 
                  onPress={() => handleDownloadPrescription(prescriptionUrl, appointment)}
                  disabled={downloadingPrescriptionId === appointment._id}
                >
                  {downloadingPrescriptionId === appointment._id ? (
                    <ActivityIndicator size="small" color="#0EA5E9" />
                  ) : (
                    <Text style={styles.prescriptionLink}>Download PDF</Text>
                  )}
                </Pressable>
              </View>
              {appointment.prescription?.originalName ? (
                <Text style={styles.prescriptionMeta} numberOfLines={1}>
                  {appointment.prescription.originalName}
                </Text>
              ) : null}
              {prescriptionUploadedAt ? (
                <Text style={styles.prescriptionMeta}>{prescriptionUploadedAt}</Text>
              ) : null}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {isUpcoming && (
              <>
                {isRealtimeConsultation(appointment.consultationMethod) && appointment.status === 'confirmed' && getJoinStatus(appointment) !== 'ended' && (
                  <View style={styles.joinSection}>
                    {(() => {
                      const joinStatus = getJoinStatus(appointment);
                      return (
                        <>
                          <Pressable 
                            style={[
                              styles.joinButton,
                              (joinStatus !== 'available' || joiningId === appointment._id) && styles.joinButtonDisabled
                            ]}
                            onPress={() => handleJoinSession(appointment)}
                            disabled={joinStatus !== 'available' || joiningId === appointment._id}
                          >
                            {joiningId === appointment._id ? (
                              <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                              <Text style={styles.joinButtonText}>
                                {joinStatus === 'available' ? getJoinCtaLabel(appointment.consultationMethod) : 'Join Opens Soon'}
                              </Text>
                            )}
                          </Pressable>
                          {joinStatus === 'too-early' && (
                            <Text style={styles.joinHint}>Join link unlocks 5 min before start</Text>
                          )}
                        </>
                      );
                    })()}
                  </View>
                )}
                {getJoinStatus(appointment) !== 'ended' && (
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
                )}
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

          {isCompleted && (
            <View style={styles.feedbackSection}>
              {typeof appointment.feedbackRating === 'number' ? (
                <View style={styles.feedbackSummary}>
                  <Text style={styles.feedbackLabel}>Your Feedback</Text>
                  {renderStaticStars(appointment.feedbackRating)}
                  {appointment.feedbackComment ? (
                    <Text style={styles.feedbackCommentText}>{appointment.feedbackComment}</Text>
                  ) : (
                    <Text style={styles.feedbackCommentPlaceholder}>
                      You rated this session {appointment.feedbackRating}/5.
                    </Text>
                  )}
                </View>
              ) : (
                <Pressable
                  style={styles.feedbackButton}
                  onPress={() => openFeedbackModal(appointment)}
                >
                  <Text style={styles.feedbackButtonText}>Leave Feedback</Text>
                </Pressable>
              )}
            </View>
          )}
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

      {/* Search & Filters */}
      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search by expert, notes, or session ID"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
        <View style={styles.dateFilterRow}>
          {dateFilters.map((filter) => (
            <Pressable
              key={filter.value}
              style={[
                styles.dateFilterChip,
                dateFilter === filter.value && styles.dateFilterChipActive
              ]}
              onPress={() => setDateFilter(filter.value)}
            >
              <Text
                style={[
                  styles.dateFilterText,
                  dateFilter === filter.value && styles.dateFilterTextActive
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </View>
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
          {getFilteredSessions().length > 0 ? (
            getFilteredSessions().map((session) => renderSessionCard(session))
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

      <Modal
        transparent
        animationType="fade"
        visible={feedbackModalVisible}
        onRequestClose={closeFeedbackModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Share your feedback</Text>
            {feedbackAppointment && (
              <Text style={styles.modalSubtitle}>
                {`How was your session with ${[
                  feedbackAppointment.expert?.firstName,
                  feedbackAppointment.expert?.lastName
                ].filter(Boolean).join(' ') || 'the expert'}?`}
              </Text>
            )}

            <View style={styles.modalStarRow}>
              {ratingScale.map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setFeedbackRating(value)}
                  hitSlop={8}
                >
                  <Text
                    style={[
                      styles.modalStar,
                      value <= feedbackRating ? styles.starFilled : styles.starEmpty
                    ]}
                  >
                    ★
                  </Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Add a comment (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={feedbackComment}
              onChangeText={setFeedbackComment}
              editable={!feedbackSubmitting}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalActionButton, styles.modalActionSecondary]}
                onPress={closeFeedbackModal}
                disabled={feedbackSubmitting}
              >
                <Text style={[styles.modalActionText, styles.modalActionSecondaryText]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalActionButton,
                  (!feedbackRating || feedbackSubmitting) && styles.modalActionDisabled
                ]}
                onPress={handleSubmitFeedback}
                disabled={!feedbackRating || feedbackSubmitting}
              >
                {feedbackSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalActionText}>Submit</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  filterSection: {
    marginHorizontal: getResponsiveMargin(20),
    marginBottom: getResponsiveMargin(20),
    gap: getResponsiveHeight(12),
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(16),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(6),
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  searchInput: {
    color: '#0f172a',
    fontSize: getResponsiveFontSize(14),
  },
  filterChipRow: {
    gap: getResponsiveWidth(8),
  },
  filterChip: {
    paddingHorizontal: getResponsivePadding(14),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: getResponsiveMargin(8),
  },
  filterChipActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  filterChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: getResponsiveFontSize(12),
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  dateFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveWidth(8),
  },
  dateFilterChip: {
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  dateFilterChipActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  dateFilterText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '500',
  },
  dateFilterTextActive: {
    color: '#FFFFFF',
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
  prescriptionCard: {
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(12),
    marginBottom: getResponsiveMargin(16),
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.4)',
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(6),
  },
  prescriptionTitle: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
    color: '#0f172a',
  },
  prescriptionLink: {
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
    color: '#0EA5E9',
  },
  prescriptionMeta: {
    fontSize: getResponsiveFontSize(12),
    color: '#0f172a',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: getResponsiveWidth(12),
  },
  joinSection: {
    flex: 1,
  },
  joinButton: {
    width: '100%',
    backgroundColor: '#14B8A6',
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: getResponsiveFontSize(14),
  },
  joinHint: {
    marginTop: getResponsiveHeight(6),
    color: '#0f172a',
    fontSize: getResponsiveFontSize(11),
    fontStyle: 'italic',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    alignItems: 'center',
    alignSelf: 'flex-start',
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
  feedbackSection: {
    marginTop: getResponsiveMargin(16),
  },
  feedbackSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
  },
  feedbackLabel: {
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
    color: '#111827',
    marginBottom: getResponsiveMargin(8),
  },
  feedbackStarsRow: {
    flexDirection: 'row',
    marginBottom: getResponsiveMargin(8),
  },
  feedbackStar: {
    fontSize: getResponsiveFontSize(18),
    marginRight: 4,
  },
  starFilled: {
    color: '#F59E0B',
  },
  starEmpty: {
    color: '#D1D5DB',
  },
  feedbackCommentText: {
    color: '#374151',
    fontSize: getResponsiveFontSize(14),
    lineHeight: getResponsiveHeight(20),
  },
  feedbackCommentPlaceholder: {
    color: '#6B7280',
    fontSize: getResponsiveFontSize(13),
  },
  feedbackButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(10),
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: getResponsivePadding(20),
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '700',
    color: '#111827',
    marginBottom: getResponsiveMargin(8),
  },
  modalSubtitle: {
    fontSize: getResponsiveFontSize(14),
    color: '#4B5563',
    marginBottom: getResponsiveMargin(16),
  },
  modalStarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getResponsiveMargin(16),
  },
  modalStar: {
    fontSize: getResponsiveFontSize(32),
  },
  modalInput: {
    minHeight: getResponsiveHeight(100),
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: getResponsivePadding(12),
    textAlignVertical: 'top',
    color: '#111827',
    marginBottom: getResponsiveMargin(16),
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: getResponsiveWidth(12),
  },
  modalActionButton: {
    flex: 1,
    backgroundColor: '#14B8A6',
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(10),
    alignItems: 'center',
  },
  modalActionSecondary: {
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
  },
  modalActionDisabled: {
    opacity: 0.6,
  },
  modalActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: getResponsiveFontSize(14),
  },
  modalActionSecondaryText: {
    color: '#111827',
  },
});
