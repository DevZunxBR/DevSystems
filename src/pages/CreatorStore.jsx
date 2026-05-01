// src/pages/CreatorStore.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { MapPin, Globe, Instagram, Github, Linkedin, Twitter, Package, Star, ShoppingBag, Settings, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function CreatorStore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      // Buscar perfil do criador
      const { data: profileData } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (!profileData) {
        toast.error('Perfil não encontrado');
        navigate('/');
        return;
      }

      setProfile(profileData);

      // Buscar produtos aprovados do criador
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('creator_id', id)
        .eq('approval_status', 'approved')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      setProducts(productsData || []);

      // Verificar se é o dono do perfil
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userProfile } = await supabase
          .from('creator_profiles')
          .select('user_id')
          .eq('id', id)
          .single();
        
        setIsOwner(userProfile?.user_id === user.id);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from('creator_profiles')
        .update(editForm)
        .eq('id', profile.id);

      if (error) throw error;
      setProfile(editForm);
      setIsEditing(false);
      toast.success('Perfil atualizado!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile || profile.status !== 'active') {
    return (
      <div className="text-center py-20">
        <Package className="h-16 w-16 text-[#555] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Loja não disponível</h2>
        <p className="text-sm text-[#555]">Este perfil de criador não está ativo no momento.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-purple-900/30 to-blue-900/30 relative">
        {profile.banner_url && (
          <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
        )}
        {isOwner && !isEditing && (
          <button
            onClick={() => {
              setEditForm(profile);
              setIsEditing(true);
            }}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
          >
            <Edit className="h-4 w-4 text-white" />
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-[#0A0A0A]">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-[#555]" />
                </div>
              )}
            </div>
            {isOwner && !isEditing && (
              <button className="absolute bottom-0 right-0 p-1.5 bg-[#1A1A1A] rounded-full hover:bg-[#2A2A2A]">
                <Edit className="h-3 w-3 text-white" />
              </button>
            )}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.display_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                  placeholder="Nome da Loja"
                  className="text-2xl font-bold bg-black border border-[#1A1A1A] rounded-lg px-3 py-1 text-white w-full"
                />
                <textarea
                  value={editForm.bio || ''}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Descrição da loja"
                  rows={3}
                  className="w-full bg-black border border-[#1A1A1A] rounded-lg px-3 py-2 text-white text-sm"
                />
                <input
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="Localização"
                  className="w-full bg-black border border-[#1A1A1A] rounded-lg px-3 py-2 text-white text-sm"
                />
                <input
                  type="url"
                  value={editForm.website || ''}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  placeholder="Website"
                  className="w-full bg-black border border-[#1A1A1A] rounded-lg px-3 py-2 text-white text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={saveProfile} className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold">
                    Salvar
                  </button>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg text-sm">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-white">{profile.display_name || 'Criador DevAssets'}</h1>
                  {profile.store_rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-white">{profile.store_rating}</span>
                    </div>
                  )}
                </div>
                {profile.bio && <p className="text-sm text-[#555] mt-2 max-w-xl">{profile.bio}</p>}
                
                <div className="flex flex-wrap gap-4 mt-3">
                  {profile.location && (
                    <div className="flex items-center gap-1 text-xs text-[#555]">
                      <MapPin className="h-3 w-3" /> {profile.location}
                    </div>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#555] hover:text-white">
                      <Globe className="h-3 w-3" /> Website
                    </a>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex gap-3 mt-3">
                  {profile.social_links?.instagram && (
                    <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-pink-400">
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {profile.social_links?.github && (
                    <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white">
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {profile.social_links?.linkedin && (
                    <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-blue-400">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {profile.social_links?.twitter && (
                    <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-blue-400">
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{profile.total_products || products.length}</div>
              <div className="text-xs text-[#555]">Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{profile.total_sales || 0}</div>
              <div className="text-xs text-[#555]">Vendas</div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Assets da Loja</h2>
          {products.length === 0 ? (
            <div className="text-center py-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
              <ShoppingBag className="h-12 w-12 text-[#555] mx-auto mb-3" />
              <p className="text-sm text-[#555]">Nenhum asset publicado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden cursor-pointer hover:border-[#333] transition-all"
                >
                  <img src={product.thumbnail} alt={product.title} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white truncate">{product.title}</h3>
                    <p className="text-xs text-[#555] mt-1">{product.category}</p>
                    <div className="text-lg font-bold text-white mt-2">R$ {product.price_brl?.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}