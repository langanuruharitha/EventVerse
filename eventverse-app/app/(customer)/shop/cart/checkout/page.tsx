'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { getCart } from '@/lib/commerce/cart-service';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ArrowLeft, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import ProductImage from '@/components/shop/ProductImage';
import { useToast } from '@/components/ui/Toast';

interface CheckoutStep {
  id: number;
  title: string;
  icon: any;
  completed: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const steps: CheckoutStep[] = [
    { id: 1, title: 'Contact Info', icon: CheckCircle, completed: false },
    { id: 2, title: 'Delivery Address', icon: MapPin, completed: false },
    { id: 3, title: 'Payment', icon: CreditCard, completed: false },
  ];

  useEffect(() => {
    fetchCart();
    fetchUserDetails();
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

  const fetchUserDetails = async () => {
    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        // Fetch additional details from profiles table if needed
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleContinue = () => {
    if (currentStep === 1 && (!email || !phone)) {
      toast('Please fill in all contact details', 'warning');
      return;
    }

    if (currentStep < 3) {
      if (currentStep === 1) {
        // Save contact info and move to address
        router.push('/shop/cart/checkout/address');
      } else if (currentStep === 2) {
        // Save address and move to payment
        router.push('/shop/cart/checkout/payment');
      }
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center font-serif">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-xl font-bold text-[#2C1810] mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/shop')}
            className="px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow font-sans"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header */}
      <div className="bg-white border-b border-[#DDD0BB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/shop/cart')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'text-[#FAF0E0]'
                        : 'bg-[#EDE0CC] text-[#7A6652]'
                    }`}
                    style={currentStep >= step.id ? { background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)' } : {}}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-1 font-semibold uppercase tracking-wider font-sans text-[#1F1E1B]/60">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-0.5 mx-3 ${
                      currentStep > step.id ? 'bg-[#8A1C2C]' : 'bg-[#DDD0BB]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#2C1810] mb-5">Contact Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6652] mb-1.5 font-sans">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded outline-none font-sans"
                    style={{ background: '#FFFDF8', border: '1.5px solid #DDD0BB', color: '#2C1810' }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A6652] mb-1.5 font-sans">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-4 py-2.5 text-sm rounded outline-none font-sans"
                    style={{ background: '#FFFDF8', border: '1.5px solid #DDD0BB', color: '#2C1810' }}
                  />
                </div>

                <p className="text-[10px] text-[#1F1E1B]/50 italic font-sans">
                  We'll use this information to send you order updates and delivery notifications.
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => router.push('/shop/cart')}
                  className="px-4 py-2 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded hover:bg-[#FAF6F0] font-sans transition"
                >
                  Back to Cart
                </button>
                <button
                  onClick={handleContinue}
                  className="px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow font-sans transition"
                >
                  Continue to Address
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-5 sticky top-4">
              <h3 className="text-sm font-bold text-[#2C1810] mb-4 uppercase tracking-wider">Order Summary</h3>

              <div className="space-y-4">
                {/* Items */}
                <div className="border-b border-[#FAF6F0] pb-4 space-y-3">
                  {cart.items.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-14 h-14 rounded bg-[#EDE0CC] flex-shrink-0 overflow-hidden border border-[#DDD0BB]">
                        <ProductImage
                          product={item.product}
                          alt={item.product?.name || 'Product image'}
                          className="rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate text-[#1F1E1B]">
                          {item.product?.name}
                        </p>
                        <p className="text-[10px] text-[#1F1E1B]/50 font-sans">Qty: {item.quantity}</p>
                        <p className="text-xs font-bold text-[#8A1C2C] font-sans">₹{item.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {cart.items.length > 3 && (
                    <p className="text-[10px] text-[#1F1E1B]/40 text-center italic font-sans">
                      +{cart.items.length - 3} more items
                    </p>
                  )}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-1.5 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-[#1F1E1B]/60">Subtotal</span>
                    <span className="font-semibold">₹{(cart.subtotal ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1F1E1B]/60">Tax (GST 18%)</span>
                    <span className="font-semibold">₹{(cart.tax_amount ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1F1E1B]/60">Shipping</span>
                    <span className="font-semibold">
                      {(cart.shipping_charges ?? 0) === 0 ? 'FREE' : `₹${(cart.shipping_charges ?? 0).toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-[#DDD0BB] pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">Total</span>
                    <span className="text-base font-bold text-[#8A1C2C] font-sans">
                      ₹{(cart.total_amount ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Free Shipping Banner */}
                {(cart.shipping_charges ?? 0) > 0 && (cart.subtotal ?? 0) < 999 && (
                  <div className="bg-[#FAF6F0] border border-[#C5A880]/30 rounded p-3">
                    <p className="text-[10px] text-[#7A6652] italic font-sans">
                      Add ₹{(999 - (cart.subtotal ?? 0)).toFixed(2)} more to get FREE shipping!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
