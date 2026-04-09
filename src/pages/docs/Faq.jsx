// src/pages/docs/Faq.jsx
import { useState } from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1A1A1A] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#0F0F0F] transition-colors"
      >
        <span className="text-sm font-semibold text-white pr-4">{q}</span>
        <ChevronRight className={`h-4 w-4 text-[#555] flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-[#555] leading-relaxed border-t border-[#1A1A1A] pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function Faq() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1A1A1A]">
        <div className="w-9 h-9 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
          <HelpCircle className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Perguntas Frequentes</h2>
      </div>

      <div className="space-y-2">
        <FaqItem q="Quanto tempo leva para meu pedido ser aprovado?" a="Em dias úteis, a aprovação ocorre em até 30 minutos após o pagamento PIX ser identificado. Fora do horário comercial, pode levar até 12 horas." />
        <FaqItem q="Posso usar o asset em mais de um projeto?" a="Depende da licença adquirida. A licença padrão permite uso em 1 projeto. Para múltiplos projetos, adquira a Licença Extendida ou Comercial." />
        <FaqItem q="O link de download expirou. Posso renovar?" a="Sim, entre em contato com o suporte informando o número do pedido. Reativamos o link por mais 7 dias gratuitamente." />
        <FaqItem q="Como funciona o cashback?" a="5% do valor de cada compra aprovada é creditado automaticamente na sua carteira. Você pode usar esse saldo para abater em compras futuras." />
        <FaqItem q="Posso pagar com cartão de crédito ou boleto?" a="No momento aceitamos apenas PIX. Estamos trabalhando para adicionar novos métodos de pagamento em breve." />
      </div>
    </div>
  );
}