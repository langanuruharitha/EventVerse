'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock, Download, Share2, DollarSign, Clock, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface EscrowMilestone {
  id: string;
  stage: string;
  percent: number;
  amount: number;
  description: string;
  status: 'released' | 'ready-to-release' | 'locked';
  releaseDate?: string;
}

export default function EscrowPaymentTrackerPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const toast = useToast();

  const totalAmount = 150000; // ₹1,50,000 Total Budget

  const [milestones, setMilestones] = useState<EscrowMilestone[]>([
    {
      id: 'm1',
      stage: 'Stage 1: Advance Booking Deposit',
      percent: 30,
      amount: 45000,
      description: 'Secures venue reservation & locks vendor calendars.',
      status: 'released',
      releaseDate: '10 July 2026'
    },
    {
      id: 'm2',
      stage: 'Stage 2: Pre-Event Setup Verification',
      percent: 40,
      amount: 60000,
      description: 'Released when decor setup & catering prep is verified on event day.',
      status: 'ready-to-release'
    },
    {
      id: 'm3',
      stage: 'Stage 3: Post-Event Final Settlement',
      percent: 30,
      amount: 45000,
      description: 'Final payment release after successful event conclusion.',
      status: 'locked'
    }
  ]);

  const handleReleaseEscrow = (milestoneId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        toast(`🎉 ${m.stage} payment of ₹${m.amount.toLocaleString('en-IN')} released to vendors!`, 'success');
        return { ...m, status: 'released', releaseDate: 'Today' };
      }
      return m;
    }));
  };

  const handleDownloadInvoice = () => {
    toast('📥 Generating official EventVerse PDF Tax Receipt...', 'info');
    try {
      const receiptHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>EventVerse Tax Invoice Receipt #${id}</title>
  <style>
    body { font-family: 'Times New Roman', serif; padding: 40px; color: #1F1E1B; background: #FFFDF8; }
    .header { text-align: center; border-bottom: 2px solid #C5A880; padding-bottom: 20px; margin-bottom: 20px; }
    .title { color: #8A1C2C; font-size: 24px; font-weight: bold; margin: 5px 0; }
    .subtitle { color: #C5A880; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; }
    .details { background: #FAF6F0; border: 1px solid #DDD0BB; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .table th, .table td { border: 1px solid #DDD0BB; padding: 12px; text-align: left; font-size: 13px; }
    .table th { background: #2C1810; color: #FFD700; font-family: sans-serif; text-transform: uppercase; font-size: 11px; }
    .total { text-align: right; font-size: 18px; font-weight: bold; color: #8A1C2C; margin-top: 25px; font-family: sans-serif; }
    .footer { margin-top: 40px; font-size: 11px; text-align: center; color: #7A6652; border-top: 1px solid #DDD0BB; padding-top: 15px; font-style: italic; }
  </style>
</head>
<body>
  <div class="header">
    <div class="subtitle">⚜ OFFICIAL EVENTVERSE PAYMENT RECEIPT ⚜</div>
    <h1 class="title">GST TAX INVOICE & ESCROW RECEIPT</h1>
    <p style="font-size: 12px; color: #555; margin: 0;">Receipt ID: #EV-2026-${id} • Date: ${new Date().toLocaleDateString('en-IN')}</p>
  </div>
  <div class="details">
    <p style="margin: 3px 0;"><strong>Customer Name:</strong> Langanuru Haritha</p>
    <p style="margin: 3px 0;"><strong>Event Name:</strong> Royal Vivah Ceremony (ID #${id})</p>
    <p style="margin: 3px 0;"><strong>Escrow Vault Protection:</strong> 100% Guaranteed by EventVerse</p>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th>Milestone Stage</th>
        <th>Percentage</th>
        <th>Status</th>
        <th>Amount (INR)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Stage 1: Advance Booking Deposit</td>
        <td>30%</td>
        <td>RELEASED TO VENDORS</td>
        <td>₹45,000</td>
      </tr>
      <tr>
        <td>Stage 2: Pre-Event Setup Verification</td>
        <td>40%</td>
        <td>READY TO RELEASE</td>
        <td>₹60,000</td>
      </tr>
      <tr>
        <td>Stage 3: Post-Event Final Settlement</td>
        <td>30%</td>
        <td>ESCROW LOCKED</td>
        <td>₹45,000</td>
      </tr>
    </tbody>
  </table>
  <div class="total">Total Event Budget: ₹1,50,000</div>
  <div class="footer">
    Thank you for using EventVerse! This is an official tax receipt under EventVerse Escrow Buyer Guarantee.
  </div>
</body>
</html>
      `;

      const blob = new Blob([receiptHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `EventVerse-Tax-Receipt-EV-${id}.html`;
      link.click();
      URL.revokeObjectURL(url);
      toast('📥 Tax Receipt downloaded successfully!', 'success');
    } catch (e) {
      console.error(e);
      toast('Failed to generate receipt. Please try again.', 'error');
    }
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(`Check out our EventVerse Escrow Payment Status for Event #${id}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header Banner */}
      <div className="bg-[#2C1810] text-[#FAF0E0] py-8 border-b border-[#C5A880]/30 relative font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/events/${id}/workspace`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A880] hover:text-[#FAF0E0] uppercase tracking-wider mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Event Workspace
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#C5A880]/40 bg-[#1F0A05] text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-2 font-sans">
                🛡️ Protected Escrow Payment Vault
              </span>
              <h1 className="text-3xl font-bold font-serif">Milestone Payment Tracker</h1>
              <p className="text-xs text-[#FAF0E0]/80 italic mt-1 font-serif">
                Total Budget: <strong className="text-[#FFD700]">₹{totalAmount.toLocaleString('en-IN')}</strong> • Event ID #{id}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadInvoice}
                className="px-4 py-2.5 bg-white border border-[#DDD0BB] text-[#2C1810] text-xs font-bold uppercase tracking-wider rounded shadow hover:bg-[#FAF6F0] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#8A1C2C]" /> PDF Receipt
              </button>
              <button
                onClick={handleShareWhatsapp}
                className="px-4 py-2.5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded shadow hover:bg-[#20bd5a] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Escrow Guarantee Banner */}
        <div className="bg-white rounded-xl border border-[#DDD0BB] p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 border border-green-300 flex items-center justify-center text-green-700 flex-shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1 font-sans text-center sm:text-left">
            <h3 className="font-bold text-base text-[#2C1810] font-serif">100% Buyer Protection & Escrow Guarantee</h3>
            <p className="text-xs text-[#1F1E1B]/70 italic">
              Your money is safely locked in EventVerse Escrow. Payments are only released to vendors when you verify milestone completion.
            </p>
          </div>
        </div>

        {/* 3-Stage Escrow Timeline */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold font-serif text-[#2C1810]">Payment Milestones & Breakdown</h3>

          <div className="space-y-4">
            {milestones.map((m) => (
              <div
                key={m.id}
                className={`bg-white rounded-xl border p-6 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                  m.status === 'released'
                    ? 'border-green-300 bg-green-50/30'
                    : m.status === 'ready-to-release'
                    ? 'border-[#8A1C2C] ring-2 ring-[#8A1C2C]/20'
                    : 'border-[#DDD0BB]'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-[#2C1810] text-[#FFD700] font-sans">
                      {m.percent}% Milestone
                    </span>
                    <h4 className="font-bold text-lg font-serif text-[#2C1810]">{m.stage}</h4>
                  </div>
                  <p className="text-xs text-[#1F1E1B]/70 font-sans italic">{m.description}</p>

                  <div className="text-xl font-extrabold text-[#8A1C2C] font-sans pt-1">
                    ₹{m.amount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="font-sans flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                  {m.status === 'released' && (
                    <div className="text-right space-y-1">
                      <span className="px-4 py-2 bg-green-600 text-white text-xs font-bold uppercase tracking-wider rounded-full inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Released to Vendor
                      </span>
                      <p className="text-[10px] text-green-800 font-semibold italic">Released on {m.releaseDate}</p>
                    </div>
                  )}

                  {m.status === 'ready-to-release' && (
                    <button
                      onClick={() => handleReleaseEscrow(m.id)}
                      className="px-6 py-3 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded shadow hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#FFD700]" /> Release Escrow Funds Now
                    </button>
                  )}

                  {m.status === 'locked' && (
                    <span className="px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 text-xs font-bold uppercase tracking-wider rounded-full inline-flex items-center gap-1.5">
                      <Lock className="w-4 h-4" /> Locked (Pending Stage 2)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
