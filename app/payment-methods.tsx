import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../src/utils/colors';
import {
    getResponsiveBorderRadius,
    getResponsiveFontSize,
    getResponsiveHeight,
    getResponsiveMargin,
    getResponsivePadding,
    getResponsiveWidth
} from '../src/utils/dimensions';

export default function PaymentMethodsScreen() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const savedCards = [
    {
      id: 1,
      type: 'Visa',
      lastFour: '4242',
      expiryDate: '12/25',
      isDefault: true,
      cardholderName: 'Sophia Bennett'
    },
    {
      id: 2,
      type: 'Mastercard',
      lastFour: '8888',
      expiryDate: '08/26',
      isDefault: false,
      cardholderName: 'Sophia Bennett'
    }
  ];

  const handleAddCard = () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Here you would typically validate and save the card
    Alert.alert('Success', 'Payment method added successfully!');
    setShowAddForm(false);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
  };

  const handleDeleteCard = (cardId: number) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive' }
      ]
    );
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'Visa':
        return '💳';
      case 'Mastercard':
        return '💳';
      case 'Amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      const formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      setExpiryDate(formatted);
    } else {
      setExpiryDate(cleaned);
    }
  };

  return (
    <LinearGradient
      colors={['#2DD4BF', '#14B8A6', '#0D9488']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Add Payment Method Button */}
        <View style={styles.section}>
          <Pressable 
            style={styles.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <LinearGradient
              colors={[colors.coralAccent, '#E55A50']}
              style={styles.addButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>Add New Payment Method</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Add Card Form */}
        {showAddForm && (
          <View style={styles.section}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
              style={styles.addCardForm}
            >
              <Text style={styles.formTitle}>Add New Card</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#999"
                  value={cardNumber}
                  onChangeText={formatCardNumber}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.rowContainer}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#999"
                    value={expiryDate}
                    onChangeText={formatExpiryDate}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#999"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full name on card"
                  placeholderTextColor="#999"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.formButtons}>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                
                <Pressable style={styles.saveButton} onPress={handleAddCard}>
                  <Text style={styles.saveButtonText}>Add Card</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Saved Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
          
          {savedCards.map((card) => (
            <LinearGradient
              key={card.id}
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
              style={styles.cardContainer}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardIcon}>{getCardIcon(card.type)}</Text>
                  <View style={styles.cardInfo}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardType}>{card.type}</Text>
                      {card.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cardNumber}>**** **** **** {card.lastFour}</Text>
                    <Text style={styles.cardExpiry}>Expires {card.expiryDate}</Text>
                    <Text style={styles.cardHolder}>{card.cardholderName}</Text>
                  </View>
                </View>
                
                <Pressable 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteCard(card.id)}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </Pressable>
              </View>
              
              {!card.isDefault && (
                <Pressable style={styles.setDefaultButton}>
                  <Text style={styles.setDefaultText}>Set as Default</Text>
                </Pressable>
              )}
            </LinearGradient>
          ))}
        </View>

        {/* Billing Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing Information</Text>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.25)']}
            style={styles.billingCard}
          >
            <View style={styles.billingItem}>
              <View style={styles.billingHeader}>
                <Text style={styles.billingIcon}>🏠</Text>
                <Text style={styles.billingLabel}>Billing Address</Text>
              </View>
              <Text style={styles.billingValue}>
                123 Wellness Street{'\n'}
                San Francisco, CA 94102{'\n'}
                United States
              </Text>
              <Pressable style={styles.editBillingButton}>
                <Text style={styles.editBillingText}>Edit Address</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        {/* Payment Security */}
        <View style={styles.section}>
          <View style={styles.securityCard}>
            <Text style={styles.securityIcon}>🔒</Text>
            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>Secure Payments</Text>
              <Text style={styles.securityText}>
                Your payment information is encrypted and processed securely. We use industry-standard security measures to protect your data.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: getResponsiveFontSize(18),
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: 'bold',
    color: colors.white,
  },
  headerRight: {
    width: getResponsiveWidth(40),
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: getResponsivePadding(20),
    marginTop: getResponsiveMargin(24),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: getResponsiveMargin(16),
  },
  addButton: {
    borderRadius: getResponsiveBorderRadius(16),
    overflow: 'hidden',
    shadowColor: colors.coralAccent,
    shadowOffset: { width: 0, height: getResponsiveHeight(4) },
    shadowOpacity: 0.3,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 6,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsivePadding(16),
    paddingHorizontal: getResponsivePadding(20),
  },
  addButtonIcon: {
    fontSize: getResponsiveFontSize(20),
    color: colors.white,
    fontWeight: 'bold',
    marginRight: getResponsiveMargin(12),
  },
  addButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: colors.white,
  },
  addCardForm: {
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: getResponsiveHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 3,
  },
  formTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: getResponsiveMargin(20),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(2),
  },
  inputContainer: {
    marginBottom: getResponsiveMargin(16),
  },
  inputLabel: {
    fontSize: getResponsiveFontSize(14),
    color: 'white',
    fontWeight: '600',
    marginBottom: getResponsiveMargin(8),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(1),
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: getResponsiveBorderRadius(12),
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(12),
    fontSize: getResponsiveFontSize(16),
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formButtons: {
    flexDirection: 'row',
    gap: getResponsiveWidth(12),
    marginTop: getResponsiveMargin(20),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(12),
    backgroundColor: colors.warmGray,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: getResponsiveFontSize(16),
    color: colors.charcoalGray,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: getResponsivePadding(12),
    borderRadius: getResponsiveBorderRadius(12),
    backgroundColor: colors.sageGreen,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: getResponsiveFontSize(16),
    color: colors.white,
    fontWeight: '600',
  },
  cardContainer: {
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(16),
    marginBottom: getResponsiveMargin(16),
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: getResponsiveHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    fontSize: getResponsiveFontSize(32),
    marginRight: getResponsiveMargin(16),
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(4),
  },
  cardType: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: 'white',
    marginRight: getResponsiveMargin(12),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(1),
  },
  defaultBadge: {
    backgroundColor: colors.royalGold + '20',
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(2),
    borderRadius: getResponsiveBorderRadius(8),
  },
  defaultText: {
    fontSize: getResponsiveFontSize(12),
    color: colors.royalGold,
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: getResponsiveFontSize(16),
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: getResponsiveMargin(2),
    fontFamily: 'monospace',
  },
  cardExpiry: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: getResponsiveMargin(2),
  },
  cardHolder: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  deleteButton: {
    width: getResponsiveWidth(36),
    height: getResponsiveHeight(36),
    borderRadius: getResponsiveBorderRadius(18),
    backgroundColor: colors.coralAccent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: getResponsiveFontSize(16),
  },
  setDefaultButton: {
    marginTop: getResponsiveMargin(12),
    paddingVertical: getResponsivePadding(8),
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.lightMistTeal,
  },
  setDefaultText: {
    fontSize: getResponsiveFontSize(14),
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(1),
  },
  billingCard: {
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: getResponsiveHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveBorderRadius(8),
    elevation: 3,
  },
  billingItem: {
    alignItems: 'flex-start',
  },
  billingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(12),
  },
  billingIcon: {
    fontSize: getResponsiveFontSize(20),
    marginRight: getResponsiveMargin(12),
  },
  billingLabel: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: getResponsiveHeight(1) },
    textShadowRadius: getResponsiveBorderRadius(1),
  },
  billingValue: {
    fontSize: getResponsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: getResponsiveHeight(20),
    marginBottom: getResponsiveMargin(16),
  },
  editBillingButton: {
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(16),
    backgroundColor: colors.lightMistTeal,
  },
  editBillingText: {
    fontSize: getResponsiveFontSize(14),
    color: colors.deepTeal,
    fontWeight: '600',
  },
  securityCard: {
    flexDirection: 'row',
    backgroundColor: colors.sageGreen + '20',
    borderRadius: getResponsiveBorderRadius(16),
    padding: getResponsivePadding(20),
    borderWidth: 1,
    borderColor: colors.sageGreen + '30',
  },
  securityIcon: {
    fontSize: getResponsiveFontSize(24),
    marginRight: getResponsiveMargin(16),
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: getResponsiveMargin(8),
  },
  securityText: {
    fontSize: getResponsiveFontSize(14),
    color: colors.charcoalGray,
    lineHeight: getResponsiveHeight(20),
  },
  bottomSpacer: {
    height: getResponsiveHeight(40),
  },
});
