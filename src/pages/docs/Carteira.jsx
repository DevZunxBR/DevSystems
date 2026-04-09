// src/pages/docs/Carteira.jsx
import { useNavigate } from 'react-router-dom';
import { Wallet, Package, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Carteira() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1A1A1A]">
        <div className="w-9 h-9 bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl flex items-center justify-center">
          <Wallet className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Carteira & Cashback</h2>
      </div>

      <p className="text-sm text-[#666] leading-relaxed">
        Cada compra aprovada gera um <strong className="text-white">cashback de 5%</strong> na sua carteira.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
          <div className="w-8 h-8 bg-[#111] rounded-lg flex items-center justify-center mb-3">
            <Package className="h-4 w-4 text-white/50" />
          </div>
          <p className="text-sm font-bold text-white mb-1">Compra aprovada</p>
          <p className="text-xs text-[#555]">5% do valor total é creditado automaticamente.</p>
        </div>
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
          <div className="w-8 h-8 bg-[#111] rounded-lg flex items-center justify-center mb-3">
            <Wallet className="h-4 w-4 text-white/50" />
          </div>
          <p className="text-sm font-bold text-white mb-1">Saldo acumulado</p>
          <p className="text-xs text-[#555]">Use seu saldo para abater no próximo pedido.</p>
        </div>
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
          <div className="w-8 h-8 bg-[#111] rounded-lg flex items-center justify-center mb-3">
            <Zap className="h-4 w-4 text-white/50" />
          </div>
          <p className="text-sm font-bold text-white mb-1">Sem expiração</p>
          <p className="text-xs text-[#555]">Seu saldo não expira. Use quando quiser.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => navigate('/dashboard')} className="bg-white text-black hover:bg-white/90 font-bold gap-2">
          Ver Dashboard <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}