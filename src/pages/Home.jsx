// src/pages/Home.jsx - Versão ultra compacta (sem rodapé)
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'GITHUB'];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-inter bg-black">
      {/* Hero Section - Ultra Compacta */}
      <section className="relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_#1a1a1a_0%,_#000000_100%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16 text-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full px-3 py-1 text-[9px] text-[#999]">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
            Plataforma #1 em assets digitais
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Assets &amp; Sistemas
            <br />
            <span className="text-[#555]">de Alta Performance</span>
          </h1>
          
          <p className="text-xs md:text-sm text-[#999] max-w-2xl mx-auto leading-relaxed">
            Scripts profissionais, sistemas completos e UI kits premium. Desenvolvidos por especialistas, prontos para produção imediata.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-9 px-5 text-xs gap-1.5 rounded-lg">
              Explorar Assets <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/store')} className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-9 px-5 text-xs rounded-lg">
              Ver Categorias <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8 pt-3 border-t border-[#1A1A1A] mt-3">
            {[{ v: '500+', l: 'Assets' }, { v: '2K+', l: 'Clientes' }, { v: '4.9★', l: 'Avaliação' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-lg md:text-xl font-black text-white">{s.v}</div>
                <div className="text-[9px] text-[#555]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros - Ultra Compacto */}
      <section className="border-b border-[#1A1A1A] py-5">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[8px] font-bold text-[#333] uppercase tracking-[0.3em] mb-3">
            Parceiros Oficiais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
            {PARTNERS.map(p => (
              <div key={p} className="text-sm md:text-base font-black text-[#2A2A2A] hover:text-[#444] transition-colors cursor-default tracking-wider select-none">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}// src/pages/Home.jsx - Sem espaços extras
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'GITHUB'];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="font-inter bg-black">
      {/* Hero Section - Sem padding vertical */}
      <section className="relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_#1a1a1a_0%,_#000000_100%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full px-3 py-0.5 text-[8px] text-[#999]">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
            Plataforma #1 em assets digitais
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
            Assets &amp; Sistemas
            <br />
            <span className="text-[#555]">de Alta Performance</span>
          </h1>
          
          <p className="text-xs text-[#999] max-w-2xl mx-auto leading-relaxed">
            Scripts profissionais, sistemas completos e UI kits premium. Desenvolvidos por especialistas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-7 px-3 text-[10px] gap-1 rounded-md">
              Explorar Assets <ArrowRight className="h-2.5 w-2.5" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/store')} className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-7 px-3 text-[10px] rounded-md">
              Ver Categorias <ChevronRight className="h-2.5 w-2.5" />
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-[#1A1A1A] mt-2">
            {[{ v: '500+', l: 'Assets' }, { v: '2K+', l: 'Clientes' }, { v: '4.9★', l: 'Avaliação' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-base md:text-lg font-black text-white">{s.v}</div>
                <div className="text-[8px] text-[#555]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros - Sem padding */}
      <section className="border-b border-[#1A1A1A] py-3">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[7px] font-bold text-[#333] uppercase tracking-[0.3em] mb-1.5">
            Parceiros Oficiais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {PARTNERS.map(p => (
              <div key={p} className="text-[10px] md:text-xs font-black text-[#2A2A2A] hover:text-[#444] transition-colors cursor-default tracking-wider select-none">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}