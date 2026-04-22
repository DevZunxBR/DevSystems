// src/pages/admin/ManageCreators.jsx
import { useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, ExternalLink, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function ManageCreators() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

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

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('creator_applications')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      setApplications(prev => prev.map(app => (app.id === id ? { ...app, status } : app)));
      toast.success(status === 'approved' ? 'Criador aprovado!' : 'Inscrição recusada.');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar status');
    }
  };

  const counts = {
    all:      applications.length,
    pending:  applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const statusConfig = {
    pending:  { label: 'Pendente',  color: '#F5A623', bg: 'rgba(245,166,35,0.1)',  Icon: Clock },
    approved: { label: 'Aprovado',  color: '#4ADE80', bg: 'rgba(74,222,128,0.1)',  Icon: CheckCircle2 },
    rejected: { label: 'Recusado',  color: '#F87171', bg: 'rgba(248,113,113,0.1)', Icon: XCircle },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <div style={{ width: 28, height: 28, border: '2px solid #1a1a1a', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#fff', maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ margin: '0 0 4px', fontSize: 10, letterSpacing: '0.2em', color: '#3a3a3a', textTransform: 'uppercase' }}>Admin · DevAssets</p>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>Inscrições de Criadores</h1>
      </div>

      {/* Stat tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { key: 'all',      label: 'Total',     color: '#666' },
          { key: 'pending',  label: 'Pendentes',  color: '#F5A623' },
          { key: 'approved', label: 'Aprovados',  color: '#4ADE80' },
          { key: 'rejected', label: 'Recusados',  color: '#F87171' },
        ].map(s => (
          <button
            key={s.key}
            type="button"
            onClick={() => setFilter(s.key)}
            style={{
              background: filter === s.key ? '#0e0e0e' : 'transparent',
              border: `1px solid ${filter === s.key ? '#222' : '#111'}`,
              borderRadius: 10,
              padding: '12px 14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s',
            }}
          >
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{counts[s.key]}</p>
            <p style={{ margin: '4px 0 0', fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</p>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#2a2a2a', fontSize: 13 }}>Nenhuma inscrição encontrada.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(app => {
            const cfg = statusConfig[app.status] || statusConfig.pending;
            const { Icon } = cfg;
            const isOpen = expandedId === app.id;

            return (
              <div
                key={app.id}
                style={{ background: '#070707', border: '1px solid #131313', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#1e1e1e'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#131313'}
              >
                {/* Main row */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', gap: 14 }}>

                  {/* Avatar */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 9,
                    background: '#0f0f0f', border: '1px solid #1a1a1a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 600, flexShrink: 0
                  }}>
                    {app.nome?.[0]?.toUpperCase() || '?'}
                  </div>

                  {/* Name + email */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{app.nome}</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        padding: '2px 7px', borderRadius: 20,
                        fontSize: 10, fontWeight: 500,
                        background: cfg.bg, color: cfg.color,
                        letterSpacing: '0.05em'
                      }}>
                        <Icon size={9} />
                        {cfg.label}
                      </span>
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#3a3a3a', fontFamily: "'DM Mono', monospace" }}>
                      {app.email}<span style={{ margin: '0 5px', color: '#1e1e1e' }}>·</span>{app.discord_nick}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {app.status === 'pending' && (
                      <>
                        <IconBtn
                          onClick={() => updateStatus(app.id, 'approved')}
                          title="Aprovar"
                          bg="rgba(74,222,128,0.07)"
                          border="rgba(74,222,128,0.12)"
                          hoverBg="rgba(74,222,128,0.18)"
                          hoverBorder="rgba(74,222,128,0.35)"
                          icon={<CheckCircle2 size={13} color="#4ADE80" />}
                        />
                        <IconBtn
                          onClick={() => updateStatus(app.id, 'rejected')}
                          title="Recusar"
                          bg="rgba(248,113,113,0.07)"
                          border="rgba(248,113,113,0.12)"
                          hoverBg="rgba(248,113,113,0.18)"
                          hoverBorder="rgba(248,113,113,0.35)"
                          icon={<XCircle size={13} color="#F87171" />}
                        />
                      </>
                    )}
                    <IconBtn
                      onClick={() => setExpandedId(isOpen ? null : app.id)}
                      title="Detalhes"
                      bg="#0d0d0d"
                      border="#1a1a1a"
                      hoverBg="#161616"
                      hoverBorder="#222"
                      icon={isOpen ? <ChevronUp size={13} color="#555" /> : <ChevronDown size={13} color="#555" />}
                    />
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid #0e0e0e', padding: '18px 18px 18px 70px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '14px 22px' }}>
                      <Field label="WhatsApp"             value={app.telefone} />
                      <Field label="Portfólio"            value={app.portfolio_url} link={app.portfolio_url} />
                      <Field label="Idiomas"              value={app.idiomas} />
                      <Field label="Tipos de Asset"       value={app.tipo_asset} />
                      <Field label="Plataformas"          value={app.plataformas} />
                      <Field label="Disponibilidade"      value={app.disponibilidade} />
                      <Field label="Entrou no Discord"    value={app.entrou_discord} />
                      <Field label="Já vendeu assets"     value={app.ja_vendeu} />
                      <Field label="Disponível p/ reuniões" value={app.disponibilidade_reunioes} />
                      <Field label="Aceita as regras"     value={app.aceita_regras} />

                      {(app.redes_sociais?.instagram || app.redes_sociais?.github || app.redes_sociais?.linkedin) && (
                        <div>
                          <Label>Redes Sociais</Label>
                          {app.redes_sociais?.instagram && <p style={rowStyle}>📷 {app.redes_sociais.instagram}</p>}
                          {app.redes_sociais?.github    && <p style={rowStyle}>💻 {app.redes_sociais.github}</p>}
                          {app.redes_sociais?.linkedin  && <p style={rowStyle}>🔗 {app.redes_sociais.linkedin}</p>}
                        </div>
                      )}

                      {app.experiencia && (
                        <div style={{ gridColumn: '1/-1' }}>
                          <Label>Experiência</Label>
                          <p style={{ margin: 0, fontSize: 13, color: '#999', lineHeight: 1.65 }}>{app.experiencia}</p>
                        </div>
                      )}
                      {app.motivo && (
                        <div style={{ gridColumn: '1/-1' }}>
                          <Label>Por que quer ser criador</Label>
                          <p style={{ margin: 0, fontSize: 13, color: '#999', lineHeight: 1.65 }}>{app.motivo}</p>
                        </div>
                      )}
                      {app.plano_contribuicao && (
                        <div style={{ gridColumn: '1/-1' }}>
                          <Label>Plano de Contribuição</Label>
                          <p style={{ margin: 0, fontSize: 13, color: '#999', lineHeight: 1.65 }}>{app.plano_contribuicao}</p>
                        </div>
                      )}

                      <div style={{ gridColumn: '1/-1', marginTop: 6 }}>
                        <p style={{ margin: 0, fontSize: 10, color: '#222', fontFamily: "'DM Mono', monospace" }}>
                          Enviado em {new Date(app.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── helpers ── */

const rowStyle = { margin: '2px 0 0', fontSize: 13, color: '#bbb' };

function Label({ children }) {
  return <p style={{ margin: '0 0 3px', fontSize: 10, color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{children}</p>;
}

function Field({ label, value, link }) {
  if (!value) return null;
  return (
    <div>
      <Label>{label}</Label>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 13, color: '#5c8fff', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          {value.replace(/^https?:\/\//, '').slice(0, 28)}{value.length > 28 ? '…' : ''}
          <ExternalLink size={10} />
        </a>
      ) : (
        <p style={{ margin: 0, fontSize: 13, color: '#bbb' }}>{value}</p>
      )}
    </div>
  );
}

function IconBtn({ onClick, title, bg, border, hoverBg, hoverBorder, icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 30, height: 30, borderRadius: 7,
        background: hovered ? hoverBg : bg,
        border: `1px solid ${hovered ? hoverBorder : border}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}
    >
      {icon}
    </button>
  );
}