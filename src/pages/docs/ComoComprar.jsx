// src/pages/docs/ComoComprar.jsx
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Step({ n, title, children }) {
  return (
    <div className="flex gap-4">
      <div className="w-7 h-7 bg-white text-black text-xs font-black rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">{n}</div>
      <div>
        <p className="font-semibold text-white text-sm mb-1">{title}</p>
        <p className="text-[#555] text-sm">{children}</p>
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, color, children }) {
  const colors = {
    blue: 'bg-blue-500/5 border-blue-500/20 text-blue-400',
    yellow: 'bg-yellow-500/5 border-yellow-500/20 text-yellow-400',
    green: 'bg-green-500/5 border-green-500/20 text-green-400',
  };
  return (
    <div className={`flex gap-3 p-4 border rounded-xl ${colors[color]}`}>
      <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p className="text-[#666] text-sm leading-relaxed">{children}</p>
    </div>
  );
}

export default function ComoComprar() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1A1A1A]">
        <div className="w-9 h-9 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
          <ShoppingCart className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Como Comprar</h2>
      </div>

      <p className="text-sm text-[#666] leading-relaxed">
        Comprar na nossa plataforma é simples e rápido. Siga os passos abaixo:
      </p>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-5">
        <Step n="1" title="Escolha seu asset">
          Navegue pela <button onClick={() => navigate('/store')} className="text-white underline">loja</button> e encontre o script, sistema ou UI Kit que deseja.
        </Step>
        <Step n="2" title="Adicione ao carrinho">
          Selecione a licença desejada e clique em "Adicionar ao Carrinho" ou "Comprar Agora".
        </Step>
        <Step n="3" title="Preencha seus dados">
          No checkout, informe seu nome, e-mail e CPF/CNPJ (opcional).
        </Step>
        <Step n="4" title="Realize o pagamento via PIX">
          Copie o código PIX gerado e pague pelo app do seu banco.
        </Step>
        <Step n="5" title="Aguarde a aprovação">
          Nossa equipe verifica o pagamento e aprova o pedido manualmente.
        </Step>
        <Step n="6" title="Faça o download">
          Após aprovação, baixe os arquivos em <button onClick={() => navigate('/dashboard/orders')} className="text-white underline">Meus Pedidos</button>.
        </Step>
      </div>

      <InfoBox icon={Clock} color="blue">
        O prazo de aprovação é de até <strong className="text-white">30 minutos</strong> em horário comercial.
      </InfoBox>

      <div className="flex justify-end">
        <Button 
          onClick={() => navigate('/store')} 
          className="bg-white text-black hover:bg-white/90 font-bold gap-2"
        >
          Ir para a Loja <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}