import { CADProject } from '../types/cad';

export const CAD_TEMPLATES: CADProject[] = [
  {
    id: 'rocket_3km',
    name: 'Foguete Experimental (Apogeu 3km) & Motor Sustentável',
    description: 'Foguete de sondagem de alta performance com coifa ogival, tubo em fibra de carbono, aletas 4x e câmara de combustão de motor híbrido.',
    activePlane: 'Front',
    sketches: [
      {
        id: 'sk_rocket_nose',
        name: 'Sketch 1 - Coifa Ogival & Módulo de Carga Útil',
        plane: 'Front',
        planeOffset: 350,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_nose_circle',
            kind: 'circle',
            points: [{ x: 0, y: 0 }],
            radius: 50
          }
        ]
      },
      {
        id: 'sk_rocket_body',
        name: 'Sketch 2 - Tubo de Corpo & Seção do Motor',
        plane: 'Front',
        planeOffset: 0,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_body_outer',
            kind: 'circle',
            points: [{ x: 0, y: 0 }],
            radius: 65
          },
          {
            id: 'e_body_inner',
            kind: 'circle',
            points: [{ x: 0, y: 0 }],
            radius: 58
          }
        ]
      },
      {
        id: 'sk_rocket_fins',
        name: 'Sketch 3 - Conjunto de Aletas Aerodinâmicas 4x',
        plane: 'Top',
        planeOffset: -200,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_fin_polygon',
            kind: 'polygon',
            points: [{ x: 0, y: 0 }],
            radius: 130,
            sides: 4
          }
        ]
      },
      {
        id: 'sk_rocket_nozzle',
        name: 'Sketch 4 - Bocal De Laval De Entrada/Saída Supersônica',
        plane: 'Front',
        planeOffset: -380,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_nozzle_circle',
            kind: 'circle',
            points: [{ x: 0, y: 0 }],
            radius: 42
          },
          {
            id: 'e_throat_circle',
            kind: 'circle',
            points: [{ x: 0, y: 0 }],
            radius: 18
          }
        ]
      }
    ],
    features: [
      {
        id: 'f_body_extrude',
        name: 'Extrusão 1 - Estrutura Principal do Foguete (Fusolagem)',
        type: 'extrude',
        sketchId: 'sk_rocket_body',
        params: { sketchId: 'sk_rocket_body', depth: 600, symmetric: true, operation: 'add' },
        visible: true,
        suppressed: false,
        materialId: 'carbon_fiber',
        color: '#0ea5e9'
      },
      {
        id: 'f_fins_extrude',
        name: 'Extrusão 2 - Aletas de Estabilização 4x',
        type: 'extrude',
        sketchId: 'sk_rocket_fins',
        params: { sketchId: 'sk_rocket_fins', depth: 12, symmetric: true, operation: 'add' },
        visible: true,
        suppressed: false,
        materialId: 'al_7075',
        color: '#f59e0b'
      },
      {
        id: 'f_nozzle_revolve',
        name: 'Revolução 1 - Bocal De Laval em Alumínio Aeroespacial',
        type: 'revolve',
        sketchId: 'sk_rocket_nozzle',
        params: { sketchId: 'sk_rocket_nozzle', angle: 360, axis: 'z', operation: 'add' },
        visible: true,
        suppressed: false,
        materialId: 'al_7075',
        color: '#14b8a6'
      }
    ],
    parts: [
      {
        id: 'part_rocket_assembly',
        name: 'Conjunto Foguete Apogeu 3km',
        featureIds: ['f_body_extrude', 'f_fins_extrude', 'f_nozzle_revolve'],
        material: { id: 'carbon_fiber', name: 'Fibra de Carbono & Alumínio 7075', density: 1.85, color: '#0ea5e9', metalness: 0.7, roughness: 0.3 },
        visible: true,
        color: '#0ea5e9',
        volume: 2450.0,
        mass: 4532.5,
        surfaceArea: 5800.0
      }
    ]
  },
  {
    id: 'formula_chassis',
    name: 'Fórmula SAE (Elétrico / H2O / Autônomo)',
    description: 'Monocoque tubular de alto rendimento, suporte de bateria / célula H2O e pacote aerodinâmico.',
    activePlane: 'Top',
    sketches: [
      {
        id: 'sk_chassis_frame',
        name: 'Sketch 1 - Perfil da Célula de Sobrevivência',
        plane: 'Top',
        planeOffset: 0,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_chassis_rect',
            kind: 'rect',
            points: [{ x: -80, y: -220 }, { x: 80, y: 220 }]
          },
          {
            id: 'e_cockpit_circle',
            kind: 'circle',
            points: [{ x: 0, y: 30 }],
            radius: 45
          }
        ]
      }
    ],
    features: [
      {
        id: 'f_chassis_extrude',
        name: 'Extrusão 1 - Estrutura Monocoque SAE',
        type: 'extrude',
        sketchId: 'sk_chassis_frame',
        params: { sketchId: 'sk_chassis_frame', depth: 85, symmetric: true, operation: 'add' },
        visible: true,
        suppressed: false,
        materialId: 'carbon_fiber',
        color: '#14b8a6'
      }
    ],
    parts: [
      {
        id: 'part_formula',
        name: 'Monocoque Fórmula SAE',
        featureIds: ['f_chassis_extrude'],
        material: { id: 'carbon_fiber', name: 'Fibra de Carbono Monocoque', density: 1.55, color: '#14b8a6', metalness: 0.6, roughness: 0.4 },
        visible: true,
        color: '#14b8a6',
        volume: 1850.0,
        mass: 2867.0,
        surfaceArea: 4200.0
      }
    ]
  },
  {
    id: 'airplane_wing',
    name: 'Asa de Avião - Perfis NACA',
    description: 'Estrutura aeronáutica completa com nervuras, longarinas e perfil aerodinâmico NACA 2412.',
    activePlane: 'Top',
    sketches: [
      {
        id: 'sk_root_rib',
        name: 'Sketch 1 - Perfil da Raiz (NACA 2412)',
        plane: 'Top',
        planeOffset: 0,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_airfoil_root',
            kind: 'airfoil',
            points: [],
            airfoilCode: '2412',
            chordLength: 220
          },
          {
            id: 'e_spar_hole1',
            kind: 'circle',
            points: [{ x: 50, y: 0 }],
            radius: 8
          },
          {
            id: 'e_spar_hole2',
            kind: 'circle',
            points: [{ x: 140, y: 0 }],
            radius: 6
          }
        ]
      },
      {
        id: 'sk_mid_rib',
        name: 'Sketch 2 - Nervura Intermediária',
        plane: 'Top',
        planeOffset: 150,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_airfoil_mid',
            kind: 'airfoil',
            points: [],
            airfoilCode: '2412',
            chordLength: 170
          },
          {
            id: 'e_mid_hole',
            kind: 'circle',
            points: [{ x: 40, y: 0 }],
            radius: 7
          }
        ]
      },
      {
        id: 'sk_tip_rib',
        name: 'Sketch 3 - Perfil da Ponta da Asa',
        plane: 'Top',
        planeOffset: 320,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_airfoil_tip',
            kind: 'airfoil',
            points: [],
            airfoilCode: '0012',
            chordLength: 110
          }
        ]
      },
      {
        id: 'sk_spar',
        name: 'Sketch 4 - Longarina Principal',
        plane: 'Front',
        planeOffset: 0,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_spar_rect',
            kind: 'rect',
            points: [{ x: -5, y: -5 }, { x: 5, y: 5 }]
          }
        ]
      }
    ],
    features: [
      {
        id: 'f_root_extrude',
        name: 'Extrusão 1 - Nervura Principal',
        type: 'extrude',
        sketchId: 'sk_root_rib',
        params: { sketchId: 'sk_root_rib', depth: 6, symmetric: false, operation: 'add' },
        visible: true,
        suppressed: false,
        materialId: 'carbon_fiber',
        color: '#2c3e50'
      },
      {
        id: 'f_wing_loft',
        name: 'Loft 1 - Revestimento da Asa',
        type: 'loft',
        params: { sketchIds: ['sk_root_rib', 'sk_mid_rib', 'sk_tip_rib'], guided: true },
        visible: true,
        suppressed: false,
        materialId: 'al_6061',
        color: '#3498db'
      },
      {
        id: 'f_mid_extrude',
        name: 'Extrusão 2 - Nervura 2',
        type: 'extrude',
        sketchId: 'sk_mid_rib',
        params: { sketchId: 'sk_mid_rib', depth: 4, symmetric: false, operation: 'add' },
        visible: true,
        suppressed: false,
        materialId: 'carbon_fiber',
        color: '#34495e'
      }
    ],
    parts: [
      {
        id: 'part_wing_assembly',
        name: 'Conjunto Estrutural da Asa',
        featureIds: ['f_root_extrude', 'f_wing_loft', 'f_mid_extrude'],
        material: { id: 'al_6061', name: 'Alumínio 6061-T6', density: 2.70, color: '#3498db', metalness: 0.8, roughness: 0.3 },
        visible: true,
        color: '#3498db',
        volume: 384.2,
        mass: 1037.3,
        surfaceArea: 1420.5
      }
    ]
  },
  {
    id: 'spur_gear',
    name: 'Engrenagem Cilíndrica com Chaveta',
    description: 'Componente mecânico parametrizado com furo central, rasgo de chaveta e dentes helicoidais.',
    activePlane: 'Front',
    sketches: [
      {
        id: 'sk_gear_body',
        name: 'Sketch 1 - Perfil dos Dentes',
        plane: 'Front',
        planeOffset: 0,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_gear_outer',
            kind: 'polygon',
            points: [{ x: 0, y: 0 }],
            radius: 80,
            sides: 18
          },
          {
            id: 'e_gear_bore',
            kind: 'circle',
            points: [{ x: 0, y: 0 }],
            radius: 25
          }
        ]
      }
    ],
    features: [
      {
        id: 'f_gear_extrude',
        name: 'Extrusão 1 - Coroa da Engrenagem',
        type: 'extrude',
        sketchId: 'sk_gear_body',
        params: { sketchId: 'sk_gear_body', depth: 30, symmetric: true, operation: 'add' },
        visible: true,
        suppressed: false,
        materialId: 'steel_316',
        color: '#95a5a6'
      }
    ],
    parts: [
      {
        id: 'part_gear',
        name: 'Engrenagem Z18 m4',
        featureIds: ['f_gear_extrude'],
        material: { id: 'steel_316', name: 'Aço Inox 316L', density: 8.0, color: '#95a5a6', metalness: 0.9, roughness: 0.2 },
        visible: true,
        color: '#95a5a6',
        volume: 412.5,
        mass: 3300.0,
        surfaceArea: 890.0
      }
    ]
  },
  {
    id: 'drone_frame',
    name: 'Chassi de Drone FPV (Carbono)',
    description: 'Frame quadcopter de corrida com furações para motores 2207 e suporte de câmera.',
    activePlane: 'Top',
    sketches: [
      {
        id: 'sk_frame_arm',
        name: 'Sketch 1 - Braços do Drone',
        plane: 'Top',
        planeOffset: 0,
        visible: true,
        suppressed: false,
        elements: [
          {
            id: 'e_frame_arm1',
            kind: 'rect',
            points: [{ x: -110, y: -15 }, { x: 110, y: 15 }]
          },
          {
            id: 'e_frame_arm2',
            kind: 'rect',
            points: [{ x: -15, y: -110 }, { x: 15, y: 110 }]
          },
          {
            id: 'e_motor_hole1',
            kind: 'circle',
            points: [{ x: 95, y: 0 }],
            radius: 12
          },
          {
            id: 'e_motor_hole2',
            kind: 'circle',
            points: [{ x: -95, y: 0 }],
            radius: 12
          }
        ]
      }
    ],
    features: [
      {
        id: 'f_frame_extrude',
        name: 'Extrusão 1 - Chassi 5mm',
        type: 'extrude',
        sketchId: 'sk_frame_arm',
        params: { sketchId: 'sk_frame_arm', depth: 5, symmetric: true, operation: 'add' },
        visible: true,
        suppressed: false,
        materialId: 'carbon_fiber',
        color: '#1e272e'
      }
    ],
    parts: [
      {
        id: 'part_drone',
        name: 'Base Frame 5 polegadas',
        featureIds: ['f_frame_extrude'],
        material: { id: 'carbon_fiber', name: 'Fibra de Carbono 3K', density: 1.55, color: '#1e272e', metalness: 0.2, roughness: 0.6 },
        visible: true,
        color: '#1e272e',
        volume: 68.4,
        mass: 106.0,
        surfaceArea: 320.0
      }
    ]
  }
];
