// src/pages/Documentation.jsx - Com hero igual ao Home (com slideshow)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Lock, Copy, CheckCircle, CreditCard, Download, Wallet, RefreshCcw, Shield, HelpCircle, ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Importe suas imagens aqui (mesmas do Home)
import heroBg1 from '@/assets/images/DevHero.jpg';
import heroBg2 from '@/assets/images/DevHero2.jpg';
import heroBg3 from '@/assets/images/DevHero3.jpg';
import heroBg4 from '@/assets/images/DevHero4.jpg';

const DOCS_SECTIONS = [
  { id: 'buying', title: 'Como Comprar', icon: ShoppingCart },
  { id: 'payment', title: 'Pagamento', icon: CreditCard },
  { id: 'downloads', title: 'Downloads', icon: Download },
  { id: 'wallet', title: 'Carteira', icon: Wallet },
  { id: 'refund', title: 'Reembolsos', icon: RefreshCcw },
  { id: 'security', title: 'Segurança', icon: Shield },
  { id: 'faq', title: 'FAQ', icon: HelpCircle },
];

export default function Documentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('buying');
  const [copied, setCopied] = useState(false);
  
  // Slideshow state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Lista de imagens de fundo
  const backgroundImages = [heroBg1, heroBg2, heroBg3, heroBg4];

  // Trocar imagem a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-black text-sm">M</span>
                </div>
                <span className="text-white font-bold tracking-tight">Marketplace</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section com Slideshow - Igual ao Home */}
      <section className="relative overflow-hidden border-b border-[#1A1A1A] min-h-[500px] flex items-center">
        {/* Imagem de fundo com fade */}
        <div className="absolute inset-0">
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img}
                alt="Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/70" />
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#1A1A1A] rounded-full px-4 py-1.5 text-xs text-[#999]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Documentação Oficial
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Central de <span className="text-[#555]">Ajuda</span>
          </h1>
          
          <p className="text-sm md:text-base text-[#999] max-w-2xl mx-auto leading-relaxed">
            Tire todas as suas dúvidas sobre compras, downloads, pagamentos e muito mais. 
            Nossa documentação completa está aqui para ajudar você.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={() => scrollToSection('buying')} className="bg-white text-black hover:bg-white/90 font-bold h-11 px-6 text-sm gap-2 rounded-xl">
              Como Comprar <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => scrollToSection('faq')} className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-11 px-6 text-sm rounded-xl">
              Perguntas Frequentes
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-4 border-t border-[#1A1A1A] mt-4">
            {[{ v: '7+', l: 'Guias Completos' }, { v: '24/7', l: 'Suporte' }, { v: '2K+', l: 'Clientes' }, { v: '4.9★', l: 'Avaliação' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-xl md:text-2xl font-black text-white">{s.v}</div>
                <div className="text-[10px] text-[#555] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Conteúdo principal */}
          <div className="flex-1 min-w-0">
            <div className="space-y-12">
              
              {/* Como Comprar */}
              <section id="buying" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#1A1A1A]">
                  <ShoppingCart className="h-5 w-5 text-white" />
                  <h2 className="text-2xl font-bold text-white">Como Comprar</h2>
                </div>
                <p className="text-[#666] leading-relaxed text-base mb-6">
                  Comprar na nossa plataforma é simples. Siga os passos abaixo:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-[#666] text-base ml-4">
                  <li>Navegue pela loja e encontre o asset desejado</li>
                  <li>Clique em "Adicionar ao Carrinho"</li>
                  <li>Preencha seus dados no checkout</li>
                  <li>Finalize o pagamento via PIX</li>
                  <li>Aguarde a aprovação (até 30min)</li>
                  <li>Baixe seus arquivos em Meus Pedidos</li>
                </ol>
              </section>

              {/* Pagamento - Com card para copiar */}
              <section id="payment" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#1A1A1A]">
                  <CreditCard className="h-5 w-5 text-white" />
                  <h2 className="text-2xl font-bold text-white">Pagamento via PIX</h2>
                </div>
                <p className="text-[#666] leading-relaxed text-base mb-6">
                  Trabalhamos exclusivamente com PIX. Pagamento instantâneo e seguro.
                </p>
                
                {/* Card para copiar */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-[#555]">Chave PIX (e-mail)</p>
                    <button 
                      onClick={() => copyToClipboard('pagamentos@marketplace.com')}
                      className="flex items-center gap-1 text-xs text-[#555] hover:text-white transition-colors"
                    >
                      {copied ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <code className="text-sm text-white font-mono">pagamentos@marketplace.com</code>
                </div>

                <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                  <li>Aprovação em até 30 minutos em dias úteis</li>
                  <li>Pagamento 100% seguro</li>
                  <li>Confirmação automática após aprovação</li>
                </ul>
              </section>

              {/* Downloads */}
              <section id="downloads" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#1A1A1A]">
                  <Download className="h-5 w-5 text-white" />
                  <h2 className="text-2xl font-bold text-white">Downloads</h2>
                </div>
                <p className="text-[#666] leading-relaxed text-base mb-6">
                  Após aprovação, seus arquivos ficam disponíveis por 7 dias.
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                  <li>Acesse Meus Pedidos no dashboard</li>
                  <li>Clique em "Download" no produto desejado</li>
                  <li>Links expiram após 7 dias</li>
                </ul>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4 mt-6">
                  <p className="text-sm text-[#555]">
                    <strong className="text-white">Importante:</strong> Salve seus arquivos imediatamente. Não podemos reativar links expirados.
                  </p>
                </div>
              </section>

              {/* Carteira */}
              <section id="wallet" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#1A1A1A]">
                  <Wallet className="h-5 w-5 text-white" />
                  <h2 className="text-2xl font-bold text-white">Carteira & Cashback</h2>
                </div>
                <p className="text-[#666] leading-relaxed text-base mb-6">
                  Toda compra aprovada gera 5% de cashback na sua carteira.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4">
                    <p className="text-sm font-bold text-white mb-1">💰 Como ganhar</p>
                    <p className="text-xs text-[#555]">5% do valor de cada compra aprovada</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4">
                    <p className="text-sm font-bold text-white mb-1">🛒 Como usar</p>
                    <p className="text-xs text-[#555]">Use o saldo em compras futuras</p>
                  </div>
                </div>
              </section>

              {/* Reembolsos */}
              <section id="refund" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#1A1A1A]">
                  <RefreshCcw className="h-5 w-5 text-white" />
                  <h2 className="text-2xl font-bold text-white">Reembolsos</h2>
                </div>
                <p className="text-[#666] leading-relaxed text-base mb-6">
                  Solicite reembolso em até 7 dias após aprovação.
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                  <li>Acesse Meus Pedidos no dashboard</li>
                  <li>Clique em "Solicitar Reembolso"</li>
                  <li>Análise em até 3 dias úteis</li>
                </ul>
              </section>

              {/* Segurança */}
              <section id="security" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#1A1A1A]">
                  <Shield className="h-5 w-5 text-white" />
                  <h2 className="text-2xl font-bold text-white">Segurança</h2>
                </div>
                <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                  <li>Criptografia SSL em todas as páginas</li>
                  <li>Pagamentos processados via PIX</li>
                  <li>Nunca solicitamos sua senha</li>
                </ul>
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#1A1A1A]">
                  <HelpCircle className="h-5 w-5 text-white" />
                  <h2 className="text-2xl font-bold text-white">Perguntas Frequentes</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4">
                    <h3 className="text-sm font-bold text-white mb-1">Quanto tempo leva para aprovar o pagamento?</h3>
                    <p className="text-xs text-[#555]">Até 30 minutos em dias úteis. Fora do horário comercial, até 12 horas.</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4">
                    <h3 className="text-sm font-bold text-white mb-1">Posso usar o asset em mais de um projeto?</h3>
                    <p className="text-xs text-[#555]">Depende da licença. A licença padrão permite uso em 1 projeto.</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4">
                    <h3 className="text-sm font-bold text-white mb-1">O link de download expirou?</h3>
                    <p className="text-xs text-[#555]">Contate o suporte com o número do pedido para reativar por mais 7 dias.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar fixa na direita com Termos e Privacidade */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Navegação */}
              <div>
                <p className="text-xs font-bold text-[#444] uppercase tracking-wider mb-4">Conteúdo</p>
                <nav className="space-y-1">
                  {DOCS_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                          activeSection === section.id
                            ? 'bg-white text-black font-medium'
                            : 'text-[#555] hover:text-white hover:bg-[#111]'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {section.title}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Separador */}
              <div className="border-t border-[#1A1A1A]"></div>

              {/* Links Legais */}
              <div>
                <p className="text-xs font-bold text-[#444] uppercase tracking-wider mb-4">Legal</p>
                <nav className="space-y-1">
                  <button
                    onClick={() => navigate('/terms')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-[#111] transition-all flex items-center gap-2"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Termos de Uso
                  </button>
                  <button
                    onClick={() => navigate('/privacy')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-[#111] transition-all flex items-center gap-2"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Política de Privacidade
                  </button>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}