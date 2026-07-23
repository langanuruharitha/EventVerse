'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        toast('Order cancelled successfully!', 'success');
        router.refresh();
      } else {
        toast(result.error || 'Failed to cancel order', 'error');
      }
    } catch (error: any) {
      toast('An error occurred while cancelling the order.', 'error');
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
