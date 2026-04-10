import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  Download,
  Wallet,
  RotateCcw,
  FileText,
  Shield,
  HeadphonesIcon,
  HelpCircle,
  Lock,
  ChevronRight,
  Copy,
  CheckCircle,
  ChevronDown,
  Search,
} from 'lucide-react';

const DOCS_SECTIONS = [
  { id: 'buying', title: 'Como Comprar', icon: ShoppingCart, group: 'Guia' },
  { id: 'payment', title: 'Pagamento via PIX', icon: CreditCard, group: 'Guia' },
  { id: 'downloads', title: 'Downloads', icon: Download, group: 'Guia' },
  { id: 'wallet', title: 'Carteira & Cashback', icon: Wallet, group: 'Guia' },
  { id: 'refund', title: 'Reembolsos', icon: RotateCcw, group: 'Guia' },
  { id: 'licenses', title: 'Licencas', icon: FileText, group: 'Guia' },
  { id: 'security', title: 'Seguranca', icon: Shield, group: 'Ajuda' },
  { id: 'support', title: 'Suporte', icon: HeadphonesIcon, group: 'Ajuda' },
  { id: 'faq', title: 'Perguntas Frequentes', icon: HelpCircle, group: 'Ajuda' },
];

const GROUPS = ['Guia', 'Ajuda'];

const BUYING_STEPS = [
  'Navegue pela loja e encontre o asset desejado',
  'Clique em "Adicionar ao Carrinho"',
  'Preencha seus dados no checkout',
  'Finalize o pagamento via PIX',
  'Aguarde a aprovacao do pedido (ate 30 minutos)',
  'Baixe seus arquivos em Meus Pedidos',
];

const FAQ_ITEMS = [
  {
    q: 'Quanto tempo leva para aprovar o pagamento?',
    a: 'Em dias uteis, a aprovacao ocorre em ate 30 minutos. Fora do horario comercial, pode levar ate 12 horas.',
  },
  {
    q: 'Posso usar o asset em mais de um projeto?',
    a: 'Depende da licenca adquirida. A licenca padrao permite uso em 1 projeto. Para multiplos projetos, adquira a licenca estendida ou comercial.',
  },
  {
    q: 'O link de download expirou. O que fazer?',
    a: 'Entre em contato com o suporte informando o numero do pedido. Reativamos o link por mais 7 dias.',
  },
  {
    q: 'Posso pagar com cartao ou boleto?',
    a: 'No momento aceitamos apenas PIX. Estamos trabalhando para adicionar novos metodos de pagamento em breve.',
  },
  {
    q: 'Como acompanhar meu pedido?',
    a: 'Acesse o dashboard em "Meus Pedidos" para ver status, aprovacao, downloads e historico.',
  },
];

export default function Documentation() {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [activeSection, setActiveSection] = useState('buying');
  const [copiedKey, setCopiedKey] = useState('');
  const [faqQuery, setFaqQuery] = useState('');
  const [openFaqIndexes, setOpenFaqIndexes] = useState(() => new Set([0]));
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionMap = useMemo(() => {
    const map = new Map();
    for (const section of DOCS_SECTIONS) {
      map.set(section.id, section);
    }
    return map;
  }, []);

  const filteredFaq = useMemo(() => {
    const query = faqQuery.trim().toLowerCase();
    if (!query) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(({ q, a }) => q.toLowerCase().includes(query) || a.toLowerCase().includes(query));
  }, [faqQuery]);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sectionMap.has(hash)) {
      setActiveSection(hash);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  }, [sectionMap]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState({}, '', `#${id}`);
    }
  };

  const copyToClipboard = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1800);
    } catch {
      setCopiedKey('');
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const sections = DOCS_SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: content,
        threshold: 0.35,
        rootMargin: '-10% 0px -45% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    const onScroll = () => {
      const maxScroll = content.scrollHeight - content.clientHeight;
      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(100, Math.max(0, (content.scrollTop / maxScroll) * 100)));
    };

    content.addEventListener('scroll', onScroll);
    onScroll();

    return () => {
      observer.disconnect();
      content.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-20 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-all hover:translate-x-[-2px]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <div className="w-px h-5 bg-[#1A1A1A]" />
            <h1 className="text-white font-bold text-lg truncate">Documentacao</h1>
          </div>
          <div className="text-xs text-[#444] hidden sm:block">Central de ajuda</div>
        </div>
        <div className="h-[2px] bg-[#111]">
          <div className="h-full bg-white transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-0 flex flex-1 w-full gap-0">
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-[#1A1A1A] py-8 pr-6 sticky top-[59px] h-[calc(100vh-59px)] bg-gradient-to-b from-transparent to-black/30">
          {GROUPS.map((group) => (
            <div key={group} className="mb-6">
              <p className="text-[10px] font-bold text-[#444] uppercase tracking-wider mb-3 px-3">{group}</p>
              <nav className="space-y-1">
                {DOCS_SECTIONS.filter((section) => section.group === group).map(({ id, title, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`group w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeSection === id
                        ? 'text-white bg-[#111] border-l-2 border-white rounded-l-none'
                        : 'text-[#555] hover:text-white hover:bg-[#111]'
                    }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                        activeSection === id ? 'text-white' : 'text-[#555]'
                      }`}
                    />
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
                Politica de Privacidade
              </button>
            </nav>
          </div>
        </aside>

        <main
          ref={contentRef}
          className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-59px)] py-8 md:py-10 px-0 lg:px-10 scroll-smooth"
        >
          <div className="lg:hidden mb-6 px-1">
            <label htmlFor="mobile-doc-nav" className="text-[10px] font-bold text-[#444] uppercase tracking-wider mb-2 block">
              Navegacao rapida
            </label>
            <div className="relative">
              <select
                id="mobile-doc-nav"
                value={activeSection}
                onChange={(event) => scrollToSection(event.target.value)}
                className="w-full appearance-none bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#555]"
              >
                {DOCS_SECTIONS.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-[#111] animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full px-3 py-1 text-[10px] text-[#555] mb-4">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Documentacao Oficial
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Central de Ajuda</h2>
            <p className="text-[#555] leading-relaxed text-sm max-w-2xl">
              Guia completo para compra, pagamento, downloads, carteira e suporte. Tudo em um so lugar para acelerar seu fluxo na loja.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-3">
                <p className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Tempo medio</p>
                <p className="text-sm text-white font-semibold mt-1">Aprovacao em ate 30 min</p>
              </div>
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-3">
                <p className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Prazo de download</p>
                <p className="text-sm text-white font-semibold mt-1">Arquivos por 7 dias</p>
              </div>
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-3">
                <p className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Atendimento</p>
                <p className="text-sm text-white font-semibold mt-1">Seg a Sex, 09h as 18h</p>
              </div>
            </div>
          </div>

          <section id="buying" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <ShoppingCart className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Compras</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Como Comprar</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-4">Comprar na plataforma e simples. Siga os passos:</p>
            <div className="space-y-3">
              {BUYING_STEPS.map((step, index) => (
                <div key={step} className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center text-[11px] text-[#555] group-hover:border-white/30 transition-colors">
                    {index + 1}
                  </div>
                  <span className="text-sm text-[#666] leading-relaxed group-hover:text-[#777] transition-colors">{step}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="payment" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <CreditCard className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Pagamento</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Pagamento via PIX</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-4">
              Trabalhamos exclusivamente com PIX, o meio de pagamento instantaneo do Banco Central.
            </p>

            <div className="bg-gradient-to-r from-[#0f0f0f] to-[#0a0a0a] border border-[#1e1e1e] rounded-xl p-4 mb-3 hover:border-[#2a2a2a] transition-all">
              <div className="flex items-center justify-between mb-2 gap-3">
                <p className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Chave PIX (e-mail)</p>
                <button
                  onClick={() => copyToClipboard('pagamentos@marketplace.com', 'pix')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors"
                >
                  {copiedKey === 'pix' ? (
                    <CheckCircle className="h-3 w-3 text-white" />
                  ) : (
                    <Copy className="h-3 w-3 text-[#555]" />
                  )}
                  <span className="text-[10px] text-[#555]">{copiedKey === 'pix' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <p className="text-sm text-white font-mono break-all">pagamentos@marketplace.com</p>
            </div>

            <p className="text-[#666] text-sm leading-relaxed">
              Aprovacao em ate <span className="text-white font-medium">30 minutos</span> em dias uteis.
            </p>
          </section>

          <section id="downloads" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <Download className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Arquivos</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Downloads</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-3">
              Depois da aprovacao, os arquivos ficam disponiveis por <span className="text-white font-medium">7 dias</span>.
            </p>
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-4">
              <p className="text-xs text-[#555]">
                Acesse <span className="text-white font-medium">Meus Pedidos</span> no dashboard e clique em "Download". Se o link expirar, fale com o suporte.
              </p>
            </div>
          </section>

          <section id="wallet" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <Wallet className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Carteira</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Carteira & Cashback</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-3">
              Toda compra aprovada gera <span className="text-white font-medium">5% de cashback</span> automaticamente na carteira.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-3 text-center">
                <p className="text-xs text-[#555]">Como ganhar</p>
                <p className="text-sm text-white font-medium">5% do valor da compra</p>
              </div>
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg p-3 text-center">
                <p className="text-xs text-[#555]">Como usar</p>
                <p className="text-sm text-white font-medium">Abate em compras futuras</p>
              </div>
            </div>
          </section>

          <section id="refund" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <RotateCcw className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Reembolso</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Politica de Reembolso</h2>
            <p className="text-[#666] text-sm leading-relaxed mb-3">
              Voce pode solicitar reembolso dentro de <span className="text-white font-medium">7 dias</span> apos a aprovacao.
            </p>
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-4">
              <p className="text-xs text-[#555]">
                Para solicitar, abra <span className="text-white font-medium">Meus Pedidos</span> e clique em "Solicitar Reembolso".
              </p>
            </div>
          </section>

          <section id="licenses" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <FileText className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Licencas</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Licencas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Padrao', desc: 'Uso em 1 projeto pessoal ou comercial' },
                { name: 'Estendida', desc: 'Uso em multiplos projetos' },
                { name: 'Comercial', desc: 'Uso sem restricoes de escala' },
              ].map(({ name, desc }) => (
                <div key={name} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4 hover:border-[#2a2a2a] transition-all">
                  <p className="text-sm font-semibold text-white mb-1">{name}</p>
                  <p className="text-xs text-[#555] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="security" className="scroll-mt-6 mb-10 pb-10 border-b border-[#111] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">Seguranca</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Seguranca</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-sm text-[#666]">Criptografia <span className="text-white font-medium">SSL</span> em todas as paginas</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-sm text-[#666]">Pagamentos via PIX sem armazenar dados bancarios</p>
              </div>
            </div>
          </section>

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
                <p className="text-[10px] text-[#444] uppercase tracking-wider font-bold mb-1">Horario</p>
                <p className="text-sm text-white">Segunda a Sexta, 09h as 18h (BRT)</p>
              </div>
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4">
                <p className="text-[10px] text-[#444] uppercase tracking-wider font-bold mb-1">E-mail</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-white font-mono break-all">suporte@marketplace.com</p>
                  <button
                    onClick={() => copyToClipboard('suporte@marketplace.com', 'support-email')}
                    className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors"
                  >
                    {copiedKey === 'support-email' ? (
                      <CheckCircle className="h-3 w-3 text-white" />
                    ) : (
                      <Copy className="h-3 w-3 text-[#555]" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="scroll-mt-6 mb-10 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#111] rounded-lg">
                <HelpCircle className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] text-[#444] uppercase tracking-wider font-bold">FAQ</span>
            </div>

            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold text-white">Perguntas Frequentes</h2>
              <span className="text-xs text-[#444]">{filteredFaq.length} resultado(s)</span>
            </div>

            <div className="relative mb-4">
              <Search className="h-4 w-4 text-[#555] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={faqQuery}
                onChange={(event) => setFaqQuery(event.target.value)}
                placeholder="Buscar no FAQ"
                className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#555]"
              />
            </div>

            <div className="space-y-3">
              {filteredFaq.length === 0 && (
                <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl p-4">
                  <p className="text-sm text-[#555]">Nenhum resultado encontrado para sua busca.</p>
                </div>
              )}

              {filteredFaq.map(({ q, a }) => {
                const originalIndex = FAQ_ITEMS.findIndex((item) => item.q === q);
                const isOpen = openFaqIndexes.has(originalIndex);

                return (
                  <div key={q} className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#2a2a2a] transition-all">
                    <button
                      onClick={() => toggleFaq(originalIndex)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4"
                    >
                      <p className="text-sm font-semibold text-white">{q}</p>
                      <ChevronDown
                        className={`h-4 w-4 text-[#555] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 -mt-1">
                        <p className="text-sm text-[#555] leading-relaxed">{a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-12 pt-6 border-t border-[#111] text-center">
            <p className="text-xs text-[#444]">© 2026 Marketplace. Todos os direitos reservados.</p>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
          animation: fadeIn 0.45s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.45s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
