import { useState, useEffect } from 'react';
import { base44, supabase } from '@/api/base44Client';
import { Package, DollarSign, Clock, CheckCircle, Wallet, Gift, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardHome() {
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    loadData();
    loadActivityLog();
  }, []);

  const loadData = async () => {
    try {
      const me = await base44.auth.me();
      const [allOrders, wallets, pendingGifts] = await Promise.all([
        base44.entities.Order.filter({ customer_email: me.email }, '-created_at'),
        base44.entities.Wallet.filter({ user_email: me.email }),
        supabase.from('gifts').select('*').eq('recipient_email', me.email).eq('status', 'pending').order('created_at', { ascending: false }),
      ]);
      setOrders(allOrders);
      setGifts(pendingGifts.data || []);
      if (wallets.length > 0) setWallet(wallets[0]);
      else {
        const w = await base44.entities.Wallet.create({ user_email: me.email, balance_usd: 0, transactions: [] });
        setWallet(w);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadActivityLog = () => {
    const stored = localStorage.getItem('activity_log');
    const log = stored ? JSON.parse(stored) : [];
    const now = { ip: '•••.•••.•••.•••', date: new Date().toISOString(), type: 'login' };
    const updated = [now, ...log].slice(0, 10);
    localStorage.setItem('activity_log', JSON.stringify(updated));
    setActivityLog(updated);
  };

  const handleAcceptGift = async (gift) => {
    try {
      const me = await base44.auth.me();

      // Cria pedido para o destinatário com status completed
      await base44.entities.Order.create({
        customer_email: me.email,
        customer_name: me.full_name || me.email,
        status: 'completed',
        payment_method: 'pix',
        currency: 'BRL',
        total_amount: 0,
        items: [{
          product_id: gift.product_id,
          product_title: gift.product_title,
          license_name: gift.license_name,
          price: gift.price_brl || 0,
          thumbnail: gift.product_thumbnail,
          file_url: gift.file_url,
        }],
        billing_name: me.full_name || me.email,
        billing_email: me.email,
        pix_code: 'GIFT',
        download_token: `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`,
        download_expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // Atualiza status do presente
      await supabase.from('gifts').update({ status: 'accepted' }).eq('id', gift.id);

      // Notifica o remetente
      await base44.entities.Notification.create({
        user_email: gift.sender_email,
        title: 'Presente aceito! 🎉',
        message: `${me.full_name || me.email} aceitou seu presente: ${gift.product_title}`,
        type: 'payment',
        read: false,
        link: '/dashboard',
      });

      setGifts(prev => prev.filter(g => g.id !== gift.id));
      toast.success('Presente aceito! Verifique seus pedidos para baixar.');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao aceitar presente');
    }
  };

  const handleDeclineGift = async (gift) => {
    try {
      await supabase.from('gifts').update({ status: 'declined' }).eq('id', gift.id);

      // Notifica o remetente
      await base44.entities.Notification.create({
        user_email: gift.sender_email,
        title: 'Presente recusado',
        message: `Seu presente de ${gift.product_title} foi recusado.`,
        type: 'system',
        read: false,
        link: '/dashboard',
      });

      setGifts(prev => prev.filter(g => g.id !== gift.id));
      toast.success('Presente recusado.');
    } catch {
      toast.error('Erro ao recusar presente');
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.total_amount : 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  const stats = [
    { icon: Package, label: 'Total de Pedidos', value: orders.length },
    { icon: DollarSign, label: 'Total Gasto', value: `R$${totalSpent.toFixed(2)}` },
    { icon: Clock, label: 'Pendentes', value: pendingCount },
    { icon: CheckCircle, label: 'Concluídos', value: completedCount },
  ];

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral da sua conta</p>
      </div>

      {/* Presentes recebidos */}
      {gifts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-pink-400" />
            <h2 className="text-lg font-bold text-foreground">Presentes Recebidos</h2>
            <span className="bg-pink-500/10 text-pink-400 text-xs font-bold px-2 py-0.5 rounded-full">{gifts.length}</span>
          </div>
          <div className="space-y-3">
            {gifts.map(gift => (
              <div key={gift.id} className="bg-card border border-pink-500/20 rounded-xl overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    {gift.product_thumbnail && <img src={gift.product_thumbnail} alt="" className="w-full h-full object-cover" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full font-medium">🎁 Presente</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{gift.product_title}</p>
                    <p className="text-xs text-muted-foreground">
                      De: <span className="text-foreground font-medium">{gift.sender_name || gift.sender_email}</span>
                    </p>
                    {gift.message && (
                      <p className="text-xs text-muted-foreground italic">"{gift.message}"</p>
                    )}
                    <p className="text-[10px] text-muted-foreground/60">
                      {new Date(gift.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAcceptGift(gift)}
                      className="flex items-center gap-1.5 h-9 px-4 bg-white text-black text-xs font-bold rounded-lg hover:bg-white/90 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" /> Aceitar
                    </button>
                    <button
                      onClick={() => handleDeclineGift(gift)}
                      className="flex items-center gap-1.5 h-9 px-3 border border-border text-muted-foreground text-xs rounded-lg hover:bg-secondary transition-colors"
                    >
                      <X className="h-3.5 w-3.5" /> Recusar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wallet */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">Saldo da Carteira</div>
            <div className="text-2xl font-black text-foreground">R${(wallet?.balance_usd || 0).toFixed(2)}</div>
          </div>
        </div>
        {wallet?.transactions?.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground">Transações recentes</div>
            {wallet.transactions.slice(-3).reverse().map((tx, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{tx.description}</span>
                <span className={`font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-red-400'}`}>
                  {tx.amount > 0 ? '+' : ''}R${tx.amount?.toFixed(2)}
                </span>
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
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">R${order.total_amount?.toFixed(2)}</div>
                  <div className={`text-xs capitalize ${order.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {order.status === 'completed' ? 'Concluído' : order.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </div>
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