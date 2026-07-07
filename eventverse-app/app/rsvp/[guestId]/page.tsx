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

  // We use the service role key to bypass RLS since guests are not logged in
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase env vars');
    return notFound();
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch guest and event details
  const { data: guest, error } = await supabase
    .from('guests')
    .select('*, events(event_name, event_date)')
    .eq('id', guestId)
    .single();

  if (error || !guest || !guest.events) {
    console.error('Error fetching RSVP data:', error);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">You're Invited!</h1>
          <p className="text-purple-100 text-lg">
            {guest.events.event_name}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg mb-2">Hello, <span className="font-semibold text-gray-900">{guest.guest_name}</span>!</p>
            <p className="text-gray-600">
              Please let us know if you can make it on <br/>
              <span className="font-semibold text-gray-900">
                {new Date(guest.events.event_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </p>
          </div>

          <RsvpClient guestId={guest.id} currentStatus={guest.rsvp_status} />
        </div>
      </div>
    </div>
  );
}
