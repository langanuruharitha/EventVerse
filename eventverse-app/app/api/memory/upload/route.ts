// API Route: Upload photos to Memory Vault
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { aiMemoryOrganizer } from '@/lib/memory/ai-memory-organizer';
import { facialRecognition } from '@/lib/memory/facial-recognition';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, albumId, files } = body;

    if (!eventId || !files || files.length === 0) {
      return NextResponse.json(
        { error: 'Event ID and files are required' },
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

    // Process each file
    const uploadedItems = [];
    const errors = [];

    for (const file of files) {
      try {
        // Create memory item record
        const { data: memoryItem, error: insertError } = await supabase
          .from('memory_items')
          .insert({
            album_id: albumId,
            event_id: eventId,
            file_type: file.type.startsWith('image/') ? 'photo' : 'video',
            file_name: file.name,
            original_file_name: file.originalName,
            file_url: file.url,
            thumbnail_url: file.thumbnailUrl,
            file_size: file.size,
            mime_type: file.type,
            uploaded_by: user.id,
            upload_method: 'web',
            processing_status: 'processing'
          })
          .select()
          .single();

        if (insertError) {
          errors.push({ file: file.name, error: insertError.message });
          continue;
        }

        uploadedItems.push(memoryItem);

        // Queue for AI analysis (async - don't wait)
        if (file.type.startsWith('image/')) {
          queueAIAnalysis(memoryItem.id, file.url, eventId);
        }
      } catch (error: any) {
        errors.push({ file: file.name, error: error.message });
      }
    }

    // Update album stats if albumId provided
    if (albumId) {
      const { data: album } = await supabase
        .from('memory_albums')
        .select('photo_count, video_count, total_size_bytes')
        .eq('id', albumId)
        .single();

      if (album) {
        const photoCount = uploadedItems.filter(i => i.file_type === 'photo').length;
        const videoCount = uploadedItems.filter(i => i.file_type === 'video').length;
        const totalSize = uploadedItems.reduce((sum, i) => sum + i.file_size, 0);

        await supabase
          .from('memory_albums')
          .update({
            photo_count: album.photo_count + photoCount,
            video_count: album.video_count + videoCount,
            total_size_bytes: album.total_size_bytes + totalSize,
            updated_at: new Date().toISOString()
          })
          .eq('id', albumId);
      }
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedItems.length,
      items: uploadedItems,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload photos' },
      { status: 500 }
    );
  }
}

// Queue AI analysis (runs asynchronously)
async function queueAIAnalysis(itemId: string, photoUrl: string, eventId: string) {
  try {
    const supabase = await createServerClient();

    // Analyze photo content
    const analysis = await aiMemoryOrganizer.analyzePhotoContent(photoUrl, itemId);

    // Perform facial recognition
    const faceResults = await facialRecognition.performFacialRecognition(photoUrl, eventId);

    // Update memory item with AI analysis
    await supabase
      .from('memory_items')
      .update({
        ai_analysis: analysis,
        content_flags: analysis.safeSearch,
        processing_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId);

    // Store face detection results
    if (faceResults.length > 0) {
      const faceRecords = faceResults.map(face => ({
        memory_item_id: itemId,
        face_coordinates: face.faceCoordinates,
        confidence_score: face.confidence,
        guest_id: face.matchedGuest?.id || null,
        suggested_guest_id: face.suggestedGuests[0]?.id || null,
        face_encoding: face.faceEncoding,
        is_verified: face.matchConfidence > 0.9
      }));

      await supabase.from('memory_faces').insert(faceRecords);
    }

    // Generate smart tags
    const event = await supabase
      .from('events')
      .select('event_type, theme, event_date')
      .eq('id', eventId)
      .single();

    if (event.data) {
      const tags = await aiMemoryOrganizer.suggestTags(analysis, {
        id: eventId,
        eventType: event.data.event_type,
        eventDate: event.data.event_date,
        theme: event.data.theme
      });

      await supabase
        .from('memory_items')
        .update({ tags })
        .eq('id', itemId);
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    // Update status to failed
    const supabase = await createServerClient();
    await supabase
      .from('memory_items')
      .update({
        processing_status: 'failed',
        processing_error: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('id', itemId);
  }
}
