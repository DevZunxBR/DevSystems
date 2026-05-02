// src/pages/Checkout.jsx - COMPLETO COM ASAAS REAL (PIX E CARTÃO)
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { base44, supabase } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tag, X, Wallet, Gift, AlertCircle, CreditCard, QrCode } from 'lucide-react';
import { createCustomer, createPayment, getPixQrCode } from '@/services/asaasService';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const isDirectPurchase = searchParams.get('direct') === 'true';
  const [finalTotal, setFinalTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPix, setShowPix] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [billing, setBilling] = useState({ name: '', email: '', document: '', phone: '' });
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const navigate = useNavigate();

  useEffect(() => {
    if (isDirectPurchase) {
      loadDirectPurchase();
    } else {
      loadCart();
    }
  }, [isDirectPurchase]);

  const loadDirectPurchase = async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me();
      const directProduct = sessionStorage.getItem('direct_purchase');
      
      if (!directProduct) {
        toast.error('Nenhum produto encontrado');
        navigate('/store');
        return;
      }
      
      const product = JSON.parse(directProduct);
      setItems([{ ...product, id: 'direct_' + Date.now() }]);
      setBilling(prev => ({ ...prev, name: me.full_name || '', email: me.email || '' }));
      
      const wallets = await base44.entities.Wallet.filter({ user_email: me.email });
      setWallet(wallets[0] || null);
      
      sessionStorage.removeItem('direct_purchase');
    } catch (error) {
      console.error('Erro ao carregar compra direta:', error);
      navigate('/store');
    } finally {
      setLoading(false);
    }
  };

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
    } catch {
      navigate('/cart');
    } finally {
      setLoading(false);
    }
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

  const isZeroTotal = total === 0;

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

  const createOrder = async (status, paymentMethodValue, paymentId = null) => {
    const me = await base44.auth.me();
    const orderItems = items.map(item => ({
      product_id: item.product_id,
      product_title: item.product_title,
      license_name: item.license_name,
      price: item.price_brl || 0,
      thumbnail: item.thumbnail,
      file_url: item.file_url,
      is_gift: item.is_gift || false,
      gift_recipient_email: item.gift_recipient_email,
      gift_message: item.gift_message,
      gift_sender_name: item.gift_sender_name,
    }));

    const order = await base44.entities.Order.create({
      customer_email: me.email,
      customer_name: billing.name,
      status: status,
      payment_method: paymentMethodValue,
      currency: 'BRL',
      total_amount: total,
      items: orderItems,
      billing_name: billing.name,
      billing_email: billing.email,
      billing_document: billing.document,
      asaas_payment_id: paymentId,
      download_token: `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`,
      wallet_used: walletDiscount,
      coupon_discount: couponDiscount,
      subtotal_amount: subtotal,
    });

    if (appliedCoupon) {
      await base44.entities.Coupon.update(appliedCoupon.id, { uses_count: (appliedCoupon.uses_count || 0) + 1 });
    }

    if (useWallet && walletDiscount > 0 && wallet) {
      const newBalance = walletBalance - walletDiscount;
      const tx = {
        type: 'purchase',
        amount: -walletDiscount,
        description: `Compra: ${orderItems.map(i => i.product_title).join(', ')}`,
        date: new Date().toISOString()
      };
      await base44.entities.Wallet.update(wallet.id, {
        balance_usd: newBalance,
        transactions: [...(wallet.transactions || []), tx],
      });
    }

    if (!isDirectPurchase) {
      for (const item of items) {
        await base44.entities.CartItem.delete(item.id);
      }
    }

    return order;
  };

  const handleZeroTotalOrder = async () => {
    if (!billing.name || !billing.email) { 
      toast.error('Preencha todos os campos'); 
      return; 
    }
    
    setSubmitting(true);
    try {
      await createOrder('completed', 'gratis');
      toast.success('Pedido realizado com sucesso!');
      navigate('/dashboard/orders');
    } catch (error) {
      console.error(error);
      toast.error('Falha ao realizar pedido');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!billing.name || !billing.email) { 
      toast.error('Preencha todos os campos'); 
      return; 
    }
    
    setSubmitting(true);
    try {
      // 1. Criar pedido com status 'pending'
      const order = await createOrder('pending', 'pix', null);
      setCurrentOrder(order);

      // 2. Criar cliente no Asaas
      const customer = await createCustomer({
        name: billing.name,
        email: billing.email,
        phone: billing.phone || '',
        document: billing.document || '00000000000',
      });

      if (!customer.id) {
        throw new Error('Erro ao criar cliente no Asaas');
      }

      // 3. Criar cobrança no Asaas
      const payment = await createPayment({
        customerId: customer.id,
        paymentMethod: paymentMethod,
        value: total,
        orderId: order.id,
        description: `Pedido #${order.id}`,
      });

      if (!payment.id) {
        throw new Error('Erro ao criar cobrança no Asaas');
      }

      // 4. Atualizar pedido com payment_id
      await base44.entities.Order.update(order.id, {
        asaas_payment_id: payment.id
      });

      // 5. Se for PIX, buscar QR Code
      if (paymentMethod === 'PIX') {
        const qrData = await getPixQrCode(payment.id);
        setPixData({
          qrCode: qrData.encodedImage,
          payload: qrData.payload,
          paymentId: payment.id,
          total: total
        });
        setShowPix(true);
      } else {
        // Cartão de crédito - redireciona para página de pagamento do Asaas
        window.location.href = payment.invoiceUrl;
      }

    } catch (error) {
      console.error('Erro no pagamento:', error);
      toast.error(error.message || 'Erro ao processar pagamento');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isZeroTotal) {
      handleZeroTotalOrder();
    } else {
      handlePayment();
    }
  };

  const handleClosePixModal = () => {
    setShowPix(false);
    navigate('/dashboard/orders');
  };

  const hasGift = items.some(item => item.is_gift);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-8">Checkout</h1>

      {hasGift && (
        <div className="mb-6 p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center gap-3">
          <Gift className="h-5 w-5 text-pink-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Presentes no carrinho!</p>
            <p className="text-xs text-pink-400/80">Após o pagamento, os presentes serão enviados automaticamente.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Dados de Cobrança</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome Completo *</label>
                <input type="text" value={billing.name} onChange={(e) => setBilling({ ...billing, name: e.target.value })}
                  className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" required />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">E-mail *</label>
                <input type="email" value={billing.email} onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                  className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" required />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">CPF/CNPJ (Opcional)</label>
                <input type="text" value={billing.document} onChange={(e) => setBilling({ ...billing, document: e.target.value })}
                  placeholder="000.000.000-00"
                  className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Telefone (Opcional)</label>
                <input type="tel" value={billing.phone} onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
            </div>

            {/* Wallet */}
            {walletBalance > 0 && (
              <div className="p-3 bg-secondary border border-border rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span>Saldo disponível: <strong>{symbol}{walletBalance.toFixed(2)}</strong></span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={useWallet} onChange={e => setUseWallet(e.target.checked)} className="rounded border-border" />
                  <span className="text-xs text-muted-foreground">Usar saldo como desconto</span>
                </label>
                {useWallet && walletDiscount > 0 && (
                  <p className="text-xs text-green-500">
                    ✓ {symbol}{walletDiscount.toFixed(2)} de saldo serão descontados
                  </p>
                )}
              </div>
            )}

            {/* Cupom */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">Cupom de Desconto</label>
              {appliedCoupon ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg">
                  <Tag className="h-4 w-4 text-foreground" />
                  <span className="text-sm text-foreground flex-1">{appliedCoupon.code}</span>
                  <button type="button" onClick={() => setAppliedCoupon(null)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="text" placeholder="DESCONTO10" value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                    className="flex-1 h-10 px-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" />
                  <Button type="button" onClick={applyCoupon} disabled={couponLoading} variant="outline" className="border-border text-foreground text-xs">
                    {couponLoading ? '...' : 'Aplicar'}
                  </Button>
                </div>
              )}
            </div>

            {/* Método de Pagamento */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Método de Pagamento</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                    paymentMethod === 'PIX' 
                      ? 'border-white bg-white/5 text-white' 
                      : 'border-[#1A1A1A] text-[#555] hover:border-white/50'
                  }`}
                >
                  <QrCode className="h-5 w-5" />
                  <span className="text-sm">PIX</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                    paymentMethod === 'CREDIT_CARD' 
                      ? 'border-white bg-white/5 text-white' 
                      : 'border-[#1A1A1A] text-[#555] hover:border-white/50'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm">Cartão</span>
                </button>
              </div>
              
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="p-3 bg-[#111] border border-[#1A1A1A] rounded-lg">
                  <p className="text-xs text-[#555] text-center">
                    Você será redirecionado para o ambiente seguro do Asaas para pagamento com cartão.
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-white text-black hover:bg-white/90 font-semibold h-12">
              {submitting ? 'Processando...' : isZeroTotal ? 'Finalizar Pedido' : `Pagar ${symbol}${total.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-bold text-foreground">Resumo</h2>
            
            {isZeroTotal && (
              <div className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-[#555] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-white font-medium">Compra com valor total R$ 0,00</p>
                  <p className="text-[10px] text-[#555] mt-0.5">Após finalizar, seu pedido será concluído automaticamente.</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnail && <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{item.product_title}</div>
                    <div className="text-xs text-muted-foreground">{item.license_name}</div>
                  </div>
                  <div className="text-sm font-bold text-foreground">{symbol}{(item.price_brl || 0).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{symbol}{subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Cupom ({appliedCoupon.code})</span>
                  <span>- {symbol}{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              {useWallet && walletDiscount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Saldo</span>
                  <span>- {symbol}{walletDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-foreground pt-1 border-t border-border">
                <span>Total</span>
                <span>{symbol}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal PIX */}
      {showPix && pixData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#1A1A1A]">
              <button onClick={handleClosePixModal} className="text-[#555] hover:text-white">
                ✕
              </button>
              <span className="text-sm font-semibold text-white">Pagar com PIX</span>
              <div className="w-4" />
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-xs text-[#555]">Valor</p>
                <p className="text-2xl font-black text-white">R$ {pixData.total.toFixed(2)}</p>
              </div>

              <div className="bg-white p-4 rounded-lg flex justify-center">
                <img src={pixData.qrCode} alt="QR Code PIX" className="w-48 h-48" />
              </div>

              <div className="bg-black border border-[#1A1A1A] rounded-lg p-3">
                <p className="text-xs text-[#555] mb-2">Código PIX (Copia e Cola)</p>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-white font-mono break-all flex-1">
                    {pixData.payload?.substring(0, 50)}...
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pixData.payload);
                      toast.success('Código PIX copiado!');
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <svg className="h-4 w-4 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-3">
                <p className="text-xs text-[#555] text-center">
                  Após o pagamento, acesse a seção "Meus Pedidos" e aguarde a confirmação manual.<br/>
                  Você receberá o produto assim que o pagamento for verificado.
                </p>
              </div>

              <button
                onClick={handleClosePixModal}
                className="w-full py-2.5 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90"
              >
                Voltar para Meus Pedidos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}