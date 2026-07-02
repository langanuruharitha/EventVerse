'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ShoppingPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [eventId]);

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/shopping`);
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching shopping items:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePurchased = async (itemId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/shopping/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_purchased: !currentStatus }),
      });

      if (response.ok) {
        setItems(items.map(item => 
          item.id === itemId ? { ...item, is_purchased: !currentStatus } : item
        ));
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const totalCost = items.reduce((sum, item) => sum + (item.estimated_price || 0), 0);
  const purchasedCount = items.filter(item => item.is_purchased).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/events/eventdetail/${eventId}`}
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold"
        >
          ← Back to Event
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">🛒 Shopping List</h1>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Estimated</div>
              <div className="text-2xl font-bold text-purple-600">
                ₹{totalCost.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Shopping Progress</span>
              <span className="text-sm font-semibold text-purple-600">
                {purchasedCount}/{items.length} items
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${items.length > 0 ? (purchasedCount / items.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading items...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
                <div key={category}>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">
                      {category === 'Decorations' ? '🎨' :
                       category === 'Food & Beverages' ? '🍽️' :
                       category === 'Party Supplies' ? '🎉' :
                       category === 'Gifts' ? '🎁' : '📦'}
                    </span>
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(categoryItems as any[]).map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          item.is_purchased
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={item.is_purchased || false}
                            onChange={() => togglePurchased(item.id, item.is_purchased)}
                            className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <h3
                              className={`font-semibold ${
                                item.is_purchased
                                  ? 'text-green-700 line-through'
                                  : 'text-gray-900'
                              }`}
                            >
                              {item.item_name}
                            </h3>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                              <span className="font-bold text-purple-600">
                                ₹{item.estimated_price?.toLocaleString('en-IN')}
                              </span>
                            </div>
                            {item.priority && (
                              <span
                                className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                                  item.priority === 'high'
                                    ? 'bg-red-100 text-red-700'
                                    : item.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {item.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-gray-600">No shopping items available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
