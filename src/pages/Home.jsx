import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import heroBg1 from '@/assets/images/DevHero.jpg';
import heroBg2 from '@/assets/images/DevHero2.jpg';
import heroBg3 from '@/assets/images/DevHero3.jpg';
import heroBg4 from '@/assets/images/DevHero4.jpg';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL ENGINE', 'CRYENGINE', 'CREATION ENGINE'];

const HERO_STATS = [
  { value: '500+', label: 'Assets Digitais' },
  { value: '2K+', label: 'Clientes Atendidos' },
  { value: '4.9/5', label: 'Media de Avaliacao' },
];

export default function Home() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = useMemo(() => [heroBg1, heroBg2, heroBg3, heroBg4], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div>
      <section className="relative min-h-[540px] md:min-h-[620px] overflow-hidden border-b border-[#1A1A1A] flex items-center">
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-700 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={index !== currentImageIndex}
            >
              <img src={image} alt="Marketplace para desenvolvedores" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/75" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 border border-[#1A1A1A] bg-[#0A0A0A]/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-[#999]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Marketplace profissional para assets e sistemas de desenvolvimento
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Assets e sistemas
            <br />
            <span className="text-[#666]">prontos para producao</span>
          </h1>

          <p className="mt-5 text-sm md:text-base text-[#999] max-w-2xl mx-auto leading-relaxed">
            Encontre componentes, templates e solucoes completas para acelerar entregas com padrao profissional.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => navigate('/store')}
              className="h-11 px-6 rounded-xl bg-white text-black hover:bg-white/90 font-bold text-sm gap-2"
            >
              Explorar Loja
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/store')}
              className="h-11 px-6 rounded-xl border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white text-sm"
            >
              Ver Categorias
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1A1A1A] grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl md:text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[11px] text-[#555] mt-1 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#1A1A1A] py-6 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[9px] font-bold text-[#333] uppercase tracking-[0.28em] mb-3">
            Plataformas e Ecossistemas
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-10">
            {PARTNERS.map((partner) => (
              <div
                key={partner}
                className="text-sm md:text-base font-black text-[#222] hover:text-[#444] transition-colors cursor-default tracking-wider select-none"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
