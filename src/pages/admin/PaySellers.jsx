import { useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DollarSign, Send } from 'lucide-react';

export default function PaySellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellersWithCommissions();
  }, []);

  const loadSellersWithCommissions = async () => {
    try {
      // Buscar todos os criadores com comissões pendentes
      const { data: commissions } = await supabase
        .from('commissions')
        .select('*')
        .eq('status', 'pending');

      // Agrupar por seller
      const sellerMap = {};
      commissions?.forEach(c => {
        if (!sellerMap[c.seller_email]) {
          sellerMap[c.seller_email] = {
            email: c.seller_email,
            total: 0,
            commissions: []
          };
        }
        sellerMap[c.seller_email].total += c.amount;
        sellerMap[c.seller_email].commissions.push(c);
      });

      setSellers(Object.values(sellerMap));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const paySeller = async (seller) => {
    if (!confirm(`Pagar R$ ${seller.total.toFixed(2)} para ${seller.email}?`)) return;

    try {
      // Marcar comissões como pagas
      for (const commission of seller.commissions) {
        await supabase
          .from('commissions')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('id', commission.id);
      }

      toast.success(`Pagamento de R$ ${seller.total.toFixed(2)} registrado!`);
      loadSellersWithCommissions();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao processar pagamento');
    }
  };

  if (loading) return <div className="text-center py-10">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Pagar Criadores</h1>
      
      {sellers.length === 0 ? (
        <p className="text-center text-[#555] py-10">Nenhum pagamento pendente</p>
      ) : (
        <div className="space-y-4">
          {sellers.map((seller) => (
            <div key={seller.email} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{seller.email}</p>
                  <p className="text-2xl font-bold text-white">R$ {seller.total.toFixed(2)}</p>
                  <p className="text-xs text-[#555]">{seller.commissions.length} venda(s)</p>
                </div>
                <Button onClick={() => paySeller(seller)} className="bg-white text-black hover:bg-white/90">
                  <Send className="h-4 w-4 mr-2" /> Marcar como Pago
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}