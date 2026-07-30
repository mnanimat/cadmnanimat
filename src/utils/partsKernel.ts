import { StandardPartSpec, CADFeature, Sketch2D, CADPart } from '../types/cad';
import { PRESET_MATERIALS } from './cadKernel';

export const STANDARD_HARDWARE_CATALOG: StandardPartSpec[] = [
  // Parafusos / Bolts
  {
    id: 'bolt_hex_m6x25',
    type: 'bolt_hex',
    category: 'Parafusos',
    norm: 'ISO 4017 / DIN 933',
    name: 'Parafuso Sextavado M6 x 25mm',
    nominalSize: 'M6',
    lengthMm: 25,
    threadPitch: 1.0,
    materialId: 'steel_316',
    weightGrams: 8.5
  },
  {
    id: 'bolt_hex_m8x35',
    type: 'bolt_hex',
    category: 'Parafusos',
    norm: 'ISO 4017 / DIN 933',
    name: 'Parafuso Sextavado M8 x 35mm',
    nominalSize: 'M8',
    lengthMm: 35,
    threadPitch: 1.25,
    materialId: 'steel_316',
    weightGrams: 18.2
  },
  {
    id: 'bolt_hex_m10x40',
    type: 'bolt_hex',
    category: 'Parafusos',
    norm: 'ISO 4017 / DIN 933',
    name: 'Parafuso Sextavado M10 x 40mm',
    nominalSize: 'M10',
    lengthMm: 40,
    threadPitch: 1.5,
    materialId: 'steel_316',
    weightGrams: 34.0
  },
  {
    id: 'bolt_allen_m6x20',
    type: 'bolt_allen',
    category: 'Parafusos',
    norm: 'ISO 4762 / DIN 912',
    name: 'Parafuso Cabeça Cilindrica Allen M6 x 20mm',
    nominalSize: 'M6',
    lengthMm: 20,
    threadPitch: 1.0,
    materialId: 'steel_316',
    weightGrams: 7.2
  },
  {
    id: 'bolt_allen_m8x30',
    type: 'bolt_allen',
    category: 'Parafusos',
    norm: 'ISO 4762 / DIN 912',
    name: 'Parafuso Cabeça Cilindrica Allen M8 x 30mm',
    nominalSize: 'M8',
    lengthMm: 30,
    threadPitch: 1.25,
    materialId: 'steel_316',
    weightGrams: 16.5
  },
  {
    id: 'bolt_flat_m6x20',
    type: 'bolt_flat',
    category: 'Parafusos',
    norm: 'ISO 10642 / DIN 7991',
    name: 'Parafuso Cabeça Chata Escareada M6 x 20mm',
    nominalSize: 'M6',
    lengthMm: 20,
    threadPitch: 1.0,
    materialId: 'steel_316',
    weightGrams: 5.8
  },

  // Porcas / Nuts
  {
    id: 'nut_hex_m6',
    type: 'nut_hex',
    category: 'Porcas',
    norm: 'ISO 4032 / DIN 934',
    name: 'Porca Sextavada M6 Padrão',
    nominalSize: 'M6',
    lengthMm: 5.2,
    threadPitch: 1.0,
    materialId: 'steel_316',
    weightGrams: 2.5
  },
  {
    id: 'nut_hex_m8',
    type: 'nut_hex',
    category: 'Porcas',
    norm: 'ISO 4032 / DIN 934',
    name: 'Porca Sextavada M8 Padrão',
    nominalSize: 'M8',
    lengthMm: 6.8,
    threadPitch: 1.25,
    materialId: 'steel_316',
    weightGrams: 5.2
  },
  {
    id: 'nut_nylon_m8',
    type: 'nut_nylon',
    category: 'Porcas',
    norm: 'DIN 985',
    name: 'Porca Auto-Travante com Nylon M8',
    nominalSize: 'M8',
    lengthMm: 8.0,
    threadPitch: 1.25,
    materialId: 'steel_316',
    weightGrams: 6.1
  },

  // Rolamentos & Mancais / Bearings
  {
    id: 'bearing_skf_6200',
    type: 'bearing_ball',
    category: 'Rolamentos',
    norm: 'ISO 15 / SKF 6200-2RS',
    name: 'Rolamento Rígido de Esferas SKF 6200 (10x30x9mm)',
    nominalSize: '6200',
    lengthMm: 9,
    materialId: 'steel_316',
    weightGrams: 32.0
  },
  {
    id: 'bearing_skf_6204',
    type: 'bearing_ball',
    category: 'Rolamentos',
    norm: 'ISO 15 / SKF 6204-2RS',
    name: 'Rolamento Rígido de Esferas SKF 6204 (20x47x14mm)',
    nominalSize: '6204',
    lengthMm: 14,
    materialId: 'steel_316',
    weightGrams: 106.0
  },
  {
    id: 'pillow_block_ucp204',
    type: 'pillow_block',
    category: 'Rolamentos',
    norm: 'ISO / UCP204',
    name: 'Mancal Pedestal Pillow Block UCP204 (Eixo 20mm)',
    nominalSize: 'UCP204',
    lengthMm: 38,
    materialId: 'steel_316',
    weightGrams: 680.0
  },

  // Arruelas / Washers
  {
    id: 'washer_flat_m6',
    type: 'washer_flat',
    category: 'Arruelas',
    norm: 'ISO 7089 / DIN 125',
    name: 'Arruela Lisa M6 (12mm DE x 1.6mm)',
    nominalSize: 'M6',
    lengthMm: 1.6,
    materialId: 'steel_316',
    weightGrams: 1.1
  },
  {
    id: 'washer_flat_m8',
    type: 'washer_flat',
    category: 'Arruelas',
    norm: 'ISO 7089 / DIN 125',
    name: 'Arruela Lisa M8 (16mm DE x 1.6mm)',
    nominalSize: 'M8',
    lengthMm: 1.6,
    materialId: 'steel_316',
    weightGrams: 2.0
  },

  // Perfis Estruturais / Beams
  {
    id: 'profile_i_100x50',
    type: 'profile_i',
    category: 'Perfis',
    norm: 'ISO 1025 / W100x50',
    name: 'Perfil I Estrutural 100mm x 50mm (Comprimento 100mm)',
    nominalSize: 'W100x50',
    lengthMm: 100,
    materialId: 'steel_316',
    weightGrams: 930.0
  },
  {
    id: 'profile_angle_40x40',
    type: 'profile_angle',
    category: 'Perfis',
    norm: 'ISO 657 / Cantoneira 40x40x4mm',
    name: 'Cantoneira em L 40mm x 40mm x 4mm (Comprimento 100mm)',
    nominalSize: 'L40x40x4',
    lengthMm: 100,
    materialId: 'al_6061',
    weightGrams: 240.0
  }
];

export function importStandardPartToProject(
  spec: StandardPartSpec,
  customLengthMm?: number
): { sketch: Sketch2D; feature: CADFeature; part: CADPart } {
  const timestamp = Date.now();
  const sketchId = `sketch_iso_${timestamp}`;
  const featureId = `feat_iso_${timestamp}`;
  const partId = `part_iso_${timestamp}`;

  const length = customLengthMm || spec.lengthMm;

  let sketch: Sketch2D;
  let feature: CADFeature;

  if (spec.type === 'bolt_hex' || spec.type === 'nut_hex' || spec.type === 'nut_nylon') {
    // Hexagonal geometry
    const diaNum = parseInt(spec.nominalSize.replace('M', ''), 10) || 8;
    const hexRadius = diaNum * 0.95;

    sketch = {
      id: sketchId,
      name: `Esboço ${spec.name}`,
      plane: 'Top',
      planeOffset: 0,
      visible: true,
      suppressed: false,
      elements: [
        {
          id: `elem_hex_${timestamp}`,
          kind: 'polygon',
          sides: 6,
          radius: hexRadius,
          points: [{ x: 0, y: 0 }]
        },
        {
          id: `elem_hole_${timestamp}`,
          kind: 'circle',
          radius: spec.type.includes('nut') ? diaNum / 2 : diaNum / 2,
          points: [{ x: 0, y: 0 }]
        }
      ]
    };

    feature = {
      id: featureId,
      name: spec.name,
      type: 'extrude',
      sketchId,
      params: {
        sketchId,
        depth: length,
        symmetric: false,
        operation: 'add'
      },
      visible: true,
      suppressed: false,
      color: spec.category === 'Parafusos' ? '#94a3b8' : '#38bdf8',
      materialId: spec.materialId,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    };

  } else if (spec.type === 'bearing_ball') {
    // Circular bearing ring geometry
    const is6200 = spec.nominalSize.includes('6200');
    const outerRadius = is6200 ? 15 : 23.5;
    const innerRadius = is6200 ? 5 : 10;

    sketch = {
      id: sketchId,
      name: `Esboço ${spec.name}`,
      plane: 'Front',
      planeOffset: 0,
      visible: true,
      suppressed: false,
      elements: [
        {
          id: `elem_outer_${timestamp}`,
          kind: 'circle',
          radius: outerRadius,
          points: [{ x: 0, y: 0 }]
        },
        {
          id: `elem_inner_${timestamp}`,
          kind: 'circle',
          radius: innerRadius,
          points: [{ x: 0, y: 0 }]
        }
      ]
    };

    feature = {
      id: featureId,
      name: spec.name,
      type: 'extrude',
      sketchId,
      params: {
        sketchId,
        depth: length,
        symmetric: true,
        operation: 'add'
      },
      visible: true,
      suppressed: false,
      color: '#0284c7',
      materialId: 'steel_316',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    };

  } else {
    // Default rectangular / cylindrical structural geometry
    sketch = {
      id: sketchId,
      name: `Esboço ${spec.name}`,
      plane: 'Top',
      planeOffset: 0,
      visible: true,
      suppressed: false,
      elements: [
        {
          id: `elem_rect_${timestamp}`,
          kind: 'rect',
          points: [{ x: -20, y: -20 }, { x: 20, y: 20 }]
        }
      ]
    };

    feature = {
      id: featureId,
      name: spec.name,
      type: 'extrude',
      sketchId,
      params: {
        sketchId,
        depth: length,
        symmetric: false,
        operation: 'add'
      },
      visible: true,
      suppressed: false,
      color: '#34d399',
      materialId: spec.materialId,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    };
  }

  const matProps = PRESET_MATERIALS.find(m => m.id === spec.materialId) || PRESET_MATERIALS[0];

  const part: CADPart = {
    id: partId,
    name: spec.name,
    featureIds: [featureId],
    material: matProps,
    visible: true,
    color: feature.color || matProps.color,
    volume: Math.round(spec.weightGrams / matProps.density),
    mass: spec.weightGrams,
    surfaceArea: Math.round(length * 25)
  };

  return { sketch, feature, part };
}
