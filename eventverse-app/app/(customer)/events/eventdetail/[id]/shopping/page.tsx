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
      if (data.success) setItems(data.data);
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
  const progress = items.length > 0 ? (purchasedCount / items.length) * 100 : 0;

  const categoryIcon = (cat: string) => {
    const map: Record<string, string> = {
      Decorations: '🎨', 'Food & Beverages': '🍽️',
      'Party Supplies': '🎉', Gifts: '🎁',
    };
    return map[cat] || '📦';
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back */}
        <Link
          href={`/events/eventdetail/${eventId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
        >
          ← Back to Event
        </Link>

        {/* Header */}
        <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#2C1810]">🛒 Shopping Procurement List</h1>
              <p className="text-xs text-[#1F1E1B]/50 italic mt-1 font-sans">
                Manage and track all event procurement
              </p>
            </div>
            <div className="text-right font-sans">
              <div className="text-2xl font-bold text-[#8A1C2C]">
                ₹{totalCost.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-[#1F1E1B]/50 uppercase tracking-wider">Estimated Total</div>
            </div>
          </div>

          {/* Progress Bar */}
          {items.length > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-[10px] text-[#1F1E1B]/50 uppercase tracking-wider font-sans mb-1.5">
                <span>Procurement Progress — {purchasedCount} of {items.length} acquired</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-[#EDE0CC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8A1C2C] to-[#C5A880] transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white border border-[#DDD0BB] rounded p-12 text-center shadow-sm">
            <div className="text-3xl mb-3">⏳</div>
            <p className="text-xs text-[#1F1E1B]/50 italic font-sans">Loading procurement list...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <div className="bg-white border border-[#DDD0BB] rounded p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="text-sm text-[#1F1E1B]/50 italic">No shopping items have been generated yet.</p>
          </div>
        )}

        {/* Items by Category */}
        {!loading && Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-[#FFFDF8] border-b border-[#FAF6F0] flex items-center gap-2">
              <span className="text-base">{categoryIcon(category)}</span>
              <h2 className="text-sm font-bold text-[#2C1810] uppercase tracking-wide">{category}</h2>
              <span className="ml-auto text-[10px] text-[#1F1E1B]/40 font-sans">
                {(categoryItems as any[]).filter(i => i.is_purchased).length}/{(categoryItems as any[]).length} acquired
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:gap-px">
              {(categoryItems as any[]).map((item) => (
                <div
                  key={item.id}
                  className={`p-4 transition-colors border-b border-[#FAF6F0] md:border-r md:border-b-0 last:border-0 ${
                    item.is_purchased ? 'bg-[#F0FFF4]/30' : 'hover:bg-[#FAF6F0]/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.is_purchased || false}
                      onChange={() => togglePurchased(item.id, item.is_purchased)}
                      className="mt-0.5 h-4 w-4 rounded border-[#DDD0BB] accent-[#8A1C2C] cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-semibold truncate ${
                          item.is_purchased ? 'text-[#1A5C35] line-through opacity-60' : 'text-[#1F1E1B]'
                        }`}
                      >
                        {item.item_name}
                      </h3>
                      <div className="flex items-center justify-between mt-1.5 flex-wrap gap-2">
                        <span className="text-[10px] text-[#1F1E1B]/50 font-sans">Qty: {item.quantity}</span>
                        <span className="font-bold text-sm text-[#8A1C2C] font-sans">
                          ₹{item.estimated_price?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {item.priority && (
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border font-sans ${
                            item.priority === 'high'
                              ? 'bg-red-500/10 border-red-500/20 text-red-800'
                              : item.priority === 'medium'
                              ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-800'
                              : 'bg-blue-500/10 border-blue-500/20 text-blue-800'
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
    </div>
  );
}
