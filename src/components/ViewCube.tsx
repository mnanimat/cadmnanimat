import React from 'react';
import { Compass } from 'lucide-react';

interface ViewCubeProps {
  onSelectView: (view: 'Top' | 'Front' | 'Right' | 'Isometric' | 'Left' | 'Back' | 'Bottom') => void;
  activeView?: string;
}

export const ViewCube: React.FC<ViewCubeProps> = ({ onSelectView, activeView }) => {
  return (
    <div className="relative group bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 shadow-2xl text-xs select-none">
      <div className="flex items-center justify-between gap-2 px-1 mb-1.5 border-b border-slate-800 pb-1">
        <div className="flex items-center gap-1 text-slate-300 font-semibold tracking-wide text-[10px]">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>VIEW CUBE</span>
        </div>
        <button
          onClick={() => onSelectView('Isometric')}
          title="Visão Isométrica"
          className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 hover:bg-cyan-800/80 transition-colors font-mono"
        >
          ISO
        </button>
      </div>

      {/* Isometric 3D Cube Representation */}
      <div className="w-24 h-24 relative flex items-center justify-center my-1 mx-auto">
        {/* Top Face */}
        <button
          onClick={() => onSelectView('Top')}
          className={`absolute top-0 w-16 h-6 rounded-t border transition-all text-[10px] font-bold flex items-center justify-center ${
            activeView === 'Top'
              ? 'bg-cyan-600 text-white border-cyan-300 shadow-lg shadow-cyan-500/50'
              : 'bg-slate-800/90 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white'
          }`}
        >
          TOP
        </button>

        {/* Left / Right / Front Row */}
        <div className="flex gap-1 items-center justify-center my-auto">
          <button
            onClick={() => onSelectView('Left')}
            className={`w-7 h-10 rounded-l border transition-all text-[9px] font-bold flex items-center justify-center ${
              activeView === 'Left'
                ? 'bg-cyan-600 text-white border-cyan-300'
                : 'bg-slate-800/90 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white'
            }`}
          >
            L
          </button>
          <button
            onClick={() => onSelectView('Front')}
            className={`w-10 h-10 border transition-all text-[10px] font-bold flex items-center justify-center ${
              activeView === 'Front'
                ? 'bg-cyan-600 text-white border-cyan-300 shadow-lg shadow-cyan-500/50'
                : 'bg-slate-800/90 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white'
            }`}
          >
            FRONT
          </button>
          <button
            onClick={() => onSelectView('Right')}
            className={`w-7 h-10 rounded-r border transition-all text-[9px] font-bold flex items-center justify-center ${
              activeView === 'Right'
                ? 'bg-cyan-600 text-white border-cyan-300'
                : 'bg-slate-800/90 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white'
            }`}
          >
            R
          </button>
        </div>

        {/* Bottom Face */}
        <button
          onClick={() => onSelectView('Bottom')}
          className={`absolute bottom-0 w-16 h-6 rounded-b border transition-all text-[10px] font-bold flex items-center justify-center ${
            activeView === 'Bottom'
              ? 'bg-cyan-600 text-white border-cyan-300'
              : 'bg-slate-800/90 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white'
          }`}
        >
          BOTTOM
        </button>
      </div>

      {/* Quick Back view */}
      <div className="mt-1 flex justify-center">
        <button
          onClick={() => onSelectView('Back')}
          className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition"
        >
          Traseira (Back)
        </button>
      </div>
    </div>
  );
};
