// app/api/design-studio/generate-cake/route.ts
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
  
  const {
    cakeName = 'Custom Cake',
    occasion = 'Celebration',
    theme = 'Elegant',
    tiers = 1,
    colors = 'white',
    decorationStyle = 'Classic',
    topperIdea = 'None',
  } = body;

  try {
    console.log('🎂 Generating REAL AI cake image with Hugging Face...');

    // Build professional prompt
    const prompt = `Professional bakery photography, ultra detailed close-up, 8K resolution, photorealistic, food magazine quality. Beautiful ${tiers}-tier celebration cake for ${occasion}. Decoration style: ${decorationStyle} with ${colors} color palette. Theme: ${theme}. Elegant ${topperIdea} cake topper. The cake is beautifully presented on elegant cake stand, professional studio lighting, sharp focus, delicious appetizing, perfect smooth frosting, intricate details, premium bakery, high-end pastry photography, mouth-watering, no people, no text, no watermarks`;

    console.log('📝 Prompt:', prompt.substring(0, 80) + '...');

    // Use Hugging Face official client - textToImage
    const response = await hf.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: prompt,
      parameters: {
        guidance_scale: 7.5,
        num_inference_steps: 25,
      }
    });

    // Convert blob to base64
    const blob = response as unknown as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    console.log('✅ Real AI cake image generated!');

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      description: `A beautiful ${tiers}-tier ${decorationStyle} cake in ${colors} colors`,
      metadata: {
        cakeName,
        occasion,
        tiers,
        decorationStyle,
        generatedAt: new Date().toISOString(),
        aiGenerated: true,
        model: 'FLUX.1-schnell',
      }
    });

  } catch (error) {
    console.error('Error generating cake:', error);
    
    // Fallback to enhanced preview
    const canvas = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" /><stop offset="100%" style="stop-color:#f97316;stop-opacity:1" /></linearGradient></defs><rect width="1024" height="1024" fill="url(#grad1)"/><text x="50%" y="45%" text-anchor="middle" font-size="56" fill="white" font-family="Arial" font-weight="bold">${cakeName}</text><text x="50%" y="60%" text-anchor="middle" font-size="40" fill="white" font-family="Arial">${tiers} Tier ${decorationStyle}</text></svg>`;
    
    return NextResponse.json({
      success: true,
      imageUrl: `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`,
      description: 'Preview (API connection issue)',
      metadata: { cakeName, aiGenerated: false, model: 'preview', error: error instanceof Error ? error.message : 'Unknown' }
    });
  }
}
