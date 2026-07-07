import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET /api/guests?event_id=xxx - List guests for an event
export async function GET(request: Request) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const event_id = searchParams.get('event_id');

    if (!event_id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Get guests with group information
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', event_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching guests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch guests' },
        { status: 500 }
      );
    }

    return NextResponse.json({ guests });
  } catch (error) {
    console.error('Guest API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/guests - Create new guest
export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      event_id,
      guest_name,
      email,
      phone,
      city,
      address,
      category,
      age_group,
      plus_ones_allowed,
      dietary_restrictions,
      special_requirements,
      notes
    } = body;

    // Validate required fields
    if (!event_id || !guest_name) {
      return NextResponse.json(
        { error: 'Event ID and guest name are required' },
        { status: 400 }
      );
    }

    // Create guest
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .insert({
        event_id,
        full_name: guest_name,  // Map guest_name to full_name (required field)
        guest_name,
        email: email || null,
        phone: phone || null,
        city: city || null,
        address: address || null,
        category: category || 'general',
        age_group: age_group || 'adult',
        plus_ones_allowed: plus_ones_allowed || 0,
        plus_ones_confirmed: 0,
        dietary_restrictions: dietary_restrictions ? [dietary_restrictions] : null,
        special_requirements: special_requirements || null,
        notes: notes || null,
        rsvp_status: 'pending',
        attendance_status: 'pending',
        invitation_sent: false
      })
      .select()
      .single();

    if (guestError) {
      console.error('Error creating guest:', guestError);
      console.error('Guest error details:', {
        code: guestError.code,
        message: guestError.message,
        details: guestError.details,
        hint: guestError.hint
      });
      return NextResponse.json(
        { 
          error: 'Failed to create guest',
          details: guestError.message,
          code: guestError.code
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      guest,
      message: 'Guest added successfully' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Guest creation error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
