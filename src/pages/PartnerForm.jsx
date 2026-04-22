// src/pages/PartnerForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { Send, ChevronRight, ChevronLeft, User, Mail, MessageCircle, Phone, Link2, Briefcase, Target, Instagram, Github, Linkedin, Languages, Code2, Globe, Clock, CheckCircle } from 'lucide-react';
import logoImage from '@/assets/images/Logo.png';

// Importe suas imagens aqui
import devRegisterBg1 from '@/assets/images/DevRegister.png';
import devRegisterBg2 from '@/assets/images/DevRegister2.png';
import devRegisterBg3 from '@/assets/images/DevRegister3.png';
import devRegisterBg4 from '@/assets/images/DevRegister4.png';

export default function PartnerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    discord_nick: '',
    telefone: '',
    portfolio_url: '',
    experiencia: '',
    motivo: '',
    entrou_discord: '',
    plano_contribuicao: '',
    redes_sociais: { instagram: '', github: '', linkedin: '' },
    disponibilidade: '',
    idiomas: '',
    tipo_asset: '',
    plataformas: '',
    ja_vendeu: '',
    disponibilidade_reunioes: '',
    aceita_regras: ''
  });

  // Slideshow state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const images = [devRegisterBg1, devRegisterBg2, devRegisterBg3, devRegisterBg4];
  
  const quotes = [
    { text: "A plataforma com os melhores assets e sistemas do mercado. Qualidade impecável.", author: "— Dev Community" },
    { text: "Encontre tudo que você precisa para seus projetos em um só lugar.", author: "— Dev Systems" },
    { text: "Mais de 500 desenvolvedores já confiam na nossa plataforma.", author: "— Comunidade Dev" },
    { text: "Scripts profissionais e sistemas completos para produção imediata.", author: "— Dev Team" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  const pages = [
    { title: "Identidade", description: "Estabeleça sua presença criativa" },
    { title: "Trajetória", description: "Sua experiência profissional" },
    { title: "Redes", description: "Pontos de conexão social" },
    { title: "Stack", description: "Capacidades técnicas" },
    { title: "Finalização", description: "Últimas informações" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Se for campo de redes sociais, trata separadamente
    if (name === 'instagram' || name === 'github' || name === 'linkedin') {
      setForm(prev => ({
        ...prev,
        redes_sociais: { ...prev.redes_sociais, [name]: value }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const nextPage = () => {
    // Validação apenas dos campos obrigatórios da primeira página
    if (currentPage === 0 && (!form.nome || !form.email || !form.discord_nick)) {
      toast.error('Preencha Nome, Email e Discord');
      return;
    }
    // Removeu a validação do aceita_regras
    setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Removeu a validação do aceita_regras - agora só verifica se tem nome
    if (!form.nome) {
      toast.error('Preencha os dados corretamente');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('creator_applications').insert({
        nome: form.nome,
        email: form.email,
        discord_nick: form.discord_nick,
        telefone: form.telefone,
        portfolio_url: form.portfolio_url,
        experiencia: form.experiencia,
        motivo: form.motivo,
        entrou_discord: form.entrou_discord,
        plano_contribuicao: form.plano_contribuicao,
        redes_sociais: form.redes_sociais,
        disponibilidade: form.disponibilidade,
        idiomas: form.idiomas,
        tipo_asset: form.tipo_asset,
        plataformas: form.plataformas,
        ja_vendeu: form.ja_vendeu,
        disponibilidade_reunioes: form.disponibilidade_reunioes,
        aceita_regras: form.aceita_regras,
        status: 'pending',
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      toast.success('Inscrição enviada! Entraremos em contato em breve.');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar inscrição');
    } finally {
      setLoading(false);
    }
  };

  const focusProps = (name) => ({
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null),
  });

  const goToImage = (index) => {
    if (index === currentImageIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  const currentPageTitle = pages[currentPage].title;
  const currentPageDescription = pages[currentPage].description;

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex">
        
        {/* LEFT SIDE - FORMULÁRIO */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-black">
          
          {/* Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity mb-8"
          >
            <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
              {!logoLoadError ? (
                <img
                  src={logoImage}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={() => setLogoLoadError(true)}
                />
              ) : (
                <span className="text-white font-black text-sm">DA</span>
              )}
            </div>
            <span className="text-white font-bold text-lg tracking-tight">DevAssets</span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Formulário de Inscrição</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Torne-se um criador oficial da DevAssets
            </p>
          </div>

          {/* Título da página atual */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-white">{currentPageTitle}</h2>
            <p className="text-xs text-muted-foreground mt-1">{currentPageDescription}</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            
            {/* PAGE 0 - IDENTIDADE */}
            {currentPage === 0 && (
              <>
                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'nome' ? 'text-white' : 'text-muted-foreground'}`}>
                    Nome Completo
                  </label>
                  <input type="text" name="nome" value={form.nome} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('nome')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'email' ? 'text-white' : 'text-muted-foreground'}`}>
                    E-mail
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('email')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'discord' ? 'text-white' : 'text-muted-foreground'}`}>
                    Discord
                  </label>
                  <input type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                    placeholder="usuário#0000"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('discord')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'telefone' ? 'text-white' : 'text-muted-foreground'}`}>
                    WhatsApp
                  </label>
                  <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('telefone')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'portfolio' ? 'text-white' : 'text-muted-foreground'}`}>
                    Portfólio / GitHub
                  </label>
                  <input type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('portfolio')} />
                </div>
              </>
            )}

            {/* PAGE 1 - TRAJETÓRIA */}
            {currentPage === 1 && (
              <>
                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'experiencia' ? 'text-white' : 'text-muted-foreground'}`}>
                    Experiência na área
                  </label>
                  <textarea name="experiencia" rows={5} value={form.experiencia} onChange={handleChange}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all resize-none"
                    {...focusProps('experiencia')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'motivo' ? 'text-white' : 'text-muted-foreground'}`}>
                    Por que você quer ser um criador?
                  </label>
                  <textarea name="motivo" rows={5} value={form.motivo} onChange={handleChange}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all resize-none"
                    {...focusProps('motivo')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'plano' ? 'text-white' : 'text-muted-foreground'}`}>
                    Plano de Contribuição
                  </label>
                  <textarea name="plano_contribuicao" rows={4} value={form.plano_contribuicao} onChange={handleChange}
                    placeholder="Quantos assets planeja criar por mês?"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all resize-none"
                    {...focusProps('plano')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'entrou_discord' ? 'text-white' : 'text-muted-foreground'}`}>
                    Já entrou no Discord da DevAssets?
                  </label>
                  <input type="text" name="entrou_discord" value={form.entrou_discord} onChange={handleChange}
                    placeholder="Ex: Sim, já entrei / Não, ainda não"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('entrou_discord')} />
                </div>
              </>
            )}

            {/* PAGE 2 - REDES */}
            {currentPage === 2 && (
              <>
                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'instagram' ? 'text-white' : 'text-muted-foreground'}`}>
                    Instagram
                  </label>
                  <input type="text" name="instagram" value={form.redes_sociais.instagram} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('instagram')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'github' ? 'text-white' : 'text-muted-foreground'}`}>
                    GitHub
                  </label>
                  <input type="text" name="github" value={form.redes_sociais.github} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('github')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'linkedin' ? 'text-white' : 'text-muted-foreground'}`}>
                    LinkedIn
                  </label>
                  <input type="text" name="linkedin" value={form.redes_sociais.linkedin} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('linkedin')} />
                </div>
              </>
            )}

            {/* PAGE 3 - STACK */}
            {currentPage === 3 && (
              <div className="space-y-6">
                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'idiomas' ? 'text-white' : 'text-muted-foreground'}`}>
                    Idiomas
                  </label>
                  <input type="text" name="idiomas" value={form.idiomas} onChange={handleChange}
                    placeholder="Ex: Português, Inglês, Espanhol"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('idiomas')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'tipo_asset' ? 'text-white' : 'text-muted-foreground'}`}>
                    Tipos de Asset
                  </label>
                  <input type="text" name="tipo_asset" value={form.tipo_asset} onChange={handleChange}
                    placeholder="Ex: Scripts, Sistemas, UI Kits, Plugins, Templates"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('tipo_asset')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'plataformas' ? 'text-white' : 'text-muted-foreground'}`}>
                    Plataformas
                  </label>
                  <input type="text" name="plataformas" value={form.plataformas} onChange={handleChange}
                    placeholder="Ex: Unity, Unreal Engine, React, Node.js, Python"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('plataformas')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'disponibilidade' ? 'text-white' : 'text-muted-foreground'}`}>
                    Disponibilidade semanal
                  </label>
                  <input type="text" name="disponibilidade" value={form.disponibilidade} onChange={handleChange}
                    placeholder="Ex: 10–15 horas por semana"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('disponibilidade')} />
                </div>
              </div>
            )}

            {/* PAGE 4 - FINALIZAÇÃO */}
            {currentPage === 4 && (
              <div className="space-y-5">
                <div className="bg-secondary border border-border rounded-lg p-4 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Resumo</p>
                  {[
                    { label: 'Nome', value: form.nome },
                    { label: 'Email', value: form.email },
                    { label: 'Discord', value: form.discord_nick },
                    { label: 'Assets', value: form.tipo_asset },
                  ].filter(r => r.value).map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'ja_vendeu' ? 'text-white' : 'text-muted-foreground'}`}>
                    Já vendeu assets antes?
                  </label>
                  <input type="text" name="ja_vendeu" value={form.ja_vendeu} onChange={handleChange}
                    placeholder="Ex: Sim, já vendi / Não, é minha primeira vez"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('ja_vendeu')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'disponibilidade_reunioes' ? 'text-white' : 'text-muted-foreground'}`}>
                    Disponibilidade para reuniões
                  </label>
                  <input type="text" name="disponibilidade_reunioes" value={form.disponibilidade_reunioes} onChange={handleChange}
                    placeholder="Ex: Sim, tenho disponibilidade / Apenas em horários específicos"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('disponibilidade_reunioes')} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1 block ${focusedField === 'aceita_regras' ? 'text-white' : 'text-muted-foreground'}`}>
                    Li e concordo com as regras e termos
                  </label>
                  <input type="text" name="aceita_regras" value={form.aceita_regras} onChange={handleChange}
                    placeholder="Ex: Sim, concordo / Li e aceito os termos"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    {...focusProps('aceita_regras')} />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 pt-4">
              {currentPage > 0 && (
                <button type="button" onClick={prevPage}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </button>
              )}
              <div className="flex-1" />
              {currentPage < pages.length - 1 ? (
                <button type="button" onClick={nextPage}
                  className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors flex items-center gap-2">
                  Continuar <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 disabled:opacity-50 transition-colors flex items-center gap-2">
                  {loading ? 'Enviando...' : <><Send className="w-4 h-4" /> Enviar</>}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - IMAGE SLIDESHOW */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt="Developer workspace"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/60 to-black" />
          
          <div className={`absolute inset-0 flex flex-col justify-end p-12 transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}>
            <blockquote className="space-y-3">
              <p className="text-lg font-semibold text-white leading-relaxed">
                "{quotes[currentImageIndex].text}"
              </p>
              <footer className="text-sm text-muted-foreground">{quotes[currentImageIndex].author}</footer>
            </blockquote>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentImageIndex === index 
                    ? 'bg-white w-6' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-black border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} DevAssets. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}