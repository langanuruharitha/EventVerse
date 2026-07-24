'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, ShieldCheck, Send, FileText, User, Phone, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function VendorBookingWorkspacePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const toast = useToast();

  const [setupStatus, setSetupStatus] = useState<'pending' | 'in-progress' | 'completed'>('in-progress');
  const [payoutRequested, setPayoutRequested] = useState(false);

  const handleUpdateStatus = (status: 'pending' | 'in-progress' | 'completed') => {
    setSetupStatus(status);
    toast(`Status updated to: ${status.toUpperCase()}. Host notified live!`, 'success');
  };

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    toast('💸 Payout request sent to Customer for Escrow release!', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B] p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-[#2C1810] text-[#FAF0E0] p-6 rounded-xl border border-[#C5A880]/30 shadow-md font-sans">
        <Link
          href="/vendor/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A880] hover:text-[#FAF0E0] uppercase tracking-wider mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Vendor Bookings
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#C5A880]/40 bg-[#1F0A05] text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-2 font-sans">
              🏪 Vendor Event Execution Hub
            </span>
            <h1 className="text-2xl font-bold font-serif">Booking Execution #{id}</h1>
            <p className="text-xs text-[#FAF0E0]/80 italic font-serif">Client: Langanuru Haritha • Event: Royal Vivah Ceremony</p>
          </div>

          <button
            onClick={handleRequestPayout}
            disabled={payoutRequested}
            className="px-6 py-3 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded shadow hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-60 font-sans"
          >
            <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
            {payoutRequested ? 'Escrow Release Requested' : 'Request Milestone Payment Release'}
          </button>
        </div>
      </div>

      {/* Main Execution Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Update Control */}
        <div className="bg-white rounded-xl border border-[#DDD0BB] p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-[#2C1810] font-serif">Update Live On-Site Setup Status</h3>
          <p className="text-xs text-[#1F1E1B]/70 font-sans italic">
            Updating status automatically syncs on the host's event run-sheet timeline.
          </p>

          <div className="grid grid-cols-3 gap-3 font-sans pt-2">
            <button
              onClick={() => handleUpdateStatus('pending')}
              className={`p-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition text-center cursor-pointer ${
                setupStatus === 'pending'
                  ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-400'
                  : 'bg-white border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0]'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleUpdateStatus('in-progress')}
              className={`p-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition text-center cursor-pointer ${
                setupStatus === 'in-progress'
                  ? 'bg-blue-100 border-blue-500 text-blue-900 ring-2 ring-blue-400'
                  : 'bg-white border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0]'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => handleUpdateStatus('completed')}
              className={`p-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition text-center cursor-pointer ${
                setupStatus === 'completed'
                  ? 'bg-green-100 border-green-500 text-green-900 ring-2 ring-green-400'
                  : 'bg-white border-[#DDD0BB] text-[#7A6652] hover:bg-[#FAF6F0]'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Client Details & Contact */}
        <div className="bg-white rounded-xl border border-[#DDD0BB] p-6 shadow-sm space-y-4 font-sans text-xs">
          <h3 className="text-lg font-bold text-[#2C1810] font-serif">Client & Event Details</h3>
          <div className="space-y-2 bg-[#FAF6F0] p-4 rounded-lg border border-[#DDD0BB]">
            <div className="flex items-center gap-2"><User className="w-4 h-4 text-[#8A1C2C]" /> <strong className="text-[#8A1C2C]">Client:</strong> Langanuru Haritha</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#8A1C2C]" /> <strong className="text-[#8A1C2C]">Phone:</strong> +91 78160 05372</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#8A1C2C]" /> <strong className="text-[#8A1C2C]">Email:</strong> harithalanganuru@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
