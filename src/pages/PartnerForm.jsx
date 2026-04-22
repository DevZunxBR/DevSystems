// src/pages/PartnerForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Check, Send } from 'lucide-react';

export default function PartnerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const idiomasList = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Chinês', 'Japonês'];
  const tipoAssetList = ['Scripts', 'Sistemas', 'UI Kits', 'Plugins', 'Templates', 'Assets 3D', 'Sons/Músicas', 'Fontes'];
  const plataformasList = ['Unity', 'Unreal Engine', 'Godot', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'PHP', 'WordPress'];

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#555] hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Seja um Criador DevAssets</h1>
            <p className="text-sm text-[#555] mt-2">
              Junte-se à nossa plataforma e comece a vender seus assets
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-[#1A1A1A] pb-2">Informações Pessoais</h2>
              
              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Nome Completo *</label>
                <input type="text" name="nome" value={form.nome} onChange={handleChange}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Nick do Discord *</label>
                <input type="text" name="discord_nick" value={form.discord_nick} onChange={handleChange}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Telefone (WhatsApp)</label>
                <input type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Link do Portfólio</label>
                <input type="url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange}
                  placeholder="https://..." className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white" />
              </div>
            </div>

            {/* Experiência e Motivação */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-[#1A1A1A] pb-2">Experiência e Motivação</h2>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Experiência na área</label>
                <textarea name="experiencia" rows={3} value={form.experiencia} onChange={handleChange}
                  placeholder="Conte sobre sua experiência com desenvolvimento, criação de assets, etc."
                  className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white resize-none" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Motivo de entrada</label>
                <textarea name="motivo" rows={3} value={form.motivo} onChange={handleChange}
                  placeholder="Por que você quer ser um criador DevAssets?"
                  className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white resize-none" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Plano de Contribuição (Metas)</label>
                <textarea name="plano_contribuicao" rows={2} value={form.plano_contribuicao} onChange={handleChange}
                  placeholder="Quantos assets planeja criar por mês? Quais tipos?"
                  className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white focus:outline-none focus:border-white resize-none" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="entrou_discord" checked={form.entrou_discord} onChange={handleChange}
                  className="w-4 h-4 rounded border-[#1A1A1A]" />
                <span className="text-sm text-white">Entre em nosso Discord</span>
              </label>
            </div>

            {/* Redes Sociais */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-[#1A1A1A] pb-2">Redes Sociais</h2>
              
              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Instagram</label>
                <input type="text" value={form.redes_sociais.instagram} onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">GitHub</label>
                <input type="text" value={form.redes_sociais.github} onChange={(e) => handleSocialChange('github', e.target.value)}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">LinkedIn</label>
                <input type="text" value={form.redes_sociais.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  className="w-full h-11 px-4 bg-black border border-[#1A1A1A] rounded-lg text-white" />
              </div>
            </div>

            {/* Habilidades */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-[#1A1A1A] pb-2">Habilidades</h2>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Disponibilidade e Compromisso</label>
                <textarea name="disponibilidade" rows={2} value={form.disponibilidade} onChange={handleChange}
                  placeholder="Quantas horas por semana pode dedicar?"
                  className="w-full px-4 py-2 bg-black border border-[#1A1A1A] rounded-lg text-white" />
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Idiomas que domina</label>
                <div className="flex flex-wrap gap-2">
                  {idiomasList.map(idioma => (
                    <button key={idioma} type="button"
                      onClick={() => handleMultiSelect('idiomas', idioma)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        form.idiomas.includes(idioma) ? 'bg-white text-black' : 'bg-[#1A1A1A] text-[#555] hover:text-white'
                      }`}>
                      {idioma}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Tipo de asset que você cria</label>
                <div className="flex flex-wrap gap-2">
                  {tipoAssetList.map(tipo => (
                    <button key={tipo} type="button"
                      onClick={() => handleMultiSelect('tipo_asset', tipo)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        form.tipo_asset.includes(tipo) ? 'bg-white text-black' : 'bg-[#1A1A1A] text-[#555] hover:text-white'
                      }`}>
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#555] block mb-1">Plataformas que você conhece</label>
                <div className="flex flex-wrap gap-2">
                  {plataformasList.map(plataforma => (
                    <button key={plataforma} type="button"
                      onClick={() => handleMultiSelect('plataformas', plataforma)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        form.plataformas.includes(plataforma) ? 'bg-white text-black' : 'bg-[#1A1A1A] text-[#555] hover:text-white'
                      }`}>
                      {plataforma}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Perguntas finais */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="ja_vendeu" checked={form.ja_vendeu} onChange={handleChange}
                  className="w-4 h-4 rounded border-[#1A1A1A]" />
                <span className="text-sm text-white">Você já vendeu assets antes?</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="disponibilidade_reunioes" checked={form.disponibilidade_reunioes} onChange={handleChange}
                  className="w-4 h-4 rounded border-[#1A1A1A]" />
                <span className="text-sm text-white">Você tem disponibilidade para reuniões?</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="aceita_regras" checked={form.aceita_regras} onChange={handleChange}
                  className="w-4 h-4 rounded border-[#1A1A1A]" />
                <span className="text-sm text-white">Você já leu e concorda com as regras? *</span>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-white/90 font-bold h-12">
              {loading ? 'Enviando...' : <><Send className="h-4 w-4 mr-2" /> Enviar Inscrição</>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}