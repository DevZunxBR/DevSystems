// src/pages/docs/Licencas.jsx
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function Licencas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1A1A1A]">
        <div className="w-9 h-9 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Licenças</h2>
      </div>

      <div className="space-y-3">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
          <p className="text-sm font-bold text-white mb-1">Licença Padrão</p>
          <p className="text-xs text-[#555]">Uso em 1 projeto pessoal ou comercial. Não pode revender ou redistribuir o asset.</p>
        </div>
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
          <p className="text-sm font-bold text-white mb-1">Licença Extendida</p>
          <p className="text-xs text-[#555]">Uso em múltiplos projetos. Permite monetização indireta.</p>
        </div>
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
          <p className="text-sm font-bold text-white mb-1">Licença Comercial</p>
          <p className="text-xs text-[#555]">Uso sem restrições. Inclui direito de modificação.</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
        <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-[#666] text-sm">É proibido revender ou redistribuir nossos assets sem autorização.</p>
      </div>
    </div>
  );
}