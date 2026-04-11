// src/pages/Documentation.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShoppingCart, CreditCard, Download, Wallet,
  RotateCcw, FileText, Shield, HeadphonesIcon, HelpCircle, Lock
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
      contentRef.current.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' });
    }
    window.history.pushState({}, '', `#${id}`);
  };

  // Update active section on scroll
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const handler = () => {
      const ids = DOCS_SECTIONS.map(s => s.id);
      let current = ids[0];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop - content.scrollTop <= 80) current = id;
      });
      setActiveSection(current);
    };
    content.addEventListener('scroll', handler);
    return () => content.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A] sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-white font-bold text-lg">Documentação</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-0 flex flex-1 w-full gap-0">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-[#1A1A1A] py-8 pr-6 sticky top-[57px] h-[calc(100vh-57px)]">
          {GROUPS.map(group => (
            <div key={group} className="mb-6">
              <p className="text-[10px] font-semibold text-[#333] uppercase tracking-widest mb-2 px-3">
                {group}
              </p>
              <nav className="space-y-0.5">
                {DOCS_SECTIONS.filter(s => s.group === group).map(({ id, title, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
                      ${activeSection === id
                        ? 'text-white bg-[#111] border-l-2 border-white rounded-l-none'
                        : 'text-[#555] hover:text-[#ccc] hover:bg-[#0f0f0f]'
                      }`}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    {title}
                  </button>
                ))}
              </nav>
            </div>
          ))}

          <div className="mt-auto border-t border-[#1A1A1A] pt-4">
            <p className="text-[10px] font-semibold text-[#333] uppercase tracking-widest mb-2 px-3">Legal</p>
            <nav className="space-y-0.5">
              <button
                onClick={() => navigate('/terms')}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#555] hover:text-[#ccc] hover:bg-[#0f0f0f] transition-all"
              >
                <FileText className="h-3.5 w-3.5" />
                Termos de Uso
              </button>
              <button
                onClick={() => navigate('/privacy')}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#555] hover:text-[#ccc] hover:bg-[#0f0f0f] transition-all"
              >
                <Lock className="h-3.5 w-3.5" />
                Política de Privacidade
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main
          ref={contentRef}
          className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-57px)] py-10 px-10"
        >
          {/* Page intro */}
          <div className="mb-10 pb-10 border-b border-[#111]">
            <h2 className="text-3xl font-black text-white mb-3">Documentação</h2>
            <p className="text-[#555] leading-relaxed text-sm max-w-xl">
              Bem-vindo à documentação oficial do DevAssets. Aqui você encontra tudo que precisa para usar a plataforma.
            </p>
          </div>

          {/* Buying */}
          <section id="buying" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111]">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="h-3.5 w-3.5 text-[#444]" />
              <span className="text-[10px] text-[#444] uppercase tracking-widest font-semibold">Compras</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Como Comprar</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-4">
              Comprar na nossa plataforma é simples. Siga os passos abaixo:
            </p>
            <ol className="space-y-3">
              {[
                'Navegue pela loja e encontre o asset desejado',
                'Clique em "Adicionar ao Carrinho"',
                'Preencha seus dados no checkout',
                'Finalize o pagamento via PIX',
                'Aguarde a aprovação do pedido (até 30 minutos)',
                'Baixe seus arquivos em Meus Pedidos',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[11px] text-[#555] mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-[#666] leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Payment */}
          <section id="payment" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111]">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-3.5 w-3.5 text-[#444]" />
              <span className="text-[10px] text-[#444] uppercase tracking-widest font-semibold">Pagamento</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Pagamento via PIX</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-4">
              Trabalhamos exclusivamente com PIX — o meio de pagamento instantâneo do Banco Central.
            </p>
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-4 mb-4">
              <p className="text-[10px] text-[#444] uppercase tracking-widest font-semibold mb-1">Chave PIX</p>
              <p className="text-sm text-[#ccc] font-medium">pagamentos@DevAssets.com</p>
            </div>
            <p className="text-[#666] text-sm leading-relaxed">
              Após o pagamento, seu pedido será aprovado em até <span className="text-white font-medium">30 minutos</span> em dias úteis.
            </p>
          </section>

          {/* Downloads */}
          <section id="downloads" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111]">
            <div className="flex items-center gap-2 mb-3">
              <Download className="h-3.5 w-3.5 text-[#444]" />
              <span className="text-[10px] text-[#444] uppercase tracking-widest font-semibold">Arquivos</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Downloads</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-3">
              Após a aprovação do pagamento, seus arquivos ficam disponíveis por <span className="text-white font-medium">7 dias</span>.
            </p>
            <p className="text-[#666] text-sm leading-relaxed">
              Acesse <span className="text-white font-medium">Meus Pedidos</span> no dashboard e clique em "Download" para baixar seus arquivos. Se o link expirar, entre em contato com o suporte.
            </p>
          </section>

          {/* Wallet */}
          <section id="wallet" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111]">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="h-3.5 w-3.5 text-[#444]" />
              <span className="text-[10px] text-[#444] uppercase tracking-widest font-semibold">Carteira</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Carteira & Cashback</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-3">
              Toda compra aprovada gera <span className="text-white font-medium">5% de cashback</span> creditado automaticamente na sua carteira.
            </p>
            <p className="text-[#666] text-sm leading-relaxed">
              O saldo acumulado pode ser usado para abater em compras futuras diretamente no checkout.
            </p>
          </section>

          {/* Refund */}
          <section id="refund" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111]">
            <div className="flex items-center gap-2 mb-3">
              <RotateCcw className="h-3.5 w-3.5 text-[#444]" />
              <span className="text-[10px] text-[#444] uppercase tracking-widest font-semibold">Reembolso</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Política de Reembolso</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-3">
              Você pode solicitar reembolso dentro de <span className="text-white font-medium">7 dias</span> após a aprovação do pedido.
            </p>
            <p className="text-[#666] text-sm leading-relaxed">
              Para solicitar, acesse <span className="text-white font-medium">Meus Pedidos</span> e clique em "Solicitar Reembolso". O valor é estornado em até 5 dias úteis.
            </p>
          </section>

          {/* Licenses */}
          <section id="licenses" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111]">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-3.5 w-3.5 text-[#444]" />
              <span className="text-[10px] text-[#444] uppercase tracking-widest font-semibold">Licenças</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Licenças</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-5">
              Cada asset vem com uma licença que define como você pode utilizá-lo. Escolha a que se encaixa no seu projeto:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Padrão', desc: 'Uso em 1 projeto pessoal ou comercial' },
                { name: 'Extendida', desc: 'Uso em múltiplos projetos' },
                { name: 'Comercial', desc: 'Uso sem restrições de escala' },
              ].map(({ name, desc }) => (
                <div key={name} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-4">
                  <p className="text-sm font-semibold text-[#ccc] mb-1">{name}</p>
                  <p className="text-xs text-[#555] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Security */}
          <section id="security" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111]">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-3.5 w-3.5 text-[#444]" />
              <span className="text-[10px] text-[#444] uppercase tracking-widest font-semibold">Segurança</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Segurança</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-3">
              A segurança dos seus dados é nossa prioridade. Utilizamos criptografia <span className="text-white font-medium">SSL</span> em todas as páginas.
            </p>
            <p className="text-[#666] text-sm leading-relaxed">
              Pagamentos são processados via PIX diretamente pelo Banco Central, sem armazenar dados bancários na plataforma.
            </p>
          </section>

          {/* Support */}
          <section id="support" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111]">
            <div className="flex items-center gap-2 mb-3">
              <HeadphonesIcon className="h-3.5 w-3.5 text-[#444]" />
              <span className="text-[10px] text-[#444] uppercase tracking-widest font-semibold">Suporte</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Suporte</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-5">
              Atendemos de <span className="text-white font-medium">segunda a sexta, das 09h às 18h (BRT)</span>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-4">
                <p className="text-[10px] text-[#444] uppercase tracking-widest font-semibold mb-1">E-mail</p>
                <p className="text-sm text-[#ccc] font-medium">suporte@DevAssets.com</p>
              </div>
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-4">
                <p className="text-[10px] text-[#444] uppercase tracking-widest font-semibold mb-1">Canal</p>
                <p className="text-sm text-[#ccc] font-medium">Discord da plataforma</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-6 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-3.5 w-3.5 text-[#444]" />
              <span className="text-[10px] text-[#444] uppercase tracking-widest font-semibold">FAQ</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-6">Perguntas Frequentes</h2>
            <div className="space-y-0 divide-y divide-[#111]">
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
              ].map(({ q, a }) => (
                <div key={q} className="py-5">
                  <p className="text-sm font-semibold text-[#ccc] mb-2">{q}</p>
                  <p className="text-sm text-[#555] leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}