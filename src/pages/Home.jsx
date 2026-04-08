// src/pages/Home.jsx - Sem nenhum padding vertical
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'GITHUB'];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="font-inter bg-black">
      {/* Hero Section - Sem padding */}
      <section className="relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_#1a1a1a_0%,_#000000_100%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full px-2 py-0.5 text-[8px] text-[#999]">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
            Plataforma #1
          </div>
          
          <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white tracking-tight leading-[1.1]">
            Assets &amp; Sistemas
            <br />
            <span className="text-[#555]">de Alta Performance</span>
          </h1>
          
          <p className="text-[10px] text-[#999] max-w-2xl mx-auto leading-relaxed">
            Scripts profissionais, sistemas completos e UI kits premium.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
            <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-6 px-2.5 text-[9px] gap-1 rounded">
              Explorar <ArrowRight className="h-2 w-2" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/store')} className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-6 px-2.5 text-[9px] rounded">
              Categorias <ChevronRight className="h-2 w-2" />
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1.5 border-t border-[#1A1A1A] mt-1.5">
            {[{ v: '500+', l: 'Assets' }, { v: '2K+', l: 'Clientes' }, { v: '4.9★', l: 'Avaliação' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-sm md:text-base font-black text-white">{s.v}</div>
                <div className="text-[7px] text-[#555]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros - Sem padding */}
      <section className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[6px] font-bold text-[#333] uppercase tracking-[0.3em] mb-1">
            Parceiros Oficiais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 pb-1">
            {PARTNERS.map(p => (
              <div key={p} className="text-[9px] md:text-[10px] font-black text-[#2A2A2A] hover:text-[#444] transition-colors cursor-default tracking-wider select-none">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}