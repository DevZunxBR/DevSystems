// src/pages/CreatorSetup.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Loader2, Lock, Shield, Instagram, Github, Linkedin, ChevronRight, ChevronLeft } from 'lucide-react';
import logoImage from '@/assets/images/Logo.png';
import devRegisterBg1 from '@/assets/images/DevParceiro.png';

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
  const [currentPage, setCurrentPage] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [form, setForm] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
    banner_url: '',
    location: '',
    website: '',
    social_links: { instagram: '', github: '', linkedin: '', twitter: '' }
  });

  const pages = [
    { title: "Como funciona", description: "O que você precisa para criar sua loja" },
    { title: "Identidade da Loja", description: "Nome e descrição da sua loja" },
    { title: "Mídia", description: "Avatar e banner da loja" },
    { title: "Contato", description: "Localização e redes sociais" },
    { title: "Finalização", description: "Revise e crie sua loja" },
  ];

  const LAST_PAGE = pages.length - 1;

  const quotes = [
    { text: "Sua loja e seus assets ganham visibilidade na plataforma, com suporte prioritário para impulsionar seus projetos.", author: "— DevAssets Creators" },
    { text: "Você ganha atendimento prioritário e suporte dedicado desde a publicação até a gestão dos seus assets.", author: "— DevAssets Creators" },
    { text: "Todo criador DevAssets tem a oportunidade de se destacar e construir sua própria marca no mercado.", author: "— DevAssets Creators" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsTransitioning(false);
      }, 500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const nextPage = (e) => {
    e.preventDefault();
    
    // VALIDAÇÕES POR PÁGINA
    if (currentPage === 1 && !form.display_name) {
      toast.error('Nome da loja é obrigatório');
      return;
    }
    
    if (currentPage === 2 && (!form.avatar_url || !form.banner_url)) {
      toast.error('Avatar e Banner da loja são obrigatórios');
      return;
    }
    
    if (currentPage === 3 && (!form.location || !form.website)) {
      toast.error('Localização e Website são obrigatórios');
      return;
    }
    
    if (currentPage < LAST_PAGE) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = (e) => {
    e.preventDefault();
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin mx-auto" />
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
    <div className="flex">
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
          <h2 className="text-xl font-bold text-white">{pages[currentPage].title}</h2>
          <p className="text-xs text-muted-foreground mt-1">{pages[currentPage].description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          
          {/* PÁGINA 0 - COMO FUNCIONA (SEM VALIDAÇÃO) */}
          {currentPage === 0 && (
            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm leading-relaxed">
                Tenha sua própria loja de assets dentro da DevAssets e comece a vender seus Assets 
              </p>
              <p className="text-sm leading-relaxed">
                <span className="text-white font-medium">Loja personalizada</span> com identidade visual única para destacar seus assets.
              </p>
              <p className="text-sm leading-relaxed">
                <span className="text-white font-medium">Visibilidade garantida</span> na plataforma.
              </p>
              <p className="text-sm leading-relaxed">
                <span className="text-white font-medium">Gestão completa dos seus produtos</span> adicione, edite ou remova assets quando quiser.
              </p>
              <div className="pt-4">
                <p className="text-xs text-center text-muted-foreground border-t border-border pt-4">
                  Após Criar Sua Loja, Você Pode Publicar Seus Assets E Começar A Vender Imediatamente.
                </p>
              </div>
            </div>
          )}

          {/* PÁGINA 1 - IDENTIDADE DA LOJA (Nome Obrigatório) */}
          {currentPage === 1 && (
            <>
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
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Descrição da Loja</label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Fale sobre sua especialidade, sua experiência..."
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white resize-none"
                />
              </div>
            </>
          )}

          {/* PÁGINA 2 - MÍDIA (Avatar e Banner Obrigatórios) */}
          {currentPage === 2 && (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Avatar da Loja *</label>
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
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Banner da Loja *</label>
                <div className="relative h-28 bg-neutral-800 rounded-lg overflow-hidden border border-border">
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
            </>
          )}

          {/* PÁGINA 3 - CONTATO (Localização e Website Obrigatórios - Redes Sociais Opcionais) */}
          {currentPage === 3 && (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Localização *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ex: São Paulo, Brasil"
                  className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Website *</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://seusite.com"
                  className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-medium text-muted-foreground block">Redes Sociais (Opcionais)</label>
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
            </>
          )}

          {/* PÁGINA 4 - FINALIZAÇÃO */}
          {currentPage === 4 && (
            <div className="space-y-4">
              <div className="bg-secondary border border-border rounded-lg p-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Resumo da Loja</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nome</span>
                  <span className="text-white">{form.display_name || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Website</span>
                  <span className="text-white">{form.website || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Localização</span>
                  <span className="text-white">{form.location || '-'}</span>
                </div>
                {form.avatar_url && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avatar</span>
                    <span className="text-green-400">✓ Enviado</span>
                  </div>
                )}
                {form.banner_url && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Banner</span>
                    <span className="text-green-400">✓ Enviado</span>
                  </div>
                )}
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-xs text-green-400 text-center">
                  ✓ Após criar sua loja, você poderá publicar seus assets e começar a vender!
                </p>
              </div>
            </div>
          )}

          {/* Botões de navegação */}
          <div className="flex items-center gap-3 pt-4">
            {currentPage > 0 && (
              <button type="button" onClick={prevPage} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
            )}
            <div className="flex-1" />
            {currentPage < LAST_PAGE ? (
              <button type="button" onClick={nextPage} className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 flex items-center gap-2">
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 disabled:opacity-50 flex items-center gap-2">
                {loading ? 'Criando...' : <><Upload className="h-4 w-4" /> Criar Loja</>}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LADO DIREITO - IMAGEM FIXA + COMENTÁRIOS EM LOOP */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-black">
        <img
          src={devRegisterBg1}
          alt="Developer workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/60 to-black" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <blockquote className="space-y-3">
              <p className="text-lg font-semibold text-white leading-relaxed">
                "{quotes[quoteIndex].text}"
              </p>
              <footer className="text-sm text-muted-foreground">{quotes[quoteIndex].author}</footer>
            </blockquote>
          </div>
        </div>
      </div>
      
    </div>
  );
}