// src/pages/Terms.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Lock } from 'lucide-react';

export default function Terms() {
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
              <h1 className="text-white font-bold text-lg">Termos de Uso</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Conteúdo principal */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-black text-white mb-4">Termos de Uso</h1>
              <p className="text-[#666] text-sm mb-8">Última atualização: 09 de Abril de 2026</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Ao acessar e usar o DevAssets, você concorda em cumprir estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não use nossa plataforma.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Descrição do Serviço</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                O DevAssets é uma plataforma que conecta compradores a vendedores de assets digitais, incluindo scripts, sistemas completos e UI kits para desenvolvedores.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Conta de Usuário</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Para comprar ou vender na plataforma, você precisa criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Compras e Pagamentos</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Todas as compras são processadas via PIX. Após a confirmação do pagamento, o pedido será aprovado manualmente em até 30 minutos em dias úteis.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Política de Reembolso</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Você pode solicitar reembolso dentro de 7 dias após a aprovação do pedido, desde que o arquivo não tenha sido baixado ou apresente problemas técnicos.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Propriedade Intelectual</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Todos os assets disponíveis na plataforma são propriedade de seus respectivos criadores. A revenda ou redistribuição sem autorização é estritamente proibida.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Limitação de Responsabilidade</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                O DevAssets não se responsabiliza por danos indiretos ou perdas decorrentes do uso dos assets adquiridos na plataforma.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Modificações dos Termos</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Contato</h2>
              <p className="text-[#666] leading-relaxed mb-4">
                Em caso de dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail: suporte@DevAssets.com
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
                  className="w-full text-left px-3 py-2 rounded-lg text-sm bg-white text-black font-medium transition-all flex items-center gap-2"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Termos de Uso
                </button>
                <button
                  onClick={() => navigate('/privacy')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white hover:bg-[#111] transition-all flex items-center gap-2"
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