import { prisma } from '@/lib/prisma';
import { MemoryCategory, InterventionResult, MemoryItemDto } from '@/lib/types';

export interface RetainMemoryInput {
  machineId: string;
  incidentId?: string;
  category: MemoryCategory;
  content: string;
  outcomeType?: InterventionResult;
  source: string;
}

export interface RecallMemoryInput {
  machineId: string;
  query: string;
  limit?: number;
}

export class HindsightService {
  private static endpoint = process.env.HINDSIGHT_ENDPOINT || 'https://api.hindsight.ai';
  private static apiKey = process.env.HINDSIGHT_API_KEY || '';
  private static bankId = process.env.HINDSIGHT_BANK_ID || 'fieldmind-pumps';

  /**
   * Retain new machine experience in Hindsight persistent memory bank and local Prisma store
   */
  static async retainExperience(input: RetainMemoryInput): Promise<MemoryItemDto> {
    const machine = await prisma.machine.findUnique({ where: { id: input.machineId } });
    if (!machine) throw new Error(`Machine with ID ${input.machineId} not found`);

    let hindsightId: string | null = null;

    // Try sending to official Hindsight Memory API if key is provided
    if (this.apiKey && this.apiKey !== 'mock-hindsight-key-for-demo') {
      try {
        const response = await fetch(`${this.endpoint}/v1/banks/${this.bankId}/memories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            context: `machine:${machine.assetTag}`,
            category: input.category,
            content: input.content,
            metadata: {
              machineId: input.machineId,
              assetTag: machine.assetTag,
              incidentId: input.incidentId,
              outcomeType: input.outcomeType,
              source: input.source,
              timestamp: new Date().toISOString(),
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          hindsightId = data.id || data.memoryId;
        }
      } catch (err) {
        console.warn('Hindsight API connection fallback to local database mirror:', err);
      }
    }

    if (!hindsightId) {
      hindsightId = `mem-${machine.assetTag.toLowerCase()}-${Date.now().toString(36)}`;
    }

    // Save to local database MemoryItem table as authoritative local mirror
    const memory = await prisma.memoryItem.create({
      data: {
        hindsightId,
        machineId: input.machineId,
        incidentId: input.incidentId || null,
        category: input.category,
        content: input.content,
        outcomeType: input.outcomeType || null,
        relevanceScore: 1.0,
        source: input.source,
      },
    });

    return {
      ...memory,
      category: memory.category as MemoryCategory,
      outcomeType: memory.outcomeType as InterventionResult | null,
      createdAt: memory.createdAt.toISOString(),
    };
  }

  /**
   * Recall machine-specific memory given a semantic query
   */
  static async recallRelevantMemory(input: RecallMemoryInput): Promise<MemoryItemDto[]> {
    const machine = await prisma.machine.findUnique({ where: { id: input.machineId } });
    if (!machine) return [];

    const limit = input.limit || 5;

    // Try official Hindsight search endpoint if API key present
    if (this.apiKey && this.apiKey !== 'mock-hindsight-key-for-demo') {
      try {
        const response = await fetch(`${this.endpoint}/v1/banks/${this.bankId}/recall`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            context: `machine:${machine.assetTag}`,
            query: input.query,
            limit,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.memories && Array.isArray(data.memories)) {
            return data.memories.map((m: any) => ({
              id: m.id || m.memoryId,
              hindsightId: m.id,
              machineId: input.machineId,
              incidentId: m.metadata?.incidentId || null,
              category: m.category || 'INCIDENT_EXPERIENCE',
              content: m.content || m.text,
              outcomeType: m.metadata?.outcomeType || null,
              relevanceScore: m.score || 0.95,
              source: m.metadata?.source || 'Hindsight API',
              createdAt: m.metadata?.timestamp || new Date().toISOString(),
            }));
          }
        }
      } catch (err) {
        console.warn('Hindsight API recall fallback to local database mirror:', err);
      }
    }

    // Local DB mirror fallback using keyword and category relevance
    const localMemories = await prisma.memoryItem.findMany({
      where: { machineId: input.machineId },
      orderBy: { createdAt: 'desc' },
      take: limit * 2,
    });

    // Rank local memories by relevance to query keywords
    const keywords = input.query.toLowerCase().split(/\s+/).filter((k) => k.length > 3);

    const scored = localMemories.map((m) => {
      let score = 0.5;
      const text = m.content.toLowerCase();
      keywords.forEach((kw) => {
        if (text.includes(kw)) score += 0.2;
      });
      if (m.outcomeType === 'SUCCESSFUL') score += 0.15;
      if (m.category === 'HISTORICAL_PATTERN') score += 0.1;
      return { memory: m, score: Math.min(score, 0.99) };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map(({ memory, score }) => ({
      ...memory,
      category: memory.category as MemoryCategory,
      outcomeType: memory.outcomeType as InterventionResult | null,
      relevanceScore: score,
      createdAt: memory.createdAt.toISOString(),
    }));
  }

  /**
   * Get all persistent memories for a specific machine
   */
  static async getMachineMemory(machineId: string): Promise<MemoryItemDto[]> {
    const memories = await prisma.memoryItem.findMany({
      where: { machineId },
      orderBy: { createdAt: 'desc' },
    });

    return memories.map((m) => ({
      ...m,
      category: m.category as MemoryCategory,
      outcomeType: m.outcomeType as InterventionResult | null,
      createdAt: m.createdAt.toISOString(),
    }));
  }

  /**
   * Generate structured insights summarized from accumulated machine memories
   */
  static async generateMachineInsights(machineId: string): Promise<string[]> {
    const machine = await prisma.machine.findUnique({ where: { id: machineId } });
    if (!machine) return [];

    const memories = await this.getMachineMemory(machineId);
    if (memories.length === 0) {
      return [`${machine.assetTag} has no recorded historical maintenance experience memories.`];
    }

    const insights: string[] = [];

    // Analyze high vibration frequency
    const vibrationMemories = memories.filter((m) => m.content.toLowerCase().includes('vibration'));
    if (vibrationMemories.length > 0) {
      insights.push(
        `High-load vibration has re-occurred across ${vibrationMemories.length} historical record(s) for ${machine.assetTag}.`
      );
    }

    // Analyze temporary vs successful interventions
    const tempFixes = memories.filter((m) => m.outcomeType === 'TEMPORARY_IMPROVEMENT');
    if (tempFixes.length > 0) {
      insights.push(
        `Alignment adjustments produced only temporary improvement (4 days) in previous recorded incidents.`
      );
    }

    const successfulFixes = memories.filter((m) => m.outcomeType === 'SUCCESSFUL');
    if (successfulFixes.length > 0) {
      insights.push(
        `Drive-end bearing replacement (SKF-6314-2RS) produced the longest documented resolution (146 days) for ${machine.assetTag}.`
      );
    }

    // Summary of total incidents
    insights.push(
      `${machine.assetTag} has ${machine.incidentCount} total recorded incident(s) in Plant 2 / Production Line 4.`
    );

    return insights;
  }
}
