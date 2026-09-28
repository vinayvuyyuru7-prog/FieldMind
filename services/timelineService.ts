import { prisma } from '@/lib/prisma';

export class TimelineService {
  static async getMachineTimeline(machineId: string) {
    const events = await prisma.maintenanceEvent.findMany({
      where: { machineId },
      orderBy: { date: 'asc' },
      include: {
        technician: true,
        incident: {
          include: {
            interventions: { include: { outcomes: true, technician: true } },
            outcomes: true,
            memories: true,
          },
        },
      },
    });

    return events.map((event) => {
      const inc = event.incident;
      return {
        id: event.id,
        machineId: event.machineId,
        eventType: event.eventType,
        description: event.description,
        date: event.date.toISOString(),
        technicianName: event.technician ? event.technician.name : null,
        incidentDetails: inc
          ? {
              incidentId: inc.id,
              incidentNumber: inc.incidentNumber,
              severity: inc.severity,
              description: inc.description,
              symptoms: JSON.parse(inc.symptoms || '[]'),
              measurements: JSON.parse(inc.measurements || '{}'),
              status: inc.status,
              interventions: inc.interventions.map((inv) => ({
                id: inv.id,
                type: inv.type,
                description: inv.description,
                partsUsed: JSON.parse(inv.partsUsed || '[]'),
                result: inv.result,
                notes: inv.notes,
                startedAt: inv.startedAt.toISOString(),
              })),
              outcomes: inc.outcomes.map((o) => ({
                id: o.id,
                resolved: o.resolved,
                resolutionNotes: o.resolutionNotes,
                finalDiagnosis: o.finalDiagnosis,
                replacedComponent: o.replacedComponent,
                timeUntilRecurrence: o.timeUntilRecurrence,
              })),
              memories: inc.memories.map((m) => ({
                id: m.id,
                category: m.category,
                content: m.content,
                outcomeType: m.outcomeType,
              })),
            }
          : null,
      };
    });
  }
}
