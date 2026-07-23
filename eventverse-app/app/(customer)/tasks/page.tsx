'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ClipboardList, Calendar, ArrowRight } from 'lucide-react';

interface Event {
  id: string;
  event_name: string;
  event_date: string;
  event_type: string;
}

export default function TasksMainPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      // Fetch user's events
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });

      if (error) throw error;
      if (eventsData) {
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] p-8 flex items-center justify-center font-serif text-[#1F1E1B]">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">⚜</div>
          <p className="text-lg italic text-[#1F1E1B]/70">Loading task checklists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1E1B] font-serif p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header (Ornate Frame) */}
        <div className="relative bg-white rounded-lg border-2 border-double border-[#C5A880] p-8 shadow-md">
          <div className="absolute top-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute top-2 right-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 left-2 text-sm text-[#C5A880]">❦</div>
          <div className="absolute bottom-2 right-2 text-sm text-[#C5A880]">❦</div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[#C5A880]/30 bg-[#FAF6F0] text-[#C5A880] text-[10px] font-semibold uppercase tracking-widest font-sans">
                Task Orchestration
              </span>
              <h1 className="text-3xl font-bold tracking-tight">
                Task Management
              </h1>
              <p className="text-sm text-[#1F1E1B]/70 italic">
                Organize milestones, timelines, vendor tasks, and checklist details.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Total Planned Events', val: events.length, icon: '📋' },
            { label: 'Upcoming Ceremonies', val: events.filter(e => new Date(e.event_date) >= new Date()).length, icon: '🏛️' }
          ].map((stat, i) => (
            <div key={i} className="rounded border bg-white p-6 shadow-sm flex items-center justify-between border-[#DDD0BB]">
              <div>
                <p className="text-[10px] font-bold text-[#1F1E1B]/50 uppercase tracking-widest font-sans mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#1F1E1B]">{stat.val}</p>
              </div>
              <div className="w-12 h-12 rounded bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center text-xl">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Events List */}
        <div className="bg-white rounded border border-[#DDD0BB] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#FAF6F0] bg-[#FFFDF8]">
            <h2 className="text-xl font-bold text-[#2C1810]">Your Events</h2>
          </div>
          <div className="p-6">
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/eventdetail/${event.id}/tasks`}
                    className="block text-decoration-none group"
                  >
                    <div className="bg-[#FFFDF8] border border-[#DDD0BB] hover:border-[#8A1C2C] rounded-lg p-6 hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#1F1E1B] mb-2 group-hover:text-[#8A1C2C] transition-colors">
                            {event.event_name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-[#1F1E1B]/60 font-sans font-medium">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                              <span>{new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <span className="px-2.5 py-0.5 bg-[#FAF6F0] border border-[#C5A880]/30 text-[#C5A880] rounded text-[10px] font-bold uppercase tracking-wider capitalize">
                              {event.event_type}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span
                            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-200"
                            style={{
                              background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                              color: '#FAF0E0',
                              fontFamily: 'Georgia, serif',
                              boxShadow: '0 3px 10px rgba(138,28,44,0.15)',
                            }}
                          >
                            Manage Tasks
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#1F1E1B]/50 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border border-[#C5A880]/30 flex items-center justify-center text-3xl mb-4">
                  📋
                </div>
                <p className="text-lg font-bold">No Events Yet</p>
                <p className="text-xs italic mb-6">Create an event to start managing your checklists</p>
                <Link href="/events/my-events">
                  <span
                    className="inline-block py-2.5 px-6 text-xs font-semibold uppercase tracking-wider rounded"
                    style={{
                      background: 'linear-gradient(135deg, #8A1C2C 0%, #6B1522 100%)',
                      color: '#FAF0E0',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    Create Event
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
