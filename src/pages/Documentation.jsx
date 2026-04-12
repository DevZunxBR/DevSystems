// src/pages/Documentation.jsx - Estilo GitBook (CORRIGIDO)
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShoppingCart, CreditCard, Download, Wallet,
  RotateCcw, FileText, Shield, HeadphonesIcon, HelpCircle, Lock
} from 'lucide-react';

const DOCS_SECTIONS = [
  { id: 'buying', title: 'Como Comprar', icon: ShoppingCart },
  { id: 'payment', title: 'Pagamento', icon: CreditCard }, // <-- AQUI ESTAVA O ERRO
  { id: 'downloads', title: 'Downloads', icon: Download },
  { id: 'wallet', title: 'Carteira', icon: Wallet },
  { id: 'refund', title: 'Reembolsos', icon: RotateCcw },
  { id: 'licenses', title: 'Licenças', icon: FileText },
  { id: 'security', title: 'Segurança', icon: Shield },
  { id: 'support', title: 'Suporte', icon: HeadphonesIcon },
  { id: 'faq', title: 'FAQ', icon: HelpCircle },
];

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
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.history.pushState({}, '', `#${id}`);
  };

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-gray-900 font-semibold text-lg">Documentação</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-0 flex flex-1 w-full gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 py-8 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          <nav className="space-y-0.5">
            {DOCS_SECTIONS.map(({ id, title, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors
                  ${activeSection === id
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {title}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-3">Legal</p>
            <nav className="space-y-0.5">
              <button
                onClick={() => navigate('/terms')}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Termos de Uso
              </button>
              <button
                onClick={() => navigate('/privacy')}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Lock className="h-4 w-4" />
                Política de Privacidade
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main
          ref={contentRef}
          className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-57px)] py-8 px-0 lg:px-4"
        >
          <div className="max-w-3xl mx-auto">
            {/* Intro */}
            <div className="mb-12 pb-8 border-b border-gray-200">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Documentação</h1>
              <p className="text-gray-600 leading-relaxed">
                Bem-vindo à documentação oficial do DevAssets.
              </p>
            </div>

            {/* Como Comprar */}
            <section id="buying" className="mb-12 scroll-mt-20">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-5 w-5 text-gray-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Como Comprar</h2>
              </div>
              <p className="text-gray-600 mb-4">Siga os passos abaixo:</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                <li>Navegue pela loja e encontre o asset desejado</li>
                <li>Clique em "Adicionar ao Carrinho"</li>
                <li>Preencha seus dados no checkout</li>
                <li>Finalize o pagamento via PIX</li>
                <li>Aguarde a aprovação do pedido</li>
                <li>Baixe seus arquivos em Meus Pedidos</li>
              </ol>
            </section>

            {/* Pagamento */}
            <section id="payment" className="mb-12 scroll-mt-20">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Pagamento</h2>
              </div>
              <p className="text-gray-600 mb-2">Aceitamos PIX.</p>
              <p className="text-gray-600">
                <strong className="text-gray-900">Chave PIX:</strong> pagamentos@devassets.com
              </p>
              <p className="text-gray-600 mt-2">Aprovação em até 30 minutos.</p>
            </section>

            {/* Downloads */}
            <section id="downloads" className="mb-12 scroll-mt-20">
              <div className="flex items-center gap-2 mb-4">
                <Download className="h-5 w-5 text-gray-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Downloads</h2>
              </div>
              <p className="text-gray-600">
                Arquivos disponíveis por 7 dias. Acesse Meus Pedidos.
              </p>
            </section>

            {/* Carteira */}
            <section id="wallet" className="mb-12 scroll-mt-20">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="h-5 w-5 text-gray-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Carteira</h2>
              </div>
              <p className="text-gray-600">5% de cashback em cada compra.</p>
            </section>

            {/* Reembolsos */}
            <section id="refund" className="mb-12 scroll-mt-20">
              <div className="flex items-center gap-2 mb-4">
                <RotateCcw className="h-5 w-5 text-gray-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Reembolsos</h2>
              </div>
              <p className="text-gray-600">Solicite em até 7 dias.</p>
            </section>

            {/* Licenças */}
            <section id="licenses" className="mb-12 scroll-mt-20">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-gray-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Licenças</h2>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Padrão - 1 projeto</li>
                <li>Extendida - múltiplos projetos</li>
                <li>Comercial - sem restrições</li>
              </ul>
            </section>

            {/* Segurança */}
            <section id="security" className="mb-12 scroll-mt-20">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-gray-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Segurança</h2>
              </div>
              <p className="text-gray-600">Criptografia SSL. Pagamentos seguros via PIX.</p>
            </section>

            {/* Suporte */}
            <section id="support" className="mb-12 scroll-mt-20">
              <div className="flex items-center gap-2 mb-4">
                <HeadphonesIcon className="h-5 w-5 text-gray-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Suporte</h2>
              </div>
              <p className="text-gray-600">Segunda a Sexta, 09h às 18h.</p>
              <p className="text-gray-600 mt-1">E-mail: suporte@devassets.com</p>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-12 scroll-mt-20">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-gray-500" />
                <h2 className="text-2xl font-semibold text-gray-900">FAQ</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">Quanto tempo leva para aprovar?</p>
                  <p className="text-gray-600">Até 30 minutos em dias úteis.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Posso usar em múltiplos projetos?</p>
                  <p className="text-gray-600">Depende da licença adquirida.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Link expirou?</p>
                  <p className="text-gray-600">Contate o suporte para reativar.</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}