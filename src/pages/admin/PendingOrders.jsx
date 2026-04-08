// src/pages/admin/PendingOrders.jsx - Atualizado com suporte a presentes
import { supabase } from '@/api/base44Client';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, Clock, Mail, Gift } from 'lucide-react';

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

  // Função para criar presentes a partir do pedido
  const createGiftsFromOrder = async (order) => {
    // Verificar se o pedido tem itens que são presentes
    const giftItems = order.items?.filter(item => item.is_gift === true);
    
    if (!giftItems || giftItems.length === 0) return [];

    const createdGifts = [];
    
    for (const giftItem of giftItems) {
      try {
        // Criar registro de presente
        const { data: giftData, error: giftError } = await supabase.from('gifts').insert({
          sender_email: order.customer_email,
          sender_name: order.customer_name || order.customer_email,
          recipient_email: giftItem.gift_recipient_email,
          product_id: giftItem.product_id,
          product_title: giftItem.product_title,
          product_thumbnail: giftItem.thumbnail,
          license_name: giftItem.license_name,
          price_brl: giftItem.price,
          file_url: giftItem.file_url,
          message: giftItem.gift_message || '',
          status: 'pending',
          order_id: order.id,
          created_at: new Date().toISOString(),
        }).select();

        if (giftError) throw giftError;

        createdGifts.push(giftData?.[0] || giftItem);

        // Notificar o destinatário
        await base44.entities.Notification.create({
          user_email: giftItem.gift_recipient_email,
          title: '🎁 Você recebeu um presente!',
          message: `${order.customer_name || order.customer_email} te presenteou com: ${giftItem.product_title}. Aceite no seu dashboard!`,
          type: 'gift',
          read: false,
          link: '/dashboard',
        });

        console.log(`Presente criado para ${giftItem.gift_recipient_email}: ${giftItem.product_title}`);
      } catch (error) {
        console.error('Erro ao criar presente:', error);
      }
    }

    return createdGifts;
  };

  const approveOrder = async (order) => {
    setApprovingId(order.id);
    try {
      // Atualiza status do pedido
      await base44.entities.Order.update(order.id, {
        status: 'completed',
        download_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // Criar presentes se houver
      const createdGifts = await createGiftsFromOrder(order);

      // Busca carteira do cliente
      const wallets = await base44.entities.Wallet.filter({ user_email: order.customer_email });
      const wallet = wallets[0] || null;

      // Valor de saldo usado no checkout
      const walletUsed = order.wallet_used || 0;
      // Cashback 5% sobre o total pago (apenas para itens não presentes)
      const nonGiftItems = order.items?.filter(item => !item.is_gift) || [];
      const nonGiftTotal = nonGiftItems.reduce((sum, item) => sum + (item.price || 0), 0);
      const cashback = nonGiftTotal * 0.05;

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

        // Adiciona cashback (apenas para compras próprias)
        if (cashback > 0) {
          transactions.push({
            type: 'cashback',
            amount: cashback,
            description: 'Cashback 5% do pedido',
            date: new Date().toISOString(),
          });
        }

        const newBalance = Math.max(0, (wallet.balance_usd || 0) - walletUsed + cashback);
        await base44.entities.Wallet.update(wallet.id, {
          balance_usd: newBalance,
          transactions,
        });
      } else if (cashback > 0) {
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

      // Notificação de aprovação (apenas para itens não presentes ou se não tiver presentes)
      const hasGifts = createdGifts.length > 0;
      const productNames = order.items?.map(i => i.product_title).join(', ') || 'Seus produtos';
      
      if (!hasGifts || nonGiftItems.length > 0) {
        await base44.entities.Notification.create({
          user_email: order.customer_email,
          title: 'Pagamento Aprovado',
          message: `Seu pedido de ${productNames} foi aprovado.${cashback > 0 ? ` Você recebeu R$${cashback.toFixed(2)} de cashback!` : ''}`,
          type: 'payment',
          read: false,
          link: '/dashboard/orders',
        });
      }

      // Notificação de avaliação (apenas para itens não presentes)
      for (const item of nonGiftItems) {
        await base44.entities.Notification.create({
          user_email: order.customer_email,
          title: 'Avalie seu produto!',
          message: `Como você avalia "${item.product_title}"? Sua opinião ajuda outros compradores.`,
          type: 'review_request',
          read: false,
          link: `/product/${item.product_id}`,
        });
      }

      // Envia email para o cliente
      try {
        const emailProductNames = nonGiftItems.map(i => i.product_title).join(', ') || (hasGifts ? 'Presentes enviados' : 'seus produtos');
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
                <p style="color: #999; margin-bottom: 32px;">Seu pagamento foi confirmado e ${hasGifts ? 'seus presentes foram enviados' : 'seus arquivos estão prontos para download'}.</p>
                <div style="background: #0A0A0A; border: 1px solid #1A1A1A; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <p style="color: #666; font-size: 12px; margin-bottom: 4px;">Produtos adquiridos</p>
                  <p style="font-weight: 600; font-size: 16px;">${emailProductNames}</p>
                  <p style="color: #666; font-size: 13px; margin-top: 8px;">Total: R$${order.total_amount?.toFixed(2)}</p>
                  ${cashback > 0 ? `<p style="color: #32BCAD; font-size: 13px;">Cashback recebido: R$${cashback.toFixed(2)}</p>` : ''}
                </div>
                ${hasGifts ? `
                  <div style="background: #1A0A1A; border: 1px solid #FF69B4; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                    <p style="color: #FF69B4; font-size: 14px; margin-bottom: 8px;">🎁 Presentes enviados!</p>
                    <p style="color: #999; font-size: 13px;">Os destinatários receberão uma notificação para aceitar o presente.</p>
                  </div>
                ` : ''}
                <a href="https://dev-systems.vercel.app/dashboard/orders" style="display: inline-block; background: #fff; color: #000; padding: 14px 28px; border-radius: 10px; font-weight: bold; text-decoration: none; font-size: 14px;">Acessar Meus Pedidos →</a>
                <p style="color: #444; font-size: 12px; margin-top: 32px;">DevVault • Todos os direitos reservados</p>
              </div>
            `,
          },
        });
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
      }

      const giftMessage = createdGifts.length > 0 ? ` ${createdGifts.length} presente(s) enviado(s)!` : '';
      toast.success(`Pedido aprovado!${cashback > 0 ? ` Cashback de R$${cashback.toFixed(2)} adicionado.` : ''}${giftMessage}`);
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
        <p className="text-sm text-muted-foreground mt-1">Aprove os pagamentos para liberar os downloads e presentes</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhum pedido pendente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const hasGift = order.items?.some(item => item.is_gift === true);
            return (
              <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border bg-secondary/30">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{order.customer_name || order.customer_email}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {order.customer_email}
                    </span>
                    {hasGift && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-pink-400 flex items-center gap-1">
                          <Gift className="h-3 w-3" /> Contém presente(s)
                        </span>
                      </>
                    )}
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
                      <div className="flex-1">
                        <span className="text-foreground">{item.product_title}</span>
                        <span className="text-muted-foreground ml-2">— {item.license_name}</span>
                        {item.is_gift && (
                          <span className="text-pink-400 text-xs ml-2">
                            🎁 Presente para {item.gift_recipient_email}
                          </span>
                        )}
                      </div>
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
            );
          })}
        </div>
      )}
    </div>
  );
}