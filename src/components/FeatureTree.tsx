import React, { useState } from 'react';
import { 
  CADProject, 
  CADFeature, 
  Sketch2D, 
  CADPart, 
  PlaneType 
} from '../types/cad';
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Box, 
  PenTool, 
  CircleDot, 
  RotateCw, 
  Combine, 
  Trash2, 
  Folder,
  Sliders,
  Sparkles,
  Wrench,
  Scissors
} from 'lucide-react';

interface FeatureTreeProps {
  project: CADProject;
  activePlane: PlaneType;
  onSelectPlane: (plane: PlaneType) => void;
  onToggleSketchVisibility: (sketchId: string) => void;
  onToggleFeatureVisibility: (featureId: string) => void;
  onDeleteFeature: (featureId: string) => void;
  onEditFeature: (feature: CADFeature) => void;
  onSelectSketchToEdit: (sketch: Sketch2D) => void;
  onSelectPartMaterial: (part: CADPart) => void;
  theme?: 'dark' | 'light';
}

export const FeatureTree: React.FC<FeatureTreeProps> = ({
  project,
  activePlane,
  onSelectPlane,
  onToggleSketchVisibility,
  onToggleFeatureVisibility,
  onDeleteFeature,
  onEditFeature,
  onSelectSketchToEdit,
  onSelectPartMaterial,
  theme = 'dark'
}) => {
  const [openGeomSection, setOpenGeomSection] = useState(true);
  const [openSketchesSection, setOpenSketchesSection] = useState(true);
  const [openFeaturesSection, setOpenFeaturesSection] = useState(true);
  const [openPartsSection, setOpenPartsSection] = useState(true);

  const isLight = theme === 'light';

  return (
    <div className={`w-72 p-2 space-y-2 font-sans text-xs select-none ${
      isLight ? 'text-slate-800' : 'text-zinc-300'
    }`}>
      {/* Seção 1: Referências Geométricas e Planos */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${
        isLight ? 'bg-white border-slate-300' : 'bg-zinc-900/80 border-zinc-800/80'
      }`}>
        <button
          type="button"
          onClick={() => setOpenGeomSection(!openGeomSection)}
          className={`w-full px-3 py-2 flex items-center justify-between text-xs font-semibold border-b transition cursor-pointer ${
            isLight 
              ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' 
              : 'bg-zinc-900 border-zinc-800/60 text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 text-amber-500" />
            <span>Origem & Planos</span>
          </div>
          {openGeomSection ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openGeomSection && (
          <div className="p-1.5 space-y-1 text-xs">
            <div className={`px-2.5 py-1 flex items-center gap-2 font-mono text-[11px] ${
              isLight ? 'text-slate-500' : 'text-zinc-400'
            }`}>
              <CircleDot className="w-3 h-3 text-sky-500" />
              <span>Origem (0, 0, 0)</span>
            </div>

            {(['Top', 'Front', 'Right'] as PlaneType[]).map((plane) => (
              <button
                key={plane}
                type="button"
                onClick={() => onSelectPlane(plane)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all duration-150 cursor-pointer ${
                  activePlane === plane
                    ? (isLight 
                        ? 'bg-sky-100 text-sky-900 font-bold border border-sky-400' 
                        : 'bg-sky-500/15 text-sky-300 font-bold border border-sky-500/40 shadow-sm')
                    : (isLight 
                        ? 'hover:bg-slate-100 text-slate-700' 
                        : 'hover:bg-zinc-800/60 text-zinc-300')
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    plane === 'Top' ? 'bg-sky-500' : plane === 'Front' ? 'bg-teal-500' : 'bg-orange-500'
                  }`} />
                  <span>Plano {plane === 'Top' ? 'Superior' : plane === 'Front' ? 'Frontal' : 'Lateral'}</span>
                </div>
                {activePlane === plane && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono uppercase font-bold ${
                    isLight ? 'bg-sky-200 text-sky-900' : 'bg-sky-500/20 text-sky-300'
                  }`}>
                    Ativo
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Seção 2: Esboços Vetoriais 2D */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${
        isLight ? 'bg-white border-slate-300' : 'bg-zinc-900/80 border-zinc-800/80'
      }`}>
        <button
          type="button"
          onClick={() => setOpenSketchesSection(!openSketchesSection)}
          className={`w-full px-3 py-2 flex items-center justify-between text-xs font-semibold border-b transition cursor-pointer ${
            isLight 
              ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' 
              : 'bg-zinc-900 border-zinc-800/60 text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <PenTool className="w-3.5 h-3.5 text-amber-500" />
            <span>Esboços 2D ({project.sketches.length})</span>
          </div>
          {openSketchesSection ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSketchesSection && (
          <div className="p-1.5 space-y-1 text-xs font-sans">
            {project.sketches.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-slate-400 italic">Nenhum esboço 2D cadastrado.</p>
            ) : (
              project.sketches.map((sketch) => (
                <div
                  key={sketch.id}
                  className={`group px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all border ${
                    isLight 
                      ? 'hover:bg-slate-100 border-transparent hover:border-slate-300 text-slate-800' 
                      : 'hover:bg-zinc-800/80 border-transparent hover:border-zinc-700/50 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <PenTool className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className={`truncate font-bold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>{sketch.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({sketch.plane})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectSketchToEdit(sketch)}
                      title="Editar Esboço Vetorial"
                      className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700/80 text-slate-500 dark:text-zinc-400 hover:text-sky-600 rounded-md transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSketchVisibility(sketch.id)}
                      title="Ocultar/Exibir Esboço"
                      className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700/80 text-slate-500 dark:text-zinc-400 rounded-md transition-colors cursor-pointer"
                    >
                      {sketch.visible ? <Eye className="w-3.5 h-3.5 text-teal-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-300" />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Seção 3: Histórico de Operações Tridimensionais */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${
        isLight ? 'bg-white border-slate-300' : 'bg-zinc-900/80 border-zinc-800/80'
      }`}>
        <button
          type="button"
          onClick={() => setOpenFeaturesSection(!openFeaturesSection)}
          className={`w-full px-3 py-2 flex items-center justify-between text-xs font-semibold border-b transition cursor-pointer ${
            isLight 
              ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' 
              : 'bg-zinc-900 border-zinc-800/60 text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Box className="w-3.5 h-3.5 text-sky-500" />
            <span>Operações 3D ({project.features.length})</span>
          </div>
          {openFeaturesSection ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openFeaturesSection && (
          <div className="p-1.5 space-y-1 text-xs">
            {project.features.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-slate-400 italic">Nenhum recurso gerado.</p>
            ) : (
              project.features.map((feature, idx) => (
                <div
                  key={feature.id}
                  className={`group px-2.5 py-1.5 rounded-lg flex items-center justify-between border transition-all ${
                    isLight 
                      ? 'hover:bg-slate-100 border-transparent hover:border-slate-300 text-slate-800' 
                      : 'hover:bg-zinc-800/80 border-transparent hover:border-zinc-700/50 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono text-slate-400 w-3">{idx + 1}.</span>
                    {feature.type === 'extrude' && <Box className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />}
                    {feature.type === 'revolve' && <RotateCw className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
                    {feature.type === 'loft' && <Combine className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />}
                    {feature.type === 'frame' && <Wrench className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />}
                    {feature.type === 'pipe_miter' && <Scissors className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                    <span className={`truncate font-bold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>{feature.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditFeature(feature)}
                      title="Ajustar Parâmetros"
                      className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700/80 text-slate-500 dark:text-zinc-400 hover:text-sky-600 rounded-md transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleFeatureVisibility(feature.id)}
                      title="Ocultar/Exibir"
                      className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700/80 text-slate-500 dark:text-zinc-400 rounded-md transition-colors cursor-pointer"
                    >
                      {feature.visible ? <Eye className="w-3.5 h-3.5 text-teal-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-300" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteFeature(feature.id)}
                      title="Excluir Operação"
                      className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700/80 text-slate-500 dark:text-zinc-400 hover:text-rose-500 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Seção 4: Estúdio de Peças e Engenharia de Materiais */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${
        isLight ? 'bg-white border-slate-300' : 'bg-zinc-900/80 border-zinc-800/80'
      }`}>
        <button
          type="button"
          onClick={() => setOpenPartsSection(!openPartsSection)}
          className={`w-full px-3 py-2 flex items-center justify-between text-xs font-semibold border-b transition cursor-pointer ${
            isLight 
              ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' 
              : 'bg-zinc-900 border-zinc-800/60 text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Peças & Materiais</span>
          </div>
          {openPartsSection ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openPartsSection && (
          <div className="p-1.5 space-y-1.5 text-xs">
            {project.parts.map((part) => (
              <div
                key={part.id}
                onClick={() => onSelectPartMaterial(part)}
                className={`p-2 rounded-lg border cursor-pointer transition-all flex flex-col gap-1 shadow-sm ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 hover:border-sky-500 hover:bg-sky-50/50' 
                    : 'bg-zinc-900/90 border-zinc-800 hover:border-sky-500/60'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sky-600 dark:text-sky-300">
                  <span>{part.name}</span>
                  <span 
                    className="w-3 h-3 rounded-md border border-slate-300 dark:border-zinc-700 shadow-inner" 
                    style={{ backgroundColor: part.color }} 
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                  <span>{part.material.name}</span>
                  <span className={`px-1.5 py-0.2 rounded-md font-bold ${
                    isLight ? 'bg-teal-100 text-teal-900' : 'bg-zinc-800 text-teal-300'
                  }`}>
                    {part.mass}g
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
