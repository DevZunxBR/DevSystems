// src/pages/CreatorSetup.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Loader2, Lock, Shield, ArrowLeft, MapPin, Globe, Instagram, Github, Linkedin, Twitter, Sparkles, Eye } from 'lucide-react';

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

export default function CreatorSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({});
  const [checking, setChecking] = useState(true);
  const [hasRole, setHasRole] = useState(false);
  const [user, setUser] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [form, setForm] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
    banner_url: '',
    location: '',
    website: '',
    social_links: { instagram: '', github: '', linkedin: '', twitter: '' }
  });

  useEffect(() => {
    checkCreatorAccess();
  }, []);

  const checkCreatorAccess = async () => {
    setChecking(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        setHasRole(false);
        setUser(null);
        setChecking(false);
        return;
      }

      setUser(currentUser);

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('email', currentUser.email)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        setHasRole(false);
        setChecking(false);
        return;
      }

      const hasCreatorRole = profile?.role === 'creator' || profile?.role === 'admin';

      if (!hasCreatorRole) {
        setHasRole(false);
        setChecking(false);
        return;
      }

      const { data: existingProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', currentUser.id)
        .single();

      if (existingProfile) {
        navigate(`/creator/${existingProfile.id}`);
        return;
      }

      setHasRole(true);
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      setHasRole(false);
      setUser(null);
    } finally {
      setChecking(false);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const url = await uploadImage(file, 'creators');
      setForm(prev => ({ ...prev, [field]: url }));
      toast.success(`${field === 'avatar_url' ? 'Avatar' : 'Banner'} enviado!`);
    } catch (error) {
      toast.error('Erro no upload');
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
    if (!form.display_name) {
      toast.error('Nome da loja é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('creator_profiles')
        .insert({
          user_id: currentUser.id,
          email: currentUser.email,
          display_name: form.display_name,
          bio: form.bio,
          avatar_url: form.avatar_url,
          banner_url: form.banner_url,
          location: form.location,
          website: form.website,
          social_links: form.social_links,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Loja criada com sucesso!');
      navigate(`/creator/${data.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar loja');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#555]">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  if (!hasRole || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Acesso Restrito</h1>
            <p className="text-sm text-[#555]">Você não tem permissão para acessar esta área.</p>
            <p className="text-xs text-[#444]">Apenas criadores autorizados podem criar uma loja.</p>
          </div>
          <button onClick={() => navigate('/')} className="mt-4 px-6 py-2.5 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
            Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#555] hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-400 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Criar Loja de Criador</h1>
          <p className="text-sm text-[#555] mt-2">Configure sua loja e comece a vender seus assets</p>
        </div>

        {/* Preview Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-[#555] rounded-lg hover:text-white transition-colors text-sm"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'Editar Perfil' : 'Visualizar Perfil'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coluna da Esquerda - Formulário */}
          <div className={`space-y-6 transition-all duration-300 ${previewMode ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-5">
              
              {/* Banner Upload */}
              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">Banner da Loja</label>
                <div className="relative h-32 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl overflow-hidden border border-[#1A1A1A]">
                  {form.banner_url && <img src={form.banner_url} alt="Banner" className="w-full h-full object-cover" />}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer hover:bg-black/70 transition-colors">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner_url')} className="hidden" />
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/80 rounded-lg text-sm text-white">
                      {uploading.banner_url ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading.banner_url ? 'Enviando...' : 'Upload Banner'}
                    </div>
                  </label>
                </div>
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">Avatar da Loja</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-[#1A1A1A] overflow-hidden border-2 border-[#333]">
                    {form.avatar_url ? (
                      <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#555]">?</div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar_url')} className="hidden" />
                    <div className="flex items-center gap-2 px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-sm text-[#555] hover:text-white transition-colors">
                      {uploading.avatar_url ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading.avatar_url ? 'Enviando...' : 'Upload Avatar'}
                    </div>
                  </label>
                </div>
              </div>

              {/* Nome da Loja */}
              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">Nome da Loja *</label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  placeholder="Ex: DevCreative Studio"
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">Descrição da Loja</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Fale sobre sua especialidade, sua experiência..."
                  className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white resize-none focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Localização */}
              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">Localização</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ex: São Paulo, Brasil"
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                />
              </div>

              {/* Website */}
              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://seusite.com"
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                />
              </div>

              {/* Redes Sociais */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-[#555] block">Redes Sociais</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-500" />
                    <input
                      type="text"
                      value={form.social_links.instagram}
                      onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, instagram: e.target.value } })}
                      placeholder="@usuario"
                      className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-white" />
                    <input
                      type="text"
                      value={form.social_links.github}
                      onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, github: e.target.value } })}
                      placeholder="github.com/usuario"
                      className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-blue-500" />
                    <input
                      type="text"
                      value={form.social_links.linkedin}
                      onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })}
                      placeholder="linkedin.com/in/usuario"
                      className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-white text-black hover:bg-white/90 font-semibold h-12 mt-4"
              >
                {loading ? 'Criando...' : 'Criar Loja'}
              </Button>
            </div>
          </div>

          {/* Coluna da Direita - Prévia do Perfil */}
          <div className={`transition-all duration-300 ${!previewMode ? 'opacity-50' : ''}`}>
            <div className="sticky top-8">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#1A1A1A] bg-black/50">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Prévia da Loja
                  </h3>
                  <p className="text-xs text-[#555]">Veja como sua loja vai aparecer para os clientes</p>
                </div>

                <div className="p-4">
                  {/* Banner Preview */}
                  <div className="h-32 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl overflow-hidden mb-4">
                    {form.banner_url && <img src={form.banner_url} alt="Banner" className="w-full h-full object-cover" />}
                  </div>

                  {/* Avatar Preview */}
                  <div className="flex items-center gap-4 -mt-10 mb-4">
                    <div className="w-20 h-20 rounded-full border-4 border-black overflow-hidden bg-[#1A1A1A]">
                      {form.avatar_url ? (
                        <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#555]">?</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white">{form.display_name || 'Nome da Loja'}</h4>
                      {form.location && (
                        <div className="flex items-center gap-1 text-xs text-[#555] mt-1">
                          <MapPin className="h-3 w-3" /> {form.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Preview */}
                  {form.bio && (
                    <div className="mb-4">
                      <p className="text-sm text-[#555]">{form.bio}</p>
                    </div>
                  )}

                  {/* Website Preview */}
                  {form.website && (
                    <div className="mb-3">
                      <a href="#" className="flex items-center gap-1 text-xs text-[#555] hover:text-white">
                        <Globe className="h-3 w-3" /> {form.website}
                      </a>
                    </div>
                  )}

                  {/* Social Links Preview */}
                  {(form.social_links.instagram || form.social_links.github || form.social_links.linkedin) && (
                    <div className="flex gap-3 pt-2 border-t border-[#1A1A1A]">
                      {form.social_links.instagram && <Instagram className="h-4 w-4 text-pink-500" />}
                      {form.social_links.github && <Github className="h-4 w-4 text-white" />}
                      {form.social_links.linkedin && <Linkedin className="h-4 w-4 text-blue-500" />}
                    </div>
                  )}

                  {/* Placeholder para stats */}
                  <div className="flex gap-4 mt-4 pt-3 border-t border-[#1A1A1A]">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">0</div>
                      <div className="text-[10px] text-[#555]">Assets</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">0</div>
                      <div className="text-[10px] text-[#555]">Vendas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}