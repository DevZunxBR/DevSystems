// src/pages/PartnerForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Send, ChevronRight, ChevronLeft, User, Mail, MessageCircle, Phone, Link2, Briefcase, Target, Instagram, Github, Linkedin, Languages, Code2, Globe, Clock, CheckCircle, MessageSquare, Home } from 'lucide-react';
import logoImage from '@/assets/images/Logo.png';

export default function PartnerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    discord_nick: '',
    telefone: '',
    portfolio_url: '',
    experiencia: '',
    motivo: '',
    entrou_discord: false,
    plano_contribuicao: '',
    redes_sociais: { instagram: '', github: '', linkedin: '' },
    disponibilidade: '',
    idiomas: [],
    tipo_asset: [],
    plataformas: [],
    ja_vendeu: false,
    disponibilidade_reunioes: false,
    aceita_regras: false
  });

  const pages = [
    { title: "Informações Pessoais", description: "Dados básicos para contato" },
    { title: "Experiência", description: "Conte-nos sobre sua trajetória" },
    { title: "Redes Sociais", description: "Onde podemos te encontrar" },
    { title: "Habilidades", description: "Tecnologias que você domina" },
    { title: "Finalização", description: "Últimas informações" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const nextPage = () => {
    if (currentPage === 0 && (!form.nome || !form.email || !form.discord_nick)) {
      toast.error('Preencha Nome, Email e Discord');
      return;
    }
    if (currentPage === 4 && !form.aceita_regras) {
      toast.error('Você precisa aceitar as regras');
      return;
    }
    setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.aceita_regras) {
      toast.error('Você precisa aceitar as regras');
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

  const idiomasList = ['Português', 'Inglês', 'Espanhol'];
  const tipoAssetList = ['Scripts', 'Sistemas', 'UI Kits', 'Plugins', 'Templates'];
  const plataformasList = ['Unity', 'Unreal Engine', 'React', 'Node.js', 'Python'];

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Formulário - lado esquerdo */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6">
            
            {/* Cabeçalho com logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center overflow-hidden">
                  {!logoLoadError ? (
                    <img src={logoImage} alt="DevAssets" className="w-12 h-12 object-contain" onError={() => setLogoLoadError(true)} />
                  ) : (
                    <span className="text-foreground font-bold text-xl">DA</span>
                  )}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Formulário de Inscrição</h1>
              <p className="text-sm text-muted-foreground mt-1">Torne-se um criador oficial da DevAssets</p>
            </div>

            {/* Progresso */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Etapa {currentPage + 1} de {pages.length}</span>
                <span>{Math.round(((currentPage + 1) / pages.length) * 100)}%</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-foreground rounded-full transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Título da página atual */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">{pages[currentPage].title}</h2>
              <p className="text-xs text-muted-foreground mt-1">{pages[currentPage].description}</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* PÁGINA 1 - INFORMAÇÕES PESSOAIS */}
              {currentPage === 0 && (
                <>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome Completo</label>
                    <input type="text" name="nome" value={form.nome} onChange={handleChange}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">E-mail</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Discord</label>
                    <input type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                      placeholder="usuário#0000"
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">WhatsApp</label>
                    <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Portfólio / GitHub</label>
                    <input type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                </>
              )}

              {/* PÁGINA 2 - EXPERIÊNCIA */}
              {currentPage === 1 && (
                <>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Experiência na área</label>
                    <textarea name="experiencia" rows={4} value={form.experiencia} onChange={handleChange}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Por que você quer ser um criador?</label>
                    <textarea name="motivo" rows={4} value={form.motivo} onChange={handleChange}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Plano de Contribuição</label>
                    <textarea name="plano_contribuicao" rows={3} value={form.plano_contribuicao} onChange={handleChange}
                      placeholder="Quantos assets planeja criar por mês?"
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="entrou_discord" checked={form.entrou_discord} onChange={handleChange}
                      className="rounded border-border" />
                    <span className="text-xs text-muted-foreground">Já entrei no Discord da DevAssets</span>
                  </label>
                </>
              )}

              {/* PÁGINA 3 - REDES SOCIAIS */}
              {currentPage === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram</label>
                    <input type="text" value={form.redes_sociais.instagram} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, instagram: e.target.value } })}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">GitHub</label>
                    <input type="text" value={form.redes_sociais.github} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, github: e.target.value } })}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">LinkedIn</label>
                    <input type="text" value={form.redes_sociais.linkedin} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, linkedin: e.target.value } })}
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                  </div>
                </div>
              )}

              {/* PÁGINA 4 - HABILIDADES */}
              {currentPage === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">Idiomas</label>
                    <div className="flex flex-wrap gap-2">
                      {idiomasList.map(idioma => (
                        <button key={idioma} type="button" onClick={() => handleMultiSelect('idiomas', idioma)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                            form.idiomas.includes(idioma) 
                              ? 'bg-foreground text-background' 
                              : 'bg-secondary text-muted-foreground hover:text-foreground'
                          }`}>
                          {idioma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">Tipos de Asset</label>
                    <div className="flex flex-wrap gap-2">
                      {tipoAssetList.map(tipo => (
                        <button key={tipo} type="button" onClick={() => handleMultiSelect('tipo_asset', tipo)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                            form.tipo_asset.includes(tipo) 
                              ? 'bg-foreground text-background' 
                              : 'bg-secondary text-muted-foreground hover:text-foreground'
                          }`}>
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">Plataformas</label>
                    <div className="flex flex-wrap gap-2">
                      {plataformasList.map(plataforma => (
                        <button key={plataforma} type="button" onClick={() => handleMultiSelect('plataformas', plataforma)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                            form.plataformas.includes(plataforma) 
                              ? 'bg-foreground text-background' 
                              : 'bg-secondary text-muted-foreground hover:text-foreground'
                          }`}>
                          {plataforma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Disponibilidade</label>
                    <input type="text" name="disponibilidade" value={form.disponibilidade} onChange={handleChange}
                      placeholder="Ex: 10-15 horas por semana"
                      className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground" />
                  </div>
                </div>
              )}

              {/* PÁGINA 5 - FINALIZAÇÃO */}
              {currentPage === 4 && (
                <div className="space-y-4">
                  <div className="p-3 bg-secondary border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">Resumo</span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Email: {form.email || 'Não informado'}</p>
                      <p>Discord: {form.discord_nick || 'Não informado'}</p>
                      <p>Assets: {form.tipo_asset.join(', ') || 'Não informado'}</p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="ja_vendeu" checked={form.ja_vendeu} onChange={handleChange}
                      className="rounded border-border" />
                    <span className="text-xs text-muted-foreground">Já vendi assets antes</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="disponibilidade_reunioes" checked={form.disponibilidade_reunioes} onChange={handleChange}
                      className="rounded border-border" />
                    <span className="text-xs text-muted-foreground">Tenho disponibilidade para reuniões</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-secondary border border-border rounded-lg">
                    <input type="checkbox" name="aceita_regras" checked={form.aceita_regras} onChange={handleChange}
                      className="rounded border-border" />
                    <span className="text-xs text-foreground">Li e concordo com as regras</span>
                  </label>
                </div>
              )}

              {/* Botões de navegação */}
              <div className="flex justify-between pt-4">
                {currentPage > 0 && (
                  <Button type="button" onClick={prevPage} variant="outline" className="border-border text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
                  </Button>
                )}
                
                {currentPage < pages.length - 1 ? (
                  <Button type="button" onClick={nextPage} className={`bg-white text-black hover:bg-white/90 font-semibold ${currentPage === 0 ? 'ml-auto' : ''}`}>
                    Próximo <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-white/90 font-semibold ml-auto">
                    {loading ? 'Enviando...' : <><Send className="h-4 w-4 mr-2" /> Enviar Inscrição</>}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar - lado direito (fixa) */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-foreground mb-4">Sobre o programa</h2>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>✓ Ganhe comissões sobre suas vendas</p>
              <p>✓ Suporte prioritário da equipe</p>
              <p>✓ Visibilidade na plataforma</p>
              <p>✓ Recebimentos mensais</p>
              <p>✓ Divulgação dos seus assets</p>
            </div>

            <div className="border-t border-border pt-4 mt-4 mb-6">
              <p className="text-xs text-muted-foreground">
                Após enviar, analisaremos suas informações e entraremos em contato pelo Discord/Email em até 5 dias úteis.
              </p>
            </div>

            {/* Botões da sidebar */}
            <div className="space-y-3">
              <Button 
                onClick={() => window.open('https://discord.gg/devassets', '_blank')}
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold gap-2"
              >
                <MessageSquare className="h-4 w-4" /> Entrar no Discord
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-border text-muted-foreground hover:text-foreground gap-2"
              >
                <Home className="h-4 w-4" /> Voltar ao início
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}