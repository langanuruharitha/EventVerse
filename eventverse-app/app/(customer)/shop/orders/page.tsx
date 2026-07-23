import { getUserOrders } from '@/lib/commerce/order-service';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CancelOrderButton from '@/components/shop/CancelOrderButton';

export default async function OrdersPage() {
  const result = await getUserOrders();

  if (!result.success) {
    if (result.error === 'Not authenticated') redirect('/auth/signin');
    return <div className="p-8 text-center text-red-500 text-sm">Error loading orders. Please try again.</div>;
  }

  const orders = result.data || [];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending:    'bg-yellow-500/10 border-yellow-500/20 text-yellow-800',
      confirmed:  'bg-blue-500/10 border-blue-500/20 text-blue-800',
      processing: 'bg-purple-500/10 border-purple-500/20 text-purple-800',
      shipped:    'bg-indigo-500/10 border-indigo-500/20 text-indigo-800',
      delivered:  'bg-green-500/10 border-green-500/20 text-green-800',
      cancelled:  'bg-red-500/10 border-red-500/20 text-red-800',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border font-sans ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳', confirmed: '✅', processing: '📦',
      shipped: '🚚', delivered: '🎉', cancelled: '❌',
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
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B] p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2C1810]">📦 My Orders</h1>
            <p className="text-xs text-[#1F1E1B]/50 italic mt-1 font-sans">
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </div>
          <Link
            href="/shop"
            className="px-5 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow transition font-sans"
          >
            🛍️ Continue Shopping
          </Link>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-16 text-center">
            <div className="text-7xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-[#2C1810] mb-2">No Orders Yet</h2>
            <p className="text-xs text-[#1F1E1B]/50 italic mb-6 font-sans">Start shopping for your event supplies</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold rounded hover:shadow transition font-sans"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="bg-[#FFFDF8] px-5 py-4 border-b border-[#FAF6F0]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getStatusIcon(order.status)}</span>
                      <div>
                        <h3 className="text-sm font-bold text-[#1F1E1B]">Order #{order.order_number}</h3>
                        <p className="text-[10px] text-[#1F1E1B]/50 font-sans mt-0.5">
                          {new Date(order.created_at || order.order_date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <div className="text-right font-sans">
                        <div className="font-bold text-sm text-[#8A1C2C]">₹{order.total_amount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-[#1F1E1B]/40">{order.items?.length || 0} item(s)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="p-5">
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {(order.items || []).slice(0, 4).map((item: any) => (
                      <div key={item.id} className="flex-shrink-0 flex items-center gap-2 bg-[#FAF6F0] border border-[#DDD0BB] rounded px-3 py-2">
                        <img
                          src={item.product_image_url || '/placeholder-product.jpg'}
                          alt={item.product_name}
                          className="w-10 h-10 object-cover rounded border border-[#EDE0CC]"
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-[#1F1E1B] max-w-[100px] truncate">{item.product_name}</p>
                          <p className="text-[9px] text-[#1F1E1B]/40 font-sans">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {(order.items || []).length > 4 && (
                      <div className="flex-shrink-0 w-14 h-14 bg-[#EDE0CC] rounded flex items-center justify-center text-xs font-bold text-[#1F1E1B]/50 font-sans">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  {order.status !== 'cancelled' && (
                    <div className="flex items-center gap-1.5 mb-4 text-[11px] font-sans">
                      <span className="text-[#1F1E1B]/40">📅 Expected:</span>
                      <span className="font-semibold text-[#8A1C2C]">
                        {getDeliveryDate(order.created_at || order.order_date, order.status)}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 border-t border-[#FAF6F0] pt-4">
                    <Link
                      href={`/shop/orders/${order.id}`}
                      className="flex-1 py-2 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-center text-[11px] font-bold rounded hover:shadow transition font-sans"
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
