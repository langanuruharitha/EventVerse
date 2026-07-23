'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const mockSystemStats = {
  totalUsers: 1420,
  activeVendors: 184,
  pendingVerifications: 14,
  totalBookings: 840,
  totalTransactionVolume: 4280500,
  totalCommissionEarned: 428050,
};

const DEMO_PENDING_VENDORS_KEY = 'eventverse_demo_pending_vendors';

const getInitialPendingVendors = () => [
  { id: 1, name: 'Golden Catering Services', category: 'Catering', date: '2026-07-02', owner: 'Ramesh Patel' },
  { id: 2, name: 'DJ Rhythm Beats', category: 'DJ Services', date: '2026-07-01', owner: 'Arjun Das' },
  { id: 3, name: 'Royal Palace Venue', category: 'Venue', date: '2026-06-30', owner: 'Sanjay Dutt' },
];

const mockRecentLogs = [
  { action: 'Vendor Approved', detail: 'Epic Moments Photography verified by admin', time: '1 hour ago', type: 'success' },
  { action: 'Review Flagged', detail: 'Review #104 flagged for moderation by customer', time: '4 hours ago', type: 'warning' },
  { action: 'Commission Payout', detail: 'Payout of ₹46,800 initiated to Epic Moments', time: '1 day ago', type: 'info' },
  { action: 'New User Signup', detail: 'Customer Priya Sharma registered', time: '2 days ago', type: 'info' },
];

export default function AdminDashboardPage() {
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);

  useEffect(() => {
    const storedPendingVendors = localStorage.getItem(DEMO_PENDING_VENDORS_KEY);
    if (storedPendingVendors) {
      setPendingVendors(JSON.parse(storedPendingVendors));
    } else {
      const initialVendors = getInitialPendingVendors();
      setPendingVendors(initialVendors);
      localStorage.setItem(DEMO_PENDING_VENDORS_KEY, JSON.stringify(initialVendors));
    }
  }, []);

  const approveQuick = (id: number) => {
    const updatedVendors = pendingVendors.filter(v => v.id !== id);
    setPendingVendors(updatedVendors);
    localStorage.setItem(DEMO_PENDING_VENDORS_KEY, JSON.stringify(updatedVendors));
  };

  return (
    <div className="space-y-8 font-serif text-[#1F1E1B]">
      {/* Welcome Banner */}
      <div className="relative bg-[#2C1810] rounded border-2 border-double border-[#C5A880] p-6 sm:p-8 text-[#FAF0E0] shadow-md">
        <div className="absolute top-2 left-2 text-xs text-[#C5A880]">❦</div>
        <div className="absolute top-2 right-2 text-xs text-[#C5A880]">❦</div>
        <div className="absolute bottom-2 left-2 text-xs text-[#C5A880]">❦</div>
        <div className="absolute bottom-2 right-2 text-xs text-[#C5A880]">❦</div>

        <div className="flex items-center justify-between flex-wrap gap-4 relative">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[#C5A880]/30 bg-[#FAF6F0]/10 text-[#C5A880] text-[10px] font-bold uppercase tracking-widest font-sans">
              👑 Master Admin Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF0E0]">
              Welcome back, Admin! 🛡️
            </h1>
            <p className="text-xs text-[#C5A880] italic font-sans">
              "Platform system status is optimal. 100% services online and verified."
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: 'Total Platform Users', val: mockSystemStats.totalUsers.toLocaleString('en-IN'), icon: '👥' },
          { label: 'Active Guild Vendors', val: mockSystemStats.activeVendors.toLocaleString('en-IN'), icon: '🏪' },
          { label: 'Pending Verifications', val: pendingVendors.length, icon: '⌛' },
          { label: 'Total Ceremonies Booked', val: mockSystemStats.totalBookings.toLocaleString('en-IN'), icon: '📅' },
          { label: 'Total Platform Volume', val: `₹${mockSystemStats.totalTransactionVolume.toLocaleString('en-IN')}`, icon: '💳' },
          { label: 'Platform Revenue Earned', val: `₹${mockSystemStats.totalCommissionEarned.toLocaleString('en-IN')}`, icon: '👑' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#DDD0BB] rounded p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#7A6652] uppercase tracking-widest font-sans mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-[#2C1810] font-sans">{stat.val}</p>
            </div>
            <div className="w-10 h-10 rounded bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center text-lg">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Verifications */}
        <div className="lg:col-span-2 bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#FAF6F0] bg-[#FFFDF8] flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2C1810]">Pending Vendor Approvals</h2>
            <Link href="/admin/vendors" className="text-xs text-[#8A1C2C] hover:underline font-sans font-semibold uppercase tracking-wider">
              Manage All ({pendingVendors.length}) →
            </Link>
          </div>

          <div className="p-6">
            {pendingVendors.length > 0 ? (
              <div className="space-y-3 font-sans text-xs">
                {pendingVendors.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3.5 bg-[#FAF6F0] border border-[#DDD0BB] rounded flex-wrap gap-2">
                    <div>
                      <p className="font-bold text-sm text-[#2C1810]">{v.name}</p>
                      <p className="text-[10px] text-[#1F1E1B]/60">{v.category} · Submitted by {v.owner} on {v.date}</p>
                    </div>
                    <button
                      onClick={() => approveQuick(v.id)}
                      className="px-4 py-1.5 bg-gradient-to-r from-[#8A1C2C] to-[#6B1522] text-[#FAF0E0] text-[10px] font-bold rounded uppercase tracking-wider hover:shadow transition"
                    >
                      Approve Guild
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#1F1E1B]/50 italic text-center py-6">All vendor applications have been reviewed!</p>
            )}
          </div>
        </div>

        {/* System Activity */}
        <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6 space-y-4 font-sans text-xs">
          <h2 className="text-base font-bold text-[#2C1810] border-b border-[#FAF6F0] pb-3 font-serif">Audit Log & System Events</h2>
          <div className="space-y-3">
            {mockRecentLogs.map((log, i) => (
              <div key={i} className="p-3 bg-[#FAF6F0] border border-[#DDD0BB] rounded space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#8A1C2C] text-[11px]">{log.action}</span>
                  <span className="text-[9px] text-[#1F1E1B]/40">{log.time}</span>
                </div>
                <p className="text-[11px] text-[#1F1E1B]/70">{log.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
