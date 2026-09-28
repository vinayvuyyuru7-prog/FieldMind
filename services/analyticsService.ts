import { prisma } from '@/lib/prisma';

export class AnalyticsService {
  static async getAnalyticsOverview() {
    const totalMachines = await prisma.machine.count();
    const totalIncidents = await prisma.incident.count();
    const totalInterventions = await prisma.intervention.count();
    const totalOutcomes = await prisma.outcome.count();

    // Incidents by Machine (Top 8)
    const machineIncidents = await prisma.machine.findMany({
      take: 8,
      orderBy: { incidentCount: 'desc' },
      select: { assetTag: true, incidentCount: true, status: true },
    });

    // Interventions by Result Type
    const interventionsByResult = await prisma.intervention.groupBy({
      by: ['result'],
      _count: { id: true },
    });

    const resultDistribution = interventionsByResult.map((i) => ({
      result: i.result,
      count: i._count.id,
    }));

    // Interventions by Type (ALIGNMENT, BEARING_REPLACEMENT, etc.)
    const interventionsByType = await prisma.intervention.groupBy({
      by: ['type'],
      _count: { id: true },
    });

    const typeDistribution = interventionsByType.map((t) => ({
      type: t.type,
      count: t._count.id,
    }));

    // Frequently replaced parts
    const partReplacements = await prisma.replacementHistory.groupBy({
      by: ['partId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const partDetails = await Promise.all(
      partReplacements.map(async (pr) => {
        const part = await prisma.part.findUnique({ where: { id: pr.partId } });
        return {
          partNumber: part ? part.partNumber : 'Unknown',
          partName: part ? part.partName : 'Unknown',
          category: part ? part.category : 'General',
          count: pr._count.id,
        };
      })
    );

    // Hero Machine metrics for comparison
    const heroMachine = await prisma.machine.findUnique({
      where: { assetTag: 'PUMP-042' },
      include: {
        incidents: {
          include: {
            interventions: true,
            outcomes: true,
          },
        },
      },
    });

    return {
      totalMachines,
      totalIncidents,
      totalInterventions,
      totalOutcomes,
      machineIncidentsChart: machineIncidents.map((m) => ({
        machine: m.assetTag,
        incidents: m.incidentCount,
        status: m.status,
      })),
      resultDistribution,
      typeDistribution,
      topPartsReplaced: partDetails,
      heroMetrics: heroMachine
        ? {
            assetTag: heroMachine.assetTag,
            incidentsCount: heroMachine.incidents.length,
            operatingHours: heroMachine.operatingHours,
            interventions: heroMachine.incidents.flatMap((i) => i.interventions).map((inv) => ({
              type: inv.type,
              result: inv.result,
            })),
          }
        : null,
    };
  }
}
