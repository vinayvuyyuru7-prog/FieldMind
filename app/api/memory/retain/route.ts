import { NextResponse } from 'next/server';
import { HindsightService } from '@/services/hindsightService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { machineId, incidentId, category, content, outcomeType, source } = body;

    if (!machineId || !category || !content) {
      return NextResponse.json({ error: 'machineId, category, and content are required' }, { status: 400 });
    }

    const memory = await HindsightService.retainExperience({
      machineId,
      incidentId,
      category,
      content,
      outcomeType,
      source: source || 'Manual Entry',
    });

    return NextResponse.json(memory, { status: 201 });
  } catch (error: any) {
    console.error('Error retaining memory:', error);
    return NextResponse.json({ error: error.message || 'Failed to retain memory' }, { status: 500 });
  }
}
