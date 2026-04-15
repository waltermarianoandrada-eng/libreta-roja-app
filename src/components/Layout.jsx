import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, FilePlus } from 'lucide-react';
import InstallPrompt from './InstallPrompt';

const Layout = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Clientes', path: '/clientes', icon: Users },
    { name: 'Nueva Venta', path: '/nueva-venta', icon: FilePlus },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:flex flex-col">
      <header className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-10 hidden md:flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span>Libreta Roja</span>
        </h1>
        <nav className="flex gap-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${active ? 'bg-red-700' : 'hover:bg-red-500'}`}>
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="flex-1 p-4 max-w-5xl md:mx-auto w-full mt-4">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 z-10 pb-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
             <Link key={item.path} to={item.path} className={`flex flex-col items-center p-2 ${active ? 'text-red-600' : 'text-slate-500'}`}>
                <Icon size={24} className={active ? 'fill-red-100' : ''} />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
             </Link>
          )
        })}
      </nav>
      
      <InstallPrompt />
    </div>
  );
};

export default Layout;
