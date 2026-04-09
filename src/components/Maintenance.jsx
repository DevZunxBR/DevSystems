// src/components/Maintenance.jsx
import { Wrench, Clock, Mail } from 'lucide-react';

export default function Maintenance() {
  // Email de contato
  const contactEmail = 'devzunxbr@gmail.com';
  
  // Link que abre o Gmail (ou cliente de email padrão)
  const mailtoLink = `mailto:${contactEmail}?subject=Site%20em%20Manutenção%20-%20Contato&body=Olá,%20estou%20com%20um%20problema...`;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        {/* Ícone */}
        <div className="w-20 h-20 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl flex items-center justify-center mx-auto">
          <Wrench className="h-10 w-10 text-white" />
        </div>
        
        {/* Título */}
        <h1 className="text-3xl font-black text-white">Site em Manutenção</h1>
        
        {/* Descrição */}
        <p className="text-sm text-[#555] leading-relaxed">
          Estamos realizando melhorias para oferecer uma experiência ainda melhor.
          Voltaremos em breve!
        </p>
        
        {/* Previsão */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#555]">
          <Clock className="h-3.5 w-3.5" />
          <span>Previsão: algumas horas</span>
        </div>
        
        {/* Contato - Abre Gmail diretamente */}
        <div className="pt-4 border-t border-[#1A1A1A]">
          <p className="text-xs text-[#555] mb-2">
            Precisa de ajuda? 
          </p>
          <a
            href={mailtoLink}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-white text-sm hover:border-white transition-all group"
          >
            <Mail className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
            Enviar e-mail para o suporte
          </a>
          <p className="text-[10px] text-[#444] mt-2">
            ou copie o email: <span className="text-white">{contactEmail}</span>
          </p>
        </div>
      </div>
    </div>
  );
}