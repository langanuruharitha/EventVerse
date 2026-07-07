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
  { key: 'pending', label: 'Order Placed', icon: '📋', desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Payment confirmed' },
  { key: 'processing', label: 'Processing', icon: '📦', desc: 'Order being packed' },
  { key: 'shipped', label: 'Shipped', icon: '🚚', desc: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Successfully delivered' },
];

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function getDeliveryDate(createdAt: string, status: string) {
  const created = new Date(createdAt);
  if (status === 'delivered') return 'Delivered';
  if (status === 'cancelled') return 'Cancelled';
  // Estimate 5-7 business days from order date
  const delivery = new Date(created);
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
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">📦</div>
        <h1 className="text-2xl font-bold text-gray-800">Order Not Found</h1>
        <button
          onClick={() => router.push('/shop/orders')}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Top Bar */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/shop/orders')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition"
          >
            ← Back to Orders
          </button>
          <div className="text-right">
            <div className="font-bold text-gray-900">Order #{order.order_number}</div>
            <div className="text-sm text-gray-500">{placedDate} at {placedTime}</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Status Banner */}
        {isCancelled ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <span className="text-5xl">❌</span>
            <div>
              <h2 className="text-xl font-bold text-red-700">Order Cancelled</h2>
              <p className="text-red-600 text-sm mt-1">This order has been cancelled. If you paid online, a refund will be processed shortly.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">📍 Track Your Order</h2>
              {order.status !== 'delivered' && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">Expected Delivery</div>
                  <div className="text-sm font-bold text-purple-700">{deliveryDate}</div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative mt-6">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />
              <div
                className="absolute top-5 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                style={{ width: `${currentStepIndex < 0 ? 0 : (currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStepIndex;
                  const active = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center w-1/5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all ${
                        done
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500 shadow-lg'
                          : 'bg-white border-gray-300'
                      } ${active ? 'scale-110 ring-4 ring-purple-200' : ''}`}>
                        {step.icon}
                      </div>
                      <div className={`mt-2 text-xs font-semibold text-center ${done ? 'text-purple-700' : 'text-gray-400'}`}>
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-400 text-center hidden sm:block">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Status Message */}
            <div className="mt-6 bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-purple-800 font-medium">
                {order.status === 'pending' && '⏳ Your order is placed and awaiting confirmation.'}
                {order.status === 'confirmed' && '✅ Payment confirmed! Your order is being prepared.'}
                {order.status === 'processing' && '📦 Your items are being packed and will ship soon.'}
                {order.status === 'shipped' && '🚚 Your order is on the way! Expected by ' + deliveryDate}
                {order.status === 'delivered' && '🎉 Your order has been delivered. Enjoy your items!'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Items + Actions */}
          <div className="lg:col-span-2 space-y-6">

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🛍️ Order Items ({order.order_items.length})</h3>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.product_image_url || '/placeholder-product.jpg'}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">SKU: {item.product_sku}</p>
                      {item.selected_color && (
                        <p className="text-xs text-gray-500">Color: {item.selected_color}</p>
                      )}
                      {item.selected_size && (
                        <p className="text-xs text-gray-500">Size: {item.selected_size}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity} × ₹{item.unit_price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{item.total_price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📍 Delivery Address</h3>
              {order.shipping_address ? (
                <div className="text-sm space-y-1 text-gray-700">
                  <p className="font-semibold text-base">{order.shipping_address.fullName}</p>
                  <p>{order.shipping_address.addressLine1}</p>
                  {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                  <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                  <p className="text-purple-600 font-medium pt-1">📞 {order.shipping_address.phone}</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No address info found</p>
              )}
            </div>

            {/* Cancel / Actions */}
            {canCancel && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Order Actions</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You can cancel this order while it's still in <strong>{order.status}</strong> status.
                </p>
                <div className="flex gap-3">
                  <CancelOrderButton orderId={order.id} />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Summary + Payment */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💰 Price Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{order.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span className="font-medium">₹{order.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {(order.shipping_amount || 0) === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `₹${(order.shipping_amount || 0).toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-bold text-lg text-purple-600">₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💳 Payment Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium capitalize">
                    {order.payment_method === 'upi' ? '📱 UPI' :
                     order.payment_method === 'cod' ? '💵 Cash on Delivery' :
                     order.payment_method === 'card' ? '💳 Card' : order.payment_method}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.payment_status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Delivery Card */}
            {!isCancelled && order.status !== 'delivered' && (
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="text-sm font-medium opacity-80 mb-1">📅 Expected Delivery</div>
                <div className="text-2xl font-bold">{deliveryDate}</div>
                <div className="text-sm opacity-70 mt-2">5–7 business days from order date</div>
              </div>
            )}

            {order.status === 'delivered' && (
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-xl font-bold">Delivered!</div>
                <div className="text-sm opacity-80 mt-1">Thank you for shopping with EventVerse</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
