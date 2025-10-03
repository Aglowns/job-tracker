import { NextRequest, NextResponse } from 'next/server';
import { CreateApplicationSchema } from '@job-tracker/shared';
import { createApplication, listApplications } from '@/lib/application-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const user_id = searchParams.get('user_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    const filters: any = {};
    if (status) filters.status = status;
    if (user_id) filters.user_id = user_id;
    if (start_date) filters.start_date = new Date(start_date);
    if (end_date) filters.end_date = new Date(end_date);

    const applications = await listApplications(filters);
    return NextResponse.json({ applications });

  } catch (error) {
    console.error('Error listing applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateApplicationSchema.parse(body);

    const application = await createApplication({
      ...validated,
      applied_at: validated.applied_at ? new Date(validated.applied_at) : undefined,
    });

    return NextResponse.json({ application }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating application:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
