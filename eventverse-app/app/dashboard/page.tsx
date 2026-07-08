import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Get user's events with stats
  const { data: events } = await supabase
    .from('event_overview')
    .select('*')
    .eq('user_id', user.id)
    .order('event_date', { ascending: true })
    .limit(5);

  // Get user's vendor enquiries
  const { data: enquiries } = await supabase
    .from('vendor_leads')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(4);

  // Get user's venue inquiries
  const { data: venueInquiries } = await supabase
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

  // Calculate statistics
  const totalEvents = events?.length || 0;
  const upcomingEvents = events?.filter(e => new Date(e.event_date) >= new Date()).length || 0;
  const totalBudget = events?.reduce((sum, e) => sum + (e.total_budget || 0), 0) || 0;
  const totalTasks = events?.reduce((sum, e) => sum + (e.total_tasks || 0), 0) || 0;
  const completedTasks = events?.reduce((sum, e) => sum + (e.completed_tasks || 0), 0) || 0;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your events
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalEvents}</p>
              </div>
              <div className="text-5xl">🎉</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{upcomingEvents}</p>
              </div>
              <div className="text-5xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ₹{(totalBudget / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tasks Done</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {completedTasks}/{totalTasks}
                </p>
              </div>
              <div className="text-5xl">✅</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/events/birthday/diy"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all border-2 border-purple-200 hover:border-purple-400"
            >
              <div className="text-4xl mb-2">🎂</div>
              <div className="text-sm font-semibold text-gray-700">Plan Birthday</div>
            </Link>

            <Link
              href="/events/wedding/diy"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all border-2 border-purple-200 hover:border-purple-400"
            >
              <div className="text-4xl mb-2">💍</div>
              <div className="text-sm font-semibold text-gray-700">Plan Wedding</div>
            </Link>

            <Link
              href="/venues"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all border-2 border-blue-200 hover:border-blue-400"
            >
              <div className="text-4xl mb-2">🏛️</div>
              <div className="text-sm font-semibold text-gray-700">Find Venues</div>
            </Link>

            <Link
              href="/invitations"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl hover:shadow-lg transition-all border-2 border-pink-200 hover:border-pink-400"
            >
              <div className="text-4xl mb-2">💌</div>
              <div className="text-sm font-semibold text-gray-700">Create Invitations</div>
            </Link>

            <Link
              href="/events/my-events"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all border-2 border-green-200 hover:border-green-400"
            >
              <div className="text-4xl mb-2">📋</div>
              <div className="text-sm font-semibold text-gray-700">My Events</div>
            </Link>

            <Link
              href="/shop"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl hover:shadow-lg transition-all border-2 border-orange-200 hover:border-orange-400"
            >
              <div className="text-4xl mb-2">🛍️</div>
              <div className="text-sm font-semibold text-gray-700">Shop Now</div>
            </Link>

            <Link
              href="/vendors"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl hover:shadow-lg transition-all border-2 border-indigo-200 hover:border-indigo-400"
            >
              <div className="text-4xl mb-2">🏢</div>
              <div className="text-sm font-semibold text-gray-700">Find Vendors</div>
            </Link>

            <Link
              href="/events"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl hover:shadow-lg transition-all border-2 border-yellow-200 hover:border-yellow-400"
            >
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-sm font-semibold text-gray-700">All Events</div>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid for Events and Hires */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upcoming Events Column */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <Link
                href="/events/my-events"
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                View All
              </Link>
            </div>
            {events && events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/eventdetail/${event.id}`}
                    className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {event.event_type === 'birthday' ? '🎂' :
                           event.event_type === 'wedding' ? '💍' :
                           event.event_type === 'engagement' ? '💕' : '🎉'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{event.event_name}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(event.event_date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {event.completed_tasks}/{event.total_tasks} tasks
                        </div>
                        <div className="text-xs font-semibold text-purple-600">
                          {event.guest_count} guests
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-sm">No events scheduled.</p>
                <Link href="/events" className="text-purple-600 text-xs font-semibold hover:underline mt-1 inline-block">
                  Create Event →
                </Link>
              </div>
            )}
          </div>

          {/* Hired Vendors & Enquiries Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Hired Vendors & Enquiries</h2>
              <Link
                href="/vendors"
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                Find Vendors
              </Link>
            </div>
            {enquiries && enquiries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                          {enquiry.service_category || 'Service'}
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          enquiry.lead_status === 'new' ? 'bg-blue-100 text-blue-700' :
                          enquiry.lead_status === 'responded' || enquiry.lead_status === 'quoted' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {enquiry.lead_status}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                        {enquiry.event_name || `${enquiry.event_type} Service`}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {enquiry.event_location || 'Event Location'}
                      </p>
                      {enquiry.budget_min && enquiry.budget_max && (
                        <p className="text-xs text-gray-700 mt-2 font-medium">
                          Budget: <span className="text-purple-700">₹{enquiry.budget_min.toLocaleString('en-IN')} - ₹{enquiry.budget_max.toLocaleString('en-IN')}</span>
                        </p>
                      )}
                    </div>
                    <div className="border-t border-gray-100 mt-3 pt-2 text-right">
                      <span className="text-[10px] text-gray-400">
                        Requested: {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">🤝</div>
                <p className="text-sm">You haven't contacted any vendors yet.</p>
                <Link href="/vendors" className="text-purple-600 text-xs font-semibold hover:underline mt-1 inline-block">
                  Browse Services & Hire Vendors →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Venue Inquiries Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Venue Inquiries</h2>
            <Link
              href="/venues"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              Browse Venues
            </Link>
          </div>
          {venueInquiries && venueInquiries.length > 0 ? (
            <div className="space-y-4">
              {venueInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex gap-4">
                    <img
                      src={inquiry.venues?.primary_image_url || '/placeholder-venue.jpg'}
                      alt={inquiry.venues?.name || 'Venue'}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg truncate">
                            {inquiry.venues?.name || 'Unknown Venue'}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            📍 {inquiry.venues?.location || 'Location not available'}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${
                          inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          inquiry.status === 'responded' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          inquiry.status === 'converted' ? 'bg-green-100 text-green-800 border-green-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          📅 {new Date(inquiry.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div>
                          👥 {inquiry.guest_count} guests
                        </div>
                        <div>
                          🕐 {new Date(inquiry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      {inquiry.venues?.slug && (
                        <Link
                          href={`/venues/${inquiry.venues.slug}`}
                          className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium mt-2"
                        >
                          View Venue →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">🏛️</div>
              <p className="text-sm">You haven't inquired about any venues yet.</p>
              <Link href="/venues" className="text-purple-600 text-xs font-semibold hover:underline mt-1 inline-block">
                Browse Venues →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
