import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import Link from 'next/link';

// Event types from database
const EVENT_TYPES = [
  {
    slug: 'birthday',
    name: 'Birthday Party',
    icon: '🎂',
    description: 'Celebrate milestones and birthdays with elegant heritage style',
    bgColor: 'bg-white',
  },
  {
    slug: 'wedding',
    name: 'Wedding Ceremony',
    icon: '💍',
    description: 'Bespoke wedding planning and classic ceremony design',
    bgColor: 'bg-white',
  },
  {
    slug: 'engagement',
    name: 'Engagement Party',
    icon: '💕',
    description: 'Exquisite pre-wedding celebrations and engagements',
    bgColor: 'bg-white',
  },
  {
    slug: 'baby-shower',
    name: 'Baby Shower',
    icon: '👶',
    description: 'Welcome new family additions with warmth and classic charm',
    bgColor: 'bg-white',
  },
  {
    slug: 'anniversary',
    name: 'Anniversary',
    icon: '💐',
    description: 'Celebrate years of love and togetherness with regal touch',
    bgColor: 'bg-white',
  },
  {
    slug: 'housewarming',
    name: 'Housewarming',
    icon: '🏠',
    description: 'Commemorate your new home blessing and celebrations',
    bgColor: 'bg-white',
  },
  {
    slug: 'corporate',
    name: 'Corporate Event',
    icon: '🏢',
    description: 'Refined corporate meetings, galas and brand events',
    bgColor: 'bg-white',
  },
  {
    slug: 'festival',
    name: 'Festival Celebration',
    icon: '🎆',
    description: 'Traditional festival events and grand family gatherings',
    bgColor: 'bg-white',
  },
];

export default async function EventsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#C5A880]/30 bg-white text-[#C5A880] text-xs font-semibold uppercase tracking-wider font-sans">
            ⚜ Orchestrate Celebrations
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: '#2C1810' }}>
            What are you celebrating?
          </h1>
          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, transparent, #C5A880)' }} />
            <span className="text-xs text-[#C5A880]">❦</span>
            <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, #C5A880, transparent)' }} />
          </div>
          <p className="text-lg text-[#1F1E1B]/70 italic">
            Select an event type to start building your customized plan
          </p>
        </div>

        {/* Event Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVENT_TYPES.map((eventType) => (
            <Link
              key={eventType.slug}
              href={`/events/${eventType.slug}`}
              className="group text-decoration-none"
            >
              <div
                className="bg-white rounded-lg p-8 border border-[#DDD0BB] hover:border-[#8A1C2C] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative"
                style={{
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
                }}
              >
                {/* Decorative border highlight on hover */}
                <div className="absolute inset-0.5 border border-transparent group-hover:border-[#C5A880]/40 rounded-md transition-colors pointer-events-none" />

                <div>
                  {/* Icon with traditional gold frame */}
                  <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    {eventType.icon}
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-[#1F1E1B] mb-2 font-serif group-hover:text-[#8A1C2C] transition-colors">
                    {eventType.name}
                  </h3>

                  {/* Description */}
                  <p className="text-[#1F1E1B]/60 text-xs italic leading-relaxed">
                    {eventType.description}
                  </p>
                </div>

                {/* Button Link */}
                <div className="mt-6 pt-4 border-t border-[#FAF6F0] flex items-center text-xs font-bold text-[#8A1C2C] uppercase tracking-wider font-sans group-hover:translate-x-1.5 transition-transform">
                  Plan Event
                  <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Action Link Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            href="/events/my-events"
            className="inline-flex items-center px-6 py-3 bg-white rounded border border-[#C5A880] hover:border-[#8A1C2C] text-[#8A1C2C] font-semibold transition-all shadow-sm font-serif"
          >
            <svg className="w-4 h-4 mr-2 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View My Events
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-[#1F1E1B]/70 hover:text-[#8A1C2C] text-sm font-medium transition-colors font-sans"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
