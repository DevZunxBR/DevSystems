// src/pages/PartnerForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { Send, ChevronRight, ChevronLeft, User, Mail, MessageCircle, Phone, Link2, Briefcase, Target, Instagram, Github, Linkedin, Languages, Code2, Globe, Clock, CheckCircle, Sparkles, TrendingUp, Users, Shield, Award, MessageSquare, Home, ArrowLeft } from 'lucide-react';

export default function PartnerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    { title: "Identidade", description: "Como podemos te chamar?", icon: User },
    { title: "Trajetória", description: "Conte sua história", icon: Briefcase },
    { title: "Redes", description: "Onde te encontrar", icon: Globe },
    { title: "Stack", description: "Suas ferramentas", icon: Code2 },
    { title: "Finalização", description: "Últimos passos", icon: CheckCircle },
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header estilo Google Meet */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Voltar</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">DevAssets Creator</span>
          </div>
        </div>

        {/* Progresso estilo Google Meet */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-semibold text-gray-900">Torne-se um Criador</h1>
            <span className="text-sm text-gray-500">{currentPage + 1} de {pages.length}</span>
          </div>
          
          {/* Barra de progresso */}
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA - FORMULÁRIO */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              
              {/* Título da página */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  {pages[currentPage].icon && <pages[currentPage].icon className="h-5 w-5 text-blue-500" />}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{pages[currentPage].title}</h2>
                  <p className="text-sm text-gray-500">{pages[currentPage].description}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* PAGE 0 - IDENTIDADE */}
                {currentPage === 0 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                      <input type="text" name="nome" value={form.nome} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Seu nome completo" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="seu@email.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discord</label>
                      <input type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="usuário#0000" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                      <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="(11) 99999-9999" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Portfólio / GitHub</label>
                      <input type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="https://github.com/seuusuario" />
                    </div>
                  </>
                )}

                {/* PAGE 1 - TRAJETÓRIA */}
                {currentPage === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experiência na área</label>
                      <textarea name="experiencia" rows={4} value={form.experiencia} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Conte sobre sua experiência..." />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Por que quer ser um criador?</label>
                      <textarea name="motivo" rows={4} value={form.motivo} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Conte sua motivação..." />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plano de Contribuição</label>
                      <textarea name="plano_contribuicao" rows={3} value={form.plano_contribuicao} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Quantos assets por mês?" />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="entrou_discord" checked={form.entrou_discord} onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                      <span className="text-sm text-gray-600">✅ Já entrei no Discord da DevAssets</span>
                    </label>
                  </>
                )}

                {/* PAGE 2 - REDES */}
                {currentPage === 2 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                      <input type="text" value={form.redes_sociais.instagram}
                        onChange={e => setForm({ ...form, redes_sociais: { ...form.redes_sociais, instagram: e.target.value } })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="@usuario" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                      <input type="text" value={form.redes_sociais.github}
                        onChange={e => setForm({ ...form, redes_sociais: { ...form.redes_sociais, github: e.target.value } })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="github.com/usuario" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <input type="text" value={form.redes_sociais.linkedin}
                        onChange={e => setForm({ ...form, redes_sociais: { ...form.redes_sociais, linkedin: e.target.value } })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="linkedin.com/in/usuario" />
                    </div>
                  </>
                )}

                {/* PAGE 3 - STACK */}
                {currentPage === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Idiomas</label>
                      <div className="flex flex-wrap gap-2">
                        {idiomasList.map(idioma => (
                          <button key={idioma} type="button" onClick={() => handleMultiSelect('idiomas', idioma)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                              form.idiomas.includes(idioma) 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}>
                            {idioma}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Tipos de Asset</label>
                      <div className="flex flex-wrap gap-2">
                        {tipoAssetList.map(tipo => (
                          <button key={tipo} type="button" onClick={() => handleMultiSelect('tipo_asset', tipo)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                              form.tipo_asset.includes(tipo) 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}>
                            {tipo}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Plataformas</label>
                      <div className="flex flex-wrap gap-2">
                        {plataformasList.map(plataforma => (
                          <button key={plataforma} type="button" onClick={() => handleMultiSelect('plataformas', plataforma)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                              form.plataformas.includes(plataforma) 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}>
                            {plataforma}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidade</label>
                      <input type="text" name="disponibilidade" value={form.disponibilidade} onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Ex: 10-15 horas por semana" />
                    </div>
                  </div>
                )}

                {/* PAGE 4 - FINALIZAÇÃO */}
                {currentPage === 4 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-5 space-y-2">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Resumo da candidatura</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nome</span>
                          <span className="text-gray-900 font-medium">{form.nome || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email</span>
                          <span className="text-gray-900 font-medium">{form.email || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Discord</span>
                          <span className="text-gray-900 font-medium">{form.discord_nick || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Assets</span>
                          <span className="text-gray-900 font-medium">{form.tipo_asset.join(', ') || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="ja_vendeu" checked={form.ja_vendeu} onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                      <span className="text-sm text-gray-600">💰 Já vendi assets antes</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="disponibilidade_reunioes" checked={form.disponibilidade_reunioes} onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                      <span className="text-sm text-gray-600">🎥 Tenho disponibilidade para reuniões</span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer pt-2">
                      <input type="checkbox" name="aceita_regras" checked={form.aceita_regras} onChange={handleChange}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">
                        Li e concordo com as <a href="/terms" className="text-blue-500 hover:underline" target="_blank">regras e termos</a>
                      </span>
                    </label>
                  </div>
                )}

                {/* Botões de navegação */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  {currentPage > 0 && (
                    <button type="button" onClick={prevPage}
                      className="flex items-center gap-2 px-6 py-2.5 text-gray-600 hover:text-gray-900 transition-colors">
                      <ChevronLeft className="h-4 w-4" /> Anterior
                    </button>
                  )}
                  <div className="flex-1" />
                  {currentPage < pages.length - 1 ? (
                    <button type="button" onClick={nextPage}
                      className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                      Continuar <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button type="submit" disabled={loading}
                      className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                      {loading ? 'Enviando...' : <><Send className="h-4 w-4" /> Enviar</>}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* COLUNA DIREITA - SIDEBAR ESTILO GOOGLE MEET */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              
              {/* Card de informações */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-gray-500">Status</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aguardando análise</h3>
                <p className="text-sm text-gray-500">
                  Após enviar, sua candidatura será analisada em até 5 dias úteis.
                </p>
              </div>

              {/* Card de benefícios */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Benefícios</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm text-gray-600">Comissão de até 70%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm text-gray-600">Visibilidade na plataforma</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm text-gray-600">Proteção de IP</span>
                  </div>
                </div>
              </div>

              {/* Card de suporte */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Suporte</h3>
                <button
                  onClick={() => window.open('https://discord.gg/devassets', '_blank')}
                  className="w-full py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium rounded-xl transition-colors mb-2">
                  Entrar no Discord
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2.5 border border-gray-200 text-gray-600 hover:text-gray-900 text-sm font-medium rounded-xl transition-colors">
                  Voltar ao início
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}