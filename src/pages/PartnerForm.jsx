// src/pages/PartnerForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Send, ChevronRight, ChevronLeft, User, Mail, MessageCircle, Phone, Link2, Briefcase, Target, Instagram, Github, Linkedin, Languages, Code2, Globe, Clock, Check, Sparkles, Shield, Award } from 'lucide-react';
import logoImage from '@/assets/images/Logo.png';

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
    { 
      title: "Informações Pessoais", 
      description: "Como podemos te identificar e contatar",
      icon: User,
      color: "text-blue-400"
    },
    { 
      title: "Experiência", 
      description: "Conte-nos sobre sua trajetória profissional",
      icon: Briefcase,
      color: "text-purple-400"
    },
    { 
      title: "Redes Sociais", 
      description: "Onde podemos te encontrar online",
      icon: Globe,
      color: "text-pink-400"
    },
    { 
      title: "Habilidades", 
      description: "Quais tecnologias e ferramentas você domina",
      icon: Code2,
      color: "text-green-400"
    },
    { 
      title: "Finalização", 
      description: "Últimas informações antes de enviar",
      icon: Check,
      color: "text-emerald-400"
    }
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
      toast.error('Preencha Nome, Email e Discord para continuar');
      return;
    }
    if (currentPage === 4 && !form.aceita_regras) {
      toast.error('Você precisa aceitar as regras para enviar');
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
      
      toast.success('Inscrição enviada com sucesso! Entraremos em contato em breve.');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar inscrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const idiomasList = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão'];
  const tipoAssetList = ['Scripts', 'Sistemas', 'UI Kits', 'Plugins', 'Templates', 'Assets 3D', 'VFX'];
  const plataformasList = ['Unity', 'Unreal Engine', 'Godot', 'React', 'Vue', 'Node.js', 'Python', 'PHP'];

  const CurrentIcon = pages[currentPage].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto py-8 px-4">
        {/* Botão voltar */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-[#555] hover:text-white mb-8 transition-all duration-300 hover:translate-x-[-4px]"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm">Voltar</span>
        </button>

        {/* Logo e Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative w-20 h-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-gray-300 rounded-2xl shadow-2xl">
              {!logoLoadError ? (
                <img src={logoImage} alt="DevAssets" className="w-14 h-14 object-contain" onError={() => setLogoLoadError(true)} />
              ) : (
                <span className="text-black font-black text-xl">DA</span>
              )}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Torne-se um Criador
          </h1>
          <p className="text-sm text-[#555] mt-2 max-w-md mx-auto">
            Faça parte da maior plataforma de assets do Brasil. Compartilhe seu trabalho e ganhe comissões.
          </p>
          
          {/* Progresso */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#555]">Progresso</span>
              <span className="text-xs font-medium text-white">{Math.round(((currentPage + 1) / pages.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white to-gray-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Indicador de páginas */}
          <div className="flex items-center justify-center gap-1 mt-6">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (idx < currentPage) setCurrentPage(idx);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentPage 
                    ? 'w-8 bg-white' 
                    : idx < currentPage 
                      ? 'w-4 bg-white/40 hover:bg-white/60' 
                      : 'w-4 bg-[#1A1A1A]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0F0F0F] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl">
            
            {/* Cabeçalho da página */}
            <div className="px-6 py-5 border-b border-[#1A1A1A] bg-gradient-to-r from-black/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-xl">
                  <CurrentIcon className={`h-5 w-5 ${pages[currentPage].color}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{pages[currentPage].title}</h2>
                  <p className="text-xs text-[#555] mt-0.5">{pages[currentPage].description}</p>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              
              {/* PÁGINA 0 - INFORMAÇÕES PESSOAIS */}
              {currentPage === 0 && (
                <div className="space-y-5">
                  <div className={`transition-all duration-300 ${focusedField === 'nome' ? 'transform scale-[1.02]' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <User className={`h-4 w-4 transition-colors ${focusedField === 'nome' ? 'text-white' : 'text-[#555]'}`} />
                      <label className="text-sm font-medium text-white">Nome Completo</label>
                    </div>
                    <input 
                      type="text" name="nome" value={form.nome} onChange={handleChange}
                      onFocus={() => setFocusedField('nome')} onBlur={() => setFocusedField(null)}
                      placeholder="Digite seu nome completo"
                      className="w-full h-12 px-4 bg-black border border-[#1A1A1A] rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-all duration-300"
                    />
                  </div>

                  <div className={`transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className={`h-4 w-4 transition-colors ${focusedField === 'email' ? 'text-white' : 'text-[#555]'}`} />
                      <label className="text-sm font-medium text-white">Email</label>
                    </div>
                    <input 
                      type="email" name="email" value={form.email} onChange={handleChange}
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                      placeholder="seu@email.com"
                      className="w-full h-12 px-4 bg-black border border-[#1A1A1A] rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-all duration-300"
                    />
                  </div>

                  <div className={`transition-all duration-300 ${focusedField === 'discord' ? 'transform scale-[1.02]' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className={`h-4 w-4 transition-colors ${focusedField === 'discord' ? 'text-white' : 'text-[#555]'}`} />
                      <label className="text-sm font-medium text-white">Discord</label>
                    </div>
                    <input 
                      type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                      onFocus={() => setFocusedField('discord')} onBlur={() => setFocusedField(null)}
                      placeholder="usuário#0000"
                      className="w-full h-12 px-4 bg-black border border-[#1A1A1A] rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-all duration-300"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">WhatsApp</label>
                    </div>
                    <input 
                      type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="w-full h-12 px-4 bg-black border border-[#1A1A1A] rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-all duration-300"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Portfólio / GitHub</label>
                    </div>
                    <input 
                      type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                      placeholder="https://github.com/seuusuario"
                      className="w-full h-12 px-4 bg-black border border-[#1A1A1A] rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* PÁGINA 1 - EXPERIÊNCIA */}
              {currentPage === 1 && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Experiência na área</label>
                    </div>
                    <textarea 
                      name="experiencia" rows={4} value={form.experiencia} onChange={handleChange}
                      placeholder="Conte sobre sua experiência com desenvolvimento, criação de assets, etc."
                      className="w-full px-4 py-3 bg-black border border-[#1A1A1A] rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-all duration-300 resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Por que você quer ser um criador?</label>
                    </div>
                    <textarea 
                      name="motivo" rows={4} value={form.motivo} onChange={handleChange}
                      placeholder="Conte sua motivação para se juntar à DevAssets"
                      className="w-full px-4 py-3 bg-black border border-[#1A1A1A] rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-all duration-300 resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Plano de Contribuição</label>
                    </div>
                    <textarea 
                      name="plano_contribuicao" rows={3} value={form.plano_contribuicao} onChange={handleChange}
                      placeholder="Quantos assets planeja criar por mês? Quais tipos?"
                      className="w-full px-4 py-3 bg-black border border-[#1A1A1A] rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-all duration-300 resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 border border-[#1A1A1A] rounded-xl hover:bg-white/10 transition-all duration-300 group">
                    <input type="checkbox" name="entrou_discord" checked={form.entrou_discord} onChange={handleChange}
                      className="w-4 h-4 rounded border-[#1A1A1A]" />
                    <span className="text-sm text-[#555] group-hover:text-white transition-colors">✅ Já entrei no Discord da DevAssets</span>
                  </label>
                </div>
              )}

              {/* PÁGINA 2 - REDES SOCIAIS */}
              {currentPage === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-[#1A1A1A] rounded-xl hover:border-white/20 transition-all duration-300">
                    <Instagram className="h-5 w-5 text-pink-400" />
                    <input type="text" value={form.redes_sociais.instagram} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, instagram: e.target.value } })}
                      placeholder="@seuinstagram"
                      className="flex-1 h-10 px-3 bg-transparent rounded-lg text-white text-sm placeholder:text-[#555] focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-[#1A1A1A] rounded-xl hover:border-white/20 transition-all duration-300">
                    <Github className="h-5 w-5 text-gray-400" />
                    <input type="text" value={form.redes_sociais.github} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, github: e.target.value } })}
                      placeholder="github.com/usuario"
                      className="flex-1 h-10 px-3 bg-transparent rounded-lg text-white text-sm placeholder:text-[#555] focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-[#1A1A1A] rounded-xl hover:border-white/20 transition-all duration-300">
                    <Linkedin className="h-5 w-5 text-blue-400" />
                    <input type="text" value={form.redes_sociais.linkedin} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, linkedin: e.target.value } })}
                      placeholder="linkedin.com/in/usuario"
                      className="flex-1 h-10 px-3 bg-transparent rounded-lg text-white text-sm placeholder:text-[#555] focus:outline-none" />
                  </div>
                </div>
              )}

              {/* PÁGINA 3 - HABILIDADES */}
              {currentPage === 3 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Languages className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Idiomas</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {idiomasList.map(idioma => (
                        <button key={idioma} type="button" onClick={() => handleMultiSelect('idiomas', idioma)}
                          className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                            form.idiomas.includes(idioma) 
                              ? 'bg-white text-black shadow-lg scale-105' 
                              : 'bg-[#1A1A1A] text-[#555] hover:bg-white/10 hover:text-white'
                          }`}>
                          {idioma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-3 block">Tipos de Asset</label>
                    <div className="flex flex-wrap gap-2">
                      {tipoAssetList.map(tipo => (
                        <button key={tipo} type="button" onClick={() => handleMultiSelect('tipo_asset', tipo)}
                          className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                            form.tipo_asset.includes(tipo) 
                              ? 'bg-white text-black shadow-lg scale-105' 
                              : 'bg-[#1A1A1A] text-[#555] hover:bg-white/10 hover:text-white'
                          }`}>
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-3 block">Plataformas</label>
                    <div className="flex flex-wrap gap-2">
                      {plataformasList.map(plataforma => (
                        <button key={plataforma} type="button" onClick={() => handleMultiSelect('plataformas', plataforma)}
                          className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                            form.plataformas.includes(plataforma) 
                              ? 'bg-white text-black shadow-lg scale-105' 
                              : 'bg-[#1A1A1A] text-[#555] hover:bg-white/10 hover:text-white'
                          }`}>
                          {plataforma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Disponibilidade</label>
                    </div>
                    <input type="text" name="disponibilidade" value={form.disponibilidade} onChange={handleChange}
                      placeholder="Ex: 10-15 horas por semana"
                      className="w-full h-12 px-4 bg-black border border-[#1A1A1A] rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-all duration-300" />
                  </div>
                </div>
              )}

              {/* PÁGINA 4 - FINALIZAÇÃO */}
              {currentPage === 4 && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-white/5 to-transparent p-4 rounded-xl border border-[#1A1A1A]">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm font-medium text-white">Confirme seus dados</span>
                    </div>
                    <div className="space-y-2 text-sm text-[#555]">
                      <p>📧 Email: {form.email || 'Não informado'}</p>
                      <p>💬 Discord: {form.discord_nick || 'Não informado'}</p>
                      <p>🎨 Tipo de Asset: {form.tipo_asset.join(', ') || 'Não informado'}</p>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 border border-[#1A1A1A] rounded-xl hover:bg-white/10 transition-all duration-300 group">
                    <input type="checkbox" name="ja_vendeu" checked={form.ja_vendeu} onChange={handleChange}
                      className="w-4 h-4 rounded border-[#1A1A1A]" />
                    <span className="text-sm text-[#555] group-hover:text-white transition-colors">💰 Já vendi assets antes</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 border border-[#1A1A1A] rounded-xl hover:bg-white/10 transition-all duration-300 group">
                    <input type="checkbox" name="disponibilidade_reunioes" checked={form.disponibilidade_reunioes} onChange={handleChange}
                      className="w-4 h-4 rounded border-[#1A1A1A]" />
                    <span className="text-sm text-[#555] group-hover:text-white transition-colors">🎥 Tenho disponibilidade para reuniões</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-4 bg-gradient-to-r from-white/10 to-transparent border border-white/30 rounded-xl transition-all duration-300 hover:border-white/50">
                    <input type="checkbox" name="aceita_regras" checked={form.aceita_regras} onChange={handleChange}
                      className="w-4 h-4 rounded border-white" />
                    <span className="text-sm text-white">✅ Li e concordo com as <a href="/terms" className="underline hover:text-gray-300" target="_blank">regras e termos</a></span>
                  </label>
                </div>
              )}
            </div>

            {/* Botões de navegação */}
            <div className="px-6 py-5 border-t border-[#1A1A1A] flex justify-between bg-gradient-to-r from-transparent to-black/30">
              {currentPage > 0 && (
                <Button type="button" onClick={prevPage} variant="outline" className="border-[#1A1A1A] text-[#555] hover:text-white hover:bg-[#1A1A1A] gap-2 px-6 rounded-xl transition-all duration-300">
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
              )}
              
              {currentPage < pages.length - 1 ? (
                <Button type="button" onClick={nextPage} className={`bg-gradient-to-r from-white to-gray-300 text-black hover:from-white/90 hover:to-gray-200 font-semibold gap-2 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 ${currentPage === 0 ? 'ml-auto' : ''}`}>
                  Próximo <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 font-semibold gap-2 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 ml-auto shadow-lg">
                  {loading ? 'Enviando...' : <><Send className="h-4 w-4" /> Enviar Inscrição</>}
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <p className="text-xs text-[#555] text-center mt-6">
          Ao enviar, você concorda com nossos termos de uso. Seus dados estão seguros.
        </p>
      </div>
    </div>
  );
}