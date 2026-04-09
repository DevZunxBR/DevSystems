// src/pages/Documentation.jsx - Versão completa com footer e mini cards
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/base44Client';
import {
  BookOpen, ShoppingCart, CreditCard, Download,
  Wallet, RefreshCcw, ShieldCheck, MessageCircle, HelpCircle,
  Copy, CheckCircle, Clock, XCircle, User
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
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && DOCS_SECTIONS.find(s => s.id === hash)) {
      setActiveSection(hash);
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('email', user.email)
        .single();
      setUser({ email: user.email, name: profile?.full_name || user.email });
    }
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState({}, '', `#${id}`);
  };

  const copyPix = () => {
    navigator.clipboard.writeText('pagamentos@marketplace.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header com logo e avatar */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">M</span>
              </div>
              <span className="text-white font-bold tracking-tight">Marketplace</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="text-sm text-[#555] hover:text-white transition-colors">
                Dashboard
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#111] border border-[#1A1A1A] rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-[#555]" />
                </div>
                <span className="text-xs text-[#555] hidden sm:block">
                  {user?.name?.split(' ')[0] || 'Conta'}
                </span>
              </div>
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

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-invert max-w-none">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-20 mb-12">
                <h1 className="text-3xl font-black text-white mb-4">Documentação</h1>
                <p className="text-[#666] leading-relaxed">
                  Bem-vindo à documentação oficial do Marketplace. Aqui você encontra todas as informações necessárias para utilizar nossa plataforma.
                </p>
              </section>

              {/* Como Comprar */}
              <section id="buying" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Como Comprar</h2>
                <ol className="list-decimal list-inside space-y-2 text-[#666]">
                  <li>Navegue pela loja e encontre o asset desejado</li>
                  <li>Clique em "Adicionar ao Carrinho"</li>
                  <li>Preencha seus dados no checkout</li>
                  <li>Finalize o pagamento via PIX</li>
                  <li>Aguarde a aprovação do pedido</li>
                  <li>Baixe seus arquivos em Meus Pedidos</li>
                </ol>
              </section>

              {/* Pagamento com mini card do PIX */}
              <section id="payment" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Pagamento via PIX</h2>
                <p className="text-[#666] leading-relaxed mb-4">
                  Trabalhamos exclusivamente com PIX - o meio de pagamento instantâneo do Banco Central.
                </p>
                
                {/* Mini Card PIX */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 mb-4 max-w-md">
                  <p className="text-xs text-[#555] mb-2">Nossa chave PIX (e-mail)</p>
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-white">pagamentos@marketplace.com</code>
                    <button 
                      onClick={copyPix}
                      className="flex items-center gap-1 text-xs text-[#555] hover:text-white transition-colors"
                    >
                      {copied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-[#555] mb-2">
                  <Clock className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Aprovação em até <strong className="text-white">30 minutos</strong> em dias úteis</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-[#555]">
                  <ShieldCheck className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Pagamento 100% seguro</span>
                </div>
              </section>

              {/* Downloads */}
              <section id="downloads" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Downloads</h2>
                <p className="text-[#666] leading-relaxed">
                  Após a aprovação do pagamento, seus arquivos ficam disponíveis por <strong className="text-white">7 dias</strong> em Meus Pedidos.
                </p>
              </section>

              {/* Carteira com mini cards */}
              <section id="wallet" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Carteira & Cashback</h2>
                <p className="text-[#666] leading-relaxed mb-4">
                  Toda compra aprovada gera <strong className="text-white">5% de cashback</strong> na sua carteira.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-sm font-semibold text-white mb-1">💰 Como ganhar</p>
                    <p className="text-xs text-[#555]">5% do valor de cada compra aprovada</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-sm font-semibold text-white mb-1">🛒 Como usar</p>
                    <p className="text-xs text-[#555]">Use o saldo em compras futuras</p>
                  </div>
                </div>
              </section>

              {/* Reembolsos com mini card */}
              <section id="refund" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Política de Reembolso</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Até 7 dias após aprovação - Elegível</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#555]">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Após 7 dias - Não elegível</span>
                  </div>
                </div>
                <p className="text-[#666] leading-relaxed">
                  Solicite pelo dashboard em Meus Pedidos.
                </p>
              </section>

              {/* Licenças com mini cards */}
              <section id="licenses" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Licenças</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-sm font-bold text-white mb-1">Padrão</p>
                    <p className="text-xs text-[#555]">1 projeto</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-sm font-bold text-white mb-1">Extendida</p>
                    <p className="text-xs text-[#555]">Múltiplos projetos</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                    <p className="text-sm font-bold text-white mb-1">Comercial</p>
                    <p className="text-xs text-[#555]">Sem restrições</p>
                  </div>
                </div>
              </section>

              {/* Suporte */}
              <section id="support" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Suporte</h2>
                <p className="text-[#666] leading-relaxed mb-2">
                  <strong className="text-white">Horário:</strong> Segunda a Sexta, 09h às 18h (BRT)
                </p>
                <p className="text-[#666] leading-relaxed">
                  <strong className="text-white">Contato:</strong> Discord ou suporte@marketplace.com
                </p>
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-20 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Perguntas Frequentes</h2>
                
                <h3 className="text-lg font-bold text-white mt-6 mb-2">Quanto tempo leva para aprovar o pagamento?</h3>
                <p className="text-[#666] leading-relaxed mb-4">
                  Em dias úteis, a aprovação ocorre em até 30 minutos. Fora do horário comercial, até 12 horas.
                </p>
                
                <h3 className="text-lg font-bold text-white mt-6 mb-2">Posso usar o asset em mais de um projeto?</h3>
                <p className="text-[#666] leading-relaxed mb-4">
                  Depende da licença adquirida. A licença padrão permite uso em 1 projeto.
                </p>
                
                <h3 className="text-lg font-bold text-white mt-6 mb-2">O link de download expirou?</h3>
                <p className="text-[#666] leading-relaxed mb-4">
                  Contate o suporte com o número do pedido para reativar por mais 7 dias.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] bg-[#0A0A0A] mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-[10px]">M</span>
              </div>
              <span className="text-xs text-[#555]">© 2026 Marketplace</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="text-xs text-[#555] hover:text-white transition-colors">
                Dashboard
              </button>
              <button onClick={() => navigate('/register')} className="text-xs text-[#555] hover:text-white transition-colors">
                Conta
              </button>
            </div>
            <p className="text-xs text-[#333]">Pagamentos via PIX</p>
          </div>
        </div>
      </footer>
    </div>
  );
}