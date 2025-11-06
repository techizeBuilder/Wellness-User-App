import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/utils/colors';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '@/utils/dimensions';

export default function SubscriptionDetailsScreen() {
  const [showPlansModal, setShowPlansModal] = useState(false);

  const currentSubscription = {
    plan: 'Premium Annual',
    price: '$99.99',
    billing: 'yearly',
    status: 'Active',
    nextBilling: 'Nov 14, 2025',
    startDate: 'Nov 14, 2024',
    features: [
      'Unlimited expert sessions',
      'Priority booking',
      'Exclusive content',
      'Personal wellness tracker',
      'Advanced analytics',
      '24/7 support'
    ]
  };

  const subscriptionHistory = [
    {
      id: 1,
      plan: 'Premium Annual',
      amount: '$99.99',
      date: 'Nov 14, 2024',
      status: 'Active',
      duration: '1 Year'
    },
    {
      id: 2,
      plan: 'Premium Monthly',
      amount: '$12.99',
      date: 'Sep 10, 2024',
      status: 'Cancelled',
      duration: '2 Months'
    },
    {
      id: 3,
      plan: 'Basic Monthly',
      amount: '$7.99',
      date: 'Jun 15, 2024',
      status: 'Completed',
      duration: '3 Months'
    }
  ];

  const availablePlans = [
    {
      id: 1,
      name: 'Basic Monthly',
      price: '$7.99',
      billing: '/month',
      features: ['5 expert sessions', 'Basic content access', 'Email support'],
      color: ['#6B7280', '#4B5563'],
      recommended: false
    },
    {
      id: 2,
      name: 'Premium Monthly',
      price: '$12.99',
      billing: '/month',
      features: ['Unlimited sessions', 'All content', 'Priority support', 'Analytics'],
      color: ['#2DD4BF', '#14B8A6'],
      recommended: false
    },
    {
      id: 3,
      name: 'Premium Annual',
      price: '$99.99',
      billing: '/year',
      originalPrice: '$155.88',
      features: ['Everything in Premium', '2 months free', 'VIP support', 'Early access'],
      color: ['#FFD700', '#F59E0B'],
      recommended: true
    }
  ];

  const handleUpdateSubscription = () => {
    setShowPlansModal(true);
  };

  const handleSelectPlan = (plan) => {
    setShowPlansModal(false);
    // Handle plan selection logic here
    console.log('Selected plan:', plan.name);
  };

  return (
    <LinearGradient
      colors={['#2DD4BF', '#14B8A6', '#0D9488']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Subscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Plan</Text>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
            style={styles.currentPlanCard}
          >
            <View style={styles.planHeader}>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{currentSubscription.plan}</Text>
                <Text style={styles.planPrice}>{currentSubscription.price}<Text style={styles.planBilling}>/{currentSubscription.billing}</Text></Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{currentSubscription.status}</Text>
              </View>
            </View>
            
            <View style={styles.planDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Started:</Text>
                <Text style={styles.detailValue}>{currentSubscription.startDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Next billing:</Text>
                <Text style={styles.detailValue}>{currentSubscription.nextBilling}</Text>
              </View>
            </View>

            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>Included Features</Text>
              {currentSubscription.features.map((feature, index) => (
                <Text key={index} style={styles.featureItem}>✅ {feature}</Text>
              ))}
            </View>

            <Pressable style={styles.updateButton} onPress={handleUpdateSubscription}>
              <LinearGradient
                colors={['#2DD4BF', '#14B8A6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.updateButtonGradient}
              >
                <Text style={styles.updateButtonText}>Update Plan</Text>
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </View>

        {/* Subscription History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription History</Text>
          {subscriptionHistory.map((subscription, index) => (
            <View key={subscription.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyPlan}>{subscription.plan}</Text>
                  <Text style={styles.historyDate}>{subscription.date}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyAmount}>{subscription.amount}</Text>
                  <View style={[
                    styles.historyStatusBadge,
                    subscription.status === 'Active' && styles.statusActive,
                    subscription.status === 'Cancelled' && styles.statusCancelled,
                    subscription.status === 'Completed' && styles.statusCompleted
                  ]}>
                    <Text style={[
                      styles.historyStatusText,
                      subscription.status === 'Active' && styles.statusActiveText,
                      subscription.status === 'Cancelled' && styles.statusCancelledText,
                      subscription.status === 'Completed' && styles.statusCompletedText
                    ]}>
                      {subscription.status}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.historyDuration}>Duration: {subscription.duration}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Plans Modal */}
      <Modal
        visible={showPlansModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPlansModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop}
            onPress={() => setShowPlansModal(false)}
          />
          <View style={styles.plansModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Your Plan</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowPlansModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            
            <ScrollView style={styles.plansContainer} showsVerticalScrollIndicator={false}>
              {availablePlans.map((plan) => (
                <Pressable
                  key={plan.id}
                  style={[styles.planOption, plan.recommended && styles.recommendedPlan]}
                  onPress={() => handleSelectPlan(plan)}
                >
                  <LinearGradient
                    colors={plan.color}
                    style={styles.planOptionGradient}
                  >
                    {plan.recommended && (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedText}>RECOMMENDED</Text>
                      </View>
                    )}
                    
                    <View style={styles.planOptionHeader}>
                      <Text style={styles.planOptionName}>{plan.name}</Text>
                      <View style={styles.planOptionPricing}>
                        <Text style={styles.planOptionPrice}>{plan.price}</Text>
                        <Text style={styles.planOptionBilling}>{plan.billing}</Text>
                      </View>
                      {plan.originalPrice && (
                        <Text style={styles.originalPrice}>Save from {plan.originalPrice}</Text>
                      )}
                    </View>

                    <View style={styles.planOptionFeatures}>
                      {plan.features.map((feature, index) => (
                        <Text key={index} style={styles.planFeature}>• {feature}</Text>
                      ))}
                    </View>

                    <View style={styles.selectButton}>
                      <Text style={styles.selectButtonText}>Select Plan</Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightMistTeal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: getResponsivePadding(50),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(16),
  },
  backButton: {
    width: getResponsiveWidth(40),
    height: getResponsiveHeight(40),
    borderRadius: getResponsiveBorderRadius(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: getResponsiveFontSize(18),
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerRight: {
    width: getResponsiveWidth(40),
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: getResponsivePadding(20),
    paddingTop: getResponsivePadding(24),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: getResponsiveMargin(16),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Current Plan Styles
  currentPlanCard: {
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getResponsiveMargin(16),
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: getResponsiveFontSize(22),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getResponsiveMargin(4),
  },
  planPrice: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  planBilling: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'normal',
    color: '#6B7280',
  },
  statusBadge: {
    backgroundColor: '#2DD4BF',
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderRadius: getResponsiveBorderRadius(20),
  },
  statusText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: 'bold',
    color: 'white',
  },
  planDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 114, 128, 0.2)',
    paddingTop: getResponsivePadding(16),
    marginBottom: getResponsiveMargin(16),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getResponsiveMargin(8),
  },
  detailLabel: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: getResponsiveFontSize(14),
    color: '#1F2937',
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: getResponsiveMargin(20),
  },
  featuresTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getResponsiveMargin(12),
  },
  featureItem: {
    fontSize: getResponsiveFontSize(14),
    color: '#4B5563',
    marginBottom: getResponsiveMargin(6),
    lineHeight: 20,
  },
  updateButton: {
    borderRadius: getResponsiveBorderRadius(12),
    overflow: 'hidden',
  },
  updateButtonGradient: {
    paddingVertical: getResponsivePadding(14),
    paddingHorizontal: getResponsivePadding(24),
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: 'white',
  },
  
  // History Styles
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveMargin(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getResponsiveMargin(8),
  },
  historyInfo: {
    flex: 1,
  },
  historyPlan: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getResponsiveMargin(4),
  },
  historyDate: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: getResponsiveMargin(6),
  },
  historyStatusBadge: {
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(12),
  },
  statusActive: {
    backgroundColor: '#2DD4BF',
  },
  statusCancelled: {
    backgroundColor: '#FF6F61',
  },
  statusCompleted: {
    backgroundColor: '#6B7280',
  },
  historyStatusText: {
    fontSize: getResponsiveFontSize(11),
    fontWeight: 'bold',
  },
  statusActiveText: {
    color: 'white',
  },
  statusCancelledText: {
    color: 'white',
  },
  statusCompletedText: {
    color: 'white',
  },
  historyDuration: {
    fontSize: getResponsiveFontSize(12),
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  plansModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: getResponsiveBorderRadius(20),
    borderTopRightRadius: getResponsiveBorderRadius(20),
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getResponsivePadding(20),
    paddingHorizontal: getResponsivePadding(20),
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1a202c',
  },
  closeButton: {
    padding: getResponsivePadding(4),
  },
  closeButtonText: {
    fontSize: getResponsiveFontSize(18),
    color: '#4a5568',
  },
  plansContainer: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
  },
  planOption: {
    borderRadius: getResponsiveBorderRadius(16),
    marginBottom: getResponsiveMargin(16),
    overflow: 'hidden',
  },
  recommendedPlan: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  planOptionGradient: {
    padding: getResponsivePadding(20),
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700',
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(6),
    borderBottomLeftRadius: getResponsiveBorderRadius(12),
  },
  recommendedText: {
    fontSize: getResponsiveFontSize(10),
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 0.5,
  },
  planOptionHeader: {
    marginBottom: getResponsiveMargin(16),
    marginTop: getResponsiveMargin(8),
  },
  planOptionName: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: getResponsiveMargin(8),
  },
  planOptionPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: getResponsiveMargin(4),
  },
  planOptionPrice: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: 'bold',
    color: 'white',
  },
  planOptionBilling: {
    fontSize: getResponsiveFontSize(16),
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: getResponsiveMargin(4),
  },
  originalPrice: {
    fontSize: getResponsiveFontSize(12),
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'line-through',
  },
  planOptionFeatures: {
    marginBottom: getResponsiveMargin(20),
  },
  planFeature: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: getResponsiveMargin(6),
    lineHeight: 20,
  },
  selectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(24),
    borderRadius: getResponsiveBorderRadius(8),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectButtonText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    color: 'white',
  },
  bottomSpacer: {
    height: getResponsiveHeight(100),
  },
});