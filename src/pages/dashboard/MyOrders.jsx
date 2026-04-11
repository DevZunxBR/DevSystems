// src/pages/dashboard/MyOrders.jsx
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
  const [refundedOrderIds, setRefundedOrderIds] = useState([]);
  const [downloadedOrderIds, setDownloadedOrderIds] = useState([]);

  useEffect(() => {
    loadOrders();
    loadLocalStorageData();
  }, []);

  const loadLocalStorageData = () => {
    // Carregar pedidos com download
    const storedDownloaded = localStorage.getItem('downloaded_orders');
    if (storedDownloaded) {
      try {
        setDownloadedOrderIds(JSON.parse(storedDownloaded));
      } catch {
        setDownloadedOrderIds([]);
      }
    }
    
    // Carregar pedidos com reembolso solicitado
    const storedRefunded = localStorage.getItem('refunded_orders');
    if (storedRefunded) {
      try {
        setRefundedOrderIds(JSON.parse(storedRefunded));
      } catch {
        setRefundedOrderIds([]);
      }
    }
  };

  const loadOrders = async () => {
    try {
      const me = await base44.auth.me();
      const allOrders = await base44.entities.Order.filter({ customer_email: me.email }, '-created_date');
      setOrders(allOrders || []);

      // Buscar reembolsos do banco
      const refunds = await base44.entities.RefundRequest.filter({ user_email: me.email });
      const refundIds = (refunds || []).map((refund) => refund.order_id);
      
      // Mesclar com localStorage
      const storedRefunded = JSON.parse(localStorage.getItem('refunded_orders') || '[]');
      setRefundedOrderIds([...new Set([...refundIds, ...storedRefunded])]);
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

    // Verificar se já solicitou reembolso
    if (refundedOrderIds.includes(order.id)) {
      toast.error('Este pedido possui solicitação de reembolso pendente');
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
    if (refundedOrderIds.includes(order.id)) return false;
    if (downloadedOrderIds.includes(order.id)) return false;

    const orderDate = getOrderDate(order);
    if (!orderDate) return false;

    const createdAt = new Date(orderDate);
    if (Number.isNaN(createdAt.getTime())) return false;

    const hours48 = 48 * 60 * 60 * 1000;
    return Date.now() - createdAt.getTime() < hours48;
  };

  const canDownload = (order) => {
    if (order.status !== 'completed') return false;
    if (refundedOrderIds.includes(order.id)) return false;
    return true;
  };

  const statusConfig = {
    pending: { icon: Clock, label: 'Aguardando Pagamento', className: 'text-[#666]' },
    completed: { icon: CheckCircle, label: 'Concluído', className: 'text-white' },
    cancelled: { icon: XCircle, label: 'Cancelado', className: 'text-red-500' },
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
            const showDownload = canDownload(order);
            const orderDate = getOrderDate(order);
            const hasRefundRequest = refundedOrderIds.includes(order.id);

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
                    {hasRefundRequest && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500">
                        Reembolso solicitado
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

                      {/* Botão de download individual - só aparece se não tiver reembolso */}
                      {order.status === 'completed' && item.file_url && showDownload && (
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
                      
                      {/* Mostrar que reembolso foi solicitado */}
                      {order.status === 'completed' && !showDownload && hasRefundRequest && (
                        <div className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg">
                          Aguardando análise
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Botão "Baixar Todos" - só aparece se não tiver reembolso */}
                {order.status === 'completed' && showDownload && (
                  <div className="px-4 pb-4">
                    <Button 
                      onClick={() => handleDownload(order)} 
                      className="bg-white text-black hover:bg-white/90 gap-2 text-sm w-full sm:w-auto"
                    >
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
            setRefundedOrderIds((prev) => [...new Set([...prev, orderId])]);
            localStorage.setItem('refunded_orders', JSON.stringify([...refundedOrderIds, orderId]));
            setRefundOrder(null);
            toast.info('Botões de download foram desabilitados para este pedido');
          }}
        />
      )}
    </div>
  );
}