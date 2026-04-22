// src/pages/PartnerForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Check, Send, ChevronRight, ChevronLeft, Circle, CheckCircle, Users } from 'lucide-react';
import logoImage from '@/assets/images/Logo.png';

export default function PartnerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
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
    { title: "Informações Pessoais", icon: "👤" },
    { title: "Experiência e Motivação", icon: "💡" },
    { title: "Redes Sociais", icon: "🌐" },
    { title: "Habilidades Técnicas", icon: "⚙️" },
    { title: "Finalização", icon: "✅" }
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
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header com logo */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#555] hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-white">
                  {!logoLoadError ? (
                    <img
                      src={logoImage}
                      alt="DevAssets"
                      className="w-full h-full object-contain p-1"
                      onError={() => setLogoLoadError(true)}
                    />
                  ) : (
                    <span className="text-black font-black text-sm">DA</span>
                  )}
                </div>
                <span className="text-white font-bold text-xl tracking-tight">DevAssets</span>
              </div>
            </div>

            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-white">Seja um Criador</h1>
              <p className="text-sm text-[#555] mt-1">Junte-se à nossa plataforma e comece a vender seus assets</p>
            </div>
            
            {/* Barra de progresso */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-[#555] mb-2">
                <span>Progresso</span>
                <span>{Math.round(((currentSection + 1) / sections.length) * 100)}%</span>
              </div>
              <div className="w-full bg-[#1A1A1A] rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Indicador de seções */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSection(idx)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-all ${
                    currentSection === idx 
                      ? 'bg-white text-black' 
                      : isSectionComplete(idx) 
                        ? 'bg-white/10 text-white'
                        : 'bg-[#1A1A1A] text-[#555] hover:text-white'
                  }`}
                >
                  {isSectionComplete(idx) ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                  <span className="hidden sm:inline">{section.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
            
            {/* Cabeçalho da seção */}
            <div className="px-6 py-4 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sections[currentSection].icon}</span>
                <h2 className="text-lg font-semibold text-white">{sections[currentSection].title}</h2>
              </div>
            </div>

            {/* Conteúdo da seção */}
            <div className="p-6 space-y-5">
              
              {/* SEÇÃO 1 - INFORMAÇÕES PESSOAIS */}
              {currentSection === 0 && (
                <>
                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">Nome Completo <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="nome" value={form.nome} onChange={handleChange}
                      placeholder="Digite seu nome completo"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">Discord <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                      placeholder="usuário#0000"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">WhatsApp</label>
                    <input 
                      type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">Portfólio / GitHub</label>
                    <input 
                      type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                      placeholder="https://github.com/seuusuario"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </>
              )}

              {/* SEÇÃO 2 - EXPERIÊNCIA E MOTIVAÇÃO */}
              {currentSection === 1 && (
                <>
                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">Experiência na área</label>
                    <textarea 
                      name="experiencia" rows={4} value={form.experiencia} onChange={handleChange}
                      placeholder="Conte sobre sua experiência com desenvolvimento, criação de assets, etc."
                      className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">Por que você quer ser um criador DevAssets?</label>
                    <textarea 
                      name="motivo" rows={4} value={form.motivo} onChange={handleChange}
                      placeholder="Conte sua motivação"
                      className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">Plano de Contribuição (Metas)</label>
                    <textarea 
                      name="plano_contribuicao" rows={3} value={form.plano_contribuicao} onChange={handleChange}
                      placeholder="Quantos assets planeja criar por mês? Quais tipos?"
                      className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-black border border-[#1A1A1A] rounded-lg">
                    <input type="checkbox" name="entrou_discord" checked={form.entrou_discord} onChange={handleChange}
                      className="w-4 h-4 rounded border-[#1A1A1A]" />
                    <span className="text-sm text-[#555]">Já entrei no Discord da DevAssets</span>
                  </label>
                </>
              )}

              {/* SEÇÃO 3 - REDES SOCIAIS */}
              {currentSection === 2 && (
                <>
                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">Instagram</label>
                    <input 
                      type="text" value={form.redes_sociais.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      placeholder="@seuusuario"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">GitHub</label>
                    <input 
                      type="text" value={form.redes_sociais.github} onChange={(e) => handleSocialChange('github', e.target.value)}
                      placeholder="github.com/seuusuario"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-1">LinkedIn</label>
                    <input 
                      type="text" value={form.redes_sociais.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/seuusuario"
                      className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white"
                    />
                  </div>
                </>
              )}

              {/* SEÇÃO 4 - HABILIDADES TÉCNICAS */}
              {currentSection === 3 && (
                <>
                  <div>
                    <label className="text-xs font-medium text-[#555] block mb-2">Idiomas que você domina</label>
                    <div className="flex flex-wrap gap-2">
                      {idiomasList.map(idioma => (
                        <button key={idioma} type="button"
                          onClick={() => handleMultiSelect('idiomas', idioma)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${
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
                    <label className="text-xs font-medium text-[#555] block mb-2">Tipos de asset que você cria</label>
                    <div className="flex flex-wrap gap-2">
                      {tipoAssetList.map(tipo => (
                        <button key={tipo} type="button"
                          onClick={() => handleMultiSelect('tipo_asset', tipo)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${
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
                    <label className="text-xs font-medium text-[#555] block mb-2">Plataformas que você conhece</label>
                    <div className="flex flex-wrap gap-2">
                      {plataformasList.map(plataforma => (
                        <button key={plataforma} type="button"
                          onClick={() => handleMultiSelect('plataformas', plataforma)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${
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
                    <label className="text-xs font-medium text-[#555] block mb-1">Disponibilidade</label>
                    <textarea 
                      name="disponibilidade" rows={2} value={form.disponibilidade} onChange={handleChange}
                      placeholder="Quantas horas por semana pode dedicar?"
                      className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-white"
                    />
                  </div>
                </>
              )}

              {/* SEÇÃO 5 - FINALIZAÇÃO */}
              {currentSection === 4 && (
                <>
                  <div className="space-y-3">
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
                      <span className="text-sm text-white">
                        Li e concordo com as <a href="/terms" className="text-white underline" target="_blank">regras</a> <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>

                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <p className="text-xs text-[#555] text-center">
                      📝 Após enviar, analisaremos suas informações e entraremos em contato pelo Discord/Email em até 5 dias úteis.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Botões de navegação */}
            <div className="px-6 py-4 border-t border-[#1A1A1A] flex justify-between">
              {currentSection > 0 && (
                <Button type="button" onClick={prevSection} variant="outline" className="border-[#1A1A1A] text-[#555] hover:text-white hover:bg-[#1A1A1A] gap-2">
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
              )}
              
              {currentSection < sections.length - 1 ? (
                <Button type="button" onClick={nextSection} className={`bg-white text-black hover:bg-white/90 font-semibold gap-2 ${currentSection === 0 ? 'ml-auto' : ''}`}>
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