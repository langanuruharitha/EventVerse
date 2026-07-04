import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventType,
      eventName,
      fromName,
      toName,
      date,
      time,
      venue,
      message,
      templateId,
      themeDescription,
    } = body;

    // Validate required fields
    if (!eventName || !fromName || !date || !time || !venue) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format date and time for display
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // In production, this would:
    // 1. Upload photos to storage
    // 2. Use FFmpeg to create a slideshow video with transitions
    // 3. Add background music based on event type
    // 4. Add text overlays with event details
    // 5. Render final video and upload to storage
    // 6. Return the video URL

    // For now, we'll create a placeholder animated SVG that simulates a video
    const placeholderVideo = generatePlaceholderVideo({
      eventType,
      eventName,
      fromName,
      toName,
      date: formattedDate,
      time: formattedTime,
      venue,
      message,
      themeDescription,
    });

    // Save to database
    const { data: invitation, error } = await supabase
      .from('invitations')
      .insert({
        event_type: eventType,
        format_type: 'video',
        event_name: eventName,
        host_names: fromName,
        guest_names: toName,
        event_date: date,
        event_time: time,
        venue_address: venue,
        custom_message: message,
        template_id: templateId,
        preview_url: placeholderVideo,
        status: 'completed',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      videoUrl: placeholderVideo,
      invitationId: invitation.id,
      message: 'Video invitation created successfully! Note: Full video generation with photos will be implemented in production.',
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}

function generatePlaceholderVideo(data: any): string {
  const theme = (data.themeDescription || '').toLowerCase();
  
  if (theme.includes('disco') || theme.includes('dance') || theme.includes('party')) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-dancers-in-a-disco-with-neon-lights-40096-large.mp4';
  }
  if (theme.includes('garden') || theme.includes('flower') || theme.includes('floral') || theme.includes('nature')) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-pink-flowers-in-a-garden-swaying-in-the-wind-41584-large.mp4';
  }
  if (theme.includes('neon') || theme.includes('retro') || theme.includes('futuristic')) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-retro-futuristic-grid-background-41617-large.mp4';
  }
  if (theme.includes('star') || theme.includes('night') || theme.includes('sky') || theme.includes('space')) {
    return 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-41630-large.mp4';
  }

  const demoVideos: any = {
    birthday: 'https://assets.mixkit.co/videos/preview/mixkit-birthday-cake-with-burning-candles-in-close-up-41581-large.mp4',
    wedding: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-rings-on-a-glowing-golden-surface-40294-large.mp4',
    anniversary: 'https://assets.mixkit.co/videos/preview/mixkit-couple-clinking-champagne-glasses-41577-large.mp4',
    corporate: 'https://assets.mixkit.co/videos/preview/mixkit-business-people-meeting-around-a-table-in-an-office-42352-large.mp4',
  };

  return demoVideos[data.eventType] || demoVideos.birthday;
}

// Future implementation would look like this:
/*
async function generateVideoWithFFmpeg(data: any, photos: File[]): Promise<string> {
  const ffmpeg = require('fluent-ffmpeg');
  const path = require('path');
  const fs = require('fs');

  // 1. Upload photos to temporary storage
  const photoUrls = await Promise.all(
    photos.map(async (photo) => {
      const { data: uploadData, error } = await supabase.storage
        .from('invitation-photos')
        .upload(`temp/${Date.now()}-${photo.name}`, photo);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('invitation-photos')
        .getPublicUrl(uploadData.path);
      
      return publicUrl;
    })
  );

  // 2. Create video with FFmpeg
  const outputPath = path.join('/tmp', `video-${Date.now()}.mp4`);
  
  await new Promise((resolve, reject) => {
    const command = ffmpeg();
    
    // Add each photo with duration
    photoUrls.forEach((photoUrl, index) => {
      command.input(photoUrl).inputOptions(['-loop 1', '-t 3']);
    });
    
    // Add background music based on event type
    const musicPath = getMusicForEventType(data.eventType);
    command.input(musicPath);
    
    // Apply filters and transitions
    command
      .complexFilter([
        // Fade in/out transitions between photos
        ...photoUrls.map((_, i) => `[${i}:v]fade=t=in:st=0:d=0.5,fade=t=out:st=2.5:d=0.5[v${i}]`),
        // Concatenate all photos
        photoUrls.map((_, i) => `[v${i}]`).join('') + `concat=n=${photoUrls.length}:v=1:a=0[outv]`,
        // Add text overlays
        `[outv]drawtext=text='${data.eventName}':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=100:enable='between(t,0,3)'[textv]`
      ])
      .outputOptions([
        '-map [textv]',
        '-map 1:a',
        '-c:v libx264',
        '-c:a aac',
        '-shortest',
        '-pix_fmt yuv420p'
      ])
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  // 3. Upload final video to storage
  const videoFile = fs.readFileSync(outputPath);
  const { data: uploadData, error } = await supabase.storage
    .from('invitation-videos')
    .upload(`videos/${Date.now()}.mp4`, videoFile, {
      contentType: 'video/mp4'
    });

  if (error) throw error;

  // 4. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('invitation-videos')
    .getPublicUrl(uploadData.path);

  // 5. Clean up temp files
  fs.unlinkSync(outputPath);

  return publicUrl;
}

function getMusicForEventType(eventType: string): string {
  const musicMap: any = {
    birthday: '/music/birthday-celebration.mp3',
    wedding: '/music/wedding-romantic.mp3',
    anniversary: '/music/anniversary-love.mp3',
    corporate: '/music/corporate-upbeat.mp3',
  };
  return musicMap[eventType] || musicMap.birthday;
}
*/
