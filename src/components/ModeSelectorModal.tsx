import React, { useState } from 'react';
import { EngineeringDomain, RocketConfig, VehicleConfig } from '../types/engineering';
import { Rocket, Car, Plane, ShieldAlert, Cpu, Anchor, Settings, Flame, Leaf, Compass, ArrowRight, Check, Zap, Sparkles } from 'lucide-react';

interface ModeSelectorModalProps {
  onSelectRocketMode: (config: RocketConfig) => void;
  onSelectVehicleMode: (config: VehicleConfig) => void;
  onClose?: () => void;
}

export const ModeSelectorModal: React.FC<ModeSelectorModalProps> = ({
  onSelectRocketMode,
  onSelectVehicleMode,
  onClose
}) => {
  const [selectedDomain, setSelectedDomain] = useState<EngineeringDomain>('rocket');

  // Rocket Configuration State
  const [apogeeTarget, setApogeeTarget] = useState<'3km' | '5km' | '10km' | 'suborbital'>('3km');
  const [propulsionType, setPropulsionType] = useState<'solid' | 'hybrid' | 'liquid'>('hybrid');
  const [isSustainableFuel, setIsSustainableFuel] = useState<boolean>(true);
  const [fuelType, setFuelType] = useState<string>('Bio-Etanol + LOX (Verde)');
  const [recoveryType, setRecoveryType] = useState<'dual_parachute' | 'single_parachute' | 'pyro_ejection' | 'pneumatic'>('dual_parachute');

  // Vehicle Configuration State
  const [powertrain, setPowertrain] = useState<'combustion' | 'electric' | 'hydrogen_h2o' | 'autonomous'>('electric');

  const handleConfirmRocket = () => {
    onSelectRocketMode({
      apogeeTarget,
      propulsionType,
      fuelType,
      isSustainableFuel,
      recoveryType,
      components: [
        'Coifa Ogival Aerodinâmica',
        'Módulo de Carga Útil & Experimentos',
        'Seção de Aviônica & Altímetros Dual-Deployment',
        'Tubo Estrutural de Fibra de Carbono',
        'Conjunto de Aletas Trapezoidais 4x',
        'Câmara de Combustão & Bocal De Laval',
        'Sistema de Paraquedas Drogue + Principal'
      ],
      chamberPressureBar: propulsionType === 'liquid' ? 35 : propulsionType === 'hybrid' ? 25 : 45,
      expectedThrustN: apogeeTarget === '3km' ? 2800 : 6500
    });
  };

  const handleConfirmVehicle = () => {
    const titleMap: Record<EngineeringDomain, string> = {
      rocket: 'Foguete Experimental',
      formula: 'Fórmula SAE High-Performance',
      baja: 'Baja SAE Off-Road 4130',
      aerodesign: 'Aeronave AeroDesign Heavy-Lift',
      drone: 'Drone Autônomo FPV / Carga',
      car: 'Supercar Urbano Aerodinâmico',
      naval: 'Embarcação Naval Catamarã / Hidrofólio',
      custom: 'Projeto Mecânico Personalizado'
    };

    onSelectVehicleMode({
      domain: selectedDomain,
      title: titleMap[selectedDomain],
      powertrain,
      subsystemOptions: [
        'Chassis Monocoque & Gaiola de Proteção',
        'Sistema de Suspensão & Direção',
        'Powertrain & Inversor / Célula de Combustível',
        'Aerodinâmica & Asas Orientáveis',
        'Telemetria CAN Bus & Sensores'
      ],
      targetPerformance: powertrain === 'hydrogen_h2o' ? 'Emissão Zero - Célula H2O' : 'Alta Eficiência Energética'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 font-sans text-zinc-100 select-none">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-zinc-900/90 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              Seleção do Modo de Trabalho & Engenharia
            </h2>
            <p className="text-xs text-zinc-400">
              Escolha a modalidade técnica para configurar o ambiente CAD 3D, modelo paramétrico e estoque de materiais.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Fechar
            </button>
          )}
        </div>

        {/* Domains Selector Cards */}
        <div className="p-6 pb-12 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* 1. Foguete */}
            <button
              type="button"
              onClick={() => setSelectedDomain('rocket')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                selectedDomain === 'rocket'
                  ? 'bg-gradient-to-br from-sky-500/20 via-zinc-900 to-amber-500/20 border-sky-500 ring-2 ring-sky-500/30 text-white shadow-lg'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${selectedDomain === 'rocket' ? 'bg-sky-500/20 text-sky-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Rocket className="w-5 h-5" />
                </div>
                {selectedDomain === 'rocket' && <span className="text-[10px] bg-sky-500/30 text-sky-300 px-2 py-0.5 rounded-full font-bold">Ativo</span>}
              </div>
              <div>
                <h3 className="font-bold text-xs text-zinc-100">1. Foguete</h3>
                <p className="text-[10px] text-zinc-400">Até 3km de apogeu ou motores maiores</p>
              </div>
            </button>

            {/* 2. Fórmula */}
            <button
              type="button"
              onClick={() => setSelectedDomain('formula')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                selectedDomain === 'formula'
                  ? 'bg-gradient-to-br from-teal-500/20 via-zinc-900 to-sky-500/20 border-teal-500 ring-2 ring-teal-500/30 text-white shadow-lg'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${selectedDomain === 'formula' ? 'bg-teal-500/20 text-teal-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Car className="w-5 h-5" />
                </div>
                {selectedDomain === 'formula' && <span className="text-[10px] bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full font-bold">Ativo</span>}
              </div>
              <div>
                <h3 className="font-bold text-xs text-zinc-100">2. Fórmula SAE</h3>
                <p className="text-[10px] text-zinc-400">Combustão, Elétrico, H2O e Autônomo</p>
              </div>
            </button>

            {/* 3. Baja SAE */}
            <button
              type="button"
              onClick={() => setSelectedDomain('baja')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                selectedDomain === 'baja'
                  ? 'bg-gradient-to-br from-amber-500/20 via-zinc-900 to-orange-500/20 border-amber-500 ring-2 ring-amber-500/30 text-white shadow-lg'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${selectedDomain === 'baja' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                {selectedDomain === 'baja' && <span className="text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full font-bold">Ativo</span>}
              </div>
              <div>
                <h3 className="font-bold text-xs text-zinc-100">3. Baja SAE</h3>
                <p className="text-[10px] text-zinc-400">Gaiola 4130 & Off-Road CVT</p>
              </div>
            </button>

            {/* 4. AeroDesign */}
            <button
              type="button"
              onClick={() => setSelectedDomain('aerodesign')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                selectedDomain === 'aerodesign'
                  ? 'bg-gradient-to-br from-purple-500/20 via-zinc-900 to-sky-500/20 border-purple-500 ring-2 ring-purple-500/30 text-white shadow-lg'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${selectedDomain === 'aerodesign' ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Plane className="w-5 h-5" />
                </div>
                {selectedDomain === 'aerodesign' && <span className="text-[10px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full font-bold">Ativo</span>}
              </div>
              <div>
                <h3 className="font-bold text-xs text-zinc-100">4. AeroDesign</h3>
                <p className="text-[10px] text-zinc-400">Aeronaves Heavy Lift & Perfil NACA</p>
              </div>
            </button>

            {/* 5. Drone */}
            <button
              type="button"
              onClick={() => setSelectedDomain('drone')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                selectedDomain === 'drone'
                  ? 'bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-teal-500/20 border-emerald-500 ring-2 ring-emerald-500/30 text-white shadow-lg'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${selectedDomain === 'drone' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Cpu className="w-5 h-5" />
                </div>
                {selectedDomain === 'drone' && <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Ativo</span>}
              </div>
              <div>
                <h3 className="font-bold text-xs text-zinc-100">5. Drone FPV / Autônomo</h3>
                <p className="text-[10px] text-zinc-400">Quadcopter & Hexacopter Carbono</p>
              </div>
            </button>

            {/* 6. Carro Urbano */}
            <button
              type="button"
              onClick={() => setSelectedDomain('car')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                selectedDomain === 'car'
                  ? 'bg-gradient-to-br from-indigo-500/20 via-zinc-900 to-sky-500/20 border-indigo-500 ring-2 ring-indigo-500/30 text-white shadow-lg'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${selectedDomain === 'car' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Car className="w-5 h-5" />
                </div>
                {selectedDomain === 'car' && <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-bold">Ativo</span>}
              </div>
              <div>
                <h3 className="font-bold text-xs text-zinc-100">6. Carro / Supercar</h3>
                <p className="text-[10px] text-zinc-400">Aerodinâmica Ativa & Drivetrain</p>
              </div>
            </button>

            {/* 7. Naval */}
            <button
              type="button"
              onClick={() => setSelectedDomain('naval')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                selectedDomain === 'naval'
                  ? 'bg-gradient-to-br from-cyan-500/20 via-zinc-900 to-blue-500/20 border-cyan-500 ring-2 ring-cyan-500/30 text-white shadow-lg'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${selectedDomain === 'naval' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Anchor className="w-5 h-5" />
                </div>
                {selectedDomain === 'naval' && <span className="text-[10px] bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full font-bold">Ativo</span>}
              </div>
              <div>
                <h3 className="font-bold text-xs text-zinc-100">7. Naval & Embarcação</h3>
                <p className="text-[10px] text-zinc-400">Hidrofólio, Catamarã & Propulsão</p>
              </div>
            </button>

            {/* 8. Personalizado */}
            <button
              type="button"
              onClick={() => setSelectedDomain('custom')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                selectedDomain === 'custom'
                  ? 'bg-gradient-to-br from-rose-500/20 via-zinc-900 to-amber-500/20 border-rose-500 ring-2 ring-rose-500/30 text-white shadow-lg'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${selectedDomain === 'custom' ? 'bg-rose-500/20 text-rose-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Settings className="w-5 h-5" />
                </div>
                {selectedDomain === 'custom' && <span className="text-[10px] bg-rose-500/30 text-rose-300 px-2 py-0.5 rounded-full font-bold">Ativo</span>}
              </div>
              <div>
                <h3 className="font-bold text-xs text-zinc-100">8. Personalizado</h3>
                <p className="text-[10px] text-zinc-400">Estúdio CAD Aberto Geral</p>
              </div>
            </button>
          </div>

          {/* Detailed Configuration Box for ROCKET MODE */}
          {selectedDomain === 'rocket' && (
            <div className="bg-zinc-900/90 p-5 rounded-3xl border border-sky-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-sky-400" />
                  Parâmetros de Engenharia Aeroespacial (Foguete)
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-emerald-500/30">
                  Combustível Sustentável Disponível
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Meta de Apogeu */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Meta de Apogeu de Voo:
                  </label>
                  <select
                    value={apogeeTarget}
                    onChange={(e) => setApogeeTarget(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-sky-300 font-bold focus:outline-none"
                  >
                    <option value="3km">Até 3 km de Apogeu (Competição Spaceport/LASC 3k)</option>
                    <option value="5km">5 km de Apogeu (Sondagem Intermediária)</option>
                    <option value="10km">10 km de Apogeu (Alta Altitude / Motor de Alta Pressão)</option>
                    <option value="suborbital">Suborbital / Testbed de Propulsão Maior</option>
                  </select>
                </div>

                {/* Tipo de Propulsão */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Sistema de Propulsão do Motor:
                  </label>
                  <select
                    value={propulsionType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setPropulsionType(val);
                      if (val === 'hybrid') setFuelType('Parafina Sustentável + N2O');
                      else if (val === 'liquid') setFuelType('Bio-Etanol + LOX (Verde)');
                      else setFuelType('APCP Sorbitol Ecológico');
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none"
                  >
                    <option value="solid">Propulsão Sólida (APCP / Sorbitol)</option>
                    <option value="hybrid">Propulsão Híbrida (Injeção Líquida + Grão Sólido)</option>
                    <option value="liquid">Propulsão Líquida (Câmara de Pressurização Bi-Propelente)</option>
                  </select>
                </div>

                {/* Combustível & Sustentabilidade */}
                <div className="sm:col-span-2 bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-400" />
                      Seleção do Combustível / Propelente Sustentável:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sust"
                        checked={isSustainableFuel}
                        onChange={(e) => setIsSustainableFuel(e.target.checked)}
                        className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                      />
                      <label htmlFor="sust" className="text-xs text-zinc-300 font-medium cursor-pointer">
                        Priorizar Matéria-Prima Sustentável / Verde
                      </label>
                    </div>
                  </div>

                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-emerald-300 font-bold focus:outline-none"
                  >
                    {isSustainableFuel ? (
                      <>
                        <option value="Bio-Etanol + LOX (Verde)">Bio-Etanol de Cana + Oxigênio Líquido (Verde / Neutro em Carbono)</option>
                        <option value="Parafina Reciclada + N2O">Grão de Parafina Sustentável + Óxido Nitroso (N2O)</option>
                        <option value="Biodiesel + H2O2 85%">Biodiesel Vegetal + Peróxido de Hidrogênio 85% Concentrado</option>
                        <option value="LMP-103S Green Monopropellant">Propelente Verde de Baixa Toxidade LMP-103S</option>
                      </>
                    ) : (
                      <>
                        <option value="APCP - Ammonium Perchlorate Composite">APCP (Perclorato de Amônio + Alumínio em Pó)</option>
                        <option value="Kerosene RP-1 + LOX">Kerosene RP-1 Grau Aeroespacial + Oxigênio Líquido</option>
                        <option value="Methalox (Metano + LOX)">Methalox (Metano Liquefeito + LOX)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Sistema de Recuperação */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Sistema de Recuperação & Aviônica:
                  </label>
                  <select
                    value={recoveryType}
                    onChange={(e) => setRecoveryType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-teal-300 font-bold focus:outline-none"
                  >
                    <option value="dual_parachute">Paraquedas Duplo Dual-Deployment (Drogue no Apogeu + Principal a 300m)</option>
                    <option value="single_parachute">Paraquedas Único com Ejeção Direta</option>
                    <option value="pyro_ejection">Ejeção Pirotécnica por Carga Redundante de Pólvora Negra</option>
                    <option value="pneumatic">Ejeção Pneumática por CO2 Válvula Solenóide (Não Pirotécnica)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleConfirmRocket}
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-zinc-950 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-sky-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Construir Foguete CAD & Iniciar Simulação</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Detailed Configuration Box for VEHICLE MODES */}
          {selectedDomain !== 'rocket' && (
            <div className="bg-zinc-900/90 p-5 rounded-3xl border border-teal-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-teal-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-teal-400" />
                  Configuração Avançada de Engenharia do Veículo
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Powertrain Selection */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-2">
                    Fonte de Energia & Propulsão Tecnológica:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    
                    <button
                      type="button"
                      onClick={() => setPowertrain('combustion')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        powertrain === 'combustion'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Flame className="w-4 h-4 mb-1 text-amber-400" />
                      <span>Combustão</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPowertrain('electric')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        powertrain === 'electric'
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Zap className="w-4 h-4 mb-1 text-teal-400" />
                      <span>Elétrico 100%</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPowertrain('hydrogen_h2o')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        powertrain === 'hydrogen_h2o'
                          ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Leaf className="w-4 h-4 mb-1 text-sky-400" />
                      <span>Movido H2O / H2</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPowertrain('autonomous')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        powertrain === 'autonomous'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Cpu className="w-4 h-4 mb-1 text-purple-400" />
                      <span>Autônomo ROS2</span>
                    </button>

                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleConfirmVehicle}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-zinc-950 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-teal-500/20 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Gerar Geometria CAD & Painel de Gerenciamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
