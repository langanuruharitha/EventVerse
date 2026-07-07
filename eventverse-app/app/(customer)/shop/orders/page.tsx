import { getUserOrders } from '@/lib/commerce/order-service';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CancelOrderButton from '@/components/shop/CancelOrderButton';

export default async function OrdersPage() {
  const result = await getUserOrders();

  if (!result.success) {
    if (result.error === 'Not authenticated') redirect('/auth/signin');
    return <div className="p-8 text-center text-red-500">Error loading orders. Please try again.</div>;
  }

  const orders = result.data || [];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      processing: 'bg-purple-100 text-purple-700 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      confirmed: '✅',
      processing: '📦',
      shipped: '🚚',
      delivered: '🎉',
      cancelled: '❌',
    };
    return icons[status] || '📋';
  };

  const getDeliveryDate = (createdAt: string, status: string) => {
    if (status === 'delivered') return 'Delivered ✅';
    if (status === 'cancelled') return 'Cancelled';
    const created = new Date(createdAt);
    created.setDate(created.getDate() + 6);
    return 'By ' + created.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📦 My Orders</h1>
            <p className="text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
          <Link
            href="/shop"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            🛍️ Continue Shopping
          </Link>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <div className="text-9xl mb-6">📦</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
            <p className="text-gray-500 mb-8 text-lg">Start shopping for your event supplies!</p>
            <Link
              href="/shop"
              className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-lg"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 border-b">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getStatusIcon(order.status)}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Order #{order.order_number}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at || order.order_date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-purple-600">
                          ₹{order.total_amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500">{order.items?.length || 0} item(s)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-5">
                  <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                    {(order.items || []).slice(0, 4).map((item: any) => (
                      <div key={item.id} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-xl p-2 pr-4">
                        <img
                          src={item.product_image_url || '/placeholder-product.jpg'}
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 max-w-[120px] truncate">{item.product_name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {(order.items || []).length > 4 && (
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-500">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Estimated Delivery */}
                  {order.status !== 'cancelled' && (
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <span className="text-gray-500">📅 Expected Delivery:</span>
                      <span className="font-semibold text-purple-700">
                        {getDeliveryDate(order.created_at || order.order_date, order.status)}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t">
                    <Link
                      href={`/shop/orders/${order.id}`}
                      className="flex-1 py-2.5 bg-purple-600 text-white text-center font-semibold rounded-xl hover:bg-purple-700 transition-all text-sm"
                    >
                      🔍 View Details & Track
                    </Link>
                    {['pending', 'confirmed'].includes(order.status) && (
                      <div className="flex-1">
                        <CancelOrderButton orderId={order.id} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
