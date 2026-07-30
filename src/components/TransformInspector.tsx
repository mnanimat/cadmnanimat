import React from 'react';
import { CADFeature, CADProject, Point3D, ActiveTool } from '../types/cad';
import { Move, RotateCw, Maximize, RotateCcw, Check, Sparkles, Sliders } from 'lucide-react';

interface TransformInspectorProps {
  project: CADProject;
  selectedFeatureId?: string;
  activeTool: ActiveTool;
  onSelectFeature: (id: string) => void;
  onChangeTool: (tool: ActiveTool) => void;
  onUpdateTransform: (featureId: string, transform: { position?: Point3D; rotation?: Point3D; scale?: Point3D }) => void;
  theme?: 'dark' | 'light';
}

export const TransformInspector: React.FC<TransformInspectorProps> = ({
  project,
  selectedFeatureId,
  activeTool,
  onSelectFeature,
  onChangeTool,
  onUpdateTransform,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  const selectedFeature = project.features.find(f => f.id === selectedFeatureId) || project.features[0];

  if (!selectedFeature) {
    return (
      <div className="p-4 text-xs text-zinc-400 font-sans">
        Nenhum elemento 3D disponível para transformação. Crie um recurso primeiro.
      </div>
    );
  }

  const pos: Point3D = selectedFeature.position || { x: 0, y: 0, z: 0 };
  const rot: Point3D = selectedFeature.rotation || { x: 0, y: 0, z: 0 };
  const scl: Point3D = selectedFeature.scale || { x: 1, y: 1, z: 1 };

  const handlePosChange = (axis: 'x' | 'y' | 'z', val: number) => {
    onUpdateTransform(selectedFeature.id, {
      position: { ...pos, [axis]: isNaN(val) ? 0 : val }
    });
  };

  const handleRotChange = (axis: 'x' | 'y' | 'z', val: number) => {
    onUpdateTransform(selectedFeature.id, {
      rotation: { ...rot, [axis]: isNaN(val) ? 0 : val }
    });
  };

  const handleSclChange = (axis: 'x' | 'y' | 'z', val: number) => {
    onUpdateTransform(selectedFeature.id, {
      scale: { ...scl, [axis]: isNaN(val) ? 1 : val }
    });
  };

  const resetPos = () => {
    onUpdateTransform(selectedFeature.id, { position: { x: 0, y: 0, z: 0 } });
  };

  const resetRot = () => {
    onUpdateTransform(selectedFeature.id, { rotation: { x: 0, y: 0, z: 0 } });
  };

  const resetScl = () => {
    onUpdateTransform(selectedFeature.id, { scale: { x: 1, y: 1, z: 1 } });
  };

  const addRotation = (axis: 'x' | 'y' | 'z', deg: number) => {
    onUpdateTransform(selectedFeature.id, {
      rotation: { ...rot, [axis]: Math.round((rot[axis] + deg) % 360) }
    });
  };

  return (
    <div className={`p-4 pb-8 space-y-4 font-sans text-xs select-none w-80 sm:w-88 ${
      isLight ? 'text-slate-800' : 'text-zinc-200'
    }`}>
      
      {/* Seletor de Elemento 3D Ativo */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between">
          <span>Elemento Selecionado</span>
          <span className="font-mono text-[10px] text-zinc-500">{selectedFeature.id}</span>
        </label>
        <select
          value={selectedFeature.id}
          onChange={(e) => onSelectFeature(e.target.value)}
          className={`w-full p-2 rounded-xl border font-semibold text-xs cursor-pointer ${
            isLight
              ? 'bg-white border-slate-300 text-slate-800 shadow-sm'
              : 'bg-zinc-900 border-zinc-700 text-sky-300'
          }`}
        >
          {project.features.map(f => (
            <option key={f.id} value={f.id}>
              {f.name} ({f.type.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Botões para Chavear Modo de Gizmo em Cena (Mover, Rotacionar, Escalar) */}
      <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
        <button
          onClick={() => onChangeTool('translate')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer ${
            activeTool === 'translate'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <Move className="w-3.5 h-3.5" />
          <span>Mover (M)</span>
        </button>

        <button
          onClick={() => onChangeTool('rotate')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer ${
            activeTool === 'rotate'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Rotacionar (R)</span>
        </button>

        <button
          onClick={() => onChangeTool('scale')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer ${
            activeTool === 'scale'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <Maximize className="w-3.5 h-3.5" />
          <span>Escalar (S)</span>
        </button>
      </div>

      {/* SECÇÃO 1: Posição Exata em milímetros (X, Y, Z) */}
      <div className={`p-3 rounded-xl border space-y-2.5 ${
        isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-900/60 border-zinc-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sky-400 flex items-center gap-1.5 text-[11px]">
            <Move className="w-3.5 h-3.5" />
            Posição Translacional (mm)
          </span>
          <button
            onClick={resetPos}
            title="Zerar Posição [0, 0, 0]"
            className="text-[10px] font-mono text-zinc-400 hover:text-sky-400 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* X */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-red-400 font-mono">X (mm)</span>
            <input
              type="number"
              step="1"
              value={pos.x}
              onChange={e => handlePosChange('x', parseFloat(e.target.value))}
              className="w-full p-1.5 bg-zinc-950 border border-zinc-700 text-center text-red-300 font-mono font-bold rounded-lg focus:border-red-500 focus:outline-none"
            />
          </div>
          {/* Y */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-green-400 font-mono">Y (mm)</span>
            <input
              type="number"
              step="1"
              value={pos.y}
              onChange={e => handlePosChange('y', parseFloat(e.target.value))}
              className="w-full p-1.5 bg-zinc-950 border border-zinc-700 text-center text-green-300 font-mono font-bold rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>
          {/* Z */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-blue-400 font-mono">Z (mm)</span>
            <input
              type="number"
              step="1"
              value={pos.z}
              onChange={e => handlePosChange('z', parseFloat(e.target.value))}
              className="w-full p-1.5 bg-zinc-950 border border-zinc-700 text-center text-blue-300 font-mono font-bold rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECÇÃO 2: Rotação Exata em Graus ° (RX, RY, RZ) */}
      <div className={`p-3 rounded-xl border space-y-2.5 ${
        isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-900/60 border-zinc-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-400 flex items-center gap-1.5 text-[11px]">
            <RotateCw className="w-3.5 h-3.5" />
            Angulação de Rotação (Graus °)
          </span>
          <button
            onClick={resetRot}
            title="Zerar Rotações [0°, 0°, 0°]"
            className="text-[10px] font-mono text-zinc-400 hover:text-amber-400 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* RX */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-400 font-mono">RX (°)</span>
            <input
              type="number"
              step="5"
              value={rot.x}
              onChange={e => handleRotChange('x', parseFloat(e.target.value))}
              className="w-full p-1.5 bg-zinc-950 border border-zinc-700 text-center text-amber-300 font-mono font-bold rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
          {/* RY */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-400 font-mono">RY (°)</span>
            <input
              type="number"
              step="5"
              value={rot.y}
              onChange={e => handleRotChange('y', parseFloat(e.target.value))}
              className="w-full p-1.5 bg-zinc-950 border border-zinc-700 text-center text-amber-300 font-mono font-bold rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
          {/* RZ */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-400 font-mono">RZ (°)</span>
            <input
              type="number"
              step="5"
              value={rot.z}
              onChange={e => handleRotChange('z', parseFloat(e.target.value))}
              className="w-full p-1.5 bg-zinc-950 border border-zinc-700 text-center text-amber-300 font-mono font-bold rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Rotation Buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => addRotation('x', 90)}
            className="flex-1 py-1 px-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-[10px] font-mono text-zinc-300 cursor-pointer"
          >
            +90° X
          </button>
          <button
            onClick={() => addRotation('y', 90)}
            className="flex-1 py-1 px-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-[10px] font-mono text-zinc-300 cursor-pointer"
          >
            +90° Y
          </button>
          <button
            onClick={() => addRotation('z', 90)}
            className="flex-1 py-1 px-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-[10px] font-mono text-zinc-300 cursor-pointer"
          >
            +90° Z
          </button>
        </div>
      </div>

      {/* SECÇÃO 3: Fator de Escala Relativo (SX, SY, SZ) */}
      <div className={`p-3 rounded-xl border space-y-2.5 ${
        isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-900/60 border-zinc-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px]">
            <Maximize className="w-3.5 h-3.5" />
            Fator de Dimensionamento / Escala
          </span>
          <button
            onClick={resetScl}
            title="Restaurar Escala 1.0 (100%)"
            className="text-[10px] font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset (1x)
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* SX */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 font-mono">Escala X</span>
            <input
              type="number"
              step="0.1"
              value={scl.x}
              onChange={e => handleSclChange('x', parseFloat(e.target.value))}
              className="w-full p-1.5 bg-zinc-950 border border-zinc-700 text-center text-emerald-300 font-mono font-bold rounded-lg focus:border-emerald-500 focus:outline-none"
            />
          </div>
          {/* SY */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 font-mono">Escala Y</span>
            <input
              type="number"
              step="0.1"
              value={scl.y}
              onChange={e => handleSclChange('y', parseFloat(e.target.value))}
              className="w-full p-1.5 bg-zinc-950 border border-zinc-700 text-center text-emerald-300 font-mono font-bold rounded-lg focus:border-emerald-500 focus:outline-none"
            />
          </div>
          {/* SZ */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 font-mono">Escala Z</span>
            <input
              type="number"
              step="0.1"
              value={scl.z}
              onChange={e => handleSclChange('z', parseFloat(e.target.value))}
              className="w-full p-1.5 bg-zinc-950 border border-zinc-700 text-center text-emerald-300 font-mono font-bold rounded-lg focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
