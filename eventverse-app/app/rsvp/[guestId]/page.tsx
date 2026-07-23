import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import RsvpClient from './RsvpClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function RsvpPage({
  params,
}: {
  params: Promise<{ guestId: string }>;
}) {
  const { guestId } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase env vars');
    return notFound();
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: guest, error } = await supabase
    .from('guests')
    .select('*, events(event_name, event_date)')
    .eq('id', guestId)
    .single();

  if (error || !guest || !guest.events) {
    console.error('Error fetching RSVP data:', error);
    return notFound();
  }

  const eventDate = new Date(guest.events.event_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#FAF6F0] font-serif text-[#1F1E1B] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">

        {/* Ornate Card */}
        <div className="bg-white border-2 border-double border-[#C5A880] rounded shadow-xl overflow-hidden">

          {/* Heritage Header */}
          <div
            className="relative px-8 py-10 text-center"
            style={{ background: 'linear-gradient(135deg, #2C1810 0%, #1F1E1B 100%)' }}
          >
            {/* Corner ornaments */}
            <div className="absolute top-3 left-3 text-[#C5A880] text-sm">❦</div>
            <div className="absolute top-3 right-3 text-[#C5A880] text-sm">❦</div>
            <div className="absolute bottom-3 left-3 text-[#C5A880] text-sm">❦</div>
            <div className="absolute bottom-3 right-3 text-[#C5A880] text-sm">❦</div>

            <div className="relative space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-[#C5A880]/30 bg-[#C5A880]/10 text-[#C5A880] text-[10px] font-semibold uppercase tracking-widest font-sans">
                ⚜ You&apos;re Invited
              </span>
              <h1 className="text-2xl font-bold text-[#FAF0E0]">
                {guest.events.event_name}
              </h1>
              <p className="text-[#C5A880] text-xs font-sans italic">
                A special celebration awaits your presence
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 px-8 py-3 bg-[#FFFDF8] border-b border-[#DDD0BB]">
            <div className="flex-1 h-px bg-[#DDD0BB]" />
            <span className="text-[#C5A880] text-xs">✦</span>
            <div className="flex-1 h-px bg-[#DDD0BB]" />
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-[#1F1E1B]/70 font-sans">
                Dear <span className="font-bold text-[#1F1E1B]">{guest.guest_name}</span>,
              </p>
              <p className="text-xs text-[#1F1E1B]/60 italic font-sans leading-relaxed">
                We warmly request the pleasure of your company at our celebration on
              </p>
              <p className="text-sm font-bold text-[#8A1C2C]">{eventDate}</p>
            </div>

            <div className="border-t border-[#FAF6F0] pt-6">
              <p className="text-[10px] text-center text-[#1F1E1B]/50 uppercase tracking-widest font-sans mb-4">
                Kindly confirm your attendance
              </p>
              <RsvpClient guestId={guest.id} currentStatus={guest.rsvp_status} />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#FFFDF8] border-t border-[#DDD0BB] px-8 py-3 text-center">
            <p className="text-[9px] text-[#1F1E1B]/30 uppercase tracking-widest font-sans">
              EventVerse · Celebrating Life&apos;s Milestones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
