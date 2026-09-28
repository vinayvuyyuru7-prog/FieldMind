import { MachineService } from '@/services/machineService';
import { IncidentService } from '@/services/incidentService';
import { InterventionService } from '@/services/interventionService';
import { OutcomeService } from '@/services/outcomeService';
import { TimelineService } from '@/services/timelineService';
import { HindsightService } from '@/services/hindsightService';
import { prisma } from '@/lib/prisma';

export class AgentTools {
  static async searchMachineHistory(machineId: string) {
    const machine = await MachineService.getMachineById(machineId);
    if (!machine) return { error: `Machine ${machineId} not found` };
    return {
      assetTag: machine.assetTag,
      name: machine.name,
      model: machine.model,
      operatingHours: machine.operatingHours,
      status: machine.status,
      currentIssue: machine.currentIssue,
      incidentCount: machine.incidentCount,
      incidents: machine.incidents,
    };
  }

  static async searchSimilarIncidents(machineId: string, symptoms: string[]) {
    return IncidentService.searchSimilarIncidents(machineId, symptoms);
  }

  static async getMaintenanceTimeline(machineId: string) {
    return TimelineService.getMachineTimeline(machineId);
  }

  static async getPartHistory(machineId: string) {
    const replacements = await prisma.replacementHistory.findMany({
      where: { machineId },
      include: { part: true, technician: true },
      orderBy: { replacementDate: 'desc' },
    });
    return replacements.map((r) => ({
      id: r.id,
      partNumber: r.part.partNumber,
      partName: r.part.partName,
      category: r.part.category,
      replacementDate: r.replacementDate.toISOString(),
      technician: r.technician.name,
      outcome: r.outcome,
    }));
  }

  static async getPreviousInterventions(machineId: string) {
    const interventions = await prisma.intervention.findMany({
      where: { machineId },
      include: { technician: true, outcomes: true, incident: true },
      orderBy: { startedAt: 'desc' },
    });

    return interventions.map((inv) => ({
      id: inv.id,
      incidentId: inv.incidentId,
      incidentNumber: inv.incident.incidentNumber,
      symptoms: JSON.parse(inv.incident.symptoms || '[]'),
      type: inv.type,
      description: inv.description,
      partsUsed: JSON.parse(inv.partsUsed || '[]'),
      startedAt: inv.startedAt.toISOString(),
      result: inv.result,
      notes: inv.notes,
      technician: inv.technician.name,
      outcomes: inv.outcomes,
    }));
  }

  static async getInterventionOutcome(interventionId: string) {
    const outcomes = await prisma.outcome.findMany({
      where: { interventionId },
      include: { incident: true, intervention: true },
    });
    return outcomes;
  }

  static async getCurrentMachineState(machineId: string) {
    return MachineService.getMachineById(machineId);
  }

  static async retrieveRelevantMemory(machineId: string, query: string) {
    return HindsightService.recallRelevantMemory({ machineId, query, limit: 5 });
  }

  static async recordIncident(data: any) {
    return IncidentService.createIncident(data);
  }

  static async recordIntervention(data: any) {
    return InterventionService.createIntervention(data);
  }

  static async recordOutcome(data: any) {
    return OutcomeService.createOutcome(data);
  }

  static async storeMaintenanceExperience(data: any) {
    return HindsightService.retainExperience(data);
  }
}
