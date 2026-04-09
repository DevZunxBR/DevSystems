import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { base44, supabase } from '@/api/base44Client';
import { ShieldCheck, Package, ClipboardList, Plus, Menu, Tag, Wrench, RefreshCw } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadMaintenanceStatus();
  }, []);

  // Carregar status da manutenção
  const loadMaintenanceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'maintenance_mode')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setMaintenanceMode(data?.value === 'true');
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    }
  };

  // Ativar/desativar manutenção
  const toggleMaintenance = async () => {
    setLoading(true);
    try {
      const newValue = !maintenanceMode;
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'maintenance_mode', 
          value: String(newValue),
          description: 'Ativar/desativar modo manutenção',
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;
      
      setMaintenanceMode(newValue);
      toast.success(newValue ? 'Modo manutenção ativado!' : 'Modo manutenção desativado!');
      
      // Recarregar a página para aplicar mudanças
      if (newValue) {
        toast.info('O site agora está em manutenção para usuários normais');
      }
    } catch (error) {
      console.error('Erro ao alterar manutenção:', error);
      toast.error('Erro ao alterar modo manutenção');
    } finally {
      setLoading(false);
    }
  };

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

          {/* Card de Manutenção */}
          <div className="bg-secondary/30 border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className={`h-4 w-4 ${maintenanceMode ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                <span className="text-xs font-medium text-foreground">Modo Manutenção</span>
              </div>
              <button
                onClick={toggleMaintenance}
                disabled={loading}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  maintenanceMode ? 'bg-yellow-500' : 'bg-border'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    maintenanceMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {maintenanceMode 
                ? '⚠️ Site em manutenção - Apenas admin vê o site' 
                : '✅ Site normal - Todos usuários acessam'}
            </p>
            {loading && (
              <div className="flex justify-center pt-1">
                <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
              </div>
            )}
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