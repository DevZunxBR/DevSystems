import { Shield } from 'lucide-react';

export default function CheckoutTopbar() {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-[#141414] bg-[#080808]">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
          <span className="text-black font-black text-[10px] tracking-tighter">M</span>
        </div>
        <span className="text-white font-bold text-[13px] tracking-tight">Marketplace</span>
      </div>
      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border border-[#1e1e1e] rounded-full px-3 py-1.5">
        <Shield className="h-2.5 w-2.5 text-[#333]" />
        <span className="text-[10px] text-[#333] font-semibold">SSL · Banco Central</span>
      </div>
    </div>
  );
}