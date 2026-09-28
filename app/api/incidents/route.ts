import { NextResponse } from 'next/server';
import { IncidentService } from '@/services/incidentService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { machineId, description, symptoms, measurements, severity, initialDiagnosis } = body;

    if (!machineId || !description || !symptoms) {
      return NextResponse.json({ error: 'machineId, description, and symptoms are required' }, { status: 400 });
    }

    const incident = await IncidentService.createIncident({
      machineId,
      description,
      symptoms,
      measurements,
      severity,
      initialDiagnosis,
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error: any) {
    console.error('Error creating incident:', error);
    return NextResponse.json({ error: error.message || 'Failed to create incident' }, { status: 500 });
  }
}
