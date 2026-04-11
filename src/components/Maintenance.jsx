// src/components/Maintenance.jsx
import { Wrench, Clock, Mail, AlertCircle, RefreshCw, MessageCircle, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Maintenance() {
  const [timeLeft, setTimeLeft] = useState(null);
  const contactEmail = 'devzunxbr@gmail.com';
  
  // Link para abrir diretamente o Gmail Web
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}&su=Site%20em%20Manutenção%20-%20Contato&body=Olá,%20gostaria%20de%20mais%20informações%20sobre%20a%20manutenção...`;

  // Simular tempo estimado (opcional)
  useEffect(() => {
    // Tempo estimado: 2 horas e 30 minutos
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 2);
    targetTime.setMinutes(targetTime.getMinutes() + 30);
    
    const updateTimer = () => {
      const now = new Date();
      const diff = targetTime - now;
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ hours, minutes });
      } else {
        setTimeLeft(null);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Card principal */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
          
          {/* Header com gradiente */}
          <div className="relative h-32 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-purple-500/20">
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-16 h-16 bg-[#0A0A0A] border-2 border-[#1A1A1A] rounded-2xl flex items-center justify-center">
                <Wrench className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Conteúdo */}
          <div className="pt-10 pb-8 px-6 text-center space-y-5">
            {/* Título */}
            <h1 className="text-2xl font-black text-white">Site em Manutenção</h1>
            
            {/* Descrição */}
            <p className="text-sm text-[#555] leading-relaxed">
              Estamos realizando melhorias para oferecer uma experiência ainda melhor. 
              Voltaremos em breve com novidades!
            </p>
            
            {/* Timer estimado */}
            {timeLeft && (
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3">
                <div className="flex items-center justify-center gap-2 text-xs text-[#555] mb-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Previsão de retorno</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{timeLeft.hours}</div>
                    <div className="text-[10px] text-[#555]">horas</div>
                  </div>
                  <span className="text-2xl font-black text-[#555]">:</span>
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{timeLeft.minutes}</div>
                    <div className="text-[10px] text-[#555]">minutos</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Status */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-[11px] text-[#555]">Manutenção em andamento</span>
            </div>
          </div>
        </div>
        
        {/* O que está sendo melhorado */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-white" />
            <h3 className="text-sm font-semibold text-white">O que está sendo melhorado?</h3>
          </div>
          <div className="space-y-2 text-xs text-[#555]">
            <div className="flex items-center gap-2">
              <span className="text-white">•</span>
              <span>Novos recursos e funcionalidades</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">•</span>
              <span>Melhorias de desempenho e segurança</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">•</span>
              <span>Interface mais intuitiva e moderna</span>
            </div>
          </div>
        </div>
        
        {/* Contato */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-white" />
            <h3 className="text-sm font-semibold text-white">Precisa de ajuda?</h3>
          </div>
          
          <p className="text-xs text-[#555]">
            Nossa equipe de suporte está disponível para esclarecer qualquer dúvida.
          </p>
          
          {/* Botões de contato */}
          <div className="space-y-2">
            <a
              href={gmailLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-all group"
            >
              <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Enviar e-mail
            </a>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1A1A1A]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-black text-[#555]">ou</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-3 py-2">
              <Globe className="h-3.5 w-3.5 text-[#555] flex-shrink-0" />
              <p className="text-[10px] text-[#555] break-all">
                Copie o email: <span className="text-white select-all">{contactEmail}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-[10px] text-[#444]">
            <AlertCircle className="h-3 w-3" />
            <span>Não se preocupe, seus dados estão seguros</span>
          </div>
        </div>
      </div>
    </div>
  );
}