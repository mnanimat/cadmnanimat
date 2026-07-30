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
  Sparkles
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
  onSelectPartMaterial
}) => {
  const [openGeomSection, setOpenGeomSection] = useState(true);
  const [openSketchesSection, setOpenSketchesSection] = useState(true);
  const [openFeaturesSection, setOpenFeaturesSection] = useState(true);
  const [openPartsSection, setOpenPartsSection] = useState(true);

  return (
    <div className="w-72 p-2 space-y-2 text-zinc-300 font-sans text-xs select-none">
      {/* Seção 1: Referências Geométricas e Planos */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setOpenGeomSection(!openGeomSection)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-zinc-200 bg-zinc-900 border-b border-zinc-800/60 hover:bg-zinc-800/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span>Origem & Planos</span>
          </div>
          {openGeomSection ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
        </button>

        {openGeomSection && (
          <div className="p-1.5 space-y-1 text-xs">
            <div className="px-2.5 py-1 flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              <CircleDot className="w-3 h-3 text-sky-400" />
              <span>Origem (0, 0, 0)</span>
            </div>

            {(['Top', 'Front', 'Right'] as PlaneType[]).map((plane) => (
              <button
                key={plane}
                type="button"
                onClick={() => onSelectPlane(plane)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all duration-150 cursor-pointer ${
                  activePlane === plane
                    ? 'bg-sky-500/15 text-sky-300 font-bold border border-sky-500/40 shadow-sm'
                    : 'hover:bg-zinc-800/60 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    plane === 'Top' ? 'bg-sky-400' : plane === 'Front' ? 'bg-teal-400' : 'bg-orange-400'
                  }`} />
                  <span>Plano {plane === 'Top' ? 'Superior' : plane === 'Front' ? 'Frontal' : 'Lateral'}</span>
                </div>
                {activePlane === plane && (
                  <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded-md font-mono uppercase font-bold">
                    Ativo
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Seção 2: Esboços Vetoriais 2D */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setOpenSketchesSection(!openSketchesSection)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-zinc-200 bg-zinc-900 border-b border-zinc-800/60 hover:bg-zinc-800/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <PenTool className="w-3.5 h-3.5 text-amber-400" />
            <span>Esboços 2D ({project.sketches.length})</span>
          </div>
          {openSketchesSection ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
        </button>

        {openSketchesSection && (
          <div className="p-1.5 space-y-1 text-xs font-sans">
            {project.sketches.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-zinc-500 italic">Nenhum esboço 2D cadastrado.</p>
            ) : (
              project.sketches.map((sketch) => (
                <div
                  key={sketch.id}
                  className="group px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/80 flex items-center justify-between text-zinc-300 transition-all border border-transparent hover:border-zinc-700/50"
                >
                  <div className="flex items-center gap-2 truncate">
                    <PenTool className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="truncate font-medium text-zinc-200">{sketch.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">({sketch.plane})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectSketchToEdit(sketch)}
                      title="Editar Esboço Vetorial"
                      className="p-1 hover:bg-zinc-700/80 text-zinc-400 hover:text-sky-300 rounded-md transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSketchVisibility(sketch.id)}
                      title="Ocultar/Exibir Esboço"
                      className="p-1 hover:bg-zinc-700/80 text-zinc-400 hover:text-white rounded-md transition-colors cursor-pointer"
                    >
                      {sketch.visible ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-600" />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Seção 3: Histórico de Operações Tridimensionais */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setOpenFeaturesSection(!openFeaturesSection)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-zinc-200 bg-zinc-900 border-b border-zinc-800/60 hover:bg-zinc-800/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Box className="w-3.5 h-3.5 text-sky-400" />
            <span>Operações 3D ({project.features.length})</span>
          </div>
          {openFeaturesSection ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
        </button>

        {openFeaturesSection && (
          <div className="p-1.5 space-y-1 text-xs">
            {project.features.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-zinc-500 italic">Nenhum recurso gerado.</p>
            ) : (
              project.features.map((feature, idx) => (
                <div
                  key={feature.id}
                  className="group px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/80 flex items-center justify-between text-zinc-300 border border-transparent hover:border-zinc-700/50 transition-all"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono text-zinc-500 w-3">{idx + 1}.</span>
                    {feature.type === 'extrude' && <Box className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />}
                    {feature.type === 'revolve' && <RotateCw className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
                    {feature.type === 'loft' && <Combine className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />}
                    <span className="truncate font-medium text-zinc-200">{feature.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditFeature(feature)}
                      title="Ajustar Parâmetros"
                      className="p-1 hover:bg-zinc-700/80 text-zinc-400 hover:text-sky-300 rounded-md transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleFeatureVisibility(feature.id)}
                      title="Ocultar/Exibir"
                      className="p-1 hover:bg-zinc-700/80 text-zinc-400 hover:text-white rounded-md transition-colors cursor-pointer"
                    >
                      {feature.visible ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteFeature(feature.id)}
                      title="Excluir Operação"
                      className="p-1 hover:bg-zinc-700/80 text-zinc-400 hover:text-rose-400 rounded-md transition-colors cursor-pointer"
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
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setOpenPartsSection(!openPartsSection)}
          className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-zinc-200 bg-zinc-900 border-b border-zinc-800/60 hover:bg-zinc-800/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Peças & Materiais</span>
          </div>
          {openPartsSection ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
        </button>

        {openPartsSection && (
          <div className="p-1.5 space-y-1.5 text-xs">
            {project.parts.map((part) => (
              <div
                key={part.id}
                onClick={() => onSelectPartMaterial(part)}
                className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-sky-500/60 cursor-pointer transition-all flex flex-col gap-1 shadow-sm"
              >
                <div className="flex items-center justify-between font-bold text-sky-300">
                  <span>{part.name}</span>
                  <span 
                    className="w-3 h-3 rounded-md border border-zinc-700 shadow-inner" 
                    style={{ backgroundColor: part.color }} 
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>{part.material.name}</span>
                  <span className="bg-zinc-800 text-teal-300 px-1.5 py-0.2 rounded-md font-bold">
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
