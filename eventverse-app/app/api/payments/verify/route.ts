import { NextRequest, NextResponse } from 'next/server';
import { mockPaymentService } from '@/lib/payments/mock-payment-service';
// import { razorpayService } from '@/lib/payments/razorpay-service'; // Uncomment when you have Razorpay keys
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const verification = await request.json();
    const { orderId, paymentId, signature } = verification;

    // MOCK PAYMENT VERIFICATION (Always succeeds for testing)
    const isValid = mockPaymentService.verifyPayment(orderId, paymentId, signature);

    // REAL RAZORPAY (Uncomment when you have keys)
    // const isValid = razorpayService.verifyPaymentSignature(verification);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update order status in database
    const supabase = await createServerClient();
    
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_transaction_id: paymentId,
        payment_date: new Date().toISOString(),
        status: 'confirmed'
      })
      .eq('id', orderId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully (Mock Mode)',
      isMockMode: true // Remove when using real payment
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
