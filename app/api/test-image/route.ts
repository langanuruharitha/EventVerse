// app/api/test-image/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Test different image generation services
  
  const tests = [
    {
      name: 'Pollinations - Flux',
      url: 'https://image.pollinations.ai/prompt/beautiful%20red%20rose?width=512&height=512&model=flux&nologo=true&enhance=true',
    },
    {
      name: 'Pollinations - Turbo',
      url: 'https://image.pollinations.ai/prompt/beautiful%20red%20rose?width=512&height=512&model=turbo&nologo=true',
    },
    {
      name: 'Placeholder (Control)',
      url: 'https://via.placeholder.com/512/FF6B6B/FFFFFF?text=Test+Image',
    },
  ];

  return NextResponse.json({
    message: 'Test image URLs',
    instructions: 'Try loading these URLs in your browser to see which work:',
    tests,
    timestamp: new Date().toISOString(),
  });
}
