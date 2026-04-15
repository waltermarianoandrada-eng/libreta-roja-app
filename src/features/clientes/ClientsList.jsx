import React, { useState } from 'react';
import { useClients } from '../../hooks/useClients';
import { useSales } from '../../hooks/useSales';
import { calculateClientBalance, formatCurrency } from '../../utils/finance';
import { UserPlus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientsList = () => {
  const { clients, addClient } = useClients();
  const { sales } = useSales();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    addClient(formData);
    setFormData({ name: '', phone: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Tus Clientes</h2>
          <p className="text-slate-500 text-sm">Gestiona tu libreta de contactos</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white p-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <UserPlus size={20} />
          <span className="hidden md:inline">Nuevo Cliente</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-lg border border-slate-200 animate-in slide-in-from-top-4">
          <h3 className="font-semibold text-lg mb-4 text-slate-800">Agregar Nuevo Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
              <input 
                type="text" 
                required
                className="w-full border-slate-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 bg-slate-50 p-2.5 border"
                placeholder="Ej. Juan Pérez"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (WhatsApp) *</label>
              <input 
                type="tel" 
                required
                className="w-full border-slate-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 bg-slate-50 p-2.5 border"
                placeholder="Ej. 1198765432"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-md">Guardar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-3">
        {clients.length === 0 ? (
          <div className="text-center p-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 mb-2">No tienes clientes registrados aún.</p>
          </div>
        ) : (
          clients.map(client => {
            const balance = calculateClientBalance(client.id, sales);
            return (
              <Link to={`/clientes/${client.id}`} key={client.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-red-100 transition-all group">
                <div>
                  <h4 className="font-semibold text-lg text-slate-800">{client.name}</h4>
                  <p className="text-sm text-slate-500">{client.phone}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Saldo Pendiente</p>
                    <p className={`font-bold ${balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {formatCurrency(balance)}
                    </p>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-red-500 transition-colors" />
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  );
};

export default ClientsList;
