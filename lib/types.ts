export type MachineStatus = 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'RECURRED';
export type InterventionResult = 'SUCCESSFUL' | 'PARTIALLY_SUCCESSFUL' | 'TEMPORARY_IMPROVEMENT' | 'FAILED' | 'UNKNOWN';
export type MemoryCategory = 'MACHINE_FACT' | 'INCIDENT_EXPERIENCE' | 'TECHNICIAN_OBSERVATION' | 'INTERVENTION_OUTCOME' | 'HISTORICAL_PATTERN';

export interface MachineDto {
  id: string;
  assetTag: string;
  name: string;
  model: string;
  manufacturer: string;
  location: string;
  installationDate: string;
  operatingHours: number;
  status: MachineStatus;
  lastMaintenanceDate?: string | null;
  currentIssue?: string | null;
  incidentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentDto {
  id: string;
  machineId: string;
  incidentNumber: string;
  reportedAt: string;
  severity: IncidentSeverity;
  description: string;
  symptoms: string[];
  measurements: Record<string, any>;
  initialDiagnosis?: string | null;
  status: IncidentStatus;
  resolvedAt?: string | null;
  machine?: MachineDto;
  observations?: ObservationDto[];
  interventions?: InterventionDto[];
  outcomes?: OutcomeDto[];
}

export interface ObservationDto {
  id: string;
  incidentId: string;
  machineId: string;
  technicianId: string;
  observation: string;
  measurement?: number | null;
  unit?: string | null;
  context?: string | null;
  createdAt: string;
  technician?: { name: string; role: string };
}

export interface InterventionDto {
  id: string;
  incidentId: string;
  machineId: string;
  technicianId: string;
  type: string;
  description: string;
  partsUsed: string[];
  startedAt: string;
  completedAt?: string | null;
  result: InterventionResult;
  notes?: string | null;
  createdAt: string;
  technician?: { name: string; role: string };
  outcomes?: OutcomeDto[];
}

export interface OutcomeDto {
  id: string;
  incidentId: string;
  interventionId: string;
  machineId: string;
  resolved: boolean;
  resolutionNotes: string;
  finalDiagnosis: string;
  replacedComponent?: string | null;
  timeUntilRecurrence?: number | null;
  createdAt: string;
}

export interface MemoryItemDto {
  id: string;
  hindsightId?: string | null;
  machineId: string;
  incidentId?: string | null;
  category: MemoryCategory;
  content: string;
  outcomeType?: InterventionResult | null;
  relevanceScore: number;
  source: string;
  createdAt: string;
}

export interface HistoricalEvidenceItem {
  incidentId: string;
  incidentNumber: string;
  date: string;
  symptoms: string[];
  interventionType: string;
  partsUsed: string[];
  result: InterventionResult;
  resolutionNotes: string;
  durationDays?: number | null;
  technicianName?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AgentQueryResult {
  currentSituation: string;
  historicalEvidence: HistoricalEvidenceItem[];
  possibleExplanation: string;
  recommendedNextCheck: string;
  memoriesUsed: MemoryItemDto[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  warnings: string[];
  mode: 'WITH_MEMORY' | 'WITHOUT_MEMORY';
}

export interface DashboardStats {
  totalMachines: number;
  activeIssues: number;
  recurringFailures: number;
  unresolvedIncidents: number;
  recentMaintenanceCount: number;
  heroMachineId: string;
  recentInsights: string[];
}
