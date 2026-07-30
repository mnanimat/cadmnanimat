import { CFDConfig, CFDResult, CADProject } from '../types/cad';

export function calculateCFDResults(project: CADProject, config: CFDConfig): CFDResult {
  const v = Math.max(0.1, config.windSpeedMs);
  const rho = Math.max(0.01, config.airDensity);
  const alphaRad = (config.angleOfAttackDeg * Math.PI) / 180;

  // Estimate reference area and characteristic length from project features
  let referenceAreaM2 = 0.08; // default ~800 cm2
  let characteristicLengthM = 0.5; // default 500 mm

  if (project.parts && project.parts.length > 0) {
    const totalAreaCm2 = project.parts.reduce((sum, p) => sum + (p.surfaceArea || 0), 0);
    if (totalAreaCm2 > 0) {
      // Frontal projected area roughly ~25% of total wetted area
      referenceAreaM2 = Math.max(0.01, (totalAreaCm2 * 0.25) / 10000);
      characteristicLengthM = Math.max(0.1, Math.sqrt(referenceAreaM2 * 4));
    }
  }

  // Speed of sound in air at given temperature
  const tempK = config.temperatureC + 273.15;
  const speedOfSound = Math.sqrt(1.4 * 287 * tempK); // ~340 m/s
  const mach = v / speedOfSound;

  // Dynamic viscosity of air
  const dynamicViscosity = 1.81e-5; // Pa.s
  const reynolds = (rho * v * characteristicLengthM) / dynamicViscosity;

  // Base aerodynamic coefficients estimation
  const isAirfoil = project.sketches.some(s => s.elements.some(e => e.kind === 'airfoil')) || project.name.toLowerCase().includes('asa') || project.name.toLowerCase().includes('wing');
  const isRocket = project.name.toLowerCase().includes('foguete') || project.name.toLowerCase().includes('rocket');
  const isChassis = project.name.toLowerCase().includes('chassi') || project.name.toLowerCase().includes('baja') || project.name.toLowerCase().includes('formula');

  let baseCd = 0.32; // Default bluff body / vehicle
  let clPerRad = 2 * Math.PI; // Thin airfoil theory 2*pi per radian

  if (isAirfoil) {
    baseCd = 0.025 + 0.08 * Math.pow(Math.sin(alphaRad), 2);
    clPerRad = 5.8;
  } else if (isRocket) {
    baseCd = 0.15 + 0.25 * Math.sin(Math.abs(alphaRad));
    clPerRad = 1.2;
  } else if (isChassis) {
    baseCd = 0.48 + 0.15 * Math.abs(Math.sin(alphaRad));
    clPerRad = -1.8; // Downforce orientation
  }

  // Lift Coefficient C_L with stall modeling beyond 15 degrees
  let cl = clPerRad * Math.sin(alphaRad);
  if (Math.abs(config.angleOfAttackDeg) > 16) {
    // Aerodynamic Stall reduction
    const stallFactor = Math.exp(-0.25 * (Math.abs(config.angleOfAttackDeg) - 16));
    cl *= stallFactor;
  }

  // Drag Coefficient C_D (parasitic + induced drag C_Di = C_L^2 / (pi * AR * e))
  const aspectR = 4.5;
  const oswaldEff = 0.82;
  const cdInduced = Math.pow(cl, 2) / (Math.PI * aspectR * oswaldEff);
  const cd = Math.max(0.015, baseCd + cdInduced);

  // Dynamic pressure q = 0.5 * rho * v^2
  const q = 0.5 * rho * Math.pow(v, 2);
  const maxStagPressure = q;
  const minSuctionPressure = q * (1 - 1.25 * Math.pow(cl, 2));

  // Aerodynamic Forces (N)
  const liftForceN = cl * q * referenceAreaM2;
  const dragForceN = cd * q * referenceAreaM2;
  const downforceN = liftForceN < 0 ? Math.abs(liftForceN) : (isChassis ? dragForceN * 0.6 : 0);

  const efficiencyLD = cd > 0.0001 ? Math.round((cl / cd) * 100) / 100 : 0;

  let flowType = 'Subsônico Laminar';
  if (mach >= 1.0) flowType = 'Supersônico (Onda de Choque)';
  else if (mach >= 0.7) flowType = 'Transônico Compressível';
  else if (reynolds > 5e5) flowType = 'Subsônico Turbulento (k-ε)';

  return {
    liftForceN: Math.round(liftForceN * 10) / 10,
    dragForceN: Math.round(dragForceN * 10) / 10,
    downforceN: Math.round(downforceN * 10) / 10,
    cl: Math.round(cl * 1000) / 1000,
    cd: Math.round(cd * 1000) / 1000,
    efficiencyLD,
    maxStagnationPressurePa: Math.round(maxStagPressure),
    minPressurePa: Math.round(minSuctionPressure),
    reynoldsNumber: Math.round(reynolds),
    machNumber: Math.round(mach * 1000) / 1000,
    flowType
  };
}
