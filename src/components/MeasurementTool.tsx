import React from 'react';
import { MeasurementResult, CADProject } from '../types/cad';
import { Calculator, Crosshair } from 'lucide-react';

interface MeasurementToolProps {
  measurement: MeasurementResult | null;
  project: CADProject;
}

export const MeasurementTool: React.FC<MeasurementToolProps> = ({
  measurement,
  project
}) => {
  const activePart = project.parts[0];

  return (
    <div className="w-80 p-4 text-zinc-200 font-sans text-xs select-none">
      {/* Leitura da Distância Ponto a Ponto */}
      {measurement ? (
        <div className="space-y-2 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center text-teal-300 font-bold border-b border-zinc-800 pb-2">
            <span className="text-zinc-400 font-medium text-[11px] uppercase">Distância Direta:</span>
            <span className="font-mono text-sm bg-teal-500/10 text-teal-300 px-2.5 py-0.5 rounded-lg border border-teal-500/30">
              {measurement.distance} mm
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="bg-zinc-950 p-2 text-center rounded-lg border border-zinc-800">
              <span className="text-[10px] text-rose-400 font-bold block">ΔX</span>
              <span className="font-mono font-bold text-zinc-200 text-xs">{measurement.dx}</span>
            </div>
            <div className="bg-zinc-950 p-2 text-center rounded-lg border border-zinc-800">
              <span className="text-[10px] text-teal-400 font-bold block">ΔY</span>
              <span className="font-mono font-bold text-zinc-200 text-xs">{measurement.dy}</span>
            </div>
            <div className="bg-zinc-950 p-2 text-center rounded-lg border border-zinc-800">
              <span className="text-[10px] text-sky-400 font-bold block">ΔZ</span>
              <span className="font-mono font-bold text-zinc-200 text-xs">{measurement.dz}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 text-center mb-3 flex items-center justify-center gap-2">
          <Crosshair className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Clique em 2 pontos na malha 3D para calcular a distância.</span>
        </div>
      )}

      {/* Propriedades Físicas (Volume e Massa) */}
      {activePart && (
        <div className="mt-3 pt-2.5 border-t border-zinc-800 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-sky-400">
            <Calculator className="w-4 h-4 text-sky-400" />
            <span>Massa e Volume ({activePart.material.name})</span>
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
