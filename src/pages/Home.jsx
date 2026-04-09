// src/pages/Home.jsx - Com slideshow de imagens de fundo
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
  
  // Slideshow state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Lista de imagens de fundo
  const backgroundImages = [heroBg1, heroBg2, heroBg3, heroBg4];

  // Trocar imagem a cada 5 segundos
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
    <div className="min-h-screen font-inter">
      {/* Hero Section com Slideshow */}
      <section className="relative overflow-hidden border-b border-[#1A1A1A] min-h-[600px] flex items-center">
        {/* Imagem de fundo com fade */}
        <div className="absolute inset-0">
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img}
                alt="Background"
                className="w-full h-full object-cover"
              />
              {/* Overlay escuro para contraste do texto */}
              <div className="absolute inset-0 bg-black/70" />
            </div>
          ))}
        </div>
        
        {/* Gradiente adicional */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-32 md:py-48 text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#1A1A1A] rounded-full px-5 py-2 text-xs text-[#999]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Plataforma #1 em assets digitais para desenvolvedores
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-[0.88]">
            Assets &amp; Sistemas
            <br />
            <span className="text-[#555]">de Alta Performance</span>
          </h1>
          
          <p className="text-base md:text-xl text-[#999] max-w-2xl mx-auto leading-relaxed">
            Scripts profissionais, sistemas completos e UI kits premium. Desenvolvidos por especialistas, prontos para produção imediata.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-13 px-9 text-sm gap-2 rounded-xl">
              Explorar Assets <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/store')} className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-13 px-9 text-sm rounded-xl">
              Ver Categorias <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-8 border-t border-[#1A1A1A] mt-8">
            {[{ v: '500+', l: 'Assets Digitais' }, { v: '2K+', l: 'Clientes' }, { v: '4.9★', l: 'Avaliação Média' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-black text-white">{s.v}</div>
                <div className="text-xs text-[#555] mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Indicadores de slide (bolinhas) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index === currentImageIndex) return;
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentImageIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentImageIndex === index 
                  ? 'bg-white w-6' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Parceiros */}
      <section className="border-b border-[#1A1A1A] py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] font-bold text-[#333] uppercase tracking-[0.3em] mb-8">
            Parceiros &amp; Plataformas Oficiais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
            {PARTNERS.map(p => (
              <div key={p} className="text-lg md:text-xl font-black text-[#222] hover:text-[#444] transition-colors cursor-default tracking-widest select-none">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-black">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-7">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Pronto para começar?</h2>
          <p className="text-[#666] text-base max-w-lg mx-auto">Acesse nossa biblioteca completa com centenas de assets premium desenvolvidos para produção.</p>
          <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-14 px-12 text-sm gap-2 rounded-xl">
            Ir para a Loja <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}