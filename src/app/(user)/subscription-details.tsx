import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/utils/colors';
import apiService from '@/services/apiService';
import { handleApiError } from '@/utils/errorHandler';
import { resolveProfileImageUrl } from '@/utils/imageHelpers';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '@/utils/dimensions';

type Subscription = {
  _id: string;
  planName: string;
  planType: 'single' | 'monthly';
  expert: {
    _id: string;
    name: string;
    specialization: string;
    profileImage?: string;
  };
  startDate: string;
  expiryDate: string;
  nextBillingDate?: string;
  totalSessions: number;
  sessionsUsed: number;
  sessionsRemaining: number;
  monthlyPrice?: number;
  autoRenewal: boolean;
  planInstanceId: string;
};

export default function SubscriptionDetailsScreen() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMySubscriptions();
      if (response.success && response.data?.subscriptions) {
        setSubscriptions(response.data.subscriptions);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      Alert.alert('Error', handleApiError(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSubscriptions();
  };

  const handleCancelSubscription = (subscription: Subscription) => {
    Alert.alert(
      'Cancel Subscription',
      `Are you sure you want to cancel "${subscription.planName}"? This action cannot be undone.`,
      [
        {
          text: 'Keep Subscription',
          style: 'cancel',
        },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingId(subscription._id);
              await apiService.cancelSubscription(subscription._id);
              Alert.alert('Success', 'Subscription cancelled successfully');
              fetchSubscriptions();
            } catch (error) {
              Alert.alert('Error', handleApiError(error));
            } finally {
              setCancellingId(null);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#2DD4BF', '#14B8A6', '#0D9488']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading subscriptions...</Text>
        </View>
      </LinearGradient>
    );
  }

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
        <Text style={styles.headerTitle}>My Subscriptions</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="white" />
        }
      >
        {subscriptions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Active Subscriptions</Text>
            <Text style={styles.emptyText}>
              You don't have any active subscriptions yet.{'\n'}
              Browse experts and subscribe to their plans to get started.
            </Text>
            <Pressable
              style={styles.browseButton}
              onPress={() => router.push('/(user)/experts')}
            >
              <Text style={styles.browseButtonText}>Browse Experts</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Active Subscriptions ({subscriptions.length})</Text>
              {subscriptions.map((subscription) => (
                <View key={subscription._id} style={styles.subscriptionCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.expertInfo}>
                      {subscription.expert.profileImage && (
                        <Image
                          source={{ uri: resolveProfileImageUrl(subscription.expert.profileImage) }}
                          style={styles.expertImage}
                        />
                      )}
                      <View style={styles.expertDetails}>
                        <Text style={styles.planName}>{subscription.planName}</Text>
                        <Text style={styles.expertName}>{subscription.expert.name}</Text>
                        <Text style={styles.expertSpecialty}>{subscription.expert.specialization}</Text>
                      </View>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>Active</Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Sessions Remaining:</Text>
                      <Text style={styles.infoValue}>
                        {subscription.sessionsRemaining} / {subscription.totalSessions}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Expiry Date:</Text>
                      <Text style={styles.infoValue}>{formatDate(subscription.expiryDate)}</Text>
                    </View>
                    {subscription.nextBillingDate && (
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Next Billing:</Text>
                        <Text style={styles.infoValue}>{formatDate(subscription.nextBillingDate)}</Text>
                      </View>
                    )}
                    {subscription.monthlyPrice && (
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Monthly Price:</Text>
                        <Text style={styles.infoValue}>{formatCurrency(subscription.monthlyPrice)}</Text>
                      </View>
                    )}
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Auto Renewal:</Text>
                      <Text style={styles.infoValue}>
                        {subscription.autoRenewal ? '✅ Enabled' : '❌ Disabled'}
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    style={[
                      styles.cancelButton,
                      cancellingId === subscription._id && styles.cancelButtonDisabled
                    ]}
                    onPress={() => handleCancelSubscription(subscription)}
                    disabled={cancellingId === subscription._id}
                  >
                    {cancellingId === subscription._id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
            <View style={styles.bottomSpacer} />
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightMistTeal,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: getResponsiveMargin(16),
    fontSize: getResponsiveFontSize(16),
    color: 'white',
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
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: 'white',
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
  },
  subscriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    marginBottom: getResponsiveMargin(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getResponsiveMargin(16),
  },
  expertInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  expertImage: {
    width: getResponsiveWidth(50),
    height: getResponsiveHeight(50),
    borderRadius: getResponsiveBorderRadius(25),
    marginRight: getResponsiveMargin(12),
  },
  expertDetails: {
    flex: 1,
  },
  planName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getResponsiveMargin(4),
  },
  expertName: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: getResponsiveMargin(2),
  },
  expertSpecialty: {
    fontSize: getResponsiveFontSize(12),
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
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 114, 128, 0.2)',
    paddingTop: getResponsivePadding(16),
    marginBottom: getResponsiveMargin(16),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getResponsiveMargin(10),
  },
  infoLabel: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: getResponsiveFontSize(14),
    color: '#1F2937',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(24),
    borderRadius: getResponsiveBorderRadius(12),
    alignItems: 'center',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: 'bold',
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: getResponsivePadding(100),
    paddingHorizontal: getResponsivePadding(40),
  },
  emptyIcon: {
    fontSize: getResponsiveFontSize(64),
    marginBottom: getResponsiveMargin(16),
  },
  emptyTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: getResponsiveMargin(8),
    textAlign: 'center',
  },
  emptyText: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: getResponsiveMargin(24),
  },
  browseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(24),
    borderRadius: getResponsiveBorderRadius(12),
  },
  browseButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: 'white',
  },
  bottomSpacer: {
    height: getResponsiveHeight(100),
  },
});
