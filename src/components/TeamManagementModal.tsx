import React, { useState } from 'react';
import { TeamMember, BudgetItem, InventoryItem } from '../types/engineering';
import { Users, DollarSign, Package, Plus, Trash2, CheckCircle2, AlertCircle, PieChart, UserPlus, FileSpreadsheet } from 'lucide-react';

interface TeamManagementModalProps {
  onClose?: () => void;
}

export const TeamManagementModal: React.FC<TeamManagementModalProps> = () => {
  const [activeTab, setActiveTab] = useState<'team' | 'budget' | 'inventory'>('team');

  // Initial Mock Team Data
  const [team, setTeam] = useState<TeamMember[]>([
    { id: 'tm_1', name: 'Dra. Elena Vasconcelos', role: 'Engenheiro Chefe', email: 'elena.v@equipe.edu.br', subsystem: 'Coordenação Geral', status: 'Ativo' },
    { id: 'tm_2', name: 'Gabriel Santos', role: 'Propulsão & Motor', email: 'gabriel.p@equipe.edu.br', subsystem: 'Câmara de Combustão & Bocal', status: 'Ativo' },
    { id: 'tm_3', name: 'Matheus Oliveira', role: 'Estruturas & CAD', email: 'matheus.cad@equipe.edu.br', subsystem: 'Laminado Fibra de Carbono', status: 'Ativo' },
    { id: 'tm_4', name: 'Beatriz Lima', role: 'Eletrônica & Aviônica', email: 'beatriz.a@equipe.edu.br', subsystem: 'Altímetros & Telemetria LoRa', status: 'Ativo' },
    { id: 'tm_5', name: 'Lucas Ferreira', role: 'Gestão Financeira', email: 'lucas.f@equipe.edu.br', subsystem: 'Orçamento & Patrocínio', status: 'Ativo' },
  ]);

  // Initial Mock Budget Data
  const [totalBudget, setTotalBudget] = useState<number>(50000); // R$ 50.000
  const [expenses, setExpenses] = useState<BudgetItem[]>([
    { id: 'exp_1', description: 'Bloco de Alumínio 7075-T6 para Bocal De Laval', category: 'Usinagem & Fabricação', cost: 3400, date: '2026-07-15', status: 'Pago', responsible: 'Gabriel Santos' },
    { id: 'exp_2', description: 'Tubo de Fibra de Carbono Tecida 3K 100mm', category: 'Materiais & Matéria-Prima', cost: 5800, date: '2026-07-18', status: 'Pago', responsible: 'Matheus Oliveira' },
    { id: 'exp_3', description: 'Teensy 4.1 + Sensores IMU BNO055 + Barômetro MS5611', category: 'Aviônica & Sensores', cost: 2150, date: '2026-07-20', status: 'Pago', responsible: 'Beatriz Lima' },
    { id: 'exp_4', description: 'Parafina Sustentável + Válvula Solenóide N2O', category: 'Propulsão', cost: 4200, date: '2026-07-22', status: 'Aprovado', responsible: 'Gabriel Santos' },
    { id: 'exp_5', description: 'Inscrição na Competição Aeroespacial SAE/LASC', category: 'Logística & Inscrição', cost: 2500, date: '2026-07-25', status: 'Pendente', responsible: 'Lucas Ferreira' },
  ]);

  // Initial Mock Inventory Data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'inv_1', name: 'Tubo de Fibra de Carbono 100mm ID', category: 'Compósitos & Fibras', quantity: 4, unit: 'm', unitCost: 1450, minStock: 2, supplier: 'CarboTech Brasil' },
    { id: 'inv_2', name: 'Grão de Parafina Sustentável Ponto Fusão 62°C', category: 'Químicos & Propelentes', quantity: 25, unit: 'kg', unitCost: 45, minStock: 10, supplier: 'Proquímica Ind' },
    { id: 'inv_3', name: 'Placa Microcontroladora Teensy 4.1 Cortex-M7', category: 'Eletrônica & Sensores', quantity: 3, unit: 'unidades', unitCost: 650, minStock: 2, supplier: 'PJRC Electronics' },
    { id: 'inv_4', name: 'Bloco Alumínio 6061-T6 150x150x200mm', category: 'Metais & Ligas', quantity: 2, unit: 'unidades', unitCost: 1200, minStock: 1, supplier: 'Metalurgica AçoTec' },
    { id: 'inv_5', name: 'Tecido de Fibra de Vidro Kevlar 200g/m²', category: 'Compósitos & Fibras', quantity: 15, unit: 'm²', unitCost: 110, minStock: 5, supplier: 'FiberGlass Solutions' },
  ]);

  // Modals for creating new items
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<TeamMember['role']>('Estruturas & CAD');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberSubsystem, setNewMemberSubsystem] = useState('');

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState<BudgetItem['category']>('Propulsão');
  const [newExpenseCost, setNewExpenseCost] = useState<number>(1000);
  const [newExpenseResp, setNewExpenseResp] = useState('Gabriel Santos');

  const [showAddInventory, setShowAddInventory] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState<InventoryItem['category']>('Compósitos & Fibras');
  const [newItemQty, setNewItemQty] = useState<number>(5);
  const [newItemUnit, setNewItemUnit] = useState<InventoryItem['unit']>('kg');
  const [newItemCost, setNewItemCost] = useState<number>(250);
  const [newItemSupplier, setNewItemSupplier] = useState('Suprimentos Eng');

  // Financial calculations
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.cost, 0);
  const remainingBudget = totalBudget - totalSpent;
  const totalInventoryValue = inventory.reduce((acc, curr) => acc + (curr.quantity * curr.unitCost), 0);

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;
    setTeam(prev => [
      ...prev,
      {
        id: `tm_${Date.now()}`,
        name: newMemberName,
        role: newMemberRole,
        email: newMemberEmail || `${newMemberName.toLowerCase().replace(/\s+/g, '.')}@equipe.edu.br`,
        subsystem: newMemberSubsystem || 'Geral',
        status: 'Ativo'
      }
    ]);
    setNewMemberName('');
    setShowAddMember(false);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseDesc || newExpenseCost <= 0) return;
    setExpenses(prev => [
      ...prev,
      {
        id: `exp_${Date.now()}`,
        description: newExpenseDesc,
        category: newExpenseCat,
        cost: Number(newExpenseCost),
        date: new Date().toISOString().split('T')[0],
        status: 'Aprovado',
        responsible: newExpenseResp
      }
    ]);
    setNewExpenseDesc('');
    setShowAddExpense(false);
  };

  const handleAddInventorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;
    setInventory(prev => [
      ...prev,
      {
        id: `inv_${Date.now()}`,
        name: newItemName,
        category: newItemCat,
        quantity: Number(newItemQty),
        unit: newItemUnit,
        unitCost: Number(newItemCost),
        minStock: 2,
        supplier: newItemSupplier
      }
    ]);
    setNewItemName('');
    setShowAddInventory(false);
  };

  return (
    <div className="w-full max-w-2xl p-4 font-sans text-zinc-200 text-xs select-none space-y-4">
      
      {/* Top Tabs Switcher */}
      <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'team'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
              : 'hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <Users className="w-4 h-4 text-sky-400" />
          <span>Equipe ({team.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'budget'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
              : 'hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <DollarSign className="w-4 h-4 text-teal-400" />
          <span>Gastos & Orçamento</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'hover:bg-zinc-800 text-zinc-400'
          }`}
        >
          <Package className="w-4 h-4 text-amber-400" />
          <span>Estoque de Materiais</span>
        </button>
      </div>

      {/* TAB 1: TEAM MEMBERS */}
      {activeTab === 'team' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-zinc-100 text-xs flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              Integrantes e Atribuições dos Subsistemas
            </h3>
            <button
              type="button"
              onClick={() => setShowAddMember(true)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Adicionar Membro</span>
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {team.map((m) => (
              <div
                key={m.id}
                className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl flex items-center justify-between hover:border-sky-500/40 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center font-bold text-sky-300 text-xs">
                    {m.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-100 text-xs">{m.name}</h4>
                    <p className="text-[10px] text-zinc-400">{m.subsystem} • <span className="text-zinc-500">{m.email}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-zinc-800 text-sky-300 px-2.5 py-1 rounded-lg border border-zinc-700 font-medium">
                    {m.role}
                  </span>
                  <button
                    onClick={() => setTeam(prev => prev.filter(item => item.id !== m.id))}
                    className="p-1 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 rounded-lg transition"
                    title="Remover"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BUDGET & EXPENSES */}
      {activeTab === 'budget' && (
        <div className="space-y-3">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-medium">Orçamento Aprovado</span>
              <span className="font-mono text-xs font-bold text-zinc-100">R$ {totalBudget.toLocaleString('pt-BR')}</span>
            </div>

            <div className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-medium">Total Gasto</span>
              <span className="font-mono text-xs font-bold text-amber-400">R$ {totalSpent.toLocaleString('pt-BR')}</span>
            </div>

            <div className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-medium">Saldo Restante</span>
              <span className="font-mono text-xs font-bold text-teal-300">R$ {remainingBudget.toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <h3 className="font-bold text-zinc-100 text-xs flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-teal-400" />
              Histórico de Lançamentos de Gastos
            </h3>
            <button
              type="button"
              onClick={() => setShowAddExpense(true)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Lançar Gasto</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {expenses.map((e) => (
              <div
                key={e.id}
                className="p-2.5 bg-zinc-900/80 border border-zinc-800/80 rounded-xl flex items-center justify-between text-xs hover:border-teal-500/40 transition-all"
              >
                <div>
                  <h4 className="font-bold text-zinc-200">{e.description}</h4>
                  <p className="text-[10px] text-zinc-400">{e.category} • Responsável: <span className="text-zinc-300">{e.responsible}</span> ({e.date})</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-teal-300 text-xs">
                    R$ {e.cost.toLocaleString('pt-BR')}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                    e.status === 'Pago' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {e.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY & MATERIALS */}
      {activeTab === 'inventory' && (
        <div className="space-y-3">
          
          <div className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 block font-medium">Patrimônio de Materiais em Estoque:</span>
              <span className="font-mono text-sm font-bold text-amber-300">R$ {totalInventoryValue.toLocaleString('pt-BR')}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddInventory(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Insumo</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {inventory.map((inv) => (
              <div
                key={inv.id}
                className="p-2.5 bg-zinc-900/80 border border-zinc-800/80 rounded-xl flex items-center justify-between text-xs hover:border-amber-500/40 transition-all"
              >
                <div>
                  <h4 className="font-bold text-zinc-200">{inv.name}</h4>
                  <p className="text-[10px] text-zinc-400">{inv.category} • Fornecedor: <span className="text-zinc-300">{inv.supplier}</span></p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-amber-300 text-xs block">
                    {inv.quantity} {inv.unit}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    R$ {(inv.quantity * inv.unitCost).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD MEMBER */}
      {showAddMember && (
        <div className="p-4 bg-zinc-900 rounded-2xl border border-sky-500/40 space-y-3">
          <h4 className="font-bold text-sky-400 text-xs">Adicionar Novo Membro na Equipe</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Nome do integrante"
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
            />
            <select
              value={newMemberRole}
              onChange={e => setNewMemberRole(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-sky-300 font-bold"
            >
              <option value="Engenheiro Chefe">Engenheiro Chefe</option>
              <option value="Propulsão & Motor">Propulsão & Motor</option>
              <option value="Estruturas & CAD">Estruturas & CAD</option>
              <option value="Eletrônica & Aviônica">Eletrônica & Aviônica</option>
              <option value="Gestão Financeira">Gestão Financeira</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setShowAddMember(false)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs">Cancelar</button>
            <button onClick={handleAddMemberSubmit} className="px-4 py-1 bg-sky-600 text-white rounded-lg text-xs font-bold">Salvar</button>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXPENSE */}
      {showAddExpense && (
        <div className="p-4 bg-zinc-900 rounded-2xl border border-teal-500/40 space-y-3">
          <h4 className="font-bold text-teal-400 text-xs">Lançar Novo Gasto no Projeto</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Descrição do insumo/serviço"
              value={newExpenseDesc}
              onChange={e => setNewExpenseDesc(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white col-span-2"
            />
            <input
              type="number"
              placeholder="Valor em R$"
              value={newExpenseCost}
              onChange={e => setNewExpenseCost(Number(e.target.value))}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-teal-300 font-mono font-bold"
            />
            <select
              value={newExpenseCat}
              onChange={e => setNewExpenseCat(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-teal-300 font-bold"
            >
              <option value="Propulsão">Propulsão</option>
              <option value="Estrutura & CAD">Estrutura & CAD</option>
              <option value="Aviônica & Sensores">Aviônica & Sensores</option>
              <option value="Materiais & Matéria-Prima">Materiais & Matéria-Prima</option>
              <option value="Usinagem & Fabricação">Usinagem & Fabricação</option>
              <option value="Logística & Inscrição">Logística & Inscrição</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setShowAddExpense(false)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs">Cancelar</button>
            <button onClick={handleAddExpenseSubmit} className="px-4 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold">Registrar</button>
          </div>
        </div>
      )}

      {/* MODAL: ADD INVENTORY */}
      {showAddInventory && (
        <div className="p-4 bg-zinc-900 rounded-2xl border border-amber-500/40 space-y-3">
          <h4 className="font-bold text-amber-400 text-xs">Cadastrar Material no Estoque</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Nome do material"
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white col-span-2"
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={newItemQty}
              onChange={e => setNewItemQty(Number(e.target.value))}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
            />
            <input
              type="number"
              placeholder="Custo Unitário R$"
              value={newItemCost}
              onChange={e => setNewItemCost(Number(e.target.value))}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-amber-300 font-mono"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setShowAddInventory(false)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs">Cancelar</button>
            <button onClick={handleAddInventorySubmit} className="px-4 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold">Adicionar</button>
          </div>
        </div>
      )}

    </div>
  );
};
