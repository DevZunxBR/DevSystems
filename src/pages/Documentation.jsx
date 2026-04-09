// src/pages/Documentation.jsx - Página principal
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ShoppingCart, CreditCard, Download,
  Wallet, RefreshCcw, ShieldCheck, MessageCircle, HelpCircle,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DOCS_TOPICS = [
  {
    id: 'como-comprar',
    title: 'Como Comprar',
    description: 'Aprenda o passo a passo para adquirir seus assets favoritos.',
    icon: ShoppingCart,
    color: 'bg-blue-500/10 border-blue-500/20'
  },
  {
    id: 'pagamento',
    title: 'Pagamento via PIX',
    description: 'Tudo sobre pagamento instantâneo, chave PIX e aprovação.',
    icon: CreditCard,
    color: 'bg-green-500/10 border-green-500/20'
  },
  {
    id: 'downloads',
    title: 'Downloads',
    description: 'Como baixar seus arquivos após a aprovação do pedido.',
    icon: Download,
    color: 'bg-purple-500/10 border-purple-500/20'
  },
  {
    id: 'carteira',
    title: 'Carteira & Cashback',
    description: 'Entenda o cashback de 5% e como usar seu saldo.',
    icon: Wallet,
    color: 'bg-yellow-500/10 border-yellow-500/20'
  },
  {
    id: 'reembolso',
    title: 'Política de Reembolso',
    description: 'Condições para solicitar reembolso e prazos.',
    icon: RefreshCcw,
    color: 'bg-red-500/10 border-red-500/20'
  },
  {
    id: 'licencas',
    title: 'Licenças',
    description: 'Tipos de licença e como usar cada asset.',
    icon: ShieldCheck,
    color: 'bg-indigo-500/10 border-indigo-500/20'
  },
  {
    id: 'suporte',
    title: 'Suporte',
    description: 'Canais de atendimento e horário de funcionamento.',
    icon: MessageCircle,
    color: 'bg-cyan-500/10 border-cyan-500/20'
  },
  {
    id: 'faq',
    title: 'Perguntas Frequentes',
    description: 'Respostas para as dúvidas mais comuns.',
    icon: HelpCircle,
    color: 'bg-gray-500/10 border-gray-500/20'
  }
];

export default function Documentation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-[10px] text-[#333] mb-5">
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')}>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#555]">Documentação</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Central de Ajuda</h1>
          </div>
          <p className="text-sm text-[#555] max-w-xl ml-16">
            Tudo que você precisa saber para comprar, baixar e usar nossos assets.
            Escolha um tópico abaixo para ver os detalhes.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCS_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                onClick={() => navigate(`/docs/${topic.id}`)}
                className="group bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 text-left hover:border-white/30 transition-all hover:scale-[1.02]"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${topic.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">{topic.title}</h3>
                <p className="text-xs text-[#555] leading-relaxed">{topic.description}</p>
                <div className="flex items-center gap-1 text-xs text-[#444] mt-4 group-hover:text-white transition-colors">
                  Ler mais <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Ainda precisa de ajuda? */}
        <div className="mt-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 text-center">
          <h3 className="text-base font-bold text-white mb-2">Ainda precisa de ajuda?</h3>
          <p className="text-xs text-[#555] mb-4">Nossa equipe está pronta para ajudar você.</p>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="bg-white text-black hover:bg-white/90 font-bold gap-2"
          >
            Falar com Suporte <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}