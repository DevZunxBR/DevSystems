import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Headphones, Star, Code, Package, Layers, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'GITHUB', 'VERCEL', 'DISCORD'];

const WHY_US = [
  { icon: ShieldCheck, title: 'Segurança Garantida', desc: 'Todos os arquivos são verificados antes da publicação. Compra 100% protegida e segura.' },
  { icon: Zap, title: 'Entrega Manual', desc: 'Após aprovação do pagamento seus arquivos ficam disponíveis imediatamente no painel. Para Download Livre' },
  { icon: Headphones, title: 'Suporte Técnico', desc: 'No Discord, equipe disponível para auxiliar na implementação e resolver qualquer dúvida técnica.' },
];

const CATEGORIES = [
  { icon: Code, name: 'Scripts', count: '0+', desc: 'Scripts prontos para uso' },
  { icon: Layers, name: 'Systems', count: '30+', desc: 'Sistemas completos' },
  { icon: Package, name: 'UI Kits', count: '20+', desc: 'Interfaces premium' },
];

const TESTIMONIALS = [
  { name: 'Lucas M.', role: 'Desenvolvedor', rating: 5, text: 'Melhor marketplace de scripts que já usei. Qualidade impecável e suporte rápido.' },
  { name: 'Ana R.', role: 'Designer', rating: 5, text: 'Entrega instantânea funcionou perfeitamente. Os assets são de altíssima qualidade.' },
  { name: 'Pedro S.', role: 'Game Dev', rating: 5, text: 'Os sistemas são extremamente bem documentados. Recomendo para todos os devs.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-inter">
      <section className="relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_#1a1a1a_0%,_#000000_100%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjMUExQTFBIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 py-32 md:py-48 text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full px-5 py-2 text-xs text-[#999]">
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
      </section>

      <section className="border-b border-[#1A1A1A] py-12">
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

      <section className="py-24 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 space-y-14">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.3em]">Categorias em Destaque</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Explore por Categoria</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => (
              <button key={cat.name} onClick={() => navigate(`/store?cat=${cat.name}`)}
                className="group bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 text-left hover:border-[#333] transition-all space-y-4">
                <div className="w-12 h-12 bg-[#111] rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                  <cat.icon className="h-6 w-6 text-[#555] group-hover:text-black transition-colors" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                    <span className="text-xs text-[#555] font-mono">{cat.count}</span>
                  </div>
                  <p className="text-sm text-[#555] mt-1">{cat.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#555] group-hover:text-white transition-colors">
                  Ver todos <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 space-y-14">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.3em]">Nossos Diferenciais</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Por que nos escolher?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_US.map(item => (
              <div key={item.title} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 space-y-5 hover:border-[#333] transition-all">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
                  <item.icon className="h-7 w-7 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 space-y-14">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.3em]">Depoimentos</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">O que dizem nossos clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-7 space-y-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-white text-white" />)}
                </div>
                <p className="text-sm text-[#888] leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#1A1A1A]">
                  <div className="w-9 h-9 bg-[#111] rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-[#555]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32">
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