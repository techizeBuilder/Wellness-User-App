import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const [showPaymentTypeModal, setShowPaymentTypeModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [upiId, setUpiId] = useState('');
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      brand: 'Visa',
      lastFour: '4242',
      expiryDate: '12/25',
      isDefault: true,
      cardholderName: 'Sophia Bennett',
      logo: '💳'
    },
    {
      id: 2,
      type: 'card',
      brand: 'Mastercard',
      lastFour: '8888',
      expiryDate: '08/26',
      isDefault: false,
      cardholderName: 'Sophia Bennett',
      logo: '💳'
    },
    {
      id: 3,
      type: 'card',
      brand: 'American Express',
      lastFour: '1005',
      expiryDate: '03/27',
      isDefault: false,
      cardholderName: 'Sophia Bennett',
      logo: '💳'
    },
    {
      id: 4,
      type: 'upi',
      brand: 'UPI',
      upiId: 'sophia@paytm',
      isDefault: false,
      cardholderName: 'Sophia Bennett',
      logo: '📱'
    },
    {
      id: 5,
      type: 'card',
      brand: 'Visa',
      lastFour: '7890',
      expiryDate: '11/28',
      isDefault: false,
      cardholderName: 'Sophia Bennett',
      logo: '💳'
    },
    {
      id: 6,
      type: 'upi',
      brand: 'UPI',
      upiId: 'sophia@googlepay',
      isDefault: false,
      cardholderName: 'Sophia Bennett',
      logo: '📱'
    }
  ]);
  
  const [animatedValues] = useState(() => {
    const values = {};
    for (let i = 1; i <= 6; i++) {
      values['card' + i] = new Animated.Value(1);
    }
    return values;
  });

  const paymentTypes = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI', icon: '📱' }
  ];

  const handleCardPress = (cardId) => {
    const animKey = 'card' + cardId;
    if (animatedValues[animKey]) {
      Animated.sequence([
        Animated.timing(animatedValues[animKey], {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[animKey], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleSetDefault = (cardId) => {
    const currentDefault = paymentMethods.find(method => method.isDefault);
    const newDefault = paymentMethods.find(method => method.id === cardId);
    
    if (currentDefault && currentDefault.id !== cardId) {
      Alert.alert(
        'Set Default Payment Method',
        `Set ${newDefault.type === 'card' ? newDefault.brand + ' ****' + newDefault.lastFour : newDefault.upiId} as default?`,
        [
          { 
            text: 'Cancel', 
            style: 'cancel'
          },
          { 
            text: 'Set Default', 
            onPress: () => {
              setPaymentMethods(prevMethods => {
                const updatedMethods = prevMethods.map(method => ({
                  ...method,
                  isDefault: method.id === cardId
                }));
                return [...updatedMethods];
              });
            }
          }
        ]
      );
    }
  };

  const handleDeleteCard = (cardId) => {
    const methodToDelete = paymentMethods.find(method => method.id === cardId);
    
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to remove ' + (methodToDelete.type === 'card' ? methodToDelete.brand + ' ****' + methodToDelete.lastFour : methodToDelete.upiId) + '?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            const updatedMethods = paymentMethods.filter(method => method.id !== cardId);
            
            if (methodToDelete.isDefault && updatedMethods.length > 0) {
              updatedMethods[0].isDefault = true;
            }
            
            setPaymentMethods(updatedMethods);
            Alert.alert('Success', 'Payment method removed!');
          }
        }
      ]
    );
  };

  const handleAddPaymentMethod = () => {
    setShowPaymentTypeModal(true);
  };

  const handlePaymentTypeSelect = (type) => {
    setSelectedPaymentType(type);
    setShowPaymentTypeModal(false);
    setShowAddForm(true);
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ');
    return formatted.trim();
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const getCardBrand = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Card';
  };

  const handleAddCard = () => {
    const newId = Math.max(...paymentMethods.map(m => m.id)) + 1;
    
    if (selectedPaymentType === 'card') {
      const newCard = {
        id: newId,
        type: 'card',
        brand: getCardBrand(cardNumber) || 'Visa',
        lastFour: cardNumber.slice(-4) || '0000',
        expiryDate: expiryDate || '12/25',
        isDefault: paymentMethods.length === 0,
        cardholderName: cardholderName || 'Dummy User',
        logo: '💳'
      };
      setPaymentMethods(prev => [...prev, newCard]);
    } else {
      const newUPI = {
        id: newId,
        type: 'upi',
        brand: 'UPI',
        upiId: upiId || ('dummy' + newId + '@upi'),
        isDefault: paymentMethods.length === 0,
        cardholderName: 'Dummy User',
        logo: '📱'
      };
      setPaymentMethods(prev => [...prev, newUPI]);
    }
    
    Alert.alert('Success', 'Payment method added successfully!');
    setShowAddForm(false);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
    setUpiId('');
    setSelectedPaymentType('');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#37b9a8', '#37b9a8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Pressable style={styles.addPaymentButton} onPress={handleAddPaymentMethod}>
            <Text style={styles.addPaymentIcon}>+</Text>
            <Text style={styles.addPaymentText}>Add Payment Method</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Payment Methods ({paymentMethods.length})</Text>
          
          {paymentMethods.map((method, index) => (
            <View key={`card-${method.id}-${Date.now()}`}>
              <View style={[
                styles.cardItem,
                method.isDefault && styles.defaultCardItem,
              ]}>
                <Pressable 
                  style={styles.cardContent}
                  onPress={() => {
                    if (!method.isDefault) {
                      handleSetDefault(method.id);
                    } else {
                      handleCardPress(method.id);
                    }
                  }}
                  android_ripple={{ color: 'rgba(55, 185, 168, 0.1)' }}
                >
                  <View style={styles.cardInfo}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardType}>
                        {method.type === 'card' ? method.brand : 'UPI'}
                      </Text>
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.cardDetails}>
                      <Text style={styles.cardNumber}>
                        {method.type === 'card' 
                          ? '•••• •••• •••• ' + method.lastFour
                          : method.upiId
                        }
                      </Text>
                      {method.type === 'card' && (
                        <Text style={styles.cardExpiry}>Expires {method.expiryDate}</Text>
                      )}
                      <Text style={styles.cardHolder}>{method.cardholderName}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.cardActions}>
                    <Text style={styles.cardBrandIcon}>{method.logo}</Text>
                    <Pressable 
                      style={styles.setDefaultButton}
                      onPress={() => {
                        if (!method.isDefault) {
                          handleSetDefault(method.id);
                        } else {
                          handleCardPress(method.id);
                        }
                      }}
                    >
                      <Text style={styles.setDefaultIcon}>
                        {method.isDefault ? '⭐' : '☆'}
                      </Text>
                    </Pressable>
                    <Pressable 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteCard(method.id)}
                    >
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </Pressable>
                  </View>
                </Pressable>
              </View>
              
              {index < paymentMethods.length - 1 && <View style={styles.cardDivider} />}
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={showPaymentTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop}
            onPress={() => setShowPaymentTypeModal(false)}
          />
          <View style={styles.paymentTypeModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Type</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowPaymentTypeModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            
            <View style={styles.paymentTypesList}>
              {paymentTypes.map((type) => (
                <Pressable
                  key={type.id}
                  style={styles.paymentTypeItem}
                  onPress={() => handlePaymentTypeSelect(type.id)}
                >
                  <Text style={styles.paymentTypeIcon}>{type.icon}</Text>
                  <Text style={styles.paymentTypeName}>{type.name}</Text>
                  <Text style={styles.paymentTypeArrow}>→</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddForm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddForm(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop}
            onPress={() => setShowAddForm(false)}
          />
          <View style={styles.addCardModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedPaymentType === 'card' ? 'Add New Card' : 'Add UPI ID'}
              </Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {selectedPaymentType === 'card' ? (
                <View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Card Number</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="1234 5678 9012 3456"
                      placeholderTextColor="#4a5568"
                      value={cardNumber}
                      onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                      keyboardType="numeric"
                      maxLength={19}
                    />
                    {cardNumber && (
                      <Text style={styles.cardBrandText}>{getCardBrand(cardNumber)}</Text>
                    )}
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>Expiry Date</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="MM/YY"
                        placeholderTextColor="#4a5568"
                        value={expiryDate}
                        onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                    
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="123"
                        placeholderTextColor="#4a5568"
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Cardholder Name</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Full name on card"
                      placeholderTextColor="#4a5568"
                      value={cardholderName}
                      onChangeText={setCardholderName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>UPI ID</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="yourname@upi"
                    placeholderTextColor="#4a5568"
                    value={upiId}
                    onChangeText={setUpiId}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              )}
              
              <View style={styles.actionButtons}>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.addButton}
                  onPress={handleAddCard}
                >
                  <Text style={styles.addButtonText}>
                    {selectedPaymentType === 'card' ? 'Add Card' : 'Add UPI'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: getResponsivePadding(50),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
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
    fontSize: getResponsiveFontSize(20),
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: getResponsiveFontSize(22),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: getResponsiveWidth(40),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(20),
  },
  section: {
    marginBottom: getResponsiveMargin(25),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: getResponsiveMargin(15),
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: getResponsivePadding(16),
    paddingHorizontal: getResponsivePadding(20),
    borderRadius: getResponsiveBorderRadius(12),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  addPaymentIcon: {
    fontSize: getResponsiveFontSize(24),
    color: '#ffffff',
    marginRight: getResponsiveMargin(12),
  },
  addPaymentText: {
    fontSize: getResponsiveFontSize(16),
    color: '#ffffff',
    fontWeight: '500',
  },
  cardItem: {
    backgroundColor: '#ffffff',
    borderRadius: getResponsiveBorderRadius(15),
    marginBottom: getResponsiveMargin(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  defaultCardItem: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getResponsivePadding(16),
    paddingHorizontal: getResponsivePadding(16),
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  cardType: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: '#2d3748',
    marginRight: getResponsiveMargin(10),
  },
  defaultBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: getResponsivePadding(8),
    paddingVertical: getResponsivePadding(2),
    borderRadius: getResponsiveBorderRadius(10),
  },
  defaultText: {
    fontSize: getResponsiveFontSize(11),
    fontWeight: '600',
    color: '#000000',
  },
  cardDetails: {
    gap: getResponsiveMargin(4),
  },
  cardNumber: {
    fontSize: getResponsiveFontSize(14),
    color: '#4a5568',
    fontWeight: '500',
  },
  cardExpiry: {
    fontSize: getResponsiveFontSize(12),
    color: '#6b7280',
  },
  cardHolder: {
    fontSize: getResponsiveFontSize(12),
    color: '#6b7280',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveMargin(10),
  },
  cardBrandIcon: {
    fontSize: getResponsiveFontSize(24),
  },
  setDefaultButton: {
    padding: getResponsivePadding(6),
  },
  setDefaultIcon: {
    fontSize: getResponsiveFontSize(18),
  },
  deleteButton: {
    padding: getResponsivePadding(6),
  },
  deleteIcon: {
    fontSize: getResponsiveFontSize(16),
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: getResponsiveMargin(8),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  paymentTypeModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: getResponsiveBorderRadius(20),
    borderTopRightRadius: getResponsiveBorderRadius(20),
    paddingBottom: getResponsivePadding(30),
  },
  addCardModal: {
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
    fontWeight: '600',
    color: '#1a202c',
  },
  closeButton: {
    padding: getResponsivePadding(4),
  },
  closeButtonText: {
    fontSize: getResponsiveFontSize(18),
    color: '#4a5568',
  },
  paymentTypesList: {
    paddingHorizontal: getResponsivePadding(20),
    paddingTop: getResponsivePadding(10),
  },
  paymentTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getResponsivePadding(16),
    paddingHorizontal: getResponsivePadding(16),
    backgroundColor: '#f7fafc',
    borderRadius: getResponsiveBorderRadius(12),
    marginBottom: getResponsiveMargin(10),
  },
  paymentTypeIcon: {
    fontSize: getResponsiveFontSize(24),
    marginRight: getResponsiveMargin(16),
  },
  paymentTypeName: {
    flex: 1,
    fontSize: getResponsiveFontSize(16),
    fontWeight: '500',
    color: '#2d3748',
  },
  paymentTypeArrow: {
    fontSize: getResponsiveFontSize(16),
    color: '#4a5568',
  },
  formContainer: {
    padding: getResponsivePadding(20),
  },
  inputGroup: {
    marginBottom: getResponsiveMargin(20),
  },
  inputLabel: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: getResponsiveMargin(8),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: getResponsiveBorderRadius(8),
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(16),
    fontSize: getResponsiveFontSize(16),
    color: '#1a202c',
    backgroundColor: '#ffffff',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: getResponsiveMargin(12),
  },
  halfWidth: {
    flex: 1,
  },
  cardBrandText: {
    fontSize: getResponsiveFontSize(12),
    color: '#4a5568',
    marginTop: getResponsiveMargin(4),
  },
  actionButtons: {
    flexDirection: 'row',
    gap: getResponsiveMargin(12),
    marginTop: getResponsiveMargin(20),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(20),
    borderRadius: getResponsiveBorderRadius(8),
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '500',
    color: '#4a5568',
  },
  addButton: {
    flex: 1,
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(20),
    borderRadius: getResponsiveBorderRadius(8),
    backgroundColor: '#37b9a8',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '500',
    color: '#ffffff',
  },
  bottomSpacer: {
    height: getResponsiveHeight(50),
  },
});
