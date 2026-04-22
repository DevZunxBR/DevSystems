// src/pages/PartnerForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Check, Send, ChevronRight, ChevronLeft, Circle, CheckCircle } from 'lucide-react';

export default function PartnerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
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
    redes_sociais: { instagram: '', github: '', linkedin: '', twitter: '' },
    disponibilidade: '',
    idiomas: [],
    tipo_asset: [],
    plataformas: [],
    ja_vendeu: false,
    disponibilidade_reunioes: false,
    aceita_regras: false
  });

  const sections = [
    { title: "Informações Pessoais", icon: "👤", description: "Como podemos te chamar?" },
    { title: "Experiência e Motivação", icon: "💡", description: "Conte um pouco sobre você" },
    { title: "Redes Sociais", icon: "🌐", description: "Onde podemos te encontrar?" },
    { title: "Habilidades Técnicas", icon: "⚙️", description: "Quais tecnologias você domina?" },
    { title: "Finalização", icon: "✅", description: "Últimas informações" }
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

  const handleSocialChange = (platform, value) => {
    setForm(prev => ({
      ...prev,
      redes_sociais: { ...prev.redes_sociais, [platform]: value }
    }));
  };

  const nextSection = () => {
    // Validar campos obrigatórios da seção atual
    if (currentSection === 0 && (!form.nome || !form.email || !form.discord_nick)) {
      toast.error('Preencha Nome, Email e Discord');
      return;
    }
    if (currentSection === 4 && !form.aceita_regras) {
      toast.error('Você precisa aceitar as regras');
      return;
    }
    setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
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

  const idiomasList = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Chinês', 'Japonês'];
  const tipoAssetList = ['Scripts', 'Sistemas', 'UI Kits', 'Plugins', 'Templates', 'Assets 3D', 'Sons/Músicas', 'Fontes'];
  const plataformasList = ['Unity', 'Unreal Engine', 'Godot', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'PHP', 'WordPress'];

  const isSectionComplete = (sectionIndex) => {
    if (sectionIndex === 0) return form.nome && form.email && form.discord_nick;
    if (sectionIndex === 4) return form.aceita_regras;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header com progresso */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seja um Criador DevAssets</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preencha o formulário para se tornar um criador oficial</p>
            
            {/* Barra de progresso */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Progresso</span>
                <span>{Math.round(((currentSection + 1) / sections.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Indicador de seções */}
            <div className="flex flex-wrap gap-2 mt-4">
              {sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSection(idx)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-all ${
                    currentSection === idx 
                      ? 'bg-blue-500 text-white' 
                      : isSectionComplete(idx) 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {isSectionComplete(idx) ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Formulário - Estilo Google Forms */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            {/* Cabeçalho da seção */}
            <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sections[currentSection].icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{sections[currentSection].title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{sections[currentSection].description}</p>
                </div>
              </div>
            </div>

            {/* Conteúdo da seção */}
            <div className="p-6 space-y-6">
              
              {/* SEÇÃO 1 - INFORMAÇÕES PESSOAIS */}
              {currentSection === 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" name="nome" value={form.nome} onChange={handleChange}
                      placeholder="Digite seu nome completo"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Discord <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                      placeholder="usuário#0000"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp</label>
                    <input 
                      type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portfólio / GitHub</label>
                    <input 
                      type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                      placeholder="https://github.com/seuusuario"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* SEÇÃO 2 - EXPERIÊNCIA E MOTIVAÇÃO */}
              {currentSection === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experiência na área</label>
                    <textarea 
                      name="experiencia" rows={4} value={form.experiencia} onChange={handleChange}
                      placeholder="Conte sobre sua experiência com desenvolvimento, criação de assets, etc."
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Por que você quer ser um criador DevAssets?</label>
                    <textarea 
                      name="motivo" rows={4} value={form.motivo} onChange={handleChange}
                      placeholder="Conte sua motivação"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plano de Contribuição (Metas)</label>
                    <textarea 
                      name="plano_contribuicao" rows={3} value={form.plano_contribuicao} onChange={handleChange}
                      placeholder="Quantos assets planeja criar por mês? Quais tipos?"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <input type="checkbox" name="entrou_discord" checked={form.entrou_discord} onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Já entrei no Discord da DevAssets</span>
                  </label>
                </>
              )}

              {/* SEÇÃO 3 - REDES SOCIAIS */}
              {currentSection === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram</label>
                    <input 
                      type="text" value={form.redes_sociais.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      placeholder="@seuusuario"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub</label>
                    <input 
                      type="text" value={form.redes_sociais.github} onChange={(e) => handleSocialChange('github', e.target.value)}
                      placeholder="github.com/seuusuario"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
                    <input 
                      type="text" value={form.redes_sociais.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/seuusuario"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                </>
              )}

              {/* SEÇÃO 4 - HABILIDADES TÉCNICAS */}
              {currentSection === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Idiomas que você domina</label>
                    <div className="flex flex-wrap gap-2">
                      {idiomasList.map(idioma => (
                        <button key={idioma} type="button"
                          onClick={() => handleMultiSelect('idiomas', idioma)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            form.idiomas.includes(idioma) 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}>
                          {idioma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipos de asset que você cria</label>
                    <div className="flex flex-wrap gap-2">
                      {tipoAssetList.map(tipo => (
                        <button key={tipo} type="button"
                          onClick={() => handleMultiSelect('tipo_asset', tipo)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            form.tipo_asset.includes(tipo) 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}>
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plataformas que você conhece</label>
                    <div className="flex flex-wrap gap-2">
                      {plataformasList.map(plataforma => (
                        <button key={plataforma} type="button"
                          onClick={() => handleMultiSelect('plataformas', plataforma)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            form.plataformas.includes(plataforma) 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}>
                          {plataforma}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Disponibilidade</label>
                    <textarea 
                      name="disponibilidade" rows={2} value={form.disponibilidade} onChange={handleChange}
                      placeholder="Quantas horas por semana pode dedicar?"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                </>
              )}

              {/* SEÇÃO 5 - FINALIZAÇÃO */}
              {currentSection === 4 && (
                <>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <input type="checkbox" name="ja_vendeu" checked={form.ja_vendeu} onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Já vendi assets antes</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <input type="checkbox" name="disponibilidade_reunioes" checked={form.disponibilidade_reunioes} onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Tenho disponibilidade para reuniões</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-blue-500">
                      <input type="checkbox" name="aceita_regras" checked={form.aceita_regras} onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Li e concordo com as <a href="/terms" className="text-blue-500 hover:underline" target="_blank">regras e termos</a> <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      📝 Após enviar, analisaremos suas informações e entraremos em contato pelo Discord/Email em até 5 dias úteis.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Botões de navegação */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              {currentSection > 0 && (
                <Button type="button" onClick={prevSection} variant="outline" className="gap-2">
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
              )}
              
              {currentSection < sections.length - 1 ? (
                <Button type="button" onClick={nextSection} className="bg-blue-500 hover:bg-blue-600 text-white gap-2 ml-auto">
                  Próximo <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white gap-2 ml-auto">
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