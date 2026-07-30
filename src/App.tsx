import React, { useState } from 'react';
import { 
  CADProject, 
  ActiveTool, 
  DisplayMode, 
  PlaneType, 
  Sketch2D, 
  CADFeature, 
  MeasurementResult,
  Point3D
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
  
  const [propertyModalType, setPropertyModalType] = useState<'extrude' | 'revolve' | 'loft' | 'frame' | 'pipe_miter' | null>(null);
  const [editingFeature, setEditingFeature] = useState<CADFeature | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | undefined>(undefined);

  const handleUpdateFeatureTransform = (featureId: string, transform: { position?: Point3D; rotation?: Point3D; scale?: Point3D }) => {
    setProject(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === featureId ? {
        ...f,
        position: { ...(f.position || { x: 0, y: 0, z: 0 }), ...transform.position },
        rotation: { ...(f.rotation || { x: 0, y: 0, z: 0 }), ...transform.rotation },
        scale: { ...(f.scale || { x: 1, y: 1, z: 1 }), ...transform.scale }
      } : f)
    }));
  };

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
      
      {/* 1. LOGIN & TERMS MODAL */}
      {showLoginModal && (
        <LoginModal onLoginSuccess={(session) => { handleLoginSuccess(session); setShowLoginModal(false); }} />
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
        onOpenFrameModal={() => { setEditingFeature(null); setPropertyModalType('frame'); setFocusedWindow('property'); }}
        onOpenPipeMiterModal={() => { setEditingFeature(null); setPropertyModalType('pipe_miter'); setFocusedWindow('property'); }}
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
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-0.5 rounded-lg border border-zinc-800 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userSession.name}</span>
              <span className="text-zinc-500">• {userSession.organization}</span>
            </button>
          </div>

        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 relative w-full h-full overflow-hidden bg-zinc-950">
        
        {/* TAB 1: 3D CAD MODELING VIEWPORT STUDIO */}
        {activeTab !== 'Análise de Materiais & Propulsão' && (
          <div className="absolute inset-0 w-full h-full z-0">
            <CADViewport
              project={project}
              displayMode={displayMode}
              showPlanes={showPlanes}
              showGrid={showGrid}
              sectionView={sectionView}
              activePlane={activePlane}
              activeTool={activeTool}
              selectedFeatureId={selectedFeatureId}
              onSelectPlane={setActivePlane}
              onSelectFeature={(id) => setSelectedFeatureId(id)}
              onUpdateFeatureTransform={handleUpdateFeatureTransform}
              isMeasuring={activeTool === 'measure'}
              onMeasureSelect={(res) => setMeasurementResult(res)}
            />

            {/* Viewport Floating Status Bar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-zinc-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800/90 shadow-2xl text-xs font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-zinc-100">{project.name}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-sky-300 font-mono text-[11px]">{project.parts.length} peças / {project.features.length} operações</span>
            </div>
          </div>
        )}

        {/* TAB 2: ENGINEERING MATERIALS & PROPULSION ANALYSIS STUDIO */}
        {activeTab === 'Análise de Materiais & Propulsão' && (
          <div className="absolute inset-0 w-full h-full z-10 bg-zinc-950 p-6 overflow-y-auto font-sans text-xs select-none space-y-6">
            <div className="max-w-5xl mx-auto space-y-6">
              
              <div className="bg-gradient-to-r from-sky-950/60 via-zinc-900 to-teal-950/60 p-6 rounded-3xl border border-sky-500/30 shadow-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sky-400" />
                    Estúdio de Análise de Materiais, Massa & Propulsão
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Cálculos paramétricos em tempo real baseados nas geometrias CAD 3D do projeto <span className="text-sky-300 font-bold">{project.name}</span>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab(tabs[0] || 'Estúdio Principal 3D')}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg"
                >
                  <Box className="w-4 h-4" />
                  <span>Voltar para Modelagem 3D</span>
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block font-bold uppercase">Massa Total Calculada</span>
                  <span className="text-xl font-bold font-mono text-sky-400">
                    {(project.parts.reduce((a, b) => a + b.mass, 0) / 1000).toFixed(2)} kg
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-1">Densidade média: 1.85 g/cm³</span>
                </div>

                <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block font-bold uppercase">Volume 3D Acumulado</span>
                  <span className="text-xl font-bold font-mono text-teal-300">
                    {project.parts.reduce((a, b) => a + b.volume, 0).toLocaleString('pt-BR')} cm³
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-1">Baseado nos sketches extrudados</span>
                </div>

                <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block font-bold uppercase">Área Superficial Total</span>
                  <span className="text-xl font-bold font-mono text-amber-300">
                    {project.parts.reduce((a, b) => a + b.surfaceArea, 0).toLocaleString('pt-BR')} cm²
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-1">Resistência ao arrasto aerodinâmico</span>
                </div>

                <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block font-bold uppercase">Fator de Segurança (FOS)</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    2.45 (Seguro)
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-1">Alumínio 7075-T6 & Carbono</span>
                </div>
              </div>

              {/* Subsystems Breakdown Table */}
              <div className="p-5 bg-zinc-900/80 rounded-2xl border border-zinc-800 space-y-4">
                <h3 className="font-bold text-zinc-200 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  Especificações dos Componentes e Materiais Atribuidos
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300 border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 font-bold">
                        <th className="py-2 px-3">Peça / Conjunto</th>
                        <th className="py-2 px-3">Material Atribuído</th>
                        <th className="py-2 px-3">Densidade</th>
                        <th className="py-2 px-3">Massa Est. (g)</th>
                        <th className="py-2 px-3">Status de Tensão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.parts.map((part) => (
                        <tr key={part.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                          <td className="py-2.5 px-3 font-bold text-zinc-100">{part.name}</td>
                          <td className="py-2.5 px-3 text-sky-300">{part.material.name}</td>
                          <td className="py-2.5 px-3 font-mono">{part.material.density} g/cm³</td>
                          <td className="py-2.5 px-3 font-mono text-teal-300">{part.mass.toLocaleString('pt-BR')} g</td>
                          <td className="py-2.5 px-3">
                            <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                              Aprovado (Von Mises OK)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
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


