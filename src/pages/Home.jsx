// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/api/base44Client';

// Importe suas imagens aqui
import heroBg1 from '@/assets/images/DevHero.jpg';
import heroBg2 from '@/assets/images/DevHero2.jpg';
import heroBg3 from '@/assets/images/DevHero3.jpg';
import heroBg4 from '@/assets/images/DevHero4.jpg';

export default function Home() {
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Slideshow state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Lista de imagens de fundo
  const backgroundImages = [heroBg1, heroBg2, heroBg3, heroBg4];

  // Verificar se usuário já enviou aplicação
  useEffect(() => {
    checkApplicationStatus();
  }, []);

  const checkApplicationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoggedIn(false);
        setApplicationStatus(null);
        setChecking(false);
        return;
      }

      setIsLoggedIn(true);

      // Verificar se já existe uma aplicação para este email
      const { data, error } = await supabase
        .from('creator_applications')
        .select('status')
        .eq('email', user.email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar status:', error);
      }

      if (data) {
        console.log('Status da aplicação:', data.status); // Para debug
        setApplicationStatus(data.status);
      } else {
        setApplicationStatus(null);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setChecking(false);
    }
  };

  // Trocar imagem a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleCreatorClick = () => {
    console.log('Status atual:', applicationStatus); // Para debug
    
    // Se estiver logado e a aplicação estiver pendente
    if (isLoggedIn && applicationStatus === 'pending') {
      navigate('/application-pending');
    } else {
      navigate('/become-creator');
    }
  };

  // Se ainda está verificando, mostra loading (opcional)
  // if (checking) {
  //   return <div className="min-h-screen bg-black" />;
  // }

  return (
    <div className="font-inter">
      {/* Hero Section com Slideshow */}
      <section className="relative overflow-hidden min-h-[500px] flex items-center">
        {/* Imagem de fundo com fade */}
        <div className="absolute inset-0">
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img}
                alt="Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/70" />
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#1A1A1A] rounded-full px-4 py-1.5 text-xs text-[#999]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Plataforma #1 em assets para desenvolvedores, Em Multi Linguagens e Plataformas
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Assets &amp; Sistemas
            <br />
            <span className="text-[#555]">Para Desenvolvedores</span>
          </h1>
          
          <p className="text-sm md:text-base text-[#999] max-w-2xl mx-auto leading-relaxed">
            Sistemas completos, leves e otimizados, desenvolvidos por profissionais Full Stack.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold h-11 px-6 text-sm gap-2 rounded-xl">
              Explorar Assets <ArrowRight className="h-4 w-4" />
            </Button>
            
            {!checking && isLoggedIn && applicationStatus === 'pending' ? (
              <Button 
                variant="outline" 
                onClick={() => navigate('/application-pending')}
                className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-11 px-6 text-sm rounded-xl"
              >
                <Clock className="h-4 w-4" />
                Crie uma Loja
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleCreatorClick}
                className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-11 px-6 text-sm rounded-xl"
              >
                Crie uma Loja
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-4 mt-4">
            {[{ v: '500+', l: 'Assets Digitais' }, { v: '2K+', l: 'Clientes' }, { v: '4.9★', l: 'Avaliação Média' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-xl md:text-2xl font-black text-white">{s.v}</div>
                <div className="text-[10px] text-[#555] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}