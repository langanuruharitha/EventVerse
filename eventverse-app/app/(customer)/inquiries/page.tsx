'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Calendar, MapPin, Users, MessageSquare, Clock, CheckCircle, XCircle, Phone, Mail } from 'lucide-react';

interface VenueInquiry {
  id: string;
  venue_id: string;
  full_name: string;
  email: string;
  phone: string;
  event_date: string;
  guest_count: number;
  message: string;
  status: 'pending' | 'responded' | 'converted' | 'rejected';
  created_at: string;
  venue: {
    name: string;
    location: string;
    primary_image_url: string;
  };
}

export default function CustomerInquiriesPage() {
  const [inquiries, setInquiries] = useState<VenueInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded' | 'converted' | 'rejected'>('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch inquiries with venue details
      const { data, error } = await supabase
        .from('venue_inquiries')
        .select(`
          *,
          venues:venue_id (
            name,
            location,
            primary_image_url
          )
        `)
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inquiries:', error);
      } else {
        // Transform data to match interface
        const transformedData = (data || []).map(item => ({
          id: item.id,
          venue_id: item.venue_id,
          full_name: item.full_name,
          email: item.email,
          phone: item.phone,
          event_date: item.event_date,
          guest_count: item.guest_count,
          message: item.message,
          status: item.status,
          created_at: item.created_at,
          venue: {
            name: item.venues?.name || 'Unknown Venue',
            location: item.venues?.location || 'Location not available',
            primary_image_url: item.venues?.primary_image_url || '/placeholder-venue.jpg'
          }
        }));
        setInquiries(transformedData);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(inq => inq.status === filter);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      responded: 'bg-blue-100 text-blue-800 border-blue-200',
      converted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      responded: <MessageSquare className="w-4 h-4" />,
      converted: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Venue Inquiries
          </h1>
          <p className="text-gray-600">
            Track all your venue inquiries and their status
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'responded', 'converted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                  {inquiries.filter(i => i.status === status).length}
                </span>
              )}
              {status === 'all' && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                  {inquiries.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Inquiries List */}
        {filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Inquiries Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by browsing venues and sending inquiries to your favorite ones!
            </p>
            <a
              href="/venues"
              className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Venues
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="md:flex">
                  {/* Venue Image */}
                  <div className="md:w-64 md:flex-shrink-0">
                    <img
                      src={inquiry.venue.primary_image_url}
                      alt={inquiry.venue.name}
                      className="h-48 w-full md:h-full object-cover"
                    />
                  </div>

                  {/* Inquiry Details */}
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {inquiry.venue.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{inquiry.venue.location}</span>
                        </div>
                      </div>
                      {getStatusBadge(inquiry.status)}
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Event Date</p>
                          <p className="font-medium">
                            {new Date(inquiry.event_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Guests</p>
                          <p className="font-medium">{inquiry.guest_count} people</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Submitted</p>
                          <p className="font-medium">
                            {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    {inquiry.message && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium mb-1">Your Message:</p>
                        <p className="text-gray-700">{inquiry.message}</p>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{inquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{inquiry.phone}</span>
                      </div>
                    </div>

                    {/* Status Message */}
                    {inquiry.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⏳ Your inquiry is pending. The venue will respond within 24-48 hours.
                        </p>
                      </div>
                    )}
                    {inquiry.status === 'responded' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          ✉️ The venue has responded! Check your email for details.
                        </p>
                      </div>
                    )}
                    {inquiry.status === 'converted' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          🎉 Congratulations! This inquiry has been converted to a booking.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
