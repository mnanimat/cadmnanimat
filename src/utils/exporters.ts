import * as THREE from 'three';
import { STLExporter } from 'three-stdlib';
import { OBJExporter } from 'three-stdlib';
import { CADProject } from '../types/cad';

/**
 * Downloads a string or blob as a file in the user's browser
 */
function downloadFile(content: BlobPart, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export 3D Scene / Mesh as STL file (Binary or ASCII)
 */
export function exportToSTL(scene: THREE.Scene, filename: string = 'cad_model.stl') {
  const exporter = new STLExporter();
  const result = exporter.parse(scene, { binary: true });
  downloadFile(result, filename, 'application/octet-stream');
}

/**
 * Export 3D Scene / Mesh as Wavefront OBJ file
 */
export function exportToOBJ(scene: THREE.Scene, filename: string = 'cad_model.obj') {
  const exporter = new OBJExporter();
  const result = exporter.parse(scene);
  downloadFile(result, filename, 'text/plain');
}

/**
 * Export CAD project as JSON
 */
export function exportCADProjectJSON(project: CADProject) {
  const jsonStr = JSON.stringify(project, null, 2);
  downloadFile(jsonStr, `${project.name.toLowerCase().replace(/\s+/g, '_')}.apexcad`, 'application/json');
}

/**
 * Export 2D Sketches as DXF (Drawing Exchange Format)
 */
export function exportToDXF(project: CADProject, filename: string = 'drawing.dxf') {
  let dxfContent = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;

  for (const sketch of project.sketches) {
    for (const elem of sketch.elements) {
      if (elem.kind === 'line' && elem.points.length >= 2) {
        const [p1, p2] = elem.points;
        dxfContent += `0\nLINE\n8\n${sketch.name}\n10\n${p1.x}\n20\n${p1.y}\n30\n0.0\n11\n${p2.x}\n21\n${p2.y}\n31\n0.0\n`;
      } else if (elem.kind === 'rect' && elem.points.length >= 2) {
        const [p1, p2] = elem.points;
        dxfContent += `0\nLINE\n8\n${sketch.name}\n10\n${p1.x}\n20\n${p1.y}\n30\n0.0\n11\n${p2.x}\n21\n${p1.y}\n31\n0.0\n`;
        dxfContent += `0\nLINE\n8\n${sketch.name}\n10\n${p2.x}\n20\n${p1.y}\n30\n0.0\n11\n${p2.x}\n21\n${p2.y}\n31\n0.0\n`;
        dxfContent += `0\nLINE\n8\n${sketch.name}\n10\n${p2.x}\n20\n${p2.y}\n30\n0.0\n11\n${p1.x}\n21\n${p2.y}\n31\n0.0\n`;
        dxfContent += `0\nLINE\n8\n${sketch.name}\n10\n${p1.x}\n20\n${p2.y}\n30\n0.0\n11\n${p1.x}\n21\n${p1.y}\n31\n0.0\n`;
      } else if (elem.kind === 'circle' && elem.points.length >= 1) {
        const center = elem.points[0];
        const r = elem.radius || 20;
        dxfContent += `0\nCIRCLE\n8\n${sketch.name}\n10\n${center.x}\n20\n${center.y}\n30\n0.0\n40\n${r}\n`;
      }
    }
  }

  dxfContent += `0\nENDSEC\n0\nEOF\n`;
  downloadFile(dxfContent, filename, 'image/vnd.dxf');
}
