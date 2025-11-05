import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from '../src/components/ExpertFooter';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveWidth
} from '../src/utils/dimensions';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PatientDetailScreen() {
  const { patientName, patientCondition, patientAvatar } = useLocalSearchParams();
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // Mock patient data - this should come from props or API
  const patient = {
    id: 1,
    name: patientName || 'Lisa Wilson',
    title: patientCondition || 'Anxiety Management',
    specialty: 'Anxiety & Stress',
    experience: '5 years experience',
    rating: 4.9,
    reviews: 156,
    sessionPrice: '₹800',
    image: patientAvatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    verified: true,
    about: 'Dr. Anya Sharma is a certified Yoga master with over 5 years of experience dedicated to helping individuals find inner peace and physical well-being through ancient practices. She specializes in Hatha Yoga, Vinyasa Flow, and meditation techniques that transform both body and mind.',
    specialties: ['Hatha Yoga', 'Vinyasa Flow', 'Meditation', 'Pranayama', 'Stress Management'],
    languages: ['English', 'Hindi', 'Sanskrit'],
    education: 'RYT 500-Hour Certified, Masters in Yoga Philosophy from Rishikesh Yoga Institute',
    certifications: ['RYT 500-Hour Certified', 'Meditation Teacher Training', 'Ayurveda Wellness Coach'],
    sessionTypes: ['1-on-1 Private Sessions', 'Group Classes', 'Online Consultations', 'Workshop Facilitation'],
    availabilityNote: 'Available Mon-Sat, 9 AM - 6 PM IST'
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleBookSession = () => {
    // Simple dummy booking functionality
    alert(`Session booking request sent for ${patient.name}!`);
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
          <Image source={{ uri: patient.image }} style={styles.headerImage} />
          <View style={styles.headerGradient}>
            <Pressable style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <View style={styles.headerInfo}>
              <View style={styles.expertNameContainer}>
                <Text style={styles.expertNameWhite}>Dr. Anya </Text>
                <Text style={styles.expertNameYellow}>Sharma</Text>
              </View>
              <Text style={styles.expertTitle}>{patient.title}</Text>
              <Text style={styles.headerDescription}>
                Certified yoga instructor specializing in Hatha and Vinyasa Flow with 5+ years of experience helping students find inner peace.
              </Text>
              <View style={styles.expertMeta}>
                <Text style={styles.expertSpecialty}>{patient.specialty}</Text>
                {patient.verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                  </View>
                )}
              </View>
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Pressable style={styles.playButton} onPress={handleBookSession}>
                  <Text style={styles.playIcon}>▶</Text>
                  <Text style={styles.playText}>Book Session</Text>
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
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>156 reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statNumber}>5 years</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statNumber}>₹800</Text>
            <Text style={styles.statLabel}>Per session</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>👤</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>About</Text>
          </View>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>{patient.about}</Text>
          </View>
        </View>

        {/* Education Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>🎓</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Education</Text>
          </View>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>{patient.education}</Text>
          </View>
        </View>

        {/* Certifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>📜</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Certifications</Text>
          </View>
          <View style={styles.aboutCard}>
            {patient.certifications.map((cert, index) => (
              <Text key={index} style={styles.certificationItem}>• {cert}</Text>
            ))}
          </View>
        </View>

        {/* Specialties Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>🎯</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Specialties</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.specialtiesContainer}>
              {patient.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyTag}>
                  <Text style={styles.specialtyTagText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Languages Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>🌐</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Languages</Text>
          </View>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>{patient.languages.join(', ')}</Text>
          </View>
        </View>

        {/* Session Types Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>💼</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Session Types</Text>
          </View>
          <View style={styles.aboutCard}>
            {patient.sessionTypes.map((type, index) => (
              <Text key={index} style={styles.sessionTypeItem}>✓ {type}</Text>
            ))}
          </View>
        </View>

        {/* Availability Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <Text style={styles.sectionIcon}>🕐</Text>
            <Text style={[styles.sectionTitle, styles.sectionTitleWithIcon]}>Availability Schedule</Text>
          </View>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>Monday - Friday: 9:00 AM - 6:00 PM</Text>
            <Text style={styles.aboutText}>Saturday: 10:00 AM - 4:00 PM</Text>
            <Text style={styles.aboutText}>Sunday: Closed</Text>
          </View>
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
            <Text style={styles.modalTitle}>Patient Information</Text>
            <Pressable style={styles.closeButton} onPress={() => setShowMoreInfo(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Professional Background</Text>
              <Text style={styles.modalText}>
                Dr. Anya Sharma brings extensive experience in yoga therapy and wellness counseling. 
                She has worked with over 1000+ clients, helping them overcome stress, anxiety, and 
                physical ailments through holistic healing practices.
              </Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Treatment Approach</Text>
              <Text style={styles.modalText}>
                • Personalized yoga sequences based on individual needs{'\n'}
                • Integration of breathing techniques and meditation{'\n'}
                • Mind-body awareness development{'\n'}
                • Stress management and relaxation methods{'\n'}
                • Lifestyle and dietary guidance
              </Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Success Stories</Text>
              <Text style={styles.modalText}>
                "95% of clients report significant improvement in stress levels within 4 weeks"{'\n'}
                "Featured speaker at International Wellness Conference 2023"{'\n'}
                "Author of 'Finding Inner Peace' - bestselling wellness guide"
              </Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Availability & Booking</Text>
              <Text style={styles.modalText}>
                Available for both in-person and online consultations. Sessions can be booked 
                up to 2 weeks in advance. Emergency consultations available with 24-hour notice.
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
  expertNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveHeight(8),
  },
  expertNameWhite: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  expertNameYellow: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold',
    color: '#FFD700',
  },
  expertTitle: {
    fontSize: getResponsiveFontSize(18),
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: getResponsiveHeight(12),
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
});