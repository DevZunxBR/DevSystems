// src/pages/Home.jsx - Ultra compacto
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Importe suas imagens aqui
import heroBg1 from '@/assets/images/DevHero.jpg';
import heroBg2 from '@/assets/images/DevHero2.jpg';
import heroBg3 from '@/assets/images/DevHero3.jpg';
import heroBg4 from '@/assets/images/DevHero4.jpg';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'GITHUB'];

export default function Home() {
  const navigate = useNavigate();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const backgroundImages = [heroBg1, heroBg2, heroBg3, heroBg4];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 10000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="font-inter">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#1A1A1A] flex items-center">
        <div className="absolute inset-0">
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={img} alt="Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/70" />
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-10 text-center space-y-4 z-10">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#1A1A1A] rounded-full px-3 py-1 text-[9px] text-[#999]">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
            Plataforma #1 em assets digitais
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Assets &amp; Sistemas
            <br />
            <span className="text-[#555]">de Alta Performance</span>
          </h1>
          
          <p className="text-xs text-[#999] max-w-2xl mx-auto leading-relaxed">
            Scripts profissionais, sistemas completos e UI kits premium. Desenvolvidos por especialistas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-8 px-4 text-[10px] gap-1 rounded-lg">
              Explorar Assets <ArrowRight className="h-3 w-3" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/store')} className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-8 px-4 text-[10px] rounded-lg">
              Ver Categorias <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-5 pt-2 border-t border-[#1A1A1A] mt-2">
            {[{ v: '500+', l: 'Assets' }, { v: '2K+', l: 'Clientes' }, { v: '4.9★', l: 'Avaliação' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-base md:text-lg font-black text-white">{s.v}</div>
                <div className="text-[8px] text-[#555]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros */}
      <section className="border-b border-[#1A1A1A] py-3 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[7px] font-bold text-[#333] uppercase tracking-[0.3em] mb-1.5">
            Parceiros Oficiais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
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