import React, { useState } from 'react';
import { Plus, Box, X, FileText, AlertTriangle, Trash2 } from 'lucide-react';

interface BottomTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  onAddTab: () => void;
  onDeleteTab: (tabName: string) => void;
  onOpenDrawingSheet?: () => void;
  theme?: 'dark' | 'light';
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  setActiveTab,
  tabs,
  onAddTab,
  onDeleteTab,
  onOpenDrawingSheet,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [tabToDelete, setTabToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (tabToDelete) {
      onDeleteTab(tabToDelete);
      setTabToDelete(null);
    }
  };

  return (
    <>
      <footer className={`h-9 border-t px-3 flex items-center justify-between text-xs font-sans select-none z-20 shadow-lg transition-colors ${
        isLight
          ? 'bg-white border-slate-300 text-slate-800'
          : 'bg-zinc-950 border-zinc-800 text-zinc-300'
      }`}>
        {/* Abas dos Estúdios de Peças, Montagens e Pranchas Técnicas */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            const isDrawingSheetTab = tab.toLowerCase().includes('prancha') || tab.toLowerCase().includes('desenho');

            return (
              <div
                key={tab}
                className={`group flex items-center gap-1.5 px-3 py-1 font-semibold transition-all duration-150 text-xs rounded-t-lg border-t border-x cursor-pointer ${
                  isActive
                    ? (isLight 
                        ? 'bg-slate-100 text-sky-700 border-sky-400 font-bold shadow-sm' 
                        : 'bg-zinc-900 text-sky-400 border-sky-500/50 shadow-md font-bold')
                    : (isLight
                        ? 'bg-white text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-800'
                        : 'bg-zinc-950 text-zinc-400 border-transparent hover:bg-zinc-900/60 hover:text-zinc-200')
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="flex items-center gap-1.5 focus:outline-none"
                >
                  {isDrawingSheetTab ? (
                    <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                  ) : (
                    <Box className={`w-3.5 h-3.5 ${isActive ? 'text-sky-500' : (isLight ? 'text-slate-400' : 'text-zinc-500')}`} />
                  )}
                  <span>{tab}</span>
                </button>

                {/* Botão de Excluir Página/Aba (com confirmação) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTabToDelete(tab);
                  }}
                  title={`Excluir página "${tab}"`}
                  className={`p-0.5 rounded-md opacity-40 group-hover:opacity-100 hover:bg-rose-500/20 hover:text-rose-400 transition cursor-pointer ml-1 ${
                    isLight ? 'text-slate-500' : 'text-zinc-400'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          <button
            onClick={onAddTab}
            title="Adicionar Novo Estúdio de Peças / Conjunto"
            className={`p-1 rounded-lg transition-all duration-150 ml-1 cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
              isLight
                ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Nova Página</span>
          </button>

          {onOpenDrawingSheet && (
            <button
              onClick={onOpenDrawingSheet}
              title="Gerar Prancha Técnica A4/A3 com Vistas Ortográficas e Isométrica"
              className="p-1 px-2.5 rounded-lg bg-gradient-to-r from-amber-600/20 to-sky-600/20 hover:from-amber-600/40 hover:to-sky-600/40 border border-amber-500/40 text-amber-300 transition-all duration-150 ml-1 cursor-pointer flex items-center gap-1.5 text-[11px] font-bold shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Gerar Prancha A4 / A3</span>
            </button>
          )}
        </div>

        {/* Indicadores do Kernel Gráfico WebGL e Snapping */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono">
          <span className={`flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-full border ${
            isLight
              ? 'text-teal-800 bg-teal-50 border-teal-300'
              : 'text-teal-400 bg-teal-500/10 border-teal-500/30'
          }`}>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            WebGL2 Three.js Kernel
          </span>
          <span className={`px-2 py-0.5 rounded-md border font-bold ${
            isLight
              ? 'bg-slate-100 text-slate-800 border-slate-300'
              : 'bg-zinc-900 text-zinc-300 border-zinc-800'
          }`}>
            SNAP 10mm
          </span>
          <span className={`px-2 py-0.5 rounded-md border font-bold ${
            isLight
              ? 'bg-sky-50 text-sky-800 border-sky-300'
              : 'bg-zinc-900 text-sky-300 border-zinc-800'
          }`}>
            ORTOGRÁFICO
          </span>
          <span className={`font-semibold px-2 py-0.5 rounded-md ${
            isLight
              ? 'bg-slate-200 text-slate-800'
              : 'bg-zinc-800/80 text-zinc-300'
          }`}>
            mm (Milímetros)
          </span>
        </div>
      </footer>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE PÁGINA */}
      {tabToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans select-none animate-in fade-in duration-200">
          <div className={`w-96 rounded-2xl p-5 border shadow-2xl space-y-4 ${
            isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
          }`}>
            <div className="flex items-center gap-3 text-rose-500 border-b pb-3 border-rose-500/20">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6 text-rose-500 animate-bounce" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-rose-500">Confirmar Exclusão de Página</h3>
                <p className="text-[11px] text-zinc-400">Esta ação não poderá ser desfeita.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Tem certeza de que deseja excluir a página <strong className="text-sky-400 font-mono">"{tabToDelete}"</strong>? Os dados e visualizações desta guia serão permanentemente removidos.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setTabToDelete(null)}
                className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Excluir Página</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
