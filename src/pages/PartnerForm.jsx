// src/pages/PartnerForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Send, ChevronRight, ChevronLeft, User, Mail, MessageCircle, Phone, Link2, Briefcase, Target, Instagram, Github, Linkedin, Languages, Code2, Globe, Clock, CheckCircle, Sparkles, TrendingUp, Users, Shield, Award, MessageSquare, Home, Clock3, AlertCircle } from 'lucide-react';
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
    { title: "Identidade", description: "Dados básicos para contato" },
    { title: "Trajetória", description: "Sua experiência profissional" },
    { title: "Redes", description: "Onde te encontrar online" },
    { title: "Stack", description: "Tecnologias que domina" },
    { title: "Finalização", description: "Últimas informações" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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

  const focusProps = (name) => ({
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null),
  });

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Botão voltar */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#555] hover:text-white mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* COLUNA ESQUERDA - FORMULÁRIO (3 colunas) */}
          <div className="lg:col-span-3">
            
            {/* Header com logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#0A0A0A] rounded-xl flex items-center justify-center overflow-hidden">
                  {!logoLoadError ? (
                    <img src={logoImage} alt="DevAssets" className="w-12 h-12 object-contain" onError={() => setLogoLoadError(true)} />
                  ) : (
                    <span className="text-white font-bold text-xl">DA</span>
                  )}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">Formulário de Inscrição</h1>
              <p className="text-sm text-[#555] mt-1">Torne-se um criador oficial da DevAssets</p>
            </div>

            {/* Step breadcrumb */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-6 py-4 mb-6">
              <div className="flex items-center gap-2 flex-wrap text-sm">
                {pages.map((p, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className={i === currentPage ? 'text-white font-semibold' : 'text-[#555]'}>
                      {p.title}
                    </span>
                    {i < pages.length - 1 && <span className="text-[#333]">/</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Form card */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">{pages[currentPage].title}</h2>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* PAGE 0 - IDENTIDADE */}
                {currentPage === 0 && (
                  <>
                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'nome' ? 'text-white' : 'text-[#555]'}`}>
                        Nome Completo
                      </label>
                      <input type="text" name="nome" value={form.nome} onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200"
                        {...focusProps('nome')} />
                    </div>

                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'email' ? 'text-white' : 'text-[#555]'}`}>
                        E-mail
                      </label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200"
                        {...focusProps('email')} />
                    </div>

                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'discord' ? 'text-white' : 'text-[#555]'}`}>
                        Discord
                      </label>
                      <input type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                        placeholder="usuário#0000"
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200"
                        {...focusProps('discord')} />
                    </div>

                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'telefone' ? 'text-white' : 'text-[#555]'}`}>
                        WhatsApp
                      </label>
                      <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200"
                        {...focusProps('telefone')} />
                    </div>

                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'portfolio' ? 'text-white' : 'text-[#555]'}`}>
                        Portfólio / GitHub
                      </label>
                      <input type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200"
                        {...focusProps('portfolio')} />
                    </div>
                  </>
                )}

                {/* PAGE 1 - TRAJETÓRIA */}
                {currentPage === 1 && (
                  <>
                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'experiencia' ? 'text-white' : 'text-[#555]'}`}>
                        Experiência na área
                      </label>
                      <textarea name="experiencia" rows={5} value={form.experiencia} onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200 resize-none"
                        {...focusProps('experiencia')} />
                    </div>

                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'motivo' ? 'text-white' : 'text-[#555]'}`}>
                        Por que quer ser criador?
                      </label>
                      <textarea name="motivo" rows={5} value={form.motivo} onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200 resize-none"
                        {...focusProps('motivo')} />
                    </div>

                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'plano' ? 'text-white' : 'text-[#555]'}`}>
                        Plano de Contribuição
                      </label>
                      <textarea name="plano_contribuicao" rows={4} value={form.plano_contribuicao} onChange={handleChange}
                        placeholder="Quantos assets planeja criar por mês?"
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200 resize-none"
                        {...focusProps('plano')} />
                    </div>
                  </>
                )}

                {/* PAGE 2 - REDES */}
                {currentPage === 2 && (
                  <>
                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'instagram' ? 'text-white' : 'text-[#555]'}`}>
                        Instagram
                      </label>
                      <input type="text" value={form.redes_sociais.instagram}
                        onChange={e => setForm({ ...form, redes_sociais: { ...form.redes_sociais, instagram: e.target.value } })}
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200"
                        {...focusProps('instagram')} />
                    </div>

                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'github' ? 'text-white' : 'text-[#555]'}`}>
                        GitHub
                      </label>
                      <input type="text" value={form.redes_sociais.github}
                        onChange={e => setForm({ ...form, redes_sociais: { ...form.redes_sociais, github: e.target.value } })}
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200"
                        {...focusProps('github')} />
                    </div>

                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'linkedin' ? 'text-white' : 'text-[#555]'}`}>
                        LinkedIn
                      </label>
                      <input type="text" value={form.redes_sociais.linkedin}
                        onChange={e => setForm({ ...form, redes_sociais: { ...form.redes_sociais, linkedin: e.target.value } })}
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200"
                        {...focusProps('linkedin')} />
                    </div>
                  </>
                )}

                {/* PAGE 3 - STACK */}
                {currentPage === 3 && (
                  <div className="space-y-7">
                    <div>
                      <label className="block text-sm text-[#555] mb-3">Idiomas</label>
                      <div className="flex flex-wrap gap-2">
                        {idiomasList.map(idioma => (
                          <button key={idioma} type="button" onClick={() => handleMultiSelect('idiomas', idioma)}
                            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                              form.idiomas.includes(idioma) 
                                ? 'bg-white text-black' 
                                : 'bg-[#1A1A1A] text-[#555] hover:text-white'
                            }`}>
                            {idioma}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#555] mb-3">Tipos de Asset</label>
                      <div className="flex flex-wrap gap-2">
                        {tipoAssetList.map(tipo => (
                          <button key={tipo} type="button" onClick={() => handleMultiSelect('tipo_asset', tipo)}
                            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                              form.tipo_asset.includes(tipo) 
                                ? 'bg-white text-black' 
                                : 'bg-[#1A1A1A] text-[#555] hover:text-white'
                            }`}>
                            {tipo}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#555] mb-3">Plataformas</label>
                      <div className="flex flex-wrap gap-2">
                        {plataformasList.map(plataforma => (
                          <button key={plataforma} type="button" onClick={() => handleMultiSelect('plataformas', plataforma)}
                            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                              form.plataformas.includes(plataforma) 
                                ? 'bg-white text-black' 
                                : 'bg-[#1A1A1A] text-[#555] hover:text-white'
                            }`}>
                            {plataforma}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm mb-1.5 transition-colors duration-200 ${focusedField === 'disponibilidade' ? 'text-white' : 'text-[#555]'}`}>
                        Disponibilidade semanal
                      </label>
                      <input type="text" name="disponibilidade" value={form.disponibilidade} onChange={handleChange}
                        placeholder="Ex: 10–15 horas por semana"
                        className="w-full px-3 py-2.5 bg-black border border-[#1A1A1A] rounded-lg text-white text-sm focus:outline-none focus:border-white transition-colors duration-200"
                        {...focusProps('disponibilidade')} />
                    </div>
                  </div>
                )}

                {/* PAGE 4 - FINALIZAÇÃO */}
                {currentPage === 4 && (
                  <div className="space-y-5">
                    <div className="bg-black border border-[#1A1A1A] rounded-lg p-4 space-y-2.5">
                      <p className="text-xs text-[#555] uppercase tracking-widest mb-3">Resumo</p>
                      {[
                        { label: 'Nome', value: form.nome },
                        { label: 'Email', value: form.email },
                        { label: 'Discord', value: form.discord_nick },
                        { label: 'Assets', value: form.tipo_asset.join(', ') },
                        { label: 'Plataformas', value: form.plataformas.join(', ') },
                      ].filter(r => r.value).map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-[#555]">{label}</span>
                          <span className="text-white">{value}</span>
                        </div>
                      ))}
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer pt-2">
                      <input type="checkbox" name="aceita_regras" checked={form.aceita_regras} onChange={(e) => setForm(prev => ({ ...prev, aceita_regras: e.target.checked }))}
                        className="mt-0.5 w-4 h-4 rounded border-white accent-white" />
                      <span className="text-sm text-white">
                        Li e concordo com as <a href="/terms" className="underline hover:text-gray-300" target="_blank">regras e termos</a>
                      </span>
                    </label>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center gap-3 pt-3">
                  {currentPage > 0 && (
                    <button type="button" onClick={prevPage}
                      className="flex items-center gap-1.5 px-5 py-2.5 text-sm text-[#555] hover:text-white transition-colors">
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
          </div>

          {/* COLUNA DIREITA - SIDEBAR FIXA (2 colunas - IGUAL CHECKOUT) */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              
              {/* CARD DE STATUS - IGUAL AOS PEDIDOS */}
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-white">Status da Candidatura</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-white">Aguardando análise</span>
                  </div>
                  <p className="text-xs text-[#555]">
                    Após enviar, sua candidatura será analisada pela nossa equipe em até 5 dias úteis.
                  </p>
                </div>
              </div>

              {/* CARD DE BENEFÍCIOS */}
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">Benefícios do Programa</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-white" />
                    <span className="text-xs text-white">Comissão de até 70%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-white" />
                    <span className="text-xs text-white">Visibilidade na plataforma</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-white" />
                    <span className="text-xs text-white">Proteção de IP</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-white" />
                    <span className="text-xs text-white">Selo oficial de criador</span>
                  </div>
                </div>
              </div>

              {/* CARD DE SUPORTE */}
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">Precisa de ajuda?</h3>
                <button
                  onClick={() => window.open('https://discord.gg/devassets', '_blank')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium rounded-lg transition-colors mb-3">
                  <MessageSquare className="h-4 w-4" /> Entrar no Discord
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#1A1A1A] text-[#555] hover:text-white text-sm font-medium rounded-lg transition-colors">
                  <Home className="h-4 w-4" /> Voltar ao início
                </button>
              </div>

              {/* CARD DE INFORMAÇÃO */}
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-[#555]" />
                  <span className="text-xs text-[#555]">Informação</span>
                </div>
                <p className="text-xs text-[#555]">
                  Todos os campos são obrigatórios. Após aprovado, você receberá um e-mail com as instruções de acesso ao painel do criador.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}