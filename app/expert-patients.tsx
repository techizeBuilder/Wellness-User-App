import { LinearGradient } from 'expo-linear-gradient';
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
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from '../src/components/ExpertFooter';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsivePadding,
  getResponsiveWidth,
} from '../src/utils/dimensions';

const { width } = Dimensions.get('window');

export default function ExpertPatientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const patients = [
    {
      id: 1,
      name: "Lisa Wilson",
      email: "lisa.wilson@email.com",
      lastSession: "Yesterday",
      nextSession: "Tomorrow, 10:00 AM",
      totalSessions: 12,
      progress: "Excellent",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      condition: "Anxiety Management"
    },
    {
      id: 2,
      name: "David Chen",
      email: "david.chen@email.com",
      lastSession: "2 days ago",
      nextSession: "Friday, 2:30 PM",
      totalSessions: 8,
      progress: "Good",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      condition: "Stress Management"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      lastSession: "Last week",
      nextSession: "Monday, 11:00 AM",
      totalSessions: 5,
      progress: "Improving",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      condition: "Sleep Disorders"
    },
    {
      id: 4,
      name: "Michael Brown",
      email: "m.brown@email.com",
      lastSession: "3 days ago",
      nextSession: "Next week",
      totalSessions: 15,
      progress: "Excellent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      condition: "Depression Support"
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePatientPress = (patient: any) => {
    router.push({
      pathname: '/patient-detail',
      params: {
        patientId: patient.id,
        patientName: patient.name,
        patientEmail: patient.email,
        patientCondition: patient.condition,
        patientAvatar: patient.avatar,
        lastSession: patient.lastSession,
        nextSession: patient.nextSession,
        totalSessions: patient.totalSessions,
        progress: patient.progress
      }
    });
  };

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case 'Excellent': return '#059669';
      case 'Good': return '#F59E0B';
      case 'Improving': return '#3B82F6';
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

          {/* Patients Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{patients.length}</Text>
              <Text style={styles.statLabel}>Total Patients</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>

          {/* Patients List */}
          <View style={styles.patientsContainer}>
            <Text style={styles.sectionTitle}>Patient List</Text>
            
            {filteredPatients.map((patient) => (
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
            ))}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getResponsiveHeight(24),
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    alignItems: 'center',
    width: (width - 80) / 3,
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
    marginBottom: getResponsiveHeight(4),
  },
  statLabel: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    textAlign: 'center',
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
});