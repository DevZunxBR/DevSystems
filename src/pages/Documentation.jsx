// src/pages/Documentation.jsx - Com link para Termos de Uso
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, FileText } from 'lucide-react';

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

// Componentes dos ícones sociais
function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.078.11 18.1.12 18.113a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

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

  const socialLinks = {
    discord: 'https://discord.gg/M5NVt4xcjn',
    youtube: 'https://youtube.com/@seucanal',
    instagram: 'https://instagram.com/seuperfil'
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
            {/* Botão Termos de Uso no header */}
            <button 
              onClick={() => navigate('/terms')} 
              className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors"
            >
              <FileText className="h-4 w-4" />
              Termos de Uso
            </button>
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

              {/* Resto do conteúdo igual... */}
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
                {/* Link Termos de Uso na sidebar */}
                <button
                  onClick={() => navigate('/terms')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-[#111] transition-all mt-4 pt-4 border-t border-[#1A1A1A]"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Termos de Uso
                  </div>
                </button>
              </nav>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] bg-[#000]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-black text-xs">M</span>
                </div>
                <span className="text-white font-bold tracking-tight">Marketplace</span>
              </div>
              <p className="text-xs text-[#555] leading-relaxed max-w-[200px]">
                Assets e sistemas para desenvolvedores.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href={socialLinks.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-[#555] hover:text-white hover:border-[#333] transition-all hover:scale-105"
                  aria-label="Discord"
                >
                  <DiscordIcon />
                </a>
                <a 
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-[#555] hover:text-white hover:border-[#333] transition-all hover:scale-105"
                  aria-label="YouTube"
                >
                  <YoutubeIcon />
                </a>
                <a 
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-[#555] hover:text-white hover:border-[#333] transition-all hover:scale-105"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Loja</h4>
              <ul className="space-y-2">
                {[['Asset Library', '/store'], ['Scripts', '/store?cat=Scripts'], ['Systems', '/store?cat=Systems'], ['UI Kits', '/store?cat=UI Kits']].map(([l, h]) => (
                  <li key={l}><Link to={h} className="text-xs text-[#555] hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Conta</h4>
              <ul className="space-y-2">
                {[['Dashboard', '/dashboard'], ['Meus Pedidos', '/dashboard/orders'], ['Configurações', '/dashboard/settings']].map(([l, h]) => (
                  <li key={l}><Link to={h} className="text-xs text-[#555] hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Suporte</h4>
              <ul className="space-y-2">
                {[['Documentação', '/docs'], ['Termos de Uso', '/terms'], ['Política de Privacidade', '/privacy'], ['Reembolsos', '/refund']].map(([l, h]) => (
                  <li key={l}><Link to={h} className="text-xs text-[#555] hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#333]">© 2026 Marketplace. Todos os direitos reservados.</p>
            <p className="text-xs text-[#333]">Pagamentos processados via PIX, Entrega Manual.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}