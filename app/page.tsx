'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { MachineGrid } from '@/components/machines/MachineGrid';
import { MachineDetailView } from '@/components/machines/MachineDetailView';
import { TimelineView } from '@/components/timeline/TimelineView';
import { MemoryInspectorView } from '@/components/memory/MemoryInspectorView';
import { AiAssistantView } from '@/components/agent/AiAssistantView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { FieldMindDemoModal } from '@/components/demo/FieldMindDemoModal';
import { MachineDto, DashboardStats } from '@/lib/types';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);

  const [assistantInitialMachineId, setAssistantInitialMachineId] = useState<string | undefined>(undefined);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string | undefined>(undefined);

  const [machines, setMachines] = useState<MachineDto[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [mRes, sRes] = await Promise.all([
        fetch('/api/machines'),
        fetch('/api/analytics/overview'),
      ]);

      if (mRes.ok) {
        const mData = await mRes.json();
        setMachines(mData);
      }

      if (sRes.ok) {
        const sData = await sRes.json();
        setStats(sData.stats || null);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMachine = (machineId: string) => {
    setSelectedMachineId(machineId);
  };

  const handleOpenAssistant = (machineId: string, query?: string) => {
    setAssistantInitialMachineId(machineId);
    setAssistantInitialQuery(query);
    setActiveTab('assistant');
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      if (res.ok) {
        setToastMessage('Demo baseline state successfully reset for PUMP-042.');
        await fetchInitialData();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error('Error resetting demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'machines' && activeTab !== 'machines') {
            // Keep selected machine if already inspecting
          }
        }}
        onRunDemo={() => setIsDemoModalOpen(true)}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center space-x-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-16 text-sky-400 text-xs font-mono space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
            <span>Initializing FieldMind Industrial System...</span>
          </div>
        ) : (
          <>
            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <DashboardOverview
                stats={stats}
                machines={machines}
                onSelectMachine={(mId) => {
                  setSelectedMachineId(mId);
                  setActiveTab('machines');
                }}
                onOpenAssistant={handleOpenAssistant}
                onRunDemo={() => setIsDemoModalOpen(true)}
              />
            )}

            {/* Machines View */}
            {activeTab === 'machines' && (
              <>
                {selectedMachineId ? (
                  <MachineDetailView
                    machineId={selectedMachineId}
                    onBack={() => setSelectedMachineId(null)}
                    onAskAssistant={handleOpenAssistant}
                  />
                ) : (
                  <MachineGrid machines={machines} onSelectMachine={handleSelectMachine} />
                )}
              </>
            )}

            {/* Interactive Maintenance Timeline View */}
            {activeTab === 'timeline' && (
              <TimelineView machines={machines} onSelectMachine={handleSelectMachine} />
            )}

            {/* Machine Memory Inspector View */}
            {activeTab === 'memory' && <MemoryInspectorView machines={machines} />}

            {/* AI Assistant View */}
            {activeTab === 'assistant' && (
              <AiAssistantView
                machines={machines}
                initialMachineId={assistantInitialMachineId}
                initialQuery={assistantInitialQuery}
              />
            )}

            {/* Maintenance Analytics View */}
            {activeTab === 'analytics' && <AnalyticsView />}
          </>
        )}
      </main>

      {/* Hero Demo Interactive Wizard Modal */}
      <FieldMindDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onReset={handleResetDemo}
      />
    </div>
  );
}
