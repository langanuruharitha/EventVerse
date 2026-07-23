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

  useEffect(() => { loadCart(); }, []);

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
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🛒</div>
          <p className="text-xs text-[#1F1E1B]/50 italic font-sans">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center font-serif">
        <div className="text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-[#2C1810] mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-[#1F1E1B]/50 italic mb-6 font-sans">Browse our curated collection to begin adding items</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow-lg transition font-sans"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2C1810]">🛒 Shopping Cart</h1>
            <p className="text-xs text-[#1F1E1B]/50 italic mt-1 font-sans">Review your selected items before checkout</p>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans">
            ← Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item: any) => (
              <div key={item.id} className="bg-white border border-[#DDD0BB] rounded shadow-sm p-5">
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded border border-[#EDE0CC] overflow-hidden bg-[#FAF6F0]">
                    <ProductImage
                      product={item.product}
                      alt={item.product?.name || 'Product image'}
                      className="rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-sm text-[#1F1E1B]">{item.product?.name}</h3>
                        {item.is_ai_recommended && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#8A1C2C]/10 border border-[#8A1C2C]/20 text-[#8A1C2C] text-[9px] font-bold uppercase tracking-wider rounded font-sans">
                            🤖 AI Recommended
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-[10px] font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2 py-1 rounded font-sans transition"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded border border-[#DDD0BB] bg-[#FAF6F0] hover:bg-[#EDE0CC] flex items-center justify-center font-bold text-sm text-[#1F1E1B] font-sans transition"
                        >
                          −
                        </button>
                        <span className="font-bold text-sm w-6 text-center font-sans">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded border border-[#8A1C2C] bg-[#8A1C2C] hover:bg-[#6B1522] text-[#FAF0E0] flex items-center justify-center font-bold text-sm font-sans transition"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right font-sans">
                        <div className="text-[10px] text-[#1F1E1B]/40">₹{item.unit_price.toLocaleString('en-IN')} each</div>
                        <div className="text-base font-bold text-[#8A1C2C]">₹{item.total_price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6 sticky top-6 space-y-4">
              <h2 className="text-base font-bold text-[#2C1810] pb-3 border-b border-[#FAF6F0]">Order Summary</h2>

              <div className="space-y-2.5 text-xs font-sans">
                <div className="flex justify-between text-[#1F1E1B]/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F1E1B]">₹{cart.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#1F1E1B]/70">
                  <span>Tax (18% GST)</span>
                  <span className="font-semibold text-[#1F1E1B]">₹{cart.tax_amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#1F1E1B]/70">
                  <span>Shipping</span>
                  <span className={`font-semibold ${cart.shipping_charges === 0 ? 'text-green-600' : 'text-[#1F1E1B]'}`}>
                    {cart.shipping_charges === 0 ? 'FREE' : `₹${cart.shipping_charges}`}
                  </span>
                </div>
                {cart.subtotal < 999 && (
                  <div className="text-[10px] text-[#C5A880] italic">
                    Add ₹{(999 - cart.subtotal).toFixed(0)} more for free shipping
                  </div>
                )}
                <div className="border-t border-[#FAF6F0] pt-3 flex justify-between">
                  <span className="font-bold text-sm text-[#1F1E1B]">Total</span>
                  <span className="font-bold text-base text-[#8A1C2C]">₹{cart.total_amount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link
                href="/shop/cart/checkout"
                className="block w-full py-3 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-center text-xs font-bold rounded hover:shadow-lg transition font-sans"
              >
                Proceed to Checkout →
              </Link>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-[#FAF6F0] space-y-1.5 text-[10px] text-[#1F1E1B]/50 font-sans">
                {['Secure & encrypted checkout', 'Free returns within 7 days', '100% authentic products'].map((txt, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span> {txt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
