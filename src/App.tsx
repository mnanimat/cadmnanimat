import React, { useState, useEffect } from 'react';
import { 
  CADProject, 
  ActiveTool, 
  DisplayMode, 
  PlaneType, 
  Sketch2D, 
  CADFeature, 
  CADPart,
  MeasurementResult,
  Point3D,
  CFDConfig
} from './types/cad';
import { UserSession, RocketConfig, VehicleConfig } from './types/engineering';
import { CAD_TEMPLATES } from './data/cadTemplates';
import { Toolbar } from './components/Toolbar';
import { FeatureTree } from './components/FeatureTree';
import { CADViewport } from './components/CADViewport';
import { SketchCanvas } from './components/SketchCanvas';
import { PropertyPanel } from './components/PropertyPanel';
import { TransformInspector } from './components/TransformInspector';
import { MeasurementTool } from './components/MeasurementTool';
import { ExportModal } from './components/ExportModal';
import { CFDSimulationWindow } from './components/CFDSimulationWindow';
import { PartsLibraryModal } from './components/PartsLibraryModal';
import { DrawingSheetModal } from './components/DrawingSheetModal';
import { FEASimulationModal } from './components/FEASimulationModal';
import { MassInertiaModal } from './components/MassInertiaModal';
import { BottomTabs } from './components/BottomTabs';
import { DraggableWindow } from './components/DraggableWindow';
import { LoginModal } from './components/LoginModal';
import { ModeSelectorModal } from './components/ModeSelectorModal';
import { TeamManagementModal } from './components/TeamManagementModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { AboutModal } from './components/AboutModal';
import { useAutoSave } from './hooks/useAutoSave';
import { Layers, Ruler, Sliders, Download, Maximize2, Minimize2, Move, Box, Users, Compass, Rocket, ShieldCheck, Sparkles, Wind, Database, Keyboard, Info, Save, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Theme Management ('dark' | 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('cad_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const handleSetTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('cad_theme', newTheme);
  };

  // Authentication & Engineering Modes State
  const [userSession, setUserSession] = useState<UserSession | null>({
    name: 'Engenheiro Projetista',
    email: 'engenharia@equipe.edu.br',
    organization: 'Equipe VORTEX Rocketry & Baja SAE',
    acceptedTerms: true,
    acceptedPrivacy: true,
    isLoggedIn: true
  });
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showModeSelector, setShowModeSelector] = useState<boolean>(false);
  const [showTeamManagement, setShowTeamManagement] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  // Auto-restore project state and active engineering title from auto-save
  const [activeEngineeringTitle, setActiveEngineeringTitle] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('cadmnanimat_autosave');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) return parsed.title;
      }
    } catch (e) {}
    return 'Foguete Experimental (3km Apogeu)';
  });

  const [project, setProject] = useState<CADProject>(() => {
    try {
      const saved = localStorage.getItem('cadmnanimat_autosave');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.project && parsed.project.id && Array.isArray(parsed.project.features)) {
          return parsed.project;
        }
      }
    } catch (e) {}
    return CAD_TEMPLATES[0];
  });

  // Auto-save hook running every 30 seconds
  const { lastSaved, isSaved, saveNow } = useAutoSave(project, activeEngineeringTitle, 30000);
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('edges');
  const [showPlanes, setShowPlanes] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [sectionView, setSectionView] = useState<boolean>(false);
  const [activePlane, setActivePlane] = useState<PlaneType>('Top');

  // Modals & Panels State
  const [isSketching, setIsSketching] = useState<boolean>(false);
  const [editingSketch, setEditingSketch] = useState<Sketch2D | null>(null);
  
  const [propertyModalType, setPropertyModalType] = useState<'extrude' | 'revolve' | 'loft' | 'frame' | 'pipe_miter' | null>(null);
  const [editingFeature, setEditingFeature] = useState<CADFeature | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | undefined>(undefined);

  // Undo / Redo Project History
  const [history, setHistory] = useState<CADProject[]>([CAD_TEMPLATES[0]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const pushProjectState = (newProject: CADProject) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newProject);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setProject(newProject);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setProject(history[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setProject(history[nextIndex]);
    }
  };

  const handleNewProject = () => {
    const blankProject: CADProject = {
      id: `proj_${Date.now()}`,
      name: 'Novo Projeto CAD Vazio',
      activePlane: 'Top',
      sketches: [],
      features: [],
      parts: [
        {
          id: `p_blank`,
          name: 'Peça Principal',
          featureIds: [],
          color: '#00f0ff',
          material: { id: 'alu', name: 'Alumínio 6061-T6', density: 2.7, color: '#e0e0e0', metalness: 0.8, roughness: 0.2 },
          visible: true,
          volume: 0,
          mass: 0,
          surfaceArea: 0
        }
      ]
    };
    pushProjectState(blankProject);
  };

  const handleClearProject = () => {
    if (window.confirm('Tem certeza de que deseja limpar todos os recursos e esboços do projeto atual?')) {
      const cleared = {
        ...project,
        sketches: [],
        features: []
      };
      pushProjectState(cleared);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedFeatureId) {
      const updated = {
        ...project,
        features: project.features.filter(f => f.id !== selectedFeatureId)
      };
      setSelectedFeatureId(undefined);
      pushProjectState(updated);
    } else if (project.features.length > 0) {
      const updated = {
        ...project,
        features: project.features.slice(0, -1)
      };
      pushProjectState(updated);
    }
  };

  const handleResetLayout = () => {
    setShowFeatureTree(true);
    setFocusedWindow('tree');
  };

  // Measurement Snap Mode
  const [snapMode, setSnapMode] = useState<'vertex' | 'edge' | 'face' | 'any'>('any');

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      const key = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && key === 's') {
        e.preventDefault();
        setShowExportModal(true);
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (key === 'g' || key === 'm' || key === 'w') {
          setActiveTool('translate');
        } else if (key === 'r' || key === 'e') {
          setActiveTool('rotate');
        } else if (key === 's') {
          setActiveTool('scale');
        } else if (key === 'v') {
          setActiveTool('select');
        } else if (key === 'p' || key === 'q') {
          setActiveTool('measure');
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedFeatureId) {
          const updated = {
            ...project,
            features: project.features.filter(f => f.id !== selectedFeatureId)
          };
          pushProjectState(updated);
          setSelectedFeatureId(undefined);
        }
      } else if (e.key === 'Escape') {
        setActiveTool('select');
        setIsSketching(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, selectedFeatureId, project]);

  // Canvas Mode: 'fullscreen' | 'windowed' | 'minimized'
  const [canvasMode, setCanvasMode] = useState<'fullscreen' | 'windowed' | 'minimized'>('fullscreen');

  // Multi-document / Part Studio tabs
  const [tabs, setTabs] = useState<string[]>(['Estúdio Principal 3D', 'Análise de Materiais & Propulsão', 'Prancha Técnica A4']);
  const [activeTab, setActiveTab] = useState<string>('Estúdio Principal 3D');
  const [showDrawingSheetModal, setShowDrawingSheetModal] = useState<boolean>(false);

  const handleAddTab = () => {
    const newIndex = tabs.length + 1;
    const newTabName = `Estúdio de Peça ${newIndex}`;
    setTabs([...tabs, newTabName]);
    setActiveTab(newTabName);
  };

  const handleDeleteTab = (tabName: string) => {
    const updatedTabs = tabs.filter(t => t !== tabName);
    if (updatedTabs.length === 0) {
      const defaultTab = 'Estúdio Principal 3D';
      setTabs([defaultTab]);
      setActiveTab(defaultTab);
    } else {
      setTabs(updatedTabs);
      if (activeTab === tabName) {
        setActiveTab(updatedTabs[updatedTabs.length - 1]);
      }
    }
  };

  const handleDeleteActivePage = () => {
    if (window.confirm(`Tem certeza de que deseja excluir a página atual "${activeTab}"?`)) {
      handleDeleteTab(activeTab);
    }
  };

  const handleUpdateFeatureTransform = (featureId: string, transform: { position?: Point3D; rotation?: Point3D; scale?: Point3D }) => {
    const updated = {
      ...project,
      features: project.features.map(f => f.id === featureId ? {
        ...f,
        position: { ...(f.position || { x: 0, y: 0, z: 0 }), ...transform.position },
        rotation: { ...(f.rotation || { x: 0, y: 0, z: 0 }), ...transform.rotation },
        scale: { ...(f.scale || { x: 1, y: 1, z: 1 }), ...transform.scale }
      } : f)
    };
    setProject(updated);
  };

  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showCFDModal, setShowCFDModal] = useState<boolean>(false);
  const [showFEAModal, setShowFEAModal] = useState<boolean>(false);
  const [showMassInertiaModal, setShowMassInertiaModal] = useState<boolean>(false);
  const [showPartsLibraryModal, setShowPartsLibraryModal] = useState<boolean>(false);
  const [measurementResult, setMeasurementResult] = useState<MeasurementResult | null>(null);
  const [showFeatureTree, setShowFeatureTree] = useState<boolean>(true);

  // CFD Aerodynamic Simulation Config
  const [cfdConfig, setCfdConfig] = useState<CFDConfig>({
    enabled: false,
    windSpeedMs: 35,
    airDensity: 1.225,
    angleOfAttackDeg: 4,
    temperatureC: 15,
    turbulenceModel: 'k_epsilon',
    showStreamlines: true,
    showPressureMap: true,
    showVectorGrid: false,
    showSlicePlane: false,
    streamlineParticlesCount: 220,
    windDirection: 'z_neg'
  });

  const handleImportStandardPart = (sketch: Sketch2D, feature: CADFeature, part: CADPart) => {
    const updated = {
      ...project,
      sketches: [...project.sketches, sketch],
      features: [...project.features, feature],
      parts: [...project.parts, part]
    };
    pushProjectState(updated);
  };

  // Focus Z-index management
  const [focusedWindow, setFocusedWindow] = useState<string>('tree');

  // Login handler
  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    setShowModeSelector(true);
  };

  // Rocket mode handler
  const handleSelectRocketMode = (config: RocketConfig) => {
    const rocketTemplate = CAD_TEMPLATES.find(t => t.id === 'rocket_3km') || CAD_TEMPLATES[0];
    const customizedProject: CADProject = JSON.parse(JSON.stringify(rocketTemplate));
    customizedProject.name = `Foguete (${config.apogeeTarget} Apogeu) - ${config.fuelType}`;
    
    pushProjectState(customizedProject);
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

    pushProjectState(customizedProject);
    setActiveEngineeringTitle(`${config.title} (${config.powertrain})`);
    setShowModeSelector(false);
  };

  // Load Preset Template
  const handleLoadTemplate = (templateId: string) => {
    const tmpl = CAD_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      pushProjectState(JSON.parse(JSON.stringify(tmpl)));
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
    const exists = project.sketches.some(s => s.id === updatedSketch.id);
    let updatedSketches = [];
    if (exists) {
      updatedSketches = project.sketches.map(s => s.id === updatedSketch.id ? updatedSketch : s);
    } else {
      updatedSketches = [...project.sketches, updatedSketch];
    }
    const updated = {
      ...project,
      sketches: updatedSketches
    };
    pushProjectState(updated);
    setIsSketching(false);
    setEditingSketch(null);
  };

  // Feature History Mutations
  const handleSaveFeature = (savedFeature: CADFeature) => {
    const exists = project.features.some(f => f.id === savedFeature.id);
    let updatedFeatures = [];
    if (exists) {
      updatedFeatures = project.features.map(f => f.id === savedFeature.id ? savedFeature : f);
    } else {
      updatedFeatures = [...project.features, savedFeature];
    }

    const updated = {
      ...project,
      features: updatedFeatures
    };
    pushProjectState(updated);
    setPropertyModalType(null);
    setEditingFeature(null);
  };

  const handleToggleSketchVisibility = (sketchId: string) => {
    setProject(prev => ({
      ...prev,
      sketches: prev.sketches.map(s => s.id === sketchId ? { ...s, visible: !s.visible } : s)
    }));
  };

  const handleToggleFeatureVisibility = (featureId: string) => {
    setProject(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === featureId ? { ...f, visible: !f.visible } : f)
    }));
  };

  const handleDeleteFeature = (featureId: string) => {
    const updated = {
      ...project,
      features: project.features.filter(f => f.id !== featureId)
    };
    pushProjectState(updated);
  };

  const isLight = theme === 'light';

  return (
    <div className={`flex flex-col h-screen overflow-hidden select-none font-sans transition-colors ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-zinc-950 text-zinc-100'
    }`}>
      {/* Upper Main Toolbar */}
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
        theme={theme}
        setTheme={handleSetTheme}
        onOpenNewSketch={handleOpenNewSketch}
        onOpenExtrudeModal={() => { setEditingFeature(null); setPropertyModalType('extrude'); setFocusedWindow('property'); }}
        onOpenRevolveModal={() => { setEditingFeature(null); setPropertyModalType('revolve'); setFocusedWindow('property'); }}
        onOpenLoftModal={() => { setEditingFeature(null); setPropertyModalType('loft'); setFocusedWindow('property'); }}
        onOpenFrameModal={() => { setEditingFeature(null); setPropertyModalType('frame'); setFocusedWindow('property'); }}
        onOpenPipeMiterModal={() => { setEditingFeature(null); setPropertyModalType('pipe_miter'); setFocusedWindow('property'); }}
        onOpenExportModal={() => { setShowExportModal(true); setFocusedWindow('export'); }}
        onOpenCFDModal={() => { setShowCFDModal(true); setFocusedWindow('cfd'); }}
        onOpenFEAModal={() => { setShowFEAModal(true); setFocusedWindow('fea'); }}
        onOpenMassInertiaModal={() => { setShowMassInertiaModal(true); setFocusedWindow('mass'); }}
        onOpenPartsLibraryModal={() => { setShowPartsLibraryModal(true); setFocusedWindow('parts'); }}
        onLoadTemplate={handleLoadTemplate}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onNewProject={handleNewProject}
        onClearProject={handleClearProject}
        onToggleFeatureTree={() => setShowFeatureTree(prev => !prev)}
        onOpenTeamModal={() => { setShowTeamManagement(true); setFocusedWindow('team'); }}
        onOpenModeModal={() => setShowModeSelector(true)}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onShowKeyboardShortcuts={() => { setShowShortcutsModal(true); setFocusedWindow('shortcuts'); }}
        onShowAboutModal={() => { setShowAboutModal(true); setFocusedWindow('about'); }}
        onResetLayout={handleResetLayout}
        onDeleteSelected={handleDeleteSelected}
        onOpenDrawingSheet={() => { setShowDrawingSheetModal(true); setFocusedWindow('drawing'); }}
        onDeleteActivePage={handleDeleteActivePage}
      />

      {/* Center 3D CAD Canvas and Floating Tool Windows */}
      <div className="flex-1 relative overflow-hidden flex">
        
        {/* Canvas Center Stage */}
        <div className="flex-1 h-full w-full relative">
          <CADViewport
            project={project}
            displayMode={displayMode}
            showPlanes={showPlanes}
            showGrid={showGrid}
            sectionView={sectionView}
            activePlane={activePlane}
            activeTool={activeTool}
            selectedFeatureId={selectedFeatureId}
            cfdConfig={cfdConfig}
            snapMode={snapMode}
            onSelectPlane={setActivePlane}
            onSelectFeature={(id) => setSelectedFeatureId(id)}
            onUpdateFeatureTransform={handleUpdateFeatureTransform}
            onMeasureSelect={(res) => setMeasurementResult(res)}
            isMeasuring={activeTool === 'measure'}
            theme={theme}
          />

          {/* Top Bar Floating Status Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-full border shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-medium ${
              isLight
                ? 'bg-white/95 border-slate-300 text-slate-800'
                : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-200'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <div className="flex items-center gap-1.5">
                <span className="text-sky-500 font-bold">{activeEngineeringTitle}</span>
                <span className="text-zinc-500">|</span>
                <span className="font-mono text-emerald-500 font-bold">{project.name}</span>
              </div>
            </div>

            {/* Auto-Save Indicator Badge */}
            <button
              onClick={saveNow}
              title="Clique para salvar o estado atual do projeto imediatamente no localStorage (Salvamento Automático a cada 30s ativo)"
              className={`px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition active:scale-95 ${
                isLight
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/60'
              }`}
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isSaved
                  ? lastSaved
                    ? `Salvo às ${lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                    : 'Auto-Salvo (30s)'
                  : 'Salvando...'}
              </span>
            </button>

            <button
              onClick={() => setShowModeSelector(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer transition active:scale-95"
              title="Trocar Modo de Engenharia (Baja / Foguete / Drone)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Modos</span>
            </button>
          </div>
        </div>

        {/* Modal Window: Authentication / Profile Login */}
        {showLoginModal && (
          <LoginModal
            onSuccess={handleLoginSuccess}
            onClose={() => setShowLoginModal(false)}
          />
        )}

        {/* Modal Window: Engineering Mode Selector */}
        {showModeSelector && (
          <ModeSelectorModal
            onSelectRocketMode={handleSelectRocketMode}
            onSelectVehicleMode={handleSelectVehicleMode}
            onClose={() => setShowModeSelector(false)}
          />
        )}

        {/* Floating Movable Window: Keyboard Shortcuts */}
        {showShortcutsModal && (
          <DraggableWindow
            id="window-shortcuts"
            title="Guia Rápido de Atalhos de Teclado"
            icon={<Keyboard className="w-4 h-4 text-amber-500" />}
            defaultPosition={{ x: Math.max(20, Math.floor(window.innerWidth / 2) - 240), y: 60 }}
            zIndex={focusedWindow === 'shortcuts' ? 35 : 25}
            onFocus={() => setFocusedWindow('shortcuts')}
            onClose={() => setShowShortcutsModal(false)}
            theme={theme}
          >
            <ShortcutsModal onClose={() => setShowShortcutsModal(false)} theme={theme} />
          </DraggableWindow>
        )}

        {/* Floating Movable Window: About CADMNAnimat */}
        {showAboutModal && (
          <DraggableWindow
            id="window-about"
            title="Sobre o CADMNAnimat v1.0.0"
            icon={<Info className="w-4 h-4 text-teal-500" />}
            defaultPosition={{ x: Math.max(20, Math.floor(window.innerWidth / 2) - 260), y: 50 }}
            zIndex={focusedWindow === 'about' ? 35 : 25}
            onFocus={() => setFocusedWindow('about')}
            onClose={() => setShowAboutModal(false)}
            theme={theme}
          >
            <AboutModal onClose={() => setShowAboutModal(false)} theme={theme} />
          </DraggableWindow>
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
            theme={theme}
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
              theme={theme}
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
            theme={theme}
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
            theme={theme}
          >
            <MeasurementTool
              measurement={measurementResult}
              project={project}
              snapMode={snapMode}
              onSnapModeChange={(mode) => setSnapMode(mode)}
              onClearMeasurement={() => setMeasurementResult(null)}
            />
          </DraggableWindow>
        )}

        {/* Movable Window 4: Parametric Property Inspector */}
        {propertyModalType && (
          <DraggableWindow
            id="window-property-panel"
            title={`Inspetor Paramétrico: ${
              propertyModalType === 'extrude' ? 'Extrusão 3D' : 
              propertyModalType === 'revolve' ? 'Revolução' : 
              propertyModalType === 'loft' ? 'Loft Curvo' : 
              propertyModalType === 'frame' ? 'Gerador de Tubos & Chassi' : 
              'Corte & Junção de Tubos'
            }`}
            icon={<Sliders className="w-4 h-4 text-teal-400" />}
            defaultPosition={{ x: Math.max(20, Math.floor(window.innerWidth / 2) - 200), y: 40 }}
            zIndex={focusedWindow === 'property' ? 30 : 20}
            onFocus={() => setFocusedWindow('property')}
            onClose={() => { setPropertyModalType(null); setEditingFeature(null); }}
            theme={theme}
          >
            <PropertyPanel
              type={propertyModalType}
              feature={editingFeature}
              sketches={project.sketches}
              onSave={handleSaveFeature}
              onClose={() => { setPropertyModalType(null); setEditingFeature(null); }}
              theme={theme}
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
            theme={theme}
          >
            <ExportModal
              project={project}
              onClose={() => setShowExportModal(false)}
              onOpenDrawingSheet={() => { setShowDrawingSheetModal(true); setFocusedWindow('drawing'); }}
            />
          </DraggableWindow>
        )}

        {/* Movable Window 6: Aerodynamic CFD Simulation Window */}
        {showCFDModal && (
          <DraggableWindow
            id="window-cfd"
            title="Simulação Aerodinâmica CFD & Túnel de Vento 3D"
            icon={<Wind className="w-4 h-4 text-sky-400 animate-pulse" />}
            defaultPosition={{ x: Math.max(20, Math.floor(window.innerWidth / 2) - 340), y: 30 }}
            zIndex={focusedWindow === 'cfd' ? 30 : 20}
            onFocus={() => setFocusedWindow('cfd')}
            onClose={() => setShowCFDModal(false)}
            theme={theme}
          >
            <CFDSimulationWindow
              project={project}
              cfdConfig={cfdConfig}
              onUpdateCFDConfig={(newConfig) => setCfdConfig(newConfig)}
              onClose={() => setShowCFDModal(false)}
            />
          </DraggableWindow>
        )}

        {/* Movable Window 7: Standard Parts Catalog (ISO / ANSI) */}
        {showPartsLibraryModal && (
          <DraggableWindow
            id="window-parts-library"
            title="Biblioteca de Peças Padrão Industrial (ISO / ANSI)"
            icon={<Database className="w-4 h-4 text-amber-400" />}
            defaultPosition={{ x: Math.max(20, Math.floor(window.innerWidth / 2) - 340), y: 50 }}
            zIndex={focusedWindow === 'parts' ? 30 : 20}
            onFocus={() => setFocusedWindow('parts')}
            onClose={() => setShowPartsLibraryModal(false)}
            theme={theme}
          >
            <PartsLibraryModal
              onImportPart={handleImportStandardPart}
              onClose={() => setShowPartsLibraryModal(false)}
            />
          </DraggableWindow>
        )}

        {/* Movable Window 8: 3D Transform Inspector (Mover / Rotacionar / Escalar com Medidas Exatas) */}
        {(['translate', 'rotate', 'scale'].includes(activeTool) || selectedFeatureId) && (
          <DraggableWindow
            id="window-transform-inspector"
            title="Controle Preciso de Transformação 3D (Medidas Exatas)"
            icon={<Move className="w-4 h-4 text-amber-400 animate-pulse" />}
            defaultPosition={{ x: Math.max(20, window.innerWidth - 380), y: 80 }}
            zIndex={focusedWindow === 'transform' ? 35 : 22}
            onFocus={() => setFocusedWindow('transform')}
            onClose={() => { setActiveTool('select'); }}
            theme={theme}
          >
            <TransformInspector
              project={project}
              selectedFeatureId={selectedFeatureId}
              activeTool={activeTool}
              onSelectFeature={(id) => setSelectedFeatureId(id)}
              onChangeTool={(tool) => setActiveTool(tool)}
              onUpdateTransform={handleUpdateFeatureTransform}
              theme={theme}
            />
          </DraggableWindow>
        )}

        {/* Movable Window 9: Technical Drawing Sheet Generator A4/A3 */}
        {showDrawingSheetModal && (
          <DraggableWindow
            id="window-drawing-sheet"
            title="Detalhamento Técnico de Engenharia (Prancha A4 / A3)"
            icon={<Rocket className="w-4 h-4 text-amber-400" />}
            defaultPosition={{ x: Math.max(10, Math.floor(window.innerWidth / 2) - 500), y: 20 }}
            width={1020}
            zIndex={focusedWindow === 'drawing' ? 35 : 24}
            onFocus={() => setFocusedWindow('drawing')}
            onClose={() => setShowDrawingSheetModal(false)}
            theme={theme}
          >
            <DrawingSheetModal
              project={project}
              onClose={() => setShowDrawingSheetModal(false)}
              theme={theme}
            />
          </DraggableWindow>
        )}

        {/* Movable Window 10: Structural FEA Simulation Modal */}
        {showFEAModal && (
          <DraggableWindow
            id="window-fea"
            title="Análise Tensional por Elementos Finitos (FEA 3D)"
            icon={<ShieldCheck className="w-4 h-4 text-rose-400" />}
            defaultPosition={{ x: Math.max(10, Math.floor(window.innerWidth / 2) - 310), y: 40 }}
            width={640}
            zIndex={focusedWindow === 'fea' ? 36 : 25}
            onFocus={() => setFocusedWindow('fea')}
            onClose={() => setShowFEAModal(false)}
            theme={theme}
          >
            <FEASimulationModal
              project={project}
              onClose={() => setShowFEAModal(false)}
              theme={theme}
            />
          </DraggableWindow>
        )}

        {/* Movable Window 11: Mass Properties & Center of Gravity Modal */}
        {showMassInertiaModal && (
          <DraggableWindow
            id="window-mass"
            title="Propriedades de Massa & Centro de Gravidade (CoG)"
            icon={<Box className="w-4 h-4 text-purple-400" />}
            defaultPosition={{ x: Math.max(10, Math.floor(window.innerWidth / 2) - 270), y: 60 }}
            width={550}
            zIndex={focusedWindow === 'mass' ? 37 : 26}
            onFocus={() => setFocusedWindow('mass')}
            onClose={() => setShowMassInertiaModal(false)}
            theme={theme}
          >
            <MassInertiaModal
              project={project}
              onClose={() => setShowMassInertiaModal(false)}
              theme={theme}
            />
          </DraggableWindow>
        )}

        {/* Floating reopen button if Feature Tree is hidden */}
        {!showFeatureTree && (
          <button
            type="button"
            onClick={() => { setShowFeatureTree(true); setFocusedWindow('tree'); }}
            className={`absolute top-4 left-4 z-20 px-3 py-2 border text-sky-500 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
              isLight
                ? 'bg-white/90 border-slate-300 hover:bg-slate-100'
                : 'bg-zinc-950/90 border-zinc-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-500" />
            <span>Exibir Árvore 3D</span>
          </button>
        )}
      </div>

      {/* 2D / 3D Sketch Overlay (When sketching on plane or 3D region) */}
      {isSketching && editingSketch && (
        <SketchCanvas
          sketch={editingSketch}
          onSaveSketch={handleSaveSketch}
          onCancel={() => { setIsSketching(false); setEditingSketch(null); }}
          onExtrudeDirectly={(sk) => {
            handleSaveSketch(sk);
            setEditingFeature(null);
            setPropertyModalType('extrude');
            setFocusedWindow('property');
          }}
        />
      )}

      {/* Bottom Tabs Bar */}
      <BottomTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        onAddTab={handleAddTab}
        onDeleteTab={handleDeleteTab}
        onOpenDrawingSheet={() => { setShowDrawingSheetModal(true); setFocusedWindow('drawing'); }}
        theme={theme}
      />
    </div>
  );
}
