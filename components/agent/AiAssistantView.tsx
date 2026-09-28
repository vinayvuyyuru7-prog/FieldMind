'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Send, ShieldCheck, RefreshCw, AlertTriangle, CheckCircle2, ArrowRight, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { AgentQueryResult, HistoricalEvidenceItem, MemoryItemDto } from '@/lib/types';
import { WhyFieldMindKnowsModal } from '../evidence/WhyFieldMindKnowsModal';

interface AiAssistantViewProps {
  machines: any[];
  initialMachineId?: string;
  initialQuery?: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  machines,
  initialMachineId,
  initialQuery,
}) => {
  const [selectedMachineId, setSelectedMachineId] = useState<string>(
    initialMachineId || machines.find((m) => m.assetTag === 'PUMP-042')?.id || machines[0]?.id || ''
  );

  const [query, setQuery] = useState<string>(initialQuery || 'Have we seen this high vibration problem on PUMP-042 before?');
  const [mode, setMode] = useState<'WITH_MEMORY' | 'WITHOUT_MEMORY'>('WITH_MEMORY');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<AgentQueryResult | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);

  useEffect(() => {
    if (initialMachineId) setSelectedMachineId(initialMachineId);
    if (initialQuery) {
      setQuery(initialQuery);
      handleSendQuery(initialMachineId || selectedMachineId, initialQuery, mode);
    }
  }, [initialMachineId, initialQuery]);

  const handleSendQuery = async (mId = selectedMachineId, q = query, m = mode) => {
    if (!mId || !q.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/agent/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ machineId: mId, query: q, mode: m }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      }
    } catch (err) {
      console.error('Error querying AI assistant:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedMachine = machines.find((m) => m.id === selectedMachineId);

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span>FieldMind AI Assistant</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Evidence-backed decision support grounded in machine experience</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Machine Selector */}
          <select
            value={selectedMachineId}
            onChange={(e) => {
              setSelectedMachineId(e.target.value);
              setResponse(null);
            }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.assetTag} - {m.name}
              </option>
            ))}
          </select>

          {/* Mode Toggle Button */}
          <button
            onClick={() => {
              const newMode = mode === 'WITH_MEMORY' ? 'WITHOUT_MEMORY' : 'WITH_MEMORY';
              setMode(newMode);
              if (response) handleSendQuery(selectedMachineId, query, newMode);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              mode === 'WITH_MEMORY'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {mode === 'WITH_MEMORY' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{mode === 'WITH_MEMORY' ? 'MEMORY ENABLED' : 'WITHOUT MEMORY'}</span>
          </button>
        </div>
      </div>

      {/* Query Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-3">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ask FieldMind about machine symptoms, past repairs, or recommended actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />

          <button
            onClick={() => handleSendQuery()}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/30 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Query Assistant</span>
          </button>
        </div>

        {/* Quick Sample Prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 text-[11px]">Quick Prompts:</span>
          <button
            onClick={() => {
              const q = `Have we seen this high vibration problem on ${selectedMachine?.assetTag} before?`;
              setQuery(q);
              handleSendQuery(selectedMachineId, q, mode);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[11px] text-slate-300 transition-colors"
          >
            "Have we seen this problem before?"
          </button>
          <button
            onClick={() => {
              const q = `What fixed it last time on ${selectedMachine?.assetTag}?`;
              setQuery(q);
              handleSendQuery(selectedMachineId, q, mode);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[11px] text-slate-300 transition-colors"
          >
            "What fixed it last time?"
          </button>
          <button
            onClick={() => {
              const q = `What interventions failed previously on ${selectedMachine?.assetTag}?`;
              setQuery(q);
              handleSendQuery(selectedMachineId, q, mode);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[11px] text-slate-300 transition-colors"
          >
            "What failed previously?"
          </button>
        </div>
      </div>

      {/* Response Card Section */}
      {loading ? (
        <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center space-y-3 text-sky-400 text-xs font-mono">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
          <span>Synthesizing database evidence & recalling Hindsight persistent memory...</span>
        </div>
      ) : response ? (
        <div className="space-y-6">
          {/* Main AI Response Container */}
          <div
            className={`glass-panel p-6 rounded-2xl border space-y-5 transition-all ${
              mode === 'WITH_MEMORY' ? 'border-sky-500/40 bg-slate-900/90' : 'border-rose-500/40 bg-slate-900/90'
            }`}
          >
            {/* Header / Mode Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span
                  className={`font-mono text-xs px-2.5 py-1 rounded-lg font-bold uppercase ${
                    mode === 'WITH_MEMORY'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {mode === 'WITH_MEMORY' ? 'FIELD MIND PERSISTENT MEMORY REASONING' : 'WITHOUT MEMORY MODE'}
                </span>

                <span className="text-xs text-slate-400 font-mono">Confidence: {response.confidence}</span>
              </div>

              {mode === 'WITH_MEMORY' && (
                <button
                  onClick={() => setShowEvidenceModal(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-500/30 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Why does FieldMind know this?</span>
                </button>
              )}
            </div>

            {/* Structured Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* CURRENT SITUATION */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block font-mono">
                  1. Current Machine Situation
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">{response.currentSituation}</p>
              </div>

              {/* HISTORICAL EVIDENCE */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">
                  2. Traceable Historical Evidence
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {response.historicalEvidence.length > 0
                    ? `${response.historicalEvidence.length} related intervention record(s) found in machine history.`
                    : 'No previous similar intervention records in database.'}
                </p>
              </div>

              {/* POSSIBLE EXPLANATION */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 md:col-span-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                  3. Evidence-Backed Reasoning & Explanation
                </span>
                <p className="text-slate-200 leading-relaxed text-xs">{response.possibleExplanation}</p>
              </div>

              {/* RECOMMENDED NEXT CHECK */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5 md:col-span-2">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block font-mono">
                  4. Recommended Action & Inspection Order
                </span>
                <p className="text-emerald-200 font-semibold leading-relaxed text-xs">{response.recommendedNextCheck}</p>
              </div>
            </div>

            {/* Warnings & System Safeguards */}
            {response.warnings.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-slate-500 uppercase text-[10px]">Decision Support Safeguard</div>
                {response.warnings.map((w, idx) => (
                  <p key={idx}>• {w}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Why FieldMind Knows Modal */}
      {selectedMachine && response && (
        <WhyFieldMindKnowsModal
          isOpen={showEvidenceModal}
          onClose={() => setShowEvidenceModal(false)}
          machineAssetTag={selectedMachine.assetTag}
          evidenceItems={response.historicalEvidence}
          memoriesUsed={response.memoriesUsed}
          possibleExplanation={response.possibleExplanation}
        />
      )}
    </div>
  );
};
