import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Package, ClipboardList, Plus, Menu, Tag } from 'lucide-react';

const navItems = [
  { icon: ClipboardList, label: 'Pedidos Pendentes', path: '/admin' },
  { icon: Package, label: 'Todos Pedidos', path: '/admin/orders' },
  { icon: ClipboardList, label: 'Reembolsos', path: '/admin/refunds' },
  { icon: Plus, label: 'Novo Produto', path: '/admin/products/new' },
  { icon: Package, label: 'Produtos', path: '/admin/products' },
  { icon: Tag, label: 'Cupons', path: '/admin/coupons' },
];

export default function AdminPanel() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-foreground" />
            <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-white text-black font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden p-4 border-b border-border">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}