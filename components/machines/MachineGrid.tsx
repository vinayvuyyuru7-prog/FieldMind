'use client';

import React, { useState } from 'react';
import { Search, Filter, Cpu, ArrowRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { MachineDto } from '@/lib/types';

interface MachineGridProps {
  machines: MachineDto[];
  onSelectMachine: (machineId: string) => void;
}

export const MachineGrid: React.FC<MachineGridProps> = ({ machines, onSelectMachine }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  const filteredMachines = machines.filter((m) => {
    const matchesSearch =
      m.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesLocation = locationFilter === 'ALL' || m.location.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            <span>Industrial Machine Registry</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono">
              {filteredMachines.length} Machines
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Persistent digital history tracked for every machine asset</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search asset tag, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Plants</option>
            <option value="Plant 1">Plant 1</option>
            <option value="Plant 2">Plant 2</option>
            <option value="Plant 3">Plant 3</option>
          </select>
        </div>
      </div>

      {/* Grid of Machines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMachines.map((m) => {
          const isHero = m.assetTag === 'PUMP-042';

          return (
            <div
              key={m.id}
              onClick={() => onSelectMachine(m.id)}
              className={`glass-card p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isHero ? 'border-sky-500/50 bg-slate-900/90 shadow-lg shadow-sky-500/10' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base text-white font-mono">{m.assetTag}</span>
                    {isHero && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        HERO DEMO
                      </span>
                    )}
                  </div>

                  <span
                    className={
                      m.status === 'CRITICAL'
                        ? 'badge-critical'
                        : m.status === 'WARNING'
                        ? 'badge-warning'
                        : m.status === 'OPERATIONAL'
                        ? 'badge-operational'
                        : 'badge-maintenance'
                    }
                  >
                    {m.status}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-slate-300 line-clamp-1">{m.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{m.model} • {m.location}</p>

                {m.currentIssue && (
                  <div className="mt-3 p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 flex items-start space-x-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{m.currentIssue}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">{m.operatingHours.toLocaleString()} hrs</span>
                <span className="text-sky-400 font-semibold flex items-center gap-1 hover:underline">
                  Inspect History
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
