import { prisma } from '@/lib/prisma';
import { HindsightService } from './hindsightService';

export class OutcomeService {
  static async createOutcome(data: {
    incidentId: string;
    interventionId: string;
    resolved: boolean;
    resolutionNotes: string;
    finalDiagnosis: string;
    replacedComponent?: string;
    timeUntilRecurrence?: number;
  }) {
    const incident = await prisma.incident.findUnique({
      where: { id: data.incidentId },
      include: { machine: true },
    });
    if (!incident) throw new Error('Incident not found');

    const outcome = await prisma.outcome.create({
      data: {
        incidentId: data.incidentId,
        interventionId: data.interventionId,
        machineId: incident.machineId,
        resolved: data.resolved,
        resolutionNotes: data.resolutionNotes,
        finalDiagnosis: data.finalDiagnosis,
        replacedComponent: data.replacedComponent || null,
        timeUntilRecurrence: data.timeUntilRecurrence || null,
      },
    });

    // Update Incident and Machine status
    await prisma.incident.update({
      where: { id: data.incidentId },
      data: {
        status: data.resolved ? 'RESOLVED' : 'RECURRED',
        resolvedAt: data.resolved ? new Date() : null,
      },
    });

    if (data.resolved) {
      await prisma.machine.update({
        where: { id: incident.machineId },
        data: {
          status: 'OPERATIONAL',
          currentIssue: null,
          lastMaintenanceDate: new Date(),
        },
      });
    }

    // Retain outcome in Hindsight Memory
    const machine = incident.machine;
    const recurrenceStr = data.timeUntilRecurrence
      ? ` Recurrence period documented: ${data.timeUntilRecurrence} days.`
      : '';

    await HindsightService.retainExperience({
      machineId: incident.machineId,
      incidentId: incident.id,
      category: 'INTERVENTION_OUTCOME',
      content: `${machine.assetTag} repair outcome recorded for Incident #${incident.incidentNumber}. Final Diagnosis: ${data.finalDiagnosis}. Resolution Notes: ${data.resolutionNotes}.${recurrenceStr} Status: ${data.resolved ? 'RESOLVED' : 'UNRESOLVED/RECURRED'}.`,
      outcomeType: data.resolved ? 'SUCCESSFUL' : 'FAILED',
      source: `Outcome #${outcome.id.slice(0, 8)}`,
    });

    return outcome;
  }
}
