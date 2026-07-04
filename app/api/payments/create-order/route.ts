import { NextRequest, NextResponse } from 'next/server';
import { mockPaymentService } from '@/lib/payments/mock-payment-service';
// import { razorpayService } from '@/lib/payments/razorpay-service'; // Uncomment when you have Razorpay keys

export async function POST(request: NextRequest) {
  try {
    const { amount, orderId } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // MOCK PAYMENT (No PAN required!) - Works immediately
    const paymentOrder = await mockPaymentService.createOrder(amount, 'INR');

    // REAL RAZORPAY (Uncomment when you have keys)
    // const paymentOrder = await razorpayService.createOrder(amount, 'INR', `order_${orderId || Date.now()}`);

    return NextResponse.json({
      success: true,
      order: paymentOrder,
      isMockMode: true // Remove this when using real payment
    });
  } catch (error: any) {
    console.error('Payment order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
