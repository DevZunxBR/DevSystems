import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, Wallet } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [payingWithWallet, setPayingWithWallet] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me();
      const [cartItems, wallets] = await Promise.all([
        base44.entities.CartItem.filter({ user_email: me.email }),
        base44.entities.Wallet.filter({ user_email: me.email }),
      ]);
      setItems(cartItems);
      setWallet(wallets[0] || null);
    } catch {}
    finally { setLoading(false); }
  };

  const removeItem = async (itemId) => {
    await base44.entities.CartItem.delete(itemId);
    setItems(items.filter(i => i.id !== itemId));
    toast.success('Item removido');
  };

  const total = items.reduce((sum, item) => sum + (item.price_brl || 0), 0);
  const walletBalance = wallet?.balance_usd || 0;
  const canPayFully = walletBalance >= total;
  const walletDiscount = useWalletBalance ? Math.min(walletBalance, total) : 0;
  const remainingTotal = Math.max(0, total - walletDiscount);

  const handlePayWithWallet = async () => {
    if (!canPayFully) { toast.error('Saldo insuficiente'); return; }
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
      }));

      await base44.entities.Order.create({
        customer_email: me.email,
        customer_name: me.full_name || me.email,
        status: 'completed',
        payment_method: 'pix',
        currency: 'BRL',
        total_amount: total,
        items: orderItems,
        billing_name: me.full_name || me.email,
        billing_email: me.email,
        pix_code: 'WALLET_PAYMENT',
        download_token: `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`,
      });

      const newBalance = walletBalance - total;
      const tx = { type: 'purchase', amount: -total, description: `Compra: ${orderItems.map(i => i.product_title).join(', ')}`, date: new Date().toISOString() };
      await base44.entities.Wallet.update(wallet.id, {
        balance_usd: newBalance,
        transactions: [...(wallet.transactions || []), tx],
      });

      for (const item of items) await base44.entities.CartItem.delete(item.id);

      await base44.entities.Notification.create({
        user_email: me.email,
        title: 'Compra realizada!',
        message: 'Sua compra com saldo foi confirmada. Acesse Meus Pedidos para baixar.',
        type: 'payment',
        read: false,
        link: '/dashboard/orders',
      });

      toast.success('Compra realizada com sucesso!');
      navigate('/dashboard/orders');
    } catch { toast.error('Falha ao processar'); }
    finally { setPayingWithWallet(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Carrinho</h1>

      {items.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <ShoppingCart className="h-12 w-12 text-[#333] mx-auto" />
          <p className="text-[#555] text-sm">Seu carrinho está vazio</p>
          <Button onClick={() => navigate('/store')} className="bg-white text-black hover:bg-white/90 font-semibold">
            Explorar Assets
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
                <div className="w-16 h-16 bg-[#111] rounded-lg overflow-hidden flex-shrink-0">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ShoppingCart className="h-5 w-5 text-[#333]" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{item.product_title}</h3>
                  <p className="text-xs text-[#555]">{item.license_name || 'Licença Padrão'}</p>
                </div>
                <div className="text-sm font-bold text-white flex-shrink-0">R${item.price_brl?.toFixed(2)}</div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-[#444] hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-5 sticky top-24">
              <h3 className="text-lg font-bold text-white">Resumo do Pedido</h3>

              {wallet && walletBalance > 0 && (
                <div className="p-3 bg-[#111] border border-[#1A1A1A] rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Wallet className="h-4 w-4 text-[#666]" />
                    <span>Saldo disponível: <strong>R${walletBalance.toFixed(2)}</strong></span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useWalletBalance}
                      onChange={(e) => setUseWalletBalance(e.target.checked)}
                      className="rounded border-[#333]"
                    />
                    <span className="text-xs text-[#888]">Usar saldo da carteira</span>
                  </label>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#666]">
                  <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span>R${total.toFixed(2)}</span>
                </div>
                {useWalletBalance && walletDiscount > 0 && (
                  <div className="flex justify-between text-white">
                    <span>Saldo aplicado</span>
                    <span>- R${walletDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-white pt-2 border-t border-[#1A1A1A] text-base">
                  <span>Total</span>
                  <span>R${(useWalletBalance ? remainingTotal : total).toFixed(2)}</span>
                </div>
              </div>

              {useWalletBalance && canPayFully ? (
                <Button onClick={handlePayWithWallet} disabled={payingWithWallet} className="w-full bg-white text-black hover:bg-white/90 font-bold gap-2">
                  {payingWithWallet ? 'Processando...' : 'Pagar com Saldo'}
                </Button>
              ) : (
                <Button onClick={() => navigate('/checkout')} className="w-full bg-white text-black hover:bg-white/90 font-bold gap-2">
                  Finalizar Compra <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}