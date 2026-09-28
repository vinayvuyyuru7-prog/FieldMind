'use client';

import React, { useState, useEffect } from 'react';
import { Database, Calendar, Wrench, AlertTriangle, CheckCircle2, Cpu, Filter, RefreshCw, User } from 'lucide-react';

interface TimelineViewProps {
  machines: any[];
  onSelectMachine: (machineId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ machines, onSelectMachine }) => {
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machines[0]?.id || '');
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedMachineId) {
      fetchTimeline(selectedMachineId);
    }
  }, [selectedMachineId]);

  const fetchTimeline = async (mId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/machines/${mId}/timeline`);
      if (res.ok) {
        const data = await res.json();
        setTimelineEvents(data);
      }
    } catch (err) {
      console.error('Error fetching timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedMachine = machines.find((m) => m.id === selectedMachineId);

  return (
    <div className="space-y-6">
      {/* Header & Machine Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-400" />
            <span>Interactive Maintenance Timeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Chronological maintenance events, interventions, and repair outcomes</p>
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

      {/* Timeline Display */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-sky-400 text-xs font-mono space-x-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading timeline events...</span>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
              {selectedMachine?.assetTag} CHRONOLOGICAL TIMELINE ({timelineEvents.length} Events)
            </span>
            <span className="text-xs text-slate-400 font-mono">Plant Location: {selectedMachine?.location}</span>
          </div>

          <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
            {timelineEvents.map((ev) => {
              const isIncident = ev.eventType === 'INCIDENT';
              const isIntervention = ev.eventType === 'INTERVENTION';
              const isInstallation = ev.eventType === 'INSTALLATION';

              return (
                <div key={ev.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-slate-950 transition-all ${
                      isIncident
                        ? 'border-rose-500 text-rose-400 shadow-rose-500/50 shadow-md'
                        : isIntervention
                        ? 'border-amber-500 text-amber-400 shadow-amber-500/50 shadow-md'
                        : 'border-emerald-500 text-emerald-400'
                    }`}
                  />

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-2 hover:border-slate-700 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                            isIncident
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : isIntervention
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {ev.eventType}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(ev.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {ev.technicianName && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <User className="w-3 h-3 text-slate-500" />
                          {ev.technicianName}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-200 font-medium text-xs leading-relaxed">{ev.description}</p>

                    {/* Extended Details if Incident */}
                    {ev.incidentDetails && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-slate-300">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-sky-400 font-bold">{ev.incidentDetails.incidentNumber}</span>
                          <span className="text-slate-400 font-mono">Status: {ev.incidentDetails.status}</span>
                        </div>

                        {ev.incidentDetails.interventions?.length > 0 && (
                          <div className="text-[11px] space-y-1">
                            <span className="text-slate-500 font-bold block text-[10px] uppercase">Recorded Intervention:</span>
                            {ev.incidentDetails.interventions.map((inv: any) => (
                              <p key={inv.id} className="text-amber-300 font-medium">
                                • {inv.type}: {inv.description} ({inv.result})
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
