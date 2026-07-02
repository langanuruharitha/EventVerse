import crypto from 'crypto';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export class RazorpayService {
  private keyId: string;
  private keySecret: string;

  constructor() {
    this.keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  }

  async createOrder(amount: number, currency = 'INR', receipt?: string): Promise<RazorpayOrder> {
    try {
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to paise
          currency,
          receipt: receipt || `order_${Date.now()}`,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      return await response.json();
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      throw error;
    }
  }

  verifyPaymentSignature(verification: RazorpayPaymentVerification): boolean {
    try {
      const text = `${verification.razorpay_order_id}|${verification.razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(text)
        .digest('hex');

      return expectedSignature === verification.razorpay_signature;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  getCheckoutOptions(order: RazorpayOrder, userDetails: any) {
    return {
      key: this.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'EventVerse',
      description: 'Event Shopping Payment',
      order_id: order.id,
      prefill: {
        name: userDetails.name || '',
        email: userDetails.email || '',
        contact: userDetails.phone || '',
      },
      theme: {
        color: '#7c3aed',
      },
    };
  }
}

export const razorpayService = new RazorpayService();
