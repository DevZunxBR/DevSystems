// src/pages/PartnerForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Send, ChevronRight, ChevronLeft, User, Mail, MessageCircle, Phone, Link2, Briefcase, Target, Instagram, Github, Linkedin, Languages, Code2, Globe, Clock, CheckCircle, Sparkles, TrendingUp, Users, Shield, Award, MessageSquare, Home } from 'lucide-react';
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
    { title: "Identidade", description: "Estabeleça sua presença criativa", icon: User },
    { title: "Trajetória", description: "Sua experiência profissional", icon: Briefcase },
    { title: "Rede", description: "Pontos de conexão social", icon: Globe },
    { title: "Stack", description: "Capacidades técnicas", icon: Code2 },
    { title: "Manifesto", description: "Finalize a parceria", icon: Shield },
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
    <div className="min-h-screen bg-black text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-16">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 lg:mb-16 border-b border-[#1A1A1A] pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-[10px] tracking-[0.25em] text-[#888] uppercase">
              <Sparkles className="w-3 h-3" />
              Portal do Criador
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter">
              DEV<span className="text-[#888]">ASSETS</span>
            </h1>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {pages.map((page, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  idx <= currentPage 
                    ? 'border-white bg-white text-black' 
                    : 'border-[#1A1A1A] text-[#333]'
                }`}>
                  {idx < currentPage ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{idx + 1}</span>
                  )}
                </div>
                {idx < pages.length - 1 && (
                  <div className={`w-6 h-[1px] transition-all duration-300 ${
                    idx < currentPage ? 'bg-white' : 'bg-[#1A1A1A]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </header>

        {/* Mobile progress bar */}
        <div className="lg:hidden mb-8">
          <div className="flex justify-between text-[10px] text-[#555] mb-2">
            <span>Progresso</span>
            <span>{Math.round(((currentPage + 1) / pages.length) * 100)}%</span>
          </div>
          <div className="h-[1px] bg-[#1A1A1A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Form Area */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Page header */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl lg:text-3xl font-light tracking-tight">
                    {pages[currentPage].title}
                  </h2>
                  <span className="text-[#333] text-2xl lg:text-3xl font-light">/</span>
                </div>
                <p className="text-[#888] text-sm">{pages[currentPage].description}</p>
              </div>

              {/* PÁGINA 0 - IDENTIDADE */}
              {currentPage === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <User className="w-3 h-3" /> Nome Completo
                    </label>
                    <input type="text" name="nome" value={form.nome} onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Mail className="w-3 h-3" /> E-mail
                    </label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <MessageCircle className="w-3 h-3" /> Discord
                    </label>
                    <input type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                      placeholder="usuário#0000"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Phone className="w-3 h-3" /> WhatsApp
                    </label>
                    <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Link2 className="w-3 h-3" /> Portfólio / GitHub
                    </label>
                    <input type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                      placeholder="https://github.com/seuusuario"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333]" />
                  </div>
                </div>
              )}

              {/* PÁGINA 1 - TRAJETÓRIA */}
              {currentPage === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> Experiência na área
                    </label>
                    <textarea name="experiencia" rows={4} value={form.experiencia} onChange={handleChange}
                      placeholder="Conte sobre sua experiência com desenvolvimento, criação de assets, etc."
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333] resize-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Target className="w-3 h-3" /> Por que você quer ser um criador?
                    </label>
                    <textarea name="motivo" rows={4} value={form.motivo} onChange={handleChange}
                      placeholder="Conte sua motivação para se juntar à DevAssets"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333] resize-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> Plano de Contribuição
                    </label>
                    <textarea name="plano_contribuicao" rows={3} value={form.plano_contribuicao} onChange={handleChange}
                      placeholder="Quantos assets planeja criar por mês? Quais tipos?"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333] resize-none" />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer pt-2">
                    <input type="checkbox" name="entrou_discord" checked={form.entrou_discord} onChange={handleChange}
                      className="w-4 h-4 rounded border-[#1A1A1A] bg-transparent checked:bg-white checked:border-white" />
                    <span className="text-xs text-[#555]">✅ Já entrei no Discord da DevAssets</span>
                  </label>
                </div>
              )}

              {/* PÁGINA 2 - REDE */}
              {currentPage === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Instagram className="w-3 h-3" /> Instagram
                    </label>
                    <input type="text" value={form.redes_sociais.instagram} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, instagram: e.target.value } })}
                      placeholder="@usuario"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Github className="w-3 h-3" /> GitHub
                    </label>
                    <input type="text" value={form.redes_sociais.github} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, github: e.target.value } })}
                      placeholder="github.com/usuario"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Linkedin className="w-3 h-3" /> LinkedIn
                    </label>
                    <input type="text" value={form.redes_sociais.linkedin} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, linkedin: e.target.value } })}
                      placeholder="linkedin.com/in/usuario"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333]" />
                  </div>
                </div>
              )}

              {/* PÁGINA 3 - STACK */}
              {currentPage === 3 && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Languages className="w-3 h-3" /> Idiomas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {idiomasList.map(idioma => (
                        <button key={idioma} type="button" onClick={() => handleMultiSelect('idiomas', idioma)}
                          className={`px-4 py-2 rounded-full text-xs transition-all duration-300 ${
                            form.idiomas.includes(idioma) 
                              ? 'bg-white text-black' 
                              : 'bg-[#1A1A1A] text-[#555] hover:text-white hover:bg-[#2A2A2A]'
                          }`}>
                          {idioma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Code2 className="w-3 h-3" /> Tipos de Asset
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {tipoAssetList.map(tipo => (
                        <button key={tipo} type="button" onClick={() => handleMultiSelect('tipo_asset', tipo)}
                          className={`px-4 py-2 rounded-full text-xs transition-all duration-300 ${
                            form.tipo_asset.includes(tipo) 
                              ? 'bg-white text-black' 
                              : 'bg-[#1A1A1A] text-[#555] hover:text-white hover:bg-[#2A2A2A]'
                          }`}>
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Plataformas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {plataformasList.map(plataforma => (
                        <button key={plataforma} type="button" onClick={() => handleMultiSelect('plataformas', plataforma)}
                          className={`px-4 py-2 rounded-full text-xs transition-all duration-300 ${
                            form.plataformas.includes(plataforma) 
                              ? 'bg-white text-black' 
                              : 'bg-[#1A1A1A] text-[#555] hover:text-white hover:bg-[#2A2A2A]'
                          }`}>
                          {plataforma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-[#555] flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Disponibilidade
                    </label>
                    <input type="text" name="disponibilidade" value={form.disponibilidade} onChange={handleChange}
                      placeholder="Ex: 10-15 horas por semana"
                      className="w-full px-0 py-2 bg-transparent border-b border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-white transition-colors duration-300 placeholder:text-[#333]" />
                  </div>
                </div>
              )}

              {/* PÁGINA 4 - MANIFESTO */}
              {currentPage === 4 && (
                <div className="space-y-6">
                  <div className="p-5 bg-[#1A1A1A]/30 border border-[#1A1A1A] rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span className="text-xs font-medium text-white">Resumo da sua inscrição</span>
                    </div>
                    <div className="space-y-1 text-xs text-[#555]">
                      <p>Email: <span className="text-white">{form.email || 'Não informado'}</span></p>
                      <p>Discord: <span className="text-white">{form.discord_nick || 'Não informado'}</span></p>
                      <p>Assets: <span className="text-white">{form.tipo_asset.join(', ') || 'Não informado'}</span></p>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-[#1A1A1A]/30 border border-[#1A1A1A] rounded-lg hover:bg-[#1A1A1A]/50 transition-all duration-300">
                    <input type="checkbox" name="ja_vendeu" checked={form.ja_vendeu} onChange={handleChange}
                      className="w-4 h-4 rounded border-[#1A1A1A]" />
                    <span className="text-sm text-[#555]">💰 Já vendi assets antes</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-[#1A1A1A]/30 border border-[#1A1A1A] rounded-lg hover:bg-[#1A1A1A]/50 transition-all duration-300">
                    <input type="checkbox" name="disponibilidade_reunioes" checked={form.disponibilidade_reunioes} onChange={handleChange}
                      className="w-4 h-4 rounded border-[#1A1A1A]" />
                    <span className="text-sm text-[#555]">🎥 Tenho disponibilidade para reuniões</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-5 bg-white/5 border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <input type="checkbox" name="aceita_regras" checked={form.aceita_regras} onChange={handleChange}
                      className="w-4 h-4 rounded border-white" />
                    <span className="text-sm text-white">✅ Li e concordo com as <a href="/terms" className="underline hover:text-gray-300" target="_blank">regras e termos</a></span>
                  </label>
                </div>
              )}

              {/* Navigation */}
              <div className="pt-8 lg:pt-12 flex items-center gap-4 border-t border-[#0A0A0A]">
                {currentPage > 0 && (
                  <button type="button" onClick={prevPage}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#888] hover:text-white transition-colors duration-300 py-3 px-1">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </button>
                )}
                <div className="flex-1" />
                {currentPage < pages.length - 1 ? (
                  <button type="button" onClick={nextPage}
                    className="px-8 py-4 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#E0E0E0] transition-all duration-300 flex items-center gap-3">
                    Continuar <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={loading}
                    className="px-8 py-4 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#E0E0E0] disabled:opacity-40 transition-all duration-300 flex items-center gap-3">
                    {loading ? 'Enviando...' : <>Enviar Inscrição <Send className="w-4 h-4" /></>}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar - Benefícios */}
          <aside className="lg:col-span-5 xl:col-span-4 lg:border-l lg:border-[#1A1A1A] lg:pl-10">
            <div className="lg:sticky lg:top-8 space-y-8">
              
              {/* Benefits */}
              <div className="space-y-6">
                <h3 className="text-[10px] uppercase tracking-widest text-[#888]">Benefícios</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                      <TrendingUp className="w-4 h-4 text-[#555] group-hover:text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Comissões</p>
                      <p className="text-xs text-[#555]">Até 70% de comissão por venda</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                      <Users className="w-4 h-4 text-[#555] group-hover:text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Visibilidade</p>
                      <p className="text-xs text-[#555]">Destaque na plataforma</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                      <Shield className="w-4 h-4 text-[#555] group-hover:text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Suporte</p>
                      <p className="text-xs text-[#555]">Atendimento prioritário</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                      <Award className="w-4 h-4 text-[#555] group-hover:text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Certificação</p>
                      <p className="text-xs text-[#555]">Selos de qualidade</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#1A1A1A]">
                  <p className="text-[10px] text-[#555] leading-relaxed">
                    Análise em até 5 dias úteis. Aprovação sujeita à análise do portfólio.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-widest text-[#888]">Suporte</h4>
                <button type="button"
                  onClick={() => window.open('https://discord.gg/devassets', '_blank')}
                  className="w-full py-4 px-6 border border-[#1A1A1A] text-[10px] uppercase tracking-widest flex justify-between items-center hover:bg-white hover:text-black transition-all duration-300 text-[#888] hover:border-white">
                  Entrar no Discord <MessageSquare className="w-4 h-4" />
                </button>
                <button type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-4 px-6 border border-[#1A1A1A] text-[10px] uppercase tracking-widest flex justify-between items-center hover:bg-white hover:text-black transition-all duration-300 text-[#888] hover:border-white">
                  Voltar ao Início <Home className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-[#1A1A1A]">
          <p className="text-[10px] text-[#555] tracking-widest uppercase text-center">
            © DevAssets {new Date().getFullYear()} — Programa Oficial de Criadores
          </p>
        </footer>
      </div>
    </div>
  );
}