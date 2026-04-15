import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import { useSales } from '../../hooks/useSales';
import { calculateClientBalance, formatCurrency } from '../../utils/finance';
import { ArrowLeft, MessageCircle, AlertCircle, CheckCircle, Circle, ArrowDownCircle } from 'lucide-react';

const ClientDetails = () => {
  const { id } = useParams();
  const { clients } = useClients();
  const { sales, updateSale } = useSales();
  
  const client = clients.find(c => c.id === id);
  const clientSales = sales.filter(s => s.clientId === id);
  const balance = client ? calculateClientBalance(id, sales) : 0;

  const [surchargeInput, setSurchargeInput] = useState({ show: false, saleId: '', instId: '', amount: '' });

  if (!client) {
    return <div className="p-6">Cliente no encontrado.</div>;
  }

  const handleTogglePayment = (sale, instId) => {
    const updatedInstallments = sale.installments.map(inst => {
      if (inst.id === instId) {
        return { ...inst, paid: !inst.paid, paymentDate: !inst.paid ? new Date().toISOString() : null };
      }
      return inst;
    });
    updateSale({ ...sale, installments: updatedInstallments });
  };

  const handleApplySurcharge = (e) => {
    e.preventDefault();
    const { saleId, instId, amount } = surchargeInput;
    const sale = clientSales.find(s => s.id === saleId);
    if (!sale) return;

    const updatedInstallments = sale.installments.map(inst => {
      if (inst.id === instId) {
        return { ...inst, surcharge: (inst.surcharge || 0) + parseFloat(amount) };
      }
      return inst;
    });
    updateSale({ ...sale, installments: updatedInstallments });
    setSurchargeInput({ show: false, saleId: '', instId: '', amount: '' });
  };

  const generateWhatsAppLink = (sale, inst) => {
    const totalAmount = inst.amount + (inst.surcharge || 0);
    const formattedAmount = formatCurrency(totalAmount);
    // Hola [Nombre], te recuerdo que hoy vence tu cuota de [Producto] por un valor de [Monto].
    const message = `Hola ${client.name}, te recuerdo que vence tu cuota de ${sale.product} por un valor de ${formattedAmount}.`;
    const cleanPhone = client.phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <Link to="/clientes" className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors">
        <ArrowLeft size={20} />
        <span>Volver a clientes</span>
      </Link>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{client.name}</h2>
          <p className="text-slate-500 flex items-center gap-2 mt-1">
            <MessageCircle size={16} /> {client.phone}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[200px] text-right">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Deuda Total</p>
          <p className={`text-3xl font-bold ${balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">Historial de Compras</h3>
        <Link to="/nueva-venta" className="text-sm text-red-600 hover:text-red-700 font-medium">
          + Nueva Compra
        </Link>
      </div>

      <div className="space-y-6">
        {clientSales.length === 0 ? (
          <div className="text-center p-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No hay ventas registradas para este cliente.</p>
          </div>
        ) : (
          clientSales.map(sale => (
            <div key={sale.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{sale.product}</h4>
                  <p className="text-xs text-slate-500">Total: {formatCurrency(sale.totalAmount)} | {sale.installmentsCount} {sale.installmentsCount === 1 ? 'cuota' : 'cuotas'}</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                      <th className="p-4 font-medium">Cuota</th>
                      <th className="p-4 font-medium">Vencimiento</th>
                      <th className="p-4 font-medium">Monto (Inc. Recargos)</th>
                      <th className="p-4 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.installments.map(inst => {
                      const totalAmount = inst.amount + (inst.surcharge || 0);
                      return (
                        <tr key={inst.id} className={`border-b border-slate-50 transition-colors hover:bg-slate-50/50 ${inst.paid ? 'opacity-60 bg-slate-50' : ''}`}>
                          <td className="p-4 font-medium">
                            <div className="flex items-center gap-2">
                              {inst.paid ? <CheckCircle className="text-emerald-500" size={18} /> : <Circle className="text-slate-300" size={18} />}
                              N° {inst.number}
                            </div>
                          </td>
                          <td className="p-4 text-slate-600">
                            {new Date(inst.dueDate).toLocaleDateString('es-AR')}
                          </td>
                          <td className="p-4">
                            <span className={`font-bold ${inst.paid ? 'text-slate-500' : 'text-slate-800'}`}>
                              {formatCurrency(totalAmount)}
                            </span>
                            {inst.surcharge > 0 && <span className="ml-2 text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">+ {formatCurrency(inst.surcharge)} mora</span>}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!inst.paid && (
                                <button 
                                  onClick={() => setSurchargeInput({ show: true, saleId: sale.id, instId: inst.id, amount: '' })}
                                  className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-all"
                                >
                                  Recargo
                                </button>
                              )}
                              {!inst.paid && (
                                <a 
                                  href={generateWhatsAppLink(sale, inst)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-white bg-[#25D366] hover:bg-[#1ebd5a] p-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                                  title="Enviar WhatsApp"
                                >
                                  <MessageCircle size={18} />
                                </a>
                              )}
                              <button 
                                onClick={() => handleTogglePayment(sale, inst.id)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all ${
                                  inst.paid 
                                    ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' 
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                {inst.paid ? 'Deshacer Pago' : 'Marcar Pagado'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Surcharge Modal */}
      {surchargeInput.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <form onSubmit={handleApplySurcharge} className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <AlertCircle className="text-red-500" />
                Aplicar Recargo
              </h3>
              <p className="text-sm text-slate-500 mb-4">Ingresa el monto adicional por mora que se sumará a esta cuota.</p>
              
              <div className="relative mb-6">
                <span className="absolute left-3 top-3 text-slate-400">$</span>
                <input 
                  type="number" 
                  autoFocus
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full border-slate-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 bg-slate-50 p-3 pl-8 border"
                  placeholder="0.00"
                  value={surchargeInput.amount}
                  onChange={e => setSurchargeInput({...surchargeInput, amount: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setSurchargeInput({ show: false, saleId: '', instId: '', amount: '' })}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-md transition-all active:scale-95"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
