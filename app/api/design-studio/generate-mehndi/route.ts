// app/api/design-studio/generate-mehndi/route.ts
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
  
  const { pattern = 'Classic', complexity = 'Medium', placement = 'Hands', designStyle = 'Traditional', occasion = 'Event', elements = '', specialMotifs = '' } = body;

  try {
    console.log('💅 Generating REAL AI mehndi image...');

    const prompt = `Professional close-up macro photography of intricate ${pattern} style mehndi henna design applied on human ${placement}, traditional Indian wedding bridal henna art, ${complexity} complexity with ${elements} elements, ${specialMotifs || 'peacocks flowers paisley mandala'}, rich dark reddish-brown henna color clearly visible on skin, symmetrical detailed patterns, ${designStyle} mehndi art, fine delicate lines dots, master mehndi artist work, culturally authentic traditional design for ${occasion}, high resolution macro showing clear henna details, beautiful intricate mehendi on hands visible, sharp focus, traditional Indian bridal quality, actual henna tattoo on human skin, no blur, no text, no watermarks`;

    console.log('📝 Generating mehndi...');

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

    console.log('✅ Real AI mehndi generated!');

    return NextResponse.json({
      success: true,
      imageUrl,
      description: `Beautiful ${pattern} ${complexity} mehndi for ${placement}`,
      metadata: { pattern, complexity, designStyle, occasion, generatedAt: new Date().toISOString(), aiGenerated: true, model: 'FLUX.1-schnell' }
    });

  } catch (error) {
    console.error('Error:', error);
    // Use body variables instead of calling request.json() again
    const canvas = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad1"><stop offset="0%" style="stop-color:#ea580c"/><stop offset="100%" style="stop-color:#dc2626"/></linearGradient></defs><rect width="1024" height="1024" fill="url(#grad1)"/><text x="50%" y="40%" text-anchor="middle" font-size="64" fill="white" font-family="Arial" font-weight="bold">${pattern} Mehndi</text><text x="50%" y="60%" text-anchor="middle" font-size="48" fill="white">${complexity} for ${placement}</text></svg>`;
    
    return NextResponse.json({
      success: true,
      imageUrl: `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`,
      description: 'Preview (API issue)',
      metadata: { pattern, aiGenerated: false, model: 'preview' }
    });
  }
}
