import { NextRequest, NextResponse } from 'next/server';
import { CaptureSharedSchema } from '@job-tracker/shared';
import { parseSharedContent } from '@job-tracker/parsers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CaptureSharedSchema.parse(body);

    // Parse the shared content
    const parsed = parseSharedContent(
      validated.url,
      validated.title,
      validated.text
    );

    // Return prefill data with confidence
    return NextResponse.json({
      prefill: {
        title: parsed.title,
        company: parsed.company,
        location: parsed.location,
        job_url: parsed.job_url,
        job_id: parsed.job_id,
      },
      confidence: parsed.confidence || 0.5,
      needs_review: (parsed.confidence || 0) < 0.6,
    });

  } catch (error: any) {
    console.error('Error capturing shared content:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
