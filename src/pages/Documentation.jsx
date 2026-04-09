// src/pages/Documentation.jsx - Versão simples e básica
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ShoppingCart, CreditCard, Download,
  Wallet, RefreshCcw, ShieldCheck, MessageCircle, HelpCircle,
  ChevronRight, Clock, CheckCircle, AlertCircle, XCircle
} from 'lucide-react';

const DOCS_SECTIONS = [
  { id: 'introduction', title: 'Introdução', icon: BookOpen, description: 'Visão geral da plataforma' },
  { id: 'buying', title: 'Como Comprar', icon: ShoppingCart, description: 'Passo a passo para comprar' },
  { id: 'payment', title: 'Pagamento via PIX', icon: CreditCard, description: 'Informações sobre pagamento' },
  { id: 'downloads', title: 'Downloads', icon: Download, description: 'Como baixar seus arquivos' },
  { id: 'wallet', title: 'Carteira', icon: Wallet, description: 'Cashback e saldo' },
  { id: 'refund', title: 'Reembolsos', icon: RefreshCcw, description: 'Política de reembolso' },
  { id: 'licenses', title: 'Licenças', icon: ShieldCheck, description: 'Tipos de licença' },
  { id: 'support', title: 'Suporte', icon: MessageCircle, description: 'Canais de atendimento' },
  { id: 'faq', title: 'FAQ', icon: HelpCircle, description: 'Perguntas frequentes' },
];

export default function Documentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && DOCS_SECTIONS.find(s => s.id === hash)) {
      setActiveSection(hash);
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState({}, '', `#${id}`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="text-[#555] hover:text-white transition-colors"
            >
              ← Voltar
            </button>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-black" />
            </div>
            <h1 className="text-xl font-black text-white">Documentação</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-bold text-[#444] mb-3">Conteúdo</p>
              <nav className="space-y-1">
                {DOCS_SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === section.id
                          ? 'bg-white text-black'
                          : 'text-[#555] hover:text-white hover:bg-[#111]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Conteúdo */}
          <div className="flex-1 space-y-8">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1A1A1A]">
                  <BookOpen className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Introdução</h2>
                </div>
                <p className="text-sm text-[#666] leading-relaxed mb-4">
                  Marketplace é uma plataforma de assets digitais para desenvolvedores. 
                  Oferecemos scripts, sistemas completos e UI kits prontos para produção.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    +500 assets
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    +2K clientes
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    4.9★ avaliação
                  </div>
                </div>
              </div>
            </section>

            {/* Buying */}
            <section id="buying" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1A1A1A]">
                  <ShoppingCart className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Como Comprar</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="text-sm font-bold text-white">1.</span>
                    <p className="text-sm text-[#666]">Navegue pela loja e escolha seu asset</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-sm font-bold text-white">2.</span>
                    <p className="text-sm text-[#666]">Clique em "Adicionar ao Carrinho"</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-sm font-bold text-white">3.</span>
                    <p className="text-sm text-[#666]">Finalize o checkout e pague via PIX</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-sm font-bold text-white">4.</span>
                    <p className="text-sm text-[#666]">Aguarde a aprovação do pedido</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-sm font-bold text-white">5.</span>
                    <p className="text-sm text-[#666]">Baixe seus arquivos em Meus Pedidos</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section id="payment" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1A1A1A]">
                  <CreditCard className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Pagamento</h2>
                </div>
                <p className="text-sm text-[#666] leading-relaxed mb-3">
                  Aceitamos apenas PIX. Pagamento instantâneo e seguro.
                </p>
                <div className="flex items-start gap-2 text-sm text-[#555] mb-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span>Aprovação em até 30 minutos (dias úteis)</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-[#555]">
                  <ShieldCheck className="h-4 w-4 text-green-400" />
                  <span>Pagamento 100% seguro</span>
                </div>
              </div>
            </section>

            {/* Downloads */}
            <section id="downloads" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1A1A1A]">
                  <Download className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Downloads</h2>
                </div>
                <p className="text-sm text-[#666] leading-relaxed mb-3">
                  Após aprovação, seus arquivos ficam disponíveis por 7 dias.
                </p>
                <div className="flex items-start gap-2 text-sm text-[#555]">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Baixe seus arquivos assim que o pedido for aprovado</span>
                </div>
              </div>
            </section>

            {/* Wallet */}
            <section id="wallet" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1A1A1A]">
                  <Wallet className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Carteira</h2>
                </div>
                <p className="text-sm text-[#666] leading-relaxed">
                  Ganhe <strong className="text-white">5% de cashback</strong> em cada compra. 
                  O saldo pode ser usado em compras futuras.
                </p>
              </div>
            </section>

            {/* Refund */}
            <section id="refund" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1A1A1A]">
                  <RefreshCcw className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Reembolsos</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Até 7 dias após aprovação</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Após 7 dias - não elegível</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Licenses */}
            <section id="licenses" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1A1A1A]">
                  <ShieldCheck className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Licenças</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Padrão</p>
                    <p className="text-sm text-[#666]">Uso em 1 projeto</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Extendida</p>
                    <p className="text-sm text-[#666]">Uso em múltiplos projetos</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Comercial</p>
                    <p className="text-sm text-[#666]">Uso sem restrições</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Support */}
            <section id="support" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1A1A1A]">
                  <MessageCircle className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Suporte</h2>
                </div>
                <p className="text-sm text-[#666] leading-relaxed">
                  Atendimento de Segunda a Sexta, 09h às 18h (BRT)
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1A1A1A]">
                  <HelpCircle className="h-5 w-5 text-white" />
                  <h2 className="text-xl font-bold text-white">FAQ</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Quanto tempo leva para aprovar?</p>
                    <p className="text-sm text-[#666]">Até 30 minutos em dias úteis</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Posso usar em múltiplos projetos?</p>
                    <p className="text-sm text-[#666]">Depende da licença escolhida</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Link de download expirou?</p>
                    <p className="text-sm text-[#666]">Contate o suporte para reativar</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}