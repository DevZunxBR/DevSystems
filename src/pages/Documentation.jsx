// src/pages/Documentation.jsx - Versão estilo Home
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ShoppingCart, CreditCard, Download,
  Wallet, RefreshCcw, ShieldCheck, MessageCircle, HelpCircle,
  ChevronRight, Zap, Clock, CheckCircle, ArrowRight,
  Star, Users, Headphones, FileText, Lock, Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Importar os componentes de conteúdo
import ComoComprar from './docs/ComoComprar';
import Pagamento from './docs/Pagamento';
import Downloads from './docs/Downloads';
import Carteira from './docs/Carteira';
import Reembolso from './docs/Reembolso';
import Licencas from './docs/Licencas';
import Suporte from './docs/Suporte';
import Faq from './docs/Faq';

const DOCS_TOPICS = [
  { id: 'como-comprar', title: 'Como Comprar', description: 'Aprenda o passo a passo para adquirir seus assets favoritos.', icon: ShoppingCart, component: ComoComprar },
  { id: 'pagamento', title: 'Pagamento via PIX', description: 'Tudo sobre pagamento instantâneo, chave PIX e aprovação.', icon: CreditCard, component: Pagamento },
  { id: 'downloads', title: 'Downloads', description: 'Como baixar seus arquivos após a aprovação do pedido.', icon: Download, component: Downloads },
  { id: 'carteira', title: 'Carteira & Cashback', description: 'Entenda o cashback de 5% e como usar seu saldo.', icon: Wallet, component: Carteira },
  { id: 'reembolso', title: 'Política de Reembolso', description: 'Condições para solicitar reembolso e prazos.', icon: RefreshCcw, component: Reembolso },
  { id: 'licencas', title: 'Licenças', description: 'Tipos de licença e como usar cada asset.', icon: ShieldCheck, component: Licencas },
  { id: 'suporte', title: 'Suporte', description: 'Canais de atendimento e horário de funcionamento.', icon: MessageCircle, component: Suporte },
  { id: 'faq', title: 'Perguntas Frequentes', description: 'Respostas para as dúvidas mais comuns.', icon: HelpCircle, component: Faq },
];

// Componente de estatísticas
function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-[#555] mt-1 flex items-center justify-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </div>
    </div>
  );
}

export default function Documentation() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(DOCS_TOPICS[0]);
  const ContentComponent = selectedTopic.component;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Estilo Home */}
      <section className="relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_#1a1a1a_0%,_#000000_100%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjMUExQTFBIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full px-4 py-1.5 text-[10px] text-[#999]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Documentação Oficial
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Central de <span className="text-[#555]">Ajuda</span>
          </h1>
          
          <p className="text-sm md:text-base text-[#999] max-w-2xl mx-auto leading-relaxed">
            Tire todas as suas dúvidas sobre compras, downloads, pagamentos e muito mais. 
            Nossa documentação completa está aqui para ajudar você.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-4 border-t border-[#1A1A1A] mt-4">
            <StatCard icon={FileText} value="8+" label="Guias Completos" />
            <StatCard icon={Clock} value="24/7" label="Suporte Disponível" />
            <StatCard icon={Users} value="2K+" label="Clientes Atendidos" />
            <StatCard icon={Star} value="4.9★" label="Avaliação" />
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Lista de tópicos */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              <p className="text-[10px] font-bold text-[#333] uppercase tracking-[0.3em] mb-4 px-2">
                Tópicos da Documentação
              </p>
              {DOCS_TOPICS.map((topic) => {
                const Icon = topic.icon;
                const isActive = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-[#0A0A0A] border border-[#1A1A1A] text-[#555] hover:border-white/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-black/10' : 'bg-[#111]'
                    }`}>
                      <Icon className={`h-5 w-5 ${isActive ? 'text-black' : 'text-white/70'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm font-semibold ${isActive ? 'text-black' : 'text-white'}`}>
                        {topic.title}
                      </h3>
                      <p className={`text-xs ${isActive ? 'text-black/60' : 'text-[#555]'}`}>
                        {topic.description}
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isActive ? 'text-black' : 'text-[#555]'} ${isActive ? 'translate-x-0.5' : ''} transition-transform`} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Conteúdo à direita */}
          <div className="flex-1 min-w-0">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
              <div className="p-6">
                <ContentComponent />
              </div>
            </div>

            {/* Ainda precisa de ajuda? */}
            <div className="mt-8 bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-[#1A1A1A] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ainda precisa de ajuda?</h3>
              <p className="text-sm text-[#555] mb-4 max-w-md mx-auto">
                Nossa equipe de suporte está pronta para ajudar você com qualquer dúvida.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="bg-white text-black hover:bg-white/90 font-bold gap-2"
                >
                  Falar com Suporte <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/store')}
                  className="border-[#1A1A1A] text-[#999] hover:text-white gap-2"
                >
                  Explorar Loja <Zap className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}