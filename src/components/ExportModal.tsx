import React from 'react';
import * as THREE from 'three';
import { CADProject } from '../types/cad';
import { exportToSTL, exportToOBJ, exportToDXF, exportCADProjectJSON } from '../utils/exporters';
import { Download, FileCode, Printer, Layers, Box, FileText } from 'lucide-react';

interface ExportModalProps {
  project: CADProject;
  onClose: () => void;
  onOpenDrawingSheet?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, onClose, onOpenDrawingSheet }) => {
  const handleExportSTL = () => {
    const scene = new THREE.Scene();
    exportToSTL(scene, `${project.name.toLowerCase().replace(/\s+/g, '_')}.stl`);
  };

  const handleExportOBJ = () => {
    const scene = new THREE.Scene();
    exportToOBJ(scene, `${project.name.toLowerCase().replace(/\s+/g, '_')}.obj`);
  };

  const handleExportDXF = () => {
    exportToDXF(project, `${project.name.toLowerCase().replace(/\s+/g, '_')}.dxf`);
  };

  const handleExportJSON = () => {
    exportCADProjectJSON(project);
  };

  return (
    <div className="w-96 p-4 space-y-2.5 text-zinc-200 font-sans text-xs select-none">
      {/* Prancha Técnica A4 / A3 */}
      {onOpenDrawingSheet && (
        <div 
          onClick={() => { onClose(); onOpenDrawingSheet(); }}
          className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 hover:border-amber-400 cursor-pointer transition-all duration-200 flex items-center justify-between group hover:bg-amber-900/40 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30 group-hover:bg-amber-500/30 transition-all">
              <FileText className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-amber-200 group-hover:text-amber-100 transition-colors">
                Prancha Técnica A4 / A3 (PDF / Imprimir)
              </h3>
              <p className="text-[11px] text-amber-300/80">Vistas Ortográficas, Isométrica, Selo e Cotas</p>
            </div>
          </div>
          <FileText className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />
        </div>
      )}

      {/* Formato STL */}
      <div 
        onClick={handleExportSTL}
        className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/60 cursor-pointer transition-all duration-200 flex items-center justify-between group hover:bg-zinc-900 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
            <Printer className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
              Malha Triangulada STL (.stl)
            </h3>
            <p className="text-[11px] text-zinc-400">Para impressão 3D (Cura, PrusaSlicer, Bambu Studio)</p>
          </div>
        </div>
        <Download className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
      </div>

      {/* Formato OBJ */}
      <div 
        onClick={handleExportOBJ}
        className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-sky-500/60 cursor-pointer transition-all duration-200 flex items-center justify-between group hover:bg-zinc-900 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20 group-hover:bg-sky-500/20 transition-all">
            <Box className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-100 group-hover:text-sky-300 transition-colors">
              Geometria 3D OBJ (.obj)
            </h3>
            <p className="text-[11px] text-zinc-400">Exportação de malha para Blender, Maya e Unreal</p>
          </div>
        </div>
        <Download className="w-4 h-4 text-zinc-500 group-hover:text-sky-400 transition-colors" />
      </div>

      {/* Formato DXF */}
      <div 
        onClick={handleExportDXF}
        className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-orange-500/60 cursor-pointer transition-all duration-200 flex items-center justify-between group hover:bg-zinc-900 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20 group-hover:bg-orange-500/20 transition-all">
            <Layers className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-100 group-hover:text-orange-300 transition-colors">
              Desenho Vetorial DXF (.dxf)
            </h3>
            <p className="text-[11px] text-zinc-400">Vetor 2D para Corte Laser e Usinagem CNC Router</p>
          </div>
        </div>
        <Download className="w-4 h-4 text-zinc-500 group-hover:text-orange-400 transition-colors" />
      </div>

      {/* Formato Projeto CADMNAnimat */}
      <div 
        onClick={handleExportJSON}
        className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/60 cursor-pointer transition-all duration-200 flex items-center justify-between group hover:bg-zinc-900 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
            <FileCode className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-100 group-hover:text-purple-300 transition-colors">
              Arquivo CADMNAnimat (.apexcad)
            </h3>
            <p className="text-[11px] text-zinc-400">Salva histórico parametrizado completo para edição</p>
          </div>
        </div>
        <Download className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors" />
      </div>

      <div className="pt-2 border-t border-zinc-800 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl transition-all cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
