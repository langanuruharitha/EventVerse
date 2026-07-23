'use client';
import { useToast } from '@/components/ui/Toast';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, clearCart } from '@/lib/commerce/cart-service';
import { createOrder, processOrderPayment } from '@/lib/commerce/order-service';
import { ArrowLeft, CreditCard, Wallet, Building, Shield, CheckCircle } from 'lucide-react';

export default function PaymentPage() {
  const toast = useToast();
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('card');
  const [showUpiQR, setShowUpiQR] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  useEffect(() => {
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
      const orderResult = await createOrder({
        shippingAddress: address,
        billingAddress: address,
        paymentMethod: paymentMethod,
      });

      if (!orderResult.success || !orderResult.data) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      const order = orderResult.data;

      if (paymentMethod === 'cod') {
        await clearCart();
        localStorage.removeItem('checkoutAddress');
        router.push(`/shop/cart/checkout/success?orderId=${order.id}`);
      } else if (paymentMethod === 'upi') {
        setCreatedOrderId(order.id);
        setShowUpiQR(true);
      } else {
        const paymentResult = await processOrderPayment(order.id);

        if (paymentResult.success) {
          await clearCart();
          localStorage.removeItem('checkoutAddress');
        } else {
          throw new Error(paymentResult.error || 'Payment failed');
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast(error.message || 'Payment processing failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] p-8 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-6 bg-[#EDE0CC] rounded w-1/3" />
          <div className="h-48 bg-[#EDE0CC] rounded border border-[#DDD0BB]" />
        </div>
      </div>
    );
  }

  if (!cart || !address) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center font-serif">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-[#2C1810] mb-4">Something went wrong</h1>
          <button
            onClick={() => router.push('/shop/cart')}
            className="px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow font-sans"
          >
            Back to Cart
          </button>
        </div>
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
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header */}
      <div className="bg-white border-b border-[#DDD0BB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/shop/cart/checkout/address')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery Address Review */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6">
              <div className="flex items-center justify-between mb-3 border-b border-[#FAF6F0] pb-3">
                <h3 className="text-base font-bold text-[#2C1810]">Delivery Address</h3>
                <button
                  onClick={() => router.push('/shop/cart/checkout/address')}
                  className="text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase font-sans tracking-wider"
                >
                  Change
                </button>
              </div>
              <div className="bg-[#FFFDF8] border border-[#DDD0BB] p-4 rounded text-xs font-sans text-[#1F1E1B]">
                <p className="font-bold text-sm text-[#2C1810]">{address.fullName}</p>
                <p className="text-[#1F1E1B]/70 mt-1">
                  {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-[#1F1E1B]/60 mt-1 font-mono">Phone: {address.phone}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6">
              <h3 className="text-base font-bold text-[#2C1810] mb-4">Payment Method</h3>
              <div className="space-y-3 font-sans">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`w-full p-4 border rounded transition flex items-center gap-4 text-left ${
                      paymentMethod === method.id
                        ? 'border-[#8A1C2C] bg-[#8A1C2C]/5'
                        : 'border-[#DDD0BB] hover:border-[#C5A880]'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      paymentMethod === method.id ? 'bg-[#8A1C2C] text-[#FAF0E0]' : 'bg-[#FAF6F0] text-[#7A6652]'
                    }`}>
                      <method.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-xs text-[#2C1810]">{method.name}</p>
                      <p className="text-[10px] text-[#1F1E1B]/60">{method.description}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-[#8A1C2C]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Security Note */}
              <div className="mt-5 p-4 bg-[#FAF6F0] border border-[#C5A880]/30 rounded font-sans">
                <div className="flex gap-3 items-center">
                  <Shield className="w-5 h-5 text-[#8A1C2C] flex-shrink-0" />
                  <div className="text-[10px] text-[#7A6652]">
                    <p className="font-bold text-xs text-[#2C1810] mb-0.5">100% Secure Royal Payment</p>
                    <p>Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-5 sticky top-4 font-sans">
              <h3 className="text-sm font-bold text-[#2C1810] mb-4 uppercase tracking-wider font-serif">Order Summary</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#1F1E1B]/60">Items ({cart.items?.length ?? 0})</span>
                  <span className="font-semibold">₹{(cart.subtotal ?? 0).toFixed(2)}</span>
                </div>

                <div className="space-y-1.5 border-t border-[#DDD0BB] pt-3">
                  <div className="flex justify-between">
                    <span className="text-[#1F1E1B]/60">Subtotal</span>
                    <span className="font-semibold">₹{(cart.subtotal ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1F1E1B]/60">Tax (GST 18%)</span>
                    <span className="font-semibold">₹{(cart.taxAmount ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1F1E1B]/60">Shipping</span>
                    <span className="font-semibold">
                      {(cart.shippingCharges ?? 0) === 0 ? (
                        <span className="text-green-700 font-bold">FREE</span>
                      ) : (
                        `₹${(cart.shippingCharges ?? 0).toFixed(2)}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-[#DDD0BB] pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold font-serif">Total Amount</span>
                    <span className="text-base font-bold text-[#8A1C2C]">
                      ₹{(cart.totalAmount ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full py-3 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded hover:shadow-lg transition disabled:opacity-50 mt-2"
                >
                  {processing ? 'Processing...' : `Pay ₹${(cart.totalAmount ?? 0).toFixed(2)}`}
                </button>

                <p className="text-[10px] text-[#1F1E1B]/50 text-center italic mt-2">
                  By placing this order, you agree to our{' '}
                  <a href="#" className="text-[#8A1C2C] underline">Terms & Conditions</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPI QR Code Modal */}
      {showUpiQR && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="p-6 max-w-sm w-full text-center space-y-5 bg-white border-2 border-[#C5A880] rounded shadow-2xl font-serif">
            <h3 className="text-xl font-bold text-[#2C1810]">Scan to Pay</h3>
            <p className="text-xs text-[#1F1E1B]/60 font-sans">Scan this QR code with any UPI app</p>
            <div className="bg-[#FFFDF8] p-4 rounded border border-[#DDD0BB] inline-block mx-auto">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=test@upi&pn=EventVerse&am=${(cart?.totalAmount ?? 0).toFixed(2)}`} 
                alt="UPI QR Code" 
                className="w-44 h-44 mix-blend-multiply" 
              />
            </div>
            <div className="text-xl font-bold text-[#8A1C2C] font-sans">
              ₹{(cart?.totalAmount ?? 0).toFixed(2)}
            </div>
            <div className="space-y-2 pt-2 font-sans">
              <button 
                className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition" 
                onClick={async () => {
                  try {
                    await fetch('/api/payments/verify', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        orderId: createdOrderId,
                        paymentId: 'UPI-MOCK-' + Date.now(),
                        signature: 'mock_signature',
                      }),
                    });
                  } catch (e) {
                    console.error(e);
                  }
                  await clearCart();
                  localStorage.removeItem('checkoutAddress');
                  router.push(`/shop/cart/checkout/success?orderId=${createdOrderId}`);
                }}
              >
                <CheckCircle className="w-4 h-4" />
                I have paid successfully
              </button>
              <button
                className="w-full py-2 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] transition"
                onClick={() => setShowUpiQR(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
