// src/pages/Documentation.jsx - Estilo ClearlyDev
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ShoppingCart, CreditCard, Download,
  Wallet, RefreshCcw, ShieldCheck, MessageCircle, HelpCircle,
  ChevronRight, Clock, CheckCircle, AlertCircle, ArrowRight,
  Zap, Lock, FileText, Users, Star, Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DOCS_SECTIONS = [
  { id: 'introduction', title: 'Introdução', icon: BookOpen },
  { id: 'buying', title: 'Como Comprar', icon: ShoppingCart },
  { id: 'payment', title: 'Pagamento via PIX', icon: CreditCard },
  { id: 'downloads', title: 'Downloads', icon: Download },
  { id: 'wallet', title: 'Carteira & Cashback', icon: Wallet },
  { id: 'refund', title: 'Reembolsos', icon: RefreshCcw },
  { id: 'licenses', title: 'Licenças', icon: ShieldCheck },
  { id: 'support', title: 'Suporte', icon: MessageCircle },
  { id: 'faq', title: 'Perguntas Frequentes', icon: HelpCircle },
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
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
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
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-[10px] font-bold text-[#333] uppercase tracking-[0.3em] mb-4">Nesta página</p>
              <nav className="space-y-1">
                {DOCS_SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
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
          </aside>

          {/* Conteúdo principal */}
          <div className="flex-1 min-w-0 space-y-12">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-20">
              <div className="mb-6">
                <h1 className="text-3xl font-black text-white mb-2">Central de Ajuda</h1>
                <p className="text-sm text-[#555]">
                  Bem-vindo à documentação oficial do Marketplace. Aqui você encontra tudo que precisa saber.
                </p>
              </div>
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1A1A1A]">
                  <BookOpen className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Sobre a plataforma</h2>
                </div>
                <p className="text-sm text-[#666] leading-relaxed">
                  Nosso marketplace conecta desenvolvedores a assets premium de alta qualidade. 
                  Oferecemos scripts, sistemas completos e UI kits prontos para produção imediata.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-[#555]">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>+500 assets disponíveis</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#555]">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>+2.000 clientes atendidos</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#555]">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Avaliação média 4.9★</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Buying */}
            <section id="buying" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1A1A1A]">
                  <ShoppingCart className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Como Comprar</h2>
                </div>
                <p className="text-sm text-[#666] leading-relaxed">
                  Comprar na nossa plataforma é simples e rápido. Siga os passos abaixo:
                </p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">1</span>
                    </div>
                    <p className="text-sm text-[#555]">Navegue pela <button onClick={() => navigate('/store')} className="text-white underline">loja</button> e encontre o asset desejado.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">2</span>
                    </div>
                    <p className="text-sm text-[#555]">Clique em "Adicionar ao Carrinho" ou "Comprar Agora".</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">3</span>
                    </div>
                    <p className="text-sm text-[#555]">Preencha seus dados no checkout e finalize o pagamento via PIX.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">4</span>
                    </div>
                    <p className="text-sm text-[#555]">Aguarde a aprovação (até 30 minutos em horário comercial).</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">5</span>
                    </div>
                    <p className="text-sm text-[#555]">Baixe seus arquivos em <button onClick={() => navigate('/dashboard/orders')} className="text-white underline">Meus Pedidos</button>.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section id="payment" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1A1A1A]">
                  <CreditCard className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Pagamento via PIX</h2>
                </div>
                <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-4">
                  <p className="text-xs text-[#555] mb-2">Nossa chave PIX (e-mail)</p>
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-white">pagamentos@marketplace.com</code>
                    <button className="text-xs text-[#555] hover:text-white transition-colors">Copiar</button>
                  </div>
                </div>
                <p className="text-sm text-[#666] leading-relaxed">
                  Trabalhamos exclusivamente com PIX - pagamento instantâneo e seguro do Banco Central.
                </p>
                <div className="flex items-start gap-2 text-xs text-[#555]">
                  <Clock className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Aprovação em até <strong className="text-white">30 minutos</strong> em dias úteis.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#555]">
                  <ShieldCheck className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Pagamento 100% seguro - Nunca solicitamos senha ou dados bancários.</span>
                </div>
              </div>
            </section>

            {/* Downloads */}
            <section id="downloads" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1A1A1A]">
                  <Download className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Downloads</h2>
                </div>
                <p className="text-sm text-[#666] leading-relaxed">
                  Após a aprovação do pagamento, seus arquivos ficam disponíveis por <strong className="text-white">7 dias</strong>.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-[#555]">
                    <Zap className="h-4 w-4 text-white/50 mt-0.5" />
                    <span>Acesse <button onClick={() => navigate('/dashboard/orders')} className="text-white underline">Meus Pedidos</button> e clique em "Download".</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-[#555]">
                    <Zap className="h-4 w-4 text-white/50 mt-0.5" />
                    <span>Links expiram após 7 dias. Baixe assim que o pedido for aprovado.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#555] bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <span>Salve os arquivos imediatamente. Não nos responsabilizamos por perda após o prazo.</span>
                </div>
              </div>
            </section>

            {/* Wallet */}
            <section id="wallet" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1A1A1A]">
                  <Wallet className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Carteira & Cashback</h2>
                </div>
                <p className="text-sm text-[#666] leading-relaxed">
                  Toda compra aprovada gera <strong className="text-white">5% de cashback</strong> creditado automaticamente na sua carteira.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-xs font-semibold text-white mb-1">Como ganhar</p>
                    <p className="text-[11px] text-[#555]">5% do valor de cada compra aprovada.</p>
                  </div>
                  <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-xs font-semibold text-white mb-1">Como usar</p>
                    <p className="text-[11px] text-[#555]">Use o saldo para abater em compras futuras.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund */}
            <section id="refund" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1A1A1A]">
                  <RefreshCcw className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Política de Reembolso</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Pedido aprovado há menos de 7 dias - Elegível</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Arquivo não baixado - Reembolso integral</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span>Arquivo baixado - Sujeito à análise</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <X className="h-4 w-4 text-red-500" />
                    <span>Pedido com mais de 7 dias - Não elegível</span>
                  </div>
                </div>
                <p className="text-sm text-[#666] leading-relaxed">
                  Para solicitar, acesse <button onClick={() => navigate('/dashboard/orders')} className="text-white underline">Meus Pedidos</button> e clique em "Solicitar Reembolso".
                </p>
              </div>
            </section>

            {/* Licenses */}
            <section id="licenses" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1A1A1A]">
                  <ShieldCheck className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Licenças</h2>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-sm font-semibold text-white mb-1">Licença Padrão</p>
                    <p className="text-xs text-[#555]">Uso em 1 projeto pessoal ou comercial. Não pode revender.</p>
                  </div>
                  <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-sm font-semibold text-white mb-1">Licença Extendida</p>
                    <p className="text-xs text-[#555]">Uso em múltiplos projetos. Permite monetização indireta.</p>
                  </div>
                  <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-sm font-semibold text-white mb-1">Licença Comercial</p>
                    <p className="text-xs text-[#555]">Uso sem restrições. Inclui direito de modificação.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#555] bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <Lock className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <span>É proibido revender ou redistribuir nossos assets sem autorização.</span>
                </div>
              </div>
            </section>

            {/* Support */}
            <section id="support" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1A1A1A]">
                  <MessageCircle className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Suporte</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🎧</div>
                    <p className="text-sm font-semibold text-white mb-1">Discord</p>
                    <p className="text-xs text-[#555]">Resposta mais rápida</p>
                  </div>
                  <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">📧</div>
                    <p className="text-sm font-semibold text-white mb-1">E-mail</p>
                    <p className="text-xs text-[#555]">suporte@marketplace.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#555] bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <Clock className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span>Horário de atendimento: <strong className="text-white">Segunda a Sexta, 09h–18h (BRT)</strong>.</span>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-20">
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1A1A1A]">
                  <HelpCircle className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Perguntas Frequentes</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Quanto tempo leva para aprovar o pagamento?</p>
                    <p className="text-xs text-[#555]">Em dias úteis, a aprovação ocorre em até 30 minutos. Fora do horário comercial, até 12 horas.</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Posso usar o asset em mais de um projeto?</p>
                    <p className="text-xs text-[#555]">Depende da licença. A licença padrão permite uso em 1 projeto. Para múltiplos, adquira Extendida ou Comercial.</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">O link de download expirou. O que fazer?</p>
                    <p className="text-xs text-[#555]">Entre em contato com o suporte informando o número do pedido. Reativamos o link por mais 7 dias.</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Posso pagar com cartão ou boleto?</p>
                    <p className="text-xs text-[#555]">No momento aceitamos apenas PIX. Estamos trabalhando para adicionar novos métodos.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer da documentação */}
            <div className="border-t border-[#1A1A1A] pt-8 text-center">
              <p className="text-xs text-[#555]">
                © 2026 Marketplace. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}