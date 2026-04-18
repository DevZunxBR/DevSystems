import { useState, useEffect } from 'react';
import { supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, Clock, DollarSign, Eye } from 'lucide-react';

export default function ManagePayments() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingOrders();
  }, []);

  const loadPendingOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending_payment_confirmation')
        .order('created_at', { ascending: false });
      
      setPendingOrders(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (order) => {
    if (!confirm(`Confirmar recebimento de R$ ${order.total_amount}?`)) return;

    try {
      // 1. Atualizar pedido
      await supabase
        .from('orders')
        .update({ 
          status: 'payment_confirmed',
          payment_confirmed_at: new Date().toISOString()
        })
        .eq('id', order.id);

      // 2. Criar comissão para o vendedor
      const commission = order.total_amount * 0.7; // 70% para o criador
      
      await supabase.from('commissions').insert({
        seller_email: order.seller_email,
        order_id: order.id,
        amount: commission,
        status: 'pending',
        product_title: order.items?.[0]?.product_title
      });

      toast.success('Pagamento confirmado! Comissão registrada.');
      loadPendingOrders();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao confirmar pagamento');
    }
  };

  if (loading) return <div className="text-center py-10">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Pagamentos Pendentes</h1>
      
      {pendingOrders.length === 0 ? (
        <p className="text-center text-[#555] py-10">Nenhum pagamento pendente</p>
      ) : (
        <div className="space-y-4">
          {pendingOrders.map((order) => (
            <div key={order.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-[#555]">Pedido: {order.id.slice(0, 8)}</p>
                  <p className="text-white font-bold">R$ {order.total_amount?.toFixed(2)}</p>
                  <p className="text-xs text-[#555]">Cliente: {order.customer_email}</p>
                </div>
                <Button onClick={() => confirmPayment(order)} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" /> Confirmar Pagamento
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}