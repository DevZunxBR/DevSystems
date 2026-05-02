// src/pages/CreatorSettings.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Loader2, Instagram, Github, Linkedin, Twitter, Globe, MapPin, Info, User, Image as ImageIcon, Save } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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

export default function CreatorSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/register');
        return;
      }

      const { data: profile, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Verificar se é o dono
      if (profile.user_id !== user.id) {
        toast.error('Você não tem permissão para editar esta loja');
        navigate(`/creator/${id}`);
        return;
      }

      setForm({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        banner_url: profile.banner_url || '',
        location: profile.location || '',
        website: profile.website || '',
        social_links: profile.social_links || { instagram: '', github: '', linkedin: '', twitter: '' }
      });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar perfil');
      navigate(`/creator/${id}`);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, 'creators');
      setForm(prev => ({ ...prev, [field]: url }));
      toast.success(`${field === 'avatar_url' ? 'Avatar' : 'Banner'} atualizado!`);
    } catch (error) {
      toast.error('Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.display_name) {
      toast.error('Nome da loja é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('creator_profiles')
        .update({
          display_name: form.display_name,
          bio: form.bio,
          avatar_url: form.avatar_url,
          banner_url: form.banner_url,
          location: form.location,
          website: form.website,
          social_links: form.social_links
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Configurações salvas!');
      navigate(`/creator/${id}`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <div className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        
        {/* Header da página */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/creator/${id}`)}
            className="flex items-center gap-2 text-[#555] hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para a loja
          </button>
          
          <h1 className="text-3xl font-bold text-white">Configurações da Loja</h1>
          <p className="text-sm text-[#555] mt-2">Personalize sua loja e suas informações</p>
        </div>

        {/* Formulário de configurações */}
        <div className="space-y-6">
          
          {/* Avatar */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
            <label className="text-sm font-medium text-white mb-4 flex items-center gap-2">
              <User className="h-4 w-4" /> Avatar da Loja
            </label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[#1A1A1A] overflow-hidden">
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#555] text-2xl">?</div>
                )}
              </div>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar_url')} className="hidden" />
                <div className="flex items-center gap-2 px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-sm text-[#555] hover:text-white transition-colors">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Enviando...' : 'Alterar Avatar'}
                </div>
              </label>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
            <label className="text-sm font-medium text-white mb-4 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Banner da Loja
            </label>
            <div className="space-y-3">
              <div className="h-32 bg-[#1A1A1A] rounded-lg overflow-hidden">
                {form.banner_url ? (
                  <img src={form.banner_url} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#555] text-sm">Nenhum banner</div>
                )}
              </div>
              <label className="cursor-pointer inline-block">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner_url')} className="hidden" />
                <div className="flex items-center gap-2 px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-sm text-[#555] hover:text-white transition-colors">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Enviando...' : 'Alterar Banner'}
                </div>
              </label>
            </div>
          </div>

          {/* Informações da Loja */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Informações da Loja</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#555] block mb-1">Nome da Loja *</label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#555] block mb-1 flex items-center gap-1">
                  <Info className="h-3 w-3" /> Descrição
                </label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white resize-none"
                  placeholder="Conte sobre sua loja, sua especialidade..."
                />
              </div>
              <div>
                <label className="text-xs text-[#555] block mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Localização
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ex: São Paulo, Brasil"
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#555] block mb-1 flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Website
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://seusite.com"
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Redes Sociais</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-pink-500" />
                <input
                  type="text"
                  value={form.social_links.instagram || ''}
                  onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, instagram: e.target.value } })}
                  placeholder="@seuinstagram"
                  className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <Github className="h-5 w-5 text-white" />
                <input
                  type="text"
                  value={form.social_links.github || ''}
                  onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, github: e.target.value } })}
                  placeholder="github.com/seuusuario"
                  className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="h-5 w-5 text-blue-500" />
                <input
                  type="text"
                  value={form.social_links.linkedin || ''}
                  onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })}
                  placeholder="linkedin.com/in/seuusuario"
                  className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <Twitter className="h-5 w-5 text-blue-400" />
                <input
                  type="text"
                  value={form.social_links.twitter || ''}
                  onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, twitter: e.target.value } })}
                  placeholder="@seutwitter"
                  className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </button>
            <button
              onClick={() => navigate(`/creator/${id}`)}
              className="px-6 py-3 bg-[#1A1A1A] text-white rounded-lg font-semibold hover:bg-[#2A2A2A] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}