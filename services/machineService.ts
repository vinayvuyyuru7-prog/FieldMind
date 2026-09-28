import { prisma } from '@/lib/prisma';
import { MachineDto, DashboardStats } from '@/lib/types';

export class MachineService {
  static async getAllMachines(query?: { search?: string; status?: string; location?: string }): Promise<MachineDto[]> {
    const whereClause: any = {};

    if (query?.search) {
      whereClause.OR = [
        { assetTag: { contains: query.search } },
        { name: { contains: query.search } },
        { model: { contains: query.search } },
      ];
    }

    if (query?.status && query.status !== 'ALL') {
      whereClause.status = query.status;
    }

    if (query?.location && query.location !== 'ALL') {
      whereClause.location = { contains: query.location };
    }

    const machines = await prisma.machine.findMany({
      where: whereClause,
      orderBy: { assetTag: 'asc' },
    });

    return machines.map((m) => ({
      ...m,
      installationDate: m.installationDate.toISOString(),
      lastMaintenanceDate: m.lastMaintenanceDate ? m.lastMaintenanceDate.toISOString() : null,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      status: m.status as any,
    }));
  }

  static async getMachineById(idOrTag: string) {
    const machine = await prisma.machine.findFirst({
      where: {
        OR: [{ id: idOrTag }, { assetTag: idOrTag }],
      },
      include: {
        incidents: {
          orderBy: { reportedAt: 'desc' },
          include: {
            observations: { include: { technician: true } },
            interventions: { include: { technician: true, outcomes: true } },
            outcomes: true,
          },
        },
        memories: { orderBy: { createdAt: 'desc' } },
        replacements: { include: { part: true, technician: true } },
      },
    });

    if (!machine) return null;

    return {
      ...machine,
      installationDate: machine.installationDate.toISOString(),
      lastMaintenanceDate: machine.lastMaintenanceDate ? machine.lastMaintenanceDate.toISOString() : null,
      createdAt: machine.createdAt.toISOString(),
      updatedAt: machine.updatedAt.toISOString(),
      incidents: machine.incidents.map((inc) => ({
        ...inc,
        symptoms: JSON.parse(inc.symptoms || '[]'),
        measurements: JSON.parse(inc.measurements || '{}'),
        reportedAt: inc.reportedAt.toISOString(),
        resolvedAt: inc.resolvedAt ? inc.resolvedAt.toISOString() : null,
        createdAt: inc.createdAt.toISOString(),
        updatedAt: inc.updatedAt.toISOString(),
        interventions: inc.interventions.map((inv) => ({
          ...inv,
          partsUsed: JSON.parse(inv.partsUsed || '[]'),
          startedAt: inv.startedAt.toISOString(),
          completedAt: inv.completedAt ? inv.completedAt.toISOString() : null,
          createdAt: inv.createdAt.toISOString(),
        })),
        outcomes: inc.outcomes.map((o) => ({
          ...o,
          createdAt: o.createdAt.toISOString(),
        })),
      })),
      memories: machine.memories.map((mem) => ({
        ...mem,
        createdAt: mem.createdAt.toISOString(),
      })),
    };
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    const totalMachines = await prisma.machine.count();
    const activeIssues = await prisma.machine.count({
      where: { status: { in: ['WARNING', 'CRITICAL'] } },
    });
    const unresolvedIncidents = await prisma.incident.count({
      where: { status: 'OPEN' },
    });
    
    // Recurring failures count (machines with > 1 incident)
    const machinesWithIncidents = await prisma.machine.findMany({
      select: { id: true, incidentCount: true },
      where: { incidentCount: { gt: 1 } },
    });

    const heroMachine = await prisma.machine.findUnique({
      where: { assetTag: 'PUMP-042' },
    });

    const recentMemories = await prisma.memoryItem.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { content: true },
    });

    return {
      totalMachines,
      activeIssues,
      recurringFailures: machinesWithIncidents.length,
      unresolvedIncidents,
      recentMaintenanceCount: 14,
      heroMachineId: heroMachine ? heroMachine.id : '',
      recentInsights: recentMemories.map((m) => m.content),
    };
  }
}
