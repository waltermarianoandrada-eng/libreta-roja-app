export const calculateClientBalance = (clientId, allSales) => {
  const clientSales = allSales.filter(s => s.clientId === clientId);
  let total = 0;
  clientSales.forEach(sale => {
    (sale.installments || []).forEach(inst => {
      if (!inst.paid) {
        total += inst.amount + (inst.surcharge || 0);
      }
    });
  });
  return total;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};
