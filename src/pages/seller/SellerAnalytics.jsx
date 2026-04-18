// src/pages/seller/SellerAnalytics.jsx
import { useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { DollarSign, ShoppingBag, TrendingUp, Clock, Calendar, Package } from 'lucide-react';

export default function SellerAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_products: 0,
    total_sales: 0,
    total_revenue: 0,
    pending_commission: 0,
    paid_commission: 0,
    monthly_sales: []
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Buscar produtos do seller
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('seller_email', user?.email);

      // Buscar comissões
      const { data: commissions } = await supabase
        .from('commissions')
        .select('*')
        .eq('seller_email', user?.email);

      const totalRevenue = commissions?.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0) || 0;
      const pendingCommission = commissions?.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0) || 0;
      const paidCommission = commissions?.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0) || 0;

      // Vendas por mês
      const monthlyData = {};
      commissions?.forEach(c => {
        if (c.status === 'paid') {
          const date = new Date(c.created_at);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          monthlyData[monthYear] = (monthlyData[monthYear] || 0) + c.amount;
        }
      });

      const monthlySales = Object.entries(monthlyData).map(([month, total]) => ({
        month,
        total
      })).slice(-6); // Últimos 6 meses

      setStats({
        total_products: products?.length || 0,
        total_sales: commissions?.length || 0,
        total_revenue: totalRevenue,
        pending_commission: pendingCommission,
        paid_commission: paidCommission,
        monthly_sales: monthlySales
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { icon: Package, label: 'Produtos', value: stats.total_products, color: 'text-blue-500' },
    { icon: ShoppingBag, label: 'Vendas', value: stats.total_sales, color: 'text-green-500' },
    { icon: DollarSign, label: 'Faturamento', value: `R$ ${stats.total_revenue.toFixed(2)}`, color: 'text-emerald-500' },
    { icon: Clock, label: 'Comissão Pendente', value: `R$ ${stats.pending_commission.toFixed(2)}`, color: 'text-yellow-500' },
    { icon: TrendingUp, label: 'Comissão Paga', value: `R$ ${stats.paid_commission.toFixed(2)}`, color: 'text-purple-500' },
  ];

  // Comissão estimada (30% do faturamento)
  const estimatedCommission = stats.total_revenue * 0.3;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-[#555] mt-1">Estatísticas e métricas da sua loja</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
            <card.icon className={`h-5 w-5 ${card.color} mb-3`} />
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <div className="text-xs text-[#555] mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Comissão estimada */}
      <div className="bg-gradient-to-r from-[#0A0A0A] to-[#111] border border-[#1A1A1A] rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-[#555] mb-1">Comissão Estimada (30%)</p>
            <p className="text-3xl font-bold text-white">R$ {estimatedCommission.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#555] mb-1">Próximo pagamento</p>
            <p className="text-sm text-white">Aguardando vendas</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
          <div className="w-full bg-black rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, (stats.paid_commission / (stats.paid_commission + stats.pending_commission || 1)) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-green-500">Pago: R$ {stats.paid_commission.toFixed(2)}</span>
            <span className="text-yellow-500">Pendente: R$ {stats.pending_commission.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Vendas mensais */}
      {stats.monthly_sales.length > 0 && (
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-[#555]" />
            <h3 className="text-sm font-medium text-white">Vendas por Mês</h3>
          </div>
          <div className="space-y-3">
            {stats.monthly_sales.map((item) => (
              <div key={item.month} className="flex items-center gap-3">
                <span className="text-xs text-[#555] w-16">{item.month}</span>
                <div className="flex-1 bg-black rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full flex items-center justify-end px-2"
                    style={{ width: `${Math.min(100, (item.total / (stats.total_revenue || 1)) * 100)}%` }}
                  >
                    <span className="text-[10px] text-black font-medium">
                      R$ {item.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dica */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
        <p className="text-xs text-[#555] text-center">
          💡 Dica: Quanto mais produtos você vender, maior será sua comissão. 
          Produtos de qualidade geram mais vendas!
        </p>
      </div>
    </div>
  );
}