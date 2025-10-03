import { NextRequest, NextResponse } from 'next/server';

// Handle PWA Web Share Target POST
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const url = formData.get('url')?.toString() || '';
    const title = formData.get('title')?.toString() || '';
    const text = formData.get('text')?.toString() || '';

    // Encode data and redirect to capture page
    const data = { url, title, text };
    const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
    
    return NextResponse.redirect(
      new URL(`/capture?d=${encodeURIComponent(encoded)}`, request.url)
    );
  } catch (error) {
    console.error('Error handling shared content:', error);
    return NextResponse.redirect(new URL('/capture', request.url));
  }
}

