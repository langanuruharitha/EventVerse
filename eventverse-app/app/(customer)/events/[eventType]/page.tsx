import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const EVENT_TYPES_MAP: Record<string, { name: string; icon: string; description: string }> = {
  'birthday': { name: 'Birthday Party', icon: '🎂', description: 'Celebrate birthdays with elegant heritage style' },
  'wedding': { name: 'Wedding Ceremony', icon: '💍', description: 'Complete royal wedding planning' },
  'engagement': { name: 'Engagement Party', icon: '💕', description: 'Beautiful engagement celebrations' },
  'baby-shower': { name: 'Baby Shower', icon: '👶', description: 'Welcome the little one with classic warmth' },
  'anniversary': { name: 'Anniversary', icon: '💐', description: 'Celebrate love and togetherness with regal touch' },
  'housewarming': { name: 'Housewarming', icon: '🏠', description: 'New home blessing and celebrations' },
  'corporate': { name: 'Corporate Event', icon: '🏢', description: 'Professional corporate events and galas' },
  'festival': { name: 'Festival Celebration', icon: '🎆', description: 'Traditional festival events and grand family gatherings' },
};

export default async function EventTypePage({ params }: { params: Promise<{ eventType: string }> }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const { eventType } = await params;
  const eventInfo = EVENT_TYPES_MAP[eventType];

  if (!eventInfo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Ornate Frame */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 sm:p-10 shadow-md">
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="text-center relative space-y-4">
            <div className="text-6xl mb-2">{eventInfo.icon}</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2C1810]">
              {eventInfo.name}
            </h1>
            <p className="text-sm sm:text-base text-[#1F1E1B]/70 italic">
              {eventInfo.description}
            </p>
          </div>
        </div>

        {/* Planning Mode Selection */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#1F1E1B]">
            How do you want to plan?
          </h2>
          <p className="text-xs text-[#1F1E1B]/60 italic font-sans">
            Choose the orchestration model that works best for your occasion
          </p>
        </div>

        {/* Two Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option 1: Hire Professionals */}
          <Link
            href={`/events/${eventType}/vendors`}
            className="group text-decoration-none"
          >
            <div className="bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] p-8 hover:shadow-md transition-all flex flex-col justify-between h-full relative">
              <div className="absolute inset-0.5 border border-transparent group-hover:border-[#C5A880]/30 rounded transition-colors pointer-events-none" />
              <div className="text-center space-y-4">
                <div className="text-6xl group-hover:scale-105 transition-transform">🏪</div>
                <h3 className="text-2xl font-bold text-[#1F1E1B] group-hover:text-[#8A1C2C] transition-colors">
                  Hire Professionals
                </h3>
                <p className="text-xs text-[#1F1E1B]/60 italic leading-relaxed">
                  Browse and hire verified premium vendors based on your budget and requirements.
                </p>

                <ul className="text-left space-y-2.5 text-xs text-[#1F1E1B]/80 font-sans border-t border-[#FAF6F0] pt-4">
                  <li className="flex items-center gap-2">
                    <span className="text-[#C5A880]">❦</span> Verified professional local vendors
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C5A880]">❦</span> Budget-based intelligent filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C5A880]">❦</span> Exquisite user reviews and ratings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C5A880]">❦</span> Direct communication channel
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#FAF6F0] flex items-center justify-between text-xs font-bold text-[#8A1C2C] uppercase tracking-wider font-sans group-hover:translate-x-1.5 transition-transform">
                <span>Browse Vendors</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Option 2: DIY */}
          <Link
            href={`/events/${eventType}/diy`}
            className="group text-decoration-none"
          >
            <div className="bg-white rounded border border-[#DDD0BB] hover:border-[#8A1C2C] p-8 hover:shadow-md transition-all flex flex-col justify-between h-full relative">
              <div className="absolute inset-0.5 border border-transparent group-hover:border-[#C5A880]/30 rounded transition-colors pointer-events-none" />
              <div className="text-center space-y-4">
                <div className="text-6xl group-hover:scale-105 transition-transform">🤖</div>
                <h3 className="text-2xl font-bold text-[#1F1E1B] group-hover:text-[#8A1C2C] transition-colors">
                  DIY (Do It Yourself)
                </h3>
                <p className="text-xs text-[#1F1E1B]/60 italic leading-relaxed">
                  Get our AI-powered personalized event roadmaps with complete checklists.
                </p>

                <ul className="text-left space-y-2.5 text-xs text-[#1F1E1B]/80 font-sans border-t border-[#FAF6F0] pt-4">
                  <li className="flex items-center gap-2">
                    <span className="text-[#C5A880]">❦</span> AI-generated custom event blueprint
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C5A880]">❦</span> Comprehensive milestone checklists
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C5A880]">❦</span> Interactive budget calculator
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C5A880]">❦</span> Shopping list guides and vendor tips
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#FAF6F0] flex items-center justify-between text-xs font-bold text-[#8A1C2C] uppercase tracking-wider font-sans group-hover:translate-x-1.5 transition-transform">
                <span>Start Planning</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Back Link */}
        <div className="text-center pt-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1F1E1B]/70 hover:text-[#8A1C2C] uppercase tracking-wider font-sans transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Event Types
          </Link>
        </div>
      </div>
    </div>
  );
}
