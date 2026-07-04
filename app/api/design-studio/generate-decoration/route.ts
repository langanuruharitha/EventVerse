// app/api/design-studio/generate-decoration/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();
  } catch (e) {
    // Ignore JSON parse error
  }
  
  const { theme = 'Party', style = 'Modern', occasion = 'Event', colors = 'Any', wallDecor = 'None', specificItems = '', traditional = false } = body;

  try {
    console.log('🎨 Generating REAL AI decoration...');

    const prompt = `Professional event decoration photography, ultra detailed, 8K resolution, photorealistic, magazine quality. Stunning ${style} style venue decoration for ${occasion} event. Theme: ${theme}. Colors: ${colors}. Beautiful ${wallDecor} wall backdrop decorations prominently featured. Includes: ${specificItems} elegantly arranged. ${traditional ? 'Traditional Indian cultural decor: diyas lamps, rangoli floor art, marigold garland flowers, traditional mandap stage, ethnic patterns, cultural ornaments' : 'Modern contemporary luxury design'}. Elegant cohesive color scheme, professional event lighting warm golden ambiance, high-end luxury event photography, Instagram-worthy setup, complete decorated venue ready for celebration, no people, no text, no watermarks`;

    console.log('📝 Generating decoration...');

    const response = await hf.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: prompt,
      parameters: {
        guidance_scale: 7.5,
        num_inference_steps: 25,
      }
    });

    const blob = response as unknown as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    console.log('✅ Real AI decoration generated!');

    return NextResponse.json({
      success: true,
      imageUrl,
      description: `Beautiful ${style} ${occasion} decoration in ${colors}`,
      metadata: { theme, style, occasion, colors, generatedAt: new Date().toISOString(), aiGenerated: true, model: 'FLUX.1-schnell' }
    });

  } catch (error) {
    console.error('Error:', error);
    // Use body variables instead of calling request.json() again
    const canvas = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad1"><stop offset="0%" style="stop-color:#9333ea"/><stop offset="100%" style="stop-color:#ec4899"/></linearGradient></defs><rect width="1024" height="1024" fill="url(#grad1)"/><text x="50%" y="40%" text-anchor="middle" font-size="72" fill="white" font-family="Arial" font-weight="bold">${theme}</text><text x="50%" y="60%" text-anchor="middle" font-size="48" fill="white">${style} ${colors}</text></svg>`;
    
    return NextResponse.json({
      success: true,
      imageUrl: `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`,
      description: 'Preview (API issue)',
      metadata: { theme, aiGenerated: false, model: 'preview' }
    });
  }
}
