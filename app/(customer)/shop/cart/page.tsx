'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCart, updateCartItemQuantity, removeFromCart } from '@/lib/commerce/cart-service';
import ProductImage from '@/components/shop/ProductImage';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const result = await getCart();
    if (result.success) {
      setCart(result.data);
    } else if (result.error === 'Not authenticated') {
      router.push('/auth/signin');
      return;
    }
    setLoading(false);
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    await updateCartItemQuantity(itemId, quantity);
    loadCart();
  };

  const handleRemove = async (itemId: string) => {
    await removeFromCart(itemId);
    loadCart();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart!</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">🛒 Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item: any) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 flex-shrink-0">
                    <ProductImage
                      product={item.product}
                      alt={item.product?.name || 'Product image'}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.product?.name}</h3>
                        {item.is_ai_recommended && (
                          <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                            🤖 AI Recommended
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-300 rounded-lg font-semibold transition-all flex items-center gap-2"
                      >
                        <span>🗑️</span>
                        Remove
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                        >
                          −
                        </button>
                        <span className="font-semibold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          ₹{item.unit_price.toLocaleString('en-IN')} each
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                          ₹{item.total_price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{cart.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-semibold">₹{cart.tax_amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {cart.shipping_charges === 0 ? 'FREE' : `₹${cart.shipping_charges}`}
                  </span>
                </div>
                {cart.subtotal < 999 && (
                  <div className="text-sm text-gray-500">
                    Add ₹{(999 - cart.subtotal).toFixed(0)} more for free shipping!
                  </div>
                )}
                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-purple-600">₹{cart.total_amount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link
                href="/shop/cart/checkout"
                className="block w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-bold text-lg rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="block w-full py-3 bg-white border-2 border-purple-600 text-purple-600 text-center font-semibold rounded-lg hover:bg-purple-50 transition-all"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Free returns within 7 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>100% authentic products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
