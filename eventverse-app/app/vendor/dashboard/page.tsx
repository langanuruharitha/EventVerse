'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const mockStats = {
  totalBookings: 47,
  pendingRequests: 8,
  totalRevenue: 284500,
  rating: 4.8,
  totalReviews: 32,
  completedThisMonth: 12,
};

const mockBookings = [
  { id: 1, customer: 'Priya Sharma', service: 'Wedding Photography', date: '2026-08-15', amount: 45000, status: 'confirmed' },
  { id: 2, customer: 'Rahul Mehta', service: 'Birthday Decoration', date: '2026-07-20', amount: 12000, status: 'pending' },
  { id: 3, customer: 'Anjali Singh', service: 'Mehendi Service', date: '2026-07-28', amount: 8000, status: 'pending' },
  { id: 4, customer: 'Vikram Patel', service: 'Wedding Photography', date: '2026-07-10', amount: 52000, status: 'completed' },
];

const mockActivity = [
  { icon: '📅', text: 'New booking request from Priya Sharma', time: '2 hours ago' },
  { icon: '💰', text: 'Payment of ₹45,000 received', time: '5 hours ago' },
  { icon: '⭐', text: 'New 5-star review from Vikram Patel', time: '1 day ago' },
  { icon: '✅', text: 'Booking #42 marked as completed', time: '2 days ago' },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-500/10 text-green-800 border-green-500/20',
  pending: 'bg-amber-500/10 text-amber-800 border-amber-500/20',
  completed: 'bg-blue-500/10 text-blue-800 border-blue-500/20',
  cancelled: 'bg-red-500/10 text-red-800 border-red-500/20',
};

export default function VendorDashboardPage() {
  const [greeting, setGreeting] = useState('Good day');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="space-y-8 font-serif text-[#1F1E1B]">
      {/* Welcome Banner - Royal Dark Header */}
      <div className="relative bg-[#2C1810] rounded border-2 border-double border-[#C5A880] p-6 sm:p-8 text-[#FAF0E0] shadow-md">
        <div className="absolute top-2 left-2 text-xs text-[#C5A880]">❦</div>
        <div className="absolute top-2 right-2 text-xs text-[#C5A880]">❦</div>
        <div className="absolute bottom-2 left-2 text-xs text-[#C5A880]">❦</div>
        <div className="absolute bottom-2 right-2 text-xs text-[#C5A880]">❦</div>

        <div className="flex items-center justify-between flex-wrap gap-4 relative">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[#C5A880]/30 bg-[#FAF6F0]/10 text-[#C5A880] text-[10px] font-bold uppercase tracking-widest font-sans">
              ⚜ Royal Vendor Command
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF0E0]">
              {greeting}, Vendor!
            </h1>
            <p className="text-xs text-[#C5A880] italic font-sans">
              "Here is your real-time business performance & guild lead status overview."
            </p>
          </div>

          <div className="text-right font-sans">
            <p className="text-[10px] text-[#C5A880] uppercase tracking-wider font-bold">Guild Status</p>
            <span className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/30 text-green-300 px-3 py-1 rounded text-xs font-bold mt-1">
              ✓ Verified Partner
            </span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Bookings', val: mockStats.totalBookings, change: '+3 this week', icon: '📅' },
          { label: 'Pending Requests', val: mockStats.pendingRequests, change: 'Needs action', icon: '⌛' },
          { label: 'Total Revenue', val: `₹${mockStats.totalRevenue.toLocaleString('en-IN')}`, change: '₹48,000 this month', icon: '💰' },
          { label: 'Average Rating', val: mockStats.rating, change: `${mockStats.totalReviews} reviews`, icon: '⭐' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[#DDD0BB] rounded p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#7A6652] uppercase tracking-widest font-sans mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-[#2C1810] font-sans">{stat.val}</p>
              <p className="text-[10px] text-[#8A1C2C] italic font-sans mt-0.5">{stat.change}</p>
            </div>
            <div className="w-10 h-10 rounded bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center text-lg">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white border border-[#DDD0BB] rounded shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#FAF6F0] bg-[#FFFDF8] flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2C1810]">Recent Bookings</h2>
            <Link href="/vendor/bookings" className="text-xs text-[#8A1C2C] hover:underline font-sans font-semibold uppercase tracking-wider">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#FAF6F0] text-[#7A6652] text-[10px] font-bold uppercase tracking-wider border-b border-[#DDD0BB]">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF6F0]">
                {mockBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FFFDF8] transition">
                    <td className="px-6 py-3.5 font-semibold text-[#1F1E1B]">{b.customer}</td>
                    <td className="px-6 py-3.5 text-[#1F1E1B]/70">{b.service}</td>
                    <td className="px-6 py-3.5 text-[#1F1E1B]/60 font-mono text-[11px]">{b.date}</td>
                    <td className="px-6 py-3.5 font-bold text-[#8A1C2C]">₹{b.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusColors[b.status] || ''}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-[#DDD0BB] rounded shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-[#2C1810] border-b border-[#FAF6F0] pb-3">Recent Activity</h2>
          <div className="space-y-3 font-sans text-xs">
            {mockActivity.map((act, i) => (
              <div key={i} className="flex gap-3 items-start p-2.5 bg-[#FAF6F0] border border-[#DDD0BB] rounded">
                <span className="text-base">{act.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1F1E1B]">{act.text}</p>
                  <p className="text-[10px] text-[#1F1E1B]/50 italic">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
