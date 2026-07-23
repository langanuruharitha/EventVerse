'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, primary_image_url)
          )
        `)
        .eq('id', orderId)
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
      <div className="min-h-screen bg-[#FAF6F0] p-8 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-lg mx-auto">
          <div className="h-10 bg-[#EDE0CC] rounded w-2/3 mx-auto" />
          <div className="h-64 bg-[#EDE0CC] rounded border border-[#DDD0BB]" />
        </div>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center font-serif">
        <div className="text-center">
          <div className="text-5xl mb-4">📜</div>
          <h1 className="text-xl font-bold text-[#2C1810] mb-4">Order not found</h1>
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

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="w-16 h-16 bg-green-500/10 border-2 border-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600">
            <CheckCircle className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1810]">Order Placed Successfully!</h1>
          <p className="text-xs text-[#1F1E1B]/60 italic font-sans">
            Thank you for your order. We have sent a confirmation email with all details.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6 mb-6">
          <div className="border-b border-[#FAF6F0] pb-4 mb-4 flex justify-between items-start">
            <div>
              <p className="text-[10px] text-[#7A6652] font-bold uppercase tracking-wider font-sans">Order Number</p>
              <p className="text-lg font-bold text-[#2C1810] font-mono">{order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#7A6652] font-bold uppercase tracking-wider font-sans">Total Amount</p>
              <p className="text-xl font-bold text-[#8A1C2C] font-sans">₹{order.total_amount.toFixed(2)}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-bold text-[#2C1810] uppercase tracking-wider font-sans">Order Items</h3>
            {order.order_items?.slice(0, 3).map((item: any) => (
              <div key={item.id} className="flex gap-3 items-center text-xs font-sans">
                <div className="w-12 h-12 rounded bg-[#EDE0CC] flex-shrink-0 overflow-hidden border border-[#DDD0BB]">
                  <img
                    src={item.products?.primary_image_url || '/placeholder-product.jpg'}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1F1E1B] truncate">{item.product_name}</p>
                  <p className="text-[10px] text-[#1F1E1B]/50">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-[#8A1C2C]">₹{item.total_price.toFixed(2)}</p>
              </div>
            ))}
            {order.order_items?.length > 3 && (
              <p className="text-[10px] text-[#1F1E1B]/40 text-center italic font-sans">
                +{order.order_items.length - 3} more items
              </p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="border-t border-[#FAF6F0] pt-4 font-sans text-xs">
            <h3 className="font-bold text-[#2C1810] mb-1">Delivery Address</h3>
            <div className="text-[#1F1E1B]/70 space-y-0.5">
              <p className="font-semibold text-[#1F1E1B]">{order.shipping_address.fullName}</p>
              <p>{order.shipping_address.addressLine1}</p>
              {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
              </p>
              <p className="font-mono">Phone: {order.shipping_address.phone}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6 mb-6">
          <h3 className="text-xs font-bold text-[#2C1810] uppercase tracking-wider font-sans mb-4">What happens next?</h3>
          <div className="space-y-4 font-sans text-xs">
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-full bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center flex-shrink-0 text-[#8A1C2C]">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="font-bold text-[#2C1810]">Order Confirmation</p>
                <p className="text-[#1F1E1B]/60 text-[11px]">
                  You&apos;ll receive an email confirmation with full order details
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-full bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center flex-shrink-0 text-[#8A1C2C]">
                <Package className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="font-bold text-[#2C1810]">Order Processing</p>
                <p className="text-[#1F1E1B]/60 text-[11px]">
                  We&apos;ll prepare your order for shipment within 1-2 business days
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-full bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center flex-shrink-0 text-[#8A1C2C]">
                <Truck className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="font-bold text-[#2C1810]">Out for Delivery</p>
                <p className="text-[#1F1E1B]/60 text-[11px]">
                  Expected delivery by {deliveryDate.toLocaleDateString('en-IN', { 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 font-sans">
          <button
            onClick={() => router.push(`/shop/orders/${orderId}`)}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded flex items-center justify-center gap-2 hover:shadow transition uppercase tracking-wider"
          >
            <Package className="w-4 h-4" /> Track Order
          </button>
          <button
            onClick={() => router.push('/shop/orders')}
            className="flex-1 py-2.5 border border-[#DDD0BB] text-[#7A6652] text-xs font-semibold rounded flex items-center justify-center gap-2 hover:bg-[#FAF6F0] transition"
          >
            View All Orders <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/shop')}
            className="text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans transition"
          >
            Continue Shopping
          </button>
        </div>

        {/* Thank You Message */}
        <div className="mt-8 p-6 bg-white border-2 border-double border-[#C5A880] rounded text-center">
          <p className="text-base font-bold text-[#2C1810] mb-1">
            Thank you for shopping with EventVerse!
          </p>
          <p className="text-xs text-[#1F1E1B]/60 italic">
            We appreciate your trust and look forward to serving your event celebrations again.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF6F0] p-8 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-lg mx-auto">
          <div className="h-10 bg-[#EDE0CC] rounded w-2/3 mx-auto" />
          <div className="h-64 bg-[#EDE0CC] rounded border border-[#DDD0BB]" />
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
