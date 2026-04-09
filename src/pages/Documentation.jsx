// src/pages/Documentation.jsx - Sem footer, com links para Termos de Uso e Política de Privacidade
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, FileText, Lock } from 'lucide-react';

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
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header com botão voltar */}
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
            <div className="flex items-center gap-4">
              {/* Botão Termos de Uso no header */}
              <button 
                onClick={() => navigate('/terms')} 
                className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors"
              >
                <FileText className="h-4 w-4" />
                Termos de Uso
              </button>
              {/* Botão Política de Privacidade no header */}
              <button 
                onClick={() => navigate('/privacy')} 
                className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors"
              >
                <Lock className="h-4 w-4" />
                Privacidade
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Conteúdo principal - Esquerda */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-invert max-w-none">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-20 mb-12">
                <h1 className="text-3xl font-black text-white mb-4">Documentação</h1>
                <p className="text-[#666] leading-relaxed text-base">
                  Bem-vindo à documentação oficial do Marketplace. Aqui você encontra todas as informações necessárias para utilizar nossa plataforma.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mt-6">
                  <p className="text-sm text-[#555]">
                    Somos uma plataforma de assets digitais para desenvolvedores, oferecendo scripts, sistemas completos e UI kits prontos para produção.
                  </p>
                </div>
              </section>

              {/* Como Comprar */}
              <section id="buying" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Como Comprar</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Para comprar um asset na nossa plataforma, siga os passos abaixo:
                </p>
                
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Passo a Passo</h3>
                  <ol className="list-decimal list-inside space-y-3 text-[#666] text-base ml-4">
                    <li>Navegue pela loja e encontre o asset desejado</li>
                    <li>Clique em "Adicionar ao Carrinho"</li>
                    <li>Preencha seus dados no checkout</li>
                    <li>Finalize o pagamento via PIX</li>
                    <li>Aguarde a aprovação do pedido</li>
                    <li>Baixe seus arquivos em Meus Pedidos</li>
                  </ol>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#555]">
                    <strong className="text-white">Nota:</strong> Após a aprovação, os arquivos ficam disponíveis por 7 dias.
                  </p>
                </div>
              </section>

              {/* Pagamento */}
              <section id="payment" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Pagamento via PIX</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Trabalhamos exclusivamente com PIX - o meio de pagamento instantâneo do Banco Central do Brasil.
                </p>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Chave PIX</h3>
                  <code className="text-sm text-white font-mono bg-[#111] p-3 rounded block">pagamentos@marketplace.com</code>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mt-4">
                  <h3 className="text-lg font-bold text-white mb-4">Informações Importantes</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Aprovação em até 30 minutos em dias úteis</li>
                    <li>Pagamento 100% seguro</li>
                    <li>Confirmação automática após aprovação</li>
                  </ul>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#555]">
                    <strong className="text-white">Nota:</strong> Fora do horário comercial, a aprovação pode levar até 12 horas.
                  </p>
                </div>
              </section>

              {/* Downloads */}
              <section id="downloads" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Downloads</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Após a aprovação do pagamento, seus arquivos ficam disponíveis para download.
                </p>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Regras e Prazos</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Arquivos disponíveis por 7 dias após aprovação</li>
                    <li>Acesse Meus Pedidos no dashboard</li>
                    <li>Clique em "Download" para baixar</li>
                  </ul>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#555]">
                    <strong className="text-white">Importante:</strong> Salve seus arquivos imediatamente. Links expiram após 7 dias.
                  </p>
                </div>
              </section>

              {/* Carteira */}
              <section id="wallet" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Carteira & Cashback</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Nossa plataforma oferece um sistema de cashback para todas as compras aprovadas.
                </p>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Como Funciona</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>5% de cashback em cada compra aprovada</li>
                    <li>Crédito automático na sua carteira</li>
                    <li>Saldo pode ser usado em compras futuras</li>
                    <li>Cashback não expira</li>
                  </ul>
                </div>
              </section>

              {/* Reembolsos */}
              <section id="refund" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Política de Reembolso</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Você pode solicitar reembolso dentro do prazo estabelecido.
                </p>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Condições</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Até 7 dias após aprovação do pedido</li>
                    <li>Produto não baixado ou baixado recentemente</li>
                  </ul>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mt-4">
                  <h3 className="text-lg font-bold text-white mb-4">Como Solicitar</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Acesse Meus Pedidos no dashboard e clique em "Solicitar Reembolso".
                  </p>
                </div>
              </section>

              {/* Licenças */}
              <section id="licenses" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Licenças</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Oferecemos diferentes tipos de licença para atender às suas necessidades.
                </p>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Tipos de Licença</h3>
                  <ul className="list-disc list-inside space-y-3 text-[#666] text-base ml-4">
                    <li><strong className="text-white">Licença Padrão</strong> - Uso em 1 projeto pessoal ou comercial</li>
                    <li><strong className="text-white">Licença Extendida</strong> - Uso em múltiplos projetos</li>
                    <li><strong className="text-white">Licença Comercial</strong> - Uso sem restrições</li>
                  </ul>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#555]">
                    <strong className="text-white">Aviso:</strong> É proibido revender ou redistribuir nossos assets sem autorização.
                  </p>
                </div>
              </section>

              {/* Suporte */}
              <section id="support" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Suporte</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Nossa equipe está disponível para ajudar com qualquer dúvida ou problema.
                </p>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Horário de Atendimento</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Segunda a Sexta, 09h às 18h (BRT)
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mt-4">
                  <h3 className="text-lg font-bold text-white mb-4">Canais de Contato</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Discord (resposta mais rápida)</li>
                    <li>E-mail: suporte@marketplace.com</li>
                  </ul>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Perguntas Frequentes</h2>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">Quanto tempo leva para aprovar o pagamento?</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Em dias úteis, a aprovação ocorre em até 30 minutos. Fora do horário comercial, pode levar até 12 horas.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">Posso usar o asset em mais de um projeto?</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Depende da licença adquirida. A licença padrão permite uso em 1 projeto. Para múltiplos projetos, adquira a licença extendida ou comercial.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">O link de download expirou. O que fazer?</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Entre em contato com o suporte informando o número do pedido. Reativamos o link por mais 7 dias.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-2">Posso pagar com cartão ou boleto?</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    No momento aceitamos apenas PIX. Estamos trabalhando para adicionar novos métodos de pagamento em breve.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar fixa na direita */}
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
                
                {/* Separador */}
                <div className="border-t border-[#1A1A1A] my-2"></div>
                
                {/* Link Termos de Uso na sidebar */}
                <button
                  onClick={() => navigate('/terms')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-[#111] transition-all flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Termos de Uso
                </button>
                
                {/* Link Política de Privacidade na sidebar */}
                <button
                  onClick={() => navigate('/privacy')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-[#111] transition-all flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Política de Privacidade
                </button>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}