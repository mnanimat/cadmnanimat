import React, { useState } from 'react';
import { CADFeature, ExtrudeParams, RevolveParams, LoftParams, Sketch2D } from '../types/cad';
import { PRESET_MATERIALS } from '../utils/cadKernel';
import { Check, Sparkles } from 'lucide-react';

interface PropertyPanelProps {
  feature?: CADFeature | null;
  sketches: Sketch2D[];
  type: 'extrude' | 'revolve' | 'loft';
  onSave: (feature: CADFeature) => void;
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  feature,
  sketches,
  type,
  onSave,
  onClose
}) => {
  const [sketchId, setSketchId] = useState<string>(
    feature?.sketchId || (sketches[0] ? sketches[0].id : '')
  );
  const [depth, setDepth] = useState<number>(
    (feature?.params as ExtrudeParams)?.depth || 40
  );
  const [symmetric, setSymmetric] = useState<boolean>(
    (feature?.params as ExtrudeParams)?.symmetric || false
  );
  const [angle, setAngle] = useState<number>(
    (feature?.params as RevolveParams)?.angle || 360
  );
  const [selectedLoftSketches, setSelectedLoftSketches] = useState<string[]>(
    (feature?.params as LoftParams)?.sketchIds || (sketches.slice(0, 2).map(s => s.id))
  );
  const [materialId, setMaterialId] = useState<string>(
    feature?.materialId || PRESET_MATERIALS[0].id
  );
  const [color, setColor] = useState<string>(
    feature?.color || PRESET_MATERIALS[0].color
  );

  const handleSave = () => {
    let params: any = {};
    if (type === 'extrude') {
      params = { sketchId, depth: Number(depth), symmetric, operation: 'add' };
    } else if (type === 'revolve') {
      params = { sketchId, angle: Number(angle), axis: 'y', operation: 'add' };
    } else if (type === 'loft') {
      params = { sketchIds: selectedLoftSketches, guided: true };
    }

    const mat = PRESET_MATERIALS.find(m => m.id === materialId) || PRESET_MATERIALS[0];

    const updatedFeature: CADFeature = {
      id: feature ? feature.id : `f_${Date.now()}`,
      name: feature ? feature.name : `${type.toUpperCase()} - ${sketches.find(s => s.id === sketchId)?.name || 'Geometria'}`,
      type,
      sketchId,
      params,
      visible: true,
      suppressed: false,
      materialId,
      color: color || mat.color
    };

    onSave(updatedFeature);
  };

  const toggleLoftSketch = (id: string) => {
    if (selectedLoftSketches.includes(id)) {
      setSelectedLoftSketches(prev => prev.filter(s => s !== id));
    } else {
      setSelectedLoftSketches(prev => [...prev, id]);
    }
  };

  return (
    <div className="w-96 p-4 space-y-4 text-zinc-200 font-sans text-xs select-none">
      {/* Seleção do Esboço Base */}
      {type !== 'loft' && (
        <div className="space-y-1.5">
          <label className="text-zinc-400 font-semibold text-[11px] uppercase tracking-wider block">
            Esboço 2D de Origem:
          </label>
          <select
            value={sketchId}
            onChange={e => setSketchId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sky-300 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer"
          >
            {sketches.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} (Plano {s.plane} - {s.elements.length} elemento(s))
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Seleção de Múltiplos Esboços para Loft */}
      {type === 'loft' && (
        <div className="space-y-1.5">
          <label className="text-zinc-400 font-semibold text-[11px] uppercase tracking-wider block">
            Selecione os Esboços para Interpolação:
          </label>
          <div className="max-h-40 overflow-y-auto space-y-1.5 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
            {sketches.map(s => {
              const isChecked = selectedLoftSketches.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => toggleLoftSketch(s.id)}
                  className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked 
                      ? 'bg-purple-500/15 border-purple-500/50 text-purple-300 font-bold' 
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800/60'
                  }`}
                >
                  <span>{s.name} (Plano {s.plane})</span>
                  <input type="checkbox" checked={isChecked} readOnly className="accent-purple-500 rounded cursor-pointer" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Profundidade para Extrusão */}
      {type === 'extrude' && (
        <div className="space-y-3 bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800/80">
          <div className="flex justify-between items-center font-bold">
            <span className="text-zinc-300">Profundidade (mm):</span>
            <span className="text-teal-400 font-mono text-sm">{depth} mm</span>
          </div>
          <input
            type="range"
            min={1}
            max={500}
            value={depth}
            onChange={e => setDepth(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={depth}
              onChange={e => setDepth(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-teal-300 font-mono font-bold"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sym"
              checked={symmetric}
              onChange={e => setSymmetric(e.target.checked)}
              className="accent-teal-400 w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="sym" className="text-zinc-300 cursor-pointer font-medium text-xs">
              Extrusão Simétrica Bilateral
            </label>
          </div>
        </div>
      )}

      {/* Ângulo de Revolução */}
      {type === 'revolve' && (
        <div className="space-y-3 bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800/80">
          <div className="flex justify-between items-center font-bold">
            <span className="text-zinc-300">Ângulo de Revolução (°):</span>
            <span className="text-orange-400 font-mono text-sm">{angle}°</span>
          </div>
          <input
            type="range"
            min={10}
            max={360}
            value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            className="w-full accent-orange-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
          />
        </div>
      )}

      {/* Seleção de Material de Engenharia */}
      <div className="space-y-1.5 pt-2 border-t border-zinc-800">
        <label className="text-zinc-400 font-semibold text-[11px] uppercase tracking-wider block flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Material de Engenharia & Acabamento:
        </label>
        <select
          value={materialId}
          onChange={e => {
            setMaterialId(e.target.value);
            const mat = PRESET_MATERIALS.find(m => m.id === e.target.value);
            if (mat) setColor(mat.color);
          }}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-teal-300 font-medium focus:outline-none cursor-pointer"
        >
          {PRESET_MATERIALS.map(m => (
            <option key={m.id} value={m.id}>
              {m.name} (Densidade: {m.density} g/cm³)
            </option>
          ))}
        </select>
      </div>

      {/* Rodapé com Botões Arredondados */}
      <div className="pt-2 border-t border-zinc-800 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition-all active:scale-95 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-sky-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Aplicar Parâmetros</span>
        </button>
      </div>
    </div>
  );
};
