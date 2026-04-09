// src/components/Maintenance.jsx
import { Wrench, Clock, Mail } from 'lucide-react';

export default function Maintenance() {
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
        
        {/* Contato */}
        <div className="pt-4 border-t border-[#1A1A1A]">
          <p className="text-xs text-[#555]">
            Precisa de ajuda? 
            <a href="https://discord.com/invite/M5NVt4xcjn" className="text-white ml-1 hover:underline">
              Entre em Nosso Discord:
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}