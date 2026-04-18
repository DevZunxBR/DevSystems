// src/pages/seller/SellerDashboard.jsx
import { useEffect, useState } from 'react';
import { supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { DollarSign, Package, TrendingUp, Clock, ShoppingBag, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    total_products: 0,
    total_sales: 0,
    total_earned: 0,
    pending_balance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    try {
      // Carregar perfil
      const { data: profileData } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_email', user?.email)
        .single();

      setProfile(profileData);

      // Carregar estatísticas
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('seller_email', user?.email);

      const { data: commissions } = await supabase
        .from('commissions')
        .select('amount, status')
        .eq('seller_email', user?.email);

      const totalEarned = commissions?.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0) || 0;
      const pendingBalance = commissions?.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0) || 0;

      setStats({
        total_products: products?.length || 0,
        total_sales: commissions?.length || 0,
        total_earned: totalEarned,
        pending_balance: pendingBalance
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

  if (!profile?.onboarding_completed) {
    return (
      <div className="text-center py-20">
        <Package className="h-16 w-16 text-[#555] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Configure sua loja</h2>
        <p className="text-sm text-[#555] mb-6">Complete o cadastro para começar a vender</p>
        <Link to="/seller/onboarding" className="bg-white text-black px-6 py-2 rounded-lg font-semibold">
          Configurar Loja
        </Link>
      </div>
    );
  }

  const statsCards = [
    { icon: Package, label: 'Produtos', value: stats.total_products },
    { icon: ShoppingBag, label: 'Vendas', value: stats.total_sales },
    { icon: DollarSign, label: 'Total Ganho', value: `R$ ${stats.total_earned.toFixed(2)}` },
    { icon: Clock, label: 'Pendente', value: `R$ ${stats.pending_balance.toFixed(2)}` },
  ];

  return (
    <div className="space-y-8">
      {/* Banner da Loja */}
      {profile.store_banner && (
        <div className="w-full h-40 rounded-xl overflow-hidden">
          <img src={profile.store_banner} alt="Banner" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Perfil */}
      <div className="flex items-center gap-4">
        {profile.store_logo ? (
          <img src={profile.store_logo} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
        ) : (
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-xl flex items-center justify-center">
            <Package className="h-8 w-8 text-[#555]" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">{profile.store_name}</h1>
          <p className="text-sm text-[#555]">{profile.store_description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div key={stat.label} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
            <stat.icon className="h-5 w-5 text-[#555] mb-3" />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-[#555] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Links rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/seller/products" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 hover:bg-[#111] transition-colors">
          <Package className="h-6 w-6 text-white mb-2" />
          <h3 className="font-bold text-white">Meus Produtos</h3>
          <p className="text-xs text-[#555]">Gerenciar seus produtos</p>
        </Link>
        <Link to="/seller/orders" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 hover:bg-[#111] transition-colors">
          <ShoppingBag className="h-6 w-6 text-white mb-2" />
          <h3 className="font-bold text-white">Pedidos</h3>
          <p className="text-xs text-[#555]">Ver vendas realizadas</p>
        </Link>
        <Link to="/seller/analytics" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 hover:bg-[#111] transition-colors">
          <TrendingUp className="h-6 w-6 text-white mb-2" />
          <h3 className="font-bold text-white">Analytics</h3>
          <p className="text-xs text-[#555]">Estatísticas e relatórios</p>
        </Link>
      </div>
    </div>
  );
}