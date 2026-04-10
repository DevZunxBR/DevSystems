// src/pages/Documentation.jsx - Versão melhorada
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShoppingCart, CreditCard, Download, Wallet,
  RotateCcw, FileText, Shield, HeadphonesIcon, HelpCircle, Lock,
  ChevronRight, Copy, CheckCircle
} from 'lucide-react';

const DOCS_SECTIONS = [
  { id: 'buying',    title: 'Como Comprar',         icon: ShoppingCart,     group: 'Guia' },
  { id: 'payment',   title: 'Pagamento via PIX',     icon: CreditCard,       group: 'Guia' },
  { id: 'downloads', title: 'Downloads',             icon: Download,         group: 'Guia' },
  { id: 'wallet',    title: 'Carteira & Cashback',   icon: Wallet,           group: 'Guia' },
  { id: 'refund',    title: 'Reembolsos',            icon: RotateCcw,        group: 'Guia' },
  { id: 'licenses',  title: 'Licenças',              icon: FileText,         group: 'Guia' },
  { id: 'security',  title: 'Segurança',             icon: Shield,           group: 'Ajuda' },
  { id: 'support',   title: 'Suporte',               icon: HeadphonesIcon,   group: 'Ajuda' },
  { id: 'faq',       title: 'Perguntas Frequentes',  icon: HelpCircle,       group: 'Ajuda' },
];

const GROUPS = ['Guia', 'Ajuda'];

export default function Documentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('buying');
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && DOCS_SECTIONS.find(s => s.id === hash)) {
      setActiveSection(hash);
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.history.pushState({}, '', `#${id}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update active section on scroll
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const handler = () => {
      const ids = DOCS_SECTIONS.map(s => s.id);
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop - content.scrollTop <= 100) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    content.addEventListener('scroll', handler);
    return () => content.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header com efeito glass */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-all hover:translate-x-[-2px]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <div className="w-px h-5 bg-[#1A1A1A]" />
            <h1 className="text-white font-bold text-lg">Documentação</h1>
          </div>
          <div className="text-xs text-[#444] hidden sm:block">
            Central de ajuda
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-0 flex flex-1 w-full gap-0">
        {/* Sidebar melhorada */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-[#1A1A1A] py-8 pr-6 sticky top-[57px] h-[calc(100vh-57px)] bg-gradient-to-b from-transparent to-black/30">
          {GROUPS.map(group => (
            <div key={group} className="mb-6">
              <p className="text-[10px] font-bold text-[#444] uppercase tracking-wider mb-3 px-3">
                {group}
              </p>
              <nav className="space-y-1">
                {DOCS_SECTIONS.filter(s => s.group === group).map(({ id, title, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`group w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${activeSection === id
                        ? 'text-white bg-[#111] border-l-2 border-white rounded-l-none'
                        : 'text-[#555] hover:text-white hover:bg-[#111]'
                      }`}
                  >
                    <Icon className={`h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:scale-105 ${activeSection === id ? 'text-white' : 'text-[#555]'}`} />
                    {title}
                    {activeSection === id && <ChevronRight className="h-3 w-3 ml-auto opacity-60" />}
                  </button>
                ))}
              </nav>
            </div>
          ))}

          <div className="mt-auto border-t border-[#1A1A1A] pt-4">
            <p className="text-[10px] font-bold text-[#444] uppercase tracking-wider mb-3 px-3">Legal</p>
            <nav className="space-y-1">
              <button
                onClick={() => navigate('/terms')}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-[#111] transition-all group"
              >
                <FileText className="h-3.5 w-3.5 transition-transform group-hover:scale-105" />
                Termos de Uso
              </button>
              <button
                onClick={() => navigate('/privacy')}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-[#111] transition-all group"
              >
                <Lock className="h-3.5 w-3.5 transition-transform group-hover:scale-105" />
                Política de Privacidade
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content com scroll suave */}
        <main
          ref={contentRef}
          className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-57px)] py-10 px-6 lg:px-10 scroll-smooth"
        >
          {/* Page intro com animação */}
          <div className="mb-10 pb-10 border-b border-[#111] animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full px-3 py-1 text-[10px] text-[#555] mb-4">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Documentação Oficial
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Central de Ajuda</h2>
            <p className="text-[#555] leading-relaxed text-sm max-w-xl">
              Bem-vindo à documentação oficial do Marketplace. Aqui você encontra tudo que precisa para usar a plataforma.
            </p>
          </div>

          {/* Buying */}
          <section id="buying" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <ShoppingCart className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Compras</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Como Comprar</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-4">
              Comprar na nossa plataforma é simples. Siga os passos abaixo:
            </p>
            <div className="space-y-3">
              {[
                'Navegue pela loja e encontre o asset desejado',
                'Clique em "Adicionar ao Carrinho"',
                'Preencha seus dados no checkout',
                'Finalize o pagamento via PIX',
                'Aguarde a aprovação do pedido (até 30 minutos)',
                'Baixe seus arquivos em Meus Pedidos',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center text-[11px] text-[#555] group-hover:border-white/30 transition-colors">
                    {i + 1}
                  </div>
                  <span className="text-sm text-[#666] leading-relaxed group-hover:text-[#777] transition-colors">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Payment com card copiável */}
          <section id="payment" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <CreditCard className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Pagamento</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Pagamento via PIX</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-4">
              Trabalhamos exclusivamente com PIX — o meio de pagamento instantâneo do Banco Central.
            </p>
            <div className="bg-gradient-to-r from-[#0f0f0f] to-[#0a0a0a] border border-[#1e1e1e] rounded-xl p-4 mb-4 hover:border-[#2a2a2a] transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Chave PIX (e-mail)</p>
                <button 
                  onClick={() => copyToClipboard('pagamentos@marketplace.com')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-[#555]" />
                  )}
                  <span className="text-[10px] text-[#555]">{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <p className="text-sm text-white font-mono">pagamentos@marketplace.com</p>
            </div>
            <p className="text-[#666] text-sm leading-relaxed">
              Após o pagamento, seu pedido será aprovado em até <span className="text-white font-medium">30 minutos</span> em dias úteis.
            </p>
          </section>

          {/* Downloads */}
          <section id="downloads" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <Download className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Arquivos</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Downloads</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-3">
              Após a aprovação do pagamento, seus arquivos ficam disponíveis por <span className="text-white font-medium">7 dias</span>.
            </p>
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-4">
              <p className="text-xs text-[#555]">
                💡 Acesse <span className="text-white font-medium">Meus Pedidos</span> no dashboard e clique em "Download". Se o link expirar, entre em contato com o suporte.
              </p>
            </div>
          </section>

          {/* Wallet */}
          <section id="wallet" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <Wallet className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Carteira</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Carteira & Cashback</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-3">
              Toda compra aprovada gera <span className="text-white font-medium">5% de cashback</span> creditado automaticamente na sua carteira.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-3 text-center">
                <p className="text-xs text-[#555]">💰 Como ganhar</p>
                <p className="text-sm text-white font-medium">5% do valor da compra</p>
              </div>
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-3 text-center">
                <p className="text-xs text-[#555]">🛒 Como usar</p>
                <p className="text-sm text-white font-medium">Abate em compras futuras</p>
              </div>
            </div>
          </section>

          {/* Refund */}
          <section id="refund" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <RotateCcw className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Reembolso</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Política de Reembolso</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-3">
              Você pode solicitar reembolso dentro de <span className="text-white font-medium">7 dias</span> após a aprovação do pedido.
            </p>
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-4">
              <p className="text-xs text-[#555]">
                📋 Para solicitar, acesse <span className="text-white font-medium">Meus Pedidos</span> e clique em "Solicitar Reembolso".
              </p>
            </div>
          </section>

          {/* Licenses */}
          <section id="licenses" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <FileText className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Licenças</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Licenças</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Padrão', desc: 'Uso em 1 projeto pessoal ou comercial', icon: '📄' },
                { name: 'Extendida', desc: 'Uso em múltiplos projetos', icon: '📚' },
                { name: 'Comercial', desc: 'Uso sem restrições de escala', icon: '🏢' },
              ].map(({ name, desc, icon }) => (
                <div key={name} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4 hover:border-[#2a2a2a] transition-all">
                  <div className="text-lg mb-2">{icon}</div>
                  <p className="text-sm font-semibold text-white mb-1">{name}</p>
                  <p className="text-xs text-[#555] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Security */}
          <section id="security" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Segurança</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Segurança</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-500 text-xs">✓</span>
                </div>
                <p className="text-sm text-[#666]">Criptografia <span className="text-white font-medium">SSL</span> em todas as páginas</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-500 text-xs">✓</span>
                </div>
                <p className="text-sm text-[#666]">Pagamentos via PIX sem armazenar dados bancários</p>
              </div>
            </div>
          </section>

          {/* Support */}
          <section id="support" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <HeadphonesIcon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Suporte</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Suporte</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4">
                <p className="text-[10px] text-[#444] uppercase tracking-wider font-bold mb-1">Horário</p>
                <p className="text-sm text-white">Segunda a Sexta, 09h às 18h (BRT)</p>
              </div>
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4">
                <p className="text-[10px] text-[#444] uppercase tracking-wider font-bold mb-1">E-mail</p>
                <p className="text-sm text-white font-mono">suporte@marketplace.com</p>
              </div>
            </div>
          </section>

          {/* FAQ com acordeão */}
          <section id="faq" className="scroll-mt-6 mb-10 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <HelpCircle className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">FAQ</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-6">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Quanto tempo leva para aprovar o pagamento?',
                  a: 'Em dias úteis, a aprovação ocorre em até 30 minutos. Fora do horário comercial, pode levar até 12 horas.',
                },
                {
                  q: 'Posso usar o asset em mais de um projeto?',
                  a: 'Depende da licença adquirida. A licença padrão permite uso em 1 projeto. Para múltiplos projetos, adquira a licença extendida ou comercial.',
                },
                {
                  q: 'O link de download expirou. O que fazer?',
                  a: 'Entre em contato com o suporte informando o número do pedido. Reativamos o link por mais 7 dias.',
                },
                {
                  q: 'Posso pagar com cartão ou boleto?',
                  a: 'No momento aceitamos apenas PIX. Estamos trabalhando para adicionar novos métodos de pagamento em breve.',
                },
              ].map(({ q, a }, idx) => (
                <div key={idx} className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#2a2a2a] transition-all">
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white mb-2">{q}</p>
                    <p className="text-sm text-[#555] leading-relaxed">{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer da página */}
          <div className="mt-12 pt-6 border-t border-[#111] text-center">
            <p className="text-xs text-[#444]">© 2026 Marketplace. Todos os direitos reservados.</p>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}