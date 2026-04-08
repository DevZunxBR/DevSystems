// src/pages/Cart.jsx - Com suporte a presentes
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, Wallet, AlertCircle, RefreshCw, Gift } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [payingWithWallet, setPayingWithWallet] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me();
      const [cartItems, wallets] = await Promise.all([
        base44.entities.CartItem.filter({ user_email: me.email }),
        base44.entities.Wallet.filter({ user_email: me.email }),
      ]);
      setItems(cartItems);
      setWallet(wallets[0] || null);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      toast.error('Erro ao carregar carrinho');
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const removeItem = async (itemId) => {
    setRemovingId(itemId);
    try {
      await base44.entities.CartItem.delete(itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
      toast.success('Item removido do carrinho');
    } catch (error) {
      console.error('Erro ao remover:', error);
      toast.error('Erro ao remover item');
    } finally {
      setRemovingId(null);
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price_brl || 0), 0);
  const walletBalance = wallet?.balance_usd || 0;
  const canPayFully = walletBalance >= total;
  const walletDiscount = useWalletBalance ? Math.min(walletBalance, total) : 0;
  const remainingTotal = Math.max(0, total - walletDiscount);
  
  // Verificar se tem presente no carrinho
  const hasGift = items.some(item => item.is_gift === true);

  const handlePayWithWallet = async () => {
    if (!canPayFully) {
      toast.error('Saldo insuficiente para esta compra');
      return;
    }
    
    setPayingWithWallet(true);
    try {
      const me = await base44.auth.me();
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        product_title: item.product_title,
        license_name: item.license_name,
        price: item.price_brl,
        thumbnail: item.thumbnail,
        file_url: item.file_url,
        is_gift: item.is_gift || false,
        gift_recipient_email: item.gift_recipient_email,
        gift_message: item.gift_message,
        gift_sender_name: item.gift_sender_name,
      }));

      await base44.entities.Order.create({
        customer_email: me.email,
        customer_name: me.full_name || me.email,
        status: 'completed',
        payment_method: 'wallet',
        currency: 'BRL',
        total_amount: total,
        items: orderItems,
        billing_name: me.full_name || me.email,
        billing_email: me.email,
        pix_code: 'WALLET_PAYMENT',
        download_token: `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`,
      });

      const newBalance = walletBalance - total;
      const tx = {
        type: 'purchase',
        amount: -total,
        description: `Compra: ${orderItems.map(i => i.product_title).join(', ')}`,
        date: new Date().toISOString()
      };

      await base44.entities.Wallet.update(wallet.id, {
        balance_usd: newBalance,
        transactions: [...(wallet.transactions || []), tx],
      });

      setWallet(prev => ({ ...prev, balance_usd: newBalance, transactions: [...(prev.transactions || []), tx] }));
      
      // Limpa carrinho
      for (const item of items) {
        await base44.entities.CartItem.delete(item.id);
      }
      setItems([]);
      setUseWalletBalance(false);

      await base44.entities.Notification.create({
        user_email: me.email,
        title: 'Compra realizada com sucesso!',
        message: `Você comprou ${orderItems.length} item(ns) usando saldo da carteira. Acesse Meus Pedidos para baixar.`,
        type: 'payment',
        read: false,
        link: '/dashboard/orders',
      });

      toast.success('Compra realizada com sucesso!');
      navigate('/dashboard/orders');
    } catch (error) {
      console.error('Erro no pagamento:', error);
      toast.error('Falha ao processar pagamento. Tente novamente.');
    } finally { 
      setPayingWithWallet(false); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Carrinho
          {items.length > 0 && (
            <span className="text-sm font-normal text-[#555] ml-2">
              ({items.length} {items.length === 1 ? 'item' : 'itens'})
            </span>
          )}
        </h1>
        {items.length > 0 && (
          <button
            onClick={loadCart}
            className="p-2 text-[#555] hover:text-white transition-colors"
            title="Atualizar carrinho"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Aviso de presente */}
      {hasGift && (
        <div className="mb-6 p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl flex items-center gap-3">
          <Gift className="h-5 w-5 text-white" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Presentes no carrinho!</p>
            <p className="text-xs text-[#555]">Após a aprovação do pagamento, os presentes serão enviados automaticamente.</p>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-24 space-y-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl">
          <ShoppingCart className="h-16 w-16 text-[#333] mx-auto" />
          <div>
            <p className="text-[#555] text-base">Seu carrinho está vazio</p>
            <p className="text-[#444] text-sm mt-1">Adicione alguns assets para começar</p>
          </div>
          <Button 
            onClick={() => navigate('/store')} 
            className="bg-white text-black hover:bg-white/90 font-semibold mt-4"
          >
            Explorar Assets
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 hover:border-[#333] transition-all duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-[#111] rounded-lg overflow-hidden flex-shrink-0">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.product_title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-[#333]" />
                    </div>
                  )}
                </div>
                
                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">{item.product_title}</h3>
                    {item.is_gift && (
                      <span className="text-[10px] bg-white/10 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Gift className="h-2.5 w-2.5" /> Presente
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#555] mt-0.5">
                    {item.is_gift ? (
                      <>🎁 Para: <span className="text-white">{item.gift_recipient_email}</span></>
                    ) : (
                      item.license_name || 'Licença Padrão'
                    )}
                  </p>
                  {item.is_gift && item.gift_message && (
                    <p className="text-[10px] text-[#555] mt-1 italic">"{item.gift_message.slice(0, 50)}"</p>
                  )}
                </div>
                
                {/* Preço e Remover */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">R$ {item.price_brl?.toFixed(2)}</div>
                    <div className="text-[10px] text-[#555]">à vista</div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    disabled={removingId === item.id}
                    className="p-2 text-[#444] hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {removingId === item.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div>
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-5 sticky top-24">
              <h3 className="text-lg font-bold text-white">Resumo do Pedido</h3>

              {/* Saldo da Carteira */}
              {wallet && walletBalance > 0 && (
                <div className="p-3 bg-[#111] border border-[#1A1A1A] rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-[#666]" />
                      <span className="text-sm text-white">Saldo disponível</span>
                    </div>
                    <span className="text-sm font-bold text-white">R$ {walletBalance.toFixed(2)}</span>
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-[#1A1A1A]">
                    <input
                      type="checkbox"
                      checked={useWalletBalance}
                      onChange={(e) => setUseWalletBalance(e.target.checked)}
                      className="rounded border-[#333] bg-transparent"
                    />
                    <span className="text-xs text-[#888]">
                      Usar saldo da carteira
                      {!canPayFully && useWalletBalance && (
                        <span className="text-yellow-600 ml-1">
                          (saldo insuficiente, restará R$ {remainingTotal.toFixed(2)})
                        </span>
                      )}
                    </span>
                  </label>
                </div>
              )}

              {/* Totais */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#666]">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                
                {useWalletBalance && walletDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Saldo aplicado</span>
                    <span>- R$ {walletDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-white pt-3 border-t border-[#1A1A1A] text-base">
                  <span>Total</span>
                  <span className="text-xl">R$ {(useWalletBalance ? remainingTotal : total).toFixed(2)}</span>
                </div>

                {/* Aviso de frete */}
                <div className="flex items-start gap-2 p-2 bg-[#111] rounded-lg">
                  <AlertCircle className="h-3 w-3 text-[#555] mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-[#555]">
                    Entrega instantânea via download após confirmação do pagamento
                  </p>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="space-y-2">
                {useWalletBalance && canPayFully ? (
                  <Button 
                    onClick={handlePayWithWallet} 
                    disabled={payingWithWallet} 
                    className="w-full bg-white text-black hover:bg-white/90 font-bold gap-2 h-12"
                  >
                    {payingWithWallet ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4" />
                        Pagar com Saldo
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate('/checkout')} 
                    className="w-full bg-white text-black hover:bg-white/90 font-bold gap-2 h-12"
                  >
                    Finalizar Compra
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/store')}
                  className="w-full border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-12"
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}