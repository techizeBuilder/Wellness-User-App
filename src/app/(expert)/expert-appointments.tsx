import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
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

const { width } = Dimensions.get('window');

export default function ExpertAppointmentsScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const statusFilters = ['All', 'Confirmed', 'Pending', 'Completed'];

  const appointments = [
    {
      id: 1,
      patientName: "John Smith",
      time: "10:00 AM - 10:45 AM",
      type: "Video Call",
      status: "confirmed",
      notes: "Follow-up session for anxiety management",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      patientName: "Emily Davis",
      time: "2:30 PM - 3:30 PM",
      type: "In-Person",
      status: "confirmed",
      notes: "Initial consultation",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      patientName: "Michael Brown",
      time: "4:15 PM - 4:45 PM",
      type: "Video Call",
      status: "pending",
      notes: "Stress management session",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      patientName: "Sarah Johnson",
      time: "9:00 AM - 9:45 AM",
      type: "Phone Call",
      status: "completed",
      notes: "Meditation guidance session",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      patientName: "David Wilson",
      time: "11:30 AM - 12:15 PM",
      type: "In-Person",
      status: "confirmed",
      notes: "Yoga therapy session",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      patientName: "Lisa Chen",
      time: "1:00 PM - 1:45 PM",
      type: "Video Call",
      status: "pending",
      notes: "Nutrition consultation",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 7,
      patientName: "James Martinez",
      time: "3:45 PM - 4:30 PM",
      type: "Phone Call",
      status: "confirmed",
      notes: "Progress review and planning",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 8,
      patientName: "Anna Thompson",
      time: "5:00 PM - 5:45 PM",
      type: "Video Call",
      status: "pending",
      notes: "Mindfulness training session",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 9,
      patientName: "Robert Lee",
      time: "6:15 PM - 7:00 PM",
      type: "In-Person",
      status: "confirmed",
      notes: "Physical wellness assessment",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 10,
      patientName: "Maria Garcia",
      time: "7:30 PM - 8:15 PM",
      type: "Video Call",
      status: "completed",
      notes: "Evening relaxation techniques",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || appointment.status === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleAppointmentPress = (appointment: any) => {
    router.push({
      pathname: '/appointment-detail',
      params: {
        appointmentId: appointment.id,
        patientName: appointment.patientName,
        time: appointment.time,
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes
      }
    });
  };

  const handleAddAppointment = () => {
    console.log("Add appointment functionality");
  };

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

      {/* Today's Appointments */}
      <ScrollView style={styles.appointmentsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Today's Appointments ({filteredAppointments.length})</Text>
        
        {filteredAppointments.map((appointment, index) => (
          <View
            key={appointment.id}
            style={styles.appointmentCard}
          >
            <Pressable
              style={styles.appointmentCardPressable}
              onPress={() => handleAppointmentPress(appointment)}
            >
              <Image source={{ uri: appointment.image }} style={styles.patientImage} />
              <View style={styles.appointmentInfo}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.patientName}>{appointment.patientName}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: appointment.status === 'confirmed' ? '#059669' : '#F59E0B' }
                  ]}>
                    <Text style={styles.statusText}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.appointmentTime}>{appointment.time}</Text>
                <Text style={styles.appointmentType}>{appointment.type}</Text>
                <Text style={styles.appointmentNotes}>{appointment.notes}</Text>
                
                <View style={styles.appointmentFooter}>
                  <View style={styles.appointmentActions}>
                    <View style={styles.joinButton}>
                      <Text style={styles.joinButtonText}>Join Session</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <ExpertFooter activeRoute="appointments" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2da898ff',
  },
  // Compact Header Styles
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
  // Search Bar Styles
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
  // Filter Styles
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
  // Appointments Container (matching experts.tsx layout)
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
  // Appointment Cards (matching experts.tsx card design)
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
  bottomSpacer: {
    height: EXPERT_FOOTER_HEIGHT + getResponsiveHeight(60), // Footer height + extra padding for better spacing
  },
});