// src/pages/dashboard/DashboardHome.jsx - Versão melhorada
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Package, DollarSign, Clock, CheckCircle, Wallet, TrendingUp, Calendar, ArrowRight, Eye, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function DashboardHome() {
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    loadActivityLog();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me();
      const [allOrders, wallets] = await Promise.all([
        base44.entities.Order.filter({ customer_email: me.email }, '-created_at'),
        base44.entities.Wallet.filter({ user_email: me.email }),
      ]);
      setOrders(allOrders);
      if (wallets.length > 0) setWallet(wallets[0]);
      else {
        const w = await base44.entities.Wallet.create({ user_email: me.email, balance_usd: 0, transactions: [] });
        setWallet(w);
      }
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Dados atualizados');
  };

  const loadActivityLog = () => {
    const stored = localStorage.getItem('activity_log');
    const log = stored ? JSON.parse(stored) : [];
    const now = { 
      ip: 'Seu IP atual', 
      date: new Date().toISOString(), 
      type: 'login',
      browser: navigator.userAgent.split(' ')[0]
    };
    const updated = [now, ...log].slice(0, 10);
    localStorage.setItem('activity_log', JSON.stringify(updated));
    setActivityLog(updated);
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.total_amount : 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const recentOrders = orders.slice(0, 5);

  // Calcular economia total (se tiver cupons)
  const totalSaved = orders.reduce((sum, o) => sum + (o.coupon_discount || 0), 0);

  const stats = [
    { icon: Package, label: 'Total de Pedidos', value: orders.length, color: 'text-foreground' },
    { icon: DollarSign, label: 'Total Gasto', value: `R$${totalSpent.toFixed(2)}`, color: 'text-foreground' },
    { icon: Clock, label: 'Pendentes', value: pendingCount, color: pendingCount > 0 ? 'text-yellow-500' : 'text-muted-foreground' },
    { icon: CheckCircle, label: 'Concluídos', value: completedCount, color: 'text-foreground' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header com refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral da sua conta</p>
        </div>
        <button 
          onClick={refreshData} 
          disabled={refreshing}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Wallet Card melhorado */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/30 rounded-lg">
              <Wallet className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Saldo da Carteira</div>
              <div className="text-2xl font-black text-foreground">R${(wallet?.balance_usd || 0).toFixed(2)}</div>
            </div>
          </div>
          {totalSaved > 0 && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Economia total</div>
              <div className="text-sm font-semibold text-green-500">R${totalSaved.toFixed(2)}</div>
            </div>
          )}
        </div>

        {/* Recent transactions melhorado */}
        {wallet?.transactions?.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">Últimas transações</div>
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </div>
            {wallet.transactions.slice(-3).reverse().map((tx, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1">
                <span className="text-muted-foreground">{tx.description}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}R${tx.amount?.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão para recarregar carteira (futuro) */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-border text-muted-foreground hover:text-foreground text-xs"
            onClick={() => toast.info('Em breve você poderá recarregar sua carteira')}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Ver extrato completo
          </Button>
        </div>
      </div>

      {/* Stats Grid com hover effect */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5 hover:border-muted-foreground/30 transition-all">
            <stat.icon className={`h-5 w-5 mb-3 ${stat.color}`} />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders melhorado */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Pedidos Recentes</h2>
          {orders.length > 0 && (
            <button 
              onClick={() => navigate('/dashboard/orders')}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>
            <Button 
              onClick={() => navigate('/store')} 
              variant="outline" 
              className="mt-4 border-border text-foreground hover:bg-secondary/30"
            >
              Explorar produtos
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-all group cursor-pointer"
                onClick={() => navigate(`/dashboard/orders/${order.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    order.status === 'completed' ? 'bg-green-500' : 
                    order.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {order.items?.map(i => i.product_title).join(', ') || 'Pedido'}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">R${order.total_amount?.toFixed(2)}</div>
                  <div className={`text-xs capitalize ${
                    order.status === 'completed' ? 'text-green-500' : 
                    order.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {order.status === 'completed' ? 'Concluído' : order.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Log melhorado */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Log de Atividades</h2>
          <div className="text-[10px] text-muted-foreground">Últimos 10 acessos</div>
        </div>
        
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data & Hora</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Evento</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Dispositivo</th>
                </tr>
              </thead>
              <tbody>
                {activityLog.map((log, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(log.date).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`capitalize ${
                        log.type === 'login' ? 'text-green-500' : 'text-foreground'
                      }`}>
                        {log.type === 'login' ? 'Login realizado' : log.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {log.browser || 'Desktop'}
                    </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dica rápida */}
      <div className="bg-secondary/10 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-secondary/30 rounded-lg">
            <TrendingUp className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">Ganhe cashback</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Você ganha 5% de cashback em todas as compras aprovadas. O saldo é creditado automaticamente na sua carteira.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}