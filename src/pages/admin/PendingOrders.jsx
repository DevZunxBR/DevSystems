// src/pages/admin/PendingOrders.jsx
import { supabase } from '@/api/base44Client';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, Clock, Mail, RotateCcw } from 'lucide-react';

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [processingRefundId, setProcessingRefundId] = useState(null);

  useEffect(() => {
    loadOrders();
    loadRefundRequests();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const pending = await base44.entities.Order.filter({ status: 'pending' }, '-created_at');
      setOrders(pending);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadRefundRequests = async () => {
    try {
      const refunds = await base44.entities.RefundRequest.filter({ status: 'pending' }, '-created_at');
      setRefundRequests(refunds);
    } catch (e) {
      console.error(e);
    }
  };

  const approveOrder = async (order) => {
    setApprovingId(order.id);
    try {
      await base44.entities.Order.update(order.id, {
        status: 'completed',
        download_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // Busca carteira do cliente
      const wallets = await base44.entities.Wallet.filter({ user_email: order.customer_email });
      const wallet = wallets[0] || null;

      // Valor de saldo usado no checkout
      const walletUsed = order.wallet_used || 0;
      // Cashback 5% sobre o total pago
      const cashback = order.total_amount * 0.05;

      if (wallet) {
        const transactions = [...(wallet.transactions || [])];

        // Debita o saldo usado
        if (walletUsed > 0) {
          transactions.push({
            type: 'purchase',
            amount: -walletUsed,
            description: `Saldo usado: ${order.items?.map(i => i.product_title).join(', ')}`,
            date: new Date().toISOString(),
          });
        }

        // Adiciona cashback
        transactions.push({
          type: 'cashback',
          amount: cashback,
          description: 'Cashback 5% do pedido',
          date: new Date().toISOString(),
        });

        const newBalance = Math.max(0, (wallet.balance_usd || 0) - walletUsed + cashback);
        await base44.entities.Wallet.update(wallet.id, {
          balance_usd: newBalance,
          transactions,
        });
      } else {
        // Cria carteira com cashback
        await base44.entities.Wallet.create({
          user_email: order.customer_email,
          balance_usd: cashback,
          transactions: [{
            type: 'cashback',
            amount: cashback,
            description: 'Cashback 5% do pedido',
            date: new Date().toISOString(),
          }],
        });
      }

      // Notificação de aprovação
      const productNames = order.items?.map(i => i.product_title).join(', ') || 'Seus produtos';
      await base44.entities.Notification.create({
        user_email: order.customer_email,
        title: 'Pagamento Aprovado',
        message: `Seu pedido de ${productNames} foi aprovado. Você recebeu R$${cashback.toFixed(2)} de cashback! Para Usar Na Proxima Compra.`,
        type: 'payment',
        read: false,
        link: '/dashboard/orders',
      });

      // Notificação de avaliação
      for (const item of (order.items || [])) {
        await base44.entities.Notification.create({
          user_email: order.customer_email,
          title: 'Compra bem Sucedida! Avalie seu produto!',
          message: `Avalie o produto "${item.product_title}": Sua opinião ajuda outros compradores.`,
          type: 'review_request',
          read: false,
          link: `/product/${item.product_id}`,
        });
      }

      // Envia email para o cliente
      try {
        const productNames = order.items?.map(i => i.product_title).join(', ') || 'seus produtos';
        await supabase.functions.invoke('send-email', {
          body: {
            to: order.customer_email,
            subject: 'Seu pedido foi aprovado! — DevSystems',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 12px;">
                <div style="margin-bottom: 32px;">
                  <div style="display: inline-block; background: #32BCAD; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 14px;">DevAssets</div>
                </div>
                <h1 style="font-size: 28px; font-weight: 900; margin-bottom: 8px;">Pagamento Aprovado!</h1>
                <p style="color: #999; margin-bottom: 32px;">Seu pagamento foi confirmado e seus arquivos estão prontos para download.</p>
                <div style="background: #0A0A0A; border: 1px solid #1A1A1A; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <p style="color: #666; font-size: 12px; margin-bottom: 4px;">Produtos adquiridos</p>
                  <p style="font-weight: 600; font-size: 16px;">${productNames}</p>
                  <p style="color: #666; font-size: 13px; margin-top: 8px;">Total: R$${order.total_amount?.toFixed(2)}</p>
                  <p style="color: #32BCAD; font-size: 13px;">Cashback recebido: R$${cashback.toFixed(2)}</p>
                </div>
                <a href="https://dev-systems.vercel.app/dashboard/orders" style="display: inline-block; background: #fff; color: #000; padding: 14px 28px; border-radius: 10px; font-weight: bold; text-decoration: none; font-size: 14px;">Acessar Meus Pedidos →</a>
                <p style="color: #444; font-size: 12px; margin-top: 32px;">DevAssets • Todos os direitos reservados</p>
              </div>
            `,
          },
        });
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
      }

      toast.success(`Pedido aprovado! Saldo debitado e cashback de R$${cashback.toFixed(2)} adicionado.`);
      setOrders(prev => prev.filter(o => o.id !== order.id));
    } catch (e) {
      console.error(e);
      toast.error('Falha ao aprovar pedido');
    } finally {
      setApprovingId(null);
    }
  };

  const approveRefund = async (refund) => {
    setProcessingRefundId(refund.id);
    try {
      // Atualiza status do reembolso
      await base44.entities.RefundRequest.update(refund.id, {
        status: 'approved',
        approved_at: new Date().toISOString(),
      });

      // Busca o pedido original
      const orders = await base44.entities.Order.filter({ id: refund.order_id });
      const order = orders[0];

      if (order) {
        // Atualiza status do pedido para refunded (reembolsado)
        await base44.entities.Order.update(order.id, {
          status: 'refunded',
        });

        // Notifica o usuário que o reembolso foi aprovado
        await base44.entities.Notification.create({
          user_email: refund.user_email,
          title: 'Reembolso Aprovado!',
          message: `Seu reembolso do pedido ${refund.order_items} foi aprovado. O valor de R$ ${refund.amount_brl?.toFixed(2)} será estornado na chave PIX informada em até 5 dias úteis.`,
          type: 'refund',
          read: false,
          link: '/dashboard/orders',
        });
      }

      toast.success(`Reembolso aprovado! O valor será estornado para o cliente.`);
      setRefundRequests(prev => prev.filter(r => r.id !== refund.id));
    } catch (e) {
      console.error(e);
      toast.error('Falha ao aprovar reembolso');
    } finally {
      setProcessingRefundId(null);
    }
  };

  const rejectRefund = async (refund) => {
    setProcessingRefundId(refund.id);
    try {
      // Atualiza status do reembolso
      await base44.entities.RefundRequest.update(refund.id, {
        status: 'rejected',
        approved_at: new Date().toISOString(),
      });

      // Notifica o usuário que o reembolso foi rejeitado
      await base44.entities.Notification.create({
        user_email: refund.user_email,
        title: 'Reembolso Recusado',
        message: `Seu pedido de reembolso para ${refund.order_items} foi recusado. Entre em contato com o suporte para mais informações.`,
        type: 'refund',
        read: false,
        link: '/dashboard/orders',
      });

      toast.success(`Reembolso recusado.`);
      setRefundRequests(prev => prev.filter(r => r.id !== refund.id));
    } catch (e) {
      console.error(e);
      toast.error('Falha ao recusar reembolso');
    } finally {
      setProcessingRefundId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  const hasPendingOrders = orders.length > 0;
  const hasPendingRefunds = refundRequests.length > 0;

  if (!hasPendingOrders && !hasPendingRefunds) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Pedidos Pendentes</h1>
          <p className="text-sm text-muted-foreground mt-1">Aprove os pagamentos e reembolsos</p>
        </div>
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhum pedido ou reembolso pendente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Administração</h1>
        <p className="text-sm text-muted-foreground mt-1">Aprove pagamentos e processe reembolsos</p>
      </div>

      {/* Pedidos Pendentes */}
      {hasPendingOrders && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Pagamentos Pendentes</h2>
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{order.customer_name || order.customer_email}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {order.customer_email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">R${order.total_amount?.toFixed(2)}</div>
                    {order.wallet_used > 0 && (
                      <div className="text-xs text-muted-foreground">Saldo usado: R${order.wallet_used?.toFixed(2)}</div>
                    )}
                  </div>
                  <Button
                    onClick={() => approveOrder(order)}
                    disabled={approvingId === order.id}
                    className="bg-white text-black hover:bg-white/90 font-semibold gap-2 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {approvingId === order.id ? 'Aprovando...' : 'Aprovar'}
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      {item.thumbnail && <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-foreground">{item.product_title}</span>
                    <span className="text-muted-foreground">— {item.license_name}</span>
                    <span className="text-foreground ml-auto">R${item.price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-4 text-xs text-muted-foreground">
                PIX: <span className="font-mono">{order.pix_code?.slice(0, 40)}...</span>
                <br />
                Criado em: {new Date(order.created_at).toLocaleString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reembolsos Pendentes */}
      {hasPendingRefunds && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Solicitações de Reembolso</h2>
          {refundRequests.map((refund) => (
            <div key={refund.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{refund.user_name || refund.user_email}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {refund.user_email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">R${refund.amount_brl?.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Solicitado em: {new Date(refund.created_at).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => approveRefund(refund)}
                      disabled={processingRefundId === refund.id}
                      className="bg-green-600 text-white hover:bg-green-700 font-semibold gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {processingRefundId === refund.id ? 'Processando...' : 'Aprovar'}
                    </Button>
                    <Button
                      onClick={() => rejectRefund(refund)}
                      disabled={processingRefundId === refund.id}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500/10 font-semibold gap-2 text-sm"
                    >
                      Recusar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Produto(s):</p>
                  <p className="text-sm text-foreground">{refund.order_items}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Motivo do reembolso:</p>
                  <p className="text-sm text-foreground">{refund.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Chave PIX para estorno:</p>
                  <p className="text-sm font-mono text-foreground">{refund.pix_key}</p>
                </div>
                <div className="bg-secondary/20 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">
                    Expira em: {new Date(refund.expires_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}