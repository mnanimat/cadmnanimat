import React, { useState } from 'react';
import { TeamMember, BudgetItem, InventoryItem } from '../types/engineering';
import { Users, DollarSign, Package, Plus, Trash2, Edit2, UserPlus, FileSpreadsheet, Check, X } from 'lucide-react';

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

  // Modals & Form State for Members
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState<{
    name: string;
    role: TeamMember['role'];
    email: string;
    subsystem: string;
    status: TeamMember['status'];
  }>({
    name: '',
    role: 'Estruturas & CAD',
    email: '',
    subsystem: '',
    status: 'Ativo'
  });

  // Modals & Form State for Expenses
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [expenseForm, setExpenseForm] = useState<{
    description: string;
    category: BudgetItem['category'];
    cost: number;
    responsible: string;
    status: BudgetItem['status'];
  }>({
    description: '',
    category: 'Propulsão',
    cost: 1000,
    responsible: 'Gabriel Santos',
    status: 'Aprovado'
  });

  // Modals & Form State for Inventory
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);
  const [inventoryForm, setInventoryForm] = useState<{
    name: string;
    category: InventoryItem['category'];
    quantity: number;
    unit: InventoryItem['unit'];
    unitCost: number;
    supplier: string;
  }>({
    name: '',
    category: 'Compósitos & Fibras',
    quantity: 5,
    unit: 'kg',
    unitCost: 250,
    supplier: 'Suprimentos Eng'
  });

  // Financial calculations
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.cost, 0);
  const remainingBudget = totalBudget - totalSpent;
  const totalInventoryValue = inventory.reduce((acc, curr) => acc + (curr.quantity * curr.unitCost), 0);

  // MEMBER HANDLERS
  const startEditMember = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setMemberForm({
      name: m.name,
      role: m.role,
      email: m.email,
      subsystem: m.subsystem,
      status: m.status
    });
    setShowAddMember(true);
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name) return;

    if (editingMemberId) {
      setTeam(prev => prev.map(m => m.id === editingMemberId ? {
        ...m,
        name: memberForm.name,
        role: memberForm.role,
        email: memberForm.email,
        subsystem: memberForm.subsystem,
        status: memberForm.status
      } : m));
    } else {
      setTeam(prev => [
        ...prev,
        {
          id: `tm_${Date.now()}`,
          name: memberForm.name,
          role: memberForm.role,
          email: memberForm.email || `${memberForm.name.toLowerCase().replace(/\s+/g, '.')}@equipe.edu.br`,
          subsystem: memberForm.subsystem || 'Geral',
          status: memberForm.status
        }
      ]);
    }

    setEditingMemberId(null);
    setMemberForm({ name: '', role: 'Estruturas & CAD', email: '', subsystem: '', status: 'Ativo' });
    setShowAddMember(false);
  };

  // EXPENSE HANDLERS
  const startEditExpense = (exp: BudgetItem) => {
    setEditingExpenseId(exp.id);
    setExpenseForm({
      description: exp.description,
      category: exp.category,
      cost: exp.cost,
      responsible: exp.responsible,
      status: exp.status
    });
    setShowAddExpense(true);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.description || expenseForm.cost <= 0) return;

    if (editingExpenseId) {
      setExpenses(prev => prev.map(exp => exp.id === editingExpenseId ? {
        ...exp,
        description: expenseForm.description,
        category: expenseForm.category,
        cost: Number(expenseForm.cost),
        responsible: expenseForm.responsible,
        status: expenseForm.status
      } : exp));
    } else {
      setExpenses(prev => [
        ...prev,
        {
          id: `exp_${Date.now()}`,
          description: expenseForm.description,
          category: expenseForm.category,
          cost: Number(expenseForm.cost),
          date: new Date().toISOString().split('T')[0],
          status: expenseForm.status,
          responsible: expenseForm.responsible
        }
      ]);
    }

    setEditingExpenseId(null);
    setExpenseForm({ description: '', category: 'Propulsão', cost: 1000, responsible: 'Gabriel Santos', status: 'Aprovado' });
    setShowAddExpense(false);
  };

  // INVENTORY HANDLERS
  const startEditInventory = (inv: InventoryItem) => {
    setEditingInventoryId(inv.id);
    setInventoryForm({
      name: inv.name,
      category: inv.category,
      quantity: inv.quantity,
      unit: inv.unit,
      unitCost: inv.unitCost,
      supplier: inv.supplier
    });
    setShowAddInventory(true);
  };

  const handleInventorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryForm.name) return;

    if (editingInventoryId) {
      setInventory(prev => prev.map(inv => inv.id === editingInventoryId ? {
        ...inv,
        name: inventoryForm.name,
        category: inventoryForm.category,
        quantity: Number(inventoryForm.quantity),
        unit: inventoryForm.unit,
        unitCost: Number(inventoryForm.unitCost),
        supplier: inventoryForm.supplier
      } : inv));
    } else {
      setInventory(prev => [
        ...prev,
        {
          id: `inv_${Date.now()}`,
          name: inventoryForm.name,
          category: inventoryForm.category,
          quantity: Number(inventoryForm.quantity),
          unit: inventoryForm.unit,
          unitCost: Number(inventoryForm.unitCost),
          minStock: 2,
          supplier: inventoryForm.supplier
        }
      ]);
    }

    setEditingInventoryId(null);
    setInventoryForm({ name: '', category: 'Compósitos & Fibras', quantity: 5, unit: 'kg', unitCost: 250, supplier: 'Suprimentos Eng' });
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
              onClick={() => {
                setEditingMemberId(null);
                setMemberForm({ name: '', role: 'Estruturas & CAD', email: '', subsystem: '', status: 'Ativo' });
                setShowAddMember(true);
              }}
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

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-zinc-800 text-sky-300 px-2.5 py-1 rounded-lg border border-zinc-700 font-medium">
                    {m.role}
                  </span>
                  <button
                    onClick={() => startEditMember(m)}
                    className="p-1.5 hover:bg-sky-500/20 text-zinc-400 hover:text-sky-300 rounded-lg transition"
                    title="Editar Membro"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTeam(prev => prev.filter(item => item.id !== m.id))}
                    className="p-1.5 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 rounded-lg transition"
                    title="Remover Membro"
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
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={totalBudget}
                  onChange={e => setTotalBudget(Number(e.target.value))}
                  className="font-mono text-xs font-bold text-zinc-100 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-lg w-28"
                />
              </div>
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
              onClick={() => {
                setEditingExpenseId(null);
                setExpenseForm({ description: '', category: 'Propulsão', cost: 1000, responsible: 'Gabriel Santos', status: 'Aprovado' });
                setShowAddExpense(true);
              }}
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
                  <button
                    onClick={() => startEditExpense(e)}
                    className="p-1 hover:bg-teal-500/20 text-zinc-400 hover:text-teal-300 rounded-lg transition"
                    title="Editar Gasto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setExpenses(prev => prev.filter(item => item.id !== e.id))}
                    className="p-1 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 rounded-lg transition"
                    title="Excluir Gasto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
              onClick={() => {
                setEditingInventoryId(null);
                setInventoryForm({ name: '', category: 'Compósitos & Fibras', quantity: 5, unit: 'kg', unitCost: 250, supplier: 'Suprimentos Eng' });
                setShowAddInventory(true);
              }}
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
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-300 text-xs block">
                      {inv.quantity} {inv.unit}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      R$ {(inv.quantity * inv.unitCost).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <button
                    onClick={() => startEditInventory(inv)}
                    className="p-1 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 rounded-lg transition"
                    title="Editar Material"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setInventory(prev => prev.filter(item => item.id !== inv.id))}
                    className="p-1 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 rounded-lg transition"
                    title="Excluir Material"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MEMBER */}
      {showAddMember && (
        <div className="p-4 bg-zinc-900 rounded-2xl border border-sky-500/40 space-y-3">
          <h4 className="font-bold text-sky-400 text-xs flex items-center justify-between">
            <span>{editingMemberId ? 'Editar Integrante da Equipe' : 'Adicionar Novo Membro na Equipe'}</span>
            <button onClick={() => setShowAddMember(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </h4>
          <form onSubmit={handleMemberSubmit} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nome do integrante"
                value={memberForm.name}
                onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                required
              />
              <select
                value={memberForm.role}
                onChange={e => setMemberForm({ ...memberForm, role: e.target.value as any })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-sky-300 font-bold"
              >
                <option value="Engenheiro Chefe">Engenheiro Chefe</option>
                <option value="Propulsão & Motor">Propulsão & Motor</option>
                <option value="Estruturas & CAD">Estruturas & CAD</option>
                <option value="Eletrônica & Aviônica">Eletrônica & Aviônica</option>
                <option value="Gestão Financeira">Gestão Financeira</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="email"
                placeholder="E-mail de contato"
                value={memberForm.email}
                onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Subsistema / Atribuição"
                value={memberForm.subsystem}
                onChange={e => setMemberForm({ ...memberForm, subsystem: e.target.value })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowAddMember(false)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs">Cancelar</button>
              <button type="submit" className="px-4 py-1 bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT EXPENSE */}
      {showAddExpense && (
        <div className="p-4 bg-zinc-900 rounded-2xl border border-teal-500/40 space-y-3">
          <h4 className="font-bold text-teal-400 text-xs flex items-center justify-between">
            <span>{editingExpenseId ? 'Editar Lançamento de Gasto' : 'Lançar Novo Gasto no Projeto'}</span>
            <button onClick={() => setShowAddExpense(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </h4>
          <form onSubmit={handleExpenseSubmit} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Descrição do insumo/serviço"
                value={expenseForm.description}
                onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white col-span-2"
                required
              />
              <input
                type="number"
                placeholder="Valor em R$"
                value={expenseForm.cost}
                onChange={e => setExpenseForm({ ...expenseForm, cost: Number(e.target.value) })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-teal-300 font-mono font-bold"
                required
              />
              <select
                value={expenseForm.category}
                onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
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
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Responsável"
                value={expenseForm.responsible}
                onChange={e => setExpenseForm({ ...expenseForm, responsible: e.target.value })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
              />
              <select
                value={expenseForm.status}
                onChange={e => setExpenseForm({ ...expenseForm, status: e.target.value as any })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-emerald-300 font-bold"
              >
                <option value="Pago">Pago</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowAddExpense(false)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs">Cancelar</button>
              <button type="submit" className="px-4 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT INVENTORY */}
      {showAddInventory && (
        <div className="p-4 bg-zinc-900 rounded-2xl border border-amber-500/40 space-y-3">
          <h4 className="font-bold text-amber-400 text-xs flex items-center justify-between">
            <span>{editingInventoryId ? 'Editar Material no Estoque' : 'Cadastrar Material no Estoque'}</span>
            <button onClick={() => setShowAddInventory(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </h4>
          <form onSubmit={handleInventorySubmit} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nome do material"
                value={inventoryForm.name}
                onChange={e => setInventoryForm({ ...inventoryForm, name: e.target.value })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white col-span-2"
                required
              />
              <input
                type="number"
                placeholder="Quantidade"
                value={inventoryForm.quantity}
                onChange={e => setInventoryForm({ ...inventoryForm, quantity: Number(e.target.value) })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                required
              />
              <input
                type="number"
                placeholder="Custo Unitário R$"
                value={inventoryForm.unitCost}
                onChange={e => setInventoryForm({ ...inventoryForm, unitCost: Number(e.target.value) })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-amber-300 font-mono"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Fornecedor"
                value={inventoryForm.supplier}
                onChange={e => setInventoryForm({ ...inventoryForm, supplier: e.target.value })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
              />
              <select
                value={inventoryForm.unit}
                onChange={e => setInventoryForm({ ...inventoryForm, unit: e.target.value as any })}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-amber-300 font-bold"
              >
                <option value="kg">kg</option>
                <option value="m">m</option>
                <option value="m²">m²</option>
                <option value="unidades">unidades</option>
                <option value="litros">litros</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowAddInventory(false)} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs">Cancelar</button>
              <button type="submit" className="px-4 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
