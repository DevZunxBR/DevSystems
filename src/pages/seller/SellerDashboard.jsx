import { useEffect, useState } from 'react';
import { supabase } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Package, ShoppingBag, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_email', user?.email)
        .single();
      setProfile(data);
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
        <Link to="/seller/onboarding" className="bg-white text-black px-6 py-2 rounded-lg">Configurar Loja</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {profile.store_banner && (
        <img src={profile.store_banner} alt="Banner" className="w-full h-40 rounded-xl object-cover" />
      )}
      
      <div className="flex items-center gap-4">
        {profile.store_logo && <img src={profile.store_logo} alt="Logo" className="w-16 h-16 rounded-xl" />}
        <div>
          <h1 className="text-2xl font-bold text-white">{profile.store_name}</h1>
          <p className="text-sm text-[#555]">{profile.store_description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
          <Package className="h-5 w-5 text-[#555] mb-3" />
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-[#555]">Produtos</div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
          <ShoppingBag className="h-5 w-5 text-[#555] mb-3" />
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-[#555]">Vendas</div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
          <DollarSign className="h-5 w-5 text-[#555] mb-3" />
          <div className="text-2xl font-bold text-white">R$ 0</div>
          <div className="text-xs text-[#555]">Ganhos</div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
          <Clock className="h-5 w-5 text-[#555] mb-3" />
          <div className="text-2xl font-bold text-white">R$ 0</div>
          <div className="text-xs text-[#555]">Pendente</div>
        </div>
      </div>
    </div>
  );
}