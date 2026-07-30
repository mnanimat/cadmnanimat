import React from 'react';
import { 
  Box, 
  Layers, 
  RotateCw, 
  Ruler, 
  Download, 
  Grid, 
  Scissors, 
  Combine,
  MousePointer,
  PenTool,
  ChevronDown,
  Move,
  RotateCcw,
  Maximize,
  Pipette,
  Wrench,
  Shield,
  Wind,
  Database
} from 'lucide-react';
import { ActiveTool, DisplayMode, PlaneType } from '../types/cad';

interface ToolbarProps {
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  showPlanes: boolean;
  setShowPlanes: (show: boolean) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  sectionView: boolean;
  setSectionView: (section: boolean) => void;
  activePlane: PlaneType;
  setActivePlane: (plane: PlaneType) => void;
  onOpenNewSketch: () => void;
  onOpenExtrudeModal: () => void;
  onOpenRevolveModal: () => void;
  onOpenLoftModal: () => void;
  onOpenFrameModal: () => void;
  onOpenPipeMiterModal: () => void;
  onOpenExportModal: () => void;
  onOpenCFDModal?: () => void;
  onOpenPartsLibraryModal?: () => void;
  onLoadTemplate: (templateId: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  setActiveTool,
  displayMode,
  setDisplayMode,
  showPlanes,
  setShowPlanes,
  showGrid,
  setShowGrid,
  sectionView,
  setSectionView,
  activePlane,
  setActivePlane,
  onOpenNewSketch,
  onOpenExtrudeModal,
  onOpenRevolveModal,
  onOpenLoftModal,
  onOpenFrameModal,
  onOpenPipeMiterModal,
  onOpenExportModal,
  onOpenCFDModal,
  onOpenPartsLibraryModal,
  onLoadTemplate
}) => {
  return (
    <header className="bg-zinc-950 border-b border-zinc-800/80 text-zinc-200 select-none shadow-lg">
      {/* Menu Superior de Aplicação */}
      <div className="h-9 px-3 bg-zinc-950/90 border-b border-zinc-800/60 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-sky-400 tracking-wider bg-zinc-900/90 px-2.5 py-1 rounded-lg border border-zinc-800 shadow-inner">
            <Box className="w-4 h-4 text-sky-500 animate-pulse" />
            <span className="text-sm font-sans tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent font-bold">
              CADMNAnimat
            </span>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded-md font-mono border border-sky-500/30">
              v3.2
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          <nav className="hidden lg:flex items-center gap-1.5 text-zinc-300 text-xs font-sans">
            {['Arquivo', 'Editar', 'Visualizar', 'Geometria', 'Ferramentas', 'Janela', 'Ajuda'].map((item) => (
              <button 
                key={item} 
                className="px-2.5 py-1 rounded-md hover:bg-zinc-800 hover:text-white transition-all duration-150 cursor-pointer"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Seleção de Modelos / Projetos Exemplo */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400 font-sans font-medium text-[11px] hidden sm:inline">PROJETO MODELO:</span>
          <div className="relative">
            <select
              onChange={(e) => onLoadTemplate(e.target.value)}
              className="bg-zinc-900 border border-zinc-700/80 text-cyan-300 text-xs px-3 py-1 pr-7 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer appearance-none font-medium shadow-sm transition-all"
            >
              <option value="formula_chassis">Chassi Tubular Baja SAE / Formula</option>
              <option value="airplane_wing">Asa de Avião NACA 2412 (Aerofólio)</option>
              <option value="spur_gear">Engrenagem Cilíndrica Z18 (Mecânica)</option>
              <option value="drone_frame">Chassi Drone FPV 5" (Fibra de Carbono)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Ribbon Toolbar com Agrupamentos Arredondados */}
      <div className="p-1.5 bg-zinc-900/90 flex items-center gap-2 overflow-x-auto scrollbar-none">
        
        {/* Agrupamento 1: Seleção e Manipulação Tridimensional (Gizmo) */}
        <div className="flex items-center bg-zinc-950/80 border border-zinc-800 p-1 rounded-xl gap-1 shadow-inner">
          <button
            onClick={() => setActiveTool('select')}
            title="Ferramenta de Seleção Tridimensional"
            className={`px-2.5 py-1.5 flex items-center gap-1 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95 ${
              activeTool === 'select'
                ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/30'
                : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>Seleção</span>
          </button>

          <button
            onClick={() => setActiveTool('translate')}
            title="Mover Objeto nos eixos X, Y e Z"
            className={`px-2.5 py-1.5 flex items-center gap-1 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95 ${
              activeTool === 'translate'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/30'
                : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white'
            }`}
          >
            <Move className="w-3.5 h-3.5 text-sky-400" />
            <span>Mover X,Y,Z</span>
          </button>

          <button
            onClick={() => setActiveTool('rotate')}
            title="Rotacionar Objeto nos eixos X, Y e Z"
            className={`px-2.5 py-1.5 flex items-center gap-1 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95 ${
              activeTool === 'rotate'
                ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/30'
                : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Rotacionar</span>
          </button>

          <button
            onClick={() => setActiveTool('scale')}
            title="Escalar Objeto nos eixos X, Y e Z"
            className={`px-2.5 py-1.5 flex items-center gap-1 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95 ${
              activeTool === 'scale'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/30'
                : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white'
            }`}
          >
            <Maximize className="w-3.5 h-3.5 text-purple-400" />
            <span>Escalar</span>
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'measure' ? 'select' : 'measure')}
            title="Paquímetro Digital & Inspeção"
            className={`px-2.5 py-1.5 flex items-center gap-1 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95 ${
              activeTool === 'measure'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/30'
                : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span>Paquímetro</span>
          </button>
        </div>

        {/* Agrupamento 2: Esboços e Geometria 2D */}
        <div className="flex items-center bg-zinc-950/80 border border-zinc-800 p-1 rounded-xl gap-1.5 shadow-inner">
          <button
            onClick={onOpenNewSketch}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-600/25 transition-all duration-200 active:scale-95"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Esboço 2D/3D</span>
          </button>

          <div className="flex items-center gap-1 px-1 border-l border-zinc-800 pl-2">
            <span className="text-zinc-400 text-[11px] font-medium mr-1">Plano:</span>
            {(['Top', 'Front', 'Right'] as PlaneType[]).map((plane) => (
              <button
                key={plane}
                onClick={() => setActivePlane(plane)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all duration-150 ${
                  activePlane === plane
                    ? 'bg-zinc-800 text-teal-300 font-bold border border-teal-500/50 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {plane === 'Top' ? 'Superior' : plane === 'Front' ? 'Frontal' : 'Lateral'}
              </button>
            ))}
          </div>
        </div>

        {/* Agrupamento 3: Gerador de Chassis, Tubos e Modificadores 3D */}
        <div className="flex items-center bg-zinc-950/80 border border-zinc-800 p-1 rounded-xl gap-1 shadow-inner">
          <button
            onClick={onOpenFrameModal}
            className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm"
            title="Gerar tubos de chassi a partir de linhas de esboço com conexões miter"
          >
            <Wrench className="w-3.5 h-3.5 text-sky-400" />
            <span>Gerador Tubo/Chassi</span>
          </button>

          <button
            onClick={onOpenPipeMiterModal}
            className="px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm"
            title="Ferramenta de corte de tubo e junção miter 45 graus"
          >
            <Scissors className="w-3.5 h-3.5 text-teal-400" />
            <span>Corte & Junção</span>
          </button>

          <button
            onClick={onOpenExtrudeModal}
            className="px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800/90 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all duration-200 active:scale-95"
          >
            <Box className="w-3.5 h-3.5 text-emerald-400" />
            <span>Extrusão</span>
          </button>

          <button
            onClick={onOpenRevolveModal}
            className="px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800/90 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all duration-200 active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5 text-orange-400" />
            <span>Revolução</span>
          </button>

          <button
            onClick={onOpenLoftModal}
            className="px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800/90 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all duration-200 active:scale-95"
          >
            <Combine className="w-3.5 h-3.5 text-purple-400" />
            <span>Loft</span>
          </button>
        </div>

        {/* Agrupamento 3.5: CFD Aerodinâmica & Biblioteca de Peças ISO */}
        <div className="flex items-center bg-zinc-950/80 border border-zinc-800 p-1 rounded-xl gap-1 shadow-inner">
          <button
            onClick={onOpenCFDModal}
            className="px-3 py-1.5 bg-gradient-to-r from-sky-500/20 to-teal-500/20 hover:from-sky-500/30 hover:to-teal-500/30 border border-sky-400/50 text-sky-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm"
            title="Abrir Janela de Simulação Aerodinâmica e Túnel de Vento CFD 3D"
          >
            <Wind className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Simulação CFD</span>
          </button>

          <button
            onClick={onOpenPartsLibraryModal}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/50 text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm"
            title="Biblioteca de Peças Padrão Industrial (Parafusos, Porcas, Rolamentos ISO/DIN)"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Biblioteca ISO/ANSI</span>
          </button>
        </div>

        {/* Agrupamento 4: Visualização e Câmera */}
        <div className="flex items-center bg-zinc-950/80 border border-zinc-800 p-1 rounded-xl gap-1 shadow-inner">
          <button
            onClick={() => setShowPlanes(!showPlanes)}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all duration-150 ${
              showPlanes ? 'bg-zinc-800 text-teal-300 font-semibold' : 'text-zinc-400 hover:bg-zinc-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Planos</span>
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all duration-150 ${
              showGrid ? 'bg-zinc-800 text-teal-300 font-semibold' : 'text-zinc-400 hover:bg-zinc-800/60'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grade</span>
          </button>

          <button
            onClick={() => setSectionView(!sectionView)}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all duration-150 ${
              sectionView ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold' : 'text-zinc-400 hover:bg-zinc-800/60'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-rose-400" />
            <span>Corte 3D</span>
          </button>

          <div className="relative border-l border-zinc-800 pl-1">
            <select
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
              className="bg-zinc-900 border border-zinc-700/70 text-sky-300 text-xs font-medium rounded-lg px-2.5 py-1 pr-6 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="shaded">Sombreado</option>
              <option value="edges">Sombreado + Arestas</option>
              <option value="wireframe">Wireframe</option>
              <option value="xray">Raio-X Seccional</option>
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Botão de Exportação Principal */}
        <div className="ml-auto flex items-center gap-2 pr-1">
          <button
            onClick={onOpenExportModal}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CAD</span>
          </button>
        </div>

      </div>
    </header>
  );
};

