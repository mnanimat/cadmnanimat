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
  Wind
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

  // Renderização 2D no Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Grade de fundo
    ctx.strokeStyle = '#27272a';
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

    // Eixos da Origem (Vermelho = X, Verde = Y)
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

    // Desenha elemento em progresso
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

  }, [elements, drawingPoints, mousePos, gridSize, activeDrawTool]);

  const handleFinish = () => {
    onSaveSketch({
      ...sketch,
      elements
    });
  };

  return (
    <div className="absolute inset-0 bg-zinc-950 z-50 flex flex-col font-sans text-xs select-none animate-fadeIn">
      
      {/* Barra de Ferramentas de Desenho 2D */}
      <div className="h-10 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between text-zinc-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <Plane className="w-4 h-4 text-sky-400" />
            <span>Plano de Desenho Vetorial ({sketch.plane})</span>
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

          {activeDrawTool === 'sketch_airfoil' && (
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-xl text-xs">
              <span className="text-zinc-400 font-medium">NACA:</span>
              <input
                type="text"
                value={airfoilCode}
                onChange={e => setAirfoilCode(e.target.value)}
                className="w-14 bg-zinc-900 border border-zinc-800 text-center text-sky-300 font-bold rounded-lg"
              />
              <span className="text-zinc-400 font-medium">Corda:</span>
              <input
                type="number"
                value={airfoilChord}
                onChange={e => setAirfoilChord(Number(e.target.value))}
                className="w-16 bg-zinc-900 border border-zinc-800 text-center text-sky-300 font-bold rounded-lg"
              />
              <span className="text-zinc-400">mm</span>
            </div>
          )}
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

        {/* Leitura de Coordenadas em Tempo Real */}
        <div className="absolute bottom-4 left-4 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs text-sky-300 font-mono flex items-center gap-3 backdrop-blur-md shadow-lg">
          <span>X: {mousePos.x} mm</span>
          <span>Y: {mousePos.y} mm</span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-400 font-sans">Elementos: {elements.length}</span>
        </div>
      </div>

    </div>
  );
};
