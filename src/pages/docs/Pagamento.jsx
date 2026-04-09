// src/pages/docs/Pagamento.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Copy, CheckCircle2, Clock, AlertCircle, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PIX_KEY = 'pagamentos@totalblack.com';

function InfoBox({ icon: Icon, color, title, children }) {
  const colors = {
    blue: 'bg-blue-500/5 border-blue-500/20 text-blue-400',
    yellow: 'bg-yellow-500/5 border-yellow-500/20 text-yellow-400',
    green: 'bg-green-500/5 border-green-500/20 text-green-400',
    red: 'bg-red-500/5 border-red-500/20 text-red-400',
  };
  return (
    <div className={`flex gap-3 p-4 border rounded-xl ${colors[color]}`}>
      <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <div>
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <p className="text-[#666] text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export default function Pagamento() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1A1A1A]">
        <div className="w-9 h-9 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
          <CreditCard className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Pagamento via PIX</h2>
      </div>

      <p className="text-sm text-[#666] leading-relaxed">
        Trabalhamos exclusivamente com PIX — o meio de pagamento instantâneo do Banco Central do Brasil.
      </p>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
        <p className="text-[10px] font-bold text-[#333] uppercase tracking-[0.3em] mb-3">Nossa chave PIX</p>
        <div className="flex items-center gap-3 bg-[#111] border border-[#1A1A1A] rounded-lg px-4 py-3">
          <div>
            <p className="text-[10px] text-[#444] mb-0.5">E-mail</p>
            <p className="text-sm font-mono font-bold text-white">{PIX_KEY}</p>
          </div>
          <button
            onClick={copyPix}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-white/90 transition-colors"
          >
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
        <p className="text-[10px] font-bold text-[#333] uppercase tracking-[0.3em] mb-3">Como pagar</p>
        <div className="space-y-2 text-sm text-[#555]">
          <p>1. Após finalizar o pedido, um <strong className="text-white">código PIX copia e cola</strong> será gerado.</p>
          <p>2. Abra o app do seu banco e acesse a seção <strong className="text-white">Área PIX → Pagar</strong>.</p>
          <p>3. Cole o código ou escaneie o QR Code e confirme o valor.</p>
        </div>
      </div>

      <InfoBox icon={Clock} color="yellow" title="Prazo de aprovação">
        O pagamento é verificado manualmente. Em dias úteis, a aprovação ocorre em até <strong className="text-white">30 minutos</strong>.
      </InfoBox>

      <InfoBox icon={ShieldCheck} color="green" title="Segurança">
        Nunca solicitamos senha, código de autenticação ou dados bancários completos.
      </InfoBox>

      <div className="flex justify-end">
        <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-bold gap-2">
          Ver Produtos <Zap className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}