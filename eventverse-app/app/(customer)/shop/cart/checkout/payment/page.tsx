'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, clearCart } from '@/lib/commerce/cart-service';
import { createOrder, processOrderPayment } from '@/lib/commerce/order-service';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, CreditCard, Wallet, Building, Shield, CheckCircle } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('card');

  useEffect(() => {
    // Load cart and address
    fetchCart();
    loadAddress();
  }, []);

  const fetchCart = async () => {
    try {
      const result = await getCart();
      if (result.success && result.data) {
        setCart(result.data);
      } else if (result.error === 'Not authenticated') {
        router.push('/auth/signin');
        return;
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAddress = () => {
    const savedAddress = localStorage.getItem('checkoutAddress');
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    } else {
      router.push('/shop/cart/checkout/address');
    }
  };

  const handlePayment = async () => {
    if (!cart || !address) return;

    setProcessing(true);

    try {
      // Create order
      const orderResult = await createOrder({
        shippingAddress: address,
        billingAddress: address,
        paymentMethod: paymentMethod,
      });

      if (!orderResult.success || !orderResult.data) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      const order = orderResult.data;

      // Process payment
      if (paymentMethod === 'cod') {
        // Cash on Delivery - just redirect to success
        await clearCart();
        localStorage.removeItem('checkoutAddress');
        router.push(`/shop/cart/checkout/success?orderId=${order.id}`);
      } else {
        // Online payment via Razorpay
        const paymentResult = await processOrderPayment(order.id);

        if (paymentResult.success) {
          // Payment initiated, Razorpay will handle the flow
          // The razorpay handler will redirect to success page on completion
          await clearCart();
          localStorage.removeItem('checkoutAddress');
        } else {
          throw new Error(paymentResult.error || 'Payment failed');
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!cart || !address) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <Button onClick={() => router.push('/shop/cart')}>Back to Cart</Button>
      </div>
    );
  }

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
    { id: 'upi', name: 'UPI', icon: Wallet, description: 'Google Pay, PhonePe, Paytm' },
    { id: 'netbanking', name: 'Net Banking', icon: Building, description: 'All major banks' },
    { id: 'cod', name: 'Cash on Delivery', icon: Shield, description: 'Pay when you receive' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/shop/cart/checkout/address')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Review */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Delivery Address</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/shop/cart/checkout/address')}
                >
                  Change
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{address.fullName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`w-full p-4 border-2 rounded-lg transition flex items-center gap-4 ${
                      paymentMethod === method.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      paymentMethod === method.id ? 'bg-purple-600 text-white' : 'bg-gray-100'
                    }`}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">100% Secure Payments</p>
                    <p>Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>

              <div className="space-y-4">
                {/* Items Count */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({cart.items?.length ?? 0})</span>
                  <span className="font-medium">₹{(cart.subtotal ?? 0).toFixed(2)}</span>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{(cart.subtotal ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST 18%)</span>
                    <span className="font-medium">₹{(cart.tax_amount ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {(cart.shipping_charges ?? 0) === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${(cart.shipping_charges ?? 0).toFixed(2)}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-2xl font-bold text-purple-600">
                      ₹{(cart.total_amount ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full"
                  size="lg"
                >
                  {processing ? 'Processing...' : `Pay ₹${(cart.total_amount ?? 0).toFixed(2)}`}
                </Button>

                {/* Terms */}
                <p className="text-xs text-gray-600 text-center">
                  By placing this order, you agree to our{' '}
                  <a href="#" className="text-purple-600 hover:underline">Terms & Conditions</a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
