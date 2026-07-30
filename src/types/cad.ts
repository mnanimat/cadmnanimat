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
