'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import CancelOrderButton from '@/components/shop/CancelOrderButton';

interface OrderItem {
  id: string;
  product_name: string;
  product_sku: string;
  product_image_url: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_color?: string;
  selected_size?: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  notes?: string;
  order_items: OrderItem[];
}

const STATUS_STEPS = [
  { key: 'pending',    label: 'Order Placed', icon: '📋', desc: 'Your order has been received' },
  { key: 'confirmed',  label: 'Confirmed',    icon: '✅', desc: 'Payment confirmed' },
  { key: 'processing', label: 'Processing',   icon: '📦', desc: 'Order being packed' },
  { key: 'shipped',    label: 'Shipped',      icon: '🚚', desc: 'Out for delivery' },
  { key: 'delivered',  label: 'Delivered',    icon: '🎉', desc: 'Successfully delivered' },
];
const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function getDeliveryDate(createdAt: string, status: string) {
  if (status === 'delivered') return 'Delivered';
  if (status === 'cancelled') return 'Cancelled';
  const delivery = new Date(createdAt);
  delivery.setDate(delivery.getDate() + 6);
  return delivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/signin'); return; }
      const { data, error } = await supabase
        .from('orders').select('*, order_items(*)')
        .eq('id', id).eq('user_id', user.id).single();
      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-xs text-[#1F1E1B]/50 italic font-sans">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center gap-4 font-serif">
        <div className="text-5xl">📦</div>
        <h1 className="text-xl font-bold text-[#2C1810]">Order Not Found</h1>
        <button
          onClick={() => router.push('/shop/orders')}
          className="px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow transition font-sans"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  const currentStepIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';
  const canCancel = ['pending', 'confirmed'].includes(order.status);
  const deliveryDate = getDeliveryDate(order.created_at, order.status);
  const placedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const placedTime = new Date(order.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#DDD0BB] shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/shop/orders')}
            className="text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans transition"
          >
            ← Back to Orders
          </button>
          <div className="text-right font-sans">
            <div className="text-sm font-bold text-[#1F1E1B]">Order #{order.order_number}</div>
            <div className="text-[10px] text-[#1F1E1B]/40">{placedDate} at {placedTime}</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Status Banner */}
        {isCancelled ? (
          <div className="bg-red-50 border border-red-200 rounded p-5 flex items-center gap-4 shadow-sm">
            <span className="text-4xl">❌</span>
            <div>
              <h2 className="text-sm font-bold text-red-700">Order Cancelled</h2>
              <p className="text-xs text-red-500 italic mt-0.5 font-sans">Refund will be processed within 5-7 business days if applicable.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#2C1810]">📍 Track Your Order</h2>
              {order.status !== 'delivered' && (
                <div className="text-right font-sans">
                  <div className="text-[10px] text-[#1F1E1B]/40 uppercase tracking-wider">Expected Delivery</div>
                  <div className="text-xs font-bold text-[#8A1C2C]">{deliveryDate}</div>
                </div>
              )}
            </div>

            {/* Progress Track */}
            <div className="relative mt-4">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#EDE0CC] rounded-full" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-[#8A1C2C] to-[#C5A880] rounded-full transition-all duration-700"
                style={{ width: `${currentStepIndex < 0 ? 0 : (currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStepIndex;
                  const active = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center w-1/5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                        done
                          ? 'bg-gradient-to-br from-[#8A1C2C] to-[#C5A880] border-[#8A1C2C] shadow-md'
                          : 'bg-white border-[#DDD0BB]'
                      } ${active ? 'scale-110 ring-2 ring-[#C5A880]/40' : ''}`}>
                        {step.icon}
                      </div>
                      <div className={`mt-2 text-[10px] font-bold text-center uppercase tracking-wide font-sans ${done ? 'text-[#8A1C2C]' : 'text-[#1F1E1B]/30'}`}>
                        {step.label}
                      </div>
                      <div className="text-[9px] text-[#1F1E1B]/30 text-center hidden sm:block font-sans italic mt-0.5">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Message */}
            <div className="mt-5 bg-[#FAF6F0] border border-[#DDD0BB] rounded p-3 text-center">
              <p className="text-xs text-[#1F1E1B]/70 italic font-sans">
                {order.status === 'pending'    && '⏳ Your order is placed and awaiting confirmation.'}
                {order.status === 'confirmed'  && '✅ Payment confirmed! Your order is being prepared.'}
                {order.status === 'processing' && '📦 Your items are being packed and will ship soon.'}
                {order.status === 'shipped'    && `🚚 Your order is on the way! Expected by ${deliveryDate}`}
                {order.status === 'delivered'  && '🎉 Your order has been delivered. Enjoy your items!'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Items + Address + Actions */}
          <div className="lg:col-span-2 space-y-4">

            {/* Order Items */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0]">
                <h3 className="text-sm font-bold text-[#2C1810]">🛍️ Order Items ({order.order_items.length})</h3>
              </div>
              <div className="divide-y divide-[#FAF6F0]">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4">
                    <div className="w-16 h-16 rounded border border-[#EDE0CC] overflow-hidden bg-[#FAF6F0] flex-shrink-0">
                      <img
                        src={item.product_image_url || '/placeholder-product.jpg'}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#1F1E1B]">{item.product_name}</h4>
                      <p className="text-[10px] text-[#1F1E1B]/40 font-sans mt-0.5">SKU: {item.product_sku}</p>
                      {item.selected_color && <p className="text-[10px] text-[#1F1E1B]/40 font-sans">Color: {item.selected_color}</p>}
                      {item.selected_size && <p className="text-[10px] text-[#1F1E1B]/40 font-sans">Size: {item.selected_size}</p>}
                      <p className="text-xs text-[#1F1E1B]/60 mt-1 font-sans">Qty: {item.quantity} × ₹{item.unit_price.toFixed(2)}</p>
                    </div>
                    <div className="text-right font-sans">
                      <p className="font-bold text-sm text-[#8A1C2C]">₹{item.total_price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0]">
                <h3 className="text-sm font-bold text-[#2C1810]">📍 Delivery Address</h3>
              </div>
              <div className="p-5">
                {order.shipping_address ? (
                  <div className="text-xs space-y-1 text-[#1F1E1B]/70 font-sans leading-relaxed">
                    <p className="font-bold text-sm text-[#1F1E1B]">{order.shipping_address.fullName}</p>
                    <p>{order.shipping_address.addressLine1}</p>
                    {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                    <p className="text-[#8A1C2C] font-semibold pt-1">📞 {order.shipping_address.phone}</p>
                  </div>
                ) : (
                  <p className="text-xs text-[#1F1E1B]/40 italic font-sans">No address information found</p>
                )}
              </div>
            </div>

            {/* Cancel Actions */}
            {canCancel && (
              <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0]">
                  <h3 className="text-sm font-bold text-[#2C1810]">Order Actions</h3>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#1F1E1B]/50 italic mb-4 font-sans">
                    You can cancel this order while it&apos;s still in <strong className="text-[#1F1E1B]">{order.status}</strong> status.
                  </p>
                  <CancelOrderButton orderId={order.id} />
                </div>
              </div>
            )}
          </div>

          {/* Right: Price Summary + Payment */}
          <div className="space-y-4">
            {/* Price Summary */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0]">
                <h3 className="text-sm font-bold text-[#2C1810]">💰 Price Summary</h3>
              </div>
              <div className="p-5 space-y-2.5 text-xs font-sans">
                <div className="flex justify-between text-[#1F1E1B]/60">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F1E1B]">₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{order.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#1F1E1B]/60">
                  <span>Tax (GST 18%)</span>
                  <span className="font-semibold text-[#1F1E1B]">₹{order.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#1F1E1B]/60">
                  <span>Shipping</span>
                  <span className={`font-semibold ${(order.shipping_amount || 0) === 0 ? 'text-green-600' : 'text-[#1F1E1B]'}`}>
                    {(order.shipping_amount || 0) === 0 ? 'FREE' : `₹${(order.shipping_amount || 0).toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-[#FAF6F0] pt-2.5 flex justify-between">
                  <span className="font-bold text-sm text-[#1F1E1B]">Total</span>
                  <span className="font-bold text-sm text-[#8A1C2C]">₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0]">
                <h3 className="text-sm font-bold text-[#2C1810]">💳 Payment Info</h3>
              </div>
              <div className="p-5 space-y-2.5 text-xs font-sans">
                <div className="flex justify-between text-[#1F1E1B]/60">
                  <span>Method</span>
                  <span className="font-semibold text-[#1F1E1B]">
                    {order.payment_method === 'upi' ? '📱 UPI' :
                     order.payment_method === 'cod' ? '💵 Cash on Delivery' :
                     order.payment_method === 'card' ? '💳 Card' : order.payment_method}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#1F1E1B]/60">
                  <span>Status</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                    order.payment_status === 'paid'
                      ? 'bg-green-500/10 border-green-500/20 text-green-800'
                      : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-800'
                  }`}>
                    {order.payment_status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery ETA or Delivered */}
            {!isCancelled && order.status !== 'delivered' && (
              <div className="bg-gradient-to-br from-[#1F1E1B] to-[#131211] border border-[#C5A880]/20 rounded shadow-sm p-5 text-center">
                <div className="text-[10px] text-[#C5A880] uppercase tracking-widest font-sans mb-1">📅 Expected Delivery</div>
                <div className="text-lg font-bold text-white font-sans">{deliveryDate}</div>
                <div className="text-[10px] text-white/40 italic font-sans mt-1">5–7 business days from order date</div>
              </div>
            )}

            {order.status === 'delivered' && (
              <div className="bg-[#F0FFF4] border border-[#B5DCC5] rounded shadow-sm p-5 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <div className="text-sm font-bold text-[#1A5C35]">Delivered!</div>
                <div className="text-[10px] text-[#2C6E49] italic mt-1 font-sans">Thank you for shopping with EventVerse</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
