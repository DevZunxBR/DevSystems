// src/pages/Documentation.jsx - Com muito mais conteúdo
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
  { id: 'account', title: 'Minha Conta' },
  { id: 'security', title: 'Segurança' },
  { id: 'products', title: 'Sobre os Produtos' },
  { id: 'updates', title: 'Atualizações' },
  { id: 'support', title: 'Suporte' },
  { id: 'faq', title: 'Perguntas Frequentes' },
  { id: 'terms', title: 'Termos de Uso' },
  { id: 'privacy', title: 'Privacidade' },
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
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/terms')} className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors">
                <FileText className="h-4 w-4" />
                Termos
              </button>
              <button onClick={() => navigate('/privacy')} className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors">
                <Lock className="h-4 w-4" />
                Privacidade
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-6 py-12">
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

          {/* Conteúdo principal */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-invert max-w-none">
              
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-20 mb-12">
                <h1 className="text-3xl font-black text-white mb-4">Documentação</h1>
                <p className="text-[#666] leading-relaxed text-base">
                  Bem-vindo à documentação oficial do Marketplace. Aqui você encontra todas as informações necessárias para utilizar nossa plataforma de forma eficiente e segura.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mt-6">
                  <p className="text-sm text-[#555]">
                    Somos uma plataforma de assets digitais para desenvolvedores, oferecendo scripts, sistemas completos e UI kits prontos para produção imediata.
                  </p>
                </div>
              </section>

              {/* Como Comprar */}
              <section id="buying" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Como Comprar</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Comprar na nossa plataforma é simples e rápido. Siga os passos abaixo para adquirir seus assets favoritos:
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
                    <strong className="text-white">Nota:</strong> Após a aprovação, os arquivos ficam disponíveis por 7 dias para download.
                  </p>
                </div>
              </section>

              {/* Pagamento */}
              <section id="payment" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Pagamento via PIX</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Trabalhamos exclusivamente com PIX - o meio de pagamento instantâneo do Banco Central do Brasil, garantindo segurança e agilidade nas transações.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Chave PIX</h3>
                  <code className="text-sm text-white font-mono bg-[#111] p-3 rounded block">pagamentos@marketplace.com</code>
                  <p className="text-xs text-[#555] mt-2">Esta é nossa chave PIX oficial. Sempre verifique antes de realizar o pagamento.</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mt-4">
                  <h3 className="text-lg font-bold text-white mb-4">Informações Importantes</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Aprovação em até 30 minutos em dias úteis</li>
                    <li>Pagamento 100% seguro e criptografado</li>
                    <li>Confirmação automática após aprovação manual</li>
                    <li>Fora do horário comercial, aprovação em até 12 horas</li>
                  </ul>
                </div>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#555]">
                    <strong className="text-white">Importante:</strong> Nunca compartilhe seus dados bancários ou senhas com terceiros. Nossa equipe nunca solicita essas informações.
                  </p>
                </div>
              </section>

              {/* Downloads */}
              <section id="downloads" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Downloads</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Após a aprovação do pagamento, seus arquivos ficam disponíveis para download em nossa plataforma.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Regras e Prazos</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Arquivos disponíveis por 7 dias após aprovação</li>
                    <li>Acesse Meus Pedidos no dashboard</li>
                    <li>Clique em "Download" para baixar os arquivos</li>
                    <li>Cada arquivo pode ser baixado múltiplas vezes dentro do prazo</li>
                  </ul>
                </div>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#555]">
                    <strong className="text-white">Importante:</strong> Salve seus arquivos imediatamente. Links expiram após 7 dias e não podemos garantir reativação após esse período.
                  </p>
                </div>
              </section>

              {/* Carteira */}
              <section id="wallet" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Carteira & Cashback</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Nossa plataforma oferece um sistema de cashback que beneficia todos os compradores frequentes.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Como Funciona</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>5% de cashback em cada compra aprovada</li>
                    <li>Crédito automático na sua carteira após aprovação</li>
                    <li>Saldo pode ser usado em compras futuras</li>
                    <li>Cashback não expira - use quando quiser</li>
                  </ul>
                </div>
              </section>

              {/* Reembolsos */}
              <section id="refund" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Política de Reembolso</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Você pode solicitar reembolso dentro do prazo estabelecido em nossa política.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Condições para Reembolso</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Até 7 dias após aprovação do pedido</li>
                    <li>Produto não baixado ou baixado recentemente</li>
                    <li>Problemas técnicos comprovados com o asset</li>
                    <li>Produto não corresponde à descrição</li>
                  </ul>
                </div>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mt-4">
                  <h3 className="text-lg font-bold text-white mb-4">Como Solicitar</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Acesse Meus Pedidos no dashboard, encontre o pedido desejado e clique em "Solicitar Reembolso". Nossa equipe analisará o caso em até 3 dias úteis.
                  </p>
                </div>
              </section>

              {/* Licenças */}
              <section id="licenses" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Licenças</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Oferecemos diferentes tipos de licença para atender às suas necessidades específicas.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Tipos de Licença</h3>
                  <ul className="list-disc list-inside space-y-3 text-[#666] text-base ml-4">
                    <li><strong className="text-white">Licença Padrão</strong> - Uso em 1 projeto pessoal ou comercial. Não permite redistribuição.</li>
                    <li><strong className="text-white">Licença Extendida</strong> - Uso em múltiplos projetos. Permite monetização indireta.</li>
                    <li><strong className="text-white">Licença Comercial</strong> - Uso sem restrições. Inclui direito de modificação.</li>
                  </ul>
                </div>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#555]">
                    <strong className="text-white">Aviso:</strong> É proibido revender ou redistribuir nossos assets sem autorização por escrito.
                  </p>
                </div>
              </section>

              {/* Minha Conta */}
              <section id="account" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Minha Conta</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Sua conta no Marketplace é o centro de todas as suas atividades e compras.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Gerenciamento da Conta</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Atualize suas informações pessoais</li>
                    <li>Altere sua senha regularmente</li>
                    <li>Configure métodos de pagamento preferidos</li>
                    <li>Visualize todo seu histórico de compras</li>
                  </ul>
                </div>
              </section>

              {/* Segurança */}
              <section id="security" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Segurança</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  A segurança dos seus dados e transações é nossa prioridade máxima.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Medidas de Segurança</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Criptografia SSL em todas as páginas</li>
                    <li>Autenticação de dois fatores (em breve)</li>
                    <li>Monitoramento 24/7 contra fraudes</li>
                    <li>Proteção de dados conforme LGPD</li>
                  </ul>
                </div>
              </section>

              {/* Sobre os Produtos */}
              <section id="products" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Sobre os Produtos</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Nossos assets são desenvolvidos por especialistas e passam por rigoroso controle de qualidade.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Garantia de Qualidade</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Todos os produtos são testados antes da publicação</li>
                    <li>Código limpo e bem documentado</li>
                    <li>Compatível com as versões mais recentes</li>
                    <li>Suporte incluso para dúvidas técnicas</li>
                  </ul>
                </div>
              </section>

              {/* Atualizações */}
              <section id="updates" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Atualizações</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Produtos adquiridos na plataforma podem receber atualizações gratuitas.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Política de Atualizações</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Atualizações de segurança são gratuitas</li>
                    <li>Novas funcionalidades podem ter custo adicional</li>
                    <li>Versões compatíveis são mantidas por 12 meses</li>
                    <li>Você é notificado sobre novas versões</li>
                  </ul>
                </div>
              </section>

              {/* Suporte */}
              <section id="support" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Suporte</h2>
                <p className="text-[#666] leading-relaxed text-base mb-4">
                  Nossa equipe está disponível para ajudar com qualquer dúvida ou problema técnico.
                </p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Horário de Atendimento</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Segunda a Sexta, 09h às 18h (BRT) - Exceto feriados nacionais.
                  </p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mt-4">
                  <h3 className="text-lg font-bold text-white mb-4">Canais de Contato</h3>
                  <ul className="list-disc list-inside space-y-2 text-[#666] text-base ml-4">
                    <li>Discord (resposta mais rápida - até 2h)</li>
                    <li>E-mail: suporte@marketplace.com (resposta em até 24h)</li>
                    <li>Sistema de tickets no dashboard</li>
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

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">Posso pagar com cartão ou boleto?</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    No momento aceitamos apenas PIX. Estamos trabalhando para adicionar novos métodos de pagamento em breve.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">Como funciona o cashback?</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Cada compra aprovada gera 5% de crédito na sua carteira. Você pode usar esse saldo em compras futuras, sem valor mínimo.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">Preciso criar conta para comprar?</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Sim, é necessário criar uma conta para realizar compras, acompanhar pedidos e fazer downloads.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">Os produtos têm garantia?</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Sim, todos os produtos têm garantia de 30 dias contra defeitos e incompatibilidade.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-2">Posso revender os assets que compro?</h3>
                  <p className="text-[#666] leading-relaxed text-base">
                    Não. A revenda ou redistribuição dos assets é estritamente proibida e viola nossos termos de uso.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}