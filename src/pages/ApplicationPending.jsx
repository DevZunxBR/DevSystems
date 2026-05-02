// src/pages/ApplicationPending.jsx
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApplicationPending() {
  const navigate = useNavigate();
  const contactEmail = 'devassetsbr@gmail.com';
  
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}&su=Inscrição%20Criador%20DevAssets&body=Olá,%20gostaria%20de%20informações%20sobre%20minha%20inscrição...`;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        
        {/* Título */}
        <h1 className="text-4xl font-black text-white">Inscrição Enviada!</h1>
        
        {/* Descrição */}
        <p className="text-sm text-[#555] leading-relaxed">
          Sua inscrição para se tornar um criador foi recebida com sucesso!
          Nossa equipe está analisando suas informações.
        </p>
        
        {/* Previsão / Status */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#555]">
          <span>Previsão: até 5 dias úteis</span>
        </div>
        
        {/* Contato */}
        <div className="pt-4 border-t border-[#1A1A1A] space-y-3">
          <p className="text-xs text-[#555]">
            Precisa de ajuda? Entre em contato:
          </p>
          
          {/* Botão Gmail */}
          <a
            href={gmailLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-white text-sm hover:border-white transition-all group"
          >
            <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
            Enviar e-mail (Gmail)
          </a>
          
          {/* Email para copiar */}
          <p className="text-[10px] text-[#444] mt-2">
            ou copie o email: <span className="text-white select-all">{contactEmail}</span>
          </p>
        </div>
        
        {/* Botões */}
        <div className="space-y-3 pt-4">
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-white text-black hover:bg-white/90 font-semibold"
          >
            Voltar para a Loja
          </Button>
        </div>
      </div>
    </div>
  );
}