// src/pages/CreatorSettings.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } Link } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Loader2, Instagram, Github, Linkedin, Twitter, Globe, MapPin, Info, User, Image as ImageIcon, Save, Menu, Image, Settings, Store, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('info');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
    banner_url: '',
    location: '',
    website: '',
    social_links: { instagram: '', github: '', linkedin: '', twitter: '' }
  });

  const navItems = [
    { id: 'info', label: 'Informações', icon: Info, description: 'Dados da sua loja' },
    { id: 'images', label: 'Mídia', icon: ImageIcon, description: 'Avatar e banner' },
    { id: 'social', label: 'Redes Sociais', icon: Settings, description: 'Conecte-se' },
  ];

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

      const { data: profileData, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (profileData.user_id !== user.id) {
        toast.error('Você não tem permissão para editar esta loja');
        navigate(`/creator/${id}`);
        return;
      }

      setProfile(profileData);
      setForm({
        display_name: profileData.display_name || '',
        bio: profileData.bio || '',
        avatar_url: profileData.avatar_url || '',
        banner_url: profileData.banner_url || '',
        location: profileData.location || '',
        website: profileData.website || '',
        social_links: profileData.social_links || { instagram: '', github: '', linkedin: '', twitter: '' }
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
      
      <div className="flex-1 flex">
        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar fixa */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] z-40 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Store className="h-5 w-5 text-white" />
              <h2 className="text-lg font-bold text-white">Configurações</h2>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-white text-black'
                        : 'text-[#555] hover:text-white hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-[10px] opacity-70">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden p-4 border-b border-[#1A1A1A] bg-black sticky top-16 z-10">
            <button onClick={() => setSidebarOpen(true)} className="text-[#555] hover:text-white">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Conteúdo principal */}
          <div className="py-8 px-4 md:px-8">
            
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate(`/creator/${id}`)}
                className="flex items-center gap-2 text-[#555] hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar para a loja
              </button>
              
              <h1 className="text-3xl font-bold text-white">Configurações da Loja</h1>
              <p className="text-sm text-[#555] mt-2">Personalize as informações da sua loja</p>
            </div>

            {/* ============================================================ */}
            {/* ABA: INFORMAÇÕES */}
            {/* ============================================================ */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* Card de boas práticas */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-medium">Por que preencher essas informações?</p>
                      <p className="text-xs text-blue-400/80 mt-1">
                        Uma loja completa e bem descrita passa mais confiança para seus clientes e ajuda na 
                        busca dos seus assets dentro da plataforma.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nome da Loja */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Nome da Loja</label>
                  <p className="text-xs text-[#555] mb-3">
                    Este é o nome que aparecerá no topo da sua loja e nos cards dos seus assets.
                  </p>
                  <input
                    type="text"
                    value={form.display_name}
                    onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                    className="w-full h-12 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="Ex: DevCreative Studio"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Descrição da Loja</label>
                  <p className="text-xs text-[#555] mb-3">
                    Conte aos clientes sobre sua especialidade, sua experiência e o que torna sua loja única.
                    Uma boa descrição pode aumentar suas vendas em até 30%.
                  </p>
                  <textarea
                    rows={6}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-[#1A1A1A] rounded-lg text-white resize-none focus:outline-none focus:border-white transition-colors"
                    placeholder="Ex: Sou desenvolvedor há 5 anos, especializado em sistemas para Unity e Unreal Engine. Meus assets são testados e documentados..."
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-[10px] text-[#555]">Dica: Use palavras-chave relevantes para seus assets</p>
                    <p className="text-[10px] text-[#555]">{form.bio.length}/500 caracteres</p>
                  </div>
                </div>

                {/* Localização */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Localização</label>
                  <p className="text-xs text-[#555] mb-3">
                    Sua localização ajuda a construir confiança com clientes da sua região.
                  </p>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full h-12 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="Ex: São Paulo, Brasil"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Website / Portfólio</label>
                  <p className="text-xs text-[#555] mb-3">
                    Compartilhe seu portfólio ou site pessoal. Clientes podem ver mais do seu trabalho.
                  </p>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full h-12 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="https://seusite.com"
                  />
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* ABA: MÍDIA */}
            {/* ============================================================ */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                {/* Dica de imagens */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <ImageIcon className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-medium">Dicas para suas imagens</p>
                      <p className="text-xs text-purple-400/80 mt-1">
                        Imagens de qualidade profissional aumentam a credibilidade da sua loja.
                        Use fotos nítidas e bem iluminadas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Avatar da Loja</label>
                  <p className="text-xs text-[#555] mb-3">
                    Sua logo ou foto de perfil. Aparece ao lado do nome da sua loja e nos cards dos produtos.
                    Tamanho recomendado: 400x400 pixels.
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-[#1A1A1A] overflow-hidden border-2 border-[#333]">
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
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Banner da Loja</label>
                  <p className="text-xs text-[#555] mb-3">
                    Imagem de capa da sua loja. Aparece no topo da página da sua loja.
                    Tamanho recomendado: 1200x300 pixels.
                  </p>
                  <div className="space-y-3">
                    <div className="h-36 bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#1A1A1A]">
                      {form.banner_url ? (
                        <img src={form.banner_url} alt="Banner" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#555] text-sm">Nenhum banner adicionado</div>
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

                {/* Preview simples */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
                  <p className="text-xs text-[#555] text-center">
                    💡 As imagens serão exibidas na sua loja e nos cards dos seus produtos.
                  </p>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* ABA: REDES SOCIAIS */}
            {/* ============================================================ */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                {/* Benefícios */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-medium">Por que adicionar redes sociais?</p>
                      <p className="text-xs text-green-400/80 mt-1">
                        Conectar suas redes sociais ajuda a construir uma comunidade em volta da sua marca
                        e permite que clientes acompanhem seu trabalho.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instagram */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-500" /> Instagram
                  </label>
                  <p className="text-xs text-[#555] mb-3">
                    Compartilhe seu perfil do Instagram para mostrar seu trabalho e processos criativos.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#555]">instagram.com/</span>
                    <input
                      type="text"
                      value={form.social_links.instagram || ''}
                      onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, instagram: e.target.value } })}
                      placeholder="seuusuario"
                      className="flex-1 h-11 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                    <Github className="h-4 w-4 text-white" /> GitHub
                  </label>
                  <p className="text-xs text-[#555] mb-3">
                    Mostre seu portfólio de código e projetos open-source.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#555]">github.com/</span>
                    <input
                      type="text"
                      value={form.social_links.github || ''}
                      onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, github: e.target.value } })}
                      placeholder="seuusuario"
                      className="flex-1 h-11 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-blue-500" /> LinkedIn
                  </label>
                  <p className="text-xs text-[#555] mb-3">
                    Conecte-se profissionalmente e mostre sua trajetória.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#555]">linkedin.com/in/</span>
                    <input
                      type="text"
                      value={form.social_links.linkedin || ''}
                      onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })}
                      placeholder="seuusuario"
                      className="flex-1 h-11 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Twitter */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-blue-400" /> Twitter / X
                  </label>
                  <p className="text-xs text-[#555] mb-3">
                    Compartilhe novidades e interaja com a comunidade.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#555]">twitter.com/</span>
                    <input
                      type="text"
                      value={form.social_links.twitter || ''}
                      onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, twitter: e.target.value } })}
                      placeholder="@seuusuario"
                      className="flex-1 h-11 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-yellow-400/80">
                        As redes sociais são opcionais, mas recomendamos preencher para aumentar sua credibilidade.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botão Salvar */}
            <div className="mt-10 pt-6 border-t border-[#1A1A1A]">
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {loading ? 'Salvando...' : 'Salvar todas as configurações'}
                </button>
                <button
                  onClick={() => navigate(`/creator/${id}`)}
                  className="px-6 py-3 bg-[#1A1A1A] text-white rounded-lg font-semibold hover:bg-[#2A2A2A] transition-colors"
                >
                  Cancelar
                </button>
              </div>
              <p className="text-[10px] text-[#555] text-center mt-4">
                Todas as alterações serão aplicadas imediatamente após salvar.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}