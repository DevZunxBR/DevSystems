import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, Clock, CheckCircle, XCircle, QrCode, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PixModal from '@/components/checkout/PixModal';
import RefundModal from '@/components/orders/RefundModal';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pixModalData, setPixModalData] = useState(null);
  const [refundOrder, setRefundOrder] = useState(null);
  const [refundedOrderIds, setRefundedOrderIds] = useState([]);
  const [downloadedOrderIds, setDownloadedOrderIds] = useState([]);

  useEffect(() => {
    loadOrders();
    const stored = localStorage.getItem('downloaded_orders');
    if (stored) setDownloadedOrderIds(JSON.parse(stored));
  }, []);

  const loadOrders = async () => {
    try {
      const me = await base44.auth.me();
      const allOrders = await base44.entities.Order.filter({ customer_email: me.email }, '-created_date');
      setOrders(allOrders);
      const refunds = await base44.entities.RefundRequest.filter({ user_email: me.email });
      setRefundedOrderIds(refunds.map(r => r.order_id));
    } catch {}
    finally { setLoading(false); }
  };

  const handleDownload = (order) => {
    if (order.status !== 'completed') { toast.error('Pagamento não confirmado'); return; }
    order.items?.forEach(item => { if (item.file_url) window.open(item.file_url, '_blank'); });
    const updated = [...new Set([...downloadedOrderIds, order.id])];
    setDownloadedOrderIds(updated);
    localStorage.setItem('downloaded_orders', JSON.stringify(updated));
  };

  const canRefund = (order) => {
    if (order.status !== 'completed') return false;
    if (refundedOrderIds.includes(order.id)) return false;
    if (downloadedOrderIds.includes(order.id)) return false;
    const created = new Date(order.created_date);
    const hours48 = 48 * 60 * 60 * 1000;
    return Date.now() - created.getTime() < hours48;
  };

  const statusConfig = {
    pending: { icon: Clock, label: 'Aguardando Pagamento', className: 'text-[#666]' },
    completed: { icon: CheckCircle, label: 'Concluído', className: 'text-white' },
    cancelled: { icon: XCircle, label: 'Cancelado', className: 'text-red-500' },
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Meus Pedidos</h1>
        <p className="text-sm text-[#555] mt-1">Histórico de compras e downloads</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20"><p className="text-[#555] text-sm">Nenhum pedido ainda.</p></div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const refundable = canRefund(order);
            return (
              <div key={order.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border-b border-[#1A1A1A] bg-[#050505]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusIcon className={`h-4 w-4 ${status.className}`} />
                    <span className={`text-sm font-medium ${status.className}`}>{status.label}</span>
                    <span className="text-xs text-[#333]">•</span>
                    <span className="text-xs text-[#555]">{new Date(order.created_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-sm font-bold text-white">R${order.total_amount?.toFixed(2)}</div>
                    {order.status === 'pending' && order.pix_code && order.pix_code !== 'WALLET_PAYMENT' && (
                      <Button size="sm" variant="outline" onClick={() => setPixModalData({ pixCode: order.pix_code, total: order.total_amount, currency: 'BRL' })}
                        className="border-[#1A1A1A] text-[#666] hover:bg-[#111] hover:text-white gap-1.5 text-xs h-8">
                        <QrCode className="h-3 w-3" /> Ver QR Code
                      </Button>
                    )}
                    {refundable && (
                      <Button size="sm" variant="outline" onClick={() => setRefundOrder(order)}
                        className="border-[#1A1A1A] text-[#666] hover:bg-[#111] hover:text-white gap-1.5 text-xs h-8">
                        <RotateCcw className="h-3 w-3" /> Reembolso
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#111] rounded-lg overflow-hidden flex-shrink-0">
                        {item.thumbnail && <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{item.product_title}</div>
                        <div className="text-xs text-[#555]">{item.license_name}</div>
                      </div>
                      {order.status === 'completed' && item.file_url && (
                        <Button size="sm" variant="outline" onClick={() => { window.open(item.file_url, '_blank'); const u = [...new Set([...downloadedOrderIds, order.id])]; setDownloadedOrderIds(u); localStorage.setItem('downloaded_orders', JSON.stringify(u)); }}
                          className="border-[#1A1A1A] text-[#666] hover:bg-[#111] hover:text-white gap-1 text-xs h-8">
                          <Download className="h-3 w-3" /> Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {order.status === 'completed' && (
                  <div className="px-4 pb-4">
                    <Button onClick={() => handleDownload(order)} className="bg-white text-black hover:bg-white/90 gap-2 text-sm w-full sm:w-auto">
                      <Download className="h-4 w-4" /> Baixar Todos
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {pixModalData && (
        <PixModal open={!!pixModalData} onClose={() => setPixModalData(null)} pixCode={pixModalData.pixCode} total={pixModalData.total} currency={pixModalData.currency} />
      )}

      {refundOrder && (
        <RefundModal
          open={!!refundOrder}
          order={refundOrder}
          onClose={() => setRefundOrder(null)}
          onSuccess={(orderId) => {
            setRefundedOrderIds([...refundedOrderIds, orderId]);
            setRefundOrder(null);
          }}
        />
      )}
    </div>
  );
}