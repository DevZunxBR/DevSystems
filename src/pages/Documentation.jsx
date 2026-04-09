// src/pages/Documentation.jsx - Agora carrega o conteúdo na mesma página
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ShoppingCart, CreditCard, Download,
  Wallet, RefreshCcw, ShieldCheck, MessageCircle, HelpCircle,
  ChevronRight
} from 'lucide-react';

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

export default function Documentation() {
  const [selectedTopic, setSelectedTopic] = useState(DOCS_TOPICS[0]);
  const ContentComponent = selectedTopic.component;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Central de Ajuda</h1>
              <p className="text-sm text-[#555] mt-0.5">Tire suas dúvidas sobre a plataforma</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Lista de tópicos */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              {DOCS_TOPICS.map((topic) => {
                const Icon = topic.icon;
                const isActive = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-white text-black'
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
                    <ChevronRight className={`h-4 w-4 ${isActive ? 'text-black' : 'text-[#555]'}`} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Conteúdo à direita */}
          <div className="flex-1 min-w-0">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
              <ContentComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}