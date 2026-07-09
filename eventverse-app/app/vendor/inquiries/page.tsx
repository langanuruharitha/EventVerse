'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Mail, Phone, Calendar, Users, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  event_date: string;
  guest_count: number;
  message: string;
  status: string;
  created_at: string;
  venues: {
    venue_name: string;
  };
}

export default function VendorInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    const supabase = createBrowserClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get venue inquiries for this vendor's venues
    const { data, error } = await supabase
      .from('venue_inquiries')
      .select(`
        *,
        venues!inner(venue_name, owner_id)
      `)
      .eq('venues.owner_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setInquiries(data as any);
    }

    setLoading(false);
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      responded: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  async function updateInquiryStatus(inquiryId: string, newStatus: string) {
    setUpdating(inquiryId);
    
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('venue_inquiries')
      .update({ status: newStatus })
      .eq('id', inquiryId);

    if (error) {
      alert('Failed to update status: ' + error.message);
    } else {
      // Update local state
      setInquiries(prev => 
        prev.map(inq => 
          inq.id === inquiryId ? { ...inq, status: newStatus } : inq
        )
      );
      alert(`✅ Status updated to ${newStatus}!`);
    }
    
    setUpdating(null);
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📬 Venue Inquiries</h1>
        <p className="text-gray-600">Manage customer inquiries for your venues</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'pending', 'responded', 'converted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${
                filter === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Inquiries' : status}
              <span className="ml-2 text-sm">
                ({status === 'all' ? inquiries.length : inquiries.filter(i => i.status === status).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Inquiries Yet</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'You haven\'t received any inquiries yet.' 
              : `No ${filter} inquiries found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{inquiry.full_name}</h3>
                  <p className="text-orange-600 font-semibold">{inquiry.venues.venue_name}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusBadge(inquiry.status)}`}>
                  {inquiry.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{inquiry.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{inquiry.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Event Date: {new Date(inquiry.event_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{inquiry.guest_count} guests</span>
                </div>
              </div>

              {inquiry.message && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-500 mt-1" />
                    <span className="font-semibold text-gray-700">Message:</span>
                  </div>
                  <p className="text-gray-700 pl-6">{inquiry.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Received {new Date(inquiry.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {inquiry.status === 'pending' && (
                    <>
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                      <button
                        onClick={() => updateInquiryStatus(inquiry.id, 'responded')}
                        disabled={updating === inquiry.id}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Responded
                      </button>
                    </>
                  )}
                  {inquiry.status === 'responded' && (
                    <>
                      <button
                        onClick={() => updateInquiryStatus(inquiry.id, 'converted')}
                        disabled={updating === inquiry.id}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Convert to Booking
                      </button>
                      <button
                        onClick={() => updateInquiryStatus(inquiry.id, 'rejected')}
                        disabled={updating === inquiry.id}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  {(inquiry.status === 'converted' || inquiry.status === 'rejected') && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, 'pending')}
                      disabled={updating === inquiry.id}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition disabled:opacity-50"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
