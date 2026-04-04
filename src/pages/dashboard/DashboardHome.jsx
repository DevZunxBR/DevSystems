import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Package, DollarSign, Clock, CheckCircle, Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DashboardHome() {
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingBalance, setAddingBalance] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    loadData();
    loadActivityLog();
  }, []);

  const loadData = async () => {
    try {
      const me = await base44.auth.me();
      const [allOrders, wallets] = await Promise.all([
        base44.entities.Order.filter({ customer_email: me.email }, '-created_date'),
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
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLog = () => {
    // Simulate activity log from localStorage
    const stored = localStorage.getItem('activity_log');
    const log = stored ? JSON.parse(stored) : [];
    // Add current session
    const now = { ip: '•••.•••.•••.•••', date: new Date().toISOString(), type: 'login' };
    const updated = [now, ...log].slice(0, 10);
    localStorage.setItem('activity_log', JSON.stringify(updated));
    setActivityLog(updated);
  };

  const handleAddBalance = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) { toast.error('Valor inválido'); return; }
    setAddingBalance(true);
    try {
      const newBalance = (wallet?.balance_usd || 0) + amount;
      const tx = { type: 'deposit', amount, description: 'Depósito via PIX', date: new Date().toISOString() };
      const updatedTx = [...(wallet?.transactions || []), tx];
      await base44.entities.Wallet.update(wallet.id, { balance_usd: newBalance, transactions: updatedTx });
      setWallet({ ...wallet, balance_usd: newBalance, transactions: updatedTx });
      toast.success(`$${amount.toFixed(2)} adicionados à sua carteira!`);
      setAddAmount('');
      setShowAddBalance(false);
    } catch { toast.error('Falha ao adicionar saldo'); }
    finally { setAddingBalance(false); }
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.total_amount : 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  const stats = [
    { icon: Package, label: 'Total de Pedidos', value: orders.length },
    { icon: DollarSign, label: 'Total Gasto', value: `$${totalSpent.toFixed(2)}` },
    { icon: Clock, label: 'Pendentes', value: pendingCount },
    { icon: CheckCircle, label: 'Concluídos', value: completedCount },
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
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral da sua conta</p>
      </div>

      {/* Wallet */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Saldo da Carteira</div>
              <div className="text-2xl font-black text-foreground">${(wallet?.balance_usd || 0).toFixed(2)}</div>
            </div>
          </div>
          <Button
            onClick={() => setShowAddBalance(!showAddBalance)}
            variant="outline"
            className="border-border text-foreground hover:bg-secondary gap-2 text-xs"
          >
            <Plus className="h-4 w-4" /> Adicionar Saldo via PIX
          </Button>
        </div>

        {showAddBalance && (
          <div className="flex gap-2 pt-2 border-t border-border">
            <input
              type="number"
              placeholder="Valor em USD"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="flex-1 h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              step="0.01"
              min="1"
            />
            <Button onClick={handleAddBalance} disabled={addingBalance} className="bg-white text-black hover:bg-white/90 text-xs">
              {addingBalance ? '...' : 'Confirmar'}
            </Button>
          </div>
        )}

        {/* Recent transactions */}
        {wallet?.transactions?.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground">Transações recentes</div>
            {wallet.transactions.slice(-3).reverse().map((tx, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{tx.description}</span>
                <span className="text-foreground font-semibold">+${tx.amount?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
            <stat.icon className="h-5 w-5 text-muted-foreground mb-3" />
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Pedidos Recentes</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${order.status === 'completed' ? 'bg-white' : 'bg-muted-foreground'}`} />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {order.items?.map(i => i.product_title).join(', ') || 'Pedido'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.created_date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">${order.total_amount?.toFixed(2)}</div>
                  <div className={`text-xs capitalize ${order.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}`}>{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Log */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Log de Atividades</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">IP</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Evento</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data & Hora</th>
              </tr>
            </thead>
            <tbody>
              {activityLog.map((log, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/20">
                  <td className="px-4 py-3 font-mono text-muted-foreground">{log.ip}</td>
                  <td className="px-4 py-3 text-foreground capitalize">{log.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(log.date).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}