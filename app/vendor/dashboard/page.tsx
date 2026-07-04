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
  { icon: '📅', text: 'New booking request from Priya Sharma', time: '2 hours ago', color: 'blue' },
  { icon: '💰', text: 'Payment of ₹45,000 received', time: '5 hours ago', color: 'green' },
  { icon: '⭐', text: 'New 5-star review from Vikram Patel', time: '1 day ago', color: 'yellow' },
  { icon: '✅', text: 'Booking #42 marked as completed', time: '2 days ago', color: 'green' },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{greeting}, Vendor! 🏪</h1>
            <p className="opacity-90 text-lg">Here's your business overview for today</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Account Status</p>
            <span className="inline-flex items-center gap-1 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold mt-1">
              ✅ Verified
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: mockStats.totalBookings, icon: '📅', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-700', sub: '+3 this week' },
          { label: 'Pending Requests', value: mockStats.pendingRequests, icon: '⏳', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50', text: 'text-yellow-700', sub: 'Needs your action' },
          { label: 'Total Revenue', value: `₹${mockStats.totalRevenue.toLocaleString('en-IN')}`, icon: '💰', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50', text: 'text-green-700', sub: '₹48,000 this month' },
          { label: 'Average Rating', value: mockStats.rating, icon: '⭐', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', text: 'text-purple-700', sub: `${mockStats.totalReviews} reviews` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-sm`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className={`text-xs font-medium ${stat.text} ${stat.bg} px-2 py-1 rounded-full inline-block`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
              <p className="text-sm text-gray-500">Latest booking requests</p>
            </div>
            <Link href="/vendor/bookings" className="text-sm text-orange-600 hover:text-orange-700 font-semibold">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Service</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold">
                          {booking.customer.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{booking.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{booking.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500">Latest updates</p>
          </div>
          <div className="p-6 space-y-4">
            {mockActivity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Add Service', icon: '➕', href: '/vendor/services', color: 'from-orange-500 to-amber-500' },
            { label: 'View Bookings', icon: '📅', href: '/vendor/bookings', color: 'from-blue-500 to-indigo-500' },
            { label: 'Check Earnings', icon: '💰', href: '/vendor/earnings', color: 'from-green-500 to-emerald-500' },
            { label: 'Edit Profile', icon: '✏️', href: '/vendor/profile', color: 'from-purple-500 to-pink-500' },
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
