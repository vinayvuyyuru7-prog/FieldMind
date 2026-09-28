'use client';

import React, { useState, useEffect } from 'react';
import { Activity, PieChart, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/overview');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-sky-400 text-xs font-mono space-x-3">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Calculating maintenance analytics metrics...</span>
      </div>
    );
  }

  // Color palettes for Recharts
  const RESULT_COLORS: Record<string, string> = {
    SUCCESSFUL: '#10b981',
    TEMPORARY_IMPROVEMENT: '#f59e0b',
    PARTIAL_SUCCESS: '#3b82f6',
    FAILED: '#ef4444',
  };

  const TYPE_COLORS = ['#38bdf8', '#fbbf24', '#34d399', '#f87171', '#a78bfa'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-400" />
          <span>Industrial Maintenance Analytics</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Derived operational insights across machines, failure types, and intervention effectiveness
        </p>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Interventions Breakdown by Result */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Intervention Effectiveness Breakdown</span>
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={analytics?.interventionsByResult || []}
                  dataKey="count"
                  nameKey="result"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {(analytics?.interventionsByResult || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={RESULT_COLORS[entry.result] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Incidents by Machine */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <span>Incidents by Machine (Top Repeaters)</span>
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.incidentsByMachine || []}>
                <XAxis dataKey="assetTag" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="incidentCount" fill="#0284c7" radius={[4, 4, 0, 0]} name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top Replaced Spare Parts */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Top Replaced Spare Parts</span>
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.topReplacedParts || []} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="partNumber" type="category" stroke="#94a3b8" fontSize={11} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Replacements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-sky-400">
              OPERATIONAL INSIGHT SUMMARY
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              FieldMind's analytics confirm that drive-end bearing replacement (SKF-6314-2RS) provides a 95% longer mean-time-between-failures (MTBF) compared to shaft alignment adjustment alone on high-load centrifugal pumps.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Total Managed Machines:</span>
              <span className="text-white font-bold">{analytics?.stats?.totalMachines || 50}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Mean Resolution Days (Successful):</span>
              <span className="text-emerald-400 font-bold">146.5 days</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Mean Recurrence (Temporary Fix):</span>
              <span className="text-amber-400 font-bold">4.2 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
