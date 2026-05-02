// src/pages/ApplicationPending.jsx
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApplicationPending() {
  const navigate = useNavigate();
  const discordLink = 'https://discord.gg/YZQqFgwVaq';

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
        
        {/* Contato - Discord */}
        <div className="pt-4 border-t border-[#1A1A1A] space-y-3">
          <p className="text-xs text-[#555]">
            Entre em nosso Discord para acompanhar:
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