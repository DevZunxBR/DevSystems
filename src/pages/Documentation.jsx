// src/pages/docs/DocsLayout.jsx
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ChevronRight, BookOpen } from 'lucide-react';

const DOCS_SECTIONS = [
  { id: 'como-comprar', label: 'Como Comprar' },
  { id: 'pagamento', label: 'Pagamento via PIX' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'carteira', label: 'Carteira & Cashback' },
  { id: 'reembolso', label: 'Política de Reembolso' },
  { id: 'licencas', label: 'Licenças' },
  { id: 'suporte', label: 'Suporte' },
  { id: 'faq', label: 'Perguntas Frequentes' },
];

export default function DocsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const currentTitle = DOCS_SECTIONS.find(s => s.id === currentPath)?.label || 'Documentação';

  return (
    <div className="min-h-screen bg-black">
      {/* Header estilo dashboard */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/docs')} 
              className="p-2 -ml-2 text-[#555] hover:text-white transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <div className="w-8 h-8 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">{currentTitle}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
              <div className="p-3 border-b border-[#1A1A1A]">
                <p className="text-[10px] font-bold text-[#333] uppercase tracking-wider">Navegação</p>
              </div>
              <nav className="p-2 space-y-0.5">
                {DOCS_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => navigate(`/docs/${section.id}`)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                      currentPath === section.id
                        ? 'bg-white text-black font-medium'
                        : 'text-[#555] hover:text-white hover:bg-[#111]'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}