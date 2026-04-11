// src/pages/Privacy.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Lock } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
              <h1 className="text-white font-bold text-lg">Política de Privacidade</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Conteúdo principal */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-black text-white mb-4">Política de Privacidade</h1>
              <p className="text-[#666] text-sm mb-8">Última atualização: 09 de Abril de 2026</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Informações Coletadas</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Coletamos informações que você nos fornece diretamente, como nome, e-mail, e informações de pagamento ao criar uma conta ou realizar uma compra.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Uso das Informações</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Utilizamos suas informações para processar pedidos, fornecer suporte, melhorar nossos serviços e enviar comunicados importantes sobre a plataforma.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Compartilhamento de Dados</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Não vendemos ou alugamos seus dados pessoais. Podemos compartilhar informações apenas com parceiros essenciais para o funcionamento da plataforma (como processadores de pagamento).
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Segurança dos Dados</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado, alteração ou divulgação.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Cookies</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Utilizamos cookies para melhorar sua experiência de navegação, lembrar preferências e analisar o tráfego do site.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Direitos do Usuário</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Você tem direito a acessar, corrigir ou solicitar a exclusão de seus dados pessoais a qualquer momento através do dashboard ou entrando em contato com nosso suporte.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Retenção de Dados</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para cumprir obrigações legais.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Menores de Idade</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Nossos serviços não são destinados a menores de 13 anos. Não coletamos intencionalmente informações de crianças.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Alterações nesta Política</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas através do site ou por e-mail.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Contato</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Para questões sobre privacidade, entre em contato: privacidade@DevAssets.com
              </p>

              <div className="border-t border-[#1A1A1A] pt-6 mt-8">
                <p className="text-xs text-[#444]">© 2026 DevAssets. Todos os direitos reservados.</p>
              </div>
            </div>
          </div>

          {/* Sidebar fixa na direita */}
          <aside className="hidden lg:block w-48 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-bold text-[#444] uppercase tracking-wider mb-4">Legal</p>
              <nav className="space-y-1">
                <button
                  onClick={() => navigate('/terms')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-[#111] transition-all flex items-center gap-2"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Termos de Uso
                </button>
                <button
                  onClick={() => navigate('/privacy')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm bg-white text-black font-medium transition-all flex items-center gap-2"
                >
                  <Lock className="h-3.5 w-3.5" />
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