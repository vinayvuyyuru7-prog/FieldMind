import { prisma } from '@/lib/prisma';
import { HindsightService } from './hindsightService';

export class InterventionService {
  static async createIntervention(data: {
    incidentId: string;
    technicianId: string;
    type: string;
    description: string;
    partsUsed?: string[];
    result: 'SUCCESSFUL' | 'PARTIALLY_SUCCESSFUL' | 'TEMPORARY_IMPROVEMENT' | 'FAILED' | 'UNKNOWN';
    notes?: string;
  }) {
    const incident = await prisma.incident.findUnique({
      where: { id: data.incidentId },
      include: { machine: true },
    });
    if (!incident) throw new Error('Incident not found');

    const startedAt = new Date();
    const completedAt = new Date();

    const intervention = await prisma.intervention.create({
      data: {
        incidentId: data.incidentId,
        machineId: incident.machineId,
        technicianId: data.technicianId,
        type: data.type,
        description: data.description,
        partsUsed: JSON.stringify(data.partsUsed || []),
        startedAt,
        completedAt,
        result: data.result,
        notes: data.notes || null,
      },
    });

    // Record Maintenance Event
    await prisma.maintenanceEvent.create({
      data: {
        machineId: incident.machineId,
        eventType: 'INTERVENTION',
        description: `Intervention [${data.type}]: ${data.description} (Result: ${data.result})`,
        date: completedAt,
        technicianId: data.technicianId,
        incidentId: data.incidentId,
      },
    });

    // Retain intervention experience in Hindsight Memory
    const outcomeSummary =
      data.result === 'SUCCESSFUL'
        ? 'SUCCESSFUL resolution'
        : data.result === 'TEMPORARY_IMPROVEMENT'
        ? 'TEMPORARY IMPROVEMENT (issue re-emerged short-term)'
        : data.result === 'FAILED'
        ? 'FAILED intervention'
        : `${data.result} intervention`;

    await HindsightService.retainExperience({
      machineId: incident.machineId,
      incidentId: incident.id,
      category: 'INTERVENTION_OUTCOME',
      content: `${incident.machine.assetTag} intervention: ${data.type} - ${data.description}. Parts used: ${(data.partsUsed || []).join(', ')}. Outcome: ${outcomeSummary}. Notes: ${data.notes || 'None'}.`,
      outcomeType: data.result,
      source: `Intervention #${intervention.id.slice(0, 8)}`,
    });

    return intervention;
  }
}
