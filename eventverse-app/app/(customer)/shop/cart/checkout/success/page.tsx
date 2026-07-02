'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle, Package, Truck, Mail, Download, ArrowRight } from 'lucide-react';

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
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-12 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
      </div>
    );
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-xl font-bold">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-purple-600">₹{order.total_amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold">Order Items</h3>
            {order.order_items?.slice(0, 3).map((item: any) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0">
                  <img
                    src={item.products?.primary_image_url || '/placeholder-product.jpg'}
                    alt={item.product_name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{item.total_price.toFixed(2)}</p>
              </div>
            ))}
            {order.order_items?.length > 3 && (
              <p className="text-sm text-gray-600 text-center">
                +{order.order_items.length - 3} more items
              </p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <div className="text-sm text-gray-700">
              <p className="font-medium">{order.shipping_address.fullName}</p>
              <p>{order.shipping_address.addressLine1}</p>
              {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
              </p>
              <p>Phone: {order.shipping_address.phone}</p>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">What happens next?</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-sm text-gray-600">
                  You'll receive an email confirmation with order details
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-gray-600">
                  We'll prepare your order for shipment within 1-2 business days
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Out for Delivery</p>
                <p className="text-sm text-gray-600">
                  Expected delivery by {deliveryDate.toLocaleDateString('en-IN', { 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push(`/shop/orders/${orderId}`)}
            className="flex-1 gap-2"
          >
            <Package className="w-4 h-4" />
            Track Order
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/shop/orders')}
            className="flex-1 gap-2"
          >
            View All Orders
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/shop')}
            className="gap-2"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="mt-8 p-6 bg-purple-50 rounded-lg text-center">
          <p className="text-lg font-medium text-purple-900 mb-2">
            Thank you for shopping with EventVerse!
          </p>
          <p className="text-sm text-purple-700">
            We appreciate your business and hope you enjoy your purchase.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
