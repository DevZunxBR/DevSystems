// src/pages/docs/Suporte.jsx
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Clock, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Suporte() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1A1A1A]">
        <div className="w-9 h-9 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Suporte</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
          <div className="text-2xl mb-2">🟣</div>
          <p className="text-sm font-bold text-white mb-1">Discord</p>
          <p className="text-xs text-[#555]">Resposta mais rápida. Acesse nosso servidor.</p>
        </div>
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
          <div className="text-2xl mb-2">📧</div>
          <p className="text-sm font-bold text-white mb-1">E-mail</p>
          <p className="text-xs text-[#555]">suporte@totalblack.com — Resposta em até 24h.</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
        <Clock className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-[#666] text-sm">Horário de atendimento: <strong className="text-white">Segunda a Sexta, 09h–18h (BRT)</strong>.</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => navigate('/dashboard')} className="bg-white text-black hover:bg-white/90 font-bold gap-2">
          Falar com Suporte <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}