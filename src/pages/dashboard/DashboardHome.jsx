// src/pages/dashboard/DashboardHome.jsx
import { useEffect, useState } from 'react';
import { base44, supabase } from '@/api/base44Client';
import { Package, DollarSign, Clock, CheckCircle, Wallet, Gift, Check, X, TrendingUp, ShoppingBag, Award, Calendar, ArrowRight, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const getOrderDate = (order) => order?.created_date || order?.created_at || null;

export default function DashboardHome() {
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState([]);
  const [processingGiftId, setProcessingGiftId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    loadActivityLog();
  }, []);

  const loadData = async () => {
    try {
      const me = await base44.auth.me();
      const [allOrders, wallets, pendingGifts] = await Promise.all([
        base44.entities.Order.filter({ customer_email: me.email }, '-created_date'),
        base44.entities.Wallet.filter({ user_email: me.email }),
        supabase
          .from('gifts')
          .select('*')
          .eq('recipient_email', me.email)
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
      ]);

      setOrders(allOrders || []);
      setGifts(pendingGifts?.data || []);

      if (wallets?.length > 0) {
        setWallet(wallets[0]);
      } else {
        const createdWallet = await base44.entities.Wallet.create({
          user_email: me.email,
          balance_usd: 0,
          transactions: [],
        });
        setWallet(createdWallet);
      }
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível carregar o dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLog = () => {
    const stored = localStorage.getItem('activity_log');
    const log = stored ? JSON.parse(stored) : [];
    const lastEntry = log[0];

    const isRecentLogin =
      lastEntry?.type === 'login' &&
      typeof lastEntry?.date === 'string' &&
      Date.now() - new Date(lastEntry.date).getTime() < 15 * 60 * 1000;

    const loginEntry = {
      ip: '***.***.***.***',
      date: new Date().toISOString(),
      type: 'login',
    };

    const updated = (isRecentLogin ? log : [loginEntry, ...log]).slice(0, 10);
    localStorage.setItem('activity_log', JSON.stringify(updated));
    setActivityLog(updated);
  };

  const handleAcceptGift = async (gift) => {
    if (processingGiftId) return;
    setProcessingGiftId(gift.id);

    try {
      const me = await base44.auth.me();

      await base44.entities.Order.create({
        customer_email: me.email,
        customer_name: me.full_name || me.email,
        status: 'completed',
        payment_method: 'gift',
        currency: 'BRL',
        total_amount: 0,
        items: [
          {
            product_id: gift.product_id,
            product_title: gift.product_title,
            license_name: gift.license_name,
            price: 0,
            thumbnail: gift.product_thumbnail,
            file_url: gift.file_url,
          },
        ],
        billing_name: me.full_name || me.email,
        billing_email: me.email,
        pix_code: 'GIFT_ACCEPTED',
        download_token: `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`,
        download_expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

      await supabase.from('gifts').update({ status: 'accepted' }).eq('id', gift.id);

      await base44.entities.Notification.create({
        user_email: gift.sender_email,
        title: 'Presente aceito!',
        message: `${me.full_name || me.email} aceitou seu presente: ${gift.product_title}`,
        type: 'payment',
        read: false,
        link: '/dashboard',
      });

      setGifts((prev) => prev.filter((item) => item.id !== gift.id));
      toast.success('Presente aceito! O produto está disponível em "Meus Pedidos".');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao aceitar presente');
    } finally {
      setProcessingGiftId(null);
    }
  };

  const handleDeclineGift = async (gift) => {
    if (processingGiftId) return;
    setProcessingGiftId(gift.id);

    try {
      await supabase.from('gifts').update({ status: 'declined' }).eq('id', gift.id);

      await base44.entities.Notification.create({
        user_email: gift.sender_email,
        title: 'Presente recusado',
        message: `Seu presente de ${gift.product_title} foi recusado.`,
        type: 'system',
        read: false,
        link: '/dashboard',
      });

      setGifts((prev) => prev.filter((item) => item.id !== gift.id));
      toast.success('Presente recusado.');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao recusar presente');
    } finally {
      setProcessingGiftId(null);
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + (order.status === 'completed' ? Number(order.total_amount || 0) : 0), 0);
  const pendingCount = orders.filter((order) => order.status === 'pending').length;
  const completedCount = orders.filter((order) => order.status === 'completed').length;

  const stats = [
    { icon: ShoppingBag, label: 'Total de Pedidos', value: orders.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: DollarSign, label: 'Total Gasto', value: `R$ ${totalSpent.toFixed(2)}`, color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: Clock, label: 'Pendentes', value: pendingCount, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: CheckCircle, label: 'Concluídos', value: completedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-3 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#555] mt-1">Bem-vindo de volta! Aqui está o resumo da sua conta.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg">
            <span className="text-xs text-[#555]">Última atualização</span>
            <span className="text-xs text-white ml-2">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Presentes Recebidos */}
      {gifts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <Gift className="h-5 w-5 text-pink-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Presentes Recebidos</h2>
            <span className="bg-pink-500/20 text-pink-400 text-xs font-bold px-2 py-0.5 rounded-full">{gifts.length}</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {gifts.map((gift) => (
              <div key={gift.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden hover:border-[#2A2A2A] transition-all duration-300">
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-14 h-14 bg-[#111] rounded-xl overflow-hidden flex-shrink-0">
                    {gift.product_thumbnail && <img src={gift.product_thumbnail} alt="" className="w-full h-full object-cover" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{gift.product_title}</p>
                    <p className="text-xs text-[#555]">
                      De: <span className="text-white font-medium">{gift.sender_name || gift.sender_email}</span>
                    </p>
                    {gift.message && <p className="text-xs text-[#555] italic mt-1">"{gift.message}"</p>}
                    <p className="text-[10px] text-[#555]/60 mt-1">{new Date(gift.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAcceptGift(gift)}
                      disabled={processingGiftId === gift.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-60"
                    >
                      <Check className="h-3.5 w-3.5" /> Aceitar
                    </button>
                    <button
                      onClick={() => handleDeclineGift(gift)}
                      disabled={processingGiftId === gift.id}
                      className="flex items-center gap-1.5 px-3 py-2 border border-[#1A1A1A] text-[#555] text-xs rounded-lg hover:bg-[#1A1A1A] hover:text-white transition-all disabled:opacity-60"
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 hover:border-[#2A2A2A] transition-all duration-300 group`}>
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-[#555] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Carteira e Resumo Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Wallet className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-xs font-medium text-[#555] uppercase tracking-wider">Saldo Disponível</span>
            </div>
            <CreditCard className="h-4 w-4 text-[#555]" />
          </div>
          <div className="text-3xl font-black text-white mb-2">R$ {(wallet?.balance_usd || 0).toFixed(2)}</div>
          <p className="text-xs text-[#555]">Saldo disponível para compras na plataforma</p>
          
          {wallet?.transactions?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
              <p className="text-xs text-[#555] mb-2">Últimas transações</p>
              <div className="space-y-2">
                {wallet.transactions.slice(-3).reverse().map((tx, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-[#555]">{tx.description}</span>
                    <span className={`font-semibold ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}R$ {Number(tx.amount || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resumo Rápido */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Resumo da Conta</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[#1A1A1A]">
              <span className="text-sm text-[#555]">Membro desde</span>
              <span className="text-sm text-white">-</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#1A1A1A]">
              <span className="text-sm text-[#555]">Total de pedidos</span>
              <span className="text-sm text-white font-semibold">{orders.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-[#555]">Taxa de conclusão</span>
              <span className="text-sm text-white font-semibold">
                {orders.length > 0 ? Math.round((completedCount / orders.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Pedidos Recentes</h2>
          </div>
          {orders.length > 0 && (
            <button
              onClick={() => navigate('/dashboard/orders')}
              className="text-xs text-[#555] hover:text-white flex items-center gap-1 transition-colors group"
            >
              Ver todos <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
            <ShoppingBag className="h-12 w-12 text-[#555] mx-auto mb-3" />
            <p className="text-sm text-[#555]">Nenhum pedido ainda.</p>
            <button
              onClick={() => navigate('/store')}
              className="mt-3 text-xs text-white hover:underline"
            >
              Começar a comprar →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 hover:border-[#2A2A2A] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${order.status === 'completed' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                  <div>
                    <div className="text-sm font-medium text-white">{order.items?.map((item) => item.product_title).join(', ') || 'Pedido'}</div>
                    <div className="text-xs text-[#555] flex items-center gap-2 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {getOrderDate(order) ? new Date(getOrderDate(order)).toLocaleDateString('pt-BR') : '-'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-white">R$ {Number(order.total_amount || 0).toFixed(2)}</div>
                  <div className={`text-xs capitalize mt-0.5 ${
                    order.status === 'completed' ? 'text-green-400' : 
                    order.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {order.status === 'completed' ? 'Concluído' : order.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log de Atividades */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-500/10 rounded-lg">
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Log de Atividades</h2>
        </div>
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1A1A1A] bg-black/50">
                <th className="text-left px-4 py-3 font-medium text-[#555]">IP</th>
                <th className="text-left px-4 py-3 font-medium text-[#555]">Evento</th>
                <th className="text-left px-4 py-3 font-medium text-[#555]">Data e Hora</th>
               </tr>
            </thead>
            <tbody>
              {activityLog.map((log, index) => (
                <tr key={index} className="border-b border-[#1A1A1A] last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-[#555]">{log.ip}</td>
                  <td className="px-4 py-3 text-white capitalize">{log.type}</td>
                  <td className="px-4 py-3 text-[#555]">{new Date(log.date).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}