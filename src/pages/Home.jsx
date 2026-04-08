// src/pages/Home.jsx - Apenas hero, parceiros e rodapé simples
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'VERCEL', 'DISCORD'];

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

    </div>
  );
}