export type EngineeringDomain = 
  | 'rocket' 
  | 'formula' 
  | 'baja' 
  | 'aerodesign' 
  | 'drone' 
  | 'car' 
  | 'naval' 
  | 'custom';

export type RocketPropulsionType = 'solid' | 'hybrid' | 'liquid';
export type RocketRecoveryType = 'dual_parachute' | 'single_parachute' | 'pyro_ejection' | 'pneumatic';

export interface RocketConfig {
  apogeeTarget: '3km' | '5km' | '10km' | 'suborbital';
  propulsionType: RocketPropulsionType;
  fuelType: string;
  isSustainableFuel: boolean;
  recoveryType: RocketRecoveryType;
  components: string[];
  chamberPressureBar: number;
  expectedThrustN: number;
}

export type PowertrainType = 'combustion' | 'electric' | 'hydrogen_h2o' | 'autonomous';

export interface VehicleConfig {
  domain: EngineeringDomain;
  title: string;
  powertrain: PowertrainType;
  subsystemOptions: string[];
  targetPerformance: string;
}

export interface UserSession {
  name: string;
  email: string;
  organization: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  isLoggedIn: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Engenheiro Chefe' | 'Propulsão & Motor' | 'Aerodinâmica' | 'Estruturas & CAD' | 'Eletrônica & Aviônica' | 'Gestão Financeira';
  email: string;
  subsystem: string;
  status: 'Ativo' | 'Pendente';
}

export interface BudgetItem {
  id: string;
  description: string;
  category: 'Propulsão' | 'Estrutura & CAD' | 'Aviônica & Sensores' | 'Materiais & Matéria-Prima' | 'Usinagem & Fabricação' | 'Logística & Inscrição';
  cost: number;
  date: string;
  status: 'Pago' | 'Pendente' | 'Aprovado';
  responsible: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Metais & Ligas' | 'Compósitos & Fibras' | 'Químicos & Propelentes' | 'Eletrônica & Sensores' | 'Hardware & Suportes';
  quantity: number;
  unit: 'kg' | 'm' | 'm²' | 'unidades' | 'litros';
  unitCost: number;
  minStock: number;
  supplier: string;
}
