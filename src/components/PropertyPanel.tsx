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
  theme?: 'dark' | 'light';
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  feature,
  sketches,
  type,
  onSave,
  onClose,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

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

  const inputClass = isLight
    ? 'w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50'
    : 'w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sky-300 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50';

  const cardClass = isLight
    ? 'bg-slate-50 p-3.5 rounded-xl border border-slate-300 space-y-3'
    : 'bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800 space-y-3';

  return (
    <div className={`w-80 sm:w-96 p-4 pb-10 space-y-4 font-sans text-xs select-none max-w-full overflow-y-auto max-h-[calc(100vh-140px)] pr-1 scrollbar-thin scrollbar-thumb-zinc-700 ${
      isLight ? 'text-slate-800' : 'text-zinc-200'
    }`}>
      <div className={`flex items-center justify-between border-b pb-2 ${isLight ? 'border-slate-300' : 'border-zinc-800'}`}>
        <h3 className="font-bold text-sm text-sky-600 dark:text-sky-400 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-sky-500" />
          <span>{feature ? 'Editar Recurso CAD' : `Novo Recurso: ${type.toUpperCase()}`}</span>
        </h3>
      </div>

      {/* Seleção do Esboço Base */}
      {type !== 'loft' && type !== 'pipe_miter' && (
        <div className="space-y-1.5">
          <label className={`font-semibold text-[11px] uppercase tracking-wider block ${
            isLight ? 'text-slate-600' : 'text-zinc-400'
          }`}>
            Esboço de Origem (Linhas / Percurso):
          </label>
          <select
            value={sketchId}
            onChange={e => setSketchId(e.target.value)}
            className={inputClass}
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
        <div className={cardClass}>
          <label className="text-sky-600 dark:text-sky-300 font-bold text-xs block">Perfil Estrutural do Tubo:</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['round', 'square', 'rectangular'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setFrameProfile(p)}
                className={`py-1.5 px-2 rounded-lg font-semibold text-center border transition-all cursor-pointer ${
                  frameProfile === p
                    ? 'bg-sky-600 text-white border-sky-500 font-bold shadow-sm'
                    : (isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white')
                }`}
              >
                {p === 'round' ? 'Redondo' : p === 'square' ? 'Quadrado' : 'Retangular'}
              </button>
            ))}
          </div>

          {frameProfile === 'round' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`text-[10px] block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Diâmetro Ext. (mm):</label>
                <input
                  type="number"
                  value={outerDiameter}
                  onChange={e => setOuterDiameter(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`text-[10px] block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Espessura Parede (mm):</label>
                <input
                  type="number"
                  value={wallThickness}
                  onChange={e => setWallThickness(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {(frameProfile === 'square' || frameProfile === 'rectangular') && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`text-[10px] block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Largura (mm):</label>
                <input
                  type="number"
                  value={frameWidth}
                  onChange={e => setFrameWidth(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`text-[10px] block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Altura (mm):</label>
                <input
                  type="number"
                  value={frameHeight}
                  onChange={e => setFrameHeight(Number(e.target.value))}
                  className={inputClass}
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
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <label htmlFor="miter" className={`font-semibold cursor-pointer ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
              Gerar Junções com Corte Esquadria 45°
            </label>
          </div>
        </div>
      )}

      {/* Extrusão */}
      {type === 'extrude' && (
        <div className={cardClass}>
          <div>
            <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Profundidade de Extrusão (mm):</label>
            <input
              type="number"
              value={depth}
              onChange={e => setDepth(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="symm"
              checked={symmetric}
              onChange={e => setSymmetric(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <label htmlFor="symm" className={`font-semibold cursor-pointer ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>Extrusão Simétrica</label>
          </div>
        </div>
      )}

      {/* Revolução */}
      {type === 'revolve' && (
        <div className={cardClass}>
          <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Ângulo de Revolução (Graus °):</label>
          <input
            type="number"
            value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      )}

      {/* Loft */}
      {type === 'loft' && (
        <div className={cardClass}>
          <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Selecione os Perfis de Esboço:</label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {sketches.map(s => {
              const isSelected = selectedLoftSketches.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleLoftSketch(s.id)}
                  className={`w-full p-2 rounded-xl text-left border flex items-center justify-between font-semibold cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                      : (isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white')
                  }`}
                >
                  <span>{s.name} (Plano {s.plane})</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pipe Miter */}
      {type === 'pipe_miter' && (
        <div className={cardClass}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={`text-[10px] block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Ângulo de Corte (°):</label>
              <input
                type="number"
                value={cutAngle}
                onChange={e => setCutAngle(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`text-[10px] block mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Offset Recuo (mm):</label>
              <input
                type="number"
                value={miterOffset}
                onChange={e => setMiterOffset(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* Posição Tridimensional (XYZ) */}
      <div className={cardClass}>
        <div className="flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400">
          <Move className="w-3.5 h-3.5" />
          <span>Posição XYZ (Transladação em mm):</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-sky-500 block font-mono font-bold">X:</label>
            <input
              type="number"
              value={position.x}
              onChange={e => setPosition({ ...position, x: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] text-teal-500 block font-mono font-bold">Y:</label>
            <input
              type="number"
              value={position.y}
              onChange={e => setPosition({ ...position, y: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] text-amber-500 block font-mono font-bold">Z:</label>
            <input
              type="number"
              value={position.z}
              onChange={e => setPosition({ ...position, z: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Rotação Tridimensional */}
      <div className={cardClass}>
        <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
          <RotateCw className="w-3.5 h-3.5" />
          <span>Rotação Tridimensional (Graus °):</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-indigo-500 block font-mono font-bold">Rx:</label>
            <input
              type="number"
              value={rotation.x}
              onChange={e => setRotation({ ...rotation, x: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] text-indigo-500 block font-mono font-bold">Ry:</label>
            <input
              type="number"
              value={rotation.y}
              onChange={e => setRotation({ ...rotation, y: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] text-indigo-500 block font-mono font-bold">Rz:</label>
            <input
              type="number"
              value={rotation.z}
              onChange={e => setRotation({ ...rotation, z: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Engenharia do Material */}
      <div className={cardClass}>
        <label className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Especificação de Material:</label>
        <select
          value={materialId}
          onChange={e => {
            setMaterialId(e.target.value);
            const mat = PRESET_MATERIALS.find(m => m.id === e.target.value);
            if (mat) setColor(mat.color);
          }}
          className={inputClass}
        >
          {PRESET_MATERIALS.map(m => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.density} g/cm³)
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className={`w-1/2 py-2 rounded-xl font-bold transition cursor-pointer ${
            isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="w-1/2 py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
        >
          Salvar Operação
        </button>
      </div>
    </div>
  );
};
