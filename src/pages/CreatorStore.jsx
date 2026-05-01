// src/pages/CreatorStore.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { MapPin, Globe, Instagram, Github, Linkedin, Twitter, Package, Star, ShoppingBag, Edit, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CreatorStore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
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

      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('creator_id', id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      setProducts(productsData || []);

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

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      title: product.title,
      description: product.description,
      long_description: product.long_description,
      price_brl: product.price_brl,
      category: product.category,
      tags: product.tags || [],
      thumbnail: product.thumbnail,
      file_url: product.file_url,
      file_size: product.file_size,
      supported_versions: product.supported_versions
    });
  };

  const saveEditProduct = async () => {
    if (!editForm.title || !editForm.price_brl) {
      toast.error('Preencha título e preço');
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: editForm.title,
          description: editForm.description,
          long_description: editForm.long_description,
          price_brl: editForm.price_brl,
          category: editForm.category,
          tags: editForm.tags,
          thumbnail: editForm.thumbnail,
          file_size: editForm.file_size,
          supported_versions: editForm.supported_versions
        })
        .eq('id', editingProduct);

      if (error) throw error;

      toast.success('Produto atualizado!');
      setEditingProduct(null);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar produto');
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Tem certeza que deseja deletar este asset?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      toast.success('Produto deletado');
      loadData();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao deletar produto');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Header />
        <div className="flex-1 flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Header />
        <div className="flex-1 text-center py-20">
          <Package className="h-16 w-16 text-[#555] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Loja não encontrada</h2>
          <p className="text-sm text-[#555]">Esta loja não existe ou foi removida.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <div className="flex-1">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
          {profile.banner_url && (
            <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
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
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-bold text-white">{profile.display_name}</h1>
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
            </div>

            {/* Stats e Botão Publicar Asset - Lado direito */}
            <div className="flex flex-col items-end gap-3">
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
              {isOwner && (
                <Link to={`/creator/${id}/new`} className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90">
                  <Plus className="h-4 w-4" /> Publicar Asset
                </Link>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Assets da Loja</h2>
            {products.length === 0 ? (
              <div className="text-center py-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
                <ShoppingBag className="h-12 w-12 text-[#555] mx-auto mb-3" />
                <p className="text-sm text-[#555]">Nenhum asset publicado ainda.</p>
                {isOwner && (
                  <Link to={`/creator/${id}/new`} className="mt-3 inline-block text-sm text-white hover:underline">
                    Publicar meu primeiro asset →
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden hover:border-[#333] transition-all relative group"
                  >
                    {/* Botões de editar e deletar */}
                    {isOwner && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1.5 bg-black/70 rounded-lg hover:bg-white/20 transition-colors"
                          title="Editar asset"
                        >
                          <Edit className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1.5 bg-black/70 rounded-lg hover:bg-red-500/70 transition-colors"
                          title="Deletar asset"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    )}
                    
                    <div onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer">
                      <img src={product.thumbnail} alt={product.title} className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-white truncate">{product.title}</h3>
                        <p className="text-xs text-[#555] mt-1">{product.category}</p>
                        <div className="text-lg font-bold text-white mt-2">R$ {product.price_brl?.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edição */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Editar Asset</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                />
                
                <textarea
                  rows={3}
                  placeholder="Descrição curta"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white resize-none"
                />
                
                <textarea
                  rows={5}
                  placeholder="Descrição completa (Markdown)"
                  value={editForm.long_description}
                  onChange={(e) => setEditForm({ ...editForm, long_description: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white font-mono text-sm resize-none"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#555] block mb-1">Preço (BRL)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price_brl}
                      onChange={(e) => setEditForm({ ...editForm, price_brl: parseFloat(e.target.value) || 0 })}
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#555] block mb-1">Categoria</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                    >
                      <option>Scripts</option>
                      <option>Systems</option>
                      <option>UI Kits</option>
                      <option>Plugins</option>
                      <option>Templates</option>
                      <option>Assets</option>
                      <option>Tools</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={saveEditProduct}
                    className="flex-1 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90"
                  >
                    Salvar Alterações
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2A2A2A]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}