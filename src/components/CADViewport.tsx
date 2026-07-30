import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls, TransformControls } from 'three-stdlib';
import { 
  CADProject, 
  DisplayMode, 
  PlaneType, 
  Point3D, 
  MeasurementResult,
  ActiveTool,
  CFDConfig
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
  activeTool: ActiveTool;
  selectedFeatureId?: string;
  cfdConfig?: CFDConfig;
  snapMode?: 'vertex' | 'edge' | 'face' | 'any';
  onSelectPlane: (plane: PlaneType) => void;
  onSelectFeature?: (featureId: string) => void;
  onUpdateFeatureTransform?: (featureId: string, transform: { position?: Point3D; rotation?: Point3D; scale?: Point3D }) => void;
  onMeasureSelect?: (result: MeasurementResult) => void;
  isMeasuring?: boolean;
  theme?: 'dark' | 'light';
}

export const CADViewport: React.FC<CADViewportProps> = ({
  project,
  displayMode,
  showPlanes,
  showGrid,
  sectionView,
  activePlane,
  activeTool,
  selectedFeatureId,
  cfdConfig,
  snapMode = 'any',
  onSelectPlane,
  onSelectFeature,
  onUpdateFeatureTransform,
  onMeasureSelect,
  isMeasuring = false,
  theme = 'dark'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const planesGroupRef = useRef<THREE.Group | null>(null);
  const cfdGroupRef = useRef<THREE.Group | null>(null);
  const cfdParticlesRef = useRef<THREE.Points | null>(null);
  const measureGroupRef = useRef<THREE.Group | null>(null);
  const cfdConfigRef = useRef<CFDConfig | undefined>(cfdConfig);
  const modelBBoxRef = useRef<THREE.Box3>(new THREE.Box3());

  useEffect(() => {
    cfdConfigRef.current = cfdConfig;
  }, [cfdConfig]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(theme === 'light' ? '#f1f5f9' : '#0f172a');
    }
  }, [theme]);

  const [activeViewName, setActiveViewName] = useState<string>('Isometric');
  const [measurePoints, setMeasurePoints] = useState<Point3D[]>([]);
  const [hoverPointState, setHoverPointState] = useState<{ pt: Point3D; label: string } | null>(null);
  const [screenOverlays, setScreenOverlays] = useState<{
    p1: { x: number; y: number; visible: boolean } | null;
    p2: { x: number; y: number; visible: boolean } | null;
    mid: { x: number; y: number; visible: boolean } | null;
    hover: { x: number; y: number; visible: boolean; label: string } | null;
  }>({ p1: null, p2: null, mid: null, hover: null });

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === 'light' ? '#f1f5f9' : '#0f172a');
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width > 0 && height > 0 ? width / height : 1.33, 0.1, 5000);
    camera.position.set(300, 250, 400);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 3500;
    controls.minDistance = 5;
    controls.screenSpacePanning = true;
    controls.enablePan = true;
    controls.panSpeed = 1.2;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controlsRef.current = controls;

    // Transform Controls Gizmo
    const tControls = new TransformControls(camera, renderer.domElement) as any;
    tControls.size = 0.85;
    tControls.addEventListener('dragging-changed', (event: any) => {
      controls.enabled = !event.value;
    });

    tControls.addEventListener('objectChange', () => {
      if (tControls.object && onUpdateFeatureTransform) {
        const obj = tControls.object;
        const featId = obj.userData?.featureId;
        if (featId) {
          onUpdateFeatureTransform(featId, {
            position: {
              x: Math.round(obj.position.x * 10) / 10,
              y: Math.round(obj.position.y * 10) / 10,
              z: Math.round(obj.position.z * 10) / 10,
            },
            rotation: {
              x: Math.round((obj.rotation.x * 180 / Math.PI) * 10) / 10,
              y: Math.round((obj.rotation.y * 180 / Math.PI) * 10) / 10,
              z: Math.round((obj.rotation.z * 180 / Math.PI) * 10) / 10,
            },
            scale: {
              x: Math.round(obj.scale.x * 100) / 100,
              y: Math.round(obj.scale.y * 100) / 100,
              z: Math.round(obj.scale.z * 100) / 100,
            }
          });
        }
      }
    });

    scene.add(tControls);
    transformControlsRef.current = tControls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(200, 400, 300);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.5);
    dirLight2.position.set(-200, -100, -200);
    scene.add(dirLight2);

    // Grid
    const grid = new THREE.GridHelper(1000, 50, 0x0284c7, 0x334155);
    grid.name = 'CAD_GRID';
    grid.position.y = -0.1;
    scene.add(grid);

    // Groups
    const modelGroup = new THREE.Group();
    modelGroup.name = 'MODEL_GROUP';
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const planesGroup = new THREE.Group();
    planesGroup.name = 'PLANES_GROUP';
    scene.add(planesGroup);
    planesGroupRef.current = planesGroup;

    const cfdGroup = new THREE.Group();
    cfdGroup.name = 'CFD_GROUP';
    scene.add(cfdGroup);
    cfdGroupRef.current = cfdGroup;

    const measureGroup = new THREE.Group();
    measureGroup.name = 'MEASURE_GROUP';
    scene.add(measureGroup);
    measureGroupRef.current = measureGroup;

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();

      // Animate CFD particle streamlines
      if (cfdParticlesRef.current && cfdConfigRef.current?.enabled) {
        const positions = cfdParticlesRef.current.geometry.attributes.position;
        const pArray = positions.array as Float32Array;
        const count = positions.count;
        const speed = (cfdConfigRef.current.windSpeedMs || 35) * 0.15;

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          pArray[idx + 2] -= speed; // Wind blowing along -Z
          if (pArray[idx + 2] < -350) {
            pArray[idx + 2] = 350;
            pArray[idx] = (Math.random() - 0.5) * 320;
            pArray[idx + 1] = (Math.random() - 0.5) * 220 + 20;
          }
        }
        positions.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w === 0 || h === 0) return;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      tControls.detach();
      tControls.dispose();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Sync Transform Gizmo mode & target object in any mode
  useEffect(() => {
    if (!transformControlsRef.current || !modelGroupRef.current) return;
    const tControls = transformControlsRef.current;

    const isTransformTool = activeTool === 'translate' || activeTool === 'rotate' || activeTool === 'scale';
    
    if (isTransformTool) {
      tControls.setMode(activeTool);
      tControls.enabled = true;
    } else {
      tControls.enabled = false;
      tControls.detach();
      return;
    }

    let targetMesh: THREE.Object3D | null = null;
    const targetId = selectedFeatureId || (project.features[0] ? project.features[0].id : undefined);

    if (targetId && modelGroupRef.current) {
      modelGroupRef.current.traverse((child) => {
        if (!targetMesh && child.userData && child.userData.featureId === targetId && child instanceof THREE.Mesh) {
          targetMesh = child;
        }
      });
    }

    // Fallback: first mesh in model group
    if (!targetMesh && modelGroupRef.current) {
      modelGroupRef.current.traverse((child) => {
        if (!targetMesh && child instanceof THREE.Mesh && child.parent) {
          targetMesh = child;
        }
      });
    }

    if (targetMesh && (targetMesh as THREE.Object3D).parent && isTransformTool) {
      tControls.attach(targetMesh);
    } else {
      tControls.detach();
    }
  }, [selectedFeatureId, activeTool, project]);

  // Update Workplanes Rendering
  useEffect(() => {
    if (!planesGroupRef.current) return;
    const group = planesGroupRef.current;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (!showPlanes) return;

    const planeSize = 300;
    const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);

    const createPlaneMesh = (type: PlaneType, colorHex: number, rot: [number, number, number]) => {
      const planeMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: activePlane === type ? 0.25 : 0.08,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(planeGeometry, planeMat);
      mesh.rotation.set(...rot);

      const edges = new THREE.EdgesGeometry(planeGeometry);
      const lineMat = new THREE.LineBasicMaterial({
        color: activePlane === type ? 0x38bdf8 : colorHex,
        linewidth: activePlane === type ? 2 : 1
      });
      const border = new THREE.LineSegments(edges, lineMat);
      mesh.add(border);

      return mesh;
    };

    const topPlane = createPlaneMesh('Top', 0x38bdf8, [-Math.PI / 2, 0, 0]);
    const frontPlane = createPlaneMesh('Front', 0x22c55e, [0, 0, 0]);
    const rightPlane = createPlaneMesh('Right', 0xef4444, [0, Math.PI / 2, 0]);

    group.add(topPlane, frontPlane, rightPlane);
  }, [showPlanes, activePlane]);

  // Grid visibility effect
  useEffect(() => {
    if (!sceneRef.current) return;
    const grid = sceneRef.current.getObjectByName('CAD_GRID');
    if (grid) grid.visible = showGrid;
  }, [showGrid]);

  // Section Cut View Effect
  useEffect(() => {
    if (!rendererRef.current) return;
    if (sectionView) {
      const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10);
      rendererRef.current.clippingPlanes = [plane];
      rendererRef.current.localClippingEnabled = true;
    } else {
      rendererRef.current.clippingPlanes = [];
      rendererRef.current.localClippingEnabled = false;
    }
  }, [sectionView]);

  // Rebuild 3D CAD Geometries when project changes
  useEffect(() => {
    if (!modelGroupRef.current) return;
    const group = modelGroupRef.current;

    if (transformControlsRef.current) {
      transformControlsRef.current.detach();
    }

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    for (const feature of project.features) {
      const built = buildFeatureMesh(feature, project);
      if (built) {
        if (selectedFeatureId && feature.id === selectedFeatureId) {
          (built.mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color('#0284c7');
          (built.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.35;
        }
        group.add(built.mesh);
        group.add(built.edgeLines);
      }
    }

    if (group.children.length > 0 && controlsRef.current && !selectedFeatureId) {
      const bbox = new THREE.Box3().setFromObject(group);
      modelBBoxRef.current.copy(bbox);
      const center = new THREE.Vector3();
      bbox.getCenter(center);
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
  }, [project, selectedFeatureId]);

  // CFD Visualizers
  useEffect(() => {
    if (!cfdGroupRef.current) return;
    const cfdGroup = cfdGroupRef.current;

    while (cfdGroup.children.length > 0) {
      cfdGroup.remove(cfdGroup.children[0]);
    }
    cfdParticlesRef.current = null;

    if (!cfdConfig || !cfdConfig.enabled) return;

    if (cfdConfig.showStreamlines) {
      const pCount = cfdConfig.streamlineParticlesCount || 250;
      const positions = new Float32Array(pCount * 3);
      const colors = new Float32Array(pCount * 3);

      for (let i = 0; i < pCount; i++) {
        const idx = i * 3;
        positions[idx] = (Math.random() - 0.5) * 320;
        positions[idx + 1] = (Math.random() - 0.5) * 220 + 20;
        positions[idx + 2] = (Math.random() - 0.5) * 700;

        const col = new THREE.Color();
        col.setHSL(0.55 - (i % 10) * 0.03, 0.9, 0.6);
        colors[idx] = col.r;
        colors[idx + 1] = col.g;
        colors[idx + 2] = col.b;
      }

      const pGeom = new THREE.BufferGeometry();
      pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const pMat = new THREE.PointsMaterial({
        size: 3.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(pGeom, pMat);
      cfdParticlesRef.current = particles;
      cfdGroup.add(particles);
    }
  }, [cfdConfig, project]);

  // Handle Display Modes
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

  // View Cube Camera Trigger
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

  // Snapping logic for Paquímetro Metrology Tool
  const getSnappedPoint = (
    intersect: THREE.Intersection,
    mode: 'vertex' | 'edge' | 'face' | 'any'
  ): { point: Point3D; label: string } => {
    const mesh = intersect.object;
    const rawPt = intersect.point;

    if (mesh instanceof THREE.Mesh && mesh.geometry) {
      const geom = mesh.geometry as THREE.BufferGeometry;
      const posAttr = geom.attributes.position;

      if (posAttr && (mode === 'vertex' || mode === 'any')) {
        let minSqDist = Infinity;
        const closestWorld = rawPt.clone();
        const v = new THREE.Vector3();

        for (let i = 0; i < posAttr.count; i++) {
          v.fromBufferAttribute(posAttr, i);
          v.applyMatrix4(mesh.matrixWorld);
          const sqDist = v.distanceToSquared(rawPt);
          if (sqDist < minSqDist) {
            minSqDist = sqDist;
            closestWorld.copy(v);
          }
        }

        if (mode === 'vertex' || Math.sqrt(minSqDist) < 18) {
          return {
            point: {
              x: Math.round(closestWorld.x * 10) / 10,
              y: Math.round(closestWorld.y * 10) / 10,
              z: Math.round(closestWorld.z * 10) / 10,
            },
            label: 'Vértice'
          };
        }
      }

      if (mode === 'edge' && intersect.face && posAttr) {
        const face = intersect.face;
        const a = new THREE.Vector3().fromBufferAttribute(posAttr, face.a).applyMatrix4(mesh.matrixWorld);
        const b = new THREE.Vector3().fromBufferAttribute(posAttr, face.b).applyMatrix4(mesh.matrixWorld);
        const c = new THREE.Vector3().fromBufferAttribute(posAttr, face.c).applyMatrix4(mesh.matrixWorld);

        const abMid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
        const bcMid = new THREE.Vector3().addVectors(b, c).multiplyScalar(0.5);
        const caMid = new THREE.Vector3().addVectors(c, a).multiplyScalar(0.5);

        const mids = [
          { pt: abMid, d: abMid.distanceToSquared(rawPt) },
          { pt: bcMid, d: bcMid.distanceToSquared(rawPt) },
          { pt: caMid, d: caMid.distanceToSquared(rawPt) },
        ];
        mids.sort((m1, m2) => m1.d - m2.d);

        return {
          point: {
            x: Math.round(mids[0].pt.x * 10) / 10,
            y: Math.round(mids[0].pt.y * 10) / 10,
            z: Math.round(mids[0].pt.z * 10) / 10,
          },
          label: 'Aresta'
        };
      }

      if (mode === 'face' && intersect.face && posAttr) {
        const face = intersect.face;
        const a = new THREE.Vector3().fromBufferAttribute(posAttr, face.a).applyMatrix4(mesh.matrixWorld);
        const b = new THREE.Vector3().fromBufferAttribute(posAttr, face.b).applyMatrix4(mesh.matrixWorld);
        const c = new THREE.Vector3().fromBufferAttribute(posAttr, face.c).applyMatrix4(mesh.matrixWorld);
        const center = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3);

        return {
          point: {
            x: Math.round(center.x * 10) / 10,
            y: Math.round(center.y * 10) / 10,
            z: Math.round(center.z * 10) / 10,
          },
          label: 'Centro da Face'
        };
      }
    }

    return {
      point: {
        x: Math.round(rawPt.x * 10) / 10,
        y: Math.round(rawPt.y * 10) / 10,
        z: Math.round(rawPt.z * 10) / 10,
      },
      label: mode === 'face' ? 'Face' : mode === 'edge' ? 'Aresta' : 'Superfície'
    };
  };

  // Pointer move handler for Paquímetro hover
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMeasuring || !containerRef.current || !cameraRef.current || !modelGroupRef.current) {
      if (hoverPointState) setHoverPointState(null);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(modelGroupRef.current.children, true);

    if (intersects.length > 0) {
      const currentSnapMode = (snapMode || 'any') as 'vertex' | 'edge' | 'face' | 'any';
      const snapped = getSnappedPoint(intersects[0], currentSnapMode);
      setHoverPointState(snapped);
    } else {
      setHoverPointState(null);
    }
  };

  // Render 3D measurement markers and ruler lines
  useEffect(() => {
    if (!measureGroupRef.current) return;
    const mGroup = measureGroupRef.current;

    while (mGroup.children.length > 0) {
      mGroup.remove(mGroup.children[0]);
    }

    // Hover point indicator
    if (isMeasuring && hoverPointState) {
      const hMesh = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b, depthTest: false })
      );
      hMesh.position.set(hoverPointState.pt.x, hoverPointState.pt.y, hoverPointState.pt.z);
      mGroup.add(hMesh);
    }

    // Point 1 (Emerald Sphere)
    if (measurePoints[0]) {
      const p1 = measurePoints[0];
      const p1Mesh = new THREE.Mesh(
        new THREE.SphereGeometry(3.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x10b981, depthTest: false })
      );
      p1Mesh.position.set(p1.x, p1.y, p1.z);
      mGroup.add(p1Mesh);
    }

    // Point 2 (Cyan Sphere) & Connecting 3D Ruler Line
    if (measurePoints[1]) {
      const p2 = measurePoints[1];
      const p2Mesh = new THREE.Mesh(
        new THREE.SphereGeometry(3.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, depthTest: false })
      );
      p2Mesh.position.set(p2.x, p2.y, p2.z);
      mGroup.add(p2Mesh);

      if (measurePoints[0]) {
        const p1 = measurePoints[0];
        const lineGeom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(p1.x, p1.y, p1.z),
          new THREE.Vector3(p2.x, p2.y, p2.z)
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          linewidth: 3,
          depthTest: false
        });
        const line = new THREE.Line(lineGeom, lineMat);
        mGroup.add(line);
      }
    }
  }, [measurePoints, hoverPointState, isMeasuring]);

  // Update screen overlay positions for HTML badges
  useEffect(() => {
    if (!isMeasuring && measurePoints.length === 0) {
      setScreenOverlays({ p1: null, p2: null, mid: null, hover: null });
      return;
    }

    const updateProjections = () => {
      if (!cameraRef.current || !containerRef.current) return;
      const cam = cameraRef.current;
      const rect = containerRef.current.getBoundingClientRect();

      const projectVec = (p: Point3D) => {
        const v = new THREE.Vector3(p.x, p.y, p.z);
        v.project(cam);
        return {
          x: (v.x * 0.5 + 0.5) * rect.width,
          y: (-v.y * 0.5 + 0.5) * rect.height,
          visible: v.z < 1
        };
      };

      const p1 = measurePoints[0] ? projectVec(measurePoints[0]) : null;
      const p2 = measurePoints[1] ? projectVec(measurePoints[1]) : null;

      let mid = null;
      if (measurePoints[0] && measurePoints[1]) {
        const mPt: Point3D = {
          x: (measurePoints[0].x + measurePoints[1].x) / 2,
          y: (measurePoints[0].y + measurePoints[1].y) / 2,
          z: (measurePoints[0].z + measurePoints[1].z) / 2,
        };
        mid = projectVec(mPt);
      }

      const hvr = hoverPointState ? { ...projectVec(hoverPointState.pt), label: hoverPointState.label } : null;

      setScreenOverlays({ p1, p2, mid, hover: hvr });
    };

    updateProjections();
  }, [measurePoints, hoverPointState, isMeasuring]);

  // Raycasting for Selection & Measurement tool
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current || !modelGroupRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(modelGroupRef.current.children, true);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      const featId = hitObj.userData?.featureId;

      if (featId && onSelectFeature && !isMeasuring) {
        onSelectFeature(featId);
      }

      if (isMeasuring) {
        const currentSnapMode = (snapMode || 'any') as 'vertex' | 'edge' | 'face' | 'any';
        const snapped = hoverPointState ? hoverPointState : getSnappedPoint(intersects[0], currentSnapMode);
        const pt3d: Point3D = snapped.point;

        if (measurePoints.length === 0) {
          setMeasurePoints([pt3d]);
        } else if (measurePoints.length >= 1) {
          const p1 = measurePoints[0];
          const p2 = pt3d;
          const dx = Math.round(Math.abs(p2.x - p1.x) * 10) / 10;
          const dy = Math.round(Math.abs(p2.y - p1.y) * 10) / 10;
          const dz = Math.round(Math.abs(p2.z - p1.z) * 10) / 10;
          const dist = Math.round(Math.hypot(dx, dy, dz) * 10) / 10;

          setMeasurePoints([p1, p2]);

          if (onMeasureSelect) {
            onMeasureSelect({ p1, p2, distance: dist, dx, dy, dz, snapType: snapped.label as any });
          }
        }
      }
    }
  };

  const currentDist = measurePoints.length === 2 
    ? Math.round(Math.hypot(
        measurePoints[1].x - measurePoints[0].x,
        measurePoints[1].y - measurePoints[0].y,
        measurePoints[1].z - measurePoints[0].z
      ) * 10) / 10
    : null;

  return (
    <div 
      ref={containerRef} 
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className="w-full h-full relative overflow-hidden bg-slate-950 select-none"
    >
      {/* Floating ViewCube Overlay */}
      <div className="absolute top-4 right-4 z-20">
        <ViewCube onSelectView={handleSelectView} activeView={activeViewName} />
      </div>

      {/* Axis Gizmo Label */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
        <span className="text-red-400 font-bold">X (Eixo Lado)</span>
        <span className="text-green-400 font-bold">Y (Altura)</span>
        <span className="text-blue-400 font-bold">Z (Profundidade)</span>
      </div>

      {isMeasuring && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-500/90 text-slate-950 px-4 py-1.5 rounded-full font-bold text-xs shadow-lg animate-bounce">
          {measurePoints.length === 0 
            ? 'Clique no 1º ponto para medir' 
            : measurePoints.length === 1 
            ? 'Clique no 2º ponto para calcular distância' 
            : 'Medição Concluída (veja o painel)'}
        </div>
      )}

      {/* Interactive 3D Measurement Screen Overlay Labels */}
      {screenOverlays.hover && screenOverlays.hover.visible && isMeasuring && measurePoints.length < 2 && (
        <div
          style={{ left: `${screenOverlays.hover.x + 12}px`, top: `${screenOverlays.hover.y - 12}px` }}
          className="absolute pointer-events-none z-30 bg-amber-500/90 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-md shadow-lg backdrop-blur-sm"
        >
          {screenOverlays.hover.label}
        </div>
      )}

      {screenOverlays.p1 && screenOverlays.p1.visible && (
        <div
          style={{ left: `${screenOverlays.p1.x - 16}px`, top: `${screenOverlays.p1.y - 32}px` }}
          className="absolute pointer-events-none z-30 bg-emerald-500/90 text-slate-950 font-bold font-mono text-[10px] px-2 py-0.5 rounded-md shadow-lg"
        >
          P1
        </div>
      )}

      {screenOverlays.p2 && screenOverlays.p2.visible && (
        <div
          style={{ left: `${screenOverlays.p2.x - 16}px`, top: `${screenOverlays.p2.y - 32}px` }}
          className="absolute pointer-events-none z-30 bg-cyan-500/90 text-slate-950 font-bold font-mono text-[10px] px-2 py-0.5 rounded-md shadow-lg"
        >
          P2
        </div>
      )}

      {screenOverlays.mid && screenOverlays.mid.visible && currentDist !== null && (
        <div
          style={{ left: `${screenOverlays.mid.x - 40}px`, top: `${screenOverlays.mid.y - 16}px` }}
          className="absolute pointer-events-none z-30 bg-sky-600/95 text-white font-bold font-mono text-xs px-2.5 py-1 rounded-lg border border-sky-400 shadow-xl backdrop-blur-sm animate-pulse"
        >
          {currentDist} mm
        </div>
      )}
    </div>
  );
};
