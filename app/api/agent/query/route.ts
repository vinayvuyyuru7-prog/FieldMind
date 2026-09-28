import { NextResponse } from 'next/server';
import { AgentOrchestrator } from '@/agent/orchestrator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { machineId, query, mode } = body;

    if (!machineId || !query) {
      return NextResponse.json({ error: 'machineId and query are required' }, { status: 400 });
    }

    const response = await AgentOrchestrator.queryAgent({
      machineId,
      query,
      mode: mode || 'WITH_MEMORY',
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error processing agent query:', error);
    return NextResponse.json({ error: error.message || 'Failed to process AI agent query' }, { status: 500 });
  }
}
