import { useState, useEffect } from 'react';
import { getSales, saveSales } from '../utils/storage';

export const useSales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    setSales(getSales());
  }, []);

  const addSale = (sale) => {
    const newSale = { ...sale, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    saveSales(updatedSales);
  };

  const updateSale = (updatedSale) => {
    const updatedSales = sales.map(s => s.id === updatedSale.id ? updatedSale : s);
    setSales(updatedSales);
    saveSales(updatedSales);
  };

  const getSalesByClient = (clientId) => {
    return sales.filter(s => s.clientId === clientId);
  };

  return { sales, addSale, updateSale, getSalesByClient };
};
