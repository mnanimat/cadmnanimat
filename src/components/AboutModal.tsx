import React from 'react';
import { Box, Sparkles, ShieldCheck, Wind, Cpu, Database, Check } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <div className={`w-[520px] p-4 text-xs font-sans select-none space-y-4 ${
      isLight ? 'text-slate-800' : 'text-zinc-200'
    }`}>
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 p-4 rounded-2xl text-white shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-white" />
            <h2 className="text-base font-bold">CADMNAnimat 3D CAD System</h2>
          </div>
          <p className="text-[11px] text-sky-100">
            Plataforma de Engenharia Computacional, Modelagem CAD e Túnel de Vento CFD
          </p>
        </div>
        <span className="bg-white/20 border border-white/30 text-white font-mono font-bold px-2.5 py-1 rounded-xl text-[10px]">
          v1.0.0 Release
        </span>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className={`p-3 rounded-xl border space-y-1 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/90 border-zinc-800'
        }`}>
          <div className="flex items-center gap-1.5 font-bold text-sky-500">
            <Cpu className="w-4 h-4" />
            <span>Kernel Gráfico WebGL2</span>
          </div>
          <p className="text-zinc-400 text-[10px]">
            Renderização em tempo real de malhas paramétricas, gizmo 3D e seções com orçamentos ortográficos.
          </p>
        </div>

        <div className={`p-3 rounded-xl border space-y-1 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/90 border-zinc-800'
        }`}>
          <div className="flex items-center gap-1.5 font-bold text-teal-500">
            <Wind className="w-4 h-4" />
            <span>Simulação CFD 3D</span>
          </div>
          <p className="text-zinc-400 text-[10px]">
            Partículas aerodinâmicas de linhas de corrente, mapas térmicos de pressão e vetores de escoamento.
          </p>
        </div>

        <div className={`p-3 rounded-xl border space-y-1 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/90 border-zinc-800'
        }`}>
          <div className="flex items-center gap-1.5 font-bold text-amber-500">
            <Database className="w-4 h-4" />
            <span>Hardware ISO / ANSI</span>
          </div>
          <p className="text-zinc-400 text-[10px]">
            Biblioteca de componentes parafusos, porcas, rolamentos e perfis com massa calculada.
          </p>
        </div>

        <div className={`p-3 rounded-xl border space-y-1 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/90 border-zinc-800'
        }`}>
          <div className="flex items-center gap-1.5 font-bold text-indigo-500">
            <ShieldCheck className="w-4 h-4" />
            <span>Prototipagem & STEP</span>
          </div>
          <p className="text-zinc-400 text-[10px]">
            Exportação para manufatura aditiva 3D, relatórios FEA e especificações de corte CNC.
          </p>
        </div>
      </div>

      <div className={`p-3 rounded-xl border text-[11px] font-mono text-center space-y-1 ${
        isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
      }`}>
        <p>Desenvolvido para Equipes de Baja SAE, Fórmula SAE e Rocketry Aeroespacial</p>
        <p className="text-sky-500 font-bold">© 2026 CADMNAnimat - Todos os direitos reservados</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold rounded-xl transition cursor-pointer"
      >
        Fechar
      </button>
    </div>
  );
};
