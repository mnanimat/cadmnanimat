import React, { useRef, useState, useEffect } from 'react';
import { 
  Point2D, 
  Sketch2D, 
  SketchElement, 
  ActiveTool 
} from '../types/cad';
import { generateNacaAirfoil } from '../utils/airfoil';
import { 
  Square, 
  Circle, 
  Pentagon, 
  Minus, 
  Plane, 
  Check, 
  X, 
  Grid,
  Wind,
  Box,
  Compass,
  ArrowRight
} from 'lucide-react';

interface SketchCanvasProps {
  sketch: Sketch2D;
  onSaveSketch: (updatedSketch: Sketch2D) => void;
  onCancel: () => void;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({ sketch, onSaveSketch, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elements, setElements] = useState<SketchElement[]>(sketch.elements || []);
  const [activeDrawTool, setActiveDrawTool] = useState<ActiveTool>('sketch_line');
  const [drawingPoints, setDrawingPoints] = useState<Point2D[]>([]);
  const [mousePos, setMousePos] = useState<Point2D>({ x: 0, y: 0 });
  const [airfoilCode, setAirfoilCode] = useState<string>('2412');
  const [airfoilChord, setAirfoilChord] = useState<number>(150);
  const [gridSnap, setGridSnap] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(10);
  const [sketchMode3D, setSketchMode3D] = useState<boolean>(false);
  const [activePlane, setActivePlane] = useState<'XY' | 'XZ' | 'YZ' | '3D Space'>('XY');

  // Interactive Precision Input Fields (mm & degrees)
  const [inputLength, setInputLength] = useState<string>('100');
  const [inputAngle, setInputAngle] = useState<string>('0');
  const [inputDepthZ, setInputDepthZ] = useState<string>('0');

  // Calculates real-time length (mm) and angle (deg) based on start point and current mouse position
  const currentDx = drawingPoints.length > 0 ? mousePos.x - drawingPoints[0].x : 0;
  const currentDy = drawingPoints.length > 0 ? mousePos.y - drawingPoints[0].y : 0;
  const currentLength = Math.round(Math.hypot(currentDx, currentDy));
  const rawAngle = (Math.atan2(currentDy, currentDx) * 180 / Math.PI + 360) % 360;
  const currentAngle = Math.round(rawAngle);

  // Sync inputs with mouse movement when actively drawing
  useEffect(() => {
    if (drawingPoints.length > 0) {
      setInputLength(currentLength.toString());
      setInputAngle(currentAngle.toString());
    }
  }, [mousePos, drawingPoints.length]);

  // Converte coordenadas em pixels do canvas para coordenadas milimétricas do plano CAD
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>): Point2D => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let rawX = e.clientX - rect.left - centerX;
    let rawY = -(e.clientY - rect.top - centerY);

    if (gridSnap) {
      rawX = Math.round(rawX / gridSize) * gridSize;
      rawY = Math.round(rawY / gridSize) * gridSize;
    }

    return { x: rawX, y: rawY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e);
    setMousePos(pos);
  };

  const handleAddLineWithExactDimensions = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const len = parseFloat(inputLength) || 100;
    const ang = parseFloat(inputAngle) || 0;
    const rad = (ang * Math.PI) / 180;

    let startPt = drawingPoints[0] || { x: 0, y: 0 };
    const endPt: Point2D = {
      x: Math.round(startPt.x + len * Math.cos(rad)),
      y: Math.round(startPt.y + len * Math.sin(rad))
    };

    const newElem: SketchElement = {
      id: `elem_${Date.now()}`,
      kind: 'line',
      points: [startPt, endPt]
    };

    setElements(prev => [...prev, newElem]);
    setDrawingPoints([endPt]); // Chain next segment from endpoint
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e);

    if (activeDrawTool === 'sketch_airfoil') {
      const newElem: SketchElement = {
        id: `elem_${Date.now()}`,
        kind: 'airfoil',
        points: [pos],
        airfoilCode,
        chordLength: airfoilChord
      };
      setElements(prev => [...prev, newElem]);
      return;
    }

    if (drawingPoints.length === 0) {
      setDrawingPoints([pos]);
    } else {
      const startPt = drawingPoints[0];
      let newElem: SketchElement | null = null;

      if (activeDrawTool === 'sketch_line') {
        newElem = { id: `elem_${Date.now()}`, kind: 'line', points: [startPt, pos] };
      } else if (activeDrawTool === 'sketch_rect') {
        newElem = { id: `elem_${Date.now()}`, kind: 'rect', points: [startPt, pos] };
      } else if (activeDrawTool === 'sketch_circle') {
        const radius = Math.round(Math.hypot(pos.x - startPt.x, pos.y - startPt.y));
        newElem = { id: `elem_${Date.now()}`, kind: 'circle', points: [startPt], radius };
      } else if (activeDrawTool === 'sketch_polygon') {
        const radius = Math.round(Math.hypot(pos.x - startPt.x, pos.y - startPt.y));
        newElem = { id: `elem_${Date.now()}`, kind: 'polygon', points: [startPt], radius, sides: 6 };
      }

      if (newElem) {
        setElements(prev => [...prev, newElem]);
      }
      setDrawingPoints([]);
    }
  };

  // Renderização 2D / 3D Projection no Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Grade de fundo (com perspectiva se em modo 3D)
    ctx.strokeStyle = sketchMode3D ? '#1e293b' : '#27272a';
    ctx.lineWidth = 0.5;

    for (let x = 0; x < canvas.width; x += gridSize * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize * 2) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Eixos da Origem (Vermelho = X, Verde = Y, Azul = Z para Esboço 3D)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#f43f5e'; // X
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    ctx.strokeStyle = '#10b981'; // Y
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    if (sketchMode3D) {
      ctx.strokeStyle = '#38bdf8'; // Eixo Z Isométrico 3D
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + 300, centerY + 180);
      ctx.stroke();
    }

    const toCanvas = (p: Point2D) => ({
      x: centerX + p.x,
      y: centerY - p.y
    });

    // Desenha elementos já salvos
    for (const elem of elements) {
      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 2;

      if (elem.kind === 'line' && elem.points.length >= 2) {
        const p1 = toCanvas(elem.points[0]);
        const p2 = toCanvas(elem.points[1]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Rótulo de cota milimétrica salva
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const dist = Math.round(Math.hypot(elem.points[1].x - elem.points[0].x, elem.points[1].y - elem.points[0].y));
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px sans-serif';
        ctx.fillText(`${dist} mm`, midX + 5, midY - 5);
      } else if (elem.kind === 'rect' && elem.points.length >= 2) {
        const p1 = toCanvas(elem.points[0]);
        const p2 = toCanvas(elem.points[1]);
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        const w = Math.abs(p2.x - p1.x);
        const h = Math.abs(p2.y - p1.y);
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
      } else if (elem.kind === 'circle' && elem.points.length >= 1) {
        const center = toCanvas(elem.points[0]);
        const r = elem.radius || 20;
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (elem.kind === 'airfoil') {
        const chord = elem.chordLength || 150;
        const pts = generateNacaAirfoil(elem.airfoilCode || '2412', chord, 30);
        if (pts.length > 0) {
          ctx.beginPath();
          const start = toCanvas(pts[0]);
          ctx.moveTo(start.x, start.y);
          for (let i = 1; i < pts.length; i++) {
            const cp = toCanvas(pts[i]);
            ctx.lineTo(cp.x, cp.y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    // Desenha elemento em progresso com cotas dinâmicas de comprimento (mm) e ângulo (°)
    if (drawingPoints.length > 0) {
      const p1 = toCanvas(drawingPoints[0]);
      const p2 = toCanvas(mousePos);

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      if (activeDrawTool === 'sketch_line') {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Arco de ângulo em graus (°)
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        const startAngle = 0;
        const endAngle = - (rawAngle * Math.PI) / 180;
        ctx.arc(p1.x, p1.y, 35, startAngle, endAngle, rawAngle > 180);
        ctx.stroke();

        // Rótulos dinâmicos de Comprimento e Ângulo sobre a linha
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${currentLength} mm | ${currentAngle}°`, midX + 8, midY - 8);
      } else if (activeDrawTool === 'sketch_rect') {
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        const w = Math.abs(p2.x - p1.x);
        const h = Math.abs(p2.y - p1.y);
        ctx.strokeRect(x, y, w, h);
      } else if (activeDrawTool === 'sketch_circle') {
        const r = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }

  }, [elements, drawingPoints, mousePos, gridSize, activeDrawTool, sketchMode3D, rawAngle, currentLength, currentAngle]);

  const handleFinish = () => {
    onSaveSketch({
      ...sketch,
      elements
    });
  };

  return (
    <div className="absolute inset-0 bg-zinc-950 z-50 flex flex-col font-sans text-xs select-none animate-fadeIn">
      
      {/* Barra de Ferramentas de Desenho 2D / 3D */}
      <div className="h-10 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between text-zinc-200">
        <div className="flex items-center gap-4">
          
          {/* Alternador de Modo Esboço 3D */}
          <button
            type="button"
            onClick={() => setSketchMode3D(!sketchMode3D)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs transition border cursor-pointer ${
              sketchMode3D
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-400 shadow-md animate-pulse'
                : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            <Box className="w-4 h-4 text-sky-300" />
            <span>{sketchMode3D ? 'Esboço 3D Ativo (X-Y-Z)' : 'Esboço 2D Plano'}</span>
          </button>

          {/* Seletor de Plano de Trabalho */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-0.5 rounded-xl text-[11px]">
            {(['XY', 'XZ', 'YZ', '3D Space'] as const).map(p => (
              <button
                key={p}
                onClick={() => setActivePlane(p)}
                className={`px-2 py-0.5 rounded-lg font-bold transition ${
                  activePlane === p ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          {/* Ferramentas de Esboço */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 border border-zinc-800 rounded-xl">
            <button
              onClick={() => { setActiveDrawTool('sketch_line'); setDrawingPoints([]); }}
              className={`px-3 py-1 transition-all rounded-lg text-xs flex items-center gap-1.5 font-medium ${
                activeDrawTool === 'sketch_line' ? 'bg-sky-600 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Reta</span>
            </button>

            <button
              onClick={() => { setActiveDrawTool('sketch_rect'); setDrawingPoints([]); }}
              className={`px-3 py-1 transition-all rounded-lg text-xs flex items-center gap-1.5 font-medium ${
                activeDrawTool === 'sketch_rect' ? 'bg-sky-600 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Retângulo</span>
            </button>

            <button
              onClick={() => { setActiveDrawTool('sketch_circle'); setDrawingPoints([]); }}
              className={`px-3 py-1 transition-all rounded-lg text-xs flex items-center gap-1.5 font-medium ${
                activeDrawTool === 'sketch_circle' ? 'bg-sky-600 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Circle className="w-3.5 h-3.5" />
              <span>Círculo</span>
            </button>

            <button
              onClick={() => { setActiveDrawTool('sketch_polygon'); setDrawingPoints([]); }}
              className={`px-3 py-1 transition-all rounded-lg text-xs flex items-center gap-1.5 font-medium ${
                activeDrawTool === 'sketch_polygon' ? 'bg-sky-600 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Pentagon className="w-3.5 h-3.5" />
              <span>Polígono</span>
            </button>

            <button
              onClick={() => { setActiveDrawTool('sketch_airfoil'); setDrawingPoints([]); }}
              className={`px-3 py-1 transition-all rounded-lg text-xs flex items-center gap-1.5 font-medium ${
                activeDrawTool === 'sketch_airfoil' ? 'bg-sky-600 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-teal-300" />
              <span>Perfil NACA</span>
            </button>
          </div>

        </div>

        {/* Botões de Ação Final */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGridSnap(!gridSnap)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-medium transition-all ${
              gridSnap ? 'bg-zinc-950 border-sky-500/50 text-teal-300 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>SNAP (10mm)</span>
          </button>

          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-4 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>

          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Concluir Esboço</span>
          </button>
        </div>
      </div>

      {/* FLOATING HUD BAR: Painel de Precisão de Entrada de Valor em MM e Ângulo em Graus (°) */}
      <div className="bg-zinc-900/95 border-b border-zinc-800 px-6 py-2 flex items-center justify-between text-xs backdrop-blur-md shadow-lg">
        <form onSubmit={handleAddLineWithExactDimensions} className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Compass className="w-4 h-4" />
            <span>Digitar Cotas Paramétricas:</span>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-xl">
            <span className="text-zinc-400 font-medium">Comprimento:</span>
            <input
              type="number"
              step="any"
              value={inputLength}
              onChange={e => setInputLength(e.target.value)}
              className="w-20 bg-zinc-900 border border-zinc-700 text-center text-sky-300 font-mono font-bold rounded-lg px-2 py-0.5"
            />
            <span className="text-sky-400 font-bold">mm</span>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-xl">
            <span className="text-zinc-400 font-medium">Ângulo Relativo:</span>
            <input
              type="number"
              step="any"
              value={inputAngle}
              onChange={e => setInputAngle(e.target.value)}
              className="w-20 bg-zinc-900 border border-zinc-700 text-center text-amber-300 font-mono font-bold rounded-lg px-2 py-0.5"
            />
            <span className="text-amber-400 font-bold">° (graus)</span>
          </div>

          {sketchMode3D && (
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-xl">
              <span className="text-zinc-400 font-medium">Profundidade Z:</span>
              <input
                type="number"
                step="any"
                value={inputDepthZ}
                onChange={e => setInputDepthZ(e.target.value)}
                className="w-20 bg-zinc-900 border border-zinc-700 text-center text-teal-300 font-mono font-bold rounded-lg px-2 py-0.5"
              />
              <span className="text-teal-400 font-bold">mm</span>
            </div>
          )}

          <button
            type="submit"
            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 text-zinc-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <span>Inserir Segmento ({inputLength} mm / {inputAngle}°)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Área de Desenho do Canvas */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={1200}
          height={750}
          onMouseMove={handleMouseMove}
          onClick={handleCanvasClick}
          className="bg-zinc-950 border border-zinc-800 shadow-2xl rounded-lg"
        />

        {/* Leitura de Coordenadas e Cotas Dinâmicas em Tempo Real */}
        <div className="absolute bottom-4 left-4 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs text-sky-300 font-mono flex items-center gap-3 backdrop-blur-md shadow-lg">
          <span>X: {mousePos.x} mm</span>
          <span>Y: {mousePos.y} mm</span>
          {sketchMode3D && <span className="text-teal-300">Z: {inputDepthZ} mm</span>}
          <span className="text-zinc-700">|</span>
          <span className="text-amber-300 font-bold">Comprimento: {currentLength} mm</span>
          <span className="text-amber-300 font-bold">Ângulo: {currentAngle}°</span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-400 font-sans">Elementos: {elements.length}</span>
        </div>
      </div>

    </div>
  );
};
