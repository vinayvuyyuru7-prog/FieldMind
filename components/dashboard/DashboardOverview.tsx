'use client';

import React from 'react';
import { Cpu, AlertTriangle, Activity, Wrench, Brain, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { DashboardStats, MachineDto } from '@/lib/types';

interface DashboardOverviewProps {
  stats: DashboardStats | null;
  machines: MachineDto[];
  onSelectMachine: (machineId: string) => void;
  onOpenAssistant: (machineId: string, query?: string) => void;
  onRunDemo: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  machines,
  onSelectMachine,
  onOpenAssistant,
  onRunDemo,
}) => {
  const heroMachine = machines.find((m) => m.assetTag === 'PUMP-042') || machines[0];
  const criticalMachines = machines.filter((m) => m.status === 'CRITICAL' || m.status === 'WARNING');

  return (
    <div className="space-y-6">
      {/* Hero Banner for Hackathon Demo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-900 border border-sky-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5" />
              <span>PERSISTENT INSTITUTIONAL MEMORY FOR PHYSICAL MACHINES</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Every machine has a history. <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">FieldMind remembers it.</span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              FieldMind integrates structured PostgreSQL maintenance history with persistent Hindsight memory to provide evidence-backed troubleshooting assistance for field maintenance technicians.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onRunDemo}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105"
            >
              <span>RUN HERO DEMO (PUMP-042)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {heroMachine && (
              <button
                onClick={() => onSelectMachine(heroMachine.id)}
                className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-xs border border-slate-700 transition-all"
              >
                Inspect Hero PUMP-042
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Machines</span>
            <span className="text-xl font-bold text-white">{stats ? stats.totalMachines : machines.length}</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Active Issues</span>
            <span className="text-xl font-bold text-rose-400">{stats ? stats.activeIssues : criticalMachines.length}</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Recurring Failures</span>
            <span className="text-xl font-bold text-amber-400">{stats ? stats.recurringFailures : 3}</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Recent Maintenance</span>
            <span className="text-xl font-bold text-emerald-400">14 events</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Hero Machine Spotlight + Recent Hindsight Memory Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hero Machine Spotlight Card */}
        {heroMachine && (
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-sky-500/40 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="badge-critical font-mono font-bold">CRITICAL ATTENTION</span>
                <span className="text-xs text-slate-400 font-mono">HERO MACHINE DEMO</span>
              </div>
              <button
                onClick={() => onSelectMachine(heroMachine.id)}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <span>Full Machine Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-3">
                  <span>{heroMachine.assetTag}</span>
                  <span className="text-xs font-normal text-slate-400">({heroMachine.model})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{heroMachine.location} • {heroMachine.operatingHours.toLocaleString()} operating hours</p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Active Vibration Issue (7.6 mm/s)</span>
              </div>
            </div>

            {/* Quick Context Query Buttons for Hero Machine */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                Ask FieldMind Contextual Memory:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenAssistant(heroMachine.id, 'Have we seen this high vibration problem on PUMP-042 before?')}
                  className="text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 border border-slate-800 hover:border-sky-500/40 transition-all font-medium flex items-center justify-between"
                >
                  <span>"Have we seen this problem before?"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-2" />
                </button>

                <button
                  onClick={() => onOpenAssistant(heroMachine.id, 'What fixed this vibration issue last time on PUMP-042?')}
                  className="text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 border border-slate-800 hover:border-sky-500/40 transition-all font-medium flex items-center justify-between"
                >
                  <span>"What fixed it last time?"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-2" />
                </button>

                <button
                  onClick={() => onOpenAssistant(heroMachine.id, 'What interventions failed previously on PUMP-042?')}
                  className="text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 border border-slate-800 hover:border-sky-500/40 transition-all font-medium flex items-center justify-between"
                >
                  <span>"What failed previously?"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-2" />
                </button>

                <button
                  onClick={() => onOpenAssistant(heroMachine.id, 'What have we learned about PUMP-042?')}
                  className="text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 border border-slate-800 hover:border-sky-500/40 transition-all font-medium flex items-center justify-between"
                >
                  <span>"What have we learned about this machine?"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Hindsight Memory Insights */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Brain className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Hindsight Insights</h3>
          </div>

          <div className="space-y-3">
            {stats && stats.recentInsights.length > 0 ? (
              stats.recentInsights.map((insight, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold">RECALLED MEMORY</span>
                    <span className="text-[10px] text-slate-500">Live Hindsight</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{insight}</p>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                PUMP-042: Drive-end bearing replacement (SKF-6314-2RS) produced 146-day resolution. Alignment adjustment was temporary (4 days).
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
