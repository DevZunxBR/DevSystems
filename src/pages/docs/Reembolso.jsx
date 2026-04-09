// src/pages/docs/Reembolso.jsx
import { useNavigate } from 'react-router-dom';
import { RefreshCcw, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Reembolso() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1A1A1A]">
        <div className="w-9 h-9 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
          <RefreshCcw className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Política de Reembolso</h2>
      </div>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 space-y-3">
        {[
          ['✅', 'Pedido aprovado há menos de 7 dias', 'Elegível'],
          ['✅', 'Arquivo não baixado', 'Reembolso integral'],
          ['⚠️', 'Arquivo baixado', 'Sujeito à análise'],
          ['❌', 'Pedido com mais de 7 dias', 'Não elegível'],
          ['❌', 'Produto usado em projeto comercial', 'Não elegível'],
        ].map(([icon, cond, status]) => (
          <div key={cond} className="flex items-center gap-3">
            <span className="text-lg">{icon}</span>
            <span className="flex-1 text-sm text-[#555]">{cond}</span>
            <span className="text-xs text-[#444] bg-[#111] px-2 py-0.5 rounded-full">{status}</span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
        <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-[#666] text-sm">Para solicitar, acesse <strong className="text-white">Meus Pedidos</strong> e clique em "Solicitar Reembolso".</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => navigate('/dashboard/orders')} className="bg-white text-black hover:bg-white/90 font-bold gap-2">
          Meus Pedidos <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}