'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        alert('✅ Order cancelled successfully!');
        router.refresh();
      } else {
        alert('❌ ' + (result.error || 'Failed to cancel order'));
      }
    } catch (error: any) {
      alert('An error occurred while cancelling the order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="flex-1 py-3 bg-red-600 text-white text-center font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-all"
    >
      {loading ? 'Cancelling...' : '❌ Cancel Order'}
    </button>
  );
}
