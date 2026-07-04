// app/api/design-studio/generate-invitation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateInvitationTemplate } from '@/lib/ai/huggingface-image-generator';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventType,
      theme,
      colors,
      style,
      textPlacement,
      decorativeElements,
    } = body;

    console.log('💌 Generating REAL AI invitation template...');

    // Generate AI description
    let description = '';
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const descriptionResult = await model.generateContent([
        `Based on this invitation request, provide a detailed visual description in 2-3 sentences:
        ${eventType} invitation, ${theme} theme, ${style} style, ${colors} colors`
      ]);
      description = descriptionResult.response.text();
    } catch (error) {
      console.log('Description generation skipped');
    }

    // Generate REAL AI invitation template
    const imageResult = await generateInvitationTemplate({
      eventType,
      theme,
      colors,
      style,
      textPlacement,
      decorativeElements,
    });

    if (!imageResult.success) {
      return NextResponse.json(
        { error: imageResult.error || 'Failed to generate invitation' },
        { status: 500 }
      );
    }

    console.log('✅ Invitation template generated successfully!');

    return NextResponse.json({
      success: true,
      imageUrl: imageResult.imageUrl,
      description: description,
      metadata: {
        eventType,
        theme,
        style,
        colors,
        generatedAt: new Date().toISOString(),
        aiGenerated: true,
        model: imageResult.model,
      }
    });

  } catch (error) {
    console.error('Error generating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to generate invitation template' },
      { status: 500 }
    );
  }
}
