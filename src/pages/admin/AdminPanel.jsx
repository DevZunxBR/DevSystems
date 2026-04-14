// src/pages/admin/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Package, ClipboardList, Plus, Menu, Tag, Lock } from 'lucide-react';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me();
      
      if (!me) {
        setIsAdmin(false);
        setUser(null);
        return;
      }
      
      // Verificar se o usuário tem role admin
      const isUserAdmin = me.role === 'admin';
      
      if (!isUserAdmin) {
        setIsAdmin(false);
        setUser(me);
        toast.error('Acesso negado. Você não tem permissão de administrador.');
        return;
      }
      
      setIsAdmin(true);
      setUser(me);
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      setIsAdmin(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Tela de loading (sem delay de 1 segundo, apenas enquanto verifica)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#555]">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  // Se não for admin, redireciona imediatamente (sem delay)
  if (!isAdmin || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Acesso Negado</h1>
          <p className="text-sm text-[#555] max-w-md">
            Você não tem permissão para acessar esta área. Apenas administradores podem acessar o painel.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-sm">A</span>
            </div>
            <h2 className="text-lg font-bold text-white">Admin Panel</h2>
          </div>

          {/* Badge de admin */}
          <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-white" />
              <span className="text-xs font-medium text-white">Administrador</span>
            </div>
            <p className="text-[10px] text-[#555] mt-1">{user?.email}</p>
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
                      : 'text-[#555] hover:text-white hover:bg-[#111]'
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

      <div className="flex-1 min-w-0 bg-black">
        <div className="lg:hidden p-4 border-b border-[#1A1A1A] bg-black">
          <button onClick={() => setSidebarOpen(true)} className="text-[#555] hover:text-white">
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