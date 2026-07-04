// app/api/design-studio/generate-video/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateEventVideo } from '@/lib/ai/huggingface-image-generator';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventType,
      theme,
      style,
      duration,
      mood,
      scenes,
    } = body;

    console.log('🎬 Generating AI event video concept...');

    // Generate AI description
    let description = '';
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const descriptionResult = await model.generateContent([
        `Based on this video request, provide a detailed description in 2-3 sentences:
        ${eventType} video, ${theme} theme, ${style} style, ${mood} mood, ${duration} seconds`
      ]);
      description = descriptionResult.response.text();
    } catch (error) {
      console.log('Description generation skipped');
    }

    // Generate video concept (thumbnail for now)
    const videoResult = await generateEventVideo({
      eventType,
      theme,
      style,
      duration: duration || 3,
      mood,
      scenes,
    });

    if (!videoResult.success) {
      return NextResponse.json(
        { error: videoResult.error || 'Failed to generate video' },
        { status: 500 }
      );
    }

    console.log('✅ Video concept generated successfully!');

    return NextResponse.json({
      success: true,
      videoUrl: videoResult.videoUrl,
      thumbnailUrl: videoResult.thumbnailUrl,
      description: description,
      metadata: {
        eventType,
        theme,
        style,
        mood,
        duration: duration || 3,
        generatedAt: new Date().toISOString(),
        aiGenerated: true,
        type: 'video-concept',
      }
    });

  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video concept' },
      { status: 500 }
    );
  }
}
