import React, { useState } from 'react';
import { Header } from './components/Header';
import { SimulatorView } from './components/SimulatorView';
import { TerminalView } from './components/TerminalView';
import { CodeView } from './components/CodeView';
import { TaxGuideView } from './components/TaxGuideView';
import { SimulationParams } from './utils/finance';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'terminal' | 'code' | 'guide'>('terminal');
  const [terminalParams, setTerminalParams] = useState<SimulationParams | undefined>(undefined);

  const handleOpenTerminalWithParams = (params: SimulationParams) => {
    setTerminalParams(params);
    setActiveTab('terminal');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* 3-Zone Standard Top Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'simulator' && (
          <SimulatorView onOpenTerminalWithParams={handleOpenTerminalWithParams} />
        )}

        {activeTab === 'terminal' && (
          <TerminalView initialParams={terminalParams} />
        )}

        {activeTab === 'code' && (
          <CodeView />
        )}

        {activeTab === 'guide' && (
          <TaxGuideView />
        )}
      </main>

      {/* Quiet, Human Editorial Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Calculadora de CDB Pós-Fixado</span>
            <span aria-hidden="true">·</span>
            <span>Regras ANBIMA, B3 e Lei nº 11.033/2004</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('simulator')}
              className="hover:text-slate-300 transition-colors"
            >
              Simulador
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className="hover:text-slate-300 transition-colors"
            >
              Terminal Python
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-slate-300 transition-colors"
            >
              Código-Fonte
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-slate-300 transition-colors"
            >
              Tributação
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
