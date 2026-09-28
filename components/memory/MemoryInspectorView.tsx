'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Cpu, Search, Filter, ShieldCheck, Sparkles, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { MemoryItemDto, MemoryCategory } from '@/lib/types';

interface MemoryInspectorViewProps {
  machines: any[];
}

export const MemoryInspectorView: React.FC<MemoryInspectorViewProps> = ({ machines }) => {
  const [selectedMachineId, setSelectedMachineId] = useState<string>(
    machines.find((m) => m.assetTag === 'PUMP-042')?.id || machines[0]?.id || ''
  );

  const [memories, setMemories] = useState<MemoryItemDto[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (selectedMachineId) {
      fetchMemories(selectedMachineId);
    }
  }, [selectedMachineId]);

  const fetchMemories = async (mId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/machines/${mId}/memory`);
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
        setInsights(data.insights || []);
      }
    } catch (err) {
      console.error('Error fetching machine memory:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedMachine = machines.find((m) => m.id === selectedMachineId);

  const filteredMemories = memories.filter((m) => {
    const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;
    const matchesQuery =
      searchQuery === '' ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header & Machine Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-sky-400" />
            <span>Machine Memory Inspector</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Persistent experience memories stored in Hindsight for each physical machine</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Select Machine:</span>
          <select
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono flex-1 sm:flex-none"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.assetTag} - {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generated Machine Insights Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-950 border border-sky-500/30 space-y-3">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold font-mono">
          <Sparkles className="w-4 h-4" />
          <span>ACCUMULATED MACHINE INSIGHTS • {selectedMachine?.assetTag}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200">
          {insights.map((ins, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{ins}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Controls & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search retained memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Categories</option>
            <option value="MACHINE_FACT">Machine Facts</option>
            <option value="INCIDENT_EXPERIENCE">Incident Experiences</option>
            <option value="TECHNICIAN_OBSERVATION">Technician Observations</option>
            <option value="INTERVENTION_OUTCOME">Intervention Outcomes</option>
            <option value="HISTORICAL_PATTERN">Historical Patterns</option>
          </select>
        </div>
      </div>

      {/* Memory Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-sky-400 text-xs font-mono space-x-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Retrieving persistent memories from Hindsight bank...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((mem) => {
            const isSuccessful = mem.outcomeType === 'SUCCESSFUL';
            const isTemp = mem.outcomeType === 'TEMPORARY_IMPROVEMENT';

            return (
              <div
                key={mem.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase">
                      {mem.category.replace('_', ' ')}
                    </span>

                    {mem.outcomeType && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          isSuccessful
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isTemp
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {mem.outcomeType}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{mem.content}</p>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Source: {mem.source}</span>
                  <span>Retained: {new Date(mem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
