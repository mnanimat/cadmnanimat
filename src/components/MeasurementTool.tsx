import React from 'react';
import { MeasurementResult, CADProject } from '../types/cad';
import { Calculator, Crosshair, Dot, Maximize2, RotateCcw, Box, Compass, Layers } from 'lucide-react';

interface MeasurementToolProps {
  measurement: MeasurementResult | null;
  project: CADProject;
  snapMode?: 'vertex' | 'edge' | 'face' | 'any';
  onSnapModeChange?: (mode: 'vertex' | 'edge' | 'face' | 'any') => void;
  onClearMeasurement?: () => void;
}

export const MeasurementTool: React.FC<MeasurementToolProps> = ({
  measurement,
  project,
  snapMode = 'any',
  onSnapModeChange,
  onClearMeasurement
}) => {
  const activePart = project.parts[0];

  const distMm = measurement?.distance ?? 0;
  const distCm = Math.round((distMm / 10) * 100) / 100;
  const distM = Math.round((distMm / 1000) * 1000) / 1000;

  return (
    <div className="w-80 p-4 text-zinc-200 font-sans text-xs select-none space-y-3">
      {/* Modo de Atração / Snap Mode Selector */}
      <div className="bg-zinc-900/90 p-2.5 rounded-xl border border-zinc-800 space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
          Modo de Seleção de Pontos:
        </label>
        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => onSnapModeChange?.('any')}
            className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
              snapMode === 'any'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            Livre
          </button>
          <button
            type="button"
            onClick={() => onSnapModeChange?.('vertex')}
            className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
              snapMode === 'vertex'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            Vértices
          </button>
          <button
            type="button"
            onClick={() => onSnapModeChange?.('edge')}
            className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
              snapMode === 'edge'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            Arestas
          </button>
          <button
            type="button"
            onClick={() => onSnapModeChange?.('face')}
            className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
              snapMode === 'face'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            Faces
          </button>
        </div>
      </div>

      {/* Leitura da Distância Ponto a Ponto */}
      {measurement && measurement.p1 && measurement.p2 ? (
        <div className="space-y-2.5 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center text-teal-300 font-bold border-b border-zinc-800 pb-2">
            <span className="text-zinc-400 font-medium text-[11px] uppercase">Distância Direta:</span>
            <div className="text-right">
              <span className="font-mono text-sm bg-teal-500/10 text-teal-300 px-2.5 py-0.5 rounded-lg border border-teal-500/30 block">
                {distMm} mm
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                ({distCm} cm | {distM} m)
              </span>
            </div>
          </div>

          {/* Coordenadas P1 e P2 */}
          <div className="space-y-1 text-[10px] font-mono">
            <div className="flex justify-between bg-zinc-950/80 px-2 py-1 rounded border border-emerald-500/30 text-emerald-400">
              <span className="font-bold">Ponto 1 (P1):</span>
              <span>X:{measurement.p1.x}, Y:{measurement.p1.y}, Z:{measurement.p1.z}</span>
            </div>
            <div className="flex justify-between bg-zinc-950/80 px-2 py-1 rounded border border-cyan-500/30 text-cyan-400">
              <span className="font-bold">Ponto 2 (P2):</span>
              <span>X:{measurement.p2.x}, Y:{measurement.p2.y}, Z:{measurement.p2.z}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="bg-zinc-950 p-2 text-center rounded-lg border border-zinc-800">
              <span className="text-[10px] text-rose-400 font-bold block">ΔX</span>
              <span className="font-mono font-bold text-zinc-200 text-xs">{measurement.dx} mm</span>
            </div>
            <div className="bg-zinc-950 p-2 text-center rounded-lg border border-zinc-800">
              <span className="text-[10px] text-teal-400 font-bold block">ΔY</span>
              <span className="font-mono font-bold text-zinc-200 text-xs">{measurement.dy} mm</span>
            </div>
            <div className="bg-zinc-950 p-2 text-center rounded-lg border border-zinc-800">
              <span className="text-[10px] text-sky-400 font-bold block">ΔZ</span>
              <span className="font-mono font-bold text-zinc-200 text-xs">{measurement.dz} mm</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClearMeasurement}
            className="w-full mt-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Limpar Medição & Medir Novamente</span>
          </button>
        </div>
      ) : (
        <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-amber-400">
            <Crosshair className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Paquímetro Digital Ativo</span>
          </div>
          <p className="text-zinc-400 text-[10px] leading-relaxed">
            Passe o mouse sobre qualquer peça para ver a atração por <strong className="text-emerald-400">Vértices</strong>, <strong className="text-sky-400">Arestas</strong> ou <strong className="text-purple-400">Faces</strong>.
            Clique no ponto inicial e depois no ponto final para realizar a medição.
          </p>
        </div>
      )}

      {/* Propriedades Físicas (Volume e Massa) */}
      {activePart && (
        <div className="pt-2 border-t border-zinc-800 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-sky-400">
            <Calculator className="w-4 h-4 text-sky-400" />
            <span>Propriedades da Peça ({activePart.material.name})</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-medium">Volume Estimado:</span>
              <span className="font-mono font-bold text-zinc-200">{activePart.volume} cm³</span>
            </div>

            <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-medium">Massa Estimada:</span>
              <span className="font-mono font-bold text-teal-300">{activePart.mass} g</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
