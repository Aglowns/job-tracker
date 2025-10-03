import { NextResponse } from 'next/server';
import { sweepFollowups } from '@/lib/followup-service';

export async function POST() {
  try {
    const count = await sweepFollowups();
    return NextResponse.json({ success: true, count });

  } catch (error) {
    console.error('Error sweeping followups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
