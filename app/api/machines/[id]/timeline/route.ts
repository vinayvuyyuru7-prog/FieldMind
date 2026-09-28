import { NextResponse } from 'next/server';
import { TimelineService } from '@/services/timelineService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const timeline = await TimelineService.getMachineTimeline(params.id);
    return NextResponse.json(timeline);
  } catch (error: any) {
    console.error('Error fetching machine timeline:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch timeline' }, { status: 500 });
  }
}
