// src/pages/admin/ManageCreators.jsx
import { useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';

export default function ManageCreators() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('creator_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Inscrições de Criadores</h1>
        <p className="text-sm text-[#555] mt-1">{applications.length} inscrição(ões) recebida(s)</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <p className="text-[#555]">Nenhuma inscrição recebida ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
              <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">{app.nome}</h3>
                    </div>
                    <p className="text-sm text-[#555] mt-1">{app.email} • Discord: {app.discord_nick}</p>
                    <p className="text-xs text-[#555] mt-1">
                      Enviado em: {new Date(app.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#1A1A1A] text-white rounded-lg hover:bg-[#222] transition-colors"
                  >
                    {expandedId === app.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    <Eye className="h-3 w-3" />
                    {expandedId === app.id ? 'Ocultar' : 'Ver Detalhes'}
                  </button>
                </div>

                {expandedId === app.id && (
                  <div className="mt-4 pt-4 border-t border-[#1A1A1A] space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#555]">Telefone</p>
                        <p className="text-sm text-white">{app.telefone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#555]">Portfólio</p>
                        {app.portfolio_url ? (
                          <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
                            {app.portfolio_url}
                          </a>
                        ) : <p className="text-sm text-white">-</p>}
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-[#555]">Experiência</p>
                        <p className="text-sm text-white">{app.experiencia || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-[#555]">Motivo</p>
                        <p className="text-sm text-white">{app.motivo || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-[#555]">Plano de Contribuição</p>
                        <p className="text-sm text-white">{app.plano_contribuicao || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-[#555]">Disponibilidade</p>
                        <p className="text-sm text-white">{app.disponibilidade || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#555]">Idiomas</p>
                        <p className="text-sm text-white">{app.idiomas || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#555]">Tipos de Asset</p>
                        <p className="text-sm text-white">{app.tipo_asset || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-[#555]">Plataformas</p>
                        <p className="text-sm text-white">{app.plataformas || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#555]">Redes Sociais</p>
                        <div className="text-sm text-white space-y-1">
                          {app.redes_sociais?.instagram && <p>📷 Instagram: {app.redes_sociais.instagram}</p>}
                          {app.redes_sociais?.github && <p>💻 GitHub: {app.redes_sociais.github}</p>}
                          {app.redes_sociais?.linkedin && <p>🔗 LinkedIn: {app.redes_sociais.linkedin}</p>}
                          {!app.redes_sociais?.instagram && !app.redes_sociais?.github && !app.redes_sociais?.linkedin && <p>-</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#555]">Entrou no Discord:</span>
                          <span className="text-sm text-white">{app.entrou_discord || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#555]">Já vendeu assets:</span>
                          <span className="text-sm text-white">{app.ja_vendeu || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#555]">Disponível para reuniões:</span>
                          <span className="text-sm text-white">{app.disponibilidade_reunioes || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#555]">Aceita as regras:</span>
                          <span className="text-sm text-white">{app.aceita_regras || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}