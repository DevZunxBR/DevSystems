// src/components/layout/SellerLayout.jsx
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Package, ShoppingBag, TrendingUp, Home, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/seller/dashboard' },
  { icon: Package, label: 'Produtos', path: '/seller/products' },
  { icon: ShoppingBag, label: 'Pedidos', path: '/seller/orders' },
  { icon: TrendingUp, label: 'Analytics', path: '/seller/analytics' },
];

export default function SellerLayout() {
  const location = useLocation();

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] fixed h-screen">
        <div className="p-6">
          <h2 className="text-lg font-bold text-white">Painel do Criador</h2>
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-white text-black' : 'text-[#555] hover:text-white hover:bg-[#111]'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-[#111] transition-colors mt-4"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}