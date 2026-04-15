export const getClients = () => {
  const data = localStorage.getItem('libreta_roja_clients');
  return data ? JSON.parse(data) : [];
};

export const saveClients = (clients) => {
  localStorage.setItem('libreta_roja_clients', JSON.stringify(clients));
};

export const getSales = () => {
  const data = localStorage.getItem('libreta_roja_sales');
  return data ? JSON.parse(data) : [];
};

export const saveSales = (sales) => {
  localStorage.setItem('libreta_roja_sales', JSON.stringify(sales));
};
