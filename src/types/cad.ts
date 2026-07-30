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
  | 'pattern';

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

export interface CADFeature {
  id: string;
  name: string;
  type: FeatureType;
  sketchId?: string; // primary sketch if applicable
  params: ExtrudeParams | RevolveParams | LoftParams | FilletParams | ShellParams | any;
  visible: boolean;
  suppressed: boolean;
  color?: string;
  materialId?: string;
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
}

export type ActiveTool = 
  | 'select' 
  | 'orbit' 
  | 'sketch_line' 
  | 'sketch_rect' 
  | 'sketch_circle' 
  | 'sketch_polygon' 
  | 'sketch_airfoil' 
  | 'extrude' 
  | 'revolve' 
  | 'loft' 
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
