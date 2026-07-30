import * as THREE from 'three';
import { 
  CADProject, 
  Sketch2D, 
  CADFeature, 
  ExtrudeParams, 
  RevolveParams, 
  LoftParams, 
  PlaneType, 
  Point2D,
  MaterialProps
} from '../types/cad';
import { generateNacaAirfoil } from './airfoil';

export const PRESET_MATERIALS: MaterialProps[] = [
  { id: 'al_6061', name: 'Alumínio 6061-T6', density: 2.70, color: '#bdc3c7', metalness: 0.8, roughness: 0.3 },
  { id: 'carbon_fiber', name: 'Fibra de Carbono', density: 1.55, color: '#2c3e50', metalness: 0.2, roughness: 0.6 },
  { id: 'steel_316', name: 'Aço Inox 316L', density: 8.00, color: '#95a5a6', metalness: 0.9, roughness: 0.2 },
  { id: 'titanium', name: 'Titânio Grau 5', density: 4.43, color: '#7f8c8d', metalness: 0.85, roughness: 0.25 },
  { id: 'pla_plastic', name: 'Polímero PLA', density: 1.24, color: '#3498db', metalness: 0.1, roughness: 0.5 },
  { id: 'abs_plastic', name: 'Plástico ABS', density: 1.05, color: '#e74c3c', metalness: 0.1, roughness: 0.4 },
  { id: 'balsa_wood', name: 'Madeira Balsa', density: 0.16, color: '#d35400', metalness: 0.0, roughness: 0.8 }
];

/**
 * Builds a THREE.Shape from a 2D Sketch
 */
export function buildShapeFromSketch(sketch: Sketch2D): THREE.Shape[] {
  const shapes: THREE.Shape[] = [];
  if (!sketch.elements || sketch.elements.length === 0) return shapes;

  let mainShape: THREE.Shape | null = null;

  for (const elem of sketch.elements) {
    if (elem.kind === 'airfoil') {
      const chord = elem.chordLength || 120;
      const points = generateNacaAirfoil(elem.airfoilCode || '2412', chord, 30);
      if (points.length > 0) {
        const shape = new THREE.Shape();
        shape.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          shape.lineTo(points[i].x, points[i].y);
        }
        shape.closePath();
        if (!mainShape) {
          mainShape = shape;
        } else {
          shapes.push(shape);
        }
      }
    } else if (elem.kind === 'rect' && elem.points.length >= 2) {
      const [p1, p2] = elem.points;
      const x = Math.min(p1.x, p2.x);
      const y = Math.min(p1.y, p2.y);
      const w = Math.abs(p2.x - p1.x);
      const h = Math.abs(p2.y - p1.y);

      const shape = new THREE.Shape();
      shape.moveTo(x, y);
      shape.lineTo(x + w, y);
      shape.lineTo(x + w, y + h);
      shape.lineTo(x, y + h);
      shape.closePath();

      if (!mainShape) {
        mainShape = shape;
      } else {
        shapes.push(shape);
      }
    } else if (elem.kind === 'polygon' && elem.points.length >= 1) {
      const center = elem.points[0];
      const r = elem.radius || 25;
      const sides = elem.sides || 6;
      const shape = new THREE.Shape();
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2;
        const px = center.x + r * Math.cos(angle);
        const py = center.y + r * Math.sin(angle);
        if (i === 0) shape.moveTo(px, py);
        else shape.lineTo(px, py);
      }
      shape.closePath();

      if (!mainShape) {
        mainShape = shape;
      } else {
        shapes.push(shape);
      }
    } else if (elem.kind === 'circle' && elem.points.length >= 1) {
      const center = elem.points[0];
      const r = elem.radius || 20;

      if (mainShape) {
        // Add as a hole inside the primary shape
        const holePath = new THREE.Path();
        holePath.absarc(center.x, center.y, r, 0, Math.PI * 2, true);
        mainShape.holes.push(holePath);
      } else {
        const shape = new THREE.Shape();
        shape.absarc(center.x, center.y, r, 0, Math.PI * 2, false);
        mainShape = shape;
      }
    } else if (elem.kind === 'line' && elem.points.length >= 2) {
      const shape = new THREE.Shape();
      shape.moveTo(elem.points[0].x, elem.points[0].y);
      for (let i = 1; i < elem.points.length; i++) {
        shape.lineTo(elem.points[i].x, elem.points[i].y);
      }
      shape.closePath();
      if (!mainShape) {
        mainShape = shape;
      } else {
        shapes.push(shape);
      }
    }
  }

  if (mainShape) {
    shapes.unshift(mainShape);
  }

  return shapes;
}

/**
 * Positions a geometry based on plane selection
 */
export function applyPlaneTransformation(
  object: THREE.Object3D, 
  plane: PlaneType, 
  offset: number = 0
) {
  switch (plane) {
    case 'Top':
      // XY sketch plane mapped to XZ 3D plane
      object.rotation.x = -Math.PI / 2;
      object.position.y = offset;
      break;
    case 'Front':
      // XY sketch plane mapped to XY 3D plane
      object.position.z = offset;
      break;
    case 'Right':
      // XY sketch plane mapped to YZ 3D plane
      object.rotation.y = Math.PI / 2;
      object.position.x = offset;
      break;
  }
}

/**
 * Builds 3D Meshes for a given feature in the project
 */
export function buildFeatureMesh(
  feature: CADFeature, 
  project: CADProject
): { mesh: THREE.Mesh; edgeLines: THREE.LineSegments } | null {
  if (feature.suppressed || !feature.visible) return null;

  let geometry: THREE.BufferGeometry | null = null;

  if (feature.type === 'extrude') {
    const params = feature.params as ExtrudeParams;
    const sketch = project.sketches.find(s => s.id === params.sketchId);
    if (!sketch) return null;

    const shapes = buildShapeFromSketch(sketch);
    if (shapes.length === 0) return null;

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: params.depth || 50,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.5,
      bevelThickness: 0.5
    };

    // Main shape geometry
    geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
    // Center alignment if symmetric
    if (params.symmetric) {
      geometry.translate(0, 0, -params.depth / 2);
    }

  } else if (feature.type === 'revolve') {
    const params = feature.params as RevolveParams;
    const sketch = project.sketches.find(s => s.id === params.sketchId);
    if (!sketch) return null;

    const shapes = buildShapeFromSketch(sketch);
    if (shapes.length === 0) return null;

    // Convert shape points to 2D vector path for Lathe
    const points2d: THREE.Vector2[] = [];
    const shape = shapes[0];
    const curvePoints = shape.getPoints(32);
    curvePoints.forEach(pt => points2d.push(new THREE.Vector2(pt.x, pt.y)));

    const angleRad = (params.angle || 360) * (Math.PI / 180);
    geometry = new THREE.LatheGeometry(points2d, 32, 0, angleRad);

  } else if (feature.type === 'loft') {
    const params = feature.params as LoftParams;
    const sketchList = (params.sketchIds || [])
      .map(id => project.sketches.find(s => s.id === id))
      .filter((s): s is Sketch2D => !!s);

    if (sketchList.length < 2) return null;

    // Construct loft sections using parametric curves
    const sectionShapes = sketchList.map(s => buildShapeFromSketch(s)[0]).filter(Boolean);
    if (sectionShapes.length < 2) return null;

    // Loft via Extrude along custom curve or custom mesh generation
    // We sample points on each profile section and create quad faces along sections
    const sampleCount = 64;
    const sectionsPoints = sketchList.map((sk, idx) => {
      const shape = buildShapeFromSketch(sk)[0];
      const pts = shape ? shape.getPoints(sampleCount) : [];
      // Transform each profile by its plane offset in 3D
      return pts.map(p => new THREE.Vector3(p.x, p.y, sk.planeOffset));
    });

    // Build loft mesh vertices & indices manually for seamless lofting
    const vertices: number[] = [];
    const indices: number[] = [];

    const numSections = sectionsPoints.length;
    for (let s = 0; s < numSections; s++) {
      const pts = sectionsPoints[s];
      for (let i = 0; i < pts.length; i++) {
        vertices.push(pts[i].x, pts[i].y, pts[i].z);
      }
    }

    const ptsPerSection = sectionsPoints[0].length;
    for (let s = 0; s < numSections - 1; s++) {
      for (let i = 0; i < ptsPerSection - 1; i++) {
        const curr = s * ptsPerSection + i;
        const next = curr + 1;
        const above = (s + 1) * ptsPerSection + i;
        const aboveNext = above + 1;

        // Quad split into 2 triangles
        indices.push(curr, next, aboveNext);
        indices.push(curr, aboveNext, above);
      }
    }

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
  }

  if (!geometry) return null;

  // Plane position transform
  const sketch = project.sketches.find(s => s.id === feature.sketchId);
  const plane = sketch ? sketch.plane : 'Top';
  const offset = sketch ? sketch.planeOffset : 0;

  // Material setup
  const matProps = PRESET_MATERIALS.find(m => m.id === feature.materialId) || PRESET_MATERIALS[0];
  const colorHex = feature.color || matProps.color;

  const material = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: matProps.metalness,
    roughness: matProps.roughness,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  applyPlaneTransformation(mesh, plane, offset);
  mesh.updateMatrixWorld();

  // Edge line rendering for CAD outline clarity
  const edgesGeom = new THREE.EdgesGeometry(geometry, 25); // threshold angle
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x111827, linewidth: 1.5 });
  const edgeLines = new THREE.LineSegments(edgesGeom, edgeMat);

  applyPlaneTransformation(edgeLines, plane, offset);

  return { mesh, edgeLines };
}

/**
 * Calculate physical properties (Volume, Mass, Surface Area) for a mesh
 */
export function calculatePhysicalProps(mesh: THREE.Mesh, density: number) {
  const geom = mesh.geometry;
  geom.computeBoundingBox();
  const bbox = geom.boundingBox;

  if (!bbox) return { volume: 0, mass: 0, area: 0 };

  const size = new THREE.Vector3();
  bbox.getSize(size);

  // Approximate volumetric estimate (or exact for extruded prisms)
  const volumeCm3 = (size.x * size.y * size.z) / 1000; // converting mm3 to cm3
  const massGrams = volumeCm3 * density;
  const areaCm2 = (2 * (size.x * size.y + size.y * size.z + size.x * size.z)) / 100;

  return {
    volume: Math.round(volumeCm3 * 100) / 100,
    mass: Math.round(massGrams * 100) / 100,
    area: Math.round(areaCm2 * 100) / 100
  };
}
