import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DeleteSavedVendorButton, DeleteEnquiryButton } from '@/components/dashboard/DeleteButtons';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  CheckSquare, 
  Sparkles, 
  Gift, 
  UserCheck, 
  Star, 
  Plus, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

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

  // Get user's saved vendors
  const { data: savedVendors } = await supabase
    .from('saved_vendors')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(6);

  // Calculate statistics
  const totalEvents = events?.length || 0;
  const upcomingEvents = events?.filter(e => new Date(e.event_date) >= new Date()).length || 0;
  const totalBudget = events?.reduce((sum, e) => sum + (e.total_budget || 0), 0) || 0;
  const totalTasks = events?.reduce((sum, e) => sum + (e.total_tasks || 0), 0) || 0;
  const completedTasks = events?.reduce((sum, e) => sum + (e.completed_tasks || 0), 0) || 0;

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Welcome Section / Header banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-r from-purple-950/20 via-indigo-950/20 to-slate-950/20 p-8 sm:p-10 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.15)_0,transparent_50%)] pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> EventVerse workspace
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back! 👋
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Let's orchestrate your next masterpiece celebration.
              </p>
            </div>
            <div>
              <Link
                href="/events/new"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create New Event
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1 */}
          <div className="bg-[#0d1026]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-md flex items-center justify-between hover:border-purple-500/20 transition-all">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Events</p>
              <p className="text-3xl font-extrabold text-white">{totalEvents}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
              🎉
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-[#0d1026]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-md flex items-center justify-between hover:border-blue-500/20 transition-all">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming</p>
              <p className="text-3xl font-extrabold text-white">{upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
              📅
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-[#0d1026]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-md flex items-center justify-between hover:border-emerald-500/20 transition-all">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Budget</p>
              <p className="text-3xl font-extrabold text-white">
                ₹{(totalBudget / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
              💰
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-[#0d1026]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-md flex items-center justify-between hover:border-pink-500/20 transition-all">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tasks Done</p>
              <p className="text-3xl font-extrabold text-white">
                {completedTasks}/{totalTasks}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-xl">
              ✅
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0d1026]/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/5 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Orchestration Center</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <Link
              href="/events/birthday/diy"
              className="flex flex-col items-center justify-center p-6 bg-[#070913]/40 hover:bg-[#070913]/85 rounded-xl border border-white/5 hover:border-purple-500/35 transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎂</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Plan Birthday</div>
            </Link>

            <Link
              href="/events/wedding/diy"
              className="flex flex-col items-center justify-center p-6 bg-[#070913]/40 hover:bg-[#070913]/85 rounded-xl border border-white/5 hover:border-purple-500/35 transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💍</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Plan Wedding</div>
            </Link>

            <Link
              href="/venues"
              className="flex flex-col items-center justify-center p-6 bg-[#070913]/40 hover:bg-[#070913]/85 rounded-xl border border-white/5 hover:border-blue-500/35 transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏛️</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Find Venues</div>
            </Link>

            <Link
              href="/invitations"
              className="flex flex-col items-center justify-center p-6 bg-[#070913]/40 hover:bg-[#070913]/85 rounded-xl border border-white/5 hover:border-pink-500/35 transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💌</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Invitations</div>
            </Link>

            <Link
              href="/events/my-events"
              className="flex flex-col items-center justify-center p-6 bg-[#070913]/40 hover:bg-[#070913]/85 rounded-xl border border-white/5 hover:border-emerald-500/35 transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">My Events</div>
            </Link>

            <Link
              href="/shop"
              className="flex flex-col items-center justify-center p-6 bg-[#070913]/40 hover:bg-[#070913]/85 rounded-xl border border-white/5 hover:border-orange-500/35 transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🛍️</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Shop Now</div>
            </Link>

            <Link
              href="/vendors"
              className="flex flex-col items-center justify-center p-6 bg-[#070913]/40 hover:bg-[#070913]/85 rounded-xl border border-white/5 hover:border-indigo-500/35 transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏢</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Find Vendors</div>
            </Link>

            <Link
              href="/events"
              className="flex flex-col items-center justify-center p-6 bg-[#070913]/40 hover:bg-[#070913]/85 rounded-xl border border-white/5 hover:border-amber-500/35 transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">All Events</div>
            </Link>
          </div>
        </div>

        {/* Grid for Events and Hires */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upcoming Events Column */}
          <div className="lg:col-span-1 bg-[#0d1026]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Upcoming Events</h2>
                <Link
                  href="/events/my-events"
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider"
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
                      className="block p-4 bg-[#070913]/30 border border-white/5 rounded-xl hover:border-purple-500/20 hover:bg-[#070913]/60 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {event.event_type === 'birthday' ? '🎂' :
                             event.event_type === 'wedding' ? '💍' :
                             event.event_type === 'engagement' ? '💕' : '🎉'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-100 text-sm line-clamp-1">{event.event_name}</h3>
                            <p className="text-xs text-slate-500">
                              {new Date(event.event_date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">
                            {event.completed_tasks}/{event.total_tasks} tasks
                          </div>
                          <div className="text-xs font-semibold text-purple-400 mt-0.5">
                            {event.guest_count} guests
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 flex flex-col items-center">
                  <div className="text-3xl mb-3">🎉</div>
                  <p className="text-xs">No events scheduled yet.</p>
                  <Link href="/events" className="text-xs text-purple-400 font-bold hover:underline mt-2">
                    Create Event →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Hired Vendors & Enquiries Column */}
          <div className="lg:col-span-2 bg-[#0d1026]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Hires & Enquiries</h2>
                <Link
                  href="/vendors"
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider"
                >
                  Find Vendors
                </Link>
              </div>
              {enquiries && enquiries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enquiries.map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className="relative p-4 border border-white/5 rounded-xl bg-[#070913]/30 hover:border-purple-500/20 transition-all flex flex-col justify-between pr-10"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-block px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-bold text-purple-300 uppercase tracking-wider">
                            {enquiry.service_category || 'Service'}
                          </span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            enquiry.lead_status === 'new' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
                            enquiry.lead_status === 'responded' || enquiry.lead_status === 'quoted' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                            'bg-slate-500/10 border-slate-500/20 text-slate-400'
                          }`}>
                            {enquiry.lead_status}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-100 text-sm line-clamp-1">
                          {enquiry.event_name || `${enquiry.event_type} Service`}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          📍 {enquiry.event_location || 'Location'}
                        </p>
                        {enquiry.budget_min && enquiry.budget_max && (
                          <p className="text-xs text-slate-300 mt-2 font-medium">
                            Budget: <span className="text-purple-400">₹{enquiry.budget_min.toLocaleString('en-IN')} - ₹{enquiry.budget_max.toLocaleString('en-IN')}</span>
                          </p>
                        )}
                      </div>
                      <div className="border-t border-white/5 mt-3 pt-2 text-right">
                        <span className="text-[9px] text-slate-600">
                          Requested: {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <DeleteEnquiryButton enquiryId={enquiry.id} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                  <div className="text-3xl mb-3">🤝</div>
                  <p className="text-xs">No active enquiries.</p>
                  <Link href="/vendors" className="text-xs text-purple-400 font-bold hover:underline mt-2">
                    Browse Services →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Saved Vendors Section */}
        <div className="bg-[#0d1026]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">🔖 Saved Vendors</h2>
            <Link
              href="/vendors"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider"
            >
              Browse More
            </Link>
          </div>
          {savedVendors && savedVendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedVendors.map((saved: any) => (
                <Link
                  key={saved.id}
                  href={`/events/birthday/vendors/${saved.vendor_id}`}
                  className="relative border border-white/5 rounded-xl p-4 hover:border-purple-500/20 hover:bg-[#070913]/30 transition-all pr-10"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                      {saved.vendor_image || '🏪'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-100 text-sm truncate">
                        {saved.vendor_name || 'Vendor'}
                      </h3>
                      <p className="text-xs text-slate-500 capitalize mt-0.5">
                        {saved.vendor_category}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-amber-400 text-xs">⭐</span>
                        <span className="text-xs font-semibold text-slate-300">
                          {saved.vendor_rating || '4.5'}
                        </span>
                      </div>
                      {saved.vendor_price_range && (
                        <p className="text-[10px] font-bold text-purple-400 mt-2 uppercase tracking-wide">
                          Price: {saved.vendor_price_range}
                        </p>
                      )}
                    </div>
                  </div>
                  <DeleteSavedVendorButton savedId={saved.id} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 flex flex-col items-center">
              <div className="text-4xl mb-3 text-slate-600">🔖</div>
              <p className="text-sm font-semibold text-slate-400">No saved vendors yet</p>
              <p className="text-xs text-slate-600 mt-1">
                Browse vendors and bookmark them to save here
              </p>
              <Link
                href="/vendors"
                className="mt-4 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold rounded-lg transition-all"
              >
                Browse Vendors
              </Link>
            </div>
          )}
        </div>

        {/* Venue Inquiries Section */}
        <div className="bg-[#0d1026]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">My Venue Inquiries</h2>
            <Link
              href="/venues"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider"
            >
              Browse Venues
            </Link>
          </div>
          {venueInquiries && venueInquiries.length > 0 ? (
            <div className="space-y-4">
              {venueInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="border border-white/5 rounded-xl p-4 hover:border-purple-500/10 hover:bg-[#070913]/30 transition-all"
                >
                  <div className="flex gap-4 flex-col sm:flex-row">
                    <img
                      src={inquiry.venues?.primary_image_url || '/placeholder-venue.jpg'}
                      alt={inquiry.venues?.name || 'Venue'}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-slate-900 border border-white/5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-lg truncate">
                            {inquiry.venues?.name || 'Unknown Venue'}
                          </h3>
                          <p className="text-xs text-slate-500 truncate">
                            📍 {inquiry.venues?.location || 'Location not available'}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap ${
                          inquiry.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/25 text-yellow-300' :
                          inquiry.status === 'responded' ? 'bg-blue-500/10 border-blue-500/25 text-blue-300' :
                          inquiry.status === 'converted' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' :
                          'bg-red-500/10 border-red-500/25 text-red-300'
                        }`}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-white/5">
                        <div>
                          📅 {new Date(inquiry.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div>
                          👥 {inquiry.guest_count} guests
                        </div>
                        <div>
                          🕐 Requested {new Date(inquiry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      {inquiry.venues?.slug && (
                        <div className="mt-3">
                          <Link
                            href={`/venues/${inquiry.venues.slug}`}
                            className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-bold"
                          >
                            View Venue Detail <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 flex flex-col items-center">
              <div className="text-4xl mb-2 text-slate-600">🏛️</div>
              <p className="text-xs">No venue inquiries yet.</p>
              <Link href="/venues" className="text-xs text-purple-400 font-bold hover:underline mt-2">
                Browse Venues →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
