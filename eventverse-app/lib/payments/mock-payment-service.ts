// Mock Payment Service - For Development/Testing Only
// No real payment gateway required

export interface MockPaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
}

export interface MockPaymentResponse {
  success: boolean;
  orderId: string;
  paymentId: string;
  signature: string;
}

export class MockPaymentService {
  /**
   * Create a mock payment order
   */
  async createOrder(amount: number, currency = 'INR'): Promise<MockPaymentOrder> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const orderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: orderId,
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      status: 'pending'
    };
  }

  /**
   * Process mock payment
   */
  async processPayment(
    orderId: string,
    amount: number,
    paymentMethod: 'card' | 'upi' | 'netbanking' | 'cod' = 'card'
  ): Promise<MockPaymentResponse> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate 95% success rate (5% random failures for testing)
    const isSuccess = Math.random() > 0.05;

    if (!isSuccess) {
      throw new Error('Payment failed. Please try again.');
    }

    const paymentId = `mock_payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const signature = `mock_signature_${Math.random().toString(36).substr(2, 16)}`;

    return {
      success: true,
      orderId,
      paymentId,
      signature
    };
  }

  /**
   * Verify mock payment (always returns true for testing)
   */
  verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
    // In mock mode, we always verify as successful
    return true;
  }

  /**
   * Get mock payment status
   */
  async getPaymentStatus(paymentId: string): Promise<{
    status: 'pending' | 'success' | 'failed';
    amount: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      status: 'success',
      amount: 0 // This would be fetched from database in real implementation
    };
  }

  /**
   * Simulate refund
   */
  async initiateRefund(paymentId: string, amount: number): Promise<{
    refundId: string;
    status: 'pending' | 'success';
  }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const refundId = `mock_refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      refundId,
      status: 'success'
    };
  }
}

export const mockPaymentService = new MockPaymentService();

// Test card numbers for UI
export const MOCK_TEST_CARDS = {
  success: {
    number: '4111 1111 1111 1111',
    cvv: '123',
    expiry: '12/25',
    name: 'Test User'
  },
  failure: {
    number: '4000 0000 0000 0002',
    cvv: '123',
    expiry: '12/25',
    name: 'Test Fail'
  }
};
