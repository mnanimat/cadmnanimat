import React, { useState } from 'react';
import { CFDConfig, CFDResult, CADProject } from '../types/cad';
import { calculateCFDResults } from '../utils/cfdKernel';
import { 
  Wind, 
  Gauge, 
  Zap, 
  Play, 
  RefreshCw, 
  Layers, 
  Eye, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Sliders, 
  Check, 
  Compass, 
  Download,
  Flame,
  Maximize2
} from 'lucide-react';

interface CFDSimulationWindowProps {
  project: CADProject;
  cfdConfig: CFDConfig;
  onUpdateCFDConfig: (newConfig: CFDConfig) => void;
  onClose: () => void;
}

export const CFDSimulationWindow: React.FC<CFDSimulationWindowProps> = ({
  project,
  cfdConfig,
  onUpdateCFDConfig,
  onClose
}) => {
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'parameters' | 'results' | 'presets'>('parameters');

  const cfdResults: CFDResult = calculateCFDResults(project, cfdConfig);

  const handleApplyPreset = (preset: 'sea_level' | 'racing_ground' | 'high_altitude' | 'water_tunnel') => {
    let updated: CFDConfig = { ...cfdConfig, enabled: true };
    if (preset === 'sea_level') {
      updated = { ...updated, windSpeedMs: 35, airDensity: 1.225, angleOfAttackDeg: 4, temperatureC: 15, turbulenceModel: 'k_epsilon' };
    } else if (preset === 'racing_ground') {
      updated = { ...updated, windSpeedMs: 55, airDensity: 1.225, angleOfAttackDeg: -2, temperatureC: 25, turbulenceModel: 'spalart_allmaras', showStreamlines: true, showPressureMap: true };
    } else if (preset === 'high_altitude') {
      updated = { ...updated, windSpeedMs: 120, airDensity: 0.85, angleOfAttackDeg: 6, temperatureC: -10, turbulenceModel: 'navier_stokes_3d' };
    } else if (preset === 'water_tunnel') {
      updated = { ...updated, windSpeedMs: 8, airDensity: 998.0, angleOfAttackDeg: 2, temperatureC: 20, turbulenceModel: 'laminar' };
    }
    onUpdateCFDConfig(updated);
    simulateComputation();
  };

  const simulateComputation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 400);
  };

  return (
    <div className="w-[460px] p-4 pb-10 text-zinc-200 font-sans text-xs select-none space-y-4">
      
      {/* CFD Status Ribbon */}
      <div className="flex items-center justify-between bg-zinc-900/90 p-3 rounded-2xl border border-sky-500/30 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <Wind className={`w-4 h-4 ${cfdConfig.enabled ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Simulação CFD Aerodinâmica</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cfdConfig.enabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-400'}`}>
                {cfdConfig.enabled ? 'Ativa no Viewport 3D' : 'Inativa'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Túnel de Vento Virtual & Escoamento de Fluidos 3D
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const nextState = !cfdConfig.enabled;
            onUpdateCFDConfig({ ...cfdConfig, enabled: nextState });
            if (nextState) simulateComputation();
          }}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md ${
            cfdConfig.enabled
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
          }`}
        >
          {cfdConfig.enabled ? 'Desativar CFD' : 'Ativar CFD 3D'}
        </button>
      </div>

      {/* Mode Sub-tabs */}
      <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('parameters')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-center transition flex items-center justify-center gap-1.5 ${
            activeTab === 'parameters'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Parâmetros do Vento</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-center transition flex items-center justify-center gap-1.5 ${
            activeTab === 'results'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Forças & Coeficientes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-center transition flex items-center justify-center gap-1.5 ${
            activeTab === 'presets'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Ambientes CFD</span>
        </button>
      </div>

      {/* TAB 1: PARAMETERS */}
      {activeTab === 'parameters' && (
        <div className="space-y-3.5 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
          
          {/* Speed slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-zinc-300">Velocidade do Escoamento (V<sub>∞</sub>):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">
                {cfdConfig.windSpeedMs} m/s ({Math.round(cfdConfig.windSpeedMs * 3.6)} km/h)
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={250}
              value={cfdConfig.windSpeedMs}
              onChange={(e) => {
                onUpdateCFDConfig({ ...cfdConfig, windSpeedMs: Number(e.target.value) });
              }}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
          </div>

          {/* Angle of attack */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-zinc-300">Ângulo de Ataque (α):</span>
              <span className="font-mono font-bold text-teal-400 text-sm">
                {cfdConfig.angleOfAttackDeg}°
              </span>
            </div>
            <input
              type="range"
              min={-15}
              max={25}
              value={cfdConfig.angleOfAttackDeg}
              onChange={(e) => {
                onUpdateCFDConfig({ ...cfdConfig, angleOfAttackDeg: Number(e.target.value) });
              }}
              className="w-full accent-teal-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
          </div>

          {/* Density & Temp */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div>
              <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                Densidade do Fluido (ρ kg/m³):
              </label>
              <input
                type="number"
                step="0.01"
                value={cfdConfig.airDensity}
                onChange={(e) => onUpdateCFDConfig({ ...cfdConfig, airDensity: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-sky-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                Temperatura (°C):
              </label>
              <input
                type="number"
                value={cfdConfig.temperatureC}
                onChange={(e) => onUpdateCFDConfig({ ...cfdConfig, temperatureC: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-amber-300 font-mono font-bold"
              />
            </div>
          </div>

          {/* Turbulence model */}
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase font-bold block">
              Modelo Físico de Turbulência (CFD Grid):
            </label>
            <select
              value={cfdConfig.turbulenceModel}
              onChange={(e) => onUpdateCFDConfig({ ...cfdConfig, turbulenceModel: e.target.value as any })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-200 text-xs font-semibold"
            >
              <option value="k_epsilon">k-ε Realizável (Aeroespacial & Veicular)</option>
              <option value="spalart_allmaras">Spalart-Allmaras (Camada Limite / Aerofólios)</option>
              <option value="navier_stokes_3d">Navier-Stokes 3D Ultra-Avançado (Gradiente Completo)</option>
              <option value="laminar">Escoamento Laminar / Hidrodinâmica</option>
            </select>
          </div>

          {/* Viewport Visualization Toggles */}
          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <span className="text-sky-400 font-bold text-xs flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Visualizações 3D no Viewport:</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cfdConfig.showStreamlines}
                  onChange={(e) => onUpdateCFDConfig({ ...cfdConfig, showStreamlines: e.target.checked })}
                  className="accent-sky-400 w-4 h-4 rounded"
                />
                <span className="text-zinc-200 font-semibold text-[11px]">Streamlines Animadas</span>
              </label>

              <label className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cfdConfig.showPressureMap}
                  onChange={(e) => onUpdateCFDConfig({ ...cfdConfig, showPressureMap: e.target.checked })}
                  className="accent-teal-400 w-4 h-4 rounded"
                />
                <span className="text-zinc-200 font-semibold text-[11px]">Mapa de Pressão</span>
              </label>

              <label className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cfdConfig.showVectorGrid}
                  onChange={(e) => onUpdateCFDConfig({ ...cfdConfig, showVectorGrid: e.target.checked })}
                  className="accent-indigo-400 w-4 h-4 rounded"
                />
                <span className="text-zinc-200 font-semibold text-[11px]">Grade de Vetores 3D</span>
              </label>

              <label className="flex items-center gap-2 bg-zinc-950 p-2 rounded-lg border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cfdConfig.showSlicePlane}
                  onChange={(e) => onUpdateCFDConfig({ ...cfdConfig, showSlicePlane: e.target.checked })}
                  className="accent-purple-400 w-4 h-4 rounded"
                />
                <span className="text-zinc-200 font-semibold text-[11px]">Plano de Corte YZ</span>
              </label>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RESULTS & METRICS */}
      {activeTab === 'results' && (
        <div className="space-y-3.5 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Força de Sustentação (Lift)</span>
              <span className={`text-lg font-bold font-mono ${cfdResults.liftForceN >= 0 ? 'text-sky-400' : 'text-amber-400'}`}>
                {cfdResults.liftForceN} N
              </span>
              <span className="text-[10px] text-zinc-500 block">
                C<sub>L</sub> = {cfdResults.cl}
              </span>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Força de Arrasto (Drag)</span>
              <span className="text-lg font-bold font-mono text-rose-400">
                {cfdResults.dragForceN} N
              </span>
              <span className="text-[10px] text-zinc-500 block">
                C<sub>D</sub> = {cfdResults.cd}
              </span>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Downforce (Carga Aero)</span>
              <span className="text-lg font-bold font-mono text-teal-300">
                {cfdResults.downforceN} N
              </span>
              <span className="text-[10px] text-zinc-500 block">Aderência em pista</span>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Eficiência L / D</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {cfdResults.efficiencyLD}
              </span>
              <span className="text-[10px] text-zinc-500 block">Razão Sustentação / Arrasto</span>
            </div>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-400 font-semibold">Pressão de Estagnação Máx:</span>
              <span className="font-mono text-sky-300 font-bold">{cfdResults.maxStagnationPressurePa} Pa</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-400 font-semibold">Pressão Mínima de Sucção:</span>
              <span className="font-mono text-purple-300 font-bold">{cfdResults.minPressurePa} Pa</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-400 font-semibold">Número de Reynolds (Re):</span>
              <span className="font-mono text-amber-300 font-bold">{cfdResults.reynoldsNumber.toLocaleString('pt-BR')}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-400 font-semibold">Número de Mach:</span>
              <span className="font-mono text-emerald-300 font-bold">M = {cfdResults.machNumber}</span>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400 text-[10px] uppercase font-bold">Regime do Escoamento:</span>
              <span className="bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                {cfdResults.flowType}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-2.5 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
          <span className="text-zinc-400 font-bold text-[11px] uppercase block mb-1">
            Selecione um Cenário de Teste Pré-Configurado:
          </span>

          <button
            type="button"
            onClick={() => handleApplyPreset('sea_level')}
            className="w-full text-left p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-sky-300 block">Ar Padrão Nível do Mar (ISA)</span>
              <span className="text-[10px] text-zinc-400">V = 35 m/s (126 km/h) • ρ = 1.225 kg/m³ • 15°C</span>
            </div>
            <Wind className="w-4 h-4 text-sky-400" />
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('racing_ground')}
            className="w-full text-left p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-teal-300 block">Chassi Baja / Formula Racing (Efeito Solo)</span>
              <span className="text-[10px] text-zinc-400">V = 55 m/s (198 km/h) • α = -2° (Downforce Max)</span>
            </div>
            <Zap className="w-4 h-4 text-teal-400" />
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('high_altitude')}
            className="w-full text-left p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-purple-300 block">Foguete Alta Altitude (3.000m Apogeu)</span>
              <span className="text-[10px] text-zinc-400">V = 120 m/s (432 km/h) • ρ = 0.85 kg/m³</span>
            </div>
            <Flame className="w-4 h-4 text-purple-400" />
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('water_tunnel')}
            className="w-full text-left p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-emerald-300 block">Túnel Hidroelétrico (Água Doce)</span>
              <span className="text-[10px] text-zinc-400">V = 8 m/s • ρ = 998 kg/m³ (Alta Densidade)</span>
            </div>
            <Compass className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Recalculate CTA */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={simulateComputation}
          disabled={isCalculating}
          className="flex-1 py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
          <span>{isCalculating ? 'Processando Grade CFD 3D...' : 'Recalcular Malha CFD'}</span>
        </button>
      </div>

    </div>
  );
};
