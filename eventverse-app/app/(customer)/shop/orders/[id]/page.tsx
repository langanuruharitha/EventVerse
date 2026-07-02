'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, Package, Truck, CheckCircle, XCircle, 
  Clock, MapPin, Phone, Mail, Download, AlertCircle
} from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  discount_amount: number;
  shipping_charges: number;
  tax_amount: number;
  total_amount: number;
  shipping_address: any;
  order_date: string;
  payment_date?: string;
  shipped_date?: string;
  delivered_date?: string;
  cancelled_date?: string;
  tracking_number?: string;
  courier_partner?: string;
  customer_notes?: string;
  order_items: Array<{
    id: string;
    product_name: string;
    product_sku: string;
    product_image_url: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    selected_variant?: any;
  }>;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/signin');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'confirmed':
        return Clock;
      case 'processing':
        return Package;
      case 'shipped':
        return Truck;
      case 'delivered':
        return CheckCircle;
      case 'cancelled':
      case 'returned':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const orderTimeline = order ? [
    {
      status: 'Order Placed',
      date: order.order_date,
      completed: true,
      icon: CheckCircle,
    },
    {
      status: 'Payment Confirmed',
      date: order.payment_date,
      completed: order.payment_status === 'paid',
      icon: CheckCircle,
    },
    {
      status: 'Processing',
      date: order.status !== 'pending' ? order.order_date : null,
      completed: ['processing', 'shipped', 'delivered'].includes(order.status.toLowerCase()),
      icon: Package,
    },
    {
      status: 'Shipped',
      date: order.shipped_date,
      completed: ['shipped', 'delivered'].includes(order.status.toLowerCase()),
      icon: Truck,
    },
    {
      status: 'Delivered',
      date: order.delivered_date,
      completed: order.status.toLowerCase() === 'delivered',
      icon: CheckCircle,
    },
  ] : [];

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

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Button onClick={() => router.push('/shop/orders')}>Back to Orders</Button>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/shop/orders')}
              className="gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Order Details</h1>
                <p className="text-gray-600">Order #{order.order_number}</p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Order Status</h2>
                  <Badge className={getStatusColor(order.status)}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {order.status}
                  </Badge>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {orderTimeline.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <step.icon className="w-5 h-5" />
                        </div>
                        {index < orderTimeline.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              step.completed ? 'bg-green-300' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.status}
                        </p>
                        {step.date && (
                          <p className="text-sm text-gray-500">
                            {new Date(step.date).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Info */}
                {order.tracking_number && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Tracking Number</p>
                    <p className="text-lg font-mono text-blue-700">{order.tracking_number}</p>
                    {order.courier_partner && (
                      <p className="text-sm text-blue-600 mt-1">
                        Courier: {order.courier_partner}
                      </p>
                    )}
                  </div>
                )}
              </Card>

              {/* Order Items */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="w-20 h-20 rounded bg-gray-100 flex-shrink-0">
                        <img
                          src={item.product_image_url || '/placeholder-product.jpg'}
                          alt={item.product_name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.product_name}</h3>
                        <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                        {item.selected_variant && (
                          <p className="text-sm text-gray-600">
                            Variant: {JSON.stringify(item.selected_variant)}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.total_price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          ₹{item.unit_price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Customer Notes */}
              {order.customer_notes && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Notes</h2>
                  <p className="text-gray-700">{order.customer_notes}</p>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Order Summary</h3>
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
                    <span className="text-gray-600">Tax (GST)</span>
                    <span className="font-medium">₹{order.tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {order.shipping_charges === 0 ? 'FREE' : `₹${order.shipping_charges.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-purple-600">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Payment Info */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium capitalize">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge className={order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {order.payment_status}
                    </Badge>
                  </div>
                  {order.payment_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid on</span>
                      <span className="font-medium">
                        {new Date(order.payment_date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Delivery Address */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shipping_address.fullName}</p>
                  <p className="text-gray-700">{order.shipping_address.addressLine1}</p>
                  {order.shipping_address.addressLine2 && (
                    <p className="text-gray-700">{order.shipping_address.addressLine2}</p>
                  )}
                  <p className="text-gray-700">
                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{order.shipping_address.phone}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
    </div>
  );
}
