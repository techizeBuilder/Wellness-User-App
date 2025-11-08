import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from '@/components/ExpertFooter';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveWidth
} from '@/utils/dimensions';


export default function PatientDetailScreen() {
  const { patientName, patientCondition, patientAvatar } = useLocalSearchParams();
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // Mock patient data - this should come from props or API
  const patient = {
    id: 1,
    name: patientName || 'Lisa Wilson',
    age: 34,
    gender: 'Female',
    condition: patientCondition || 'Anxiety Management',
    image: patientAvatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    phone: '+91 98765 43210',
    email: 'lisa.wilson@email.com',
    address: '123 Wellness Street, Mumbai, Maharashtra 400001',
    joinedDate: '15 March 2023',
    lastVisit: '28 December 2024',
    nextAppointment: '5 January 2025',
    status: 'Active',
    about: 'Lisa Wilson is a 34-year-old professional dealing with anxiety and stress management. She has been working with our wellness program for the past 10 months and has shown significant improvement in managing her symptoms through yoga and meditation practices.',
    medicalHistory: [
      'Anxiety Disorder (Diagnosed: March 2023)',
      'Mild Hypertension (Controlled with lifestyle changes)',
      'Seasonal Allergies'
    ],
    currentMedications: [
      'Sertraline 50mg - Once daily (Morning)',
      'Multivitamin - Once daily',
      'Omega-3 supplements - Once daily'
    ],
    allergies: ['Peanuts', 'Dust Mites'],
    vitals: {
      bloodPressure: '120/80 mmHg',
      heartRate: '72 bpm',
      weight: '65 kg',
      height: '165 cm',
      bmi: '23.9',
      lastUpdated: '28 December 2024'
    },
    sessionsCompleted: 24,
    sessionsRemaining: 6,
    totalSessions: 30,
    progress: 80,
    goals: [
      'Reduce anxiety levels by 50%',
      'Improve sleep quality',
      'Establish daily meditation routine',
      'Achieve work-life balance'
    ],
    notes: [
      {
        date: '28 December 2024',
        expert: 'Dr. Anya Sharma',
        content: 'Patient showed excellent progress in breathing exercises. Recommended to continue daily practice. Next session to focus on advanced meditation techniques.'
      },
      {
        date: '21 December 2024',
        expert: 'Dr. Anya Sharma',
        content: 'Patient reported improved sleep quality. Anxiety levels have decreased significantly. Continue with current treatment plan.'
      }
    ]
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleBookSession = () => {
    // Simple dummy add note functionality
    alert(`Add note for ${patient.name}`);
  };

  const handleMoreInfo = () => {
    setShowMoreInfo(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Image */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: Array.isArray(patient.image) ? patient.image[0] : patient.image }} style={styles.headerImage} />
          <View style={styles.headerGradient}>
            <Pressable style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <View style={styles.headerInfo}>
              <View style={styles.patientNameContainer}>
                <Text style={styles.patientNameWhite}>{patient.name}</Text>
              </View>
              <Text style={styles.patientInfo}>{patient.age} years old • {patient.gender}</Text>
              <Text style={styles.patientCondition}>{Array.isArray(patient.condition) ? patient.condition[0] : patient.condition}</Text>
              <Text style={styles.headerDescription}>
                {patient.about}
              </Text>
              <View style={styles.patientMeta}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>● {patient.status}</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>📅 Next: {patient.nextAppointment}</Text>
                </View>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Pressable style={styles.playButton} onPress={handleBookSession}>
                  <Text style={styles.playIcon}>📝</Text>
                  <Text style={styles.playText}>Add Note</Text>
                </Pressable>
                <Pressable style={styles.infoButton} onPress={handleMoreInfo}>
                  <Text style={styles.infoIcon}>ⓘ</Text>
                  <Text style={styles.infoText}>More Info</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statNumber}>{patient.progress}%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statNumber}>{patient.sessionsCompleted}</Text>
            <Text style={styles.statLabel}>Sessions Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statNumber}>{patient.sessionsRemaining}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>📞</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Contact Information</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>📱 Phone:</Text>
              <Text style={styles.contactValue}>{patient.phone}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>✉️ Email:</Text>
              <Text style={styles.contactValue}>{patient.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>📍 Address:</Text>
              <Text style={styles.contactValue}>{patient.address}</Text>
            </View>
          </View>
        </View>

        {/* Medical History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>🏥</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Medical History</Text>
          </View>
          <View style={styles.aboutCard}>
            {patient.medicalHistory.map((history, index) => (
              <Text key={index} style={styles.medicalItem}>• {history}</Text>
            ))}
          </View>
        </View>

        {/* Current Medications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>💊</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Current Medications</Text>
          </View>
          <View style={styles.aboutCard}>
            {patient.currentMedications.map((medication, index) => (
              <Text key={index} style={styles.medicationItem}>• {medication}</Text>
            ))}
          </View>
        </View>

        {/* Allergies Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>⚠️</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Allergies</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.specialtiesContainer}>
              {patient.allergies.map((allergy, index) => (
                <View key={index} style={styles.allergyTag}>
                  <Text style={styles.allergyTagText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Vitals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>💓</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Vital Signs</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.vitalsGrid}>
              <View style={styles.vitalItem}>
                <Text style={styles.vitalLabel}>Blood Pressure</Text>
                <Text style={styles.vitalValue}>{patient.vitals.bloodPressure}</Text>
              </View>
              <View style={styles.vitalItem}>
                <Text style={styles.vitalLabel}>Heart Rate</Text>
                <Text style={styles.vitalValue}>{patient.vitals.heartRate}</Text>
              </View>
              <View style={styles.vitalItem}>
                <Text style={styles.vitalLabel}>Weight</Text>
                <Text style={styles.vitalValue}>{patient.vitals.weight}</Text>
              </View>
              <View style={styles.vitalItem}>
                <Text style={styles.vitalLabel}>Height</Text>
                <Text style={styles.vitalValue}>{patient.vitals.height}</Text>
              </View>
              <View style={styles.vitalItem}>
                <Text style={styles.vitalLabel}>BMI</Text>
                <Text style={styles.vitalValue}>{patient.vitals.bmi}</Text>
              </View>
            </View>
            <Text style={styles.vitalLastUpdated}>Last updated: {patient.vitals.lastUpdated}</Text>
          </View>
        </View>

        {/* Treatment Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>🎯</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Treatment Goals</Text>
          </View>
          <View style={styles.aboutCard}>
            {patient.goals.map((goal, index) => (
              <Text key={index} style={styles.goalItem}>✓ {goal}</Text>
            ))}
          </View>
        </View>

        {/* Session Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>📅</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Session Information</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.sessionInfoRow}>
              <Text style={styles.sessionInfoLabel}>Joined:</Text>
              <Text style={styles.sessionInfoValue}>{patient.joinedDate}</Text>
            </View>
            <View style={styles.sessionInfoRow}>
              <Text style={styles.sessionInfoLabel}>Last Visit:</Text>
              <Text style={styles.sessionInfoValue}>{patient.lastVisit}</Text>
            </View>
            <View style={styles.sessionInfoRow}>
              <Text style={styles.sessionInfoLabel}>Next Appointment:</Text>
              <Text style={styles.sessionInfoValue}>{patient.nextAppointment}</Text>
            </View>
            <View style={styles.sessionInfoRow}>
              <Text style={styles.sessionInfoLabel}>Total Sessions:</Text>
              <Text style={styles.sessionInfoValue}>{patient.totalSessions} sessions</Text>
            </View>
          </View>
        </View>

        {/* Expert Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>📝</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Expert Notes</Text>
          </View>
          {patient.notes.map((note, index) => (
            <View key={index} style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteDate}>{note.date}</Text>
                <Text style={styles.noteExpert}>{note.expert}</Text>
              </View>
              <Text style={styles.noteContent}>{note.content}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: EXPERT_FOOTER_HEIGHT + 20 }} />
      </ScrollView>
      
      {/* More Info Modal */}
      <Modal
        visible={showMoreInfo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMoreInfo(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Patient Details</Text>
            <Pressable style={styles.closeButton} onPress={() => setShowMoreInfo(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Patient Overview</Text>
              <Text style={styles.modalText}>
                {patient.name} is a {patient.age}-year-old {patient.gender.toLowerCase()} patient 
                currently under treatment for {Array.isArray(patient.condition) ? patient.condition[0] : patient.condition}. The patient has 
                been actively participating in the wellness program since {patient.joinedDate} and 
                has completed {patient.sessionsCompleted} out of {patient.totalSessions} scheduled sessions.
              </Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Treatment Progress</Text>
              <Text style={styles.modalText}>
                • Current Progress: {patient.progress}%{'\n'}
                • Sessions Completed: {patient.sessionsCompleted}/{patient.totalSessions}{'\n'}
                • Sessions Remaining: {patient.sessionsRemaining}{'\n'}
                • Last Visit: {patient.lastVisit}{'\n'}
                • Next Appointment: {patient.nextAppointment}
              </Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Health Status</Text>
              <Text style={styles.modalText}>
                Patient&apos;s vital signs are within normal ranges. Blood pressure and heart rate 
                are stable. The patient has shown consistent improvement in managing anxiety 
                symptoms through regular practice of recommended exercises and meditation techniques.
              </Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Important Notes</Text>
              <Text style={styles.modalText}>
                Patient has allergies to peanuts and dust mites. Current medications include 
                Sertraline 50mg daily. Please ensure all treatment recommendations are 
                compatible with existing medications.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
      
      <ExpertFooter activeRoute="patients" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#37b9a8ff',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    height: getResponsiveHeight(600),
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingTop: getResponsiveHeight(50),
    paddingHorizontal: getResponsiveWidth(20),
    justifyContent: 'space-between',
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveWidth(40),
    borderRadius: getResponsiveWidth(20),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: getResponsiveFontSize(18),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerInfo: {
    paddingBottom: getResponsiveHeight(40),
  },
  patientNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveHeight(8),
  },
  patientNameWhite: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  patientInfo: {
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: getResponsiveHeight(6),
    opacity: 0.9,
  },
  patientCondition: {
    fontSize: getResponsiveFontSize(18),
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: getResponsiveHeight(12),
  },
  patientMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveWidth(10),
    marginBottom: getResponsiveHeight(20),
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
  },
  headerDescription: {
    fontSize: getResponsiveFontSize(14),
    color: '#FFFFFF',
    lineHeight: getResponsiveFontSize(20),
    marginBottom: getResponsiveHeight(20),
  },
  expertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveHeight(24),
  },
  expertSpecialty: {
    backgroundColor: '#FFD700',
    color: '#1F2937',
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    marginRight: getResponsiveWidth(10),
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(12),
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: getResponsiveWidth(12),
  },
  playButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveHeight(12),
    paddingHorizontal: getResponsiveWidth(24),
    borderRadius: getResponsiveBorderRadius(6),
    flex: 1,
  },
  playIcon: {
    fontSize: getResponsiveFontSize(14),
    color: '#000000',
    marginRight: getResponsiveWidth(8),
  },
  playText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#000000',
  },
  infoButton: {
    backgroundColor: 'rgba(109, 109, 110, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveHeight(12),
    paddingHorizontal: getResponsiveWidth(20),
    borderRadius: getResponsiveBorderRadius(6),
    width: getResponsiveWidth(120),
  },
  infoIcon: {
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
    marginRight: getResponsiveWidth(8),
  },
  infoText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getResponsiveWidth(20),
    paddingTop: getResponsiveHeight(50),
    paddingBottom: getResponsiveHeight(20),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    width: getResponsiveWidth(30),
    height: getResponsiveWidth(30),
    borderRadius: getResponsiveWidth(15),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: getResponsiveFontSize(16),
    color: '#6B7280',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: getResponsiveWidth(20),
  },
  modalSection: {
    marginBottom: getResponsiveHeight(24),
    paddingTop: getResponsiveHeight(16),
  },
  modalSectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: getResponsiveHeight(12),
  },
  modalText: {
    fontSize: getResponsiveFontSize(14),
    color: '#374151',
    lineHeight: getResponsiveFontSize(20),
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: getResponsiveWidth(20),
    marginTop: getResponsiveHeight(20),
    marginBottom: getResponsiveHeight(25),
    borderRadius: getResponsiveBorderRadius(15),
    padding: getResponsiveWidth(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: getResponsiveFontSize(24),
    marginBottom: getResponsiveHeight(8),
  },
  statNumber: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getResponsiveHeight(4),
  },
  statLabel: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: getResponsiveHeight(40),
    backgroundColor: '#E5E7EB',
    marginHorizontal: getResponsiveWidth(10),
  },
  section: {
    marginHorizontal: getResponsiveWidth(20),
    marginBottom: getResponsiveHeight(20),
  },
  sectionHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveHeight(12),
  },
  sectionIcon: {
    fontSize: getResponsiveFontSize(20),
    marginRight: getResponsiveWidth(8),
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionTitleWithIcon: {
    marginLeft: 0,
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsiveWidth(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  aboutText: {
    fontSize: getResponsiveFontSize(14),
    color: '#374151',
    lineHeight: getResponsiveFontSize(20),
    marginBottom: getResponsiveHeight(4),
  },
  certificationItem: {
    fontSize: getResponsiveFontSize(14),
    color: '#374151',
    marginBottom: getResponsiveHeight(4),
    lineHeight: getResponsiveFontSize(18),
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveWidth(8),
  },
  specialtyTag: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveHeight(6),
    borderWidth: 1,
    borderColor: '#40A9FF',
  },
  specialtyTagText: {
    fontSize: getResponsiveFontSize(12),
    color: '#0050B3',
    fontWeight: '500',
  },
  sessionTypeItem: {
    fontSize: getResponsiveFontSize(14),
    color: '#10B981',
    marginBottom: getResponsiveHeight(4),
    lineHeight: getResponsiveFontSize(18),
    fontWeight: '500',
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: getResponsiveHeight(12),
    alignItems: 'flex-start',
  },
  contactLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#374151',
    minWidth: getResponsiveWidth(80),
  },
  contactValue: {
    fontSize: getResponsiveFontSize(14),
    color: '#374151',
    flex: 1,
    lineHeight: getResponsiveFontSize(20),
  },
  medicalItem: {
    fontSize: getResponsiveFontSize(14),
    color: '#374151',
    marginBottom: getResponsiveHeight(8),
    lineHeight: getResponsiveFontSize(20),
  },
  medicationItem: {
    fontSize: getResponsiveFontSize(14),
    color: '#374151',
    marginBottom: getResponsiveHeight(8),
    lineHeight: getResponsiveFontSize(20),
  },
  allergyTag: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: getResponsiveWidth(12),
    paddingVertical: getResponsiveHeight(6),
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveHeight(6),
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  allergyTagText: {
    fontSize: getResponsiveFontSize(12),
    color: '#DC2626',
    fontWeight: '500',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: getResponsiveHeight(16),
  },
  vitalItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: getResponsiveWidth(12),
    borderRadius: getResponsiveBorderRadius(8),
    marginBottom: getResponsiveHeight(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  vitalLabel: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    marginBottom: getResponsiveHeight(4),
    fontWeight: '500',
  },
  vitalValue: {
    fontSize: getResponsiveFontSize(16),
    color: '#1F2937',
    fontWeight: 'bold',
  },
  vitalLastUpdated: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: getResponsiveHeight(8),
  },
  goalItem: {
    fontSize: getResponsiveFontSize(14),
    color: '#10B981',
    marginBottom: getResponsiveHeight(8),
    lineHeight: getResponsiveFontSize(20),
    fontWeight: '500',
  },
  sessionInfoRow: {
    flexDirection: 'row',
    marginBottom: getResponsiveHeight(12),
    alignItems: 'center',
  },
  sessionInfoLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#374151',
    minWidth: getResponsiveWidth(140),
  },
  sessionInfoValue: {
    fontSize: getResponsiveFontSize(14),
    color: '#374151',
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsiveWidth(16),
    marginBottom: getResponsiveHeight(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveHeight(8),
    paddingBottom: getResponsiveHeight(8),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  noteDate: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
    fontWeight: '500',
  },
  noteExpert: {
    fontSize: getResponsiveFontSize(12),
    color: '#37b9a8',
    fontWeight: '600',
  },
  noteContent: {
    fontSize: getResponsiveFontSize(14),
    color: '#374151',
    lineHeight: getResponsiveFontSize(20),
  },
});