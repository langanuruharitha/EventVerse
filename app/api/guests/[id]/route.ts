import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET /api/guests/[id] - Get guest details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: guestId } = await params;

    // Get guest with all related data
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();

    if (guestError || !guest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ guest });

  } catch (error) {
    console.error('Guest detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/guests/[id] - Update guest
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: guestId } = await params;
    const body = await request.json();

    const { data: guest, error } = await supabase
      .from('guests')
      .update(body)
      .eq('id', guestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating guest:', error);
      return NextResponse.json(
        { error: 'Failed to update guest' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      guest,
      message: 'Guest updated successfully' 
    });

  } catch (error) {
    console.error('Guest update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/guests/[id] - Delete guest
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: guestId } = await params;

    // Delete guest (cascade will handle related records)
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guestId);

    if (error) {
      console.error('Error deleting guest:', error);
      return NextResponse.json(
        { error: 'Failed to delete guest' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Guest deleted successfully' 
    });

  } catch (error) {
    console.error('Guest delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
