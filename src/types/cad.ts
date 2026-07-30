export type PlaneType = 'Top' | 'Front' | 'Right' | 'Custom';

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export type SketchElementKind = 'line' | 'rect' | 'circle' | 'arc' | 'polygon' | 'airfoil';

export interface SketchElement {
  id: string;
  kind: SketchElementKind;
  points: Point2D[]; // For line (start, end), rect (corner, corner), circle (center, edge)
  radius?: number;
  sides?: number; // for polygon
  airfoilCode?: string; // e.g., '2412' for NACA 2412
  chordLength?: number;
}

export interface Sketch2D {
  id: string;
  name: string;
  plane: PlaneType;
  planeOffset: number; // distance along plane normal
  elements: SketchElement[];
  visible: boolean;
  suppressed: boolean;
}

export type FeatureType = 
  | 'extrude' 
  | 'revolve' 
  | 'loft' 
  | 'fillet' 
  | 'chamfer' 
  | 'shell' 
  | 'cut'
  | 'pattern'
  | 'frame'
  | 'pipe_miter';

export interface ExtrudeParams {
  sketchId: string;
  depth: number;
  symmetric: boolean;
  operation: 'add' | 'cut';
  draftAngle?: number;
}

export interface RevolveParams {
  sketchId: string;
  angle: number; // in degrees (e.g. 360)
  axis: 'x' | 'y' | 'z';
  operation: 'add' | 'cut';
}

export interface LoftParams {
  sketchIds: string[]; // List of sketches to loft through
  guided: boolean;
}

export interface FilletParams {
  targetFeatureId: string;
  radius: number;
  edges?: number[];
}

export interface ShellParams {
  targetFeatureId: string;
  thickness: number;
}

export interface FrameParams {
  sketchId: string;
  profileType?: 'round' | 'square' | 'rectangular';
  profile?: 'round' | 'square' | 'rectangular';
  outerDiameter: number; // e.g., 31.75 mm (1.25" tube) or 25.4 mm (1")
  wallThickness: number; // e.g., 2.0 mm
  widthRect?: number;
  width?: number;
  height?: number;
  cornerMiter?: boolean; // auto 45-degree corner connection
  miterJoints?: boolean;
}

export interface PipeMiterParams {
  targetFeatureIds?: string[];
  miterType?: 'miter_45' | 'trim_extend' | 'butt_joint';
  gap?: number;
  cutAngle?: number;
  offset?: number;
}

export interface CADFeature {
  id: string;
  name: string;
  type: FeatureType;
  sketchId?: string; // primary sketch if applicable
  params: ExtrudeParams | RevolveParams | LoftParams | FilletParams | ShellParams | FrameParams | PipeMiterParams | any;
  visible: boolean;
  suppressed: boolean;
  color?: string;
  materialId?: string;
  position?: Point3D; // Transformation offset (X, Y, Z) in mm
  rotation?: Point3D; // Rotation angles (RX, RY, RZ) in degrees
  scale?: Point3D;    // Scale factor (SX, SY, SZ)
}

export interface MaterialProps {
  id: string;
  name: string;
  density: number; // g/cm^3
  color: string;
  metalness: number;
  roughness: number;
}

export interface CADPart {
  id: string;
  name: string;
  featureIds: string[];
  material: MaterialProps;
  visible: boolean;
  color: string;
  volume: number; // in cm3
  mass: number; // in g
  surfaceArea: number; // in cm2
}

export interface CADProject {
  id: string;
  name: string;
  description?: string;
  sketches: Sketch2D[];
  features: CADFeature[];
  parts: CADPart[];
  activePlane: PlaneType;
  activeSketchId?: string;
  selectedFeatureId?: string;
}

export type ActiveTool = 
  | 'select' 
  | 'translate'
  | 'rotate'
  | 'scale'
  | 'orbit' 
  | 'sketch_line' 
  | 'sketch_rect' 
  | 'sketch_circle' 
  | 'sketch_polygon' 
  | 'sketch_airfoil' 
  | 'extrude' 
  | 'revolve' 
  | 'loft' 
  | 'frame'
  | 'pipe_miter'
  | 'fillet' 
  | 'shell' 
  | 'measure' 
  | 'section_view';

export type DisplayMode = 'shaded' | 'edges' | 'wireframe' | 'xray';

export interface MeasurementResult {
  p1?: Point3D;
  p2?: Point3D;
  distance?: number;
  dx?: number;
  dy?: number;
  dz?: number;
  angle?: number;
  area?: number;
  volume?: number;
}

export interface CFDConfig {
  enabled: boolean;
  windSpeedMs: number;       // Air speed in m/s (e.g., 30 m/s = 108 km/h)
  airDensity: number;        // Fluid density in kg/m^3 (e.g. 1.225 kg/m^3)
  angleOfAttackDeg: number;  // Angle of attack in degrees (-15 to +25)
  temperatureC: number;      // Air temperature in Celsius (e.g. 15 C)
  turbulenceModel: 'laminar' | 'k_epsilon' | 'spalart_allmaras' | 'navier_stokes_3d';
  showStreamlines: boolean;  // Animated particle streamlines in viewport
  showPressureMap: boolean;  // Mesh color heatmap (Stagnation vs Suction)
  showVectorGrid: boolean;   // 3D velocity vector arrows grid
  showSlicePlane: boolean;   // YZ cut plane slice contour
  streamlineParticlesCount: number; // e.g., 200
  windDirection: 'x_pos' | 'x_neg' | 'z_pos' | 'z_neg';
}

export interface CFDResult {
  liftForceN: number;        // Lift Force in Newtons
  dragForceN: number;        // Drag Force in Newtons
  downforceN: number;        // Downforce in Newtons
  cl: number;                // Lift Coefficient C_L
  cd: number;                // Drag Coefficient C_D
  efficiencyLD: number;      // L/D Ratio (Efficiency)
  maxStagnationPressurePa: number; // Max pressure in Pascals (1/2 * rho * v^2)
  minPressurePa: number;     // Min suction pressure in Pascals
  reynoldsNumber: number;    // Reynolds number Re
  machNumber: number;        // Mach number
  flowType: string;          // e.g. "Subsônico Laminar-Turbulento"
}

export type StandardPartType = 
  | 'bolt_hex'       // Parafuso Sextavado ISO 4017 / DIN 933
  | 'bolt_allen'     // Parafuso Allen ISO 4762 / DIN 912
  | 'bolt_flat'      // Parafuso Cabeça Chata ISO 10642
  | 'nut_hex'        // Porca Sextavada ISO 4032
  | 'nut_nylon'      // Porca Auto-travante DIN 985
  | 'bearing_ball'   // Rolamento Rígido de Esfera SKF 6200
  | 'pillow_block'   // Mancal Pedestal Pillow Block UCP204
  | 'washer_flat'    // Arruela Lisa ISO 7089
  | 'profile_i'      // Perfil I / W Beam ISO 1025
  | 'profile_angle'; // Cantoneira L

export interface StandardPartSpec {
  id: string;
  type: StandardPartType;
  category: 'Parafusos' | 'Porcas' | 'Rolamentos' | 'Arruelas' | 'Perfis';
  norm: string;       // e.g., 'ISO 4017 / DIN 933'
  name: string;       // e.g., 'Parafuso Sextavado M8x30'
  nominalSize: string; // e.g., 'M8', 'M10', '6204', 'UCP204', 'W100x50'
  lengthMm: number;   // e.g., 30mm
  threadPitch?: number; // e.g. 1.25mm
  materialId: string;
  weightGrams: number;
}
