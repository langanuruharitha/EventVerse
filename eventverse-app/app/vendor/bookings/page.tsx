'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const mockBookings = [
  { id: 'BK001', customer: 'Priya Sharma', phone: '+91 98765 43210', service: 'Wedding Photography', eventDate: '2026-08-15', bookingDate: '2026-07-01', amount: 45000, status: 'confirmed', location: 'Mumbai', note: 'Please arrive 1 hour early.' },
  { id: 'BK002', customer: 'Rahul Mehta', phone: '+91 87654 32109', service: 'Birthday Decoration', eventDate: '2026-07-20', bookingDate: '2026-07-02', amount: 12000, status: 'pending', location: 'Pune', note: 'Theme: Superheroes' },
  { id: 'BK003', customer: 'Anjali Singh', phone: '+91 76543 21098', service: 'Mehendi Service', eventDate: '2026-07-28', bookingDate: '2026-07-02', amount: 8000, status: 'pending', location: 'Nashik', note: 'Bridal mehendi for 2 hands.' },
  { id: 'BK004', customer: 'Vikram Patel', phone: '+91 65432 10987', service: 'Wedding Photography', eventDate: '2026-07-10', bookingDate: '2026-06-25', amount: 52000, status: 'completed', location: 'Surat', note: '' },
  { id: 'BK005', customer: 'Meera Joshi', phone: '+91 54321 09876', service: 'Birthday Decoration', eventDate: '2026-06-30', bookingDate: '2026-06-20', amount: 9500, status: 'cancelled', location: 'Mumbai', note: 'Customer cancelled due to venue issue.' },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

type Status = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [filter, setFilter] = useState<Status>('all');
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load bookings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vendor_bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBookings(parsed);
      } catch (e) {
        console.error('Failed to parse saved bookings:', e);
      }
    }
  }, []);

  // Save to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('vendor_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const updateStatus = async (id: string, status: string) => {
    setLoading(true);
    setSaveMessage('');
    
    try {
      // Update local state
      const updatedBookings = bookings.map(b => b.id === id ? { ...b, status } : b);
      setBookings(updatedBookings);
      
      // Update selected if it's the current booking
      if (selected?.id === id) {
        setSelected({ ...selected, status });
      }
      
      // Save to localStorage
      localStorage.setItem('vendor_bookings', JSON.stringify(updatedBookings));
      
      // Show success message
      setSaveMessage('✅ Status updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
      
    } catch (error) {
      console.error('Failed to update status:', error);
      setSaveMessage('❌ Failed to save changes');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings 📅</h1>
        <p className="text-gray-500 mt-1">Manage all your booking requests and confirmations</p>
        {saveMessage && (
          <div className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium ${
            saveMessage.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {saveMessage}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as Status[]).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              filter === tab
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="capitalize">{tab === 'all' ? '📋 All' : tab}</span>
            <span className={`text-xs rounded-full px-2 py-0.5 ${filter === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className={`grid gap-6 ${selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Bookings List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500 font-medium">No bookings found</p>
            </div>
          ) : filtered.map(booking => (
            <div
              key={booking.id}
              onClick={() => setSelected(booking)}
              className={`bg-white rounded-2xl p-5 border cursor-pointer hover:shadow-md transition-all ${selected?.id === booking.id ? 'border-orange-400 shadow-md ring-2 ring-orange-100' : 'border-gray-100'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {booking.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{booking.customer}</p>
                    <p className="text-sm text-gray-500">{booking.service}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status]} capitalize`}>
                  {booking.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>📅 {booking.eventDate}</span>
                <span>📍 {booking.location}</span>
                <span className="text-green-600 font-bold text-sm ml-auto">₹{booking.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-xl">
                  {selected.customer.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{selected.customer}</p>
                  <p className="text-sm text-gray-500">{selected.phone}</p>
                </div>
              </div>

              {[
                { label: 'Booking ID', value: selected.id },
                { label: 'Service', value: selected.service },
                { label: 'Event Date', value: selected.eventDate },
                { label: 'Booking Date', value: selected.bookingDate },
                { label: 'Location', value: selected.location },
                { label: 'Amount', value: `₹${selected.amount.toLocaleString('en-IN')}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}

              {selected.note && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <p className="text-xs text-yellow-700 font-semibold mb-1">Customer Note</p>
                  <p className="text-sm text-yellow-800">{selected.note}</p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[selected.status]} capitalize`}>
                  {selected.status}
                </span>
              </div>

              {/* Actions */}
              {selected.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => updateStatus(selected.id, 'confirmed')}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Saving...' : '✅ Accept'}
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, 'cancelled')}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Saving...' : '❌ Reject'}
                  </button>
                </div>
              )}
              {selected.status === 'confirmed' && (
                <button
                  onClick={() => updateStatus(selected.id, 'completed')}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Saving...' : '✔️ Mark as Completed'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
