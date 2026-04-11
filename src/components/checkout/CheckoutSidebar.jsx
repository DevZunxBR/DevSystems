import { motion } from 'framer-motion';

export default function CheckoutSidebar({ total, itemName, txid }) {
  return (
    <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 border-l border-[#111] bg-[#080808]">
      {/* Resumo */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="px-6 py-6 border-b border-[#111]"
      >
        <p className="text-[9px] text-[#282828] font-bold uppercase tracking-[0.2em] mb-4">
          Resumo do pedido
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-[11px] text-[#444]">{itemName}</span>
            <span className="text-[11px] text-[#666] font-semibold tabular-nums">
              R$ {(total || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[11px] text-[#444]">Forma de pagamento</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#00c2ff]" />
              <span className="text-[11px] text-[#666] font-semibold">Pix</span>
            </div>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[11px] text-[#444]">Taxa</span>
            <span className="text-[11px] text-[#4ade80] font-semibold">Grátis</span>
          </div>
        </div>

        <div className="flex justify-between items-baseline pt-4 mt-4 border-t border-[#141414]">
          <span className="text-[12px] text-white font-bold">Total</span>
          <span className="text-[20px] text-white font-black tracking-tight tabular-nums">
            R$ {(total || 0).toFixed(2)}
          </span>
        </div>
      </motion.div>

      {/* Código da transação */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="px-6 py-5 border-b border-[#111]"
      >
        <p className="text-[9px] text-[#282828] font-bold uppercase tracking-[0.2em] mb-3">
          Código da transação
        </p>
        <div className="bg-[#060606] border border-[#161616] rounded-lg px-3.5 py-3">
          <p className="text-[9px] text-[#2e2e2e] font-mono break-all leading-relaxed select-all">
            {txid}
          </p>
        </div>
      </motion.div>

      {/* Detalhes */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="px-6 py-5"
      >
        <p className="text-[9px] text-[#282828] font-bold uppercase tracking-[0.2em] mb-4">
          Detalhes
        </p>
        <div className="space-y-3">
          {[
            { k: 'Favorecido', v: 'Natan Lima' },
            { k: 'Chave PIX', v: 'natanpacheco@gmail.com' },
            { k: 'Instituição', v: 'Banco Central' },
          ].map(({ k, v }) => (
            <div key={k} className="flex justify-between items-baseline">
              <span className="text-[11px] text-[#2e2e2e]">{k}</span>
              <span className="text-[11px] text-[#555] font-medium max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap text-right">
                {v}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer branding */}
      <div className="mt-auto px-6 py-4 border-t border-[#111]">
        <p className="text-[9px] text-[#1a1a1a] text-center">
          Processado por Marketplace · v2.0
        </p>
      </div>
    </aside>
  );
}