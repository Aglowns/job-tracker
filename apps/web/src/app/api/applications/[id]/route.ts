import { NextRequest, NextResponse } from 'next/server';
import { UpdateApplicationSchema } from '@job-tracker/shared';
import { getApplication, updateApplication } from '@/lib/application-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const application = await getApplication(params.id);
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application });

  } catch (error) {
    console.error('Error getting application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = UpdateApplicationSchema.parse(body);

    const application = await updateApplication(params.id, validated);

    return NextResponse.json({ application });

  } catch (error: any) {
    console.error('Error updating application:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
