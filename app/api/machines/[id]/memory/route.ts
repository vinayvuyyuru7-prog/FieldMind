import { NextResponse } from 'next/server';
import { HindsightService } from '@/services/hindsightService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const memories = await HindsightService.getMachineMemory(params.id);
    const insights = await HindsightService.generateMachineInsights(params.id);
    return NextResponse.json({ memories, insights });
  } catch (error: any) {
    console.error('Error fetching machine memory:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch machine memory' }, { status: 500 });
  }
}
