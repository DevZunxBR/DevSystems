import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Headphones, Star, Code, Package, Layers, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Constantes extraídas para fora do componente
const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'GITHUB', 'VERCEL', 'DISCORD'];

const WHY_US = [
  { icon: ShieldCheck, title: 'Segurança Garantida', desc: 'Todos os arquivos são verificados antes da publicação. Compra 100% protegida e segura.' },
  { icon: Zap, title: 'Entrega Instantânea', desc: 'Após aprovação do pagamento seus arquivos ficam disponíveis imediatamente no painel.' },
  { icon: Headphones, title: 'Suporte Técnico', desc: 'Equipe disponível para auxiliar na implementação e resolver qualquer dúvida técnica.' },
];

const CATEGORIES = [
  { icon: Code, name: 'Scripts', count: '50+', desc: 'Scripts prontos para uso', filterValue: 'Scripts' },
  { icon: Layers, name: 'Systems', count: '30+', desc: 'Sistemas completos', filterValue: 'Systems' },
  { icon: Package, name: 'UI Kits', count: '20+', desc: 'Interfaces premium', filterValue: 'UI%20Kits' },
];

const TESTIMONIALS = [
  { name: 'Lucas M.', role: 'Desenvolvedor', rating: 5, text: 'Melhor marketplace de scripts que já usei. Qualidade impecável e suporte rápido.', avatarInitial: 'L' },
  { name: 'Ana R.', role: 'Designer', rating: 5, text: 'Entrega instantânea funcionou perfeitamente. Os assets são de altíssima qualidade.', avatarInitial: 'A' },
  { name: 'Pedro S.', role: 'Game Dev', rating: 5, text: 'Os sistemas são extremamente bem documentados. Recomendo para todos os devs.', avatarInitial: 'P' },
];

// Componentes menores memoizados
const StatCard = memo(({ value, label }) => (
  <div className="text-center">
    <div className="text-2xl font-black text-white">{value}</div>
    <div className="text-xs text-[#555] mt-1">{label}</div>
  </div>
));

const PartnerLogo = memo(({ name }) => (
  <div 
    className="text-lg md:text-xl font-black text-[#222] hover:text-[#444] transition-colors cursor-default tracking-widest select-none"
    aria-label={`Parceiro: ${name}`}
  >
    {name}
  </div>
));

const CategoryCard = memo(({ category, onNavigate }) => {
  const handleClick = useCallback(() => {
    onNavigate(`/store?cat=${category.filterValue}`);
  }, [category.filterValue, onNavigate]);

  return (
    <button
      onClick={handleClick}
      className="group bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 text-left hover:border-[#333] transition-all space-y-4 focus:outline-none focus:ring-2 focus:ring-white/20"
      aria-label={`Ver categoria ${category.name} - ${category.count} itens`}
    >
      <div className="w-12 h-12 bg-[#111] rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
        <category.icon className="h-6 w-6 text-[#555] group-hover:text-black transition-colors" aria-hidden="true" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{category.name}</h3>
          <span className="text-xs text-[#555] font-mono" aria-label={`${category.count} itens disponíveis`}>{category.count}</span>
        </div>
        <p className="text-sm text-[#555] mt-1">{category.desc}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-[#555] group-hover:text-white transition-colors">
        Ver todos <ChevronRight className="h-3 w-3" aria-hidden="true" />
      </div>
    </button>
  );
});

const WhyUsCard = memo(({ item }) => (
  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 space-y-5 hover:border-[#333] transition-all">
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center" aria-hidden="true">
      <item.icon className="h-7 w-7 text-black" />
    </div>
    <h3 className="text-xl font-bold text-white">{item.title}</h3>
    <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>
  </div>
));

const TestimonialCard = memo(({ testimonial }) => (
  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-7 space-y-4">
    <div className="flex gap-0.5" aria-label={`Avaliação: ${testimonial.rating} estrelas`}>
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-white text-white" aria-hidden="true" />
      ))}
    </div>
    <p className="text-sm text-[#888] leading-relaxed">"{testimonial.text}"</p>
    <div className="flex items-center gap-3 pt-2 border-t border-[#1A1A1A]">
      <div 
        className="w-9 h-9 bg-[#111] rounded-full flex items-center justify-center text-xs font-bold text-white"
        aria-label={`Avatar de ${testimonial.name}`}
      >
        {testimonial.avatarInitial}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{testimonial.name}</div>
        <div className="text-xs text-[#555]">{testimonial.role}</div>
      </div>
    </div>
  </div>
));

// Componente principal
export default memo(function Home() {
  const navigate = useNavigate();

  // Callbacks memoizados
  const handleNavigateToStore = useCallback(() => {
    navigate('/store');
  }, [navigate]);

  const handleCategoryNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  // Dados estáticos memoizados
  const statsData = useMemo(() => [
    { value: '500+', label: 'Assets Digitais' },
    { value: '2K+', label: 'Clientes' },
    { value: '4.9★', label: 'Avaliação Média' }
  ], []);

  return (
    <div className="min-h-screen font-inter">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden border-b border-[#1A1A1A]"
        aria-label="Seção principal de apresentação"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_#1a1a1a_0%,_#000000_100%)]" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            backgroundImage: 'url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjMUExQTFBIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvZz48L3N2Zz4=\')',
            backgroundRepeat: 'repeat'
          }}
          aria-hidden="true"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 py-32 md:py-48 text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full px-5 py-2 text-xs text-[#999]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" aria-hidden="true" />
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
            <Button 
              onClick={handleNavigateToStore} 
              className="bg-white text-black hover:bg-white/90 font-bold h-13 px-9 text-sm gap-2 rounded-xl"
              aria-label="Explorar assets disponíveis na loja"
            >
              Explorar Assets <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button 
              variant="outline" 
              onClick={handleNavigateToStore} 
              className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-13 px-9 text-sm rounded-xl"
              aria-label="Ver todas as categorias de produtos"
            >
              Ver Categorias <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-8 border-t border-[#1A1A1A] mt-8">
            {statsData.map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Parceiros */}
      <section 
        className="border-b border-[#1A1A1A] py-12"
        aria-label="Parceiros e plataformas oficiais"
      >
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] font-bold text-[#333] uppercase tracking-[0.3em] mb-8">
            Parceiros &amp; Plataformas Oficiais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
            {PARTNERS.map((partner) => (
              <PartnerLogo key={partner} name={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Categorias */}
      <section 
        className="py-24 border-b border-[#1A1A1A]"
        aria-label="Categorias de produtos em destaque"
      >
        <div className="max-w-7xl mx-auto px-4 space-y-14">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.3em]">Categorias em Destaque</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Explore por Categoria</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <CategoryCard 
                key={category.name} 
                category={category} 
                onNavigate={handleCategoryNavigate} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Diferenciais */}
      <section 
        className="py-24 border-b border-[#1A1A1A]"
        aria-label="Diferenciais da plataforma"
      >
        <div className="max-w-7xl mx-auto px-4 space-y-14">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.3em]">Nossos Diferenciais</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Por que nos escolher?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_US.map((item) => (
              <WhyUsCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Depoimentos */}
      <section 
        className="py-24 border-b border-[#1A1A1A]"
        aria-label="Depoimentos de clientes"
      >
        <div className="max-w-7xl mx-auto px-4 space-y-14">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.3em]">Depoimentos</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">O que dizem nossos clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section 
        className="py-32"
        aria-label="Chamada para ação - começar agora"
      >
        <div className="max-w-3xl mx-auto px-4 text-center space-y-7">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Pronto para começar?</h2>
          <p className="text-[#666] text-base max-w-lg mx-auto">
            Acesse nossa biblioteca completa com centenas de assets premium desenvolvidos para produção.
          </p>
          <Button 
            onClick={handleNavigateToStore} 
            className="bg-white text-black hover:bg-white/90 font-bold h-14 px-12 text-sm gap-2 rounded-xl"
            aria-label="Ir para a loja e começar a comprar"
          >
            Ir para a Loja <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </div>
  );
});







































































































