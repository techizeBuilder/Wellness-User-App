import RazorpayCheckout from 'react-native-razorpay';
import apiService, { handleApiError } from './apiService';

export interface PaymentOrderData {
  amount: number;
  currency?: string;
  appointmentId?: string;
  subscriptionId?: string;
  planId?: string;
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

/**
 * Create payment order and open Razorpay checkout
 */
export const initiatePayment = async (
  orderData: PaymentOrderData
): Promise<PaymentResult> => {
  try {
    // Step 1: Create payment order on backend
    const orderResponse = await apiService.createPaymentOrder(orderData);

    if (!orderResponse.success || !orderResponse.data) {
      return {
        success: false,
        error: orderResponse.message || 'Failed to create payment order'
      };
    }

    const { paymentId, orderId, amount, currency, key } = orderResponse.data;

    if (!key) {
      return {
        success: false,
        error: 'Razorpay key not configured'
      };
    }

    // Step 2: Check if RazorpayCheckout is available
    if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
      return {
        success: false,
        error: 'Razorpay payment module is not available. Please ensure the app is built with native modules support.'
      };
    }

    // Step 3: Open Razorpay Checkout
    const razorpayOptions = {
      description: orderData.description || 'Wellness App Payment',
      image: 'https://res.cloudinary.com/uv-codes/image/upload/v1764566931/logo_o6l3ob.png', // Add your app logo URL
      currency: currency || 'INR',
      key: key, // Razorpay key from backend
      amount: amount * 100, // Convert to paise
      name: 'Zenovia',
      prefill: {
        email: '', // You can prefill user email if available
        contact: '', // You can prefill user phone if available
        name: '' // You can prefill user name if available
      },
      theme: { color: '#2DD4BF' }, // Your app theme color
      order_id: orderId
    };

    const razorpayResponse = await RazorpayCheckout.open(razorpayOptions);

    // Step 4: Verify payment on backend
    const verifyResponse = await apiService.verifyPayment({
      paymentId,
      orderId,
      signature: razorpayResponse.razorpay_signature,
      razorpayPaymentId: razorpayResponse.razorpay_payment_id
    });

    if (!verifyResponse.success) {
      return {
        success: false,
        error: verifyResponse.message || 'Payment verification failed'
      };
    }

    return {
      success: true,
      paymentId,
      orderId
    };
  } catch (error: any) {
    // Handle Razorpay module not available
    if (error?.message?.includes('Cannot read property') || error?.message?.includes('null') || error?.message?.includes('undefined')) {
      return {
        success: false,
        error: 'Razorpay payment module is not available. This may require a development build with native modules. Please rebuild the app.'
      };
    }

    // Handle Razorpay cancellation
    if (error?.code === 'RazorpayCheckoutError' || error?.code === 'NativeError') {
      if (error?.description?.includes('cancelled') || error?.description?.includes('cancel')) {
        return {
          success: false,
          error: 'Payment cancelled'
        };
      }
    }

    // Handle other errors
    const errorMessage = error?.description || error?.message || handleApiError(error);
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Format amount for display
 */
export const formatAmount = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
};

