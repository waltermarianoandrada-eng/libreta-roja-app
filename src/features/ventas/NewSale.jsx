import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import { useSales } from '../../hooks/useSales';
import { addMonths, parseISO, format } from 'date-fns';
import { Save } from 'lucide-react';

const PRODUCT_SUGGESTIONS = [
  "Bazar",
  "Electrónica",
  "Ropa de cama",
  "Medias",
  "Boxer",
  "Calzado",
  "Perfumería"
];

const NewSale = () => {
  const { clients } = useClients();
  const { addSale } = useSales();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientId: '',
    product: '',
    totalAmount: '',
    installmentsCount: 1,
    firstDate: format(new Date(), 'yyyy-MM-dd')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientId || !formData.product || !formData.totalAmount) return;

    const amountPerInstallment = parseFloat(formData.totalAmount) / parseInt(formData.installmentsCount);
    const startDate = parseISO(formData.firstDate);

    // Generate schedule
    const installments = Array.from({ length: parseInt(formData.installmentsCount) }).map((_, i) => {
      return {
        id: crypto.randomUUID(),
        number: i + 1,
        amount: amountPerInstallment,
        dueDate: format(addMonths(startDate, i), 'yyyy-MM-dd'),
        paid: false,
        paymentDate: null,
        surcharge: 0 // Manual surcharge
      };
    });

    const newSale = {
      clientId: formData.clientId,
      product: formData.product,
      totalAmount: parseFloat(formData.totalAmount),
      installmentsCount: parseInt(formData.installmentsCount),
      installments: installments
    };

    addSale(newSale);
    navigate(`/clientes/${formData.clientId}`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
        Registrar Nueva Venta
      </h2>
      
      {clients.length === 0 ? (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
          Para registrar una venta, primero debes tener clientes en tu Libreta.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cliente *</label>
            <select 
              required
              className="w-full border-slate-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 bg-slate-50 p-3 border"
              value={formData.clientId}
              onChange={e => setFormData({...formData, clientId: e.target.value})}
            >
              <option value="" disabled>Seleccionar cliente...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Producto o Categoría *</label>
            <input 
              type="text" 
              required
              list="product-suggestions"
              className="w-full border-slate-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 bg-slate-50 p-3 border"
              placeholder="Ej. Ropa de cama"
              value={formData.product}
              onChange={e => setFormData({...formData, product: e.target.value})}
            />
            <datalist id="product-suggestions">
              {PRODUCT_SUGGESTIONS.map(p => <option key={p} value={p} />)}
            </datalist>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto Total ($) *</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">$</span>
                <input 
                  type="number" 
                  min="1"
                  step="0.01"
                  required
                  className="w-full border-slate-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 bg-slate-50 p-3 pl-8 border"
                  placeholder="0.00"
                  value={formData.totalAmount}
                  onChange={e => setFormData({...formData, totalAmount: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad de Cuotas *</label>
              <input 
                type="number" 
                min="1"
                required
                className="w-full border-slate-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 bg-slate-50 p-3 border"
                value={formData.installmentsCount}
                onChange={e => setFormData({...formData, installmentsCount: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de la Compra / Primera Cuota *</label>
            <input 
              type="date" 
              required
              className="w-full border-slate-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500 bg-slate-50 p-3 border"
              value={formData.firstDate}
              onChange={e => setFormData({...formData, firstDate: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 flex justify-between items-center bg-gradient-to-r from-red-50 to-white">
              <span className="text-slate-600 font-medium">Valor por cuota:</span>
              <span className="font-bold text-xl text-red-600">
                {formData.totalAmount && formData.installmentsCount ? 
                  `$ ${(parseFloat(formData.totalAmount) / parseInt(formData.installmentsCount)).toFixed(2)}` : '$ 0.00'}
              </span>
            </div>
            
            <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-red-700 hover:shadow-xl transition-all flex justify-center items-center gap-2 active:scale-[0.98]">
              <Save size={20} />
              Guardar Venta y Generar Cronograma
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewSale;
