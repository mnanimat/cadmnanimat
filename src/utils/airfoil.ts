import { Point2D } from '../types/cad';

/**
 * Generates points for a NACA 4-digit airfoil (e.g. NACA 0012, 2412, 4415)
 * @param code NACA 4-digit string, e.g. "2412" or "0012"
 * @param chord Chord length
 * @param numPoints Number of points along top/bottom surface
 */
export function generateNacaAirfoil(code: string = '2412', chord: number = 100, numPoints: number = 40): Point2D[] {
  const digits = code.padStart(4, '0');
  const m = parseInt(digits[0], 10) / 100; // max camber
  const p = parseInt(digits[1], 10) / 10;  // position of max camber
  const t = parseInt(digits[2] + digits[3], 10) / 100; // max thickness ratio

  const upper: Point2D[] = [];
  const lower: Point2D[] = [];

  for (let i = 0; i <= numPoints; i++) {
    // Cosine spacing for higher density at leading edge
    const beta = (i / numPoints) * Math.PI;
    const xNorm = 0.5 * (1 - Math.cos(beta));
    const x = xNorm * chord;

    // Thickness distribution
    const yt = 5 * t * chord * (
      0.2969 * Math.sqrt(xNorm) -
      0.1260 * xNorm -
      0.3516 * Math.pow(xNorm, 2) +
      0.2843 * Math.pow(xNorm, 3) -
      0.1015 * Math.pow(xNorm, 4)
    );

    let yc = 0;
    let dyc_dx = 0;

    if (p > 0 && m > 0) {
      if (xNorm < p) {
        yc = (m / (p * p)) * (2 * p * xNorm - xNorm * xNorm) * chord;
        dyc_dx = (2 * m / (p * p)) * (p - xNorm);
      } else {
        yc = (m / Math.pow(1 - p, 2)) * ((1 - 2 * p) + 2 * p * xNorm - xNorm * xNorm) * chord;
        dyc_dx = (2 * m / Math.pow(1 - p, 2)) * (p - xNorm);
      }
    }

    const theta = Math.atan(dyc_dx);

    const xu = x - yt * Math.sin(theta);
    const yu = yc + yt * Math.cos(theta);

    const xl = x + yt * Math.sin(theta);
    const yl = yc - yt * Math.cos(theta);

    upper.push({ x: xu, y: yu });
    lower.push({ x: xl, y: yl });
  }

  // Combine upper surface (from trailing edge to leading edge) and lower surface (leading to trailing)
  const fullProfile: Point2D[] = [];
  
  // Upper surface backwards (leading to trailing)
  for (let i = 0; i < upper.length; i++) {
    fullProfile.push(upper[i]);
  }
  // Lower surface backwards
  for (let i = lower.length - 1; i >= 0; i--) {
    fullProfile.push(lower[i]);
  }

  return fullProfile;
}
