// API Route: AI-Powered Photo Organization
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { aiMemoryOrganizer } from '@/lib/memory/ai-memory-organizer';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Verify event access
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (!event || event.user_id !== user.id) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Get all photos for the event
    const { data: photos, error: photosError } = await supabase
      .from('memory_items')
      .select('*')
      .eq('event_id', eventId)
      .eq('file_type', 'photo')
      .eq('processing_status', 'completed');

    if (photosError) throw photosError;

    if (!photos || photos.length === 0) {
      return NextResponse.json({
        message: 'No photos found to organize',
        albumsCreated: 0
      });
    }

    // Organize photos using AI
    const organizationResult = await aiMemoryOrganizer.organizeEventPhotos(
      eventId,
      photos
    );

    // Create smart albums based on organization results
    const createdAlbums = [];
    
    for (const smartAlbum of organizationResult.albums) {
      const { data: album, error: albumError } = await supabase
        .from('memory_albums')
        .insert({
          event_id: eventId,
          album_name: smartAlbum.name,
          description: smartAlbum.description,
          album_type: 'auto_generated',
          is_smart_album: true,
          smart_criteria: smartAlbum.criteria,
          privacy_setting: 'private',
          photo_count: smartAlbum.itemCount,
          cover_image_url: smartAlbum.coverImage,
          created_by: user.id,
          allow_guest_upload: false,
          allow_download: true,
          allow_comments: true
        })
        .select()
        .single();

      if (!albumError && album) {
        createdAlbums.push(album);
      }
    }

    return NextResponse.json({
      success: true,
      ...organizationResult,
      albums: createdAlbums
    });
  } catch (error: any) {
    console.error('Photo organization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to organize photos' },
      { status: 500 }
    );
  }
}
