'use client';

import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';

interface RsvpClientProps {
  guestId: string;
  currentStatus: string;
}

export default function RsvpClient({ guestId, currentStatus }: RsvpClientProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleRsvp = async (newStatus: 'confirmed' | 'declined') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/guests/${guestId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update RSVP');
      
      setStatus(newStatus);
    } catch (error) {
      console.error('RSVP Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'confirmed') {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">You're confirmed!</h3>
        <p className="text-gray-600">We're looking forward to seeing you.</p>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <X className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">You've declined.</h3>
        <p className="text-gray-600">We're sorry you can't make it!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => handleRsvp('confirmed')}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
        Yes, I'll be there!
      </button>

      <button
        onClick={() => handleRsvp('declined')}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
        No, I can't make it
      </button>
    </div>
  );
}
