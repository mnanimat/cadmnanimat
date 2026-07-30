import React, { useState } from 'react';
import { 
  CADProject, 
  ActiveTool, 
  DisplayMode, 
  PlaneType, 
  Sketch2D, 
  CADFeature, 
  MeasurementResult
} from './types/cad';
import { UserSession, RocketConfig, VehicleConfig } from './types/engineering';
import { CAD_TEMPLATES } from './data/cadTemplates';
import { Toolbar } from './components/Toolbar';
import { FeatureTree } from './components/FeatureTree';
import { CADViewport } from './components/CADViewport';
import { SketchCanvas } from './components/SketchCanvas';
import { PropertyPanel } from './components/PropertyPanel';
import { MeasurementTool } from './components/MeasurementTool';
import { ExportModal } from './components/ExportModal';
import { BottomTabs } from './components/BottomTabs';
import { DraggableWindow } from './components/DraggableWindow';
import { LoginModal } from './components/LoginModal';
import { ModeSelectorModal } from './components/ModeSelectorModal';
import { TeamManagementModal } from './components/TeamManagementModal';
import { Layers, Ruler, Sliders, Download, Maximize2, Minimize2, Move, Box, Users, Compass, Rocket, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  // Authentication & Engineering Modes State
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [showModeSelector, setShowModeSelector] = useState<boolean>(false);
  const [showTeamManagement, setShowTeamManagement] = useState<boolean>(false);
  const [activeEngineeringTitle, setActiveEngineeringTitle] = useState<string>('Foguete Experimental (3km Apogeu)');

  const [project, setProject] = useState<CADProject>(CAD_TEMPLATES[0]); // Starts with Rocket template
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('edges');
  const [showPlanes, setShowPlanes] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [sectionView, setSectionView] = useState<boolean>(false);
  const [activePlane, setActivePlane] = useState<PlaneType>('Top');

  // Canvas Mode: 'fullscreen' | 'windowed' | 'minimized'
  const [canvasMode, setCanvasMode] = useState<'fullscreen' | 'windowed' | 'minimized'>('fullscreen');

  // Multi-document / Part Studio tabs
  const [tabs, setTabs] = useState<string[]>(['Estúdio Principal 3D', 'Análise de Materiais & Propulsão']);
  const [activeTab, setActiveTab] = useState<string>('Estúdio Principal 3D');

  // Modals & Panels State
  const [isSketching, setIsSketching] = useState<boolean>(false);
  const [editingSketch, setEditingSketch] = useState<Sketch2D | null>(null);
  
  const [propertyModalType, setPropertyModalType] = useState<'extrude' | 'revolve' | 'loft' | null>(null);
  const [editingFeature, setEditingFeature] = useState<CADFeature | null>(null);

  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [measurementResult, setMeasurementResult] = useState<MeasurementResult | null>(null);
  const [showFeatureTree, setShowFeatureTree] = useState<boolean>(true);

  // Focus Z-index management
  const [focusedWindow, setFocusedWindow] = useState<string>('tree');

  // Login handler
  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    setShowModeSelector(true); // Right after login, present the work mode selector window
  };

  // Rocket mode handler
  const handleSelectRocketMode = (config: RocketConfig) => {
    const rocketTemplate = CAD_TEMPLATES.find(t => t.id === 'rocket_3km') || CAD_TEMPLATES[0];
    const customizedProject: CADProject = JSON.parse(JSON.stringify(rocketTemplate));
    customizedProject.name = `Foguete (${config.apogeeTarget} Apogeu) - ${config.fuelType}`;
    
    setProject(customizedProject);
    setActiveEngineeringTitle(`Foguete Aeroespacial (${config.apogeeTarget} Apogeu - ${config.propulsionType.toUpperCase()})`);
    setShowModeSelector(false);
  };

  // Vehicle mode handler
  const handleSelectVehicleMode = (config: VehicleConfig) => {
    let templateId = 'formula_chassis';
    if (config.domain === 'aerodesign' || config.domain === 'custom') templateId = 'airplane_wing';
    if (config.domain === 'drone') templateId = 'drone_frame';

    const tmpl = CAD_TEMPLATES.find(t => t.id === templateId) || CAD_TEMPLATES[1] || CAD_TEMPLATES[0];
    const customizedProject: CADProject = JSON.parse(JSON.stringify(tmpl));
    customizedProject.name = `${config.title} [${config.powertrain.toUpperCase()}]`;

    setProject(customizedProject);
    setActiveEngineeringTitle(`${config.title} (${config.powertrain})`);
    setShowModeSelector(false);
  };

  // Load Preset Template
  const handleLoadTemplate = (templateId: string) => {
    const tmpl = CAD_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setProject(JSON.parse(JSON.stringify(tmpl)));
    }
  };

  // Open Sketch Canvas Mode
  const handleOpenNewSketch = () => {
    const newSketch: Sketch2D = {
      id: `sk_${Date.now()}`,
      name: `Sketch ${project.sketches.length + 1}`,
      plane: activePlane,
      planeOffset: 0,
      elements: [],
      visible: true,
      suppressed: false
    };
    setEditingSketch(newSketch);
    setIsSketching(true);
  };

  const handleEditExistingSketch = (sketch: Sketch2D) => {
    setEditingSketch(sketch);
    setIsSketching(true);
  };

  const handleSaveSketch = (updatedSketch: Sketch2D) => {
    setProject(prev => {
      const exists = prev.sketches.some(s => s.id === updatedSketch.id);
      let updatedSketches = [];
      if (exists) {
        updatedSketches = prev.sketches.map(s => s.id === updatedSketch.id ? updatedSketch : s);
      } else {
        updatedSketches = [...prev.sketches, updatedSketch];
      }
      return {
        ...prev,
        sketches: updatedSketches
      };
    });
    setIsSketching(false);
    setEditingSketch(null);
  };

  // Feature History Mutations
  const handleSaveFeature = (savedFeature: CADFeature) => {
    setProject(prev => {
      const exists = prev.features.some(f => f.id === savedFeature.id);
      let updatedFeatures = [];
      if (exists) {
        updatedFeatures = prev.features.map(f => f.id === savedFeature.id ? savedFeature : f);
      } else {
        updatedFeatures = [...prev.features, savedFeature];
      }
      return {
        ...prev,
        features: updatedFeatures
      };
    });
    setPropertyModalType(null);
    setEditingFeature(null);
  };

  const handleDeleteFeature = (featureId: string) => {
    setProject(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== featureId)
    }));
  };

  const handleToggleFeatureVisibility = (featureId: string) => {
    setProject(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === featureId ? { ...f, visible: !f.visible } : f)
    }));
  };

  const handleToggleSketchVisibility = (sketchId: string) => {
    setProject(prev => ({
      ...prev,
      sketches: prev.sketches.map(s => s.id === sketchId ? { ...s, visible: !s.visible } : s)
    }));
  };

  const handleAddTab = () => {
    const newName = `Estúdio ${tabs.length + 1}`;
    setTabs(prev => [...prev, newName]);
    setActiveTab(newName);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#1e1e1e] font-sans text-[#cccccc] overflow-hidden select-none">
      
      {/* 1. INITIAL LOGIN MODAL (Terms & Privacy) */}
      {!userSession && (
        <LoginModal onLoginSuccess={handleLoginSuccess} />
      )}

      {/* 2. WORK MODE SELECTOR MODAL */}
      {userSession && showModeSelector && (
        <ModeSelectorModal
          onSelectRocketMode={handleSelectRocketMode}
          onSelectVehicleMode={handleSelectVehicleMode}
          onClose={() => setShowModeSelector(false)}
        />
      )}

      {/* Top Ribbon Toolbar */}
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        showPlanes={showPlanes}
        setShowPlanes={setShowPlanes}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        sectionView={sectionView}
        setSectionView={setSectionView}
        activePlane={activePlane}
        setActivePlane={setActivePlane}
        onOpenNewSketch={handleOpenNewSketch}
        onOpenExtrudeModal={() => { setEditingFeature(null); setPropertyModalType('extrude'); setFocusedWindow('property'); }}
        onOpenRevolveModal={() => { setEditingFeature(null); setPropertyModalType('revolve'); setFocusedWindow('property'); }}
        onOpenLoftModal={() => { setEditingFeature(null); setPropertyModalType('loft'); setFocusedWindow('property'); }}
        onOpenExportModal={() => { setShowExportModal(true); setFocusedWindow('export'); }}
        onLoadTemplate={handleLoadTemplate}
      />

      {/* Secondary Quick Action Bar for Engineering Mode & Team Management */}
      {userSession && (
        <div className="bg-zinc-950 px-4 py-1.5 border-b border-zinc-800/80 flex items-center justify-between text-xs">
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowModeSelector(true)}
              className="px-3 py-1 bg-gradient-to-r from-sky-500/20 to-teal-500/20 hover:from-sky-500/30 hover:to-teal-500/30 border border-sky-500/40 text-sky-200 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Modo de Engenharia:</span>
              <span className="text-white font-mono">{activeEngineeringTitle}</span>
            </button>

            <button
              type="button"
              onClick={() => { setShowTeamManagement(true); setFocusedWindow('team'); }}
              className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-teal-300 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition"
            >
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>Equipe, Gastos & Materiais</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 bg-zinc-900 px-2.5 py-0.5 rounded-lg border border-zinc-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userSession.name}</span>
              <span className="text-zinc-500">• {userSession.organization}</span>
            </span>
          </div>

        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 relative w-full h-full overflow-hidden bg-zinc-950">
        {/* Fullscreen 3D CAD Canvas Mode */}
        {canvasMode === 'fullscreen' && (
          <div className="absolute inset-0 w-full h-full z-0">
            <CADViewport
              project={project}
              displayMode={displayMode}
              showPlanes={showPlanes}
              showGrid={showGrid}
              sectionView={sectionView}
              activePlane={activePlane}
              onSelectPlane={setActivePlane}
              isMeasuring={activeTool === 'measure'}
              onMeasureSelect={(res) => setMeasurementResult(res)}
            />

            {/* Quick Window Control Overlay Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-zinc-950/85 backdrop-blur-md p-1.5 rounded-xl border border-zinc-800/90 shadow-2xl">
              <button
                type="button"
                onClick={() => setCanvasMode('fullscreen')}
                className="px-2.5 py-1 bg-sky-500/20 text-sky-300 font-bold rounded-lg flex items-center gap-1.5 text-xs border border-sky-500/40 shadow-sm cursor-pointer"
                title="Canvas Expandido em Tela Cheia"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Tela Cheia</span>
              </button>
              <button
                type="button"
                onClick={() => { setCanvasMode('windowed'); setFocusedWindow('canvas'); }}
                className="px-2.5 py-1 hover:bg-zinc-800 text-zinc-300 font-medium rounded-lg flex items-center gap-1.5 text-xs transition cursor-pointer"
                title="Transformar em Janela Flutuante Movel"
              >
                <Move className="w-3.5 h-3.5 text-amber-400" />
                <span>Modo Janela</span>
              </button>
              <button
                type="button"
                onClick={() => setCanvasMode('minimized')}
                className="px-2.5 py-1 hover:bg-zinc-800 text-zinc-300 font-medium rounded-lg flex items-center gap-1.5 text-xs transition cursor-pointer"
                title="Minimizar Visualizador 3D"
              >
                <Minimize2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Minimizar</span>
              </button>
            </div>
          </div>
        )}

        {/* Windowed 3D CAD Canvas Mode (Movable & Resizable Draggable Window) */}
        {canvasMode === 'windowed' && (
          <DraggableWindow
            id="window-3d-canvas"
            title={`Visualizador CAD 3D (${project.name})`}
            icon={<Box className="w-4 h-4 text-sky-400" />}
            defaultPosition={{ x: 310, y: 16 }}
            width={840}
            height={550}
            zIndex={focusedWindow === 'canvas' ? 30 : 20}
            onFocus={() => setFocusedWindow('canvas')}
            onClose={() => setCanvasMode('minimized')}
          >
            <div className="w-full h-[500px] relative overflow-hidden rounded-b-xl">
              <CADViewport
                project={project}
                displayMode={displayMode}
                showPlanes={showPlanes}
                showGrid={showGrid}
                sectionView={sectionView}
                activePlane={activePlane}
                onSelectPlane={setActivePlane}
                isMeasuring={activeTool === 'measure'}
                onMeasureSelect={(res) => setMeasurementResult(res)}
              />

              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCanvasMode('fullscreen')}
                  className="px-2.5 py-1 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 font-bold rounded-lg flex items-center gap-1.5 text-xs border border-sky-500/40 transition cursor-pointer"
                  title="Expandir para Tela Cheia"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expandir Tela Cheia</span>
                </button>
              </div>
            </div>
          </DraggableWindow>
        )}

        {/* Minimized 3D CAD Canvas Trigger Badge */}
        {canvasMode === 'minimized' && (
          <button
            type="button"
            onClick={() => setCanvasMode('fullscreen')}
            className="absolute bottom-12 right-6 z-40 px-4 py-2 bg-sky-950/90 hover:bg-sky-900 border border-sky-500/50 text-sky-200 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer backdrop-blur-md ring-2 ring-sky-500/30 animate-pulse"
          >
            <Box className="w-4 h-4 text-sky-400" />
            <span>Visualizador CAD 3D (Minimizado) - Clique para Expandir</span>
            <Maximize2 className="w-3.5 h-3.5 text-sky-400 ml-1" />
          </button>
        )}

        {/* Movable Window 1: Feature Tree (Estrutura de Modelagem) */}
        {showFeatureTree && (
          <DraggableWindow
            id="window-feature-tree"
            title="Estrutura de Modelagem 3D"
            icon={<Layers className="w-4 h-4 text-sky-400" />}
            defaultPosition={{ x: 16, y: 16 }}
            zIndex={focusedWindow === 'tree' ? 30 : 20}
            onFocus={() => setFocusedWindow('tree')}
            onClose={() => setShowFeatureTree(false)}
          >
            <FeatureTree
              project={project}
              activePlane={activePlane}
              onSelectPlane={setActivePlane}
              onToggleSketchVisibility={handleToggleSketchVisibility}
              onToggleFeatureVisibility={handleToggleFeatureVisibility}
              onDeleteFeature={handleDeleteFeature}
              onEditFeature={(feat) => { 
                setEditingFeature(feat); 
                setPropertyModalType(feat.type as any); 
                setFocusedWindow('property');
              }}
              onSelectSketchToEdit={handleEditExistingSketch}
              onSelectPartMaterial={() => {}}
            />
          </DraggableWindow>
        )}

        {/* Movable Window 2: Team, Budget & Materials Management Tool */}
        {showTeamManagement && (
          <DraggableWindow
            id="window-team-management"
            title="Organização da Equipe, Gastos e Estoque de Materiais"
            icon={<Users className="w-4 h-4 text-teal-400" />}
            defaultPosition={{ x: Math.max(20, Math.floor(window.innerWidth / 2) - 320), y: 30 }}
            width={680}
            height={520}
            zIndex={focusedWindow === 'team' ? 35 : 20}
            onFocus={() => setFocusedWindow('team')}
            onClose={() => setShowTeamManagement(false)}
          >
            <TeamManagementModal onClose={() => setShowTeamManagement(false)} />
          </DraggableWindow>
        )}

        {/* Movable Window 3: Measurement & Metrology Tool */}
        {activeTool === 'measure' && (
          <DraggableWindow
            id="window-measurement"
            title="Paquímetro & Metrologia Digital"
            icon={<Ruler className="w-4 h-4 text-amber-400" />}
            defaultPosition={{ x: Math.max(20, window.innerWidth - 360), y: 16 }}
            zIndex={focusedWindow === 'measure' ? 30 : 20}
            onFocus={() => setFocusedWindow('measure')}
            onClose={() => { setActiveTool('select'); setMeasurementResult(null); }}
          >
            <MeasurementTool
              measurement={measurementResult}
              project={project}
            />
          </DraggableWindow>
        )}

        {/* Movable Window 4: Parametric Property Inspector */}
        {propertyModalType && (
          <DraggableWindow
            id="window-property-panel"
            title={`Inspetor Paramétrico: ${propertyModalType === 'extrude' ? 'Extrusão 3D' : propertyModalType === 'revolve' ? 'Revolução' : 'Loft Curvo'}`}
            icon={<Sliders className="w-4 h-4 text-teal-400" />}
            defaultPosition={{ x: Math.max(20, Math.floor(window.innerWidth / 2) - 200), y: 40 }}
            zIndex={focusedWindow === 'property' ? 30 : 20}
            onFocus={() => setFocusedWindow('property')}
            onClose={() => { setPropertyModalType(null); setEditingFeature(null); }}
          >
            <PropertyPanel
              type={propertyModalType}
              feature={editingFeature}
              sketches={project.sketches}
              onSave={handleSaveFeature}
              onClose={() => { setPropertyModalType(null); setEditingFeature(null); }}
            />
          </DraggableWindow>
        )}

        {/* Movable Window 5: Export Center */}
        {showExportModal && (
          <DraggableWindow
            id="window-export"
            title="Central de Exportação & Prototipagem"
            icon={<Download className="w-4 h-4 text-emerald-400" />}
            defaultPosition={{ x: Math.max(20, Math.floor(window.innerWidth / 2) - 190), y: 60 }}
            zIndex={focusedWindow === 'export' ? 30 : 20}
            onFocus={() => setFocusedWindow('export')}
            onClose={() => setShowExportModal(false)}
          >
            <ExportModal
              project={project}
              onClose={() => setShowExportModal(false)}
            />
          </DraggableWindow>
        )}

        {/* Floating reopen button if Feature Tree is hidden */}
        {!showFeatureTree && (
          <button
            type="button"
            onClick={() => { setShowFeatureTree(true); setFocusedWindow('tree'); }}
            className="absolute top-4 left-4 z-20 px-3 py-2 bg-zinc-950/90 border border-zinc-800 text-sky-400 hover:text-white rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Exibir Árvore 3D</span>
          </button>
        )}
      </div>

      {/* 2D Sketch Overlay (When sketching on plane) */}
      {isSketching && editingSketch && (
        <SketchCanvas
          sketch={editingSketch}
          onSaveSketch={handleSaveSketch}
          onCancel={() => { setIsSketching(false); setEditingSketch(null); }}
        />
      )}

      {/* Bottom Tabs Bar */}
      <BottomTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        onAddTab={handleAddTab}
      />
    </div>
  );
}


