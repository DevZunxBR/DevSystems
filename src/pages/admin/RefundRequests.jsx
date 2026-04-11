// src/pages/admin/RefundRequests.jsx
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Clock, CheckCircle, XCircle, Copy } from 'lucide-react';

export default function RefundRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const all = await base44.entities.RefundRequest.filter({ status: 'pending' }, '-created_date');
      const now = Date.now();
      const valid = all.filter(r => new Date(r.expires_at).getTime() > now && !r.downloaded);
      setRequests(valid);
    } catch {}
    finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    try {
      const r = requests.find(req => req.id === id);
      
      // Atualiza status do reembolso
      await base44.entities.RefundRequest.update(id, { status });
      
      if (status === 'approved' && r) {
        // Busca o pedido original
        const orders = await base44.entities.Order.filter({ id: r.order_id });
        const order = orders[0];
        
        if (order) {
          // Atualiza status do pedido para refunded (reembolsado)
          await base44.entities.Order.update(order.id, {
            status: 'refunded',
          });
        }
        
        // Notifica o usuário
        await base44.entities.Notification.create({
          user_email: r.user_email,
          title: 'Reembolso Aprovado',
          message: `Seu reembolso de R$${r.amount_brl?.toFixed(2)} foi aprovado. Transferência via PIX em breve.`,
          type: 'payment',
          read: false,
          link: '/dashboard/orders',
        });
        
        toast.success('Reembolso aprovado! Status do pedido atualizado para "Reembolsado"');
        
      } else if (status === 'denied' && r) {
        await base44.entities.Notification.create({
          user_email: r.user_email,
          title: 'Reembolso Negado',
          message: `Sua solicitação de reembolso de R$${r.amount_brl?.toFixed(2)} foi negada.`,
          type: 'system',
          read: false,
        });
        toast.success('Reembolso negado');
      }
      
      setRequests(requests.filter(req => req.id !== id));
      
    } catch (error) {
      console.error(error);
      toast.error('Falha ao processar solicitação');
    }
  };

  const copyPixKey = (key) => {
    navigator.clipboard.writeText(key);
    toast.success('Chave PIX copiada!');
  };

  const timeLeft = (expiresAt) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expirado';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m restantes`;
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Solicitações de Reembolso</h1>
        <p className="text-sm text-[#555] mt-1">Solicitações pendentes (expiram em 48h ou após download)</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
          <CheckCircle className="h-12 w-12 text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm">Nenhuma solicitação pendente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(r => (
            <div key={r.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border-b border-[#1A1A1A] bg-[#050505]">
                <div>
                  <div className="text-sm font-bold text-white">{r.user_name || r.user_email}</div>
                  <div className="text-xs text-[#555]">{r.user_email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-black text-white">R${r.amount_brl?.toFixed(2)}</div>
                  <div className="flex items-center gap-1 text-xs text-[#555]">
                    <Clock className="h-3 w-3" /> {timeLeft(r.expires_at)}
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <div className="text-xs text-[#555] mb-1">Produtos</div>
                  <div className="text-sm text-white">{r.order_items}</div>
                </div>
                <div>
                  <div className="text-xs text-[#555] mb-1">Motivo</div>
                  <div className="text-sm text-[#999] leading-relaxed">{r.reason}</div>
                </div>
                <div>
                  <div className="text-xs text-[#555] mb-1">Chave PIX para reembolso</div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-white font-mono bg-[#111] px-3 py-2 rounded-lg flex-1">{r.pix_key}</div>
                    <Button size="sm" variant="outline" onClick={() => copyPixKey(r.pix_key)} className="border-[#1A1A1A] text-[#666] hover:bg-[#111] hover:text-white h-9">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 px-4 pb-4">
                <Button onClick={() => handleAction(r.id, 'approved')} className="bg-white text-black hover:bg-white/90 font-semibold gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" /> Aprovar (fazer PIX manual)
                </Button>
                <Button onClick={() => handleAction(r.id, 'denied')} variant="outline" className="border-[#1A1A1A] text-[#666] hover:bg-[#111] hover:text-white text-sm">
                  <XCircle className="h-4 w-4" /> Negar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}