import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Headphones, Star, Code, Package, Layers, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'VERCEL', 'DISCORD'];

const WHY_US = [
  { icon: ShieldCheck, title: 'Segurança Garantida', desc: 'Todos os arquivos são verificados antes da publicação. Compra 100% protegida e segura.' },
  { icon: Zap, title: 'Entrega Instantânea', desc: 'Após aprovação do pagamento seus arquivos ficam disponíveis imediatamente no painel.' },
  { icon: Headphones, title: 'Suporte Técnico', desc: 'Equipe disponível para auxiliar na implementação e resolver qualquer dúvida técnica.' },
];

const CATEGORIES = [
  { icon: Code, name: 'Scripts', count: '50+', desc: 'Scripts prontos para uso' },
  { icon: Layers, name: 'Systems', count: '30+', desc: 'Sistemas completos' },
  { icon: Package, name: 'UI Kits', count: '20+', desc: 'Interfaces premium' },
];

const TESTIMONIALS = [
  { name: 'Lucas M.', role: 'Developer', rating: 5, text: 'Melhor marketplace de scripts que já usei. Qualidade impecável e suporte rápido.' },
  { name: 'Ana R.', role: 'Designer', rating: 5, text: 'Entrega instantânea funcionou perfeitamente. Os assets são de altíssima qualidade.' },
  { name: 'Pedro S.', role: 'Game Dev', rating: 5, text: 'Os sistemas são extremamente bem documentados. Recomendo para todos os devs.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-inter bg-[#000]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[520px] flex items-end border-b border-[#1A1A1A]">
        {/* background image */}
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

        <div className="relative max-w-7xl mx-auto px-6 pb-10 pt-28 w-full">
          <p className="text-[11px] text-[#888] mb-3 tracking-wide">
            Plataforma #1 em assets digitais para desenvolvedores
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] max-w-2xl mb-4">
            Assets &amp; Sistemas de Alta Performance
          </h1>
          <p className="text-sm text-[#999] max-w-lg mb-7 leading-relaxed">
            Scripts profissionais, sistemas completos e UI kits premium. Desenvolvidos por especialistas, prontos para produção imediata.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => navigate('/store')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded hover:bg-white/90 transition-colors"
            >
              Explorar Assets <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/store')}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#444] text-white text-sm font-semibold rounded hover:border-white transition-colors"
            >
              Ver Categorias <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 pt-6 border-t border-[#1A1A1A]">
            {[{ v: '500+', l: 'Assets Digitais' }, { v: '2K+', l: 'Clientes' }, { v: '4.9★', l: 'Avaliação Média' }].map(s => (
              <div key={s.l}>
                <div className="text-2xl font-black text-white">{s.v}</div>
                <div className="text-[11px] text-[#555] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <section className="border-b border-[#1A1A1A] py-5 bg-[#000]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-8 md:gap-16">
          {PARTNERS.map(p => (
            <span key={p} className="text-sm font-black text-[#2A2A2A] tracking-widest select-none">{p}</span>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 border-b border-[#1A1A1A] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:gap-12">
            <div className="flex-shrink-0 mb-8 md:mb-0 md:w-64">
              <p className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] mb-2">Categorias em Destaque</p>
              <h2 className="text-3xl font-black text-white leading-tight">Explore por<br />Categoria</h2>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => navigate(`/store?cat=${cat.name}`)}
                  className="group bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-5 text-left hover:border-[#333] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-white">{cat.name}</span>
                    <span className="text-[10px] text-[#555] font-mono bg-[#111] px-1.5 py-0.5 rounded">{cat.count}</span>
                  </div>
                  <p className="text-xs text-[#555]">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-16 border-b border-[#1A1A1A] bg-[#000]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] mb-2">Nossos Diferenciais</p>
          <h2 className="text-2xl font-black text-white mb-8">Por que nos escolher?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WHY_US.map((item, i) => (
              <div key={item.title} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-white flex-shrink-0" />
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-xs text-[#666] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 border-b border-[#1A1A1A] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:gap-12">
          {/* Left label */}
          <div className="md:w-56 flex-shrink-0 mb-8 md:mb-0">
            <p className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] mb-2">Depoimentos</p>
            <h2 className="text-2xl font-black text-white leading-tight">O que dizem nossos clientes</h2>
          </div>
          {/* Cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TESTIMONIALS.slice(0, 2).map(t => (
              <div key={t.name} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-5 space-y-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-white text-white" />)}
                </div>
                <p className="text-xs text-[#888] leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-2 pt-2 border-t border-[#1A1A1A]">
                  <div className="w-7 h-7 bg-[#111] border border-[#222] rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{t.name}</div>
                    <div className="text-[10px] text-[#555]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / FOOTER BAND ── */}
      <section className="bg-gradient-to-br from-[#0A0A1A] via-[#050510] to-[#000] py-16 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-start md:gap-16">
          {/* Brand col */}
          <div className="md:w-72 flex-shrink-0 mb-10 md:mb-0 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-black text-xs">M</span>
              </div>
              <span className="text-white font-bold text-base">Marketplace</span>
            </div>
            <p className="text-xs text-[#555] leading-relaxed max-w-xs">
              Assets e sistemas digitais completos com centenas de assets desenvolvidos para produção.
            </p>
            <button
              onClick={() => navigate('/store')}
              className="flex items-center gap-2 px-4 py-2 border border-[#333] text-white text-xs font-semibold rounded hover:border-white transition-colors"
            >
              Ir para a Loja <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Link cols */}
          <div className="flex-1 grid grid-cols-3 gap-8">
            {[
              { title: 'LOJA', links: ['Asset Library', 'Systems', 'UI Kits'] },
              { title: 'CONTA', links: ['Dashboard', 'Meus Pedidos', 'Configurações'] },
              { title: 'SUPORTE', links: ['Documentação', 'Política de Uso', 'Reembolsos'] },
            ].map(col => (
              <div key={col.title} className="space-y-3">
                <h4 className="text-[9px] font-bold text-[#444] uppercase tracking-[0.25em]">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <button
                        onClick={() => navigate(link === 'Asset Library' || link === 'Systems' || link === 'UI Kits' ? '/store' : link === 'Dashboard' ? '/dashboard' : link === 'Meus Pedidos' ? '/dashboard/orders' : link === 'Configurações' ? '/dashboard/settings' : '#')}
                        className="text-xs text-[#555] hover:text-white transition-colors"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-[#111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[11px] text-[#333]">© 2026 Marketplace. Todos os direitos reservados.</p>
          <p className="text-[11px] text-[#333]">Pagamentos processados via PIX</p>
        </div>
      </section>

    </div>
  );
}