// src/pages/Documentation.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Code, 
  ShoppingCart, 
  CreditCard, 
  Download, 
  Gift, 
  Wallet, 
  Shield, 
  Users, 
  HelpCircle,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Clock,
  Star,
  MessageCircle,
  FileText,
  Lock,
  UserCheck,
  DollarSign,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Documentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('inicio');
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { id: 'inicio', title: 'Início', icon: BookOpen },
    { id: 'primeiros-passos', title: 'Primeiros Passos', icon: UserCheck },
    { id: 'comprar', title: 'Como Comprar', icon: ShoppingCart },
    { id: 'pagamento', title: 'Pagamento', icon: CreditCard },
    { id: 'download', title: 'Download', icon: Download },
    { id: 'presente', title: 'Presentes', icon: Gift },
    { id: 'carteira', title: 'Carteira e Cashback', icon: Wallet },
    { id: 'seguranca', title: 'Segurança', icon: Shield },
    { id: 'suporte', title: 'Suporte', icon: HelpCircle },
  ];

  const faqs = [
    { question: 'Como faço para criar uma conta?', answer: 'Clique em "Criar Conta" na tela de login, preencha seus dados e confirme o código enviado por email.' },
    { question: 'Quanto tempo leva para aprovar o pagamento?', answer: 'O pagamento é aprovado manualmente em até 24 horas úteis.' },
    { question: 'Posso pedir reembolso?', answer: 'Sim, você tem até 30 dias após a compra para solicitar reembolso.' },
    { question: 'Como funciona o cashback?', answer: 'Toda compra aprovada gera 5% de cashback na sua carteira automaticamente.' },
    { question: 'Posso comprar como presente?', answer: 'Sim! No checkout, escolha a opção "Enviar como presente" para qualquer produto.' },
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
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Central de Ajuda</h1>
          <p className="text-sm text-[#555] mt-2 max-w-2xl mx-auto">
            Tudo que você precisa saber para usar nossa plataforma. Tire suas dúvidas e aproveite ao máximo!
          </p>
        </div>

        {/* Busca */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar na documentação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 px-4 pl-11 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/50 transition-colors"
            />
            <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#1A1A1A]">
                <h3 className="text-sm font-bold text-white">Navegação</h3>
              </div>
              <nav className="p-2 space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === section.id
                          ? 'bg-white text-black font-medium'
                          : 'text-[#555] hover:text-white hover:bg-[#111]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {section.title}
                      <ChevronRight className={`h-3 w-3 ml-auto transition-transform ${
                        activeSection === section.id ? 'translate-x-0.5' : ''
                      }`} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Conteúdo principal */}
          <div className="flex-1 space-y-6">
            {/* Seção Início */}
            <section id="inicio" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Bem-vindo à Central de Ajuda</h2>
              </div>
              <p className="text-sm text-[#666] leading-relaxed mb-4">
                Esta documentação foi criada para ajudar você a aproveitar ao máximo nossa plataforma. 
                Aqui você encontrará informações detalhadas sobre como comprar, baixar produtos, 
                usar a carteira, enviar presentes e muito mais.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3 text-center">
                  <Clock className="h-5 w-5 text-white mx-auto mb-2" />
                  <p className="text-xs font-medium text-white">Atendimento 24/7</p>
                  <p className="text-[10px] text-[#555]">Suporte rápido e eficiente</p>
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3 text-center">
                  <Shield className="h-5 w-5 text-white mx-auto mb-2" />
                  <p className="text-xs font-medium text-white">100% Seguro</p>
                  <p className="text-[10px] text-[#555]">Pagamentos protegidos</p>
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3 text-center">
                  <Star className="h-5 w-5 text-white mx-auto mb-2" />
                  <p className="text-xs font-medium text-white">4.9/5 Estrelas</p>
                  <p className="text-[10px] text-[#555]">Avaliação dos clientes</p>
                </div>
              </div>
            </section>

            {/* Seção Primeiros Passos */}
            <section id="primeiros-passos" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Primeiros Passos</h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">1</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Crie sua conta</h3>
                    <p className="text-xs text-[#555]">Clique em "Criar Conta" e preencha seus dados. Você receberá um código por email para verificar.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">2</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Explore a loja</h3>
                    <p className="text-xs text-[#555]">Navegue pelas categorias e encontre os assets que você precisa.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">3</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Faça sua primeira compra</h3>
                    <p className="text-xs text-[#555]">Adicione produtos ao carrinho e finalize o pagamento via PIX.</p>
                  </div>
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3 mt-2">
                  <p className="text-xs text-[#555] flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                    <span>Após criar conta, você terá acesso ao dashboard onde pode ver seus pedidos, favoritos e configurações.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Seção Como Comprar */}
            <section id="comprar" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingCart className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Como Comprar</h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">1</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Explore os produtos</h3>
                    <p className="text-xs text-[#555]">Navegue pela loja e encontre os assets que você precisa.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">2</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Adicione ao carrinho</h3>
                    <p className="text-xs text-[#555]">Clique em "Adicionar ao Carrinho" no produto desejado.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">3</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Finalize o checkout</h3>
                    <p className="text-xs text-[#555]">Preencha seus dados e escolha a forma de pagamento.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">4</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Aguardar aprovação</h3>
                    <p className="text-xs text-[#555]">Após o pagamento, aguarde a aprovação do pedido.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-bold text-xs">5</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Baixe seus arquivos</h3>
                    <p className="text-xs text-[#555]">Após aprovação, os arquivos ficam disponíveis para download.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Seção Pagamento */}
            <section id="pagamento" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Pagamento</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                      <span className="text-black font-black text-[8px]">PIX</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">Pagamento via PIX</h3>
                  </div>
                  <p className="text-xs text-[#555] leading-relaxed">
                    Aceitamos pagamento via PIX. Após a confirmação do pagamento, seu pedido será aprovado 
                    e você terá acesso imediato aos arquivos.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#555]">Pagamento seguro e instantâneo</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#555]">Confirmação automática após aprovação manual</p>
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3">
                  <p className="text-xs text-[#555] flex items-start gap-2">
                    <Clock className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                    <span>O prazo de aprovação é de até 24 horas úteis após o pagamento.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Seção Download */}
            <section id="download" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <Download className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Download</h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-[#666] leading-relaxed">
                  Após a aprovação do seu pedido, você pode baixar seus arquivos de duas formas:
                </p>
                <div className="space-y-3">
                  <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-1">Pelo Dashboard</h3>
                    <p className="text-xs text-[#555]">Acesse "Meus Pedidos" e clique em "Baixar" no produto desejado.</p>
                  </div>
                  <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-1">Por email</h3>
                    <p className="text-xs text-[#555]">Você receberá um email com o link de download.</p>
                  </div>
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3">
                  <p className="text-xs text-[#555] flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                    <span>Os links de download expiram após 7 dias. Baixe seus arquivos assim que o pedido for aprovado.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Seção Presentes */}
            <section id="presente" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Presentes</h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-[#666] leading-relaxed">
                  Você pode comprar produtos como presente para outras pessoas!
                </p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-black font-bold text-xs">1</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Escolha a opção "Presente"</h3>
                      <p className="text-xs text-[#555]">No checkout, selecione "Enviar como presente" para o produto.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-black font-bold text-xs">2</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Informe o email do destinatário</h3>
                      <p className="text-xs text-[#555]">Adicione uma mensagem especial se quiser.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-black font-bold text-xs">3</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Finalize o pagamento</h3>
                      <p className="text-xs text-[#555]">O destinatário receberá uma notificação.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-black font-bold text-xs">4</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Destinatário aceita o presente</h3>
                      <p className="text-xs text-[#555]">No dashboard, ele pode aceitar e baixar o produto.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Seção Carteira */}
            <section id="carteira" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Carteira e Cashback</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <h3 className="text-sm font-semibold text-white">Cashback de 5%</h3>
                  </div>
                  <p className="text-xs text-[#555]">Toda compra aprovada gera 5% de cashback na sua carteira.</p>
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-1">Usar saldo</h3>
                  <p className="text-xs text-[#555]">Você pode usar o saldo da carteira em compras futuras.</p>
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-1">Ver extrato</h3>
                  <p className="text-xs text-[#555]">Acesse o Dashboard para ver todas suas transações.</p>
                </div>
              </div>
            </section>

            {/* Seção Segurança */}
            <section id="seguranca" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Segurança</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#555]">Todos os arquivos são verificados antes da publicação</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#555]">Pagamentos processados via PIX com segurança</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#555]">Seus dados são protegidos e nunca compartilhados</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#555]">Garantia de 30 dias para reembolso</p>
                </div>
              </div>
            </section>

            {/* Seção Suporte */}
            <section id="suporte" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Suporte</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="h-4 w-4 text-white" />
                    <h3 className="text-sm font-semibold text-white">FAQ - Perguntas Frequentes</h3>
                  </div>
                  <div className="space-y-3">
                    {filteredFaqs.map((faq, index) => (
                      <div key={index} className="border-b border-[#1A1A1A] last:border-0 pb-2 last:pb-0">
                        <p className="text-xs font-medium text-white mb-1">{faq.question}</p>
                        <p className="text-xs text-[#555]">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-4 text-center">
                  <h3 className="text-sm font-semibold text-white mb-2">Ainda precisa de ajuda?</h3>
                  <p className="text-xs text-[#555] mb-3">Entre em contato com nossa equipe de suporte</p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={() => navigate('/dashboard')} 
                      className="bg-white text-black hover:bg-white/90 font-bold gap-2 text-xs h-9"
                    >
                      Falar com Suporte <ArrowRight className="h-3 w-3" />
                    </Button>
                    <Button 
                      onClick={() => window.location.href = 'mailto:contato@marketplace.com'} 
                      variant="outline"
                      className="border-[#1A1A1A] text-[#999] hover:text-white text-xs h-9"
                    >
                      Enviar Email
                    </Button>
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