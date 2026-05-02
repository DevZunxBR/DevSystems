// src/pages/PartnerForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { Send, ChevronRight, ChevronLeft } from 'lucide-react';
import logoImage from '@/assets/images/Logo.png';
import devRegisterBg1 from '@/assets/images/DevParceiro.png';
import Header from '@/components/layout/Header'; // Adicione
import Footer from '@/components/layout/Footer'; // Adicione

export default function PartnerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  // Comentários que vão passar em loop
  const quotes = [
    { text: "Ao se tornar um Criador DevAssets, você ganha 87% do valor de cada venda. Apenas 13% são destinados à manutenção e evolução da plataforma.", author: "— DevAssets Creators" },
    { text: "Como parceiro, você recebe o pagamento de cada produto vendido em até 10 horas após a confirmação da venda.", author: "— DevAssets Creators" },
    { text: "Ao se tornar criador, cada asset seu recebe uma licença gratuita e exclusiva para proteger seus direitos autorais e seu trabalho.", author: "— DevAssets Creators" },
    { text: "Seus assets ganham visibilidade na plataforma, com suporte prioritário para impulsionar seus projetos e sua marca.", author: "— DevAssets Creators" },
    { text: "Você ganha atendimento prioritário e suporte dedicado desde a publicação até a gestão dos seus assets.", author: "— DevAssets Creators" },
    { text: "Todo criador DevAssets ganha a oportunidade de se destacar e construir sua própria marca no mercado.", author: "— DevAssets Creators" },
  ];

  // Loop dos comentários a cada 5 segundos
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

  // 6 PÁGINAS (0 a 5)
  const pages = [
    { title: "Bem-vindo", description: "Programa de Criadores DevAssets" },
    { title: "Identidade", description: "Estabeleça sua presença criativa" },
    { title: "Trajetória", description: "Sua experiência profissional" },
    { title: "Redes", description: "Pontos de conexão social" },
    { title: "Stack", description: "Capacidades técnicas" },
    { title: "Finalização", description: "Revise e envie sua candidatura" },
  ];

  const LAST_PAGE = pages.length - 1;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'instagram' || name === 'github' || name === 'linkedin') {
      setForm(prev => ({
        ...prev,
        redes_sociais: { ...prev.redes_sociais, [name]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextPage = (e) => {
    e.preventDefault();
    
    if (currentPage === 1 && (!form.nome || !form.email || !form.discord_nick)) {
      toast.error('Preencha Nome, Email e Discord');
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
    if (currentPage !== LAST_PAGE) return;
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
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
            <h1 className="text-3xl font-black text-white tracking-tight">Formulário de Inscrição</h1>
            <p className="text-sm text-muted-foreground mt-2">Torne-se um criador oficial da DevAssets</p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold text-white">{pages[currentPage].title}</h2>
            <p className="text-xs text-muted-foreground mt-1">{pages[currentPage].description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* PÁGINA 0 - BOAS-VINDAS */}
            {currentPage === 0 && (
              <div className="space-y-4 text-muted-foreground">
                <p className="text-sm leading-relaxed">
                  O Programa de Criadores DevAssets foi criado para desenvolvedores talentosos que desejam 
                  monetizar seus assets e sistemas.
                </p>
                <p className="text-sm leading-relaxed">
                  <span className="text-white font-medium">Ganhe 87% de comissão</span> sobre cada venda realizada.
                </p>
                <p className="text-sm leading-relaxed">
                  <span className="text-white font-medium">Destaque seus assets</span> com visibilidade garantida na plataforma.
                </p>
                <p className="text-sm leading-relaxed">
                  <span className="text-white font-medium">Suporte prioritário e dedicado</span> para criadores em todas as etapas.
                </p>
                <p className="text-sm leading-relaxed">
                  <span className="text-white font-medium">Todo criador DevAssets</span> tem a oportunidade de construir sua própria marca e se destacar no mercado.
                </p>
                <div className="pt-4">
                  <p className="text-xs text-center text-muted-foreground border-t border-border pt-4">
                    Atenção E Obrigatorio Entrar No Servidor do Discord O processo leva cerca de 5 minutos. Suas informações serão analisadas pela nossa equipe.
                  </p>
                </div>
              </div>
            )}

            {/* PÁGINA 1 - IDENTIDADE */}
            {currentPage === 1 && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome Completo</label>
                  <input type="text" name="nome" value={form.nome} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">E-mail</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Discord</label>
                  <input type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                    placeholder="usuário#0000"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Portfólio / GitHub</label>
                  <input type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white" />
                </div>
              </>
            )}

            {/* PÁGINA 2 - TRAJETÓRIA */}
            {currentPage === 2 && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Experiência na área</label>
                  <textarea name="experiencia" rows={5} value={form.experiencia} onChange={handleChange}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white resize-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Por que quer ser um criador?</label>
                  <textarea name="motivo" rows={5} value={form.motivo} onChange={handleChange}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white resize-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Plano de Contribuição</label>
                  <textarea name="plano_contribuicao" rows={4} value={form.plano_contribuicao} onChange={handleChange}
                    placeholder="Quantos assets planeja criar por mês?"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white resize-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Já entrou no Discord da DevAssets?</label>
                  <input type="text" name="entrou_discord" value={form.entrou_discord} onChange={handleChange}
                    placeholder="Sim / Não"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white" />
                </div>
              </>
            )}

            {/* PÁGINA 3 - REDES */}
            {currentPage === 3 && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram</label>
                  <input type="text" name="instagram" value={form.redes_sociais.instagram} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">GitHub</label>
                  <input type="text" name="github" value={form.redes_sociais.github} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">LinkedIn</label>
                  <input type="text" name="linkedin" value={form.redes_sociais.linkedin} onChange={handleChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                </div>
              </>
            )}

            {/* PÁGINA 4 - STACK */}
            {currentPage === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Idiomas</label>
                  <input type="text" name="idiomas" value={form.idiomas} onChange={handleChange}
                    placeholder="Ex: Português, Inglês, Espanhol"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Tipos de Asset</label>
                  <input type="text" name="tipo_asset" value={form.tipo_asset} onChange={handleChange}
                    placeholder="Ex: Scripts, Sistemas, UI Kits"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Plataformas</label>
                  <input type="text" name="plataformas" value={form.plataformas} onChange={handleChange}
                    placeholder="Ex: Unity, React, Node.js"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Disponibilidade</label>
                  <input type="text" name="disponibilidade" value={form.disponibilidade} onChange={handleChange}
                    placeholder="Ex: 10-15 horas por semana"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                </div>
              </div>
            )}

            {/* PÁGINA 5 - FINALIZAÇÃO */}
            {currentPage === 5 && (
              <div className="space-y-5">
                <div className="bg-secondary border border-border rounded-lg p-4 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Resumo da Candidatura</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nome</span>
                    <span className="text-white">{form.nome || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-white">{form.email || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discord</span>
                    <span className="text-white">{form.discord_nick || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Assets</span>
                    <span className="text-white">{form.tipo_asset || '-'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Já vendeu assets antes?</label>
                  <input type="text" name="ja_vendeu" value={form.ja_vendeu} onChange={handleChange}
                    placeholder="Sim / Não"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Disponibilidade para reuniões</label>
                  <input type="text" name="disponibilidade_reunioes" value={form.disponibilidade_reunioes} onChange={handleChange}
                    placeholder="Sim / Não"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Li e concordo com as regras</label>
                  <input type="text" name="aceita_regras" value={form.aceita_regras} onChange={handleChange}
                    placeholder="Sim, concordo"
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground" />
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
                  {loading ? 'Enviando...' : <><Send className="w-4 h-4" /> Enviar Inscrição</>}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LADO DIREITO - 1 IMAGEM FIXA + COMENTÁRIOS EM LOOP */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden bg-black">
          <img
            src={devRegisterBg1}
            alt="Developer workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/60 to-black" />
          
          {/* Comentários em loop com fade */}
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

      <Footer />
    </div>
  );
}