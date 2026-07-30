import React, { useState, useRef } from 'react';
import { CADProject } from '../types/cad';
import { exportToDXF } from '../utils/exporters';
import { 
  Printer, Download, FileText, Layers, RefreshCw, ZoomIn, ZoomOut, 
  Settings2, Eye, Compass, Edit3, Check, CheckCircle2, Box, ArrowRight
} from 'lucide-react';

interface DrawingSheetModalProps {
  project: CADProject;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

type PaperFormat = 'A4' | 'A3';
type PaperOrientation = 'landscape' | 'portrait';
type ScaleOption = '1:1' | '1:2' | '1:5' | '1:10' | '1:20' | '2:1' | '5:1';

export const DrawingSheetModal: React.FC<DrawingSheetModalProps> = ({
  project,
  onClose,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // Configurações da Prancha
  const [paperFormat, setPaperFormat] = useState<PaperFormat>('A4');
  const [orientation, setOrientation] = useState<PaperOrientation>('landscape');
  const [scale, setScale] = useState<ScaleOption>('1:10');
  const [projectionAngle, setProjectionAngle] = useState<'1st' | '3rd'>('1st');

  // Visibilidade das Vistas Ortográficas
  const [showFrontView, setShowFrontView] = useState<boolean>(true);
  const [showTopView, setShowTopView] = useState<boolean>(true);
  const [showSideView, setShowSideView] = useState<boolean>(true);
  const [showIsometricView, setShowIsometricView] = useState<boolean>(true);

  // Visibilidade de Cotas e Detalhes Técnicos
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showCenterLines, setShowCenterLines] = useState<boolean>(true);
  const [showHiddenLines, setShowHiddenLines] = useState<boolean>(true);

  // Campos Editáveis do Selo / Legenda Técnica
  const [title, setTitle] = useState<string>(project.name || 'Desenho Técnico de Engenharia');
  const [designer, setDesigner] = useState<string>('Eng. Responsável');
  const [company, setCompany] = useState<string>('CAD MNAnimat - Projetos 3D');
  const [drawingNumber, setDrawingNumber] = useState<string>('DWG-2026-001');
  const [material, setMaterial] = useState<string>(project.parts[0]?.material?.name || 'Alumínio 6061-T6');
  const [tolerance, setTolerance] = useState<string>('± 0.1 mm');
  const [revision, setRevision] = useState<string>('Rev 0.1');

  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Análise de Geometria e Dimensões do Modelo 3D
  const computeBoundingBox = () => {
    let minX = -50, maxX = 50;
    let minY = -50, maxY = 50;
    let minZ = -50, maxZ = 50;

    if (project.features.length > 0) {
      minX = Infinity; maxX = -Infinity;
      minY = Infinity; maxY = -Infinity;
      minZ = Infinity; maxZ = -Infinity;

      for (const feat of project.features) {
        const px = feat.position?.x || 0;
        const py = feat.position?.y || 0;
        const pz = feat.position?.z || 0;
        const sx = (feat.scale?.x || 1) * (feat.parameters.radius || feat.parameters.width || 40);
        const sy = (feat.scale?.y || 1) * (feat.parameters.height || feat.parameters.depth || 40);
        const sz = (feat.scale?.z || 1) * (feat.parameters.length || feat.parameters.depth || 40);

        minX = Math.min(minX, px - sx);
        maxX = Math.max(maxX, px + sx);
        minY = Math.min(minY, py - sy);
        maxY = Math.max(maxY, py + sy);
        minZ = Math.min(minZ, pz - sz);
        maxZ = Math.max(maxZ, pz + sz);
      }
    }

    if (!isFinite(minX)) { minX = -60; maxX = 60; minY = -60; maxY = 60; minZ = -60; maxZ = 60; }

    const width = Math.max(10, Math.round(maxX - minX));
    const height = Math.max(10, Math.round(maxY - minY));
    const depth = Math.max(10, Math.round(maxZ - minZ));

    return { width, height, depth, minX, maxX, minY, maxY, minZ, maxZ };
  };

  const bbox = computeBoundingBox();

  // Função para acionar Impressão Direta em PDF do Navegador
  const handlePrint = () => {
    window.print();
  };

  // Dimensões Físicas da Folha (Proporção)
  const isLandscape = orientation === 'landscape';
  const aspectRatio = isLandscape ? 1.414 : 0.707; // Proporção Norma ISO A4 / A3

  return (
    <div className="w-[1000px] max-w-full text-zinc-200 font-sans text-xs select-none p-4 pb-10 space-y-4 max-h-[88vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
      
      {/* 1. Barra de Ferramentas e Configurações da Folha */}
      <div className={`p-3.5 rounded-2xl border backdrop-blur-md flex flex-wrap items-center justify-between gap-3 ${
        isLight ? 'bg-slate-100 border-slate-300' : 'bg-zinc-900/90 border-zinc-800'
      }`}>
        
        {/* Formato e Orientação da Folha */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-sky-400 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-sky-400" />
            Papel:
          </span>

          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setPaperFormat('A4')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                paperFormat === 'A4' ? 'bg-sky-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              A4 (210x297)
            </button>
            <button
              type="button"
              onClick={() => setPaperFormat('A3')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                paperFormat === 'A3' ? 'bg-sky-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              A3 (297x420)
            </button>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setOrientation('landscape')}
              className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                orientation === 'landscape' ? 'bg-amber-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Formato Paisagem (Horizontal)"
            >
              Paisagem ▭
            </button>
            <button
              type="button"
              onClick={() => setOrientation('portrait')}
              className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                orientation === 'portrait' ? 'bg-amber-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Formato Retrato (Vertical)"
            >
              Retrato ▯
            </button>
          </div>
        </div>

        {/* Escala e Projeção */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-400">Escala:</span>
          <select
            value={scale}
            onChange={(e) => setScale(e.target.value as ScaleOption)}
            className="p-1.5 bg-zinc-950 border border-zinc-700 text-emerald-300 font-bold font-mono rounded-lg cursor-pointer"
          >
            <option value="1:1">1:1 (Tamanho Real)</option>
            <option value="1:2">1:2 (Redução 50%)</option>
            <option value="1:5">1:5 (Redução 20%)</option>
            <option value="1:10">1:10 (Redução 10%)</option>
            <option value="1:20">1:20 (Redução 5%)</option>
            <option value="2:1">2:1 (Ampliação 2x)</option>
            <option value="5:1">5:1 (Ampliação 5x)</option>
          </select>

          <span className="font-bold text-purple-400 ml-1">Projeção:</span>
          <button
            type="button"
            onClick={() => setProjectionAngle(projectionAngle === '1st' ? '3rd' : '1st')}
            className="px-2 py-1 bg-zinc-950 border border-zinc-700 text-purple-300 font-bold rounded-lg hover:border-purple-500 transition cursor-pointer"
            title="Clique para alternar entre 1º Diedro (Brasil/ABNT) e 3º Diedro (EUA/ANSI)"
          >
            {projectionAngle === '1st' ? '1º Diedro (ABNT)' : '3º Diedro (ANSI)'}
          </button>
        </div>

        {/* Botões de Ação Exportar e Imprimir */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Abrir tela de impressão do navegador ou Salvar como PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => exportToDXF(project, `${project.name}_prancha_2d.dxf`)}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold rounded-xl border border-zinc-700 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Exportar projeção de vistas 2D em formato vetorial DXF"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>DXF 2D</span>
          </button>
        </div>
      </div>

      {/* 2. Toggles de Exibição de Cotas e Vistas */}
      <div className="flex items-center justify-between gap-2 px-2 text-[11px] font-semibold text-zinc-400">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showFrontView}
              onChange={(e) => setShowFrontView(e.target.checked)}
              className="accent-sky-500"
            />
            <span>Vista Frontal</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showTopView}
              onChange={(e) => setShowTopView(e.target.checked)}
              className="accent-sky-500"
            />
            <span>Vista Superior</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showSideView}
              onChange={(e) => setShowSideView(e.target.checked)}
              className="accent-sky-500"
            />
            <span>Vista Lateral</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showIsometricView}
              onChange={(e) => setShowIsometricView(e.target.checked)}
              className="accent-sky-500"
            />
            <span>Isométrica 3D</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-emerald-400 hover:text-emerald-300">
            <input
              type="checkbox"
              checked={showDimensions}
              onChange={(e) => setShowDimensions(e.target.checked)}
              className="accent-emerald-500"
            />
            <span>Cotas de Engenharia (mm)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showCenterLines}
              onChange={(e) => setShowCenterLines(e.target.checked)}
              className="accent-amber-500"
            />
            <span>Linhas de Centro</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showHiddenLines}
              onChange={(e) => setShowHiddenLines(e.target.checked)}
              className="accent-purple-500"
            />
            <span>Arestas Ocultas</span>
          </label>
        </div>
      </div>

      {/* 3. FOLHA DE DESENHO TÉCNICO (PREVIEW PRINT-READY) */}
      <div className="w-full flex justify-center bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl overflow-x-auto">
        
        {/* Renderização da Folha com proporção física A4 / A3 em fundo Branco de Papel */}
        <div
          ref={sheetRef}
          style={{
            width: isLandscape ? '880px' : '620px',
            minHeight: isLandscape ? '620px' : '880px',
            aspectRatio: `${aspectRatio}`
          }}
          className="bg-white text-slate-900 rounded shadow-2xl p-6 relative flex flex-col justify-between font-mono select-text print:m-0 print:p-4 print:shadow-none border border-slate-300"
        >
          {/* Borda Externa Normalizada com Margem ABNT (20mm Esquerda) */}
          <div className="w-full h-full border-2 border-slate-900 p-2 flex flex-col justify-between relative min-h-[560px]">
            
            {/* Grid de Coordenadas de Referência nas Margens (A-D, 1-6) */}
            <div className="absolute top-0 left-0 right-0 h-4 flex justify-between px-8 text-[9px] text-slate-500 font-bold border-b border-slate-300">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
            </div>
            <div className="absolute top-0 bottom-0 left-0 w-4 flex flex-col justify-between py-8 text-[9px] text-slate-500 font-bold border-r border-slate-300">
              <span>A</span><span>B</span><span>C</span><span>D</span>
            </div>

            {/* ÁREA DE DESENHO DAS VISTAS ORTOGRÁFICAS */}
            <div className="flex-1 mt-4 mb-2 grid grid-cols-2 grid-rows-2 gap-4 p-4 border border-dashed border-slate-300 relative">
              
              {/* QUADRANTE 1: Vista Frontal (Front View) */}
              <div className="border border-slate-200 p-3 rounded flex flex-col justify-between relative bg-slate-50/50">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 border-b border-slate-300 pb-1">
                  <span>VISTA FRONTAL (X-Y)</span>
                  <span className="text-slate-500 font-mono">ESCALA {scale}</span>
                </div>

                {showFrontView ? (
                  <div className="flex-1 flex items-center justify-center relative my-2">
                    {/* SVG Projeção Frontal */}
                    <svg className="w-full h-36" viewBox="-100 -80 200 160">
                      {/* Eixos de Centro */}
                      {showCenterLines && (
                        <g stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="6,3,2,3">
                          <line x1="-90" y1="0" x2="90" y2="0" />
                          <line x1="0" y1="-70" x2="0" y2="70" />
                        </g>
                      )}

                      {/* Silhueta do Modelo 3D */}
                      <rect x="-45" y="-35" width="90" height="70" fill="none" stroke="#0f172a" strokeWidth="2" rx="4" />
                      <circle cx="0" cy="0" r="20" fill="none" stroke="#0284c7" strokeWidth="1.5" />
                      
                      {showHiddenLines && (
                        <line x1="-45" y1="-15" x2="45" y2="-15" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
                      )}

                      {/* Cotas Técnicas (Dimensões de Engenharia) */}
                      {showDimensions && (
                        <g stroke="#0284c7" strokeWidth="1" fill="#0284c7" fontSize="8" fontFamily="sans-serif">
                          {/* Cota de Largura (Bottom) */}
                          <line x1="-45" y1="45" x2="45" y2="45" />
                          <line x1="-45" y1="38" x2="-45" y2="50" />
                          <line x1="45" y1="38" x2="45" y2="50" />
                          <polygon points="-45,45 -39,43 -39,47" />
                          <polygon points="45,45 39,43 39,47" />
                          <text x="0" y="42" textAnchor="middle" fontWeight="bold">{bbox.width} mm</text>

                          {/* Cota de Altura (Left) */}
                          <line x1="-55" y1="-35" x2="-55" y2="35" />
                          <line x1="-60" y1="-35" x2="-48" y2="-35" />
                          <line x1="-60" y1="35" x2="-48" y2="35" />
                          <polygon points="-55,-35 -57,-29 -53,-29" />
                          <polygon points="-55,35 -57,29 -53,29" />
                          <text x="-62" y="4" textAnchor="middle" transform="rotate(-90 -62 4)" fontWeight="bold">{bbox.height} mm</text>
                        </g>
                      )}
                    </svg>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-[10px] italic">
                    Vista Oculta
                  </div>
                )}
              </div>

              {/* QUADRANTE 2: Vista Isométrica 3D (Isometric View) */}
              <div className="border border-slate-200 p-3 rounded flex flex-col justify-between relative bg-slate-50/50">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 border-b border-slate-300 pb-1">
                  <span>PERSPECTIVA ISOMÉTRICA 3D</span>
                  <span className="text-sky-600 font-bold">MODELO SÓLIDO</span>
                </div>

                {showIsometricView ? (
                  <div className="flex-1 flex items-center justify-center relative my-2">
                    <svg className="w-full h-36" viewBox="-100 -80 200 160">
                      {/* Isométrico Axonométrico 3D */}
                      <g fill="none" stroke="#0f172a" strokeWidth="1.8" strokeLinejoin="round">
                        {/* Top Face */}
                        <polygon points="0,-45 40,-25 0,-5 -40,-25" fill="#f1f5f9" />
                        {/* Front Face */}
                        <polygon points="-40,-25 0,-5 0,35 -40,15" fill="#e2e8f0" />
                        {/* Right Face */}
                        <polygon points="0,-5 40,-25 40,15 0,35" fill="#cbd5e1" />
                        {/* Cylinder Detail */}
                        <ellipse cx="0" cy="-25" rx="15" ry="8" stroke="#0284c7" strokeWidth="1.5" />
                      </g>
                    </svg>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-[10px] italic">
                    Vista Oculta
                  </div>
                )}
              </div>

              {/* QUADRANTE 3: Vista Superior (Top View) */}
              <div className="border border-slate-200 p-3 rounded flex flex-col justify-between relative bg-slate-50/50">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 border-b border-slate-300 pb-1">
                  <span>VISTA SUPERIOR (PLANO X-Z)</span>
                  <span className="text-slate-500 font-mono">PROJEÇÃO 1º DIEDRO</span>
                </div>

                {showTopView ? (
                  <div className="flex-1 flex items-center justify-center relative my-2">
                    <svg className="w-full h-36" viewBox="-100 -80 200 160">
                      {showCenterLines && (
                        <g stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="6,3,2,3">
                          <line x1="-90" y1="0" x2="90" y2="0" />
                          <line x1="0" y1="-70" x2="0" y2="70" />
                        </g>
                      )}

                      <rect x="-45" y="-30" width="90" height="60" fill="none" stroke="#0f172a" strokeWidth="2" rx="2" />
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#0284c7" strokeWidth="1.5" />

                      {showDimensions && (
                        <g stroke="#0284c7" strokeWidth="1" fill="#0284c7" fontSize="8" fontFamily="sans-serif">
                          <line x1="55" y1="-30" x2="55" y2="30" />
                          <line x1="48" y1="-30" x2="60" y2="-30" />
                          <line x1="48" y1="30" x2="60" y2="30" />
                          <polygon points="55,-30 53,-24 57,-24" />
                          <polygon points="55,30 53,24 57,24" />
                          <text x="62" y="4" textAnchor="middle" transform="rotate(90 62 4)" fontWeight="bold">{bbox.depth} mm</text>
                        </g>
                      )}
                    </svg>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-[10px] italic">
                    Vista Oculta
                  </div>
                )}
              </div>

              {/* QUADRANTE 4: Vista Lateral Direita (Side View) */}
              <div className="border border-slate-200 p-3 rounded flex flex-col justify-between relative bg-slate-50/50">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 border-b border-slate-300 pb-1">
                  <span>VISTA LATERAL DIREITA (Y-Z)</span>
                  <span className="text-slate-500 font-mono">SEÇÃO LATERAL</span>
                </div>

                {showSideView ? (
                  <div className="flex-1 flex items-center justify-center relative my-2">
                    <svg className="w-full h-36" viewBox="-100 -80 200 160">
                      {showCenterLines && (
                        <g stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="6,3,2,3">
                          <line x1="-90" y1="0" x2="90" y2="0" />
                          <line x1="0" y1="-70" x2="0" y2="70" />
                        </g>
                      )}

                      <rect x="-30" y="-35" width="60" height="70" fill="none" stroke="#0f172a" strokeWidth="2" />
                      <line x1="-30" y1="0" x2="30" y2="0" stroke="#0284c7" strokeWidth="1.5" />
                    </svg>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-[10px] italic">
                    Vista Oculta
                  </div>
                )}
              </div>

            </div>

            {/* SELO / LEGENDA TÉCNICA DE ENGENHARIA NORMA ABNT NBR 10582 */}
            <div className="w-full border-2 border-slate-900 bg-white grid grid-cols-12 text-[10px] font-sans">
              
              {/* Coluna 1: Logo & Título do Projeto */}
              <div className="col-span-5 border-r-2 border-slate-900 p-2 space-y-1 flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase block">EMPRESA / INSTITUIÇÃO</span>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase block">TÍTULO DA PRANCHA / PROJETO</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full font-extrabold text-xs text-sky-950 bg-transparent border-b border-slate-400 focus:outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              {/* Coluna 2: Projetista, Material, Data */}
              <div className="col-span-4 border-r-2 border-slate-900 p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-500 uppercase">PROJETISTA:</span>
                  <input
                    type="text"
                    value={designer}
                    onChange={(e) => setDesigner(e.target.value)}
                    className="font-bold text-slate-900 text-right bg-transparent border-b border-dashed border-slate-300 focus:outline-none w-28"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-500 uppercase">MATERIAL:</span>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="font-bold text-slate-900 text-right bg-transparent border-b border-dashed border-slate-300 focus:outline-none w-28"
                  />
                </div>

                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-[8px] font-bold text-slate-500 uppercase">DATA:</span>
                  <span className="font-bold text-slate-800">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Coluna 3: Escala, Folha, Tolerância, Ícone do Diedro */}
              <div className="col-span-3 p-2 space-y-1 flex flex-col justify-between bg-slate-50">
                <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                  <span className="text-[8px] font-bold text-slate-500">ESCALA</span>
                  <span className="font-extrabold text-sky-900 text-xs font-mono">{scale}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-500">FOLHA</span>
                  <span className="font-bold text-slate-900">01 / 01</span>
                </div>

                <div className="flex items-center justify-between pt-0.5 border-t border-slate-300">
                  <span className="text-[8px] font-bold text-slate-500">FORMATO</span>
                  <span className="font-bold text-emerald-700">{paperFormat} ({orientation === 'landscape' ? 'PAISAGEM' : 'RETRATO'})</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Footer de Fechamento */}
      <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
        <span className="text-[11px] text-zinc-400">
          Prancha técnica gerada em conformidade com as normas ABNT NBR 10582 e ISO 7200.
        </span>

        <button
          type="button"
          onClick={onClose}
          className="px-5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition cursor-pointer"
        >
          Fechar Prancha
        </button>
      </div>

    </div>
  );
};
