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

interface CheckoutStep {
  id: number;
  title: string;
  icon: any;
  completed: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
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
      alert('Please fill in all contact details');
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
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/shop/cart')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm mt-2 font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div className="pt-4">
                  <p className="text-sm text-gray-600">
                    We'll use this information to send you order updates and delivery notifications.
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => router.push('/shop/cart')}
                >
                  Back to Cart
                </Button>
                <Button onClick={handleContinue}>
                  Continue to Address
                </Button>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>

              <div className="space-y-4">
                {/* Items */}
                <div className="border-b pb-4">
                  {cart.items.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex gap-3 mb-3">
                      <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0">
                        <ProductImage
                          product={item.product}
                          alt={item.product?.name || 'Product image'}
                          className="rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium">₹{item.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {cart.items.length > 3 && (
                    <p className="text-sm text-gray-600 text-center">
                      +{cart.items.length - 3} more items
                    </p>
                  )}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 text-sm">
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
                      {(cart.shipping_charges ?? 0) === 0 ? 'FREE' : `₹${(cart.shipping_charges ?? 0).toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-purple-600">
                      ₹{(cart.total_amount ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Free Shipping Info */}
                {(cart.shipping_charges ?? 0) > 0 && (cart.subtotal ?? 0) < 999 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      Add ₹{(999 - (cart.subtotal ?? 0)).toFixed(2)} more to get FREE shipping!
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
