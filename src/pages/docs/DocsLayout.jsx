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

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-[10px] text-[#333] mb-4">
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')}>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/docs')}>Documentação</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#555]">{DOCS_SECTIONS.find(s => s.id === currentPath)?.label || 'Detalhes'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Documentação</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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