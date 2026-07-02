import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import Link from 'next/link';

// Event types from database
const EVENT_TYPES = [
  {
    slug: 'birthday',
    name: 'Birthday Party',
    icon: '🎂',
    description: 'Celebrate birthdays with style',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50'
  },
  {
    slug: 'wedding',
    name: 'Wedding Ceremony',
    icon: '💍',
    description: 'Complete wedding planning',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50'
  },
  {
    slug: 'engagement',
    name: 'Engagement Party',
    icon: '💕',
    description: 'Beautiful engagement celebrations',
    color: 'from-rose-500 to-red-500',
    bgColor: 'bg-rose-50'
  },
  {
    slug: 'baby-shower',
    name: 'Baby Shower',
    icon: '👶',
    description: 'Welcome the little one',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50'
  },
  {
    slug: 'anniversary',
    name: 'Anniversary',
    icon: '💐',
    description: 'Celebrate love and togetherness',
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50'
  },
  {
    slug: 'housewarming',
    name: 'Housewarming',
    icon: '🏠',
    description: 'New home celebrations',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50'
  },
  {
    slug: 'corporate',
    name: 'Corporate Event',
    icon: '🏢',
    description: 'Professional corporate events',
    color: 'from-slate-600 to-gray-700',
    bgColor: 'bg-slate-50'
  },
  {
    slug: 'festival',
    name: 'Festival Celebration',
    icon: '🎆',
    description: 'Traditional festival events',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50'
  },
];

export default async function EventsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            What are you celebrating? 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Choose your event type to get started
          </p>
        </div>

        {/* Event Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVENT_TYPES.map((eventType) => (
            <Link
              key={eventType.slug}
              href={`/events/${eventType.slug}`}
              className="group"
            >
              <div className={`
                ${eventType.bgColor} rounded-2xl p-8 
                border-2 border-transparent
                transition-all duration-300 
                hover:border-purple-300 hover:shadow-2xl hover:scale-105
                cursor-pointer
              `}>
                {/* Icon */}
                <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">
                  {eventType.icon}
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {eventType.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm">
                  {eventType.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Plan Event
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* My Events Link */}
        <div className="mt-12 text-center">
          <Link
            href="/events/my-events"
            className="inline-flex items-center px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-purple-600 font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View My Events
          </Link>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
