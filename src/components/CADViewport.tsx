import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { 
  CADProject, 
  DisplayMode, 
  PlaneType, 
  Point3D, 
  MeasurementResult 
} from '../types/cad';
import { buildFeatureMesh } from '../utils/cadKernel';
import { ViewCube } from './ViewCube';

interface CADViewportProps {
  project: CADProject;
  displayMode: DisplayMode;
  showPlanes: boolean;
  showGrid: boolean;
  sectionView: boolean;
  activePlane: PlaneType;
  onSelectPlane: (plane: PlaneType) => void;
  onMeasureSelect?: (result: MeasurementResult) => void;
  isMeasuring?: boolean;
}

export const CADViewport: React.FC<CADViewportProps> = ({
  project,
  displayMode,
  showPlanes,
  showGrid,
  sectionView,
  activePlane,
  onSelectPlane,
  onMeasureSelect,
  isMeasuring = false
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const planesGroupRef = useRef<THREE.Group | null>(null);

  const [activeViewName, setActiveViewName] = useState<string>('Isometric');
  const [measurePoints, setMeasurePoints] = useState<Point3D[]>([]);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a'); // Rich Slate Navy
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
    camera.position.set(300, 250, 400);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 2500;
    controls.minDistance = 10;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(200, 400, 300);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.4);
    dirLight2.position.set(-200, -100, -200);
    scene.add(dirLight2);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(800, 40, 0x38bdf8, 0x334155);
    gridHelper.position.y = -0.1;
    gridHelper.name = 'CAD_GRID';
    scene.add(gridHelper);

    // Model Group container
    const modelGroup = new THREE.Group();
    modelGroup.name = 'CAD_MODEL_GROUP';
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Workplanes Group container
    const planesGroup = new THREE.Group();
    planesGroup.name = 'CAD_PLANES_GROUP';
    scene.add(planesGroup);
    planesGroupRef.current = planesGroup;

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize listener
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w <= 0 || h <= 0) return;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    // Initial call after a microtask to handle dynamic container layout
    setTimeout(handleResize, 50);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Workplanes Rendering (Top, Front, Right translucency)
  useEffect(() => {
    if (!planesGroupRef.current) return;
    const group = planesGroupRef.current;

    // Clear old planes
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (!showPlanes) return;

    const planeSize = 300;
    const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);

    const createPlaneMesh = (type: PlaneType, colorHex: number, rot: [number, number, number], name: string) => {
      const planeMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: activePlane === type ? 0.25 : 0.08,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(planeGeometry, planeMat);
      mesh.rotation.set(...rot);

      // Plane border outline
      const edges = new THREE.EdgesGeometry(planeGeometry);
      const lineMat = new THREE.LineBasicMaterial({
        color: activePlane === type ? 0x38bdf8 : colorHex,
        linewidth: activePlane === type ? 2 : 1
      });
      const border = new THREE.LineSegments(edges, lineMat);
      mesh.add(border);

      return mesh;
    };

    const topPlane = createPlaneMesh('Top', 0x38bdf8, [-Math.PI / 2, 0, 0], 'Top Plane');
    const frontPlane = createPlaneMesh('Front', 0x22c55e, [0, 0, 0], 'Front Plane');
    const rightPlane = createPlaneMesh('Right', 0xef4444, [0, Math.PI / 2, 0], 'Right Plane');

    group.add(topPlane, frontPlane, rightPlane);

  }, [showPlanes, activePlane]);

  // Grid visibility effect
  useEffect(() => {
    if (!sceneRef.current) return;
    const grid = sceneRef.current.getObjectByName('CAD_GRID');
    if (grid) grid.visible = showGrid;
  }, [showGrid]);

  // Rebuild 3D CAD Geometries when project changes
  useEffect(() => {
    if (!modelGroupRef.current) return;
    const group = modelGroupRef.current;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    for (const feature of project.features) {
      const built = buildFeatureMesh(feature, project);
      if (built) {
        group.add(built.mesh);
        group.add(built.edgeLines);
      }
    }

    // Auto-center camera target on model bounding box if geometries exist
    if (group.children.length > 0 && controlsRef.current) {
      const bbox = new THREE.Box3().setFromObject(group);
      const center = new THREE.Vector3();
      bbox.getCenter(center);
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
  }, [project]);

  // Handle Display Modes (Shaded, Wireframe, X-Ray)
  useEffect(() => {
    if (!modelGroupRef.current) return;

    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (displayMode === 'wireframe') {
          mat.wireframe = true;
          mat.transparent = false;
        } else if (displayMode === 'xray') {
          mat.wireframe = false;
          mat.transparent = true;
          mat.opacity = 0.4;
        } else {
          mat.wireframe = false;
          mat.transparent = false;
          mat.opacity = 1.0;
        }
        mat.needsUpdate = true;
      }
    });
  }, [displayMode]);

  // Camera orientation view cube trigger
  const handleSelectView = (view: 'Top' | 'Front' | 'Right' | 'Isometric' | 'Left' | 'Back' | 'Bottom') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctr = controlsRef.current;

    setActiveViewName(view);
    const dist = 400;

    switch (view) {
      case 'Top':
        cam.position.set(0, dist, 0);
        cam.lookAt(0, 0, 0);
        break;
      case 'Front':
        cam.position.set(0, 0, dist);
        cam.lookAt(0, 0, 0);
        break;
      case 'Right':
        cam.position.set(dist, 0, 0);
        cam.lookAt(0, 0, 0);
        break;
      case 'Isometric':
        cam.position.set(300, 250, 400);
        cam.lookAt(0, 0, 0);
        break;
      case 'Left':
        cam.position.set(-dist, 0, 0);
        cam.lookAt(0, 0, 0);
        break;
      case 'Back':
        cam.position.set(0, 0, -dist);
        cam.lookAt(0, 0, 0);
        break;
      case 'Bottom':
        cam.position.set(0, -dist, 0);
        cam.lookAt(0, 0, 0);
        break;
    }

    ctr.update();
  };

  // Raycasting for Measurement tool
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMeasuring || !containerRef.current || !cameraRef.current || !modelGroupRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(modelGroupRef.current.children, true);
    if (intersects.length > 0) {
      const hitPt = intersects[0].point;
      const pt3d: Point3D = {
        x: Math.round(hitPt.x * 10) / 10,
        y: Math.round(hitPt.y * 10) / 10,
        z: Math.round(hitPt.z * 10) / 10
      };

      const newPts = [...measurePoints, pt3d];
      setMeasurePoints(newPts);

      if (newPts.length === 2) {
        const [p1, p2] = newPts;
        const dx = Math.abs(p2.x - p1.x);
        const dy = Math.abs(p2.y - p1.y);
        const dz = Math.abs(p2.z - p1.z);
        const dist = Math.round(Math.hypot(dx, dy, dz) * 10) / 10;

        if (onMeasureSelect) {
          onMeasureSelect({ p1, p2, distance: dist, dx, dy, dz });
        }
        setMeasurePoints([]);
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      onPointerDown={handlePointerDown}
      className="w-full h-full relative overflow-hidden bg-slate-950 select-none"
    >
      {/* Floating ViewCube Overlay */}
      <div className="absolute top-4 right-4 z-20">
        <ViewCube onSelectView={handleSelectView} activeView={activeViewName} />
      </div>

      {/* Axis Gizmo Label */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
        <span className="text-red-400 font-bold">X (Direção)</span>
        <span className="text-green-400 font-bold">Y (Altura)</span>
        <span className="text-blue-400 font-bold">Z (Profundidade)</span>
      </div>

      {isMeasuring && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-500/90 text-slate-950 px-4 py-1.5 rounded-full font-bold text-xs shadow-lg animate-bounce">
          {measurePoints.length === 0 ? 'Clique no 1º ponto para medir' : 'Clique no 2º ponto para calcular distância'}
        </div>
      )}
    </div>
  );
};
