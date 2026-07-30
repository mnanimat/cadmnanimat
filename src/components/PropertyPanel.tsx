import React, { useState } from 'react';
import { CADFeature, ExtrudeParams, RevolveParams, LoftParams, FrameParams, PipeMiterParams, Sketch2D, Point3D } from '../types/cad';
import { PRESET_MATERIALS } from '../utils/cadKernel';
import { Check, Sparkles, Wrench, Move, RotateCw, Maximize } from 'lucide-react';

interface PropertyPanelProps {
  feature?: CADFeature | null;
  sketches: Sketch2D[];
  type: 'extrude' | 'revolve' | 'loft' | 'frame' | 'pipe_miter';
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
  
  // Extrude
  const [depth, setDepth] = useState<number>(
    (feature?.params as ExtrudeParams)?.depth || 40
  );
  const [symmetric, setSymmetric] = useState<boolean>(
    (feature?.params as ExtrudeParams)?.symmetric || false
  );
  
  // Revolve
  const [angle, setAngle] = useState<number>(
    (feature?.params as RevolveParams)?.angle || 360
  );
  
  // Loft
  const [selectedLoftSketches, setSelectedLoftSketches] = useState<string[]>(
    (feature?.params as LoftParams)?.sketchIds || (sketches.slice(0, 2).map(s => s.id))
  );

  // Frame (Chassi Tubular)
  const [frameProfile, setFrameProfile] = useState<'round' | 'square' | 'rectangular'>(
    (feature?.params as FrameParams)?.profile || 'round'
  );
  const [outerDiameter, setOuterDiameter] = useState<number>(
    (feature?.params as FrameParams)?.outerDiameter || 31.75
  );
  const [wallThickness, setWallThickness] = useState<number>(
    (feature?.params as FrameParams)?.wallThickness || 2.0
  );
  const [frameWidth, setFrameWidth] = useState<number>(
    (feature?.params as FrameParams)?.width || 40.0
  );
  const [frameHeight, setFrameHeight] = useState<number>(
    (feature?.params as FrameParams)?.height || 40.0
  );
  const [miterJoints, setMiterJoints] = useState<boolean>(
    (feature?.params as FrameParams)?.miterJoints ?? true
  );

  // Pipe Miter
  const [cutAngle, setCutAngle] = useState<number>(
    (feature?.params as PipeMiterParams)?.cutAngle || 45
  );
  const [miterOffset, setMiterOffset] = useState<number>(
    (feature?.params as PipeMiterParams)?.offset || 0
  );

  // Transformations (X, Y, Z)
  const [position, setPosition] = useState<Point3D>({
    x: feature?.position?.x || 0,
    y: feature?.position?.y || 0,
    z: feature?.position?.z || 0
  });

  const [rotation, setRotation] = useState<Point3D>({
    x: feature?.rotation?.x || 0,
    y: feature?.rotation?.y || 0,
    z: feature?.rotation?.z || 0
  });

  const [scale, setScale] = useState<Point3D>({
    x: feature?.scale?.x ?? 1,
    y: feature?.scale?.y ?? 1,
    z: feature?.scale?.z ?? 1
  });

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
    } else if (type === 'frame') {
      params = {
        sketchId,
        profile: frameProfile,
        outerDiameter: Number(outerDiameter),
        wallThickness: Number(wallThickness),
        width: Number(frameWidth),
        height: Number(frameHeight),
        miterJoints
      } as FrameParams;
    } else if (type === 'pipe_miter') {
      params = {
        cutAngle: Number(cutAngle),
        offset: Number(miterOffset)
      } as PipeMiterParams;
    }

    const mat = PRESET_MATERIALS.find(m => m.id === materialId) || PRESET_MATERIALS[0];

    const updatedFeature: CADFeature = {
      id: feature ? feature.id : `f_${Date.now()}`,
      name: feature ? feature.name : `${type.toUpperCase()} - ${sketches.find(s => s.id === sketchId)?.name || 'Geometria'}`,
      type,
      sketchId,
      params,
      position,
      rotation,
      scale,
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
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h3 className="font-bold text-sm text-sky-400 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-sky-400" />
          <span>{feature ? 'Editar Recurso CAD' : `Novo Recurso: ${type.toUpperCase()}`}</span>
        </h3>
      </div>

      {/* Seleção do Esboço Base */}
      {type !== 'loft' && type !== 'pipe_miter' && (
        <div className="space-y-1.5">
          <label className="text-zinc-400 font-semibold text-[11px] uppercase tracking-wider block">
            Esboço de Origem (Linhas / Percurso):
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

      {/* Frame (Gerador de Tubos de Chassi) */}
      {type === 'frame' && (
        <div className="space-y-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
          <label className="text-sky-300 font-bold text-xs block">Perfil Estrutural do Tubo:</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['round', 'square', 'rectangular'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setFrameProfile(p)}
                className={`py-1.5 px-2 rounded-lg font-semibold text-center border transition-all ${
                  frameProfile === p
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {p === 'round' ? 'Redondo' : p === 'square' ? 'Quadrado' : 'Retangular'}
              </button>
            ))}
          </div>

          {frameProfile === 'round' && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Diâmetro Externo (mm):</label>
                <input
                  type="number"
                  step="0.1"
                  value={outerDiameter}
                  onChange={e => setOuterDiameter(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-sky-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Espessura Parede (mm):</label>
                <input
                  type="number"
                  step="0.1"
                  value={wallThickness}
                  onChange={e => setWallThickness(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-sky-300 font-mono font-bold"
                />
              </div>
            </div>
          )}

          {frameProfile !== 'round' && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Largura (mm):</label>
                <input
                  type="number"
                  value={frameWidth}
                  onChange={e => setFrameWidth(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-sky-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Altura (mm):</label>
                <input
                  type="number"
                  value={frameHeight}
                  onChange={e => setFrameHeight(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-sky-300 font-mono font-bold"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="miter"
              checked={miterJoints}
              onChange={e => setMiterJoints(e.target.checked)}
              className="accent-sky-400 w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="miter" className="text-zinc-300 cursor-pointer font-medium text-xs">
              Junções em Miter a 45° nas Esquinas
            </label>
          </div>
        </div>
      )}

      {/* Pipe Miter (Corte & Junção) */}
      {type === 'pipe_miter' && (
        <div className="space-y-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center font-bold">
            <span className="text-zinc-300">Ângulo de Corte Miter (°):</span>
            <span className="text-teal-400 font-mono text-sm">{cutAngle}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={90}
            value={cutAngle}
            onChange={e => setCutAngle(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
          />
          <div>
            <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Offset do Corte (mm):</label>
            <input
              type="number"
              value={miterOffset}
              onChange={e => setMiterOffset(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-teal-300 font-mono font-bold"
            />
          </div>
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

      {/* Painel de Transformação Numérica (X, Y, Z - Mover, Rotacionar, Escalar) */}
      <div className="space-y-2 bg-zinc-900/70 p-3 rounded-xl border border-zinc-800">
        <label className="text-sky-400 font-bold text-xs flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5" />
          <span>Transformações Tridimensionais (Eixos X, Y, Z)</span>
        </label>
        
        {/* Posição */}
        <div>
          <span className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Posição (mm):</span>
          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <span className="text-red-400 text-[9px] font-mono block">X:</span>
              <input
                type="number"
                value={position.x}
                onChange={e => setPosition({ ...position, x: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-mono text-[11px]"
              />
            </div>
            <div>
              <span className="text-green-400 text-[9px] font-mono block">Y:</span>
              <input
                type="number"
                value={position.y}
                onChange={e => setPosition({ ...position, y: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-mono text-[11px]"
              />
            </div>
            <div>
              <span className="text-blue-400 text-[9px] font-mono block">Z:</span>
              <input
                type="number"
                value={position.z}
                onChange={e => setPosition({ ...position, z: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Rotação */}
        <div>
          <span className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Rotação (Graus °):</span>
          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <span className="text-red-400 text-[9px] font-mono block">RX:</span>
              <input
                type="number"
                value={rotation.x}
                onChange={e => setRotation({ ...rotation, x: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-mono text-[11px]"
              />
            </div>
            <div>
              <span className="text-green-400 text-[9px] font-mono block">RY:</span>
              <input
                type="number"
                value={rotation.y}
                onChange={e => setRotation({ ...rotation, y: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-mono text-[11px]"
              />
            </div>
            <div>
              <span className="text-blue-400 text-[9px] font-mono block">RZ:</span>
              <input
                type="number"
                value={rotation.z}
                onChange={e => setRotation({ ...rotation, z: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Escala */}
        <div>
          <span className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Escala (Fator 1.0 = 100%):</span>
          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <span className="text-red-400 text-[9px] font-mono block">SX:</span>
              <input
                type="number"
                step="0.1"
                value={scale.x}
                onChange={e => setScale({ ...scale, x: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-mono text-[11px]"
              />
            </div>
            <div>
              <span className="text-green-400 text-[9px] font-mono block">SY:</span>
              <input
                type="number"
                step="0.1"
                value={scale.y}
                onChange={e => setScale({ ...scale, y: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-mono text-[11px]"
              />
            </div>
            <div>
              <span className="text-blue-400 text-[9px] font-mono block">SZ:</span>
              <input
                type="number"
                step="0.1"
                value={scale.z}
                onChange={e => setScale({ ...scale, z: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Seleção de Material de Engenharia */}
      <div className="space-y-1.5 pt-2 border-t border-zinc-800">
        <label className="text-zinc-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Material de Engenharia & Acabamento:</span>
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

