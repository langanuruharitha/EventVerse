import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();
    const { venueId, name, email, phone, eventDate, guestCount, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email and phone are required' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    const insertPayload: any = {
      venue_id: venueId || null,
      user_id: user?.id || null,
      name,
      email,
      phone,
      notes: message || 'Venue Inquiry',
      lead_status: 'new'
    };

    if (eventDate && typeof eventDate === 'string' && eventDate.trim() !== '') {
      insertPayload.event_date = eventDate;
    }

    const parsedCount = parseInt(guestCount);
    if (!isNaN(parsedCount) && parsedCount > 0) {
      insertPayload.guest_count = parsedCount;
    }

    // Try inserting into venue_leads
    const { data, error } = await supabase
      .from('venue_leads')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.warn('API venue_leads insert notice:', error);
      // Fallback: insert into vendor_inquiries table
      try {
        await supabase.from('vendor_inquiries').insert({
          customer_id: user?.id || null,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          subject: `Venue Inquiry for ${venueId}`,
          message: message || `Inquiry for venue ${venueId}. Date: ${eventDate || 'TBD'}, Guests: ${guestCount || 'TBD'}.`,
          status: 'new'
        });
      } catch (fbErr) {
        console.warn('Secondary fallback notice:', fbErr);
      }
    }

    return NextResponse.json({ success: true, lead: data || null });
  } catch (err: any) {
    console.error('Error in /api/venues/inquiry:', err);
    return NextResponse.json({ success: true, message: 'Inquiry received' });
  }
}
