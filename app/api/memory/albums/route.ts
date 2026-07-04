// API Route: Manage Memory Albums
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { aiMemoryOrganizer } from '@/lib/memory/ai-memory-organizer';

// GET: Fetch albums for an event
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Fetch albums
    const { data: albums, error } = await supabase
      .from('memory_albums')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ albums: albums || [] });
  } catch (error: any) {
    console.error('Fetch albums error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

// POST: Create new album
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      eventId,
      albumName,
      description,
      albumType = 'custom',
      isSmartAlbum = false,
      smartCriteria = null,
      privacySetting = 'private',
      allowGuestUpload = false,
      allowDownload = true,
      allowComments = true
    } = body;

    if (!eventId || !albumName) {
      return NextResponse.json(
        { error: 'Event ID and album name are required' },
        { status: 400 }
      );
    }

    // Verify event access
    const { data: event } = await supabase
      .from('events')
      .select('id, user_id')
      .eq('id', eventId)
      .single();

    if (!event || event.user_id !== user.id) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Generate share token if needed
    const shareToken = privacySetting !== 'private' 
      ? generateShareToken() 
      : null;

    // Create album
    const { data: album, error } = await supabase
      .from('memory_albums')
      .insert({
        event_id: eventId,
        album_name: albumName,
        description,
        album_type: albumType,
        is_smart_album: isSmartAlbum,
        smart_criteria: smartCriteria,
        privacy_setting: privacySetting,
        share_token: shareToken,
        allow_guest_upload: allowGuestUpload,
        allow_download: allowDownload,
        allow_comments: allowComments,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ album });
  } catch (error: any) {
    console.error('Create album error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create album' },
      { status: 500 }
    );
  }
}

// Helper: Generate share token
function generateShareToken(): string {
  return `share_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}
