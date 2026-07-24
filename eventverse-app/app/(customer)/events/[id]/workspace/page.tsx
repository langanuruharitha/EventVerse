'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Clock, CheckCircle2, Circle, Sparkles, FileText, 
  MessageSquare, ShieldCheck, Download, Share2, Plus, Edit3, User, Calendar, MapPin
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface RunSheetItem {
  id: string;
  time: string;
  title: string;
  assignedVendor: string;
  category: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface ApprovalItem {
  id: string;
  title: string;
  vendorName: string;
  category: string;
  status: 'approved' | 'pending' | 'revision-requested';
  details: string;
}

export default function SharedEventWorkspacePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'run-sheet' | 'approvals' | 'contract'>('run-sheet');
  const [signedContract, setSignedContract] = useState(false);

  // Mock initial run-sheet items
  const [runSheet, setRunSheet] = useState<RunSheetItem[]>([
    { id: '1', time: '08:00 AM', title: 'Venue Gate Unlocked & Vendor Entry', assignedVendor: 'The Palace Gardens Staff', category: 'Venue', status: 'completed' },
    { id: '2', time: '10:00 AM', title: 'Mandap Floral Decoration & Lighting Setup', assignedVendor: 'Royal Crafts Decorators', category: 'Decor', status: 'in-progress' },
    { id: '3', time: '01:00 PM', title: 'Sound & Mic System Soundcheck', assignedVendor: 'DJ Beats & Sound', category: 'Entertainment', status: 'pending' },
    { id: '4', time: '04:00 PM', title: 'Catering Buffet Counter Setup & Food Warming', assignedVendor: 'Royal Feast Caterers', category: 'Catering', status: 'pending' },
    { id: '5', time: '06:00 PM', title: 'Baraat Welcome & Garlanding Ceremony', assignedVendor: 'Host Family & Coordinators', category: 'Ceremony', status: 'pending' },
    { id: '6', time: '08:00 PM', title: 'Dinner Buffet Opening & Live Music Performance', assignedVendor: 'Royal Feast & DJ Beats', category: 'Dining', status: 'pending' },
  ]);

  // Mock approval items
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    { id: 'a1', title: 'Traditional Marigold & Gold Velvet Mandap Decor', vendorName: 'Royal Crafts Decorators', category: 'Decor', status: 'approved', details: 'Full backdrop design with gold drapes and marigold garlands.' },
    { id: 'a2', title: 'North & South Indian Fusion 7-Course Dinner Menu', vendorName: 'Royal Feast Caterers', category: 'Catering', status: 'pending', details: 'Includes Paneer Tikka, Dal Makhani, Live Dosa counter, and Gulab Jamun.' },
    { id: 'a3', title: 'Sangeet Entry Song Playlist & Lighting Cue', vendorName: 'DJ Beats & Sound', category: 'Entertainment', status: 'pending', details: 'Special entrance track timing and smoke machine cue.' },
  ]);

  const toggleRunSheetStatus = (itemId: string) => {
    setRunSheet(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextStatus = item.status === 'completed' ? 'pending' : item.status === 'in-progress' ? 'completed' : 'in-progress';
        toast(`Task status updated to: ${nextStatus.toUpperCase()}`, 'info');
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleApproveItem = (id: string) => {
    setApprovals(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
    toast('🎉 Item approved successfully! Vendor notified.', 'success');
  };

  const handleSignContract = () => {
    setSignedContract(true);
    toast('✍️ Digital contract signed & verified on blockchain ledger!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B]">
      {/* Header Banner */}
      <div className="bg-[#2C1810] text-[#FAF0E0] py-8 border-b border-[#C5A880]/30 relative font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/events/eventdetail/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A880] hover:text-[#FAF0E0] uppercase tracking-wider mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Event Overview
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#C5A880]/40 bg-[#1F0A05] text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-2 font-sans">
                🤝 Dual-Portal Collaborative Workspace
              </span>
              <h1 className="text-3xl font-bold font-serif">Royal Vivah Ceremony Workspace</h1>
              <p className="text-xs text-[#FAF0E0]/80 italic mt-1 font-serif">
                Event ID #{id} • Shared live command hub for Host & Booked Vendors
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/events/${id}/payments`}
                className="px-4 py-2.5 bg-[#8A1C2C] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded border border-[#C5A880]/40 hover:bg-[#6B1522] transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                Escrow Payments
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#DDD0BB] bg-white rounded-t-xl overflow-hidden shadow-sm font-sans">
          {[
            { id: 'run-sheet', label: '📅 Live Event Run-Sheet (Timeline)', icon: Clock },
            { id: 'approvals', label: '✅ Vendor Item Approvals', icon: CheckCircle2 },
            { id: 'contract', label: '📜 Digital E-Sign Contract', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#8A1C2C] text-[#8A1C2C] bg-[#FAF6F0]'
                    : 'border-transparent text-[#7A6652] hover:text-[#8A1C2C]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Live Event Day Run-Sheet */}
        {activeTab === 'run-sheet' && (
          <div className="bg-white rounded-b-xl border border-[#DDD0BB] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF6F0] pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#2C1810]">Minute-by-Minute Live Schedule</h3>
                <p className="text-xs text-[#1F1E1B]/60 font-sans italic">
                  Click any schedule item to cycle status: Pending → In-Progress → Completed. Updates sync live to all vendors!
                </p>
              </div>
              <div className="flex items-center gap-2 font-sans text-xs">
                <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
                <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> In Progress
                </span>
                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-semibold">
                  <Circle className="w-3.5 h-3.5" /> Pending
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {runSheet.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleRunSheetStatus(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    item.status === 'completed'
                      ? 'bg-green-50/60 border-green-200'
                      : item.status === 'in-progress'
                      ? 'bg-blue-50/60 border-blue-200 shadow-md'
                      : 'bg-[#FFFDF8] border-[#DDD0BB]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 py-2 bg-[#2C1810] text-[#FFD700] rounded text-center text-xs font-bold font-sans shadow-sm flex-shrink-0">
                      {item.time}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#8A1C2C]/10 text-[#8A1C2C] font-sans">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-base font-serif text-[#2C1810]">{item.title}</h4>
                      </div>
                      <p className="text-xs text-[#1F1E1B]/70 font-sans italic">
                        Assigned to: <span className="font-semibold text-[#8A1C2C]">{item.assignedVendor}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-sans text-xs">
                    {item.status === 'completed' && (
                      <span className="px-3 py-1.5 rounded-full bg-green-600 text-white font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                    {item.status === 'in-progress' && (
                      <span className="px-3 py-1.5 rounded-full bg-blue-600 text-white font-bold flex items-center gap-1 text-[11px] animate-pulse">
                        <Clock className="w-3.5 h-3.5" /> In Progress
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300 text-[11px]">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Vendor Approvals */}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-b-xl border border-[#DDD0BB] p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold font-serif text-[#2C1810]">Vendor Service & Item Approvals</h3>
              <p className="text-xs text-[#1F1E1B]/60 font-sans italic mt-1">
                Review and approve decor mockups, menu choices, and music playlists submitted by your booked vendors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvals.map((item) => (
                <div key={item.id} className="bg-[#FFFDF8] border border-[#DDD0BB] rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#2C1810] text-[#C5A880] font-sans">
                        {item.category}
                      </span>
                      {item.status === 'approved' ? (
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-sans">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full font-sans">
                          Pending Approval
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-lg font-serif text-[#2C1810]">{item.title}</h4>
                    <p className="text-xs text-[#8A1C2C] font-semibold font-sans">Submitted by: {item.vendorName}</p>
                    <p className="text-xs text-[#1F1E1B]/70 italic leading-relaxed font-serif">"{item.details}"</p>
                  </div>

                  {item.status !== 'approved' && (
                    <div className="pt-3 border-t border-[#DDD0BB]/50 flex items-center gap-2 font-sans">
                      <button
                        onClick={() => handleApproveItem(item.id)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#FFD700]" /> Approve Item
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Digital E-Sign Contract */}
        {activeTab === 'contract' && (
          <div className="bg-white rounded-b-xl border border-[#DDD0BB] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF6F0] pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#2C1810]">Digital Event Contract & Verification</h3>
                <p className="text-xs text-[#1F1E1B]/60 font-sans italic mt-0.5">
                  Legally binding digital agreement between Event Host and Service Providers.
                </p>
              </div>

              {signedContract ? (
                <span className="px-4 py-2 rounded-full bg-green-100 border border-green-300 text-green-800 text-xs font-bold flex items-center gap-1.5 font-sans">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> Contract Signed & Verified
                </span>
              ) : (
                <button
                  onClick={handleSignContract}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-xs font-bold uppercase tracking-wider rounded font-sans shadow hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-[#FFD700]" /> Sign Digital Contract
                </button>
              )}
            </div>

            <div className="bg-[#1F1E1B] text-[#FAF0E0] p-6 rounded-xl border-2 border-double border-[#C5A880] space-y-4 font-serif text-xs">
              <div className="text-center border-b border-[#C5A880]/30 pb-4 space-y-1">
                <span className="text-[#C5A880] text-xs uppercase tracking-widest font-sans font-bold">⚜ EVENTVERSE OFFICIAL CONTRACT ⚜</span>
                <h4 className="text-lg font-bold text-[#FFD700]">Event Master Service Agreement</h4>
                <p className="text-[11px] text-[#FAF0E0]/70 italic">Contract Reference ID: #EV-2026-N9824</p>
              </div>

              <div className="space-y-2 text-[#FAF0E0]/90 leading-relaxed font-sans">
                <p><strong className="text-[#FFD700]">1. Scope of Services:</strong> Vendors agree to deliver venue, catering, decoration, and sound services as specified in the agreed quotation packages.</p>
                <p><strong className="text-[#FFD700]">2. Escrow Protection:</strong> All customer payments are held in 3-stage milestone escrow and released upon milestone completion.</p>
                <p><strong className="text-[#FFD700]">3. Cancellation & Refunds:</strong> Cancellations made 14 days prior to event date receive 90% refund of unreleased escrow balance.</p>
              </div>

              <div className="pt-4 border-t border-[#C5A880]/30 flex flex-col sm:flex-row justify-between gap-4 font-sans text-[11px]">
                <div>
                  <span className="text-[#C5A880] block font-bold">Customer Signature:</span>
                  <div className="mt-1 p-2 bg-[#2C1810] rounded border border-[#C5A880]/40 font-mono text-[#FFD700]">
                    {signedContract ? '✓ SIGNED BY HARITHA (ELECTRONIC ID #8841)' : '[ Awaiting Digital Signature ]'}
                  </div>
                </div>
                <div>
                  <span className="text-[#C5A880] block font-bold">Vendor Consortium Signature:</span>
                  <div className="mt-1 p-2 bg-[#2C1810] rounded border border-[#C5A880]/40 font-mono text-[#FFD700]">
                    ✓ SIGNED BY VERIFIED VENDORS (ID #V-401)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
