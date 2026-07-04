import { getUserOrders } from '@/lib/commerce/order-service';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function OrdersPage() {
  const result = await getUserOrders();

  if (!result.success) {
    if (result.error === 'Not authenticated') {
      redirect('/auth/signin');
    }
    return <div>Error loading orders</div>;
  }

  const orders = result.data || [];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      returned: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      confirmed: '✅',
      processing: '📦',
      shipped: '🚚',
      delivered: '🎉',
      cancelled: '❌',
      returned: '↩️',
    };
    return icons[status] || '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">📦 My Orders</h1>
          <Link
            href="/shop"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to place your first order!</p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getStatusIcon(order.status)}</span>
                        <h3 className="text-xl font-bold text-gray-900">
                          Order #{order.order_number}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Placed on {new Date(order.order_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        ₹{order.total_amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.length || 0} item(s)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items?.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.product_image_url || '/placeholder-product.jpg'}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                          <div className="text-sm text-gray-500">
                            Quantity: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">
                          ₹{item.total_price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="text-sm text-gray-500 text-center">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="flex gap-4 pt-4 border-t">
                    <Link
                      href={`/shop/orders/${order.id}`}
                      className="flex-1 py-3 bg-purple-600 text-white text-center font-semibold rounded-lg hover:bg-purple-700 transition-all"
                    >
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="flex-1 py-3 bg-green-600 text-white text-center font-semibold rounded-lg hover:bg-green-700 transition-all">
                        Download Invoice
                      </button>
                    )}
                    {['pending', 'confirmed'].includes(order.status) && (
                      <button className="flex-1 py-3 bg-red-600 text-white text-center font-semibold rounded-lg hover:bg-red-700 transition-all">
                        Cancel Order
                      </button>
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
