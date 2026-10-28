import React from 'react';
import { Download, Terminal, Calculator, FileCode, BookOpen } from 'lucide-react';
import { PYTHON_SCRIPT_CONTENT } from '../utils/finance';

interface HeaderProps {
  activeTab: 'simulator' | 'terminal' | 'code' | 'guide';
  setActiveTab: (tab: 'simulator' | 'terminal' | 'code' | 'guide') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const handleDownloadPy = () => {
    const blob = new Blob([PYTHON_SCRIPT_CONTENT], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calculadora_cdb.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
            %
          </div>
          <span className="text-base font-semibold tracking-tight text-white whitespace-nowrap">
            CDB Pós-Fixado
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'simulator'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Simulador Visual
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'terminal'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Terminal Python
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'code'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Script Python (.py)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'guide'
                ? 'text-emerald-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Regras & Matemática
          </button>
        </nav>

        {/* Zone 3: Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadPy}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-emerald-900/20 active:translate-y-0.5"
            title="Baixar arquivo calculadora_cdb.py"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .py</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-2 bg-slate-900/60 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'simulator' ? 'text-emerald-400 font-semibold bg-emerald-950/40' : 'text-slate-400'
          }`}
        >
          Simulador
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'terminal' ? 'text-emerald-400 font-semibold bg-emerald-950/40' : 'text-slate-400'
          }`}
        >
          Terminal
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'code' ? 'text-emerald-400 font-semibold bg-emerald-950/40' : 'text-slate-400'
          }`}
        >
          Código .py
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'guide' ? 'text-emerald-400 font-semibold bg-emerald-950/40' : 'text-slate-400'
          }`}
        >
          Regras
        </button>
      </div>
    </header>
  );
};
