import { NextResponse } from 'next/server';
import { InterventionService } from '@/services/interventionService';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { technicianId, type, description, partsUsed, result, notes } = body;

    if (!technicianId || !type || !description || !result) {
      return NextResponse.json({ error: 'technicianId, type, description, and result are required' }, { status: 400 });
    }

    const intervention = await InterventionService.createIntervention({
      incidentId: params.id,
      technicianId,
      type,
      description,
      partsUsed,
      result,
      notes,
    });

    return NextResponse.json(intervention, { status: 201 });
  } catch (error: any) {
    console.error('Error creating intervention:', error);
    return NextResponse.json({ error: error.message || 'Failed to create intervention' }, { status: 500 });
  }
}
