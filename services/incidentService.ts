import { prisma } from '@/lib/prisma';
import { IncidentDto } from '@/lib/types';
import { HindsightService } from './hindsightService';

export class IncidentService {
  static async getIncidentsByMachine(machineId: string): Promise<IncidentDto[]> {
    const incidents = await prisma.incident.findMany({
      where: { machineId },
      orderBy: { reportedAt: 'desc' },
      include: {
        observations: { include: { technician: true } },
        interventions: { include: { technician: true, outcomes: true } },
        outcomes: true,
      },
    });

    return incidents.map((inc) => ({
      ...inc,
      symptoms: JSON.parse(inc.symptoms || '[]'),
      measurements: JSON.parse(inc.measurements || '{}'),
      reportedAt: inc.reportedAt.toISOString(),
      resolvedAt: inc.resolvedAt ? inc.resolvedAt.toISOString() : null,
      createdAt: inc.createdAt.toISOString(),
      updatedAt: inc.updatedAt.toISOString(),
    })) as any;
  }

  static async getIncidentById(id: string) {
    const inc = await prisma.incident.findUnique({
      where: { id },
      include: {
        machine: true,
        observations: { include: { technician: true } },
        interventions: { include: { technician: true, outcomes: true } },
        outcomes: true,
      },
    });

    if (!inc) return null;

    return {
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
    };
  }

  static async createIncident(data: {
    machineId: string;
    description: string;
    symptoms: string[];
    measurements?: Record<string, any>;
    severity?: string;
    initialDiagnosis?: string;
  }) {
    const machine = await prisma.machine.findUnique({ where: { id: data.machineId } });
    if (!machine) throw new Error('Machine not found');

    const incidentCount = await prisma.incident.count({ where: { machineId: data.machineId } });
    const incidentNumber = `INC-2026-${machine.assetTag.replace('PUMP-', '')}-${(incidentCount + 1).toString().padStart(2, '0')}`;

    const incident = await prisma.incident.create({
      data: {
        machineId: data.machineId,
        incidentNumber,
        severity: data.severity || 'HIGH',
        description: data.description,
        symptoms: JSON.stringify(data.symptoms || []),
        measurements: JSON.stringify(data.measurements || {}),
        initialDiagnosis: data.initialDiagnosis || null,
        status: 'OPEN',
      },
    });

    // Update machine status and incident count
    await prisma.machine.update({
      where: { id: data.machineId },
      data: {
        status: data.severity === 'CRITICAL' || data.severity === 'HIGH' ? 'CRITICAL' : 'WARNING',
        currentIssue: data.description,
        incidentCount: { increment: 1 },
      },
    });

    // Record Maintenance Event
    await prisma.maintenanceEvent.create({
      data: {
        machineId: data.machineId,
        eventType: 'INCIDENT',
        description: `Incident #${incidentNumber}: ${data.description}`,
        date: new Date(),
        incidentId: incident.id,
      },
    });

    // Retain incident experience in Hindsight Memory
    await HindsightService.retainExperience({
      machineId: data.machineId,
      incidentId: incident.id,
      category: 'INCIDENT_EXPERIENCE',
      content: `${machine.assetTag} reported incident #${incidentNumber}: ${data.description}. Symptoms: ${data.symptoms.join(', ')}. Measurements: ${JSON.stringify(data.measurements || {})}.`,
      source: `Incident #${incidentNumber}`,
    });

    return this.getIncidentById(incident.id);
  }

  static async searchSimilarIncidents(machineId: string, symptoms: string[]) {
    // Search incidents for this machine and across similar pump models
    const targetMachine = await prisma.machine.findUnique({ where: { id: machineId } });
    if (!targetMachine) return [];

    const allIncidents = await prisma.incident.findMany({
      where: {
        machine: { model: targetMachine.model },
      },
      include: {
        machine: true,
        interventions: { include: { outcomes: true, technician: true } },
        outcomes: true,
      },
      orderBy: { reportedAt: 'desc' },
    });

    // Rank by symptom similarity
    return allIncidents
      .map((inc) => {
        const incSymptoms: string[] = JSON.parse(inc.symptoms || '[]');
        const overlap = symptoms.filter((s) =>
          incSymptoms.some((is) => is.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(is.toLowerCase()))
        ).length;

        const primaryIntervention = inc.interventions[0];
        const primaryOutcome = inc.outcomes[0];

        return {
          incidentId: inc.id,
          incidentNumber: inc.incidentNumber,
          machineAssetTag: inc.machine.assetTag,
          machineId: inc.machineId,
          isCurrentMachine: inc.machineId === machineId,
          reportedAt: inc.reportedAt.toISOString(),
          symptoms: incSymptoms,
          measurements: JSON.parse(inc.measurements || '{}'),
          description: inc.description,
          symptomOverlapScore: overlap,
          intervention: primaryIntervention
            ? {
                id: primaryIntervention.id,
                type: primaryIntervention.type,
                description: primaryIntervention.description,
                result: primaryIntervention.result,
                partsUsed: JSON.parse(primaryIntervention.partsUsed || '[]'),
              }
            : null,
          outcome: primaryOutcome
            ? {
                resolved: primaryOutcome.resolved,
                resolutionNotes: primaryOutcome.resolutionNotes,
                timeUntilRecurrence: primaryOutcome.timeUntilRecurrence,
              }
            : null,
        };
      })
      .sort((a, b) => b.symptomOverlapScore - a.symptomOverlapScore);
  }
}
