// src/pages/Home.jsx - Sem altura mínima forçada
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'GITHUB'];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="font-inter bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_#1a1a1a_0%,_#000000_100%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-12 text-center space-y-4">
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
            <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-8 px-4 text-xs gap-1.5 rounded-lg">
              Explorar Assets <ArrowRight className="h-3 w-3" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/store')} className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-8 px-4 text-xs rounded-lg">
              Ver Categorias <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8 pt-3 border-t border-[#1A1A1A] mt-2">
            {[{ v: '500+', l: 'Assets' }, { v: '2K+', l: 'Clientes' }, { v: '4.9★', l: 'Avaliação' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-lg md:text-xl font-black text-white">{s.v}</div>
                <div className="text-[9px] text-[#555]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros */}
      <section className="border-b border-[#1A1A1A] py-4">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[8px] font-bold text-[#333] uppercase tracking-[0.3em] mb-2">
            Parceiros Oficiais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {PARTNERS.map(p => (
              <div key={p} className="text-xs md:text-sm font-black text-[#2A2A2A] hover:text-[#444] transition-colors cursor-default tracking-wider select-none">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}