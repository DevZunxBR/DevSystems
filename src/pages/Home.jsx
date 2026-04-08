// src/pages/Home.jsx - Versão compacta (sem espaços vazios)
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'GITHUB'];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-inter bg-black">
      {/* Hero Section - Compacta */}
      <section className="relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_#1a1a1a_0%,_#000000_100%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full px-4 py-1.5 text-[10px] text-[#999]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Plataforma #1 em assets digitais
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Assets &amp; Sistemas
            <br />
            <span className="text-[#555]">de Alta Performance</span>
          </h1>
          
          <p className="text-sm md:text-base text-[#999] max-w-2xl mx-auto leading-relaxed">
            Scripts profissionais, sistemas completos e UI kits premium. Desenvolvidos por especialistas, prontos para produção imediata.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-11 px-6 text-sm gap-2 rounded-lg">
              Explorar Assets <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/store')} className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-11 px-6 text-sm rounded-lg">
              Ver Categorias <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-4 border-t border-[#1A1A1A] mt-4">
            {[{ v: '500+', l: 'Assets Disponíveis' }, { v: '2K+', l: 'Clientes' }, { v: '4.9★', l: 'Avaliação Média' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-xl md:text-2xl font-black text-white">{s.v}</div>
                <div className="text-[10px] text-[#555] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros - Compacto */}
      <section className="border-b border-[#1A1A1A] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[9px] font-bold text-[#333] uppercase tracking-[0.3em] mb-5">
            Parceiros &amp; Plataformas Oficiais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {PARTNERS.map(p => (
              <div key={p} className="text-base md:text-lg font-black text-[#222] hover:text-[#444] transition-colors cursor-default tracking-widest select-none">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rodapé simples */}
      <footer className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-[#333]">© 2026 Marketplace. Todos os direitos reservados.</p>
            <p className="text-[10px] text-[#333]">Pagamentos processados via PIX</p>
          </div>
        </div>
      </footer>
    </div>
  );
}