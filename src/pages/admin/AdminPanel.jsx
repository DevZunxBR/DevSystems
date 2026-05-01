// src/pages/admin/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { 
  ShieldCheck, Package, ClipboardList, Plus, Menu, Tag, Lock, Users, 
  FileText, Home, LogOut, Settings, ChevronLeft, ChevronRight,
  LayoutDashboard, ShoppingBag, DollarSign, CreditCard, Gift, Bell
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', badge: null },
  { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders', badge: null },
  { icon: ClipboardList, label: 'Pendentes', path: '/admin', badge: null },
  { icon: DollarSign, label: 'Reembolsos', path: '/admin/refunds', badge: null },
  { icon: Users, label: 'Criadores', path: '/admin/creators', badge: 'Novo' },
  { icon: Plus, label: 'Novo Produto', path: '/admin/products/new', badge: null },
  { icon: Package, label: 'Produtos', path: '/admin/products', badge: null },
  { icon: Tag, label: 'Cupons', path: '/admin/coupons', badge: null },
];

export default function AdminPanel() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

  // Tela de loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#555]">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  // Tela de acesso negado
  if (!isAdmin || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Acesso Restrito</h1>
            <p className="text-sm text-[#555]">
              Você não tem permissão para acessar esta área.
            </p>
            <p className="text-xs text-[#444]">
              Apenas administradores podem acessar o painel de controle.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2.5 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-[#0A0A0A] border-r border-[#1A1A1A] z-40 transition-all duration-300 flex flex-col ${
          collapsed ? 'w-20' : 'w-64'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo e botão de colapso */}
        <div className={`p-5 border-b border-[#1A1A1A] flex items-center justify-between ${collapsed ? 'justify-center' : ''}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-black font-black text-sm">A</span>
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Admin
              </h2>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg mx-auto">
              <span className="text-black font-black text-xs">A</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-[#1A1A1A] text-[#555] hover:text-white hover:bg-[#2A2A2A] transition-all absolute -right-3 top-6"
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        </div>

        {/* Perfil do admin */}
        <div className={`p-4 border-b border-[#1A1A1A] ${collapsed ? 'text-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${collapsed ? 'mx-auto' : ''}`}>
              <span className="text-black font-bold text-sm">
                {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.full_name || 'Admin'}
                </p>
                <p className="text-[10px] text-[#555] truncate flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Administrador
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="mt-3 pt-2 border-t border-[#1A1A1A]">
              <p className="text-[10px] text-[#555] break-all">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/admin' && location.pathname === '/admin');
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-black shadow-lg'
                    : 'text-[#555] hover:text-white hover:bg-[#1A1A1A]'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <item.icon className={`h-5 w-5 transition-all ${isActive ? 'scale-110' : ''}`} />
                {!collapsed && (
                  <span className="flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer da sidebar */}
        <div className="p-3 border-t border-[#1A1A1A]">
          <button
            onClick={() => {
              base44.auth.logout();
              navigate('/');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Header mobile */}
        <div className="lg:hidden sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-[#1A1A1A]">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(true)} className="text-[#555] hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">A</span>
              </div>
              <span className="text-white font-semibold text-sm">Admin Panel</span>
            </div>
            <div className="w-6" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}