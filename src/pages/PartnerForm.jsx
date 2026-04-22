// src/pages/PartnerForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← Corrigido (removeu a chave extra)
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Send, ChevronRight, ChevronLeft, User, Mail, MessageCircle, Phone, Link2, Briefcase, Target, Instagram, Github, Linkedin, Languages, Code2, Globe, Clock, Check } from 'lucide-react';
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
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
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
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Botão voltar */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#555] hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        {/* Logo centralizada */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden bg-transparent">
              {!logoLoadError ? (
                <img src={logoImage} alt="DevAssets" className="w-full h-full object-contain" onError={() => setLogoLoadError(true)} />
              ) : (
                <span className="text-white font-black text-xl">DA</span>
              )}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white">Formulário de Inscrição</h1>
          <p className="text-sm text-[#555] mt-2">Preencha os dados para se tornar um criador oficial</p>
          
          {/* Indicador de página */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {pages.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentPage ? 'w-8 bg-white' : 'w-4 bg-[#1A1A1A]'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#555] mt-2">{currentPage + 1} de {pages.length}</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
            
            {/* Cabeçalho da página */}
            <div className="px-6 py-4 border-b border-[#1A1A1A] bg-black/30">
              <h2 className="text-lg font-semibold text-white">{pages[currentPage].title}</h2>
              <p className="text-xs text-[#555] mt-0.5">{pages[currentPage].description}</p>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-5">
              
              {/* PÁGINA 0 - INFORMAÇÕES PESSOAIS */}
              {currentPage === 0 && (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Nome Completo</label>
                    </div>
                    <input type="text" name="nome" value={form.nome} onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Email</label>
                    </div>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Discord</label>
                    </div>
                    <input type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                      placeholder="usuário#0000"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">WhatsApp</label>
                    </div>
                    <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Portfólio / GitHub</label>
                    </div>
                    <input type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                      placeholder="https://github.com/seuusuario"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white" />
                  </div>
                </>
              )}

              {/* PÁGINA 1 - EXPERIÊNCIA */}
              {currentPage === 1 && (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Experiência na área</label>
                    </div>
                    <textarea name="experiencia" rows={4} value={form.experiencia} onChange={handleChange}
                      placeholder="Conte sobre sua experiência com desenvolvimento, criação de assets, etc."
                      className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white resize-none" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Por que você quer ser um criador?</label>
                    </div>
                    <textarea name="motivo" rows={4} value={form.motivo} onChange={handleChange}
                      placeholder="Conte sua motivação para se juntar à DevAssets"
                      className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white resize-none" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-[#555]" />
                      <label className="text-sm font-medium text-white">Plano de Contribuição</label>
                    </div>
                    <textarea name="plano_contribuicao" rows={3} value={form.plano_contribuicao} onChange={handleChange}
                      placeholder="Quantos assets planeja criar por mês? Quais tipos?"
                      className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white resize-none" />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-black border border-[#1A1A1A] rounded-lg">
                    <input type="checkbox" name="entrou_discord" checked={form.entrou_discord} onChange={handleChange}
                      className="w-4 h-4 rounded border-[#1A1A1A]" />
                    <span className="text-sm text-[#555]">Já entrei no Discord da DevAssets</span>
                  </label>
                </>
              )}

              {/* PÁGINA 2 - REDES SOCIAIS */}
              {currentPage === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Instagram className="h-5 w-5 text-[#555]" />
                    <input type="text" value={form.redes_sociais.instagram} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, instagram: e.target.value } })}
                      placeholder="Instagram: @usuario"
                      className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5 text-[#555]" />
                    <input type="text" value={form.redes_sociais.github} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, github: e.target.value } })}
                      placeholder="GitHub: usuario"
                      className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-[#555]" />
                    <input type="text" value={form.redes_sociais.linkedin} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, linkedin: e.target.value } })}
                      placeholder="LinkedIn: /in/usuario"
                      className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm" />
                  </div>
                </div>
              )}

              {/* PÁGINA 3 - HABILIDADES */}
              {currentPage === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Idiomas</label>
                    <div className="flex flex-wrap gap-2">
                      {idiomasList.map(idioma => (
                        <button key={idioma} type="button" onClick={() => handleMultiSelect('idiomas', idioma)}
                          className={`px-4 py-1.5 rounded-full text-sm transition-all ${form.idiomas.includes(idioma) ? 'bg-white text-black' : 'bg-[#1A1A1A] text-[#555] hover:text-white'}`}>
                          {idioma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Tipos de Asset</label>
                    <div className="flex flex-wrap gap-2">
                      {tipoAssetList.map(tipo => (
                        <button key={tipo} type="button" onClick={() => handleMultiSelect('tipo_asset', tipo)}
                          className={`px-4 py-1.5 rounded-full text-sm transition-all ${form.tipo_asset.includes(tipo) ? 'bg-white text-black' : 'bg-[#1A1A1A] text-[#555] hover:text-white'}`}>
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Plataformas</label>
                    <div className="flex flex-wrap gap-2">
                      {plataformasList.map(plataforma => (
                        <button key={plataforma} type="button" onClick={() => handleMultiSelect('plataformas', plataforma)}
                          className={`px-4 py-1.5 rounded-full text-sm transition-all ${form.plataformas.includes(plataforma) ? 'bg-white text-black' : 'bg-[#1A1A1A] text-[#555] hover:text-white'}`}>
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
                      className="w-full h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm" />
                  </div>
                </div>
              )}

              {/* PÁGINA 4 - FINALIZAÇÃO */}
              {currentPage === 4 && (
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-black border border-[#1A1A1A] rounded-lg">
                    <input type="checkbox" name="ja_vendeu" checked={form.ja_vendeu} onChange={handleChange}
                      className="w-4 h-4 rounded border-[#1A1A1A]" />
                    <span className="text-sm text-[#555]">Já vendi assets antes</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-black border border-[#1A1A1A] rounded-lg">
                    <input type="checkbox" name="disponibilidade_reunioes" checked={form.disponibilidade_reunioes} onChange={handleChange}
                      className="w-4 h-4 rounded border-[#1A1A1A]" />
                    <span className="text-sm text-[#555]">Tenho disponibilidade para reuniões</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-black border border-white rounded-lg">
                    <input type="checkbox" name="aceita_regras" checked={form.aceita_regras} onChange={handleChange}
                      className="w-4 h-4 rounded border-white" />
                    <span className="text-sm text-white">Li e concordo com as regras</span>
                  </label>
                </div>
              )}
            </div>

            {/* Botões de navegação */}
            <div className="px-6 py-4 border-t border-[#1A1A1A] flex justify-between">
              {currentPage > 0 && (
                <Button type="button" onClick={prevPage} variant="outline" className="border-[#1A1A1A] text-[#555] hover:text-white hover:bg-[#1A1A1A] gap-2">
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
              )}
              
              {currentPage < pages.length - 1 ? (
                <Button type="button" onClick={nextPage} className={`bg-white text-black hover:bg-white/90 font-semibold gap-2 ${currentPage === 0 ? 'ml-auto' : ''}`}>
                  Próximo <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-white/90 font-semibold gap-2 ml-auto">
                  {loading ? 'Enviando...' : <><Send className="h-4 w-4" /> Enviar Inscrição</>}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}