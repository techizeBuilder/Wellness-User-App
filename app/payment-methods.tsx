import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../src/utils/colors';

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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 16,
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.coralAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  addButtonIcon: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
    marginRight: 12,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  addCardForm: {
    borderRadius: 16,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
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
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.warmGray,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.charcoalGray,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.sageGreen,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
  },
  cardContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    fontSize: 32,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  defaultBadge: {
    backgroundColor: colors.royalGold + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  defaultText: {
    fontSize: 12,
    color: colors.royalGold,
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  cardExpiry: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  cardHolder: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.coralAccent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 16,
  },
  setDefaultButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.lightMistTeal,
  },
  setDefaultText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  billingCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  billingItem: {
    alignItems: 'flex-start',
  },
  billingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  billingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  billingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  billingValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  editBillingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.lightMistTeal,
  },
  editBillingText: {
    fontSize: 14,
    color: colors.deepTeal,
    fontWeight: '600',
  },
  securityCard: {
    flexDirection: 'row',
    backgroundColor: colors.sageGreen + '20',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.sageGreen + '30',
  },
  securityIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.deepTeal,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: colors.charcoalGray,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});
