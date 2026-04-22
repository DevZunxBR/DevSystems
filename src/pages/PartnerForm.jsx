import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Send, ChevronRight, ChevronLeft, User, Briefcase, Globe, Cpu, Shield, Sparkles, MessageSquare, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import StepIndicator from '@/components/partner/StepIndicator';
import ProgressBar from '@/components/partner/ProgressBar';
import SidebarPerks from '@/components/partner/SidebarPerks';
import PageIdentity from '@/components/partner/PageIdentity';
import PageLegacy from '@/components/partner/PageLegacy';
import PageNetwork from '@/components/partner/PageNetwork';
import PageStack from '@/components/partner/PageStack';
import PageManifesto from '@/components/partner/PageManifesto';

const PAGES = [
  { id: 'identity', title: 'Identidade', description: 'Estabeleça sua presença criativa', icon: User },
  { id: 'legacy', title: 'Trajetória', description: 'Sua experiência profissional', icon: Briefcase },
  { id: 'network', title: 'Rede', description: 'Pontos de conexão social', icon: Globe },
  { id: 'stack', title: 'Stack', description: 'Capacidades técnicas', icon: Cpu },
  { id: 'manifesto', title: 'Manifesto', description: 'Finalize a parceria', icon: Shield },
];

export default function PartnerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({
    nome: '', email: '', discord_nick: '', telefone: '',
    portfolio_url: '', experiencia: '', motivo: '',
    entrou_discord: false, plano_contribuicao: '',
    redes_sociais: { instagram: '', github: '', linkedin: '' },
    disponibilidade: '', idiomas: [], tipo_asset: [],
    plataformas: [], ja_vendeu: false,
    disponibilidade_reunioes: false, aceita_regras: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleMultiSelect = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const nextPage = () => {
    if (currentPage === 0 && (!form.nome || !form.email || !form.discord_nick)) {
      toast.error('Preencha Nome, Email e Discord para continuar.');
      return;
    }
    setDirection(1);
    setCurrentPage(prev => Math.min(prev + 1, PAGES.length - 1));
  };

  const prevPage = () => {
    setDirection(-1);
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.aceita_regras) {
      toast.error('Você precisa aceitar os termos para continuar.');
      return;
    }

    setLoading(true);
    await base44.entities.CreatorApplication.create({
      ...form,
      status: 'pending'
    });
    toast.success('Inscrição enviada com sucesso! Entraremos em contato em breve.');
    navigate('/');
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  const renderPage = () => {
    switch (currentPage) {
      case 0: return <PageIdentity form={form} handleChange={handleChange} />;
      case 1: return <PageLegacy form={form} handleChange={handleChange} />;
      case 2: return <PageNetwork form={form} setForm={setForm} />;
      case 3: return <PageStack form={form} handleChange={handleChange} handleMultiSelect={handleMultiSelect} />;
      case 4: return <PageManifesto form={form} handleChange={handleChange} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-16 min-h-screen flex flex-col">

        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 lg:mb-16 border-b border-[#1A1A1A] pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-[10px] tracking-[0.25em] text-[#888] uppercase">
              <Sparkles className="w-3 h-3" />
              Portal do Criador
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter">
              DEV<span className="text-[#888]">ASSETS</span>
            </h1>
          </div>
          <StepIndicator pages={PAGES} currentPage={currentPage} />
        </header>

        {/* Mobile progress */}
        <ProgressBar current={currentPage} total={PAGES.length} />

        {/* Main content */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 flex-grow">

          {/* Form Area */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-10"
                >
                  {/* Page header */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl lg:text-3xl font-light tracking-tight">
                        {PAGES[currentPage].title}
                      </h2>
                      <span className="text-[#333] text-2xl lg:text-3xl font-light">/</span>
                    </div>
                    <p className="text-[#888] text-sm">{PAGES[currentPage].description}</p>
                  </div>

                  {/* Dynamic page content */}
                  {renderPage()}

                  {/* Navigation */}
                  <div className="pt-8 lg:pt-12 flex items-center gap-4 border-t border-[#0A0A0A]">
                    {currentPage > 0 && (
                      <button
                        type="button"
                        onClick={prevPage}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#888] hover:text-white transition-colors duration-300 py-3 px-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Voltar
                      </button>
                    )}
                    <div className="flex-1" />
                    {currentPage < PAGES.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextPage}
                        className="px-8 py-4 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#E0E0E0] transition-all duration-300 flex items-center gap-3"
                      >
                        Continuar <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#E0E0E0] disabled:opacity-40 transition-all duration-300 flex items-center gap-3"
                      >
                        {loading ? (
                          <span className="flex items-center gap-3">
                            <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Enviando
                          </span>
                        ) : (
                          <>Enviar Inscrição <Send className="w-4 h-4" /></>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-5 xl:col-span-4 lg:border-l lg:border-[#1A1A1A] lg:pl-10">
            <div className="lg:sticky lg:top-8 space-y-8">
              <SidebarPerks />

              {/* Help card */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-widest text-[#888]">Suporte</h4>
                <button
                  type="button"
                  onClick={() => window.open('https://discord.gg/devassets', '_blank')}
                  className="w-full py-4 px-6 border border-[#1A1A1A] text-[10px] uppercase tracking-widest flex justify-between items-center hover:bg-white hover:text-black transition-all duration-300 text-[#888] hover:border-white"
                >
                  Entrar no Discord <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-4 px-6 border border-[#1A1A1A] text-[10px] uppercase tracking-widest flex justify-between items-center hover:bg-white hover:text-black transition-all duration-300 text-[#888] hover:border-white"
                >
                  Voltar ao Início <Home className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

        </main>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-[#1A1A1A]">
          <p className="text-[10px] text-[#555] tracking-widest uppercase text-center">
            © DevAssets {new Date().getFullYear()} — Programa Oficial de Criadores
          </p>
        </footer>
      </div>
    </div>
  );
}