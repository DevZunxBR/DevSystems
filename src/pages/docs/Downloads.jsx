// src/pages/docs/Downloads.jsx
import { useNavigate } from 'react-router-dom';
import { Download, Zap, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Downloads() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1A1A1A]">
        <div className="w-9 h-9 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
          <Download className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Downloads</h2>
      </div>

      <p className="text-sm text-[#666] leading-relaxed">
        Após a aprovação do pagamento, seus arquivos ficam disponíveis para download.
      </p>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Zap className="h-4 w-4 text-white/50 mt-0.5" />
          <p className="text-sm text-[#555]">Acesse <button onClick={() => navigate('/dashboard/orders')} className="text-white underline">Meus Pedidos</button> e clique em "Download".</p>
        </div>
        <div className="flex items-start gap-3">
          <Zap className="h-4 w-4 text-white/50 mt-0.5" />
          <p className="text-sm text-[#555]">Links expiram após <strong className="text-white">7 dias</strong>. Baixe assim que o pedido for aprovado.</p>
        </div>
        <div className="flex items-start gap-3">
          <Zap className="h-4 w-4 text-white/50 mt-0.5" />
          <p className="text-sm text-[#555]">Arquivos em formato <strong className="text-white">.zip ou .rbxm</strong>.</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
        <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-[#666] text-sm">Salve os arquivos imediatamente. Não nos responsabilizamos por perda após o prazo.</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => navigate('/dashboard/orders')} className="bg-white text-black hover:bg-white/90 font-bold gap-2">
          Meus Pedidos <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}