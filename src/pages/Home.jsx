import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Shield, Lock, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import heroBg1 from '@/assets/images/DevHero.jpg';
import heroBg2 from '@/assets/images/DevHero2.jpg';
import heroBg3 from '@/assets/images/DevHero3.jpg';
import heroBg4 from '@/assets/images/DevHero4.jpg';

const HERO_STATS = [
  { value: '500+', label: 'Assets Digitais' },
  { value: '2K+', label: 'Clientes Atendidos' },
  { value: '4.9/5', label: 'Media de Avaliacao' },
];

const SECURITY_POINTS = [
  'Cada compra gera registro no dashboard para acompanhamento.',
  'Aprovacao de pagamento e disponibilidade de download com status visivel.',
  'Politicas publicas para uso, privacidade e suporte.',
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
      <section className="relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-700 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={index !== currentImageIndex}
            >
              <img src={image} alt="Marketplace para desenvolvedores" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/52" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/35" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-4 md:pt-24 md:pb-6 text-center">
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

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A]/80 backdrop-blur-sm py-3 text-center">
                <p className="text-xl md:text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] text-[#555] mt-1 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-14 bg-black">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-6 md:p-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Transparencia em cada etapa da compra</h3>
              <p className="mt-3 text-sm text-[#777] max-w-2xl mx-auto">
                Processo claro, acompanhamento do pedido e documentos publicos para voce comprar com seguranca.
              </p>
            </div>

            <div className="mt-6 space-y-3 max-w-2xl mx-auto">
              {SECURITY_POINTS.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-lg border border-[#1A1A1A] bg-black px-4 py-3">
                  <CheckCircle className="h-4 w-4 text-white mt-0.5" />
                  <p className="text-sm text-[#666]">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => navigate('/docs')}
                className="h-11 rounded-lg border border-[#1A1A1A] bg-black text-sm text-[#999] hover:text-white hover:border-[#333] transition-colors inline-flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Documentacao
              </button>
              <button
                onClick={() => navigate('/terms')}
                className="h-11 rounded-lg border border-[#1A1A1A] bg-black text-sm text-[#999] hover:text-white hover:border-[#333] transition-colors inline-flex items-center justify-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Termos de Uso
              </button>
              <button
                onClick={() => navigate('/privacy')}
                className="h-11 rounded-lg border border-[#1A1A1A] bg-black text-sm text-[#999] hover:text-white hover:border-[#333] transition-colors inline-flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Privacidade
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
