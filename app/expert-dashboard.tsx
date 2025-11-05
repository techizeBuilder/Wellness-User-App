import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from '../src/components/ExpertFooter';
import authService from '../src/services/authService';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsivePadding,
  getResponsiveWidth
} from '../src/utils/dimensions';

const { width, height } = Dimensions.get('window');

// SVG Icons for Expert Dashboard
const CalendarIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2"/>
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2"/>
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2"/>
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2"/>
  </Svg>
);

const DollarIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="1" x2="12" y2="23" stroke={color} strokeWidth="2"/>
    <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={color} strokeWidth="2"/>
  </Svg>
);

const UsersIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2"/>
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2"/>
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2"/>
  </Svg>
);

const TrendingUpIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth="2"/>
    <Path d="M17 6h6v6" stroke={color} strokeWidth="2"/>
  </Svg>
);

const ClockIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2"/>
  </Svg>
);

const VideoIcon = ({ size = 24, color = "#14B8A6" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 7l-7 5 7 5V7z" stroke={color} strokeWidth="2"/>
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke={color} strokeWidth="2"/>
  </Svg>
);

const StarIcon = ({ size = 24, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </Svg>
);

export default function ExpertDashboardScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Week');
  const [modalVisible, setModalVisible] = useState(false);
  const [quickNoteText, setQuickNoteText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Check account type on component mount
  useEffect(() => {
    const checkAccountType = async () => {
      try {
        const accountType = await authService.getAccountType();
        console.log('Expert Dashboard - Account Type:', accountType);
        
        // If user is not an Expert, redirect to user dashboard
        if (accountType !== 'Expert') {
          console.log('Redirecting non-expert to user dashboard');
          router.replace('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking account type:', error);
      }
    };

    checkAccountType();
  }, []);

  // Dummy data for expert dashboard
  const expertData = {
    name: "Dr. Sarah Johnson",
    specialization: "Mental Health Counselor",
    rating: 4.8,
    totalPatients: 156,
    totalEarnings: 12500,
    thisWeekEarnings: 1850,
    appointmentsToday: 6,
    upcomingAppointments: 3,
    patientSatisfaction: 98,
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"
  };

  const upcomingAppointments = [
    {
      id: 1,
      patientName: "John Smith",
      time: "10:00 AM",
      type: "Video Call",
      duration: "45 min",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
    },
    {
      id: 2,
      patientName: "Emily Davis",
      time: "2:30 PM",
      type: "In-Person",
      duration: "60 min",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
    },
    {
      id: 3,
      patientName: "Michael Brown",
      time: "4:15 PM",
      type: "Video Call",
      duration: "30 min",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    }
  ];

  const recentPatients = [
    {
      id: 1,
      name: "Lisa Wilson",
      lastSession: "Yesterday",
      nextSession: "Tomorrow",
      progress: "Excellent",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      condition: "Anxiety Management",
      email: "lisa.wilson@email.com",
      totalSessions: 12
    },
    {
      id: 2,
      name: "David Chen",
      lastSession: "2 days ago",
      nextSession: "Friday",
      progress: "Good",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      condition: "Stress Management",
      email: "david.chen@email.com",
      totalSessions: 8
    },
    {
      id: 3,
      name: "Sarah Johnson",
      lastSession: "Last week",
      nextSession: "Monday",
      progress: "Good",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      condition: "Sleep Disorders",
      email: "sarah.j@email.com",
      totalSessions: 5
    },
    {
      id: 4,
      name: "Michael Brown",
      lastSession: "3 days ago",
      nextSession: "Next week",
      progress: "Excellent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      condition: "Depression Support",
      email: "m.brown@email.com",
      totalSessions: 15
    }
  ];

  const filteredPatients = recentPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleAppointmentPress = (appointmentId: number) => {
    Alert.alert(
      "Appointment Details",
      `View details for appointment ${appointmentId}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "View", onPress: () => console.log(`Viewing appointment ${appointmentId}`) }
      ]
    );
  };

  const handlePatientPress = (patientId: number) => {
    Alert.alert(
      "Patient Profile",
      `View patient profile for patient ${patientId}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "View", onPress: () => console.log(`Viewing patient ${patientId}`) }
      ]
    );
  };

  const handleQuickNote = () => {
    setModalVisible(true);
  };

  const saveQuickNote = () => {
    if (quickNoteText.trim()) {
      Alert.alert("Note Saved", "Your quick note has been saved successfully!");
      setQuickNoteText('');
      setModalVisible(false);
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
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerTop}>
              <View style={styles.expertInfo}>
                <Image 
                  source={{ uri: expertData.profileImage }}
                  style={styles.expertAvatar}
                />
                <View style={styles.expertDetails}>
                  <Text style={styles.expertName}>{expertData.name}</Text>
                  <Text style={styles.expertSpecialization}>{expertData.specialization}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>⭐ {expertData.rating}</Text>
                    <Text style={styles.ratingLabel}>Expert Rating</Text>
                  </View>
                </View>
              </View>
              <Pressable onPress={handleProfilePress} style={styles.profileButton}>
                <Text style={styles.profileButtonText}>Profile</Text>
              </Pressable>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <CalendarIcon size={32} color="#059669" />
                <Text style={styles.statNumber}>{expertData.appointmentsToday}</Text>
                <Text style={styles.statLabel}>Today's Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <DollarIcon size={32} color="#059669" />
                <Text style={styles.statNumber}>${expertData.thisWeekEarnings}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <UsersIcon size={32} color="#059669" />
                <Text style={styles.statNumber}>{expertData.totalPatients}</Text>
                <Text style={styles.statLabel}>Total Patients</Text>
              </View>
              <View style={styles.statCard}>
                <TrendingUpIcon size={32} color="#059669" />
                <Text style={styles.statNumber}>{expertData.patientSatisfaction}%</Text>
                <Text style={styles.statLabel}>Satisfaction</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtonsRow}>
              <Pressable style={styles.actionButton} onPress={() => router.push('/expert-appointments')}>
                <CalendarIcon size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Schedule</Text>
              </Pressable>
              <Pressable style={styles.actionButton} onPress={handleQuickNote}>
                <Text style={[styles.actionButtonText, { fontSize: 20 }]}>📝</Text>
                <Text style={styles.actionButtonText}>Quick Note</Text>
              </Pressable>
              <Pressable style={styles.actionButton} onPress={() => router.push('/expert-earnings')}>
                <TrendingUpIcon size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Reports</Text>
              </Pressable>
            </View>
          </View>

          {/* Today's Appointments */}
          <View style={styles.appointmentsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Appointments</Text>
              <Pressable onPress={() => router.push('/expert-appointments')}>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            
            {upcomingAppointments.map((appointment) => (
              <View 
                key={appointment.id}
                style={styles.appointmentCard}
              >
                <View style={styles.appointmentAvatarContainer}>
                  <Image 
                    source={{ uri: appointment.avatar }}
                    style={styles.appointmentAvatar}
                  />
                </View>
                <View style={styles.appointmentDetails}>
                  <Text style={styles.appointmentPatientName}>{appointment.patientName}</Text>
                  <View style={styles.appointmentMeta}>
                    <ClockIcon size={16} color="#6B7280" />
                    <Text style={styles.appointmentTime}>{appointment.time} • {appointment.duration}</Text>
                  </View>
                  <View style={styles.appointmentType}>
                    {appointment.type === 'Video Call' ? (
                      <VideoIcon size={16} color="#059669" />
                    ) : (
                      <Text style={styles.inPersonIcon}>🏥</Text>
                    )}
                    <Text style={styles.appointmentTypeText}>{appointment.type}</Text>
                  </View>
                </View>
                <Pressable style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join</Text>
                </Pressable>
              </View>
            ))}
          </View>

          {/* Recent Patients */}
          <View style={styles.patientsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Patients</Text>
              <Pressable onPress={() => router.push('/expert-patients')}>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            
            {recentPatients.slice(0, 3).map((patient) => (
              <Pressable 
                key={patient.id}
                style={styles.patientCard}
                onPress={() => router.push({
                  pathname: '/patient-detail',
                  params: {
                    patientId: patient.id,
                    patientName: patient.name,
                    patientAvatar: patient.avatar,
                    lastSession: patient.lastSession,
                    nextSession: patient.nextSession,
                    progress: patient.progress
                  }
                })}
              >
                <View style={styles.patientLeftSection}>
                  <View style={styles.patientAvatarContainer}>
                    <Image 
                      source={{ uri: patient.avatar }}
                      style={styles.patientAvatar}
                    />
                  </View>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientCondition}>{patient.condition}</Text>
                    <Text style={styles.patientEmail}>{patient.email}</Text>
                    <Text style={styles.sessionInfo}>Last: {patient.lastSession}</Text>
                    <Text style={styles.sessionInfo}>Next: {patient.nextSession}</Text>
                    <Text style={styles.totalSessions}>Total Sessions: {patient.totalSessions}</Text>
                  </View>
                  <View style={styles.progressBadge}>
                    <Text style={[
                      styles.progressText,
                      { 
                        backgroundColor: patient.progress === 'Excellent' ? '#059669' : '#F59E0B',
                        color: '#FFFFFF',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 16,
                        fontSize: 12,
                        fontWeight: 'bold'
                      }
                    ]}>
                      {patient.progress}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
            
           
          </View>

          {/* Earnings Overview */}
          <View style={styles.earningsContainer}>
            <Text style={styles.sectionTitle}>Earnings Overview</Text>
            <View style={styles.earningsCard}>
              <View style={styles.earningsHeader}>
                <Text style={styles.earningsTitle}>Total Earnings</Text>
                <Text style={styles.earningsAmount}>${expertData.totalEarnings.toLocaleString()}</Text>
              </View>
              <View style={styles.earningsBreakdown}>
                <View style={styles.earningsStat}>
                  <Text style={styles.earningsStatLabel}>This Week</Text>
                  <Text style={styles.earningsStatValue}>${expertData.thisWeekEarnings}</Text>
                </View>
                <View style={styles.earningsStat}>
                  <Text style={styles.earningsStatLabel}>Sessions</Text>
                  <Text style={styles.earningsStatValue}>{expertData.appointmentsToday}</Text>
                </View>
                <View style={styles.earningsStat}>
                  <Text style={styles.earningsStatLabel}>Avg/Session</Text>
                  <Text style={styles.earningsStatValue}>${Math.round(expertData.thisWeekEarnings / expertData.appointmentsToday)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: EXPERT_FOOTER_HEIGHT + 20 }} />
        </ScrollView>

        {/* Quick Note Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Quick Note</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Enter your note..."
                placeholderTextColor="#9CA3AF"
                value={quickNoteText}
                onChangeText={setQuickNoteText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <View style={styles.modalButtons}>
                <Pressable 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveQuickNote}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
      <ExpertFooter activeRoute="expert-dashboard" />
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
    marginBottom: getResponsiveHeight(20),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expertAvatar: {
    width: getResponsiveWidth(60),
    height: getResponsiveWidth(60),
    borderRadius: getResponsiveWidth(30),
    marginRight: getResponsiveWidth(12),
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  expertDetails: {
    flex: 1,
  },
  expertName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveHeight(2),
  },
  expertSpecialization: {
    fontSize: getResponsiveFontSize(14),
    color: '#E5F3F3',
    marginBottom: getResponsiveHeight(4),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    color: '#FCD34D',
    marginRight: getResponsiveWidth(8),
  },
  ratingLabel: {
    fontSize: getResponsiveFontSize(12),
    color: '#E5F3F3',
  },
  profileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: getResponsiveWidth(16),
    paddingVertical: getResponsiveHeight(8),
    borderRadius: getResponsiveBorderRadius(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileButtonText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getResponsiveHeight(12),
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    alignItems: 'center',
    width: (width - 60) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: getResponsiveHeight(8),
    marginBottom: getResponsiveHeight(4),
  },
  statLabel: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveHeight(12),
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#059669',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    alignItems: 'center',
    width: (width - 80) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    marginTop: getResponsiveHeight(4),
    textAlign: 'center',
  },
  appointmentsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveHeight(12),
  },
  seeAllText: {
    fontSize: getResponsiveFontSize(14),
    color: '#FCD34D',
    fontWeight: '600',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveHeight(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  appointmentAvatarContainer: {
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: getResponsiveWidth(28),
    padding: 2,
    marginRight: getResponsiveWidth(12),
  },
  appointmentAvatar: {
    width: getResponsiveWidth(50),
    height: getResponsiveWidth(50),
    borderRadius: getResponsiveWidth(25),
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentPatientName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getResponsiveHeight(4),
  },
  appointmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveHeight(6),
  },
  appointmentTime: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    marginLeft: getResponsiveWidth(4),
  },
  appointmentDuration: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    marginLeft: getResponsiveWidth(4),
  },
  appointmentType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTypeText: {
    fontSize: getResponsiveFontSize(12),
    color: '#059669',
    marginLeft: getResponsiveWidth(4),
    fontWeight: '600',
  },
  inPersonIcon: {
    fontSize: getResponsiveFontSize(16),
  },
  appointmentActions: {
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#059669',
    paddingHorizontal: getResponsiveWidth(16),
    paddingVertical: getResponsiveHeight(8),
    borderRadius: getResponsiveBorderRadius(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  patientsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  viewMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(12),
    alignItems: 'center',
    marginTop: getResponsiveHeight(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewMoreText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveHeight(16),
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  patientLeftSection: {
    flex: 1,
    flexDirection: 'row',
  },
  patientAvatarContainer: {
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: getResponsiveWidth(27),
    padding: 2,
    marginRight: getResponsiveWidth(16),
    alignSelf: 'flex-start',
  },
  patientAvatar: {
    width: getResponsiveWidth(50),
    height: getResponsiveWidth(50),
    borderRadius: getResponsiveWidth(25),
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
    color: '#059669',
    fontWeight: '600',
    marginBottom: getResponsiveHeight(4),
  },
  patientEmail: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    marginBottom: getResponsiveHeight(8),
  },
  sessionInfo: {
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
  progressBadge: {
    alignSelf: 'flex-start',
    marginTop: getResponsiveHeight(8),
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveHeight(8),
  },
  starsText: {
    fontSize: getResponsiveFontSize(14),
    marginRight: getResponsiveWidth(8),
  },
  sessionTime: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
  },
  patientDescription: {
    fontSize: getResponsiveFontSize(14),
    color: '#4B5563',
    lineHeight: getResponsiveHeight(20),
    marginTop: getResponsiveHeight(4),
  },
  progressText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: 'bold',
  },
  earningsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  earningsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  earningsHeader: {
    alignItems: 'center',
    marginBottom: getResponsiveHeight(16),
  },
  earningsTitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#6B7280',
    marginBottom: getResponsiveHeight(4),
  },
  earningsAmount: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    color: '#059669',
  },
  earningsBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningsStat: {
    alignItems: 'center',
  },
  earningsStatLabel: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    marginBottom: getResponsiveHeight(4),
  },
  earningsStatValue: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(24),
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: getResponsiveHeight(16),
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: getResponsiveBorderRadius(8),
    padding: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(16),
    color: '#1F2937',
    height: getResponsiveHeight(100),
    marginBottom: getResponsiveHeight(16),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(8),
    marginHorizontal: getResponsiveWidth(6),
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  saveButton: {
    backgroundColor: '#059669',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    textAlign: 'center',
  },
});