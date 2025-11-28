import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
  getResponsivePadding,
  getResponsiveWidth,
} from '@/utils/dimensions';
import { apiService } from '@/services/apiService';
import { UPLOADS_URL } from '@/config/apiConfig';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

type Appointment = {
  _id: string;
  user: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
  };
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  feedbackRating?: number;
  createdAt?: string;
  updatedAt?: string;
};

type Patient = {
  id: string;
  userId: string;
  name: string;
  email: string;
  lastSession: string;
  nextSession: string;
  totalSessions: number;
  progress: string;
  avatar?: string;
  condition?: string;
};

const buildImageUrl = (relativePath?: string | null): string | undefined => {
  if (!relativePath) return undefined;
  if (/^https?:\/\//i.test(relativePath)) {
    return relativePath;
  }
  if (relativePath.startsWith('/')) {
    return `${UPLOADS_URL}${relativePath}`;
  }
  return `${UPLOADS_URL}/${relativePath}`;
};

const normalizeTimeString = (timeString?: string | null): string => {
  if (!timeString) {
    return '09:00:00';
  }

  const trimmed = timeString.trim();
  const match = trimmed.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?/i);

  if (!match) {
    return '09:00:00';
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = match[3] ? parseInt(match[3], 10) : 0;
  const period = match[4]?.toLowerCase();

  if (period === 'pm' && hours < 12) {
    hours += 12;
  } else if (period === 'am' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getAppointmentDateTime = (dateString?: string | null, timeString?: string | null): Date | null => {
  if (!dateString) {
    return null;
  }

  try {
    const baseDate = new Date(dateString);
    if (Number.isNaN(baseDate.getTime())) {
      // Try parsing as date-only string
      const fallback = new Date(`${dateString}T00:00:00`);
      if (Number.isNaN(fallback.getTime())) {
        return null;
      }
      baseDate.setTime(fallback.getTime());
    }

    if (!timeString) {
      return baseDate;
    }

    const normalizedTime = normalizeTimeString(timeString);
    const [hours, minutes, seconds] = normalizedTime.split(':').map((value) => parseInt(value, 10));
    const result = new Date(baseDate);
    result.setHours(hours, minutes, seconds, 0);
    return result;
  } catch (error) {
    console.error('Error parsing appointment date time:', error);
    return null;
  }
};

const formatTimeFromDate = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

const formatLastSession = (dateString: string, timeString: string): string => {
  try {
    const sessionDate = getAppointmentDateTime(dateString, timeString);
    if (!sessionDate) {
      return 'Unknown';
    }

    const now = new Date();
    const diffMs = now.getTime() - sessionDate.getTime();
    const diffDays = Math.floor(diffMs / MS_PER_DAY);

    if (diffDays < 0) {
      return 'Upcoming';
    }

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? 'Last week' : `${weeks} weeks ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      if (Number.isNaN(months) || months <= 0) {
        return 'Long time ago';
      }
      return months === 1 ? 'Last month' : `${months} months ago`;
    }
  } catch (error) {
    console.error('Error formatting last session:', error);
    return 'Unknown';
  }
};

const formatNextSession = (dateString: string, timeString: string): string => {
  try {
    const sessionDate = getAppointmentDateTime(dateString, timeString);
    if (!sessionDate) {
      return 'Unknown';
    }

    const now = new Date();
    const sessionMidnight = new Date(sessionDate);
    sessionMidnight.setHours(0, 0, 0, 0);
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);

    const diffDays = Math.round((sessionMidnight.getTime() - todayMidnight.getTime()) / MS_PER_DAY);
    const formattedTime = formatTimeFromDate(sessionDate);

    if (diffDays < 0) {
      const dateStr = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${dateStr}, ${formattedTime}`;
    } else if (diffDays === 0) {
      return `Today, ${formattedTime}`;
    } else if (diffDays === 1) {
      return `Tomorrow, ${formattedTime}`;
    } else if (diffDays < 7) {
      const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'long' });
      return `${dayName}, ${formattedTime}`;
    } else {
      const dateStr = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${dateStr}, ${formattedTime}`;
    }
  } catch (error) {
    console.error('Error formatting next session:', error);
    return 'Unknown';
  }
};

export default function ExpertPatientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fetchPatients = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch all appointments for the expert
      const response = await apiService.getExpertBookings({});
      const appointments: Appointment[] = response?.data?.appointments || [];

      // Process appointments to extract unique patients
      const patientMap = new Map<string, {
        userId: string;
        name: string;
        email: string;
        appointments: Appointment[];
        avatar?: string;
      }>();

      appointments.forEach((appointment) => {
        if (!appointment.user?._id) return;

        const userId = appointment.user._id;
        const firstName = appointment.user.firstName || '';
        const lastName = appointment.user.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || appointment.user.email || 'Unknown';
        const email = appointment.user.email || '';
        const profileImage = appointment.user.profileImage;

        if (!patientMap.has(userId)) {
          patientMap.set(userId, {
            userId,
            name: fullName,
            email,
            appointments: [],
            avatar: profileImage ? buildImageUrl(profileImage) : undefined,
          });
        }

        patientMap.get(userId)!.appointments.push(appointment);
      });

      // Convert to patient list with statistics
      const processedPatients: Patient[] = Array.from(patientMap.values()).map((patientData) => {
        const { appointments } = patientData;
        
        // Sort appointments by date
        const sortedAppointments = [...appointments].sort((a, b) => {
          const dateA = getAppointmentDateTime(a.sessionDate, a.startTime);
          const dateB = getAppointmentDateTime(b.sessionDate, b.startTime);
          const timeA = dateA ? dateA.getTime() : 0;
          const timeB = dateB ? dateB.getTime() : 0;
          return timeA - timeB;
        });

        // Get completed appointments
        const completedAppointments = sortedAppointments.filter(
          (apt) => (apt.status || '').toLowerCase() === 'completed'
        );

        // Get upcoming appointments
        const now = new Date();
        const upcomingAppointments = sortedAppointments.filter((apt) => {
          try {
            const aptDate = getAppointmentDateTime(apt.sessionDate, apt.startTime);
            if (!aptDate) {
              return false;
            }
            const normalizedStatus = (apt.status || '').toLowerCase();
            const isCancelled = normalizedStatus === 'cancelled' || normalizedStatus === 'rejected';
            const isCompleted = normalizedStatus === 'completed';
            const isPendingOrConfirmed = normalizedStatus === 'pending' || normalizedStatus === 'confirmed';
            return aptDate >= now && !isCancelled && !isCompleted && isPendingOrConfirmed;
          } catch (error) {
            console.error('Error processing appointment date:', error);
            return false;
          }
        });

        // Calculate last session
        const lastCompleted = completedAppointments[completedAppointments.length - 1];
        const lastSession = lastCompleted
          ? formatLastSession(lastCompleted.sessionDate, lastCompleted.startTime)
          : 'No sessions yet';

        // Calculate next session - sort upcoming appointments by date to get the earliest one
        const sortedUpcoming = [...upcomingAppointments].sort((a, b) => {
          const dateA = getAppointmentDateTime(a.sessionDate, a.startTime);
          const dateB = getAppointmentDateTime(b.sessionDate, b.startTime);
          const timeA = dateA ? dateA.getTime() : Number.MAX_SAFE_INTEGER;
          const timeB = dateB ? dateB.getTime() : Number.MAX_SAFE_INTEGER;
          return timeA - timeB;
        });
        const nextAppointment = sortedUpcoming[0];
        const nextSession = nextAppointment
          ? formatNextSession(nextAppointment.sessionDate, nextAppointment.startTime)
          : 'No upcoming sessions';

        // Calculate progress based on average feedback rating
        const ratings = completedAppointments
          .map((apt) => apt.feedbackRating)
          .filter((rating): rating is number => typeof rating === 'number' && rating > 0);

        const averageRating = ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0;

        let progress = 'Improving';
        if (averageRating >= 4.5) {
          progress = 'Excellent';
        } else if (averageRating >= 3.5) {
          progress = 'Good';
        } else if (averageRating > 0) {
          progress = 'Improving';
        } else {
          progress = 'New';
        }

        return {
          id: patientData.userId,
          userId: patientData.userId,
          name: patientData.name,
          email: patientData.email,
          lastSession,
          nextSession,
          totalSessions: completedAppointments.length,
          progress,
          avatar: patientData.avatar,
          condition: 'Wellness Support', // Default condition, can be enhanced later
        };
      });

      // Sort by most recent activity
      processedPatients.sort((a, b) => {
        // Prioritize patients with recent sessions
        if (a.totalSessions !== b.totalSessions) {
          return b.totalSessions - a.totalSessions;
        }
        return a.name.localeCompare(b.name);
      });

      setPatients(processedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Error handling is done silently to avoid disrupting UX
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patient.condition && patient.condition.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePatientPress = (patient: Patient) => {
    router.push({
      pathname: '/patient-detail',
      params: {
        patientId: patient.userId,
        patientName: patient.name,
        patientEmail: patient.email,
        patientCondition: patient.condition || 'Wellness Support',
        patientAvatar: patient.avatar || '',
        lastSession: patient.lastSession,
        nextSession: patient.nextSession,
        totalSessions: patient.totalSessions.toString(),
        progress: patient.progress
      }
    });
  };

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case 'Excellent': return '#059669';
      case 'Good': return '#F59E0B';
      case 'Improving': return '#3B82F6';
      case 'New': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2DD4BF" translucent />
      
      <LinearGradient
        colors={['#2da898ff', '#abeee6ff']}
        style={styles.backgroundGradient}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchPatients(true)}
              tintColor="#FFFFFF"
            />
          }
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>My Patients</Text>
            <Text style={styles.subtitle}>Manage patient relationships and progress</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search patients..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Patients List */}
          <View style={styles.patientsContainer}>
            <Text style={styles.sectionTitle}>Patient List</Text>
            
            {loading && !refreshing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2DD4BF" />
                <Text style={styles.loadingText}>Loading patients...</Text>
              </View>
            ) : filteredPatients.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No patients found matching your search' : 'No patients yet'}
                </Text>
              </View>
            ) : (
              filteredPatients.map((patient) => (
              <Pressable 
                key={patient.id}
                style={styles.patientCard}
                onPress={() => handlePatientPress(patient)}
              >
                <View style={styles.patientCardContent}>
                  <View style={styles.avatarContainer}>
                    {patient.avatar ? (
                      <Image 
                        source={{ uri: patient.avatar }}
                        style={styles.patientAvatar}
                      />
                    ) : (
                      <View style={styles.patientAvatarPlaceholder}>
                        <Text style={styles.avatarInitial}>{patient.name.charAt(0)}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientCondition}>{patient.condition}</Text>
                    <Text style={styles.patientEmail}>{patient.email}</Text>
                    <Text style={styles.sessionText}>Last: {patient.lastSession}</Text>
                    <Text style={styles.sessionText}>Next: {patient.nextSession}</Text>
                    <Text style={styles.totalSessions}>Total Sessions: {patient.totalSessions}</Text>
                  </View>
                  
                  <View style={styles.progressBadgeContainer}>
                    <View style={[
                      styles.progressBadge,
                      { backgroundColor: getProgressColor(patient.progress) }
                    ]}>
                      <Text style={styles.progressText}>{patient.progress}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
              ))
            )}
          </View>

          <View style={{ height: EXPERT_FOOTER_HEIGHT + 20 }} />
        </ScrollView>
      </LinearGradient>
      <ExpertFooter activeRoute="patients" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004D4D',
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: getResponsiveHeight(50),
    paddingHorizontal: getResponsiveWidth(20),
  },
  headerSection: {
    marginBottom: getResponsiveHeight(24),
    alignItems: 'flex-start',
  },
  title: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveHeight(8),
    textAlign: 'left',
  },
  subtitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#E5F3F3',
    textAlign: 'left',
  },
  searchContainer: {
    marginBottom: getResponsiveHeight(20),
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    fontSize: getResponsiveFontSize(16),
    color: '#1F2937',
  },
  patientsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveHeight(16),
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveHeight(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#F59E0B', // Golden border like in the screenshot
  },
  patientCardContent: {
    padding: getResponsivePadding(16),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: '#F59E0B', // Golden border for avatar container
    borderRadius: getResponsiveBorderRadius(12),
    padding: 2,
    marginRight: getResponsiveWidth(16),
  },
  patientAvatar: {
    width: getResponsiveWidth(60),
    height: getResponsiveWidth(60),
    borderRadius: getResponsiveBorderRadius(10),
  },
  patientAvatarPlaceholder: {
    width: getResponsiveWidth(60),
    height: getResponsiveWidth(60),
    borderRadius: getResponsiveBorderRadius(10),
    backgroundColor: '#2DD4BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getResponsiveHeight(4),
  },
  patientCondition: {
    fontSize: getResponsiveFontSize(14),
    color: '#2DD4BF',
    fontWeight: '600',
    marginBottom: getResponsiveHeight(4),
  },
  patientEmail: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    marginBottom: getResponsiveHeight(8),
  },
  sessionText: {
    fontSize: getResponsiveFontSize(12),
    color: '#4B5563',
    marginBottom: getResponsiveHeight(2),
  },
  totalSessions: {
    fontSize: getResponsiveFontSize(12),
    color: '#1F2937',
    fontWeight: '600',
    marginTop: getResponsiveHeight(4),
  },
  progressBadgeContainer: {
    alignSelf: 'flex-start',
    marginTop: getResponsiveHeight(8),
  },
  progressBadge: {
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(16),
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: getResponsiveHeight(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: getResponsiveHeight(12),
    fontSize: getResponsiveFontSize(14),
    color: '#FFFFFF',
  },
  emptyContainer: {
    paddingVertical: getResponsiveHeight(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: getResponsiveFontSize(16),
    color: '#E5F3F3',
    textAlign: 'center',
  },
});