// src/pages/Documentation.jsx - Estilo Steam
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  ShoppingCart, 
  CreditCard, 
  Download, 
  Gift, 
  Wallet, 
  Shield, 
  HelpCircle,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Clock,
  MessageCircle,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Documentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { id: 'getting-started', title: 'Começando', icon: BookOpen },
    { id: 'purchasing', title: 'Compras', icon: ShoppingCart },
    { id: 'payment', title: 'Pagamento', icon: CreditCard },
    { id: 'downloads', title: 'Downloads', icon: Download },
    { id: 'gifts', title: 'Presentes', icon: Gift },
    { id: 'wallet', title: 'Carteira', icon: Wallet },
    { id: 'security', title: 'Segurança', icon: Shield },
    { id: 'support', title: 'Suporte', icon: HelpCircle },
  ];

  const faqs = [
    { question: 'Como criar uma conta?', answer: 'Clique em "Entrar" no canto superior direito e depois em "Criar conta". Preencha seus dados e confirme o código enviado por email.' },
    { question: 'Quanto tempo leva para aprovar o pagamento?', answer: 'O pagamento é aprovado manualmente em até 24 horas úteis após a confirmação do PIX.' },
    { question: 'Como funciona o reembolso?', answer: 'Você tem até 30 dias após a compra para solicitar reembolso. Entre em contato com nosso suporte.' },
    { question: 'O que é cashback?', answer: 'Cashback é um crédito de 5% que você recebe em todas as compras aprovadas, podendo ser usado em compras futuras.' },
    { question: 'Posso comprar como presente?', answer: 'Sim! Durante o checkout, escolha a opção "Enviar como presente" e informe o email do destinatário.' },
  ];

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sections.find(s => s.id === hash)) {
      setActiveSection(hash);
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState({}, '', `#${id}`);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header Steam-style */}
      <div className="border-b border-[#1A1A1A] bg-black/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">M</span>
              </div>
              <span className="text-white font-bold tracking-tight">Marketplace</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/store')} className="text-sm text-[#555] hover:text-white transition-colors">
                Loja
              </button>
              <button onClick={() => navigate('/dashboard')} className="text-sm text-[#555] hover:text-white transition-colors">
                Minha Conta
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Central de Ajuda</h1>
          <p className="text-sm text-[#555]">Como podemos ajudar você hoje?</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
            <input
              type="text"
              placeholder="Buscar na documentação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Steam style */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-[#111] border border-[#1A1A1A] rounded-lg overflow-hidden">
                <div className="p-3 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                  <h3 className="text-xs font-bold text-[#555] uppercase tracking-wider">Índice</h3>
                </div>
                <nav className="p-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all ${
                          activeSection === section.id
                            ? 'bg-white/10 text-white'
                            : 'text-[#555] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {section.title}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {/* Getting Started */}
            <section id="getting-started" className="scroll-mt-20">
              <div className="bg-[#111] border border-[#1A1A1A] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-white" />
                    <h2 className="text-sm font-bold text-white">Começando</h2>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Crie sua conta</p>
                      <p className="text-[11px] text-[#555]">Clique em "Entrar" e depois em "Criar conta". Preencha seus dados e verifique seu email.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Explore a loja</p>
                      <p className="text-[11px] text-[#555]">Navegue pelas categorias e encontre os assets que você precisa.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Faça sua primeira compra</p>
                      <p className="text-[11px] text-[#555]">Adicione produtos ao carrinho e finalize o pagamento via PIX.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Purchasing */}
            <section id="purchasing" className="scroll-mt-20">
              <div className="bg-[#111] border border-[#1A1A1A] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-white" />
                    <h2 className="text-sm font-bold text-white">Compras</h2>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Adicione ao carrinho</p>
                      <p className="text-[11px] text-[#555]">Clique em "Adicionar ao Carrinho" no produto desejado.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Finalize o checkout</p>
                      <p className="text-[11px] text-[#555]">Preencha seus dados e escolha a forma de pagamento.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Aguardar aprovação</p>
                      <p className="text-[11px] text-[#555]">Após o pagamento, aguarde a aprovação do pedido (até 24h).</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section id="payment" className="scroll-mt-20">
              <div className="bg-[#111] border border-[#1A1A1A] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-white" />
                    <h2 className="text-sm font-bold text-white">Pagamento</h2>
                  </div>
                </div>
                <div className="p-4">
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                        <span className="text-black font-black text-[7px]">PIX</span>
                      </div>
                      <p className="text-xs font-medium text-white">Pagamento via PIX</p>
                    </div>
                    <p className="text-[11px] text-[#555]">Pagamento instantâneo e seguro. Após confirmação, seu pedido será aprovado.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#555]">Pagamento seguro e criptografado</p>
                  </div>
                  <div className="flex items-start gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-white flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#555]">Aprovação em até 24 horas úteis</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Downloads */}
            <section id="downloads" className="scroll-mt-20">
              <div className="bg-[#111] border border-[#1A1A1A] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-white" />
                    <h2 className="text-sm font-bold text-white">Downloads</h2>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-[11px] text-[#555]">Após a aprovação do pedido, você pode baixar seus arquivos:</p>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-xs font-medium text-white mb-1">Pelo Dashboard</p>
                    <p className="text-[11px] text-[#555]">Acesse "Meus Pedidos" e clique em "Baixar" no produto desejado.</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-xs font-medium text-white mb-1">Por email</p>
                    <p className="text-[11px] text-[#555]">Você receberá um email com o link de download.</p>
                  </div>
                  <div className="flex items-start gap-2 mt-1">
                    <AlertCircle className="h-3.5 w-3.5 text-white flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#555]">Links expiram após 7 dias. Baixe seus arquivos assim que o pedido for aprovado.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Gifts */}
            <section id="gifts" className="scroll-mt-20">
              <div className="bg-[#111] border border-[#1A1A1A] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-white" />
                    <h2 className="text-sm font-bold text-white">Presentes</h2>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-[11px] text-[#555]">Compre produtos como presente para outras pessoas!</p>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-xs font-medium text-white mb-1">Como funciona</p>
                    <p className="text-[11px] text-[#555]">No checkout, escolha "Enviar como presente", informe o email do destinatário e adicione uma mensagem. Após a aprovação, ele receberá uma notificação e poderá aceitar o presente no dashboard.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Wallet */}
            <section id="wallet" className="scroll-mt-20">
              <div className="bg-[#111] border border-[#1A1A1A] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-white" />
                    <h2 className="text-sm font-bold text-white">Carteira</h2>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-xs font-medium text-white mb-1">Cashback de 5%</p>
                    <p className="text-[11px] text-[#555]">Toda compra aprovada gera 5% de crédito na sua carteira.</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-xs font-medium text-white mb-1">Usar saldo</p>
                    <p className="text-[11px] text-[#555]">O saldo pode ser usado em compras futuras diretamente no checkout.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Security */}
            <section id="security" className="scroll-mt-20">
              <div className="bg-[#111] border border-[#1A1A1A] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-white" />
                    <h2 className="text-sm font-bold text-white">Segurança</h2>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#555]">Arquivos verificados antes da publicação</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#555]">Pagamentos seguros via PIX</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#555]">Garantia de 30 dias para reembolso</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Support */}
            <section id="support" className="scroll-mt-20">
              <div className="bg-[#111] border border-[#1A1A1A] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#1A1A1A] bg-[#0A0A0A]">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-white" />
                    <h2 className="text-sm font-bold text-white">Suporte</h2>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    {filteredFaqs.map((faq, index) => (
                      <div key={index} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                        <p className="text-xs font-medium text-white mb-1">{faq.question}</p>
                        <p className="text-[11px] text-[#555]">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3 text-center">
                    <p className="text-xs text-[#555] mb-2">Não encontrou o que procurava?</p>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={() => navigate('/dashboard')} 
                        className="bg-white text-black hover:bg-white/90 font-bold text-xs h-8 px-3"
                      >
                        Falar com Suporte
                      </Button>
                      <Button 
                        onClick={() => window.location.href = 'mailto:contato@marketplace.com'} 
                        variant="outline"
                        className="border-[#1A1A1A] text-[#555] hover:text-white text-xs h-8 px-3"
                      >
                        Enviar Email
                      </Button>
                    </div>
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