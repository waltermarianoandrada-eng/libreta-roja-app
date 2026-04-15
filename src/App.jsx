import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './features/Dashboard';
import ClientsList from './features/clientes/ClientsList';
import ClientDetails from './features/clientes/ClientDetails';
import NewSale from './features/ventas/NewSale';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<ClientsList />} />
          <Route path="clientes/:id" element={<ClientDetails />} />
          <Route path="nueva-venta" element={<NewSale />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
