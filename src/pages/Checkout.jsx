// src/pages/Checkout.jsx - Com opção de presente estilo Steam
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44, supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tag, X, Wallet, Gift, User, Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import PixModal from '@/components/checkout/PixModal';

export default function Checkout() {
  const [finalTotal, setFinalTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPix, setShowPix] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [billing, setBilling] = useState({ name: '', email: '', document: '' });
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [giftOptions, setGiftOptions] = useState({}); // { itemId: { isGift, email, message, open } }
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
      if (cartItems.length === 0) { navigate('/cart'); return; }
      setItems(cartItems);
      setWallet(wallets[0] || null);
      setBilling(prev => ({ ...prev, name: me.full_name || '', email: me.email || '' }));
      
      // Inicializar giftOptions
      const initialGifts = {};
      cartItems.forEach(item => {
        initialGifts[item.id] = { isGift: false, email: '', message: '', open: false };
      });
      setGiftOptions(initialGifts);
    } catch {
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const toggleGiftOption = (itemId) => {
    setGiftOptions(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], open: !prev[itemId].open }
    }));
  };

  const setAsGift = (itemId, isGift) => {
    setGiftOptions(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], isGift, email: '', message: '', open: isGift }
    }));
  };

  const updateGiftEmail = (itemId, email) => {
    setGiftOptions(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], email }
    }));
  };

  const updateGiftMessage = (itemId, message) => {
    setGiftOptions(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], message }
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price_brl || 0), 0);
  const symbol = 'R$';
  const walletBalance = wallet?.balance_usd || 0;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_percent) couponDiscount = subtotal * (appliedCoupon.discount_percent / 100);
    else if (appliedCoupon.discount_fixed_usd) couponDiscount = appliedCoupon.discount_fixed_usd;
  }

  const afterCoupon = Math.max(0, subtotal - couponDiscount);
  const walletDiscount = useWallet ? Math.min(walletBalance, afterCoupon) : 0;
  const total = Math.max(0, afterCoupon - walletDiscount);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const coupons = await base44.entities.Coupon.filter({ code: couponInput.trim().toUpperCase(), active: true });
      if (coupons.length === 0) { toast.error('Cupom inválido ou expirado'); return; }
      const c = coupons[0];
      if (c.expires_at && new Date(c.expires_at) < new Date()) { toast.error('Cupom expirado'); return; }
      if (c.max_uses && c.uses_count >= c.max_uses) { toast.error('Cupom esgotado'); return; }
      setAppliedCoupon(c);
      toast.success(`Cupom aplicado! ${c.discount_percent ? c.discount_percent + '% de desconto' : symbol + Number(c.discount_fixed_usd || 0).toFixed(2) + ' de desconto'}`);
      setCouponInput('');
    } catch {
      toast.error('Falha ao verificar cupom');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!billing.name || !billing.email) { toast.error('Preencha todos os campos'); return; }
    
    // Validar emails dos presentes
    for (const item of items) {
      const gift = giftOptions[item.id];
      if (gift?.isGift && !gift.email) {
        toast.error(`Preencha o email do destinatário para: ${item.product_title}`);
        return;
      }
      if (gift?.isGift && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gift.email)) {
        toast.error(`Email inválido para o presente: ${item.product_title}`);
        return;
      }
    }
    
    setSubmitting(true);
    try {
      const me = await base44.auth.me();
      const pixGenerated = `00020126580014br.gov.bcb.pix0136${Date.now()}${Math.random().toString(36).slice(2, 8)}520400005303986540${total.toFixed(2)}5802BR`;

      const orderItems = items.map(item => {
        const gift = giftOptions[item.id];
        return {
          product_id: item.product_id,
          product_title: item.product_title,
          license_name: item.license_name,
          price: item.price_brl || 0,
          thumbnail: item.thumbnail,
          file_url: item.file_url,
          is_gift: gift?.isGift || false,
          gift_recipient_email: gift?.isGift ? gift.email : null,
          gift_message: gift?.isGift ? gift.message : null,
          gift_sender_name: gift?.isGift ? (me.full_name || me.email) : null,
        };
      });

      const order = await base44.entities.Order.create({
        customer_email: me.email,
        customer_name: billing.name,
        status: 'pending',
        payment_method: 'pix',
        currency: 'BRL',
        total_amount: total,
        items: orderItems,
        billing_name: billing.name,
        billing_email: billing.email,
        billing_document: billing.document,
        pix_code: pixGenerated,
        download_token: `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`,
        wallet_used: walletDiscount,
        coupon_discount: couponDiscount,
        subtotal_amount: subtotal,
      });

      if (appliedCoupon) {
        await base44.entities.Coupon.update(appliedCoupon.id, { uses_count: (appliedCoupon.uses_count || 0) + 1 });
      }

      // Limpar carrinho
      for (const item of items) {
        await base44.entities.CartItem.delete(item.id);
      }

      setCurrentOrder(order);
      setPixCode(pixGenerated);
      setFinalTotal(total);
      setShowPix(true);
    } catch (error) {
      console.error(error);
      toast.error('Falha ao realizar pedido');
    } finally {
      setSubmitting(false);
    }
  };

  // Verificar se tem presente
  const hasGift = Object.values(giftOptions).some(g => g?.isGift);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Checkout</h1>

      {/* Aviso de presente */}
      {hasGift && (
        <div className="mb-6 p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl flex items-center gap-3">
          <Gift className="h-5 w-5 text-white" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Presentes no pedido!</p>
            <p className="text-xs text-[#555]">Após a aprovação do pagamento, os presentes serão enviados automaticamente.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-white">Dados de Cobrança</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">Nome Completo *</label>
                <input type="text" value={billing.name} onChange={(e) => setBilling({ ...billing, name: e.target.value })}
                  className="w-full h-11 px-4 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/50" required />
              </div>
              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">E-mail *</label>
                <input type="email" value={billing.email} onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                  className="w-full h-11 px-4 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/50" required />
              </div>
              <div>
                <label className="text-xs font-medium text-[#555] mb-1 block">CPF / CNPJ</label>
                <input type="text" value={billing.document} onChange={(e) => setBilling({ ...billing, document: e.target.value })}
                  className="w-full h-11 px-4 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/50" />
              </div>
            </div>

            {/* Lista de itens com opção de presente estilo Steam */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#1A1A1A] pb-2">Itens do pedido</h3>
              {items.map((item) => {
                const gift = giftOptions[item.id];
                return (
                  <div key={item.id} className="bg-[#111] border border-[#1A1A1A] rounded-xl overflow-hidden">
                    {/* Item header */}
                    <div className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0A0A0A] rounded-lg overflow-hidden flex-shrink-0">
                        {item.thumbnail && <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.product_title}</p>
                        <p className="text-xs text-[#555]">{item.license_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">R$ {item.price_brl?.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Opções de compra estilo Steam */}
                    <div className="border-t border-[#1A1A1A] bg-[#0A0A0A]">
                      <div className="flex divide-x divide-[#1A1A1A]">
                        <button
                          type="button"
                          onClick={() => setAsGift(item.id, false)}
                          className={`flex-1 py-2.5 text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
                            !gift?.isGift 
                              ? 'bg-white text-black' 
                              : 'text-[#555] hover:text-white'
                          }`}
                        >
                          <User className="h-3.5 w-3.5" />
                          Para minha conta
                        </button>
                        <button
                          type="button"
                          onClick={() => setAsGift(item.id, true)}
                          className={`flex-1 py-2.5 text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
                            gift?.isGift 
                              ? 'bg-white text-black' 
                              : 'text-[#555] hover:text-white'
                          }`}
                        >
                          <Gift className="h-3.5 w-3.5" />
                          Enviar como presente
                        </button>
                      </div>

                      {/* Detalhes do presente */}
                      {gift?.isGift && (
                        <div className="p-4 space-y-3 border-t border-[#1A1A1A]">
                          <div>
                            <label className="text-xs font-medium text-[#555] flex items-center gap-1 mb-1">
                              <Mail className="h-3 w-3" /> Email do destinatário *
                            </label>
                            <input
                              type="email"
                              placeholder="amigo@exemplo.com"
                              value={gift.email}
                              onChange={(e) => updateGiftEmail(item.id, e.target.value)}
                              className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/50"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#555] flex items-center gap-1 mb-1">
                              <MessageSquare className="h-3 w-3" /> Mensagem (opcional)
                            </label>
                            <textarea
                              placeholder="Escreva uma mensagem especial..."
                              value={gift.message}
                              onChange={(e) => updateGiftMessage(item.id, e.target.value)}
                              rows={2}
                              maxLength={200}
                              className="w-full px-3 py-2 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/50 resize-none"
                            />
                            <p className="text-[9px] text-[#444] text-right mt-1">{gift.message.length}/200</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Wallet */}
            {walletBalance > 0 && (
              <div className="p-3 bg-[#111] border border-[#1A1A1A] rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Wallet className="h-4 w-4 text-[#555]" />
                  <span>Saldo disponível: <strong>R$ {walletBalance.toFixed(2)}</strong></span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={useWallet} onChange={e => setUseWallet(e.target.checked)} className="rounded border-[#1A1A1A]" />
                  <span className="text-xs text-[#666]">Usar saldo como desconto</span>
                </label>
              </div>
            )}

            {/* Cupom */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#555] block">Cupom de Desconto</label>
              {appliedCoupon ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1A1A1A] rounded-lg">
                  <Tag className="h-4 w-4 text-white" />
                  <span className="text-sm text-white flex-1 font-mono">{appliedCoupon.code}</span>
                  <button type="button" onClick={() => setAppliedCoupon(null)} className="text-[#555] hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="text" placeholder="DESCONTO10" value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                    className="flex-1 h-11 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/50 font-mono" />
                  <Button type="button" onClick={applyCoupon} disabled={couponLoading} variant="outline" className="border-[#1A1A1A] text-[#999] hover:text-white">
                    {couponLoading ? '...' : 'Aplicar'}
                  </Button>
                </div>
              )}
            </div>

            {/* Método de Pagamento */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Método de Pagamento</h3>
              <div className="flex items-center gap-3 p-3 bg-[#111] rounded-lg border border-[#1A1A1A]">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-black text-[10px]">PIX</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">PIX</div>
                  <div className="text-xs text-[#555]">Pagamento instantâneo</div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 rounded-xl">
              {submitting ? 'Processando...' : `Pagar R$ ${total.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-2">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-bold text-white">Resumo</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const gift = giftOptions[item.id];
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#111] rounded-lg overflow-hidden flex-shrink-0">
                      {item.thumbnail && <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{item.product_title}</div>
                      <div className="text-xs text-[#555]">
                        {gift?.isGift ? (
                          <span className="text-white">🎁 Presente para {gift.email}</span>
                        ) : (
                          item.license_name
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-white">R$ {(item.price_brl || 0).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-[#1A1A1A] pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#666]">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Cupom ({appliedCoupon.code})</span>
                  <span>- R$ {couponDiscount.toFixed(2)}</span>
                </div>
              )}
              {useWallet && walletDiscount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Saldo da carteira</span>
                  <span>- R$ {walletDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-white pt-1 border-t border-[#1A1A1A]">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPix && (
        <PixModal
          open={showPix}
          onClose={() => { setShowPix(false); navigate('/dashboard/orders'); }}
          total={finalTotal}
        />
      )}
    </div>
  );
}