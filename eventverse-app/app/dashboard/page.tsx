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
    <div className="p-8 min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Welcome Section / Header banner (Vintage Ornate Frame style) */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 sm:p-10 shadow-md">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#C5A880]/30 bg-[#FAF6F0] text-[#C5A880] text-xs font-semibold uppercase tracking-wider font-sans">
                ⚜ EventVerse Workspace
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1F1E1B] tracking-tight">
                Welcome back, {user.user_metadata?.full_name || 'Honored Guest'} 👋
              </h1>
              <p className="text-[#1F1E1B]/70 text-sm sm:text-base italic">
                "Let us orchestrate your next masterpiece celebration with classic touch."
              </p>
            </div>
            <div>
              <Link
                href="/events/new"
                className="vintage-btn vintage-btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create New Event
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats (Vintage Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Events', val: totalEvents, icon: '🎉', border: 'border-l-4 border-l-[#8A1C2C]' },
            { label: 'Upcoming', val: upcomingEvents, icon: '📅', border: 'border-l-4 border-l-[#C5A880]' },
            { label: 'Total Budget', val: `₹${(totalBudget / 1000).toFixed(0)}k`, icon: '💰', border: 'border-l-4 border-l-[#4C6044]' },
            { label: 'Tasks Done', val: `${completedTasks}/${totalTasks}`, icon: '✅', border: 'border-l-4 border-l-[#1F1E1B]' }
          ].map((stat, idx) => (
            <div key={idx} className={`vintage-card p-6 flex items-center justify-between ${stat.border}`}>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#1F1E1B]/50 uppercase tracking-widest font-sans">{stat.label}</p>
                <p className="text-3xl font-bold text-[#1F1E1B] font-serif">{stat.val}</p>
              </div>
              <div className="w-12 h-12 rounded bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center text-xl">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Orchestration Center */}
        <div className="vintage-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#1F1E1B] border-b border-[#C5A880]/20 pb-4 mb-6">Orchestration Center</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { href: '/events/birthday/diy', icon: '🎂', label: 'Plan Birthday' },
              { href: '/events/wedding/diy', icon: '💍', label: 'Plan Wedding' },
              { href: '/venues', icon: '🏛️', label: 'Find Venues' },
              { href: '/invitations', icon: '💌', label: 'Invitations' },
              { href: '/events/my-events', icon: '📋', label: 'My Events' },
              { href: '/shop', icon: '🛍️', label: 'Shop Now' },
              { href: '/vendors', icon: '🏢', label: 'Find Vendors' },
              { href: '/events', icon: '🎯', label: 'All Events' }
            ].map((act, idx) => (
              <Link
                key={idx}
                href={act.href}
                className="flex flex-col items-center justify-center p-6 bg-[#FAF6F0]/50 hover:bg-[#C5A880]/10 rounded border border-[#C5A880]/20 hover:border-[#C5A880] transition-all group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{act.icon}</div>
                <div className="text-[10px] font-bold text-[#1F1E1B]/80 uppercase tracking-wider font-sans">{act.label}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Grid for Events and Hires */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upcoming Events Column */}
          <div className="lg:col-span-1 vintage-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#C5A880]/20">
                <h2 className="text-lg font-bold text-[#1F1E1B]">Upcoming Events</h2>
                <Link
                  href="/events/my-events"
                  className="text-xs font-bold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
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
                      className="block p-4 bg-[#FAF6F0]/40 border border-[#C5A880]/20 rounded hover:border-[#C5A880] hover:bg-[#FAF6F0] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {event.event_type === 'birthday' ? '🎂' :
                             event.event_type === 'wedding' ? '💍' :
                             event.event_type === 'engagement' ? '💕' : '🎉'}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#1F1E1B] text-sm line-clamp-1">{event.event_name}</h3>
                            <p className="text-xs text-[#1F1E1B]/60">
                              {new Date(event.event_date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-[#1F1E1B]/55 font-sans">
                            {event.completed_tasks}/{event.total_tasks} tasks
                          </div>
                          <div className="text-xs font-bold text-[#8A1C2C] mt-0.5 font-sans">
                            {event.guest_count} guests
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-[#1F1E1B]/40 flex flex-col items-center">
                  <div className="text-3xl mb-3">🎉</div>
                  <p className="text-xs italic">No events scheduled yet.</p>
                  <Link href="/events" className="text-xs text-[#C5A880] font-bold hover:underline mt-2 font-sans">
                    Create Event →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Hired Vendors & Enquiries Column */}
          <div className="lg:col-span-2 vintage-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#C5A880]/20">
                <h2 className="text-lg font-bold text-[#1F1E1B]">Hires & Enquiries</h2>
                <Link
                  href="/vendors"
                  className="text-xs font-bold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
                >
                  Find Vendors
                </Link>
              </div>
              {enquiries && enquiries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enquiries.map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className="relative p-4 border border-[#C5A880]/20 rounded bg-[#FAF6F0]/30 hover:border-[#C5A880] transition-all flex flex-col justify-between pr-10"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-block px-2 py-0.5 rounded bg-[#FAF6F0] border border-[#C5A880]/30 text-[9px] font-bold text-[#C5A880] uppercase tracking-wider font-sans">
                            {enquiry.service_category || 'Service'}
                          </span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border font-sans ${
                            enquiry.lead_status === 'new' ? 'bg-blue-500/10 border-blue-500/25 text-blue-800' :
                            enquiry.lead_status === 'responded' || enquiry.lead_status === 'quoted' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-800' :
                            'bg-slate-500/10 border-slate-500/25 text-slate-600'
                          }`}>
                            {enquiry.lead_status}
                          </span>
                        </div>
                        <h3 className="font-bold text-[#1F1E1B] text-sm line-clamp-1">
                          {enquiry.event_name || `${enquiry.event_type} Service`}
                        </h3>
                        <p className="text-xs text-[#1F1E1B]/60 mt-1">
                          📍 {enquiry.event_location || 'Location'}
                        </p>
                        {enquiry.budget_min && enquiry.budget_max && (
                          <p className="text-xs text-[#1F1E1B] mt-2 font-medium">
                            Budget: <span className="text-[#8A1C2C] font-sans">₹{enquiry.budget_min.toLocaleString('en-IN')} - ₹{enquiry.budget_max.toLocaleString('en-IN')}</span>
                          </p>
                        )}
                      </div>
                      <div className="border-t border-[#C5A880]/10 mt-3 pt-2 text-right">
                        <span className="text-[9px] text-[#1F1E1B]/40 font-sans">
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
                <div className="text-center py-12 text-[#1F1E1B]/40 flex flex-col items-center">
                  <div className="text-3xl mb-3">🤝</div>
                  <p className="text-xs italic">No active enquiries.</p>
                  <Link href="/vendors" className="text-xs text-[#C5A880] font-bold hover:underline mt-2 font-sans">
                    Browse Services →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Saved Vendors Section */}
        <div className="vintage-card p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#C5A880]/20">
            <h2 className="text-lg font-bold text-[#1F1E1B]">🔖 Saved Vendors</h2>
            <Link
              href="/vendors"
              className="text-xs font-bold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
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
                  className="relative border border-[#C5A880]/20 rounded p-4 hover:border-[#C5A880] hover:bg-[#FAF6F0]/40 transition-all pr-10"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center text-2xl flex-shrink-0">
                      {saved.vendor_image || '🏪'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1F1E1B] text-sm truncate">
                        {saved.vendor_name || 'Vendor'}
                      </h3>
                      <p className="text-xs text-[#1F1E1B]/50 capitalize mt-0.5 font-sans">
                        {saved.vendor_category}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5 font-sans">
                        <span className="text-[#C5A880] text-xs">⭐</span>
                        <span className="text-xs font-bold text-[#1F1E1B]/70">
                          {saved.vendor_rating || '4.5'}
                        </span>
                      </div>
                      {saved.vendor_price_range && (
                        <p className="text-[10px] font-bold text-[#8A1C2C] mt-2 uppercase tracking-widest font-sans">
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
            <div className="text-center py-10 text-[#1F1E1B]/40 flex flex-col items-center">
              <div className="text-4xl mb-3 text-[#C5A880]">🔖</div>
              <p className="text-sm font-bold text-[#1F1E1B]/70">No saved vendors yet</p>
              <p className="text-xs text-[#1F1E1B]/40 mt-1 italic">
                Browse vendors and bookmark them to save here
              </p>
              <Link
                href="/vendors"
                className="mt-4 vintage-btn vintage-btn-primary"
              >
                Browse Vendors
              </Link>
            </div>
          )}
        </div>

        {/* Venue Inquiries Section */}
        <div className="vintage-card p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#C5A880]/20">
            <h2 className="text-lg font-bold text-[#1F1E1B]">My Venue Inquiries</h2>
            <Link
              href="/venues"
              className="text-xs font-bold text-[#8A1C2C] hover:text-[#C5A880] uppercase tracking-wider font-sans"
            >
              Browse Venues
            </Link>
          </div>
          {venueInquiries && venueInquiries.length > 0 ? (
            <div className="space-y-4">
              {venueInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="border border-[#C5A880]/20 rounded p-4 hover:border-[#C5A880] hover:bg-[#FAF6F0]/40 transition-all"
                >
                  <div className="flex gap-4 flex-col sm:flex-row">
                    <img
                      src={inquiry.venues?.primary_image_url || '/placeholder-venue.jpg'}
                      alt={inquiry.venues?.name || 'Venue'}
                      className="w-24 h-24 rounded object-cover flex-shrink-0 bg-[#FAF6F0] border border-[#C5A880]/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#1F1E1B] text-lg truncate">
                            {inquiry.venues?.name || 'Unknown Venue'}
                          </h3>
                          <p className="text-xs text-[#1F1E1B]/50 truncate">
                            📍 {inquiry.venues?.location || 'Location not available'}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap font-sans ${
                          inquiry.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/25 text-yellow-800' :
                          inquiry.status === 'responded' ? 'bg-blue-500/10 border-blue-500/25 text-blue-800' :
                          inquiry.status === 'converted' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-800' :
                          'bg-red-500/10 border-red-500/25 text-red-800'
                        }`}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs text-[#1F1E1B]/60 mt-3 pt-3 border-t border-[#C5A880]/10 font-sans">
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
                            className="inline-flex items-center gap-1 text-xs text-[#8A1C2C] hover:text-[#C5A880] font-bold"
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
            <div className="text-center py-10 text-[#1F1E1B]/40 flex flex-col items-center">
              <div className="text-4xl mb-2 text-[#C5A880]">🏛️</div>
              <p className="text-xs italic">No venue inquiries yet.</p>
              <Link href="/venues" className="text-xs text-[#C5A880] font-bold hover:underline mt-2 font-sans">
                Browse Venues →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
