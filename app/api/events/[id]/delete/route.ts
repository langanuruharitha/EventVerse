// API Route: Delete Event
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify event belongs to user
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this event' },
        { status: 403 }
      );
    }

    // Delete related data (cascade should handle most, but being explicit)
    // Delete guests
    await supabase.from('guests').delete().eq('event_id', id);
    
    // Delete shopping list items
    await supabase.from('shopping_list_items').delete().eq('event_id', id);
    
    // Delete tasks
    await supabase.from('tasks').delete().eq('event_id', id);
    
    // Delete budget items
    await supabase.from('budget_items').delete().eq('event_id', id);
    
    // Delete decoration items
    await supabase.from('decoration_items').delete().eq('event_id', id);

    // Finally, delete the event
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting event:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Error in delete event API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
