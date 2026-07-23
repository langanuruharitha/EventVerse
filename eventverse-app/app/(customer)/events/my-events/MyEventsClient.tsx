'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import EventCard from '@/components/events/EventCard';

export default function MyEventsClient({ events }: { events: any[] }) {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const upcomingEvents = events.filter((e: any) => new Date(e.event_date) >= new Date());
  const pastEvents = events.filter((e: any) => new Date(e.event_date) < new Date());

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-[#F0FFF4] border border-[#B5DCC5] rounded p-4 flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <div className="font-bold text-[#1A5C35] text-lg">
                  Event Created Successfully!
                </div>
                <div className="text-[#2C6E49] text-sm italic">
                  Your personalized event plan is ready. Click on your event below to see the details.
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-[#1A5C35] hover:text-[#2C6E49] text-2xl font-sans"
            >
              ×
            </button>
          </div>
        )}

        {/* Header (Vintage Frame) */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 shadow-md">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[#1F1E1B] tracking-tight">
                My Events
              </h1>
              <p className="text-[#1F1E1B]/70 text-sm italic">
                Plan, manage and cherish all your special occasions.
              </p>
            </div>
            <div>
              <Link
                href="/events"
                className="inline-block py-3 px-6 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                  color: '#FAF0E0',
                  fontFamily: 'Georgia, serif',
                  boxShadow: '0 4px 16px rgba(138,28,44,0.2)',
                }}
              >
                + Create New Event
              </Link>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-[#DDD0BB] shadow-md max-w-2xl mx-auto p-8 relative">
            <div className="text-5xl mb-4 text-[#C5A880]">⚜</div>
            <h2 className="text-2xl font-bold text-[#1F1E1B] mb-2">No Events Yet</h2>
            <p className="text-[#1F1E1B]/70 italic mb-6">
              Start planning your first event with our custom AI assistant!
            </p>
            <Link
              href="/events"
              className="inline-block py-3 px-6 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                color: '#FAF0E0',
                fontFamily: 'Georgia, serif',
                boxShadow: '0 4px 16px rgba(138,28,44,0.2)',
              }}
            >
              Create Your First Event
            </Link>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1F1E1B] mb-6 flex items-center gap-3">
              <span className="text-[#C5A880]">❦</span> Upcoming Events ({upcomingEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="vintage-card p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1F1E1B] mb-6 flex items-center gap-3">
              <span className="text-[#C5A880]">❦</span> Past Events ({pastEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <div key={event.id} className="vintage-card p-0 overflow-hidden opacity-85 hover:opacity-100 transition-opacity">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {events.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
            {[
              { label: 'Total Events', val: events.length, color: 'border-l-4 border-l-[#8A1C2C]' },
              { label: 'Upcoming', val: upcomingEvents.length, color: 'border-l-4 border-l-[#C5A880]' },
              { label: 'In Planning', val: events.filter((e) => e.status === 'planning').length, color: 'border-l-4 border-l-[#4C6044]' },
              { label: 'Completed', val: events.filter((e) => e.status === 'completed').length, color: 'border-l-4 border-l-[#1F1E1B]' },
            ].map((stat, idx) => (
              <div key={idx} className={`bg-white rounded border border-[#DDD0BB] p-6 shadow-sm ${stat.color}`}>
                <div className="text-xs font-bold text-[#1F1E1B]/50 uppercase tracking-widest font-sans mb-1">{stat.label}</div>
                <div className="text-3xl font-bold text-[#1F1E1B]">{stat.val}</div>
              </div>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A1C2C] hover:text-[#C5A880] transition-colors"
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
