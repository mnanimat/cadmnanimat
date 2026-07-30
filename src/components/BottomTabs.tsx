import React from 'react';
import { Plus, Box, Layers, Cpu } from 'lucide-react';

interface BottomTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  onAddTab: () => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  setActiveTab,
  tabs,
  onAddTab
}) => {
  return (
    <footer className="h-8 bg-zinc-950 border-t border-zinc-800 text-zinc-300 px-3 flex items-center justify-between text-xs font-sans select-none z-20 shadow-lg">
      {/* Abas dos Estúdios de Peças e Montagens */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 font-semibold transition-all duration-150 flex items-center gap-1.5 text-xs rounded-t-lg border-t border-x ${
              activeTab === tab
                ? 'bg-zinc-900 text-sky-400 border-sky-500/50 shadow-md font-bold'
                : 'bg-zinc-950 text-zinc-400 border-transparent hover:bg-zinc-900/60 hover:text-zinc-200'
            }`}
          >
            <Box className={`w-3.5 h-3.5 ${activeTab === tab ? 'text-sky-400' : 'text-zinc-500'}`} />
            <span>{tab}</span>
          </button>
        ))}

        <button
          onClick={onAddTab}
          title="Adicionar Novo Estúdio de Peças / Conjunto"
          className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all duration-150 ml-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Indicadores do Kernel Gráfico WebGL e Snapping */}
      <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-zinc-400">
        <span className="flex items-center gap-1.5 font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          WebGL2 Three.js Kernel
        </span>
        <span className="bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-800">
          SNAP 10mm
        </span>
        <span className="bg-zinc-900 text-sky-300 px-2 py-0.5 rounded-md border border-zinc-800 font-bold">
          ORTOGRÁFICO
        </span>
        <span className="text-zinc-300 font-semibold bg-zinc-800/80 px-2 py-0.5 rounded-md">
          mm (Milímetros)
        </span>
      </div>
    </footer>
  );
};
