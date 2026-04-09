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
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Documentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('inicio');

  const sections = [
    { id: 'inicio', title: 'Início', icon: BookOpen },
    { id: 'comprar', title: 'Como Comprar', icon: ShoppingCart },
    { id: 'pagamento', title: 'Pagamento', icon: CreditCard },
    { id: 'download', title: 'Download', icon: Download },
    { id: 'presente', title: 'Presentes', icon: Gift },
    { id: 'carteira', title: 'Carteira', icon: Wallet },
    { id: 'seguranca', title: 'Segurança', icon: Shield },
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
          <h1 className="text-4xl font-black text-white tracking-tight">Documentação</h1>
          <p className="text-sm text-[#555] mt-2 max-w-2xl mx-auto">
            Tudo que você precisa saber para usar nossa plataforma
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#1A1A1A]">
                <h3 className="text-sm font-bold text-white">Conteúdo</h3>
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
          <div className="flex-1 space-y-8">
            {/* Seção Início */}
            <section id="inicio" className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Bem-vindo à Documentação</h2>
              </div>
              <p className="text-sm text-[#666] leading-relaxed mb-4">
                Esta documentação foi criada para ajudar você a aproveitar ao máximo nossa plataforma. 
                Aqui você encontrará informações detalhadas sobre como comprar, baixar produtos, 
                usar a carteira, enviar presentes e muito mais.
              </p>
              <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-4">
                <p className="text-xs text-[#555] flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-white flex-shrink-0 mt-0.5" />
                  <span>Se tiver alguma dúvida não encontrada aqui, entre em contato com nosso suporte.</span>
                </p>
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
                  <h3 className="text-sm font-semibold text-white mb-1">Cashback de 5%</h3>
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

            {/* Botão de ajuda */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 text-center">
              <HelpCircle className="h-8 w-8 text-white mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-2">Ainda tem dúvidas?</h3>
              <p className="text-xs text-[#555] mb-4">Entre em contato com nosso suporte</p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="bg-white text-black hover:bg-white/90 font-bold gap-2"
              >
                Falar com Suporte <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}