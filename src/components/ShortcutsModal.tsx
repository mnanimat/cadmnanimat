import React from 'react';
import { Keyboard, X, Check } from 'lucide-react';

interface ShortcutsModalProps {
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ onClose, theme = 'dark' }) => {
  const isLight = theme === 'light';

  const shortcuts = [
    { key: 'S', action: 'Ferramenta de Seleção Tridimensional' },
    { key: 'M', action: 'Ferramenta de Mover / Transladar Objeto (XYZ)' },
    { key: 'R', action: 'Ferramenta de Rotação (XYZ)' },
    { key: 'E', action: 'Atalho para Painel de Extrusão 3D' },
    { key: 'Ctrl + Z', action: 'Desfazer Última Ação' },
    { key: 'Ctrl + Y', action: 'Refazer Ação Desfeita' },
    { key: 'Ctrl + S', action: 'Abrir Central de Exportação (STEP / STL)' },
    { key: 'Espaço', action: 'Centralizar Câmera no Modelo 3D' },
    { key: 'Esc', action: 'Cancelar Operação Atual / Limpar Seleção' },
    { key: 'Del / Delete', action: 'Excluir Recurso ou Esboço Selecionado' },
  ];

  return (
    <div className={`w-[480px] p-4 text-xs font-sans select-none space-y-4 ${
      isLight ? 'text-slate-800' : 'text-zinc-200'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Keyboard className="w-4 h-4 text-amber-500" />
          <span>Guia Rápido de Atalhos de Teclado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {shortcuts.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-2 rounded-xl border ${
              isLight 
                ? 'bg-slate-50 border-slate-200 text-slate-800' 
                : 'bg-zinc-900/90 border-zinc-800/80 text-zinc-200'
            }`}
          >
            <span className="font-medium text-[11px]">{item.action}</span>
            <kbd className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold border shadow-sm ${
              isLight 
                ? 'bg-white border-slate-300 text-slate-900' 
                : 'bg-zinc-950 border-zinc-700 text-amber-400'
            }`}>
              {item.key}
            </kbd>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition cursor-pointer"
      >
        Entendi
      </button>
    </div>
  );
};
