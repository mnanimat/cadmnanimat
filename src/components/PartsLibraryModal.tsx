import React, { useState } from 'react';
import { StandardPartSpec, CADProject, Sketch2D, CADFeature, CADPart } from '../types/cad';
import { STANDARD_HARDWARE_CATALOG, importStandardPartToProject } from '../utils/partsKernel';
import { PRESET_MATERIALS } from '../utils/cadKernel';
import { 
  Database, 
  Search, 
  Plus, 
  Check, 
  Layers, 
  Box, 
  Settings, 
  Wrench, 
  Sliders, 
  ShieldCheck,
  RotateCw,
  X
} from 'lucide-react';

interface PartsLibraryModalProps {
  onImportPart: (sketch: Sketch2D, feature: CADFeature, part: CADPart) => void;
  onClose: () => void;
}

export const PartsLibraryModal: React.FC<PartsLibraryModalProps> = ({
  onImportPart,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<StandardPartSpec>(STANDARD_HARDWARE_CATALOG[0]);
  
  const [customLength, setCustomLength] = useState<number>(selectedPart.lengthMm);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(selectedPart.materialId);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  const categories = ['Todos', 'Parafusos', 'Porcas', 'Rolamentos', 'Arruelas', 'Perfis'];

  const filteredParts = STANDARD_HARDWARE_CATALOG.filter(part => {
    const matchesCategory = selectedCategory === 'Todos' || part.category === selectedCategory;
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          part.norm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          part.nominalSize.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectPart = (part: StandardPartSpec) => {
    setSelectedPart(part);
    setCustomLength(part.lengthMm);
    setSelectedMaterialId(part.materialId);
  };

  const handleImport = () => {
    const specToImport = { ...selectedPart, materialId: selectedMaterialId };
    const { sketch, feature, part } = importStandardPartToProject(specToImport, customLength);
    
    onImportPart(sketch, feature, part);

    setImportSuccessMessage(`Peça ${part.name} adicionada com sucesso ao projeto!`);
    setTimeout(() => {
      setImportSuccessMessage(null);
    }, 2500);
  };

  return (
    <div className="w-[680px] text-zinc-200 font-sans text-xs select-none space-y-4 p-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950/80 via-zinc-900 to-teal-950/80 p-3.5 rounded-2xl border border-sky-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              Biblioteca de Peças Padrão Industrial (ISO / ANSI / DIN)
            </h3>
            <p className="text-[11px] text-zinc-400">
              Importação direta de componentes parametrizados para montagens CAD 3D
            </p>
          </div>
        </div>

        <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold">
          {STANDARD_HARDWARE_CATALOG.length} Componentes Ativos
        </span>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por norma (ISO 4017, DIN 912), dimensão (M8, M10, 6204) ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-zinc-200 text-xs focus:border-sky-500 outline-none"
          />
        </div>

        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold text-center transition cursor-pointer flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Split: Catalog List & Spec Customizer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[320px]">
        
        {/* Left Column: Item Selector (7 cols) */}
        <div className="md:col-span-7 bg-zinc-950 p-2 rounded-2xl border border-zinc-800 overflow-y-auto space-y-1.5 h-full">
          {filteredParts.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-500 text-center p-4">
              Nenhum componente encontrado para os filtros selecionados.
            </div>
          ) : (
            filteredParts.map((part) => {
              const isSelected = selectedPart.id === part.id;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => handleSelectPart(part)}
                  className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-500/80 text-white shadow-md'
                      : 'bg-zinc-900/60 hover:bg-zinc-800/80 border-zinc-800/80 text-zinc-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs block text-zinc-100">{part.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span className="bg-zinc-800 text-sky-300 px-1.5 py-0.5 rounded font-mono font-bold">
                        {part.norm}
                      </span>
                      <span>• {part.nominalSize}</span>
                      <span>• {part.weightGrams}g</span>
                    </div>
                  </div>

                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-sky-500 text-slate-950' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Spec Customization & Preview (5 cols) */}
        <div className="md:col-span-5 bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800 flex flex-col justify-between h-full">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-sky-400 font-bold uppercase block">Especificação do Componente</span>
              <h4 className="font-bold text-sm text-white mt-0.5">{selectedPart.name}</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">Norma: {selectedPart.norm}</p>
            </div>

            {/* Custom Length Control */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-300 font-bold">Comprimento / Altura:</span>
                <span className="font-mono text-teal-300 font-bold">{customLength} mm</span>
              </div>
              <input
                type="range"
                min={2}
                max={250}
                value={customLength}
                onChange={(e) => setCustomLength(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer h-2 bg-zinc-950 rounded-lg"
              />
            </div>

            {/* Material selector */}
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 font-bold uppercase block">
                Material Atribuído:
              </label>
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-zinc-200 font-semibold text-xs"
              >
                {PRESET_MATERIALS.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name} ({mat.density} g/cm³)
                  </option>
                ))}
              </select>
            </div>

            {/* Properties overview box */}
            <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 space-y-1 text-[11px]">
              <div className="flex justify-between text-zinc-400">
                <span>Tamanho Nominal:</span>
                <span className="font-mono font-bold text-zinc-200">{selectedPart.nominalSize}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Massa Estimada:</span>
                <span className="font-mono font-bold text-sky-300">
                  {Math.round(selectedPart.weightGrams * (customLength / Math.max(1, selectedPart.lengthMm)))} g
                </span>
              </div>
            </div>
          </div>

          {/* Import Button & Toast */}
          <div className="space-y-2 pt-2">
            {importSuccessMessage && (
              <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl font-bold text-[11px] text-center flex items-center justify-center gap-1.5 animate-bounce">
                <Check className="w-3.5 h-3.5" />
                <span>{importSuccessMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleImport}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Importar para o Projeto CAD 3D</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
