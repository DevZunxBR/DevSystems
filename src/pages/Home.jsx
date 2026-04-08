// src/pages/Home.jsx - Versão melhorada (adições sutis)
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Zap, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const PARTNERS = ['ROBLOX', 'UNITY', 'UNREAL', 'GITHUB'];

export default function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos em destaque
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const { data } = await base44
        .from('products')
        .select('id, title, price_brl, thumbnail, category')
        .eq('status', 'active')
        .limit(4);
      
      if (data) setFeaturedProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-inter">
      {/* Hero Section */}
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
            <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-13 px-9 text-sm gap-2 rounded-xl transition-transform hover:scale-105">
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

      {/* Produtos em Destaque - Novo */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-16 border-b border-[#1A1A1A]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.3em] mb-2">Destaques</p>
              <h2 className="text-2xl md:text-3xl font-black text-white">Produtos em Destaque</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group cursor-pointer bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden hover:border-[#333] transition-all hover:scale-[1.02]"
                >
                  <div className="aspect-square bg-[#111] flex items-center justify-center">
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[#333] text-xs">Sem imagem</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white truncate">{product.title}</h3>
                    <p className="text-xs text-[#555] mt-1">R$ {product.price_brl?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Parceiros */}
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

      {/* Diferenciais rápidos - Novo */}
      <section className="py-16 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
              <Zap className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-sm font-bold text-white">Entrega Instantânea</h3>
                <p className="text-xs text-[#555]">Download imediato após aprovação</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-sm font-bold text-white">Compra Segura</h3>
                <p className="text-xs text-[#555]">Pagamento protegido e garantido</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
              <Headphones className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-sm font-bold text-white">Suporte Técnico</h3>
                <p className="text-xs text-[#555]">Atendimento no Discord</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-7">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Pronto para começar?</h2>
          <p className="text-[#666] text-base max-w-lg mx-auto">Acesse nossa biblioteca completa com centenas de assets premium desenvolvidos para produção.</p>
          <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-14 px-12 text-sm gap-2 rounded-xl transition-transform hover:scale-105">
            Ir para a Loja <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}