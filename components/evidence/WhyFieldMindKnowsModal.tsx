'use client';

import React from 'react';
import { X, ShieldCheck, Calendar, Wrench, CheckCircle2, AlertTriangle, HelpCircle, FileText, Cpu } from 'lucide-react';
import { HistoricalEvidenceItem, MemoryItemDto } from '@/lib/types';

interface WhyFieldMindKnowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineAssetTag: string;
  evidenceItems: HistoricalEvidenceItem[];
  memoriesUsed: MemoryItemDto[];
  possibleExplanation?: string;
}

export const WhyFieldMindKnowsModal: React.FC<WhyFieldMindKnowsModalProps> = ({
  isOpen,
  onClose,
  machineAssetTag,
  evidenceItems,
  memoriesUsed,
  possibleExplanation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>WHY FIELDMIND KNOWS THIS</span>
                <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                  {machineAssetTag}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Traceable evidence chain connecting database records & persistent Hindsight memories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6">
          {/* Explanation Summary */}
          {possibleExplanation && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm leading-relaxed text-slate-300">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Evidence Synthesized Insight</span>
              </div>
              <p>{possibleExplanation}</p>
            </div>
          )}

          {/* Traceable Relational Database Incidents & Interventions */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Historical Incidents & Outcomes ({evidenceItems.length})</span>
            </h4>

            {evidenceItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-lg">
                No recorded historical interventions found in PostgreSQL database for this query.
              </p>
            ) : (
              <div className="space-y-3">
                {evidenceItems.map((item, idx) => {
                  const isSuccess = item.result === 'SUCCESSFUL';
                  const isTemp = item.result === 'TEMPORARY_IMPROVEMENT';

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border text-xs transition-all ${
                        isSuccess
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : isTemp
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/60">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sky-400 font-bold">{item.incidentNumber}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                          {item.technicianName && (
                            <>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-300">Tech: {item.technicianName}</span>
                            </>
                          )}
                        </div>

                        <span
                          className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                            isSuccess
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isTemp
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {item.result.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                            Intervention Attempted
                          </span>
                          <p className="font-medium text-slate-200 mt-0.5">{item.interventionType}</p>
                          {item.partsUsed.length > 0 && (
                            <p className="text-slate-400 text-[11px] mt-1 font-mono">
                              Parts: {item.partsUsed.join(', ')}
                            </p>
                          )}
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                            Documented Outcome
                          </span>
                          <p className="text-slate-300 mt-0.5">{item.resolutionNotes}</p>
                          {item.durationDays && (
                            <p className="text-sky-400 text-[11px] mt-1 font-semibold">
                              Resolution Period: {item.durationDays} days without recurrence
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Persistent Hindsight Memory Retained Items */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>Retained Hindsight Memories ({memoriesUsed.length})</span>
            </h4>

            {memoriesUsed.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-lg">
                No specific Hindsight memory entries retrieved for this search query.
              </p>
            ) : (
              <div className="space-y-2">
                {memoriesUsed.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase">
                        {mem.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Relevance: {Math.round(mem.relevanceScore * 100)}%
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{mem.content}</p>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-900">
                      <span>Source: {mem.source}</span>
                      <span>Retained: {new Date(mem.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close Evidence View
          </button>
        </div>
      </div>
    </div>
  );
};
