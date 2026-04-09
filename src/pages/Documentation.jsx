// src/pages/Documentation.jsx - Versão limpa sem emojis
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ShoppingCart, CreditCard, Download,
  Wallet, RefreshCcw, ShieldCheck, MessageCircle, HelpCircle,
  ChevronRight, ArrowRight
} from 'lucide-react';

const DOCS_SECTIONS = [
  { id: 'introduction', title: 'Introdução' },
  { id: 'buying', title: 'Como Comprar' },
  { id: 'payment', title: 'Pagamento via PIX' },
  { id: 'downloads', title: 'Downloads' },
  { id: 'wallet', title: 'Carteira & Cashback' },
  { id: 'refund', title: 'Reembolsos' },
  { id: 'licenses', title: 'Licenças' },
  { id: 'support', title: 'Suporte' },
  { id: 'faq', title: 'Perguntas Frequentes' },
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">M</span>
              </div>
              <span className="text-white font-bold tracking-tight">Marketplace</span>
            </div>
            <div className="flex items-center gap-6">
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-bold text-[#444] uppercase tracking-wider mb-4">Conteúdo</p>
              <nav className="space-y-1">
                {DOCS_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === section.id
                        ? 'bg-white text-black font-medium'
                        : 'text-[#555] hover:text-white hover:bg-[#111]'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-invert max-w-none">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-20 mb-12">
                <h1 className="text-3xl font-black text-white mb-4">Documentação</h1>
                <p className="text-[#666] leading-relaxed mb-4">
                  Bem-vindo à documentação oficial do Marketplace. Aqui você encontra todas as informações necessárias para utilizar nossa plataforma.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <button onClick={() => navigate('/store')} className="text-white hover:underline flex items-center gap-1">
                    Ir para a Loja <ArrowRight className="h-3 w-3" />
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="text-white hover:underline flex items-center gap-1">
                    Ir para o Dashboard <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </section>

              {/* Como Comprar */}
              <section id="buying" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Como Comprar</h2>
                <p className="text-[#666] leading-relaxed mb-3 text-sm">
                  Siga os passos abaixo:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-[#666] text-sm">
                  <li>Navegue pela <button onClick={() => navigate('/store')} className="text-white hover:underline">loja</button> e encontre o asset desejado</li>
                  <li>Clique em "Adicionar ao Carrinho"</li>
                  <li>Preencha seus dados no <button onClick={() => navigate('/checkout')} className="text-white hover:underline">checkout</button></li>
                  <li>Finalize o pagamento via PIX</li>
                  <li>Aguarde a aprovação do pedido</li>
                  <li>Baixe seus arquivos em <button onClick={() => navigate('/dashboard/orders')} className="text-white hover:underline">Meus Pedidos</button></li>
                </ol>
              </section>

              {/* Pagamento */}
              <section id="payment" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Pagamento via PIX</h2>
                <p className="text-[#666] leading-relaxed mb-3 text-sm">
                  Trabalhamos exclusivamente com PIX - pagamento instantâneo do Banco Central.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3 mb-4">
                  <p className="text-xs text-[#555] mb-1">Chave PIX (e-mail)</p>
                  <code className="text-sm text-white font-mono">pagamentos@marketplace.com</code>
                </div>
                <div className="space-y-2 text-sm text-[#555]">
                  <p>✓ Aprovação em até 30 minutos em dias úteis</p>
                  <p>✓ Pagamento 100% seguro</p>
                  <p>✓ Confirmação automática</p>
                </div>
              </section>

              {/* Downloads */}
              <section id="downloads" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Downloads</h2>
                <p className="text-[#666] leading-relaxed mb-3 text-sm">
                  Arquivos ficam disponíveis por 7 dias após aprovação.
                </p>
                <p className="text-[#666] leading-relaxed text-sm">
                  Acesse <button onClick={() => navigate('/dashboard/orders')} className="text-white hover:underline">Meus Pedidos</button> e clique em "Download".
                </p>
              </section>

              {/* Carteira */}
              <section id="wallet" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Carteira & Cashback</h2>
                <p className="text-[#666] leading-relaxed mb-3 text-sm">
                  Toda compra aprovada gera 5% de cashback na sua carteira.
                </p>
                <p className="text-[#666] leading-relaxed text-sm">
                  O saldo pode ser usado em compras futuras.
                </p>
              </section>

              {/* Reembolsos */}
              <section id="refund" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Política de Reembolso</h2>
                <p className="text-[#666] leading-relaxed mb-3 text-sm">
                  Solicite reembolso em até 7 dias após a aprovação.
                </p>
                <p className="text-[#666] leading-relaxed text-sm">
                  Acesse <button onClick={() => navigate('/dashboard/orders')} className="text-white hover:underline">Meus Pedidos</button> e clique em "Solicitar Reembolso".
                </p>
              </section>

              {/* Licenças */}
              <section id="licenses" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Licenças</h2>
                <ul className="list-disc list-inside space-y-2 text-[#666] text-sm">
                  <li><strong className="text-white">Licença Padrão</strong> - Uso em 1 projeto</li>
                  <li><strong className="text-white">Licença Extendida</strong> - Uso em múltiplos projetos</li>
                  <li><strong className="text-white">Licença Comercial</strong> - Uso sem restrições</li>
                </ul>
              </section>

              {/* Suporte */}
              <section id="support" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Suporte</h2>
                <p className="text-[#666] leading-relaxed mb-2 text-sm">
                  <strong className="text-white">Horário:</strong> Segunda a Sexta, 09h às 18h (BRT)
                </p>
                <p className="text-[#666] leading-relaxed text-sm">
                  <strong className="text-white">Contato:</strong> Discord ou suporte@marketplace.com
                </p>
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Perguntas Frequentes</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">Quanto tempo leva para aprovar o pagamento?</h3>
                  <p className="text-[#666] leading-relaxed text-sm">
                    Em dias úteis, a aprovação ocorre em até 30 minutos. Fora do horário comercial, até 12 horas.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">Posso usar o asset em mais de um projeto?</h3>
                  <p className="text-[#666] leading-relaxed text-sm">
                    Depende da licença. A licença padrão permite uso em 1 projeto.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">O link de download expirou?</h3>
                  <p className="text-[#666] leading-relaxed text-sm">
                    Contate o suporte com o número do pedido para reativar por mais 7 dias.
                  </p>
                </div>
              </section>

              {/* Footer */}
              <div className="border-t border-[#1A1A1A] pt-6 mt-12">
                <p className="text-xs text-[#444] text-center">
                  © 2026 Marketplace. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}