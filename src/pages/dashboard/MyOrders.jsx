import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, Clock, CheckCircle, XCircle, QrCode, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PixModal from '@/components/checkout/PixModal';
import RefundModal from '@/components/orders/RefundModal';

const getOrderDate = (order) => order?.created_date || order?.created_at || null;

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pixModalData, setPixModalData] = useState(null);
  const [refundOrder, setRefundOrder] = useState(null);
  const [pendingRefundIds, setPendingRefundIds] = useState([]);
  const [approvedRefundIds, setApprovedRefundIds] = useState([]);
  const [downloadedOrderIds, setDownloadedOrderIds] = useState([]);

  useEffect(() => {
    loadOrders();
    loadLocalStorage();
  }, []);

  const loadLocalStorage = () => {
    const stored = localStorage.getItem('downloaded_orders');
    if (stored) {
      try {
        setDownloadedOrderIds(JSON.parse(stored));
      } catch {
        setDownloadedOrderIds([]);
      }
    }
  };

  const loadOrders = async () => {
    try {
      const me = await base44.auth.me();
      const allOrders = await base44.entities.Order.filter({ customer_email: me.email }, '-created_date');
      setOrders(allOrders || []);

      // Buscar todos os reembolsos
      const refunds = await base44.entities.RefundRequest.filter({ user_email: me.email });
      const pending = (refunds || []).filter(r => r.status === 'pending').map(r => r.order_id);
      const approved = (refunds || []).filter(r => r.status === 'approved').map(r => r.order_id);
      
      setPendingRefundIds(pending);
      setApprovedRefundIds(approved);
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível carregar seus pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const registerDownloadedOrder = (orderId) => {
    const updated = [...new Set([...downloadedOrderIds, orderId])];
    setDownloadedOrderIds(updated);
    localStorage.setItem('downloaded_orders', JSON.stringify(updated));
  };

  const handleDownload = (order) => {
    if (order.status !== 'completed') {
      toast.error('Pagamento não confirmado');
      return;
    }

    if (pendingRefundIds.includes(order.id)) {
      toast.error('Solicitação de reembolso pendente');
      return;
    }

    if (approvedRefundIds.includes(order.id)) {
      toast.error('Este pedido foi reembolsado');
      return;
    }

    const urls = (order.items || []).map((item) => item.file_url).filter(Boolean);

    if (urls.length === 0) {
      toast.error('Nenhum arquivo disponível para download.');
      return;
    }

    urls.forEach((url) => window.open(url, '_blank'));
    registerDownloadedOrder(order.id);
  };

  const canRefund = (order) => {
    if (order.status !== 'completed') return false;
    if (pendingRefundIds.includes(order.id)) return false;
    if (approvedRefundIds.includes(order.id)) return false;
    if (downloadedOrderIds.includes(order.id)) return false;

    const orderDate = getOrderDate(order);
    if (!orderDate) return false;

    const createdAt = new Date(orderDate);
    if (Number.isNaN(createdAt.getTime())) return false;

    const hours48 = 48 * 60 * 60 * 1000;
    return Date.now() - createdAt.getTime() < hours48;
  };

  const statusConfig = {
    pending: { icon: Clock, label: 'Aguardando Pagamento', className: 'text-[#555]' },
    completed: { icon: CheckCircle, label: 'Concluído', className: 'text-white' },
    cancelled: { icon: XCircle, label: 'Cancelado', className: 'text-[#555]' },
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
        <h1 className="text-2xl font-black text-white tracking-tight">Meus Pedidos</h1>
        <p className="text-sm text-[#555] mt-1">Histórico de compras e downloads</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#555] text-sm">Nenhum pedido ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const refundable = canRefund(order);
            const hasPendingRefund = pendingRefundIds.includes(order.id);
            const hasApprovedRefund = approvedRefundIds.includes(order.id);
            const orderDate = getOrderDate(order);

            return (
              <div key={order.id} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border-b border-[#1A1A1A] bg-[#050505]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusIcon className={`h-4 w-4 ${status.className}`} />
                    <span className={`text-sm font-medium ${status.className}`}>{status.label}</span>
                    <span className="text-xs text-[#333]">•</span>
                    <span className="text-xs text-[#555]">
                      {orderDate
                        ? new Date(orderDate).toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </span>
                    {hasPendingRefund && (
                      <span className="text-xs px-2 py-0.5 rounded-full border border-[#333] text-[#555]">
                        Reembolso solicitado
                      </span>
                    )}
                    {hasApprovedRefund && (
                      <span className="text-xs px-2 py-0.5 rounded-full border border-[#333] text-[#555]">
                        Reembolso aprovado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-sm font-bold text-white">R$ {Number(order.total_amount || 0).toFixed(2)}</div>
                    {order.status === 'pending' && order.pix_code && order.pix_code !== 'WALLET_PAYMENT' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPixModalData({ pixCode: order.pix_code, total: order.total_amount, currency: 'BRL' })}
                        className="border-[#1A1A1A] text-[#666] hover:bg-[#111] hover:text-white gap-1.5 text-xs h-8"
                      >
                        <QrCode className="h-3 w-3" /> Ver QR Code
                      </Button>
                    )}
                    {refundable && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRefundOrder(order)}
                        className="border-[#1A1A1A] text-[#666] hover:bg-[#111] hover:text-white gap-1.5 text-xs h-8"
                      >
                        <RotateCcw className="h-3 w-3" /> Reembolso
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#111] rounded-lg overflow-hidden flex-shrink-0">
                        {item.thumbnail && <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{item.product_title}</div>
                        <div className="text-xs text-[#555]">{item.license_name}</div>
                      </div>

                      {order.status === 'completed' && item.file_url && !hasPendingRefund && !hasApprovedRefund && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.open(item.file_url, '_blank');
                            registerDownloadedOrder(order.id);
                          }}
                          className="border-[#1A1A1A] text-[#666] hover:bg-[#111] hover:text-white gap-1 text-xs h-8"
                        >
                          <Download className="h-3 w-3" /> Download
                        </Button>
                      )}
                      
                      {hasPendingRefund && (
                        <div className="text-xs text-[#555] border border-[#333] px-2 py-1 rounded-lg">
                          Aguardando análise
                        </div>
                      )}
                      
                      {hasApprovedRefund && (
                        <div className="text-xs text-[#555] border border-[#333] px-2 py-1 rounded-lg">
                          Reembolsado
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {order.status === 'completed' && !hasPendingRefund && !hasApprovedRefund && (
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
        <PixModal
          open={!!pixModalData}
          onClose={() => setPixModalData(null)}
          pixCode={pixModalData.pixCode}
          total={pixModalData.total}
          currency={pixModalData.currency}
        />
      )}

      {refundOrder && (
        <RefundModal
          open={!!refundOrder}
          order={refundOrder}
          onClose={() => setRefundOrder(null)}
          onSuccess={(orderId) => {
            setPendingRefundIds((prev) => [...new Set([...prev, orderId])]);
            setRefundOrder(null);
            loadOrders();
          }}
        />
      )}
    </div>
  );
}