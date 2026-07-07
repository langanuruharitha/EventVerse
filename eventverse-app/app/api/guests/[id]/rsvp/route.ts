import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body; // 'confirmed' or 'declined'

    if (!['confirmed', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid RSVP status' }, { status: 400 });
    }

    const supabase = await createServerClient();

    // Note: We don't check for user authentication here because this endpoint
    // is called by the guest (who is not logged in).
    // The security relies on the guest ID being a hard-to-guess UUID.

    const { data: guest, error: fetchError } = await supabase
      .from('guests')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from('guests')
      .update({ rsvp_status: status })
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update RSVP:', updateError);
      return NextResponse.json({ error: 'Failed to update RSVP status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, status });

  } catch (error) {
    console.error('Error processing RSVP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
