// src/pages/ApplicationPending.jsx
import { useNavigate } from 'react-router-dom';
import { Clock, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApplicationPending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Ícone */}
        <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto">
          <Clock className="h-10 w-10 text-yellow-500" />
        </div>
        
        {/* Título */}
        <h1 className="text-3xl font-black text-white">Inscrição Enviada!</h1>
        
        {/* Descrição */}
        <p className="text-sm text-[#555] leading-relaxed">
          Sua inscrição para se tornar um criador foi enviada com sucesso!
          Nossa equipe irá analisar suas informações e entraremos em contato em breve.
        </p>
        
        {/* Status */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-xs text-yellow-500">
            ⏳ Status: <span className="font-semibold">Aguardando Aprovação</span>
          </p>
        </div>
        
        {/* Informações adicionais */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-4 space-y-2">
          <p className="text-xs text-[#555]">
            📧 Você receberá um e-mail quando sua inscrição for aprovada.
          </p>
          <p className="text-xs text-[#555]">
            💬 Dúvidas? Entre em contato pelo Discord.
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
          <Button 
            variant="outline" 
            onClick={() => navigate('/store')}
            className="w-full border-[#1A1A1A] text-[#999] hover:text-white"
          >
            Explorar Assets
          </Button>
        </div>
      </div>
    </div>
  );
}