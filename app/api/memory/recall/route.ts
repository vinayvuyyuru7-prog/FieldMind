import { NextResponse } from 'next/server';
import { HindsightService } from '@/services/hindsightService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { machineId, query, limit } = body;

    if (!machineId || !query) {
      return NextResponse.json({ error: 'machineId and query are required' }, { status: 400 });
    }

    const memories = await HindsightService.recallRelevantMemory({ machineId, query, limit });
    return NextResponse.json(memories);
  } catch (error: any) {
    console.error('Error recalling memory:', error);
    return NextResponse.json({ error: error.message || 'Failed to recall memory' }, { status: 500 });
  }
}
