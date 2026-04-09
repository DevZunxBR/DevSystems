// src/pages/Documentation.jsx - Versão simples estilo documentação técnica
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ShoppingCart, CreditCard, Download,
  Wallet, RefreshCcw, ShieldCheck, MessageCircle, HelpCircle,
  ChevronRight
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
      {/* Header com logo e navegação */}
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

          {/* Conteúdo - Apenas texto, sem cards */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-invert max-w-none">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-20 mb-12">
                <h1 className="text-3xl font-black text-white mb-4">Documentação</h1>
                <p className="text-[#666] leading-relaxed mb-4">
                  Bem-vindo à documentação oficial do Marketplace. Aqui você encontra todas as informações necessárias para utilizar nossa plataforma.
                </p>
                <p className="text-[#666] leading-relaxed">
                  Somos uma plataforma de assets digitais para desenvolvedores, oferecendo scripts, sistemas completos e UI kits prontos para produção.
                </p>
              </section>

              {/* Como Comprar */}
              <section id="buying" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Como Comprar</h2>
                <p className="text-[#666] leading-relaxed mb-3">
                  Comprar na nossa plataforma é simples. Siga os passos abaixo:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-[#666]">
                  <li>Navegue pela loja e encontre o asset desejado</li>
                  <li>Clique em "Adicionar ao Carrinho"</li>
                  <li>Preencha seus dados no checkout</li>
                  <li>Finalize o pagamento via PIX</li>
                  <li>Aguarde a aprovação do pedido</li>
                  <li>Baixe seus arquivos em Meus Pedidos</li>
                </ol>
              </section>

              {/* Pagamento */}
              <section id="payment" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Pagamento via PIX</h2>
                <p className="text-[#666] leading-relaxed mb-3">
                  Trabalhamos exclusivamente com PIX - o meio de pagamento instantâneo do Banco Central.
                </p>
                <p className="text-[#666] leading-relaxed mb-3">
                  <strong className="text-white">Chave PIX (e-mail):</strong> pagamentos@marketplace.com
                </p>
                <p className="text-[#666] leading-relaxed">
                  Após o pagamento, seu pedido será aprovado em até 30 minutos em dias úteis.
                </p>
              </section>

              {/* Downloads */}
              <section id="downloads" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Downloads</h2>
                <p className="text-[#666] leading-relaxed mb-3">
                  Após a aprovação do pagamento, seus arquivos ficam disponíveis por 7 dias.
                </p>
                <p className="text-[#666] leading-relaxed">
                  Acesse <strong className="text-white">Meus Pedidos</strong> no dashboard e clique em "Download" para baixar seus arquivos.
                </p>
              </section>

              {/* Carteira */}
              <section id="wallet" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Carteira & Cashback</h2>
                <p className="text-[#666] leading-relaxed mb-3">
                  Toda compra aprovada gera <strong className="text-white">5% de cashback</strong> creditado automaticamente na sua carteira.
                </p>
                <p className="text-[#666] leading-relaxed">
                  O saldo acumulado pode ser usado para abater em compras futuras.
                </p>
              </section>

              {/* Reembolsos */}
              <section id="refund" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Política de Reembolso</h2>
                <p className="text-[#666] leading-relaxed mb-3">
                  Você pode solicitar reembolso dentro de <strong className="text-white">7 dias</strong> após a aprovação do pedido.
                </p>
                <p className="text-[#666] leading-relaxed">
                  Para solicitar, acesse Meus Pedidos e clique em "Solicitar Reembolso".
                </p>
              </section>

              {/* Licenças */}
              <section id="licenses" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Licenças</h2>
                <p className="text-[#666] leading-relaxed mb-3">
                  Oferecemos três tipos de licença:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#666]">
                  <li><strong className="text-white">Licença Padrão</strong> - Uso em 1 projeto pessoal ou comercial</li>
                  <li><strong className="text-white">Licença Extendida</strong> - Uso em múltiplos projetos</li>
                  <li><strong className="text-white">Licença Comercial</strong> - Uso sem restrições</li>
                </ul>
              </section>

              {/* Suporte */}
              <section id="support" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Suporte</h2>
                <p className="text-[#666] leading-relaxed mb-3">
                  Horário de atendimento: <strong className="text-white">Segunda a Sexta, 09h às 18h (BRT)</strong>
                </p>
                <p className="text-[#666] leading-relaxed">
                  Entre em contato pelo Discord ou e-mail: suporte@marketplace.com
                </p>
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Perguntas Frequentes</h2>
                
                <h3 className="text-xl font-bold text-white mt-6 mb-2">Quanto tempo leva para aprovar o pagamento?</h3>
                <p className="text-[#666] leading-relaxed mb-4">
                  Em dias úteis, a aprovação ocorre em até 30 minutos. Fora do horário comercial, pode levar até 12 horas.
                </p>
                
                <h3 className="text-xl font-bold text-white mt-6 mb-2">Posso usar o asset em mais de um projeto?</h3>
                <p className="text-[#666] leading-relaxed mb-4">
                  Depende da licença adquirida. A licença padrão permite uso em 1 projeto. Para múltiplos projetos, adquira a licença extendida ou comercial.
                </p>
                
                <h3 className="text-xl font-bold text-white mt-6 mb-2">O link de download expirou. O que fazer?</h3>
                <p className="text-[#666] leading-relaxed mb-4">
                  Entre em contato com o suporte informando o número do pedido. Reativamos o link por mais 7 dias.
                </p>
                
                <h3 className="text-xl font-bold text-white mt-6 mb-2">Posso pagar com cartão ou boleto?</h3>
                <p className="text-[#666] leading-relaxed mb-4">
                  No momento aceitamos apenas PIX. Estamos trabalhando para adicionar novos métodos de pagamento em breve.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}