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
      <div className="text-center py-6 space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 border-2 border-green-500/20 text-green-600">
          <Check className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#1F1E1B]">Attendance Confirmed!</h3>
        <p className="text-xs text-[#1F1E1B]/50 italic font-sans">
          We look forward to celebrating with you.
        </p>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div className="text-center py-6 space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 border-2 border-red-500/20 text-red-500">
          <X className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#1F1E1B]">Regrets Noted</h3>
        <p className="text-xs text-[#1F1E1B]/50 italic font-sans">
          We&apos;re sorry you can&apos;t make it. You will be missed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      <button
        onClick={() => handleRsvp('confirmed')}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50 hover:shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
          color: '#FAF0E0',
          boxShadow: '0 4px 14px rgba(138,28,44,0.25)',
        }}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        Yes, I&apos;ll be there!
      </button>

      <button
        onClick={() => handleRsvp('declined')}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-[#DDD0BB] bg-[#FAF6F0] text-[#7A6652] rounded text-sm font-semibold uppercase tracking-wider hover:bg-[#EDE0CC] transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        Sorry, I can&apos;t make it
      </button>
    </div>
  );
}
