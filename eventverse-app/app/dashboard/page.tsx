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

        {/* Upcoming Events */}
        {events && events.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <Link
                href="/events/my-events"
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {events.slice(0, 3).map((event) => (
                <Link
                  key={event.id}
                  href={`/events/eventdetail/${event.id}`}
                  className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {event.event_type === 'birthday' ? '🎂' :
                         event.event_type === 'wedding' ? '💍' :
                         event.event_type === 'engagement' ? '💕' : '🎉'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.event_name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(event.event_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {event.completed_tasks}/{event.total_tasks} tasks
                      </div>
                      <div className="text-sm font-semibold text-purple-600">
                        {event.guest_count} guests
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!events || events.length === 0) && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Events Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start planning your first event with AI assistance!
            </p>
            <Link
              href="/events"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              Create Your First Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
