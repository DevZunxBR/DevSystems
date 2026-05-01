// src/pages/CreatorSetup.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Loader2, Lock, Shield, ArrowLeft, Instagram, Github, Linkedin } from 'lucide-react';
import logoImage from '@/assets/images/Logo.png';

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
  const [logoLoadError, setLogoLoadError] = useState(false);
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
    <div className="min-h-screen flex">

      {/* LADO ESQUERDO - FORMULÁRIO */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-black">

        <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity mb-8">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
            {!logoLoadError ? (
              <img src={logoImage} alt="Logo" className="w-full h-full object-contain" onError={() => setLogoLoadError(true)} />
            ) : (
              <span className="text-white font-black text-sm">DA</span>
            )}
          </div>
          <span className="text-white font-bold text-lg tracking-tight">DevAssets</span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Criar Loja de Criador</h1>
          <p className="text-sm text-muted-foreground mt-2">Configure sua loja e comece a vender seus assets</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-white">Informações da Loja</h2>
          <p className="text-xs text-muted-foreground mt-1">Preencha os dados abaixo para criar sua loja</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          
          {/* Banner */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Banner da Loja</label>
            <div className="relative h-28 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg overflow-hidden border border-border">
              {form.banner_url && <img src={form.banner_url} alt="Banner" className="w-full h-full object-cover" />}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer hover:bg-black/70 transition-colors">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner_url')} className="hidden" />
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 rounded-lg text-xs text-white">
                  {uploading.banner_url ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  {uploading.banner_url ? 'Enviando...' : 'Upload Banner'}
                </div>
              </label>
            </div>
          </div>

          {/* Avatar */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Avatar da Loja</label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-secondary overflow-hidden border border-border">
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">?</div>
                )}
              </div>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar_url')} className="hidden" />
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs text-muted-foreground hover:text-white transition-colors">
                  {uploading.avatar_url ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  {uploading.avatar_url ? 'Enviando...' : 'Upload Avatar'}
                </div>
              </label>
            </div>
          </div>

          {/* Nome da Loja */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome da Loja *</label>
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              placeholder="Ex: DevCreative Studio"
              className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Descrição da Loja</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Fale sobre sua especialidade, sua experiência..."
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white resize-none"
            />
          </div>

          {/* Localização */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Localização</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Ex: São Paulo, Brasil"
              className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          {/* Website */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://seusite.com"
              className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          {/* Redes Sociais */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground block">Redes Sociais</label>
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-pink-500 flex-shrink-0" />
              <input
                type="text"
                value={form.social_links.instagram}
                onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, instagram: e.target.value } })}
                placeholder="@usuario"
                className="flex-1 h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-white flex-shrink-0" />
              <input
                type="text"
                value={form.social_links.github}
                onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, github: e.target.value } })}
                placeholder="github.com/usuario"
                className="flex-1 h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <input
                type="text"
                value={form.social_links.linkedin}
                onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })}
                placeholder="linkedin.com/in/usuario"
                className="flex-1 h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-white/90 font-semibold h-11 mt-4"
          >
            {loading ? 'Criando...' : 'Criar Loja'}
          </Button>
        </form>
      </div>

      {/* LADO DIREITO - APENAS FUNDO PRETO (SEM NADA) */}
      <div className="hidden lg:block w-1/2 bg-black" />
      
    </div>
  );
}