import React from 'react';
import { useClients } from '../hooks/useClients';
import { useSales } from '../hooks/useSales';
import { formatCurrency } from '../utils/finance';
import { Users, FilePlus, Wallet, ArrowRight, AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { clients } = useClients();
  const { sales } = useSales();

  let totalDebt = 0;
  let totalCollected = 0;
  let pendingInstallments = [];

  sales.forEach(sale => {
    (sale.installments || []).forEach(inst => {
      const amount = inst.amount + (inst.surcharge || 0);
      if (inst.paid) {
        totalCollected += amount;
      } else {
        totalDebt += amount;
        pendingInstallments.push({ ...inst, sale, client: clients.find(c => c.id === sale.clientId) });
      }
    });
  });

  // Sort pending by due date (closest first)
  pendingInstallments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const upcoming = pendingInstallments.slice(0, 5); // top 5

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="px-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">Bienvenido</h2>
        <p className="text-slate-500 mt-1">Resumen de tu negocio y cobros.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Por Cobrar</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalDebt)}</p>
          </div>
          <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
            <Wallet size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Cobrado (Histórico)</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalCollected)}</p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Clientes Totales</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{clients.length}</p>
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/nueva-venta" className="bg-red-600 hover:bg-red-700 text-white p-4 mx-2 rounded-xl shadow-lg border border-red-500 flex items-center justify-center gap-3 transition-transform active:scale-95 group">
          <FilePlus className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-lg">Registrar Nueva Venta</span>
        </Link>
        <Link to="/clientes" className="bg-white hover:bg-slate-50 text-slate-800 p-4 mx-2 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center gap-3 transition-transform active:scale-95">
          <Users className="text-slate-500" />
          <span className="font-bold text-lg">Ver Libreta de Clientes</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
          <AlertCircle className="text-red-500" size={20} />
          <h3 className="font-bold text-lg text-slate-800">Próximos Vencimientos</h3>
        </div>
        
        {upcoming.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50">
            No hay cuotas pendientes. ¡Excelente trabajo!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {upcoming.map(inst => (
              <div key={inst.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{inst.client?.name || 'Cliente Eliminado'}</p>
                  <p className="text-sm text-slate-500">{inst.sale.product} - Cuota {inst.number}/{inst.sale.installmentsCount}</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Vence</p>
                    <p className="text-sm font-semibold text-slate-700">{new Date(inst.dueDate).toLocaleDateString('es-AR')}</p>
                  </div>
                  <Link to={`/clientes/${inst.client?.id}`} className="h-8 w-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
