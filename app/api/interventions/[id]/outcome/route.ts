import { NextResponse } from 'next/server';
import { OutcomeService } from '@/services/outcomeService';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { incidentId, resolved, resolutionNotes, finalDiagnosis, replacedComponent, timeUntilRecurrence } = body;

    if (!incidentId || resolved === undefined || !resolutionNotes || !finalDiagnosis) {
      return NextResponse.json(
        { error: 'incidentId, resolved, resolutionNotes, and finalDiagnosis are required' },
        { status: 400 }
      );
    }

    const outcome = await OutcomeService.createOutcome({
      incidentId,
      interventionId: params.id,
      resolved,
      resolutionNotes,
      finalDiagnosis,
      replacedComponent,
      timeUntilRecurrence,
    });

    return NextResponse.json(outcome, { status: 201 });
  } catch (error: any) {
    console.error('Error creating outcome:', error);
    return NextResponse.json({ error: error.message || 'Failed to record outcome' }, { status: 500 });
  }
}
