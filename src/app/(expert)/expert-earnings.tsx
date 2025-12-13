import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Pressable,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import ExpertFooter, { EXPERT_FOOTER_HEIGHT } from '@/components/ExpertFooter';
import { apiService } from '@/services/apiService';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsivePadding,
    getResponsiveWidth,
} from '@/utils/dimensions';

const { width } = Dimensions.get('window');

interface Transaction {
  id: string;
  date: string;
  patientName: string;
  amount: number;
  sessionType: string;
  status: 'completed' | 'pending';
}

interface MonthlyEarnings {
  month: string;
  earnings: number;
}

export default function ExpertEarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    thisWeek: 0,
    averagePerSession: 0,
    totalSessions: 0,
    pendingPayments: 0
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<MonthlyEarnings[]>([]);

  const fetchEarningsData = async () => {
    try {
      setError(null);
      
      // Fetch earnings summary and payouts in parallel
      const [earningsResponse, payoutsResponse, bookingsResponse] = await Promise.all([
        apiService.getExpertEarnings(),
        apiService.getExpertPayouts(),
        apiService.getExpertBookings({ limit: 1000 })
      ]);
      
      let monthlyEarnings = 0;
      let totalEarnings = 0;
      let weeklyEarnings = 0;
      let pendingPayout = 0;
      
      if (earningsResponse.success && earningsResponse.data) {
        const { daily, weekly, monthly, total } = earningsResponse.data;
        monthlyEarnings = monthly || 0;
        totalEarnings = total || 0;
        weeklyEarnings = weekly || 0;
      }
      
      if (payoutsResponse.success && payoutsResponse.data) {
        pendingPayout = payoutsResponse.data.pendingPayout || 0;
        
        // Fetch recent transactions from payouts
        if (payoutsResponse.data.recentPayouts) {
          const transactions: Transaction[] = payoutsResponse.data.recentPayouts.map((payout: any, index: number) => {
            const date = new Date(payout.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            });
            
            return {
              id: `transaction-${index}`,
              date: formattedDate,
              patientName: payout.user?.name || 'Client',
              amount: payout.amount || 0,
              sessionType: payout.description || 'Consultation',
              status: 'completed' as const
            };
          });
          setRecentTransactions(transactions);
        }
      }
      
      // Calculate total sessions and average per session
      const completedBookings = bookingsResponse.success && bookingsResponse.data?.appointments
        ? bookingsResponse.data.appointments.filter((apt: any) => apt.status === 'completed')
        : [];
      
      const totalSessions = completedBookings.length;
      const averagePerSession = totalSessions > 0 && totalEarnings > 0 
        ? Math.round(totalEarnings / totalSessions) 
        : 0;
      
      // Calculate last month earnings (simplified - would need historical data for accurate calculation)
      // For now, we'll use a placeholder
      const lastMonth = 0; // This would need historical API data
      
      setEarningsData({
        totalEarnings: totalEarnings,
        thisMonth: monthlyEarnings,
        lastMonth: lastMonth,
        thisWeek: weeklyEarnings,
        averagePerSession: averagePerSession,
        totalSessions: totalSessions,
        pendingPayments: pendingPayout
      });

      // For monthly breakdown, we'll create a simplified version
      // In a production app, you'd want an API endpoint that returns monthly earnings
      const currentMonth = new Date().getMonth();
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
      
      // Create last 6 months breakdown (simplified - using current month data)
      const breakdown: MonthlyEarnings[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        breakdown.push({
          month: months[monthIndex],
          earnings: i === 0 ? monthlyEarnings : 0 // Only current month has real data
        });
      }
      setMonthlyBreakdown(breakdown);
      
    } catch (err: any) {
      console.error('Error fetching earnings data:', err);
      setError(err.message || 'Failed to load earnings data');
      Alert.alert('Error', err.message || 'Failed to load earnings data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchEarningsData();
  };

  const handleExportReport = () => {
    Alert.alert(
      "Export Report", 
      "This feature will export your earnings report as a PDF or CSV file.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Export", 
          onPress: () => {
            // TODO: Implement export functionality
            Alert.alert("Success", "Report export feature coming soon!");
          }
        }
      ]
    );
  };

  const handleRequestWithdrawal = () => {
    Alert.alert(
      "Request Withdrawal",
      `You have ₹${earningsData.pendingPayments.toLocaleString()} available for withdrawal. Would you like to request a withdrawal?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Request", 
          onPress: () => {
            // TODO: Implement withdrawal request
            Alert.alert("Success", "Withdrawal request submitted! You will receive payment within 3-5 business days.");
          }
        }
      ]
    );
  };

  const handleViewDetails = (transactionId: string) => {
    const transaction = recentTransactions.find(t => t.id === transactionId);
    if (transaction) {
      Alert.alert(
        "Transaction Details",
        `Patient: ${transaction.patientName}\n` +
        `Date: ${transaction.date}\n` +
        `Amount: ₹${transaction.amount}\n` +
        `Type: ${transaction.sessionType}\n` +
        `Status: ${transaction.status}`,
        [{ text: "OK" }]
      );
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2DD4BF" translucent />
        <LinearGradient
          colors={['#2da898ff', '#abeee6ff']}
          style={styles.backgroundGradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={styles.loadingText}>Loading earnings data...</Text>
          </View>
        </LinearGradient>
        <ExpertFooter activeRoute="earnings" />
      </View>
    );
  }

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
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#059669"
              colors={['#059669']}
            />
          }
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Earnings Dashboard</Text>
            <Text style={styles.subtitle}>Track your income and financial performance</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={fetchEarningsData} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          )}

          {/* Total Earnings Card */}
          <View style={styles.totalEarningsCard}>
            <Text style={styles.totalEarningsLabel}>Total Earnings</Text>
            <Text style={styles.totalEarningsAmount}>
              ₹{earningsData.totalEarnings.toLocaleString()}
            </Text>
            <View style={styles.earningsStats}>
              <View style={styles.earningsStat}>
                <Text style={styles.earningsStatValue}>
                  ₹{earningsData.thisMonth.toLocaleString()}
                </Text>
                <Text style={styles.earningsStatLabel}>This Month</Text>
              </View>
              <View style={styles.earningsStat}>
                <Text style={styles.earningsStatValue}>
                  ₹{earningsData.averagePerSession.toLocaleString()}
                </Text>
                <Text style={styles.earningsStatLabel}>Avg/Session</Text>
              </View>
              <View style={styles.earingsStat}>
                <Text style={styles.earningsStatValue}>
                  {earningsData.totalSessions.toLocaleString()}
                </Text>
                <Text style={styles.earningsStatLabel}>Total Sessions</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStatsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                ₹{earningsData.thisWeek.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                ₹{earningsData.pendingPayments.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                ₹{earningsData.lastMonth.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Last Month</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <Pressable style={styles.actionButton} onPress={handleExportReport}>
              <Text style={styles.actionButtonText}>Export Report</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={handleRequestWithdrawal}>
              <Text style={styles.actionButtonText}>Request Withdrawal</Text>
            </Pressable>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsContainer}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            
            {recentTransactions.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No transactions found</Text>
              </View>
            ) : (
              recentTransactions.map((transaction) => (
                <Pressable 
                  key={transaction.id}
                  style={styles.transactionCard}
                  onPress={() => handleViewDetails(transaction.id)}
                >
                  <View style={styles.transactionHeader}>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: transaction.status === 'completed' ? '#059669' : '#F59E0B' }
                    ]}>
                      <Text style={styles.statusText}>{transaction.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.patientName}>{transaction.patientName}</Text>
                  <Text style={styles.sessionType}>{transaction.sessionType}</Text>
                  <Text style={styles.transactionAmount}>
                    ₹{transaction.amount.toLocaleString()}
                  </Text>
                </Pressable>
              ))
            )}
          </View>

          {/* Monthly Breakdown */}
          <View style={styles.monthlyContainer}>
            <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
            
            {monthlyBreakdown.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No monthly data available</Text>
              </View>
            ) : (
              monthlyBreakdown.slice(-6).map((month, index) => (
                <View key={`${month.month}-${index}`} style={styles.monthlyItem}>
                  <Text style={styles.monthName}>{month.month}</Text>
                  <Text style={styles.monthEarnings}>
                    ₹{month.earnings.toLocaleString()}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={{ height: EXPERT_FOOTER_HEIGHT + 20 }} />
        </ScrollView>
      </LinearGradient>
      <ExpertFooter activeRoute="earnings" />
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
  totalEarningsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(24),
    marginBottom: getResponsiveHeight(24),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  totalEarningsLabel: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    marginBottom: getResponsiveHeight(8),
    fontWeight: '600',
  },
  totalEarningsAmount: {
    fontSize: getResponsiveFontSize(36),
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: getResponsiveHeight(16),
  },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  earningsStat: {
    alignItems: 'center',
  },
  earningsStatValue: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getResponsiveHeight(4),
    textAlign: 'center',
  },
  earningsStatLabel: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
  },
  quickStatsContainer: {
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
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getResponsiveHeight(24),
  },
  actionButton: {
    backgroundColor: '#059669',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    flex: 1,
    marginHorizontal: getResponsiveWidth(6),
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
  },
  transactionsContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: getResponsiveHeight(16),
  },
  transactionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(14),
    marginBottom: getResponsiveHeight(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveHeight(8),
  },
  transactionDate: {
    fontSize: getResponsiveFontSize(12),
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: getResponsiveWidth(8),
    paddingVertical: getResponsiveHeight(4),
    borderRadius: getResponsiveBorderRadius(12),
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(10),
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  patientName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: getResponsiveHeight(4),
  },
  sessionType: {
    fontSize: getResponsiveFontSize(14),
    color: '#059669',
    fontWeight: '600',
    marginBottom: getResponsiveHeight(8),
  },
  transactionAmount: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  monthlyContainer: {
    marginBottom: getResponsiveHeight(24),
  },
  monthlyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(8),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveHeight(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthName: {
    fontSize: getResponsiveFontSize(14),
    color: '#1F2937',
    fontWeight: '600',
  },
  monthEarnings: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: '#10B981',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: getResponsiveHeight(100),
  },
  loadingText: {
    marginTop: getResponsiveHeight(16),
    fontSize: getResponsiveFontSize(16),
    color: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveHeight(16),
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: getResponsiveFontSize(14),
    textAlign: 'center',
    marginBottom: getResponsiveHeight(8),
  },
  retryButton: {
    backgroundColor: '#EF4444',
    borderRadius: getResponsiveBorderRadius(8),
    paddingHorizontal: getResponsiveWidth(16),
    paddingVertical: getResponsiveHeight(8),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
  },
  emptyStateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: getResponsiveBorderRadius(12),
    padding: getResponsivePadding(24),
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: getResponsiveFontSize(14),
    color: '#6B7280',
    textAlign: 'center',
  },
});