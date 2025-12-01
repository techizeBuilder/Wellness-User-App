import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  getResponsiveBorderRadius,
  getResponsiveFontSize,
  getResponsiveHeight,
  getResponsiveMargin,
  getResponsivePadding,
} from '@/utils/dimensions';
import { apiService, handleApiError } from '@/services/apiService';

type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

type PaymentHistoryItem = {
  _id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  paymentMethod?: string;
  createdAt: string;
  appointment?: {
    _id: string;
    sessionDate: string;
    startTime: string;
    duration: number;
  };
  expert?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    specialization?: string;
  };
};

export default function PaymentHistoryScreen() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPaymentHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await apiService.getPaymentHistory({ page: 1, limit: 100 });
      const data = response?.data || response;
      const items: PaymentHistoryItem[] = data?.payments || data?.data?.payments || [];

      // Sort newest first
      items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPayments(items);
    } catch (error) {
      Alert.alert('Error', handleApiError(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPaymentHistory();
    }, [])
  );

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currency === 'INR' ? '₹' : '';
    return `${symbol}${amount.toFixed(0)}`;
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusStyles = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return { bg: 'rgba(34,197,94,0.12)', text: '#16A34A', border: 'rgba(34,197,94,0.4)', label: 'Paid' };
      case 'processing':
      case 'pending':
        return { bg: 'rgba(250,204,21,0.10)', text: '#CA8A04', border: 'rgba(250,204,21,0.4)', label: 'Processing' };
      case 'refunded':
        return { bg: 'rgba(59,130,246,0.10)', text: '#2563EB', border: 'rgba(59,130,246,0.45)', label: 'Refunded' };
      case 'cancelled':
      case 'failed':
      default:
        return { bg: 'rgba(248,113,113,0.10)', text: '#DC2626', border: 'rgba(248,113,113,0.5)', label: 'Failed' };
    }
  };

  const renderItem = ({ item }: { item: PaymentHistoryItem }) => {
    const expertName =
      [item.expert?.firstName, item.expert?.lastName].filter(Boolean).join(' ') ||
      'Expert';
    const sessionSummary = item.appointment
      ? `${new Date(item.appointment.sessionDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        })} • ${item.appointment.duration} min`
      : undefined;

    const statusStyles = getStatusStyles(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.amountText}>
              {formatAmount(item.amount, item.currency)}
            </Text>
            <Text style={styles.expertText} numberOfLines={1}>
              {expertName}
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: statusStyles.bg,
                borderColor: statusStyles.border,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyles.text }]}>
              {statusStyles.label}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          {item.description ? (
            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          {sessionSummary ? (
            <Text style={styles.sessionText}>{sessionSummary}</Text>
          ) : null}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>{formatDateTime(item.createdAt)}</Text>
          {item.paymentMethod ? (
            <Text style={styles.methodText}>
              {item.paymentMethod.toUpperCase()}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  const ListEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.emptyText}>Loading payments...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💸</Text>
        <Text style={styles.emptyTitle}>No payments yet</Text>
        <Text style={styles.emptyText}>
          Once you book sessions and complete payments, they will appear here.
        </Text>
        <Pressable
          style={styles.ctaButton}
          onPress={() => router.push('/(user)/experts')}
        >
          <Text style={styles.ctaButtonText}>Book a Session</Text>
        </Pressable>
      </View>
    );
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
        <View style={styles.headerTopRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Payment History</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Track all your payments for sessions and plans.
        </Text>
      </View>

      <FlatList
        data={payments}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={ListEmpty}
        refreshing={refreshing}
        onRefresh={() => fetchPaymentHistory(true)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: getResponsivePadding(56),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  backButton: {
    width: getResponsiveHeight(32),
    height: getResponsiveHeight(32),
    borderRadius: getResponsiveBorderRadius(999),
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.15)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getResponsiveMargin(8),
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(16),
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    color: 'rgba(249, 250, 251, 0.8)',
    fontSize: getResponsiveFontSize(13),
    marginTop: getResponsiveMargin(4),
  },
  listContent: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(24),
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveMargin(12),
    borderWidth: 0,
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: getResponsiveMargin(8),
  },
  amountText: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '700',
    color: '#0F172A',
  },
  expertText: {
    marginTop: getResponsiveMargin(2),
    fontSize: getResponsiveFontSize(13),
    color: '#4B5563',
  },
  statusPill: {
    paddingHorizontal: getResponsivePadding(10),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveBorderRadius(999),
    borderWidth: 1,
  },
  statusText: {
    fontSize: getResponsiveFontSize(11),
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: getResponsiveMargin(8),
  },
  descriptionText: {
    fontSize: getResponsiveFontSize(13),
    color: '#111827',
  },
  sessionText: {
    marginTop: getResponsiveMargin(4),
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: getResponsiveFontSize(11),
    color: '#6B7280',
  },
  methodText: {
    fontSize: getResponsiveFontSize(11),
    color: '#0F172A',
    fontWeight: '500',
  },
  emptyContainer: {
    paddingTop: getResponsivePadding(80),
    paddingHorizontal: getResponsivePadding(24),
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: getResponsiveFontSize(48),
    marginBottom: getResponsiveMargin(12),
  },
  emptyTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: getResponsiveMargin(4),
    textAlign: 'center',
  },
  emptyText: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(209, 213, 219, 0.9)',
    textAlign: 'center',
    marginBottom: getResponsiveMargin(16),
  },
  ctaButton: {
    marginTop: getResponsiveMargin(4),
    backgroundColor: '#F59E0B',
    paddingHorizontal: getResponsivePadding(20),
    paddingVertical: getResponsivePadding(10),
    borderRadius: getResponsiveBorderRadius(999),
  },
  ctaButtonText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: getResponsiveFontSize(14),
  },
});


