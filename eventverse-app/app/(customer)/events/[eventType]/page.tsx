import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const EVENT_TYPES_MAP: Record<string, { name: string; icon: string; description: string; color: string }> = {
  'birthday': { name: 'Birthday Party', icon: '🎂', description: 'Celebrate birthdays with style', color: 'from-purple-500 to-pink-500' },
  'wedding': { name: 'Wedding Ceremony', icon: '💍', description: 'Complete wedding planning', color: 'from-pink-500 to-rose-500' },
  'engagement': { name: 'Engagement Party', icon: '💕', description: 'Beautiful engagement celebrations', color: 'from-rose-500 to-red-500' },
  'baby-shower': { name: 'Baby Shower', icon: '👶', description: 'Welcome the little one', color: 'from-blue-500 to-cyan-500' },
  'anniversary': { name: 'Anniversary', icon: '💐', description: 'Celebrate love and togetherness', color: 'from-amber-500 to-yellow-500' },
  'housewarming': { name: 'Housewarming', icon: '🏠', description: 'New home celebrations', color: 'from-green-500 to-emerald-500' },
  'corporate': { name: 'Corporate Event', icon: '🏢', description: 'Professional corporate events', color: 'from-slate-600 to-gray-700' },
  'festival': { name: 'Festival Celebration', icon: '🎆', description: 'Traditional festival events', color: 'from-orange-500 to-red-500' },
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-6">{eventInfo.icon}</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {eventInfo.name}
          </h1>
          <p className="text-xl text-gray-600">
            {eventInfo.description}
          </p>
        </div>

        {/* Planning Mode Selection */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            How do you want to plan?
          </h2>
          <p className="text-gray-600 text-lg">
            Choose the option that works best for you
          </p>
        </div>

        {/* Two Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Option 1: Hire Professionals */}
          <Link
            href={`/events/${eventType}/vendors`}
            className="group"
          >
            <div className="bg-white rounded-3xl p-10 border-4 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
              <div className="text-center">
                {/* Icon */}
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">
                  🏪
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Hire Professionals
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-6">
                  Browse and hire verified vendors based on your budget and requirements
                </p>

                {/* Features */}
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Verified professional vendors</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Budget-based filtering</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Reviews and ratings</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Direct contact with vendors</span>
                  </li>
                </ul>

                {/* Button */}
                <div className="mt-6 inline-flex items-center text-purple-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
                  Browse Vendors
                  <svg className="w-6 h-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Option 2: DIY */}
          <Link
            href={`/events/${eventType}/diy`}
            className="group"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-10 border-4 border-transparent hover:border-purple-600 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer text-white">
              <div className="text-center">
                {/* Icon */}
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">
                  🤖
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold mb-4">
                  DIY (Do It Yourself)
                </h3>

                {/* Description */}
                <p className="text-white/90 text-lg mb-6">
                  Get AI-powered personalized event plan with complete checklist and recommendations
                </p>

                {/* Features */}
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-yellow-300 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>AI-generated event blueprint</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-yellow-300 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Complete task checklist</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-yellow-300 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Budget breakdown & timeline</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-yellow-300 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Shopping list & vendor tips</span>
                  </li>
                </ul>

                {/* Badge */}
                <div className="inline-block bg-yellow-400 text-purple-900 px-4 py-2 rounded-full font-bold text-sm mb-4">
                  ⚡ AI-POWERED
                </div>

                {/* Button */}
                <div className="mt-6 inline-flex items-center font-bold text-lg group-hover:translate-x-2 transition-transform">
                  Start Planning
                  <svg className="w-6 h-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/events"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Event Types
          </Link>
        </div>
      </div>
    </div>
  );
}
