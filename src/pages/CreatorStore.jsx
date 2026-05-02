// src/pages/CreatorStore.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { MapPin, Globe, Instagram, Github, Linkedin, Twitter, Package, Star, ShoppingBag, Edit, Plus, Trash2, Settings, X, User, Info, Map, Link2, Image as ImageIcon } from 'lucide-react';
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
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({});
  const [uploading, setUploading] = useState(false);

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
      setSettingsForm(profileData);

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

  const uploadImage = async (file, folder = 'creators') => {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, 'creators');
      setSettingsForm(prev => ({ ...prev, [field]: url }));
      toast.success(`${field === 'avatar_url' ? 'Avatar' : 'Banner'} atualizado!`);
    } catch (error) {
      toast.error('Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('creator_profiles')
        .update({
          display_name: settingsForm.display_name,
          bio: settingsForm.bio,
          location: settingsForm.location,
          website: settingsForm.website,
          avatar_url: settingsForm.avatar_url,
          banner_url: settingsForm.banner_url,
          social_links: settingsForm.social_links
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Configurações salvas!');
      setProfile(settingsForm);
      setShowSettings(false);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar configurações');
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
        <div className="pt-20">
          <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-purple-900/30 to-blue-900/30">
            {profile.banner_url ? (
              <img 
                src={profile.banner_url} 
                alt="Banner" 
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
            )}
          </div>
        </div>

        {/* Conteúdo da loja */}
        <div className="max-w-6xl mx-auto px-4 mt-6">
          
          {/* Header da loja */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full border-4 border-black overflow-hidden bg-[#0A0A0A] shadow-xl flex-shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-10 w-10 text-[#555]" />
                  </div>
                )}
              </div>
              
              {/* Info da loja */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold text-white">{profile.display_name}</h1>
                  {profile.store_rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-white">{profile.store_rating}</span>
                    </div>
                  )}
                  {isOwner && (
                    <button
                      onClick={() => setShowSettings(true)}
                      className="p-2 bg-[#1A1A1A] rounded-lg hover:bg-[#2A2A2A] transition-colors"
                      title="Configurar loja"
                    >
                      <Settings className="h-4 w-4 text-white" />
                    </button>
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
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#555] hover:text-white transition-colors">
                      <Globe className="h-3 w-3" /> Website
                    </a>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex gap-3 mt-3">
                  {profile.social_links?.instagram && (
                    <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-pink-400 transition-colors">
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {profile.social_links?.github && (
                    <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white transition-colors">
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {profile.social_links?.linkedin && (
                    <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-blue-400 transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {profile.social_links?.twitter && (
                    <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-blue-400 transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats e Botão Publicar Asset */}
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
                <Link to={`/creator/${id}/new`} className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors">
                  <Plus className="h-4 w-4" /> Publicar Asset
                </Link>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="mt-8 pb-12">
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

      {/* MODAL DE CONFIGURAÇÕES - BARRA LATERAL FIXA */}
      {showSettings && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setShowSettings(false)}
          />
          
          {/* Painel lateral */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-[#1A1A1A] z-50 shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]">
              <h2 className="text-xl font-bold text-white">Configurações da Loja</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-[#555] hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conteúdo com scroll */}
            <div className="overflow-y-auto h-[calc(100%-80px)] p-6 space-y-6">
              
              {/* Avatar */}
              <div>
                <label className="text-xs font-medium text-[#555] block mb-2 flex items-center gap-2">
                  <User className="h-3 w-3" /> Avatar da Loja
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-[#1A1A1A] overflow-hidden">
                    {settingsForm.avatar_url ? (
                      <img src={settingsForm.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#555]">?</div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar_url')} className="hidden" />
                    <div className="px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-sm text-[#555] hover:text-white transition-colors">
                      {uploading ? 'Enviando...' : 'Alterar Avatar'}
                    </div>
                  </label>
                </div>
              </div>

              {/* Banner */}
              <div>
                <label className="text-xs font-medium text-[#555] block mb-2 flex items-center gap-2">
                  <ImageIcon className="h-3 w-3" /> Banner da Loja
                </label>
                <div className="space-y-2">
                  <div className="h-24 bg-[#1A1A1A] rounded-lg overflow-hidden">
                    {settingsForm.banner_url && (
                      <img src={settingsForm.banner_url} alt="Banner" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <label className="cursor-pointer inline-block">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner_url')} className="hidden" />
                    <div className="px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-sm text-[#555] hover:text-white transition-colors">
                      {uploading ? 'Enviando...' : 'Alterar Banner'}
                    </div>
                  </label>
                </div>
              </div>

              {/* Nome da Loja */}
              <div>
                <label className="text-xs font-medium text-[#555] block mb-2">Nome da Loja</label>
                <input
                  type="text"
                  value={settingsForm.display_name || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, display_name: e.target.value })}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="text-xs font-medium text-[#555] block mb-2 flex items-center gap-2">
                  <Info className="h-3 w-3" /> Descrição
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.bio || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white resize-none"
                />
              </div>

              {/* Localização */}
              <div>
                <label className="text-xs font-medium text-[#555] block mb-2 flex items-center gap-2">
                  <Map className="h-3 w-3" /> Localização
                </label>
                <input
                  type="text"
                  value={settingsForm.location || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                />
              </div>

              {/* Website */}
              <div>
                <label className="text-xs font-medium text-[#555] block mb-2 flex items-center gap-2">
                  <Link2 className="h-3 w-3" /> Website
                </label>
                <input
                  type="url"
                  value={settingsForm.website || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, website: e.target.value })}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                />
              </div>

              {/* Redes Sociais */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-[#555] block">Redes Sociais</label>
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <input
                    type="text"
                    value={settingsForm.social_links?.instagram || ''}
                    onChange={(e) => setSettingsForm({ 
                      ...settingsForm, 
                      social_links: { ...settingsForm.social_links, instagram: e.target.value } 
                    })}
                    placeholder="@usuario"
                    className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-white" />
                  <input
                    type="text"
                    value={settingsForm.social_links?.github || ''}
                    onChange={(e) => setSettingsForm({ 
                      ...settingsForm, 
                      social_links: { ...settingsForm.social_links, github: e.target.value } 
                    })}
                    placeholder="github.com/usuario"
                    className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-500" />
                  <input
                    type="text"
                    value={settingsForm.social_links?.linkedin || ''}
                    onChange={(e) => setSettingsForm({ 
                      ...settingsForm, 
                      social_links: { ...settingsForm.social_links, linkedin: e.target.value } 
                    })}
                    placeholder="linkedin.com/in/usuario"
                    className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveSettings}
                  className="flex-1 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de edição de produto */}
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