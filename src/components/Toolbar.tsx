import React, { useState, useRef, useEffect } from 'react';
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
  Database,
  Sun,
  Moon,
  Undo2,
  Redo2,
  FilePlus,
  FolderOpen,
  HelpCircle,
  Info,
  Keyboard,
  User,
  Users,
  Trash2,
  LayoutGrid,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
  CheckCircle2
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
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onOpenNewSketch: () => void;
  onOpenExtrudeModal: () => void;
  onOpenRevolveModal: () => void;
  onOpenLoftModal: () => void;
  onOpenFrameModal: () => void;
  onOpenPipeMiterModal: () => void;
  onOpenExportModal: () => void;
  onOpenCFDModal?: () => void;
  onOpenFEAModal?: () => void;
  onOpenMassInertiaModal?: () => void;
  onOpenPartsLibraryModal?: () => void;
  onLoadTemplate: (templateId: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onNewProject?: () => void;
  onClearProject?: () => void;
  onToggleFeatureTree?: () => void;
  onOpenTeamModal?: () => void;
  onOpenModeModal?: () => void;
  onOpenLoginModal?: () => void;
  onShowKeyboardShortcuts?: () => void;
  onShowAboutModal?: () => void;
  onResetLayout?: () => void;
  onDeleteSelected?: () => void;
  onOpenDrawingSheet?: () => void;
  onDeleteActivePage?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
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
  theme,
  setTheme,
  onOpenNewSketch,
  onOpenExtrudeModal,
  onOpenRevolveModal,
  onOpenLoftModal,
  onOpenFrameModal,
  onOpenPipeMiterModal,
  onOpenExportModal,
  onOpenCFDModal,
  onOpenFEAModal,
  onOpenMassInertiaModal,
  onOpenPartsLibraryModal,
  onLoadTemplate,
  onUndo,
  onRedo,
  onNewProject,
  onClearProject,
  onToggleFeatureTree,
  onOpenTeamModal,
  onOpenModeModal,
  onOpenLoginModal,
  onShowKeyboardShortcuts,
  onShowAboutModal,
  onResetLayout,
  onDeleteSelected,
  onOpenDrawingSheet,
  onDeleteActivePage,
  canUndo = true,
  canRedo = true
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string) => {
    setActiveMenu(prev => prev === menuName ? null : menuName);
  };

  const isLight = theme === 'light';

  return (
    <header className={`select-none shadow-lg transition-colors ${
      isLight 
        ? 'bg-slate-100 border-b border-slate-300 text-slate-800' 
        : 'bg-zinc-950 border-b border-zinc-800/80 text-zinc-200'
    }`}>
      {/* Menu Superior de Aplicação (App Header & Top Nav Dropdowns) */}
      <div 
        ref={menuRef}
        className={`h-9 px-3 border-b flex items-center justify-between text-xs font-mono relative z-50 ${
          isLight 
            ? 'bg-white border-slate-300 text-slate-800' 
            : 'bg-zinc-950/90 border-zinc-800/60 text-zinc-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Brand Logo */}
          <div className={`flex items-center gap-2 font-bold tracking-wider px-2.5 py-1 rounded-lg border shadow-inner ${
            isLight 
              ? 'bg-slate-100 border-slate-300 text-sky-700' 
              : 'bg-zinc-900/90 border-zinc-800 text-sky-400'
          }`}>
            <Box className="w-4 h-4 text-sky-500 animate-pulse" />
            <span className="text-sm font-sans tracking-tight bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent font-bold">
              CADMNAnimat
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono border ${
              isLight 
                ? 'bg-sky-100 text-sky-800 border-sky-300 font-bold' 
                : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
            }`}>
              v1.0.0
            </span>
          </div>

          <div className={`h-4 w-px ${isLight ? 'bg-slate-300' : 'bg-zinc-800'}`} />

          {/* Top Interactive Dropdown Menus */}
          <nav className="hidden lg:flex items-center gap-1 font-sans text-xs">
            
            {/* 1. ARQUIVO */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('Arquivo')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                  activeMenu === 'Arquivo'
                    ? (isLight ? 'bg-sky-100 text-sky-900 font-bold' : 'bg-zinc-800 text-white font-bold')
                    : (isLight ? 'text-slate-700 hover:bg-slate-200 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white')
                }`}
              >
                Arquivo
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === 'Arquivo' && (
                <div className={`absolute top-full left-0 mt-1 w-56 rounded-xl border p-1 shadow-2xl z-50 text-xs font-sans space-y-0.5 ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                }`}>
                  <button
                    onClick={() => { onNewProject?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <FilePlus className="w-3.5 h-3.5 text-sky-500" />
                    <span>Novo Projeto CAD Vazio</span>
                  </button>

                  <button
                    onClick={() => { onOpenPartsLibraryModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-amber-500" />
                    <span>Importar Peça Padrão ISO/ANSI</span>
                  </button>

                  <button
                    onClick={() => { onOpenExportModal(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Exportar Modelo (STEP, STL, DXF)</span>
                  </button>

                  {onOpenDrawingSheet && (
                    <button
                      onClick={() => { onOpenDrawingSheet(); setActiveMenu(null); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer text-amber-400 font-bold ${
                        isLight ? 'hover:bg-amber-50' : 'hover:bg-amber-950/40'
                      }`}
                    >
                      <FilePlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Gerar Prancha A4 / A3 (Vistas 2D)</span>
                    </button>
                  )}

                  <div className={`my-1 border-t ${isLight ? 'border-slate-200' : 'border-zinc-800'}`} />

                  {onDeleteActivePage && (
                    <button
                      onClick={() => { onDeleteActivePage(); setActiveMenu(null); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer text-rose-400 ${
                        isLight ? 'hover:bg-rose-50' : 'hover:bg-rose-950/40'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Excluir Página Atual</span>
                    </button>
                  )}

                  <button
                    onClick={() => { onClearProject?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer text-rose-500 ${
                      isLight ? 'hover:bg-rose-50' : 'hover:bg-rose-950/40'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Limpar Todos os Recursos</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. EDITAR */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('Editar')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                  activeMenu === 'Editar'
                    ? (isLight ? 'bg-sky-100 text-sky-900 font-bold' : 'bg-zinc-800 text-white font-bold')
                    : (isLight ? 'text-slate-700 hover:bg-slate-200 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white')
                }`}
              >
                Editar
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === 'Editar' && (
                <div className={`absolute top-full left-0 mt-1 w-56 rounded-xl border p-1 shadow-2xl z-50 text-xs font-sans space-y-0.5 ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                }`}>
                  <button
                    onClick={() => { onUndo?.(); setActiveMenu(null); }}
                    disabled={!canUndo}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer ${
                      !canUndo 
                        ? 'opacity-40 cursor-not-allowed' 
                        : (isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200')
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Undo2 className="w-3.5 h-3.5 text-sky-500" />
                      <span>Desfazer</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400">Ctrl+Z</span>
                  </button>

                  <button
                    onClick={() => { onRedo?.(); setActiveMenu(null); }}
                    disabled={!canRedo}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer ${
                      !canRedo 
                        ? 'opacity-40 cursor-not-allowed' 
                        : (isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200')
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Redo2 className="w-3.5 h-3.5 text-sky-500" />
                      <span>Refazer</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400">Ctrl+Y</span>
                  </button>

                  <div className={`my-1 border-t ${isLight ? 'border-slate-200' : 'border-zinc-800'}`} />

                  <button
                    onClick={() => { setActiveTool('select'); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <MousePointer className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Modo Seleção (S)</span>
                  </button>

                  <button
                    onClick={() => { setActiveTool('translate'); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Move className="w-3.5 h-3.5 text-sky-500" />
                    <span>Mover Objeto XYZ (M)</span>
                  </button>

                  <button
                    onClick={() => { setActiveTool('rotate'); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Rotacionar (R)</span>
                  </button>

                  <button
                    onClick={() => { onDeleteSelected?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer text-rose-500 ${
                      isLight ? 'hover:bg-rose-50' : 'hover:bg-rose-950/40'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Excluir Seleção (Del)</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. VISUALIZAR */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('Visualizar')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                  activeMenu === 'Visualizar'
                    ? (isLight ? 'bg-sky-100 text-sky-900 font-bold' : 'bg-zinc-800 text-white font-bold')
                    : (isLight ? 'text-slate-700 hover:bg-slate-200 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white')
                }`}
              >
                Visualizar
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === 'Visualizar' && (
                <div className={`absolute top-full left-0 mt-1 w-60 rounded-xl border p-1 shadow-2xl z-50 text-xs font-sans space-y-0.5 ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                }`}>
                  {/* Theme Switch option */}
                  <button
                    onClick={() => { setTheme(isLight ? 'dark' : 'light'); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between font-bold cursor-pointer ${
                      isLight ? 'bg-amber-50 hover:bg-amber-100 text-amber-900' : 'bg-sky-950/50 hover:bg-sky-900/60 text-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isLight ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                      <span>Alternar Tema ({isLight ? 'Mudar p/ Escuro' : 'Mudar p/ Claro'})</span>
                    </div>
                  </button>

                  <div className={`my-1 border-t ${isLight ? 'border-slate-200' : 'border-zinc-800'}`} />

                  <button
                    onClick={() => { setShowPlanes(!showPlanes); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-teal-500" />
                      <span>Planos XYZ</span>
                    </div>
                    {showPlanes && <Check className="w-3.5 h-3.5 text-teal-500 font-bold" />}
                  </button>

                  <button
                    onClick={() => { setShowGrid(!showGrid); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Grid className="w-3.5 h-3.5 text-sky-500" />
                      <span>Grade 3D</span>
                    </div>
                    {showGrid && <Check className="w-3.5 h-3.5 text-sky-500 font-bold" />}
                  </button>

                  <button
                    onClick={() => { onToggleFeatureTree?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5 text-amber-500" />
                      <span>Árvore de Recursos</span>
                    </div>
                  </button>

                  <div className={`my-1 border-t ${isLight ? 'border-slate-200' : 'border-zinc-800'}`} />

                  {(['shaded', 'edges', 'wireframe', 'xray'] as DisplayMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { setDisplayMode(mode); setActiveMenu(null); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                        displayMode === mode
                          ? (isLight ? 'bg-sky-50 text-sky-700 font-bold' : 'bg-zinc-800 text-sky-300 font-bold')
                          : (isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200')
                      }`}
                    >
                      <span className="capitalize">
                        {mode === 'shaded' ? 'Sombreado' : mode === 'edges' ? 'Sombreado + Arestas' : mode === 'wireframe' ? 'Wireframe' : 'Raio-X Seccional'}
                      </span>
                      {displayMode === mode && <Check className="w-3.5 h-3.5 text-sky-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. GEOMETRIA */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('Geometria')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                  activeMenu === 'Geometria'
                    ? (isLight ? 'bg-sky-100 text-sky-900 font-bold' : 'bg-zinc-800 text-white font-bold')
                    : (isLight ? 'text-slate-700 hover:bg-slate-200 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white')
                }`}
              >
                Geometria
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === 'Geometria' && (
                <div className={`absolute top-full left-0 mt-1 w-56 rounded-xl border p-1 shadow-2xl z-50 text-xs font-sans space-y-0.5 ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                }`}>
                  <button
                    onClick={() => { onOpenNewSketch(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Novo Esboço 2D</span>
                  </button>

                  <button
                    onClick={() => { onOpenExtrudeModal(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Extrusão 3D</span>
                  </button>

                  <button
                    onClick={() => { onOpenRevolveModal(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5 text-orange-500" />
                    <span>Revolução 3D</span>
                  </button>

                  <button
                    onClick={() => { onOpenLoftModal(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Combine className="w-3.5 h-3.5 text-purple-500" />
                    <span>Loft Entre Perfis</span>
                  </button>

                  <button
                    onClick={() => { onOpenFrameModal(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 text-sky-500" />
                    <span>Gerador Tubo / Chassi</span>
                  </button>

                  <button
                    onClick={() => { onOpenPipeMiterModal(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5 text-teal-500" />
                    <span>Corte & Junção Miter</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. FERRAMENTAS */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('Ferramentas')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                  activeMenu === 'Ferramentas'
                    ? (isLight ? 'bg-sky-100 text-sky-900 font-bold' : 'bg-zinc-800 text-white font-bold')
                    : (isLight ? 'text-slate-700 hover:bg-slate-200 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white')
                }`}
              >
                Ferramentas
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === 'Ferramentas' && (
                <div className={`absolute top-full left-0 mt-1 w-64 rounded-xl border p-1 shadow-2xl z-50 text-xs font-sans space-y-0.5 ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                }`}>
                  <button
                    onClick={() => { onOpenCFDModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Wind className="w-3.5 h-3.5 text-sky-500" />
                    <span>Simulação Aerodinâmica CFD</span>
                  </button>

                  <button
                    onClick={() => { onOpenFEAModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-rose-500" />
                    <span>Análise Tensional FEA (Elementos Finitos)</span>
                  </button>

                  <button
                    onClick={() => { onOpenMassInertiaModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 text-purple-500" />
                    <span>Propriedades de Massa & Centro CoG</span>
                  </button>

                  <button
                    onClick={() => { onOpenPartsLibraryModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-amber-500" />
                    <span>Biblioteca ISO / ANSI Hardware</span>
                  </button>

                  <button
                    onClick={() => { setActiveTool('measure'); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Ruler className="w-3.5 h-3.5 text-amber-500" />
                    <span>Paquímetro & Inspeção 3D</span>
                  </button>

                  <div className={`my-1 border-t ${isLight ? 'border-slate-200' : 'border-zinc-800'}`} />

                  <button
                    onClick={() => { onOpenTeamModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-teal-500" />
                    <span>Gerenciamento de Equipe</span>
                  </button>

                  <button
                    onClick={() => { onOpenModeModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Alterar Modo de Engenharia</span>
                  </button>
                </div>
              )}
            </div>

            {/* 6. JANELA */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('Janela')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                  activeMenu === 'Janela'
                    ? (isLight ? 'bg-sky-100 text-sky-900 font-bold' : 'bg-zinc-800 text-white font-bold')
                    : (isLight ? 'text-slate-700 hover:bg-slate-200 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white')
                }`}
              >
                Janela
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === 'Janela' && (
                <div className={`absolute top-full left-0 mt-1 w-56 rounded-xl border p-1 shadow-2xl z-50 text-xs font-sans space-y-0.5 ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                }`}>
                  <button
                    onClick={() => { onToggleFeatureTree?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-sky-500" />
                    <span>Árvore de Recursos</span>
                  </button>

                  <button
                    onClick={() => { onOpenCFDModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Wind className="w-3.5 h-3.5 text-sky-500" />
                    <span>Túnel CFD Aerodinâmico</span>
                  </button>

                  <button
                    onClick={() => { onOpenPartsLibraryModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-amber-500" />
                    <span>Biblioteca ISO Hardware</span>
                  </button>

                  <div className={`my-1 border-t ${isLight ? 'border-slate-200' : 'border-zinc-800'}`} />

                  <button
                    onClick={() => { onResetLayout?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Resetar Layout de Janelas</span>
                  </button>
                </div>
              )}
            </div>

            {/* 7. ATALHOS */}
            <div className="relative">
              <button
                onClick={() => { onShowKeyboardShortcuts?.(); }}
                className={`px-2.5 py-1 rounded-md font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  isLight 
                    ? 'bg-amber-100/80 hover:bg-amber-200 text-amber-900 border border-amber-300' 
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
                title="Abrir Painel de Atalhos de Teclado"
              >
                <Keyboard className="w-3.5 h-3.5 text-amber-500" />
                <span>Atalhos</span>
              </button>
            </div>

            {/* 8. AJUDA */}
            <div className="relative">
              <button
                onClick={() => toggleMenu('Ajuda')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                  activeMenu === 'Ajuda'
                    ? (isLight ? 'bg-sky-100 text-sky-900 font-bold' : 'bg-zinc-800 text-white font-bold')
                    : (isLight ? 'text-slate-700 hover:bg-slate-200 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white')
                }`}
              >
                Ajuda
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === 'Ajuda' && (
                <div className={`absolute top-full left-0 mt-1 w-56 rounded-xl border p-1 shadow-2xl z-50 text-xs font-sans space-y-0.5 ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                }`}>
                  <button
                    onClick={() => { onShowKeyboardShortcuts?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Keyboard className="w-3.5 h-3.5 text-amber-500" />
                    <span>Atalhos de Teclado</span>
                  </button>

                  <button
                    onClick={() => { onOpenLoginModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-sky-500" />
                    <span>Perfil & Credenciais</span>
                  </button>

                  <div className={`my-1 border-t ${isLight ? 'border-slate-200' : 'border-zinc-800'}`} />

                  <button
                    onClick={() => { onShowAboutModal?.(); setActiveMenu(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5 text-teal-500" />
                    <span>Sobre o CADMNAnimat v3.2</span>
                  </button>
                </div>
              )}
            </div>

          </nav>
        </div>

        {/* Right side controls: Shortcuts, Theme Switch Button & Template Selector */}
        <div className="flex items-center gap-3 text-xs">
          
          {/* Top Quick Keyboard Shortcuts Badge Bar */}
          <div className={`hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono select-none ${
            isLight
              ? 'bg-amber-100/90 border-amber-300 text-amber-900'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            <span className="font-bold text-amber-500 flex items-center gap-1">
              <Keyboard className="w-3.5 h-3.5 text-amber-500" />
              Atalhos:
            </span>
            <span className="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded border border-zinc-700 font-bold">M</span><span>Mover</span>
            <span className="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded border border-zinc-700 font-bold">R</span><span>Rotacionar</span>
            <span className="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded border border-zinc-700 font-bold">S</span><span>Escalar</span>
            <span className="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded border border-zinc-700 font-bold">V</span><span>Selecionar</span>
            <span className="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded border border-zinc-700 font-bold">P</span><span>Medir</span>
            <span className="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded border border-zinc-700 font-bold">Ctrl+Z</span><span>Desfazer</span>
            <span className="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded border border-zinc-700 font-bold">Del</span><span>Excluir</span>
          </div>

          {/* Quick 1-Click Theme Switcher Button */}
          <button
            type="button"
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 font-sans font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
              isLight
                ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-sky-300'
            }`}
            title={isLight ? "Alternar para Modo Escuro (Dark Mode)" : "Alternar para Modo Claro (Light Mode)"}
          >
            {isLight ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Modo Escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            )}
          </button>

          <div className={`h-4 w-px ${isLight ? 'bg-slate-300' : 'bg-zinc-800'}`} />

          {/* Template Selector */}
          <div className="flex items-center gap-2">
            <span className={`font-sans font-medium text-[11px] hidden sm:inline ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}>
              MODELO:
            </span>
            <div className="relative">
              <select
                onChange={(e) => onLoadTemplate(e.target.value)}
                className={`text-xs px-3 py-1 pr-7 rounded-lg border focus:outline-none cursor-pointer appearance-none font-bold shadow-sm transition-all ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 focus:ring-2 focus:ring-sky-500/50' 
                    : 'bg-zinc-900 border-zinc-700/80 text-cyan-300 focus:ring-2 focus:ring-sky-500/50'
                }`}
              >
                <option value="formula_chassis">Chassi Tubular Baja SAE / Formula</option>
                <option value="airplane_wing">Asa de Avião NACA 2412 (Aerofólio)</option>
                <option value="spur_gear">Engrenagem Cilíndrica Z18 (Mecânica)</option>
                <option value="drone_frame">Chassi Drone FPV 5" (Fibra de Carbono)</option>
              </select>
              <ChevronDown className={`w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                isLight ? 'text-slate-500' : 'text-zinc-400'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Ribbon Toolbar com Agrupamentos Arredondados */}
      <div className={`p-1.5 flex items-center gap-2 overflow-x-auto scrollbar-none transition-colors ${
        isLight ? 'bg-slate-100' : 'bg-zinc-900/90'
      }`}>
        
        {/* Agrupamento 1: Seleção e Manipulação Tridimensional (Gizmo) */}
        <div className={`flex items-center p-1 rounded-xl gap-1 border shadow-inner ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/80 border-zinc-800'
        }`}>
          <button
            onClick={() => setActiveTool('select')}
            title="Ferramenta de Seleção Tridimensional (Atalho: S)"
            className={`px-2.5 py-1.5 flex items-center gap-1 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${
              activeTool === 'select'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : (isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white')
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>Seleção</span>
          </button>

          <button
            onClick={() => setActiveTool('translate')}
            title="Mover Objeto nos eixos X, Y e Z (Atalho: M)"
            className={`px-2.5 py-1.5 flex items-center gap-1 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${
              activeTool === 'translate'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                : (isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white')
            }`}
          >
            <Move className="w-3.5 h-3.5 text-sky-500" />
            <span>Mover X,Y,Z</span>
          </button>

          <button
            onClick={() => setActiveTool('rotate')}
            title="Rotacionar Objeto nos eixos X, Y e Z (Atalho: R)"
            className={`px-2.5 py-1.5 flex items-center gap-1 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${
              activeTool === 'rotate'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : (isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white')
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
            <span>Rotacionar</span>
          </button>

          <button
            onClick={() => setActiveTool('scale')}
            title="Escalar Objeto nos eixos X, Y e Z"
            className={`px-2.5 py-1.5 flex items-center gap-1 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${
              activeTool === 'scale'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : (isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white')
            }`}
          >
            <Maximize className="w-3.5 h-3.5 text-purple-500" />
            <span>Escalar</span>
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'measure' ? 'select' : 'measure')}
            title="Paquímetro Digital & Inspeção"
            className={`px-2.5 py-1.5 flex items-center gap-1 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${
              activeTool === 'measure'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : (isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white')
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-amber-500" />
            <span>Paquímetro</span>
          </button>
        </div>

        {/* Agrupamento 2: Esboços e Geometria 2D */}
        <div className={`flex items-center p-1 rounded-xl gap-1.5 border shadow-inner ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/80 border-zinc-800'
        }`}>
          <button
            onClick={onOpenNewSketch}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-600/25 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Esboço 2D</span>
          </button>

          <div className={`flex items-center gap-1 px-1 border-l pl-2 ${isLight ? 'border-slate-300' : 'border-zinc-800'}`}>
            <span className={`text-[11px] font-medium mr-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Plano:</span>
            {(['Top', 'Front', 'Right'] as PlaneType[]).map((plane) => (
              <button
                key={plane}
                onClick={() => setActivePlane(plane)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                  activePlane === plane
                    ? (isLight ? 'bg-slate-200 text-teal-800 border border-teal-600 shadow-sm' : 'bg-zinc-800 text-teal-300 border border-teal-500/50 shadow-sm')
                    : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60')
                }`}
              >
                {plane === 'Top' ? 'Superior' : plane === 'Front' ? 'Frontal' : 'Lateral'}
              </button>
            ))}
          </div>
        </div>

        {/* Agrupamento 3: Modificadores 3D e Chassis */}
        <div className={`flex items-center p-1 rounded-xl gap-1 border shadow-inner ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/80 border-zinc-800'
        }`}>
          <button
            onClick={onOpenFrameModal}
            className={`px-3 py-1.5 border text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm cursor-pointer ${
              isLight 
                ? 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-800' 
                : 'bg-sky-500/20 hover:bg-sky-500/30 border-sky-500/40 text-sky-200'
            }`}
            title="Gerar tubos de chassi a partir de linhas de esboço"
          >
            <Wrench className="w-3.5 h-3.5 text-sky-500" />
            <span>Gerador Tubo/Chassi</span>
          </button>

          <button
            onClick={onOpenPipeMiterModal}
            className={`px-3 py-1.5 border text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm cursor-pointer ${
              isLight 
                ? 'bg-teal-50 hover:bg-teal-100 border-teal-300 text-teal-800' 
                : 'bg-teal-500/20 hover:bg-teal-500/30 border-teal-500/40 text-teal-200'
            }`}
            title="Ferramenta de corte de tubo e junção miter 45 graus"
          >
            <Scissors className="w-3.5 h-3.5 text-teal-500" />
            <span>Corte & Junção</span>
          </button>

          <button
            onClick={onOpenExtrudeModal}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-200 active:scale-95 cursor-pointer ${
              isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-emerald-500" />
            <span>Extrusão</span>
          </button>

          <button
            onClick={onOpenRevolveModal}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-200 active:scale-95 cursor-pointer ${
              isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 text-orange-500" />
            <span>Revolução</span>
          </button>

          <button
            onClick={onOpenLoftModal}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-200 active:scale-95 cursor-pointer ${
              isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950' : 'text-zinc-300 hover:bg-zinc-800/90 hover:text-white'
            }`}
          >
            <Combine className="w-3.5 h-3.5 text-purple-500" />
            <span>Loft</span>
          </button>
        </div>

        {/* Agrupamento 3.5: CFD Aerodinâmica & Biblioteca de Peças ISO */}
        <div className={`flex items-center p-1 rounded-xl gap-1 border shadow-inner ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/80 border-zinc-800'
        }`}>
          <button
            onClick={onOpenCFDModal}
            className={`px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm cursor-pointer ${
              isLight
                ? 'bg-sky-100 hover:bg-sky-200 border-sky-400 text-sky-900'
                : 'bg-gradient-to-r from-sky-500/20 to-teal-500/20 hover:from-sky-500/30 hover:to-teal-500/30 border-sky-400/50 text-sky-300'
            }`}
            title="Abrir Janela de Simulação Aerodinâmica e Túnel de Vento CFD 3D"
          >
            <Wind className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            <span>Simulação CFD</span>
          </button>

          <button
            onClick={onOpenPartsLibraryModal}
            className={`px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm cursor-pointer ${
              isLight
                ? 'bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-900'
                : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border-amber-400/50 text-amber-200'
            }`}
            title="Biblioteca de Peças Padrão Industrial (Parafusos, Porcas, Rolamentos ISO/DIN)"
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span>Biblioteca ISO/ANSI</span>
          </button>
        </div>

        {/* Agrupamento 4: Visualização e Câmera */}
        <div className={`flex items-center p-1 rounded-xl gap-1 border shadow-inner ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/80 border-zinc-800'
        }`}>
          <button
            onClick={() => setShowPlanes(!showPlanes)}
            className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-150 cursor-pointer ${
              showPlanes 
                ? (isLight ? 'bg-slate-200 text-teal-800' : 'bg-zinc-800 text-teal-300') 
                : (isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-zinc-400 hover:bg-zinc-800/60')
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Planos</span>
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-150 cursor-pointer ${
              showGrid 
                ? (isLight ? 'bg-slate-200 text-teal-800' : 'bg-zinc-800 text-teal-300') 
                : (isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-zinc-400 hover:bg-zinc-800/60')
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grade</span>
          </button>

          <button
            onClick={() => setSectionView(!sectionView)}
            className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-150 cursor-pointer ${
              sectionView 
                ? (isLight ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40') 
                : (isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-zinc-400 hover:bg-zinc-800/60')
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-rose-500" />
            <span>Corte 3D</span>
          </button>

          <div className={`relative border-l pl-1 ${isLight ? 'border-slate-300' : 'border-zinc-800'}`}>
            <select
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
              className={`text-xs font-bold rounded-lg px-2.5 py-1 pr-6 focus:outline-none cursor-pointer appearance-none ${
                isLight 
                  ? 'bg-slate-100 border border-slate-300 text-slate-800' 
                  : 'bg-zinc-900 border border-zinc-700/70 text-sky-300'
              }`}
            >
              <option value="shaded">Sombreado</option>
              <option value="edges">Sombreado + Arestas</option>
              <option value="wireframe">Wireframe</option>
              <option value="xray">Raio-X Seccional</option>
            </select>
            <ChevronDown className={`w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${
              isLight ? 'text-slate-500' : 'text-zinc-400'
            }`} />
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
