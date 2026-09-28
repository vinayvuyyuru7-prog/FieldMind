'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Calendar, Wrench, AlertTriangle, CheckCircle2, Clock, Brain, ArrowLeft, ArrowRight, ShieldCheck, History, RefreshCw, FileText } from 'lucide-react';
import { WhyFieldMindKnowsModal } from '../evidence/WhyFieldMindKnowsModal';

interface MachineDetailViewProps {
  machineId: string;
  onBack: () => void;
  onAskAssistant: (machineId: string, query: string) => void;
}

export const MachineDetailView: React.FC<MachineDetailViewProps> = ({ machineId, onBack, onAskAssistant }) => {
  const [machine, setMachine] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);

  useEffect(() => {
    fetchMachineDetail();
  }, [machineId]);

  const fetchMachineDetail = async () => {
    setLoading(true);
    try {
      const [mRes, tRes, memRes] = await Promise.all([
        fetch(`/api/machines/${machineId}`),
        fetch(`/api/machines/${machineId}/timeline`),
        fetch(`/api/machines/${machineId}/memory`),
      ]);

      if (mRes.ok) {
        const mData = await mRes.json();
        setMachine(mData);
      }
      if (tRes.ok) {
        const tData = await tRes.json();
        setTimeline(tData);
      }
      if (memRes.ok) {
        const memData = await memRes.json();
        setMemories(memData.memories || []);
        setInsights(memData.insights || []);
      }
    } catch (err) {
      console.error('Error fetching machine detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sky-400 text-xs font-mono space-x-3">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Loading machine digital history...</span>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Machine record not found.{' '}
        <button onClick={onBack} className="text-sky-400 underline">
          Return to Registry
        </button>
      </div>
    );
  }

  const isHero = machine.assetTag === 'PUMP-042';

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-extrabold text-white font-mono">{machine.assetTag}</h1>
              {isHero && (
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  HERO DEMO MACHINE
                </span>
              )}
              <span
                className={
                  machine.status === 'CRITICAL'
                    ? 'badge-critical'
                    : machine.status === 'WARNING'
                    ? 'badge-warning'
                    : 'badge-operational'
                }
              >
                {machine.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {machine.name} • {machine.model} • {machine.location}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowEvidenceModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/30 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Why FieldMind Knows This</span>
          </button>

          <button
            onClick={() => onAskAssistant(machine.id, `What is the historical maintenance record of ${machine.assetTag}?`)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition-all"
          >
            <Brain className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Active Problem Alert Card */}
      {machine.currentIssue && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-rose-300 uppercase tracking-wider block text-[10px]">
                CURRENT ACTIVE INCIDENT REPORTED
              </span>
              <p className="text-slate-200 text-xs font-medium mt-0.5">{machine.currentIssue}</p>
            </div>
          </div>

          <button
            onClick={() => onAskAssistant(machine.id, `Have we seen this high vibration problem on ${machine.assetTag} before?`)}
            className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
          >
            Investigate with FieldMind Memory
          </button>
        </div>
      )}

      {/* Quick AI Question Prompts Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-3">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
          Contextual Machine Memory Prompts:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => onAskAssistant(machine.id, `Have we seen this problem before on ${machine.assetTag}?`)}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all text-left font-medium"
          >
            "Have we seen this before?"
          </button>
          <button
            onClick={() => onAskAssistant(machine.id, `What fixed it last time on ${machine.assetTag}?`)}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all text-left font-medium"
          >
            "What fixed it last time?"
          </button>
          <button
            onClick={() => onAskAssistant(machine.id, `What failed previously on ${machine.assetTag}?`)}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all text-left font-medium"
          >
            "What failed previously?"
          </button>
          <button
            onClick={() => onAskAssistant(machine.id, `What have we learned about ${machine.assetTag}?`)}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all text-left font-medium"
          >
            "What have we learned?"
          </button>
        </div>
      </div>

      {/* Grid: Accumulated Memory Insights & Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Incidents & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident History List */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" />
              <span>Incident & Intervention History ({machine.incidents?.length || 0})</span>
            </h3>

            <div className="space-y-3">
              {machine.incidents?.map((inc: any) => (
                <div key={inc.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sky-400 font-bold">{inc.incidentNumber}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{new Date(inc.reportedAt).toLocaleDateString()}</span>
                    </div>

                    <span
                      className={
                        inc.status === 'RESOLVED'
                          ? 'badge-operational'
                          : inc.status === 'RECURRED'
                          ? 'badge-warning'
                          : 'badge-critical'
                      }
                    >
                      {inc.status}
                    </span>
                  </div>

                  <p className="text-slate-200 font-medium">{inc.description}</p>

                  {/* Interventions list for incident */}
                  {inc.interventions && inc.interventions.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Interventions Attempted</span>
                      {inc.interventions.map((inv: any) => {
                        const isSuccess = inv.result === 'SUCCESSFUL';
                        const isTemp = inv.result === 'TEMPORARY_IMPROVEMENT';

                        return (
                          <div
                            key={inv.id}
                            className={`p-3 rounded-lg border text-xs ${
                              isSuccess
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                                : isTemp
                                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span>Action: {inv.type}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 uppercase">
                                {inv.result}
                              </span>
                            </div>
                            <p className="mt-1 text-slate-300">{inv.description}</p>
                            {inv.notes && <p className="text-[11px] text-slate-400 mt-1 italic">"{inv.notes}"</p>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hindsight Machine Memories */}
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-sky-400" />
              <span>Retained Hindsight Memories ({memories.length})</span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {memories.map((mem) => (
                <div key={mem.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase font-bold">
                      {mem.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500">{new Date(mem.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{mem.content}</p>

                  {mem.outcomeType && (
                    <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                      Outcome: <span className="text-sky-300 font-bold">{mem.outcomeType}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why FieldMind Knows Modal */}
      <WhyFieldMindKnowsModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        machineAssetTag={machine.assetTag}
        evidenceItems={machine.incidents.flatMap((inc: any) =>
          inc.interventions.map((inv: any) => ({
            incidentId: inc.id,
            incidentNumber: inc.incidentNumber,
            date: new Date(inv.startedAt).toLocaleDateString(),
            symptoms: inc.symptoms,
            interventionType: inv.type,
            partsUsed: inv.partsUsed,
            result: inv.result,
            resolutionNotes: inv.outcomes?.[0]?.resolutionNotes || inv.notes || `Intervention recorded`,
            durationDays: inv.outcomes?.[0]?.timeUntilRecurrence,
            technicianName: inv.technician?.name,
            confidence: inv.result === 'SUCCESSFUL' ? 'HIGH' : 'MEDIUM',
          }))
        )}
        memoriesUsed={memories}
        possibleExplanation={insights.join(' ')}
      />
    </div>
  );
};
