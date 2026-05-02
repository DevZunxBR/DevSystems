// src/pages/admin/PaySellers.jsx
import { useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';
import { sendPixTransfer } from '@/services/asaasService';
import { toast } from 'sonner';
import { DollarSign, Send, Loader2 } from 'lucide-react';

export default function PaySellers() {
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadPendingPayouts();
  }, []);

  const loadPendingPayouts = async () => {
    try {
      // Buscar comissões pendentes com dados do criador
      const { data: commissions, error } = await supabase
        .from('commissions')
        .select(`
          *,
          creator_profiles!seller_id (
            id,
            display_name,
            pix_key,
            pix_key_type,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Agrupar por criador
      const sellerMap = new Map();
      commissions?.forEach(c => {
        const seller = c.creator_profiles;
        if (!seller) return;
        
        if (!sellerMap.has(seller.id)) {
          sellerMap.set(seller.id, {
            seller: seller,
            total: 0,
            commissions: []
          });
        }
        sellerMap.get(seller.id).total += c.amount;
        sellerMap.get(seller.id).commissions.push(c);
      });

      setPendingPayouts(Array.from(sellerMap.values()));
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar pagamentos pendentes');
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (payoutData) => {
    const seller = payoutData.seller;
    
    if (!seller.pix_key) {
      toast.error(`${seller.display_name} não possui chave PIX cadastrada`);
      return;
    }

    if (!confirm(`Pagar R$ ${payoutData.total.toFixed(2)} para ${seller.display_name}?`)) return;

    setProcessing(seller.id);
    try {
      // Enviar transferência PIX via Asaas
      const transfer = await sendPixTransfer(
        seller.pix_key,
        seller.pix_key_type || 'EMAIL',
        payoutData.total,
        `Comissão DevAssets - ${payoutData.commissions.length} venda(s)`,
        `seller_${seller.id}_${Date.now()}`
      );

      // Marcar comissões como pagas
      for (const commission of payoutData.commissions) {
        await supabase
          .from('commissions')
          .update({ 
            status: 'paid', 
            paid_at: new Date().toISOString(),
            transfer_id: transfer.id
          })
          .eq('id', commission.id);
      }

      // Registrar payout
      await supabase.from('seller_payouts').insert({
        seller_id: seller.id,
        amount: payoutData.total,
        status: 'completed',
        transfer_id: transfer.id,
        pix_key: seller.pix_key,
        pix_key_type: seller.pix_key_type,
        paid_at: new Date().toISOString()
      });

      toast.success(`R$ ${payoutData.total.toFixed(2)} enviado para ${seller.display_name}!`);
      loadPendingPayouts();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar pagamento');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pagar Criadores</h1>
        <p className="text-sm text-[#555] mt-1">Envie PIX para os criadores via Asaas</p>
      </div>

      {pendingPayouts.length === 0 ? (
        <div className="text-center py-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <DollarSign className="h-12 w-12 text-[#555] mx-auto mb-3" />
          <p className="text-sm text-[#555]">Nenhum pagamento pendente.</p>
          <p className="text-xs text-[#555] mt-1">As comissões aparecerão aqui quando houver vendas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingPayouts.map((payout) => (
            <div key={payout.seller.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{payout.seller.display_name}</h3>
                    {!payout.seller.pix_key && (
                      <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                        Sem PIX
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#555] mt-1">{payout.seller.email}</p>
                  {payout.seller.pix_key && (
                    <p className="text-xs text-[#555] mt-1">
                      Chave PIX: {payout.seller.pix_key} ({payout.seller.pix_key_type || 'EMAIL'})
                    </p>
                  )}
                  <p className="text-xs text-[#555] mt-1">
                    {payout.commissions.length} venda(s) pendente(s)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">R$ {payout.total.toFixed(2)}</div>
                  <button
                    onClick={() => processPayment(payout)}
                    disabled={processing === payout.seller.id || !payout.seller.pix_key}
                    className="mt-2 flex items-center gap-2 px-5 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 disabled:opacity-50 transition-all"
                  >
                    {processing === payout.seller.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {processing === payout.seller.id ? 'Enviando...' : 'Pagar via PIX'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}