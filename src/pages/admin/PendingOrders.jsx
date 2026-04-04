import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, Clock, Mail } from 'lucide-react';

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const pending = await base44.entities.Order.filter({ status: 'pending' }, '-created_date');
      setOrders(pending);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const approveOrder = async (order) => {
    setApprovingId(order.id);
    try {
      await base44.entities.Order.update(order.id, {
        status: 'completed',
        download_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      const cashbackAmount = order.total_amount * 0.05;
      const wallets = await base44.entities.Wallet.filter({ user_email: order.customer_email });
      if (wallets.length > 0) {
        const w = wallets[0];
        const tx = { type: 'cashback', amount: cashbackAmount, description: `Cashback 5% do pedido`, date: new Date().toISOString() };
        await base44.entities.Wallet.update(w.id, {
          balance_usd: (w.balance_usd || 0) + cashbackAmount,
          transactions: [...(w.transactions || []), tx],
        });
      } else {
        await base44.entities.Wallet.create({
          user_email: order.customer_email,
          balance_usd: cashbackAmount,
          transactions: [{ type: 'cashback', amount: cashbackAmount, description: 'Cashback 5% do pedido', date: new Date().toISOString() }],
        });
      }

      // Send email notification
      const productNames = order.items?.map(i => i.product_title).join(', ') || 'Your products';
      await base44.integrations.Core.SendEmail({
        to: order.customer_email,
        subject: 'Seu pedido foi aprovado! Faça o download dos seus arquivos',
        body: `<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 12px;"><h1 style="font-size: 24px; font-weight: 800;">Pedido Aprovado ✓</h1><p style="color: #999;">Seu pagamento foi confirmado. Acesse o painel para baixar seus arquivos.</p><div style="background: #0A0A0A; border: 1px solid #1A1A1A; border-radius: 8px; padding: 20px; margin: 24px 0;"><p style="font-weight: 600;">Produtos: ${productNames}</p><p style="color: #999; font-size: 14px;">Total: $${order.total_amount?.toFixed(2)}</p></div></div>`,
      });

      await base44.entities.Notification.create({
        user_email: order.customer_email,
        title: 'Pagamento Aprovado!',
        message: `Seu pedido de ${productNames} foi aprovado. Clique para baixar.`,
        type: 'payment',
        read: false,
        link: '/dashboard/orders',
      });

      // Ask for review for each purchased product
      for (const item of (order.items || [])) {
        await base44.entities.Notification.create({
          user_email: order.customer_email,
          title: 'Avalie seu produto!',
          message: `Como você avalia "${item.product_title}"? Sua opinião ajuda outros compradores.`,
          type: 'review_request',
          read: false,
          link: `/product/${item.product_id}`,
        });
      }

      toast.success(`Pedido aprovado e e-mail enviado para ${order.customer_email}`);
      setOrders(orders.filter(o => o.id !== order.id));
    } catch (e) {
      toast.error('Failed to approve order');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Pending Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Approve payments to release downloads</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No pending orders</p>
        </div>
      ) : (
        <div className="space-y-4">
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
                  <span className="text-lg font-bold text-foreground">${order.total_amount?.toFixed(2)}</span>
                  <Button
                    onClick={() => approveOrder(order)}
                    disabled={approvingId === order.id}
                    className="bg-white text-black hover:bg-white/90 font-semibold gap-2 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {approvingId === order.id ? 'Approving...' : 'Approve Payment'}
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
                    <span className="text-foreground ml-auto">${item.price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-4 text-xs text-muted-foreground">
                PIX Code: <span className="font-mono">{order.pix_code?.slice(0, 40)}...</span>
                <br />
                Placed: {new Date(order.created_date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}