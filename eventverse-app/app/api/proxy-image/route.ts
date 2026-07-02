import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.statusText}`);
    }
    const blob = await res.blob();
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': blob.type || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
