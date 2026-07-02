'use client';

import { useState } from 'react';

const mockSystemBookings = [
  { id: 'BK101', customer: 'Priya Sharma', vendor: 'Epic Moments Photography', service: 'Wedding Photography', date: '2026-08-15', amount: 45000, commission: 4500, status: 'confirmed' },
  { id: 'BK102', customer: 'Rahul Mehta', vendor: 'Golden Catering Services', service: 'Birthday Decoration', date: '2026-07-20', amount: 12000, commission: 1200, status: 'pending' },
  { id: 'BK103', customer: 'Anjali Singh', vendor: 'DJ Rhythm Beats', service: 'Mehendi Service', date: '2026-07-28', amount: 8000, commission: 800, status: 'pending' },
  { id: 'BK104', customer: 'Vikram Patel', vendor: 'Epic Moments Photography', service: 'Wedding Photography', date: '2026-07-10', amount: 52000, commission: 5200, status: 'completed' },
  { id: 'BK105', customer: 'Meera Joshi', vendor: 'Dream Decorators', service: 'Birthday Decoration', date: '2026-06-30', amount: 9500, commission: 950, status: 'cancelled' },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(mockSystemBookings);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const cancelBookingByAdmin = (id: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = b.customer.toLowerCase().includes(search.toLowerCase()) || b.vendor.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : b.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Bookings 📅</h1>
        <p className="text-gray-500 mt-1">Supervise and manage all vendor bookings and commission fees</p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by customer, vendor, ID..."
          className="w-full sm:w-72 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none text-sm bg-white"
        />
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Booking ID</th>
              <th className="px-6 py-4">Customer Details</th>
              <th className="px-6 py-4">Vendor & Service</th>
              <th className="px-6 py-4">Event Date</th>
              <th className="px-6 py-4">Price / Commission (10%)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {filtered.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{booking.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{booking.customer}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-800">{booking.vendor}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{booking.service}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{booking.date}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">₹{booking.amount.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-green-600 font-semibold">Fee: ₹{booking.commission.toLocaleString('en-IN')}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
                    booking.status === 'confirmed'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : booking.status === 'pending'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : booking.status === 'completed'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <button
                      onClick={() => cancelBookingByAdmin(booking.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      Force Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
