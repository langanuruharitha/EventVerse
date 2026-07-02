'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockSystemStats = {
  totalUsers: 1420,
  activeVendors: 184,
  pendingVerifications: 14,
  totalBookings: 840,
  totalTransactionVolume: 4280500,
  totalCommissionEarned: 428050,
};

const mockPendingVendors = [
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
  const [pendingVendors, setPendingVendors] = useState(mockPendingVendors);

  const approveQuick = (id: number) => {
    setPendingVendors(pendingVendors.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-1">Welcome back, Admin! 🛡️</h1>
        <p className="opacity-90 text-lg">Platform status is normal. 100% services online.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', value: mockSystemStats.totalUsers.toLocaleString(), icon: '👥', color: 'from-blue-500 to-indigo-500' },
          { label: 'Active Vendors', value: mockSystemStats.activeVendors.toLocaleString(), icon: '🏪', color: 'from-orange-500 to-amber-500' },
          { label: 'Platform Bookings', value: mockSystemStats.totalBookings.toLocaleString(), icon: '📅', color: 'from-emerald-500 to-green-500' },
          { label: 'Commission Revenue', value: `₹${mockSystemStats.totalCommissionEarned.toLocaleString('en-IN')}`, icon: '💰', color: 'from-rose-500 to-pink-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-sm text-white`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Verifications */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pending Verifications</h2>
              <p className="text-sm text-gray-500">Vendors awaiting credentials verification</p>
            </div>
            <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold border border-rose-200">
              {pendingVendors.length} Pending
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingVendors.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-4xl mb-2">🎉</p>
                <p className="font-semibold text-sm">All verifications up to date!</p>
              </div>
            ) : pendingVendors.map(vendor => (
              <div key={vendor.id} className="p-5 flex items-center justify-between flex-wrap gap-4 hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Category: {vendor.category} • Owner: {vendor.owner} • Submitted: {vendor.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approveQuick(vendor.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors"
                  >
                    Quick Approve
                  </button>
                  <Link
                    href="/admin/vendors"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Review Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Log */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">System Logs</h2>
            <p className="text-sm text-gray-500">Real-time platform updates</p>
          </div>
          <div className="p-6 space-y-4">
            {mockRecentLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                  log.type === 'success' ? 'bg-green-500' : log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{log.action}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{log.detail}</p>
                  <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Moderate Vendors', icon: '🏪', href: '/admin/vendors', color: 'from-rose-500 to-pink-500' },
            { label: 'Manage Users', icon: '👥', href: '/admin/users', color: 'from-blue-500 to-indigo-500' },
            { label: 'Moderate Reviews', icon: '⭐', href: '/admin/reviews', color: 'from-amber-500 to-yellow-500' },
            { label: 'System Settings', icon: '⚙️', href: '/admin/settings', color: 'from-purple-500 to-pink-500' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br ${action.color} text-white text-center hover:shadow-lg transition-all hover:scale-105`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-semibold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
