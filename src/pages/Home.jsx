import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Shield, Lock, CreditCard, HeadphonesIcon, FileText, CheckCircle } from 'lucide-react';
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

const TRUST_PILLS = [
  'Pagamento protegido por PIX',
  'Conexao criptografada (SSL)',
  'Politicas publicas e transparentes',
];

const TRUST_CARDS = [
  {
    title: 'Pagamento Seguro',
    description: 'Fluxo de pagamento validado e confirmacao de pedido com rastreio no dashboard.',
    icon: CreditCard,
  },
  {
    title: 'Dados Protegidos',
    description: 'Toda navegacao em ambiente criptografado, com boas praticas de seguranca aplicadas.',
    icon: Lock,
  },
  {
    title: 'Suporte Real',
    description: 'Atendimento para pedidos, downloads e reembolso com processo claro para o cliente.',
    icon: HeadphonesIcon,
  },
];

const SECURITY_POINTS = [
  'Checkout com conexao segura e monitorada.',
  'Historico de pedidos e downloads dentro da conta.',
  'Termos de uso e politica de privacidade acessiveis.',
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

      <section className="border-b border-[#1A1A1A] py-6 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {TRUST_PILLS.map((pill) => (
              <div
                key={pill}
                className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A] bg-[#0A0A0A] px-3 py-1.5 text-[11px] text-[#777]"
              >
                <CheckCircle className="h-3.5 w-3.5 text-white" />
                {pill}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#1A1A1A] py-12 md:py-14 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A] bg-[#0A0A0A] px-3 py-1 text-[10px] uppercase tracking-wider text-[#666]">
              <Shield className="h-3.5 w-3.5 text-white" />
              Confianca e Seguranca
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-black text-white tracking-tight">
              Ambiente profissional para comprar com tranquilidade
            </h2>
            <p className="mt-3 text-sm text-[#777] max-w-2xl mx-auto">
              Estruturamos a loja para que o cliente tenha clareza no processo, protecao nos dados e suporte em todas as etapas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TRUST_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-5">
                  <div className="w-9 h-9 rounded-lg border border-[#222] bg-[#111] flex items-center justify-center mb-4">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-base">{card.title}</h3>
                  <p className="text-sm text-[#666] leading-relaxed mt-2">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-14 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Transparencia em cada etapa da compra</h3>
                <p className="mt-3 text-sm text-[#777] max-w-xl">
                  Queremos que qualquer pessoa entenda como comprar, baixar e solicitar suporte sem dificuldade.
                </p>
                <div className="mt-5 space-y-3">
                  {SECURITY_POINTS.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-white mt-0.5" />
                      <p className="text-sm text-[#666]">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/docs')}
                  className="rounded-xl border border-[#1A1A1A] bg-black px-4 py-4 text-left hover:border-[#333] transition-colors"
                >
                  <FileText className="h-4 w-4 text-white mb-2" />
                  <p className="text-sm font-bold text-white">Documentacao</p>
                  <p className="text-xs text-[#666] mt-1">Veja o fluxo completo da plataforma.</p>
                </button>
                <button
                  onClick={() => navigate('/terms')}
                  className="rounded-xl border border-[#1A1A1A] bg-black px-4 py-4 text-left hover:border-[#333] transition-colors"
                >
                  <Shield className="h-4 w-4 text-white mb-2" />
                  <p className="text-sm font-bold text-white">Termos de Uso</p>
                  <p className="text-xs text-[#666] mt-1">Regras claras para cliente e vendedor.</p>
                </button>
                <button
                  onClick={() => navigate('/privacy')}
                  className="rounded-xl border border-[#1A1A1A] bg-black px-4 py-4 text-left hover:border-[#333] transition-colors"
                >
                  <Lock className="h-4 w-4 text-white mb-2" />
                  <p className="text-sm font-bold text-white">Privacidade</p>
                  <p className="text-xs text-[#666] mt-1">Como tratamos e protegemos os dados.</p>
                </button>
                <button
                  onClick={() => navigate('/store')}
                  className="rounded-xl border border-white bg-white text-black px-4 py-4 text-left hover:bg-white/90 transition-colors"
                >
                  <ArrowRight className="h-4 w-4 mb-2" />
                  <p className="text-sm font-bold">Comecar com seguranca</p>
                  <p className="text-xs text-black/70 mt-1">Explore a loja com mais confianca.</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
