import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
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
    getResponsivePadding,
    getResponsiveWidth,
} from '../src/utils/dimensions';

const { width } = Dimensions.get('window');

export default function ExpertEarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const earningsData = {
    totalEarnings: 12500,
    thisMonth: 2850,
    lastMonth: 3200,
    thisWeek: 750,
    averagePerSession: 95,
    totalSessions: 132,
    pendingPayments: 450
  };

  const recentTransactions = [
    {
      id: 1,
      date: "Nov 1, 2025",
      patientName: "John Smith",
      amount: 95,
      sessionType: "Video Call",
      status: "completed"
    },
    {
      id: 2,
      date: "Oct 31, 2025",
      patientName: "Emily Davis",
      amount: 120,
      sessionType: "In-Person",
      status: "completed"
    },
    {
      id: 3,
      date: "Oct 30, 2025",
      patientName: "Michael Brown",
      amount: 75,
      sessionType: "Video Call",
      status: "pending"
    },
    {
      id: 4,
      date: "Oct 29, 2025",
      patientName: "Lisa Wilson",
      amount: 95,
      sessionType: "Video Call",
      status: "completed"
    }
  ];

  const monthlyBreakdown = [
    { month: "January", earnings: 2100 },
    { month: "February", earnings: 2450 },
    { month: "March", earnings: 2800 },
    { month: "April", earnings: 2650 },
    { month: "May", earnings: 2950 },
    { month: "June", earnings: 3200 },
    { month: "July", earnings: 2900 },
    { month: "August", earnings: 3100 },
    { month: "September", earnings: 2850 },
    { month: "October", earnings: 3200 },
    { month: "November", earnings: 2850 }
  ];

  const handleExportReport = () => {
    Alert.alert("Export Report", "This feature will export your earnings report.");
  };

  const handleViewDetails = (transactionId: number) => {
    Alert.alert(
      "Transaction Details",
      `View details for transaction ${transactionId}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "View", onPress: () => console.log(`Viewing transaction ${transactionId}`) }
      ]
    );
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
            <Text style={styles.title}>Earnings Dashboard</Text>
            <Text style={styles.subtitle}>Track your income and financial performance</Text>
          </View>

          {/* Total Earnings Card */}
          <View style={styles.totalEarningsCard}>
            <Text style={styles.totalEarningsLabel}>Total Earnings</Text>
            <Text style={styles.totalEarningsAmount}>${earningsData.totalEarnings.toLocaleString()}</Text>
            <View style={styles.earningsStats}>
              <View style={styles.earningsStat}>
                <Text style={styles.earningsStatValue}>${earningsData.thisMonth}</Text>
                <Text style={styles.earningsStatLabel}>This Month</Text>
              </View>
              <View style={styles.earningsStat}>
                <Text style={styles.earningsStatValue}>${earningsData.averagePerSession}</Text>
                <Text style={styles.earningsStatLabel}>Avg/Session</Text>
              </View>
              <View style={styles.earingsStat}>
                <Text style={styles.earningsStatValue}>{earningsData.totalSessions}</Text>
                <Text style={styles.earningsStatLabel}>Total Sessions</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStatsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>${earningsData.thisWeek}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>${earningsData.pendingPayments}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>${earningsData.lastMonth}</Text>
              <Text style={styles.statLabel}>Last Month</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <Pressable style={styles.actionButton} onPress={handleExportReport}>
              <Text style={styles.actionButtonText}>Export Report</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => Alert.alert('Withdraw', 'Request withdrawal')}>
              <Text style={styles.actionButtonText}>Request Withdrawal</Text>
            </Pressable>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsContainer}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            
            {recentTransactions.map((transaction) => (
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
                <Text style={styles.transactionAmount}>${transaction.amount}</Text>
              </Pressable>
            ))}
          </View>

          {/* Monthly Breakdown */}
          <View style={styles.monthlyContainer}>
            <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
            
            {monthlyBreakdown.slice(-6).map((month, index) => (
              <View key={month.month} style={styles.monthlyItem}>
                <Text style={styles.monthName}>{month.month}</Text>
                <Text style={styles.monthEarnings}>${month.earnings}</Text>
              </View>
            ))}
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
    fontSize: getResponsiveFontSize(16),
    color: '#6B7280',
    marginBottom: getResponsiveHeight(8),
  },
  totalEarningsAmount: {
    fontSize: getResponsiveFontSize(36),
    fontWeight: 'bold',
    color: '#059669',
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
    padding: getResponsivePadding(16),
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
    color: '#059669',
  },
});