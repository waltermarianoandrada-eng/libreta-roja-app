import { useState, useEffect } from 'react';
import { getClients, saveClients } from '../utils/storage';

export const useClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    setClients(getClients());
  }, []);

  const addClient = (client) => {
    const newClient = { ...client, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  const updateClient = (updatedClient) => {
    const updatedClients = clients.map(c => c.id === updatedClient.id ? updatedClient : c);
    setClients(updatedClients);
    saveClients(updatedClients);
  };
  
  const deleteClient = (id) => {
    const updatedClients = clients.filter(c => c.id !== id);
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  return { clients, addClient, updateClient, deleteClient };
};
