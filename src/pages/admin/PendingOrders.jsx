import { supabase } from '@/api/base44Client';
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
      const pending = await base44.entities.Order.filter({ status: 'pending' }, '-created_at');
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
            <div style="display: inline-block; background: #32BCAD; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 14px;">DevVault</div>
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
          <p style="color: #444; font-size: 12px; margin-top: 32px;">DevVault • Todos os direitos reservados</p>
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
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Pedidos Pendentes</h1>
        <p className="text-sm text-muted-foreground mt-1">Aprove os pagamentos para liberar os downloads</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhum pedido pendente</p>
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
    </div>
  );
}