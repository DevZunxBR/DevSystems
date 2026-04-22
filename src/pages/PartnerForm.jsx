// src/pages/PartnerForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Send, Check, Globe, Github, Linkedin, Instagram, Code2, Languages, Clock, User, Mail, MessageCircle, Phone, Link2, Briefcase, Target } from 'lucide-react';
import logoImage from '@/assets/images/Logo.png';

export default function PartnerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nome || !form.email || !form.discord_nick || !form.aceita_regras) {
      toast.error('Preencha todos os campos obrigatórios');
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden bg-white">
              {!logoLoadError ? (
                <img src={logoImage} alt="DevAssets" className="w-full h-full object-contain p-2" onError={() => setLogoLoadError(true)} />
              ) : (
                <span className="text-black font-black text-xl">DA</span>
              )}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white">Formulário de Inscrição</h1>
          <p className="text-sm text-[#555] mt-2 max-w-md mx-auto">
            Preencha os dados abaixo para se tornar um criador oficial da DevAssets.
            Analisaremos suas informações e entraremos em contato.
          </p>
        </div>

        {/* Formulário estilo documentação */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ============================================ */}
          {/* INFORMAÇÕES PESSOAIS */}
          {/* ============================================ */}
          <div className="border-b border-[#1A1A1A] pb-2 mb-2">
            <h2 className="text-lg font-semibold text-white">Informações Pessoais</h2>
            <p className="text-xs text-[#555]">Dados básicos para contato e identificação</p>
          </div>

          <div className="space-y-5">
            {/* Nome */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Nome Completo <span className="text-red-500">*</span></label>
              </div>
              <p className="text-xs text-[#555] mb-2">Como você gostaria de ser chamado em nossa plataforma</p>
              <input type="text" name="nome" value={form.nome} onChange={handleChange}
                placeholder="Ex: João Silva"
                className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Email <span className="text-red-500">*</span></label>
              </div>
              <p className="text-xs text-[#555] mb-2">Usaremos este email para contato e notificações</p>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="Ex: joao@exemplo.com"
                className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
            </div>

            {/* Discord */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Discord <span className="text-red-500">*</span></label>
              </div>
              <p className="text-xs text-[#555] mb-2">Seu nick completo com os 4 números</p>
              <input type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                placeholder="Ex: joao#1234"
                className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
            </div>

            {/* Telefone */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Phone className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">WhatsApp</label>
              </div>
              <p className="text-xs text-[#555] mb-2">Opcional, mas recomendado para contato rápido</p>
              <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                placeholder="Ex: (11) 99999-9999"
                className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
            </div>

            {/* Portfólio */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link2 className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Portfólio / GitHub</label>
              </div>
              <p className="text-xs text-[#555] mb-2">Link para seus trabalhos ou perfil do GitHub</p>
              <input type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                placeholder="Ex: https://github.com/joao"
                className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors" />
            </div>
          </div>

          {/* ============================================ */}
          {/* EXPERIÊNCIA E MOTIVAÇÃO */}
          {/* ============================================ */}
          <div className="border-b border-[#1A1A1A] pb-2 mb-2 mt-8">
            <h2 className="text-lg font-semibold text-white">Experiência e Motivação</h2>
            <p className="text-xs text-[#555]">Conte-nos mais sobre sua trajetória</p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Experiência na área</label>
              </div>
              <p className="text-xs text-[#555] mb-2">Descreva sua experiência com desenvolvimento e criação de assets</p>
              <textarea name="experiencia" rows={3} value={form.experiencia} onChange={handleChange}
                placeholder="Ex: Trabalho com Unity há 3 anos, já criei 10 assets..."
                className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors resize-none" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Por que você quer ser um criador?</label>
              </div>
              <p className="text-xs text-[#555] mb-2">Conte sua motivação para se juntar à DevAssets</p>
              <textarea name="motivo" rows={3} value={form.motivo} onChange={handleChange}
                placeholder="Ex: Quero compartilhar meus assets e ganhar comissão..."
                className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors resize-none" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Plano de Contribuição</label>
              </div>
              <p className="text-xs text-[#555] mb-2">Quantos assets planeja criar por mês? Quais tipos?</p>
              <textarea name="plano_contribuicao" rows={2} value={form.plano_contribuicao} onChange={handleChange}
                placeholder="Ex: Planejo criar 2-3 assets por mês, focando em sistemas de RPG..."
                className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors resize-none" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-black border border-[#1A1A1A] rounded-lg">
              <input type="checkbox" name="entrou_discord" checked={form.entrou_discord} onChange={handleChange}
                className="w-4 h-4 rounded border-[#1A1A1A]" />
              <span className="text-sm text-[#555]">✅ Já entrei no Discord da DevAssets</span>
            </label>
          </div>

          {/* ============================================ */}
          {/* REDES SOCIAIS */}
          {/* ============================================ */}
          <div className="border-b border-[#1A1A1A] pb-2 mb-2 mt-8">
            <h2 className="text-lg font-semibold text-white">Redes Sociais</h2>
            <p className="text-xs text-[#555]">Onde podemos te encontrar profissionalmente</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Instagram className="h-5 w-5 text-[#555] flex-shrink-0" />
              <input type="text" value={form.redes_sociais.instagram} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, instagram: e.target.value } })}
                placeholder="Instagram: @usuario"
                className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm" />
            </div>
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5 text-[#555] flex-shrink-0" />
              <input type="text" value={form.redes_sociais.github} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, github: e.target.value } })}
                placeholder="GitHub: usuario"
                className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm" />
            </div>
            <div className="flex items-center gap-3">
              <Linkedin className="h-5 w-5 text-[#555] flex-shrink-0" />
              <input type="text" value={form.redes_sociais.linkedin} onChange={(e) => setForm({ ...form, redes_sociais: { ...form.redes_sociais, linkedin: e.target.value } })}
                placeholder="LinkedIn: /in/usuario"
                className="flex-1 h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm" />
            </div>
          </div>

          {/* ============================================ */}
          {/* HABILIDADES TÉCNICAS */}
          {/* ============================================ */}
          <div className="border-b border-[#1A1A1A] pb-2 mb-2 mt-8">
            <h2 className="text-lg font-semibold text-white">Habilidades Técnicas</h2>
            <p className="text-xs text-[#555]">Quais tecnologias e ferramentas você domina</p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Languages className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Idiomas</label>
              </div>
              <p className="text-xs text-[#555] mb-2">Selecione os idiomas que você domina</p>
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
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Tipos de Asset</label>
              </div>
              <p className="text-xs text-[#555] mb-2">Que tipo de conteúdo você cria ou planeja criar</p>
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
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Plataformas</label>
              </div>
              <p className="text-xs text-[#555] mb-2">Quais plataformas e engines você conhece</p>
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
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-[#555]" />
                <label className="text-sm font-medium text-white">Disponibilidade</label>
              </div>
              <p className="text-xs text-[#555] mb-2">Quantas horas por semana você pode dedicar</p>
              <input type="text" name="disponibilidade" value={form.disponibilidade} onChange={handleChange}
                placeholder="Ex: 10-15 horas por semana"
                className="w-full h-10 px-3 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm" />
            </div>
          </div>

          {/* ============================================ */}
          {/* FINALIZAÇÃO */}
          {/* ============================================ */}
          <div className="border-b border-[#1A1A1A] pb-2 mb-2 mt-8">
            <h2 className="text-lg font-semibold text-white">Finalização</h2>
            <p className="text-xs text-[#555]">Últimas informações antes de enviar</p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-black border border-[#1A1A1A] rounded-lg">
              <input type="checkbox" name="ja_vendeu" checked={form.ja_vendeu} onChange={handleChange} className="w-4 h-4 rounded border-[#1A1A1A]" />
              <span className="text-sm text-[#555]">✅ Já vendi assets antes (em outras plataformas)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-black border border-[#1A1A1A] rounded-lg">
              <input type="checkbox" name="disponibilidade_reunioes" checked={form.disponibilidade_reunioes} onChange={handleChange} className="w-4 h-4 rounded border-[#1A1A1A]" />
              <span className="text-sm text-[#555]">✅ Tenho disponibilidade para reuniões online</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-black border border-white rounded-lg">
              <input type="checkbox" name="aceita_regras" checked={form.aceita_regras} onChange={handleChange} className="w-4 h-4 rounded border-white" />
              <span className="text-sm text-white">✅ Li e concordo com as <a href="/terms" className="underline" target="_blank">regras e termos</a> <span className="text-red-500">*</span></span>
            </label>
          </div>

          {/* Botão Enviar */}
          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 text-base">
              {loading ? 'Enviando...' : <><Send className="h-4 w-4 mr-2" /> Enviar Inscrição</>}
            </Button>
            <p className="text-xs text-[#555] text-center mt-4">
              Após enviar, analisaremos suas informações e entraremos em contato pelo Discord/Email em até 5 dias úteis.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}