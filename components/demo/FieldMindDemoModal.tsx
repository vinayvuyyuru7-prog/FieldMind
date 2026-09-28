'use client';

import React, { useState } from 'react';
import { X, Play, CheckCircle2, ArrowRight, Brain, Cpu, ShieldCheck, Sparkles, RefreshCw, Zap, AlertCircle } from 'lucide-react';
import { WhyFieldMindKnowsModal } from '../evidence/WhyFieldMindKnowsModal';

interface FieldMindDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export const FieldMindDemoModal: React.FC<FieldMindDemoModalProps> = ({ isOpen, onClose, onReset }) => {
  const [step, setStep] = useState<number>(1);
  const [isRetaining, setIsRetaining] = useState<boolean>(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalSteps = 6;

  const handleNextStep = () => {
    if (step === 2) {
      setIsRetaining(true);
      setTimeout(() => {
        setIsRetaining(false);
        setStep(3);
      }, 1200);
    } else if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white">FIELDMIND HERO MEMORY DEMO</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  STEP {step} OF {totalSteps}
                </span>
              </div>
              <p className="text-xs text-slate-400">PUMP-042 • AquaFlow MX-200 • Plant 2 / Production Line 4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-1.5 flex">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-all duration-300 ${
                i + 1 <= step ? 'bg-gradient-to-r from-amber-500 to-sky-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: WITHOUT MEMORY BASELINE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>STEP 1: BEFORE MEMORY • Generic Assistance</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Technician Query: "Why is PUMP-042 vibrating under 85% load?"</h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase font-bold">
                    WITHOUT FIELDMIND MEMORY
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Generic LLM Output</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  "Centrifugal pump vibration under load can be caused by general misalignment, imbalance, worn bearings, impeller cavitation, or loose foundation bolts. Perform a multi-point laser check and verify drive coupling alignment."
                </p>

                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">The Problem: </span>
                    Generic assistance recommends shaft alignment. It does NOT know that shaft alignment was already attempted on PUMP-042 and FAILED after 4 days!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TEACHING FIELDMIND */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                  <Brain className="w-4 h-4" />
                  <span>STEP 2: TEACHING FIELDMIND • Recording Maintenance Experience</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Technician Ravi Patel inputs historical repair outcome for Incident #184</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <span className="text-amber-400 font-bold uppercase tracking-wider block text-[10px]">
                    Attempt #1 (Failed/Temporary)
                  </span>
                  <p className="text-slate-200 font-semibold">Laser Shaft Alignment Adjustment</p>
                  <p className="text-slate-400">Result: TEMPORARY IMPROVEMENT</p>
                  <p className="text-slate-400">Vibration returned after 4 days under 85% load.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2 text-xs">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider block text-[10px]">
                    Attempt #2 (Successful Resolution)
                  </span>
                  <p className="text-slate-200 font-semibold">Drive-End Bearing Replacement (SKF-6314-2RS)</p>
                  <p className="text-emerald-300">Result: SUCCESSFUL (2.1 mm/s)</p>
                  <p className="text-slate-400">Resolved vibration for 146 days of continuous run.</p>
                </div>
              </div>

              {isRetaining && (
                <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center space-x-3 text-sky-300 text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Retaining Machine Experience into Hindsight Persistent Memory...</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: RECALL & FUTURE INCIDENT */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <Zap className="w-4 h-4" />
                  <span>STEP 3: FUTURE SIMULATED INCIDENT • 146 Days Later</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Current Incident: High vibration re-occurs on PUMP-042 under load (7.6 mm/s)</h4>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-400">FIELDMIND MEMORY RECALL INITIATED</span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    HINDSIGHT BANK MATCH FOUND
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg text-xs space-y-2 border border-slate-800">
                  <div className="text-slate-400 text-[11px] font-mono">Retrieved Memory Fragments:</div>
                  <div className="text-slate-200">
                    • <strong className="text-amber-300">Alignment Adjustment:</strong> Temporary 4-day improvement. Root cause returned.
                  </div>
                  <div className="text-slate-200">
                    • <strong className="text-emerald-300">SKF-6314-2RS Bearing Replacement:</strong> Longest documented resolution (146 days).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: WITH MEMORY AI REASONING */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  <Brain className="w-4 h-4" />
                  <span>STEP 4: WITH MEMORY • Evidence-Backed Machine Intelligence</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Technician asks: "Have we seen this vibration problem on PUMP-042 before?"</h4>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">FIELDMIND AI STRUCTURED RESPONSE</span>
                  <button
                    onClick={() => setShowEvidenceModal(true)}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-500/30 transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Why does FieldMind know this?</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px] block">Current Situation</span>
                    <p className="text-slate-200 mt-0.5">PUMP-042 experiencing 7.6 mm/s vibration under 85% operating load.</p>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px] block">Historical Evidence</span>
                    <p className="text-slate-300 mt-0.5">
                      2 similar incidents found for PUMP-042. Previous alignment adjustment yielded only a 4-day temporary improvement. Drive-end bearing replacement with SKF-6314-2RS successfully resolved vibration for 146 days.
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px] block text-emerald-400">
                      Recommended Next Check
                    </span>
                    <p className="text-emerald-300 mt-0.5 font-medium">
                      Inspect drive-end bearing SKF-6314-2RS and verify drive casing thermal expansion. Avoid alignment-only adjustment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: BEFORE / AFTER COMPARISON */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>STEP 5: BEFORE vs AFTER MEMORY VISUAL COMPARISON</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Direct Comparison of AI Value Proposition</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                  <span className="text-xs font-bold text-rose-400 uppercase font-mono block">WITHOUT MEMORY</span>
                  <ul className="text-xs space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>Generic troubleshooting list</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>Repeats failed alignment adjustment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>No knowledge of machine's 146-day operating history</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase font-mono block">WITH FIELDMIND MEMORY</span>
                  <ul className="text-xs space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>Machine-specific evidence reasoning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>Warns against repeating 4-day temporary fix</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>Recommends established SKF-6314-2RS bearing inspection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: WHAT HAVE WE LEARNED? */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                  <Brain className="w-4 h-4" />
                  <span>STEP 6: "WHAT HAVE WE LEARNED ABOUT PUMP-042?"</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Accumulated Institutional Memory Summary</h4>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-mono text-sky-400 font-bold uppercase">FIELDMIND ACCUMULATED INSIGHTS</div>
                <ol className="text-xs space-y-2 text-slate-200 list-decimal list-inside leading-relaxed">
                  <li>High-load vibration has occurred 3 times on PUMP-042 in Plant 2 / Production Line 4.</li>
                  <li>Alignment adjustment alone produces only temporary improvement (4 days).</li>
                  <li>Drive-end bearing replacement (SKF-6314-2RS) produced the longest documented resolution (146 days).</li>
                  <li>Vibration re-occurs specifically when operating load exceeds 80%.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={step === 1}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white disabled:opacity-40 transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center space-x-3">
            {step === totalSteps ? (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all"
              >
                Complete Hero Demo
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Evidence Modal */}
      <WhyFieldMindKnowsModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        machineAssetTag="PUMP-042"
        evidenceItems={[
          {
            incidentId: 'inc-01',
            incidentNumber: 'INC-2026-042-01',
            date: '180 days ago',
            symptoms: ['high vibration'],
            interventionType: 'ALIGNMENT',
            partsUsed: [],
            result: 'TEMPORARY_IMPROVEMENT',
            resolutionNotes: 'Alignment adjustment yielded temporary relief (4 days). Vibration returned.',
            durationDays: 4,
            technicianName: 'Ravi Patel',
            confidence: 'MEDIUM',
          },
          {
            incidentId: 'inc-02',
            incidentNumber: 'INC-2026-042-02',
            date: '150 days ago',
            symptoms: ['high vibration', 'abnormal noise', 'high load'],
            interventionType: 'BEARING_REPLACEMENT',
            partsUsed: ['SKF-6314-2RS'],
            result: 'SUCCESSFUL',
            resolutionNotes: 'Replaced drive-end bearing with SKF-6314-2RS. Vibration reduced to 2.1 mm/s.',
            durationDays: 146,
            technicianName: 'Ravi Patel',
            confidence: 'HIGH',
          },
        ]}
        memoriesUsed={[
          {
            id: 'mem-1',
            machineId: 'm-042',
            category: 'INTERVENTION_OUTCOME',
            content: 'PUMP-042 alignment adjustment yielded TEMPORARY IMPROVEMENT (4 days). Root cause returned.',
            outcomeType: 'TEMPORARY_IMPROVEMENT',
            relevanceScore: 0.98,
            source: 'Incident #INC-2026-042-01',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'mem-2',
            machineId: 'm-042',
            category: 'INTERVENTION_OUTCOME',
            content: 'SKF-6314-2RS bearing replacement produced SUCCESSFUL 146-day resolution.',
            outcomeType: 'SUCCESSFUL',
            relevanceScore: 0.99,
            source: 'Incident #INC-2026-042-02',
            createdAt: new Date().toISOString(),
          },
        ]}
        possibleExplanation="PUMP-042 high-load vibration is driven by drive-end bearing wear. Alignment adjustment alone produces only temporary relief."
      />
    </div>
  );
};
