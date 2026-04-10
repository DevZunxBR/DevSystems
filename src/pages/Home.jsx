import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Shield, Lock, CheckCircle, HeadphonesIcon } from 'lucide-react';
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

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Escolher',
    description: 'Navegue pela loja, compare categorias e selecione o asset ideal para seu projeto.',
  },
  {
    step: '02',
    title: 'Pagar',
    description: 'Finalize via PIX em ambiente seguro e acompanhe o status da aprovacao em tempo real.',
  },
  {
    step: '03',
    title: 'Baixar',
    description: 'Com o pedido aprovado, acesse seus arquivos no dashboard e baixe com praticidade.',
  },
];

const TRUST_ITEMS = [
  {
    title: 'Compra protegida',
    detail: 'Pagamento via PIX com validacao e status visivel no dashboard.',
    icon: Shield,
  },
  {
    title: 'Dados protegidos',
    detail: 'Navegacao em conexao criptografada e politicas publicas.',
    icon: Lock,
  },
  {
    title: 'Suporte humano',
    detail: 'Atendimento para pedidos, download e reembolso quando necessario.',
    icon: HeadphonesIcon,
  },
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
              <div className="absolute inset-0 bg-black/78" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/35" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-14 pb-6 md:pt-20 md:pb-8 text-center">
          <div className="inline-flex items-center gap-2 border border-[#1A1A1A] bg-[#0A0A0A]/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-[#999]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Marketplace profissional para assets e sistemas de desenvolvimento
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
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

          <div className="mt-8 pt-5 border-t border-[#1A1A1A] grid grid-cols-3 gap-3 max-w-3xl mx-auto">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg md:text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] text-[#555] mt-1 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#1A1A1A] py-12 md:py-14 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Como funciona</h2>
            <p className="mt-3 text-sm text-[#777] max-w-2xl mx-auto">
              Fluxo simples e direto para comprar com seguranca: escolher, pagar e baixar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-5">
                <p className="text-[11px] font-bold text-[#666] tracking-wider">ETAPA {item.step}</p>
                <h3 className="mt-2 text-white text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm text-[#666] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-14 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Transparencia em cada etapa da compra</h3>
                <p className="mt-3 text-sm text-[#777] max-w-xl">
                  Do checkout ao download, voce acompanha o que esta acontecendo e sabe exatamente qual e o proximo passo.
                </p>
                <div className="mt-5 space-y-3">
                  {SECURITY_POINTS.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-white mt-0.5" />
                      <p className="text-sm text-[#666]">{point}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/docs')}
                    className="h-10 rounded-lg border-[#1A1A1A] text-[#999] hover:text-white hover:bg-black"
                  >
                    Ver Documentacao
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/terms')}
                    className="h-10 rounded-lg border-[#1A1A1A] text-[#999] hover:text-white hover:bg-black"
                  >
                    Ler Termos
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {TRUST_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-xl border border-[#1A1A1A] bg-black px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center">
                          <Icon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <p className="text-sm font-bold text-white">{item.title}</p>
                      </div>
                      <p className="text-xs text-[#666] mt-2 leading-relaxed">{item.detail}</p>
                    </div>
                  );
                })}
                <div className="rounded-xl border border-[#1A1A1A] bg-black px-4 py-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-white">Documentacao e politicas</p>
                    <p className="text-xs text-[#666] mt-1">Tudo publico e acessivel antes da compra.</p>
                  </div>
                  <button
                    onClick={() => navigate('/privacy')}
                    className="text-xs text-[#999] hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    Abrir
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
