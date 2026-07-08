'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Calendar, MapPin, Users, MessageSquare, Clock, CheckCircle, XCircle, ArrowRight, Building2 } from 'lucide-react';

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
    slug: string;
  };
}

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<VenueInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch recent venue inquiries
      const { data, error } = await supabase
        .from('venue_inquiries')
        .select(`
          *,
          venues:venue_id (
            name,
            location,
            primary_image_url,
            slug
          )
        `)
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching inquiries:', error);
      } else {
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
            primary_image_url: item.venues?.primary_image_url || '/placeholder-venue.jpg',
            slug: item.venues?.slug || ''
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

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      responded: 'bg-blue-100 text-blue-800 border-blue-200',
      converted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      responded: <MessageSquare className="w-3 h-3" />,
      converted: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    responded: inquiries.filter(i => i.status === 'responded').length,
    converted: inquiries.filter(i => i.status === 'converted').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Guest'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's an overview of your venue inquiries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Inquiries</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Building2 className="w-10 h-10 text-purple-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Responded</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.responded}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Converted</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.converted}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Recent Venue Inquiries */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Venue Inquiries
            </h2>
            <Link
              href="/inquiries"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Venue Inquiries Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start planning your event by browsing and inquiring about venues!
              </p>
              <Link
                href="/venues"
                className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Venues
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex gap-4">
                    {/* Venue Image */}
                    <img
                      src={inquiry.venue.primary_image_url}
                      alt={inquiry.venue.name}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />

                    {/* Inquiry Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg truncate">
                            {inquiry.venue.name}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{inquiry.venue.location}</span>
                          </div>
                        </div>
                        {getStatusBadge(inquiry.status)}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span>
                            {new Date(inquiry.event_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>{inquiry.guest_count} guests</span>
                        </div>

                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span>
                            {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {inquiry.venue.slug && (
                        <Link
                          href={`/venues/${inquiry.venue.slug}`}
                          className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium mt-2"
                        >
                          View Venue
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/events/my-events"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">
              My Events
            </h3>
            <p className="text-gray-600 text-sm">
              View and manage your upcoming events
            </p>
          </Link>

          <Link
            href="/venues"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="text-4xl mb-3">🏛️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">
              Browse Venues
            </h3>
            <p className="text-gray-600 text-sm">
              Discover perfect venues for your events
            </p>
          </Link>

          <Link
            href="/shop"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="text-4xl mb-3">🛍️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">
              Event Shop
            </h3>
            <p className="text-gray-600 text-sm">
              Shop for decorations and supplies
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
