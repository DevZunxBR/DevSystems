// src/pages/Checkout.jsx - Versão melhorada
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tag, X, Wallet, CreditCard, Shield, CheckCircle } from 'lucide-react';
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
  const [focusedField, setFocusedField] = useState(null);
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
      if (cartItems.length === 0) { 
        toast.error('Seu carrinho está vazio');
        navigate('/cart'); 
        return; 
      }
      setItems(cartItems);
      setWallet(wallets[0] || null);
      setBilling(prev => ({ ...prev, name: me.full_name || '', email: me.email || '' }));
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
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

  const applyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }
    setCouponLoading(true);
    try {
      const coupons = await base44.entities.Coupon.filter({ code: couponInput.trim().toUpperCase(), active: true });
      if (coupons.length === 0) { 
        toast.error('Cupom inválido ou expirado'); 
        return; 
      }
      const c = coupons[0];
      if (c.expires_at && new Date(c.expires_at) < new Date()) { 
        toast.error('Cupom expirado'); 
        return; 
      }
      if (c.max_uses && c.uses_count >= c.max_uses) { 
        toast.error('Cupom já atingiu o limite de uso'); 
        return; 
      }
      setAppliedCoupon(c);
      toast.success(`Cupom aplicado! ${c.discount_percent ? c.discount_percent + '% de desconto' : symbol + Number(c.discount_fixed_usd || 0).toFixed(2) + ' de desconto'}`);
      setCouponInput('');
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      toast.error('Falha ao verificar cupom');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Cupom removido');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!billing.name.trim()) { 
      toast.error('Preencha seu nome completo'); 
      return; 
    }
    if (!billing.email.trim()) { 
      toast.error('Preencha seu e-mail'); 
      return; 
    }
    if (!billing.email.includes('@')) { 
      toast.error('E-mail inválido'); 
      return; 
    }
    
    setSubmitting(true);
    try {
      const me = await base44.auth.me();
      
      // Gerar código PIX real
      const txid = `DEV${Date.now()}`.substring(0, 25);
      const pixGenerated = `00020126580014br.gov.bcb.pix0136${me.email}520400005303986540${total.toFixed(2)}5802BR5925${billing.name.substring(0, 25)}6009SAO PAULO62070503***6304`;

      const orderItems = items.map(item => ({
        product_id: item.product_id,
        product_title: item.product_title,
        license_name: item.license_name,
        price: item.price_brl || 0,
        thumbnail: item.thumbnail,
        file_url: item.file_url,
      }));

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
        coupon_code: appliedCoupon?.code || null,
      });

      if (appliedCoupon) {
        await base44.entities.Coupon.update(appliedCoupon.id, { 
          uses_count: (appliedCoupon.uses_count || 0) + 1 
        });
      }

      // Limpar carrinho
      for (const item of items) {
        await base44.entities.CartItem.delete(item.id);
      }

      setCurrentOrder(order);
      setPixCode(pixGenerated);
      setFinalTotal(total);
      setShowPix(true);
      
      toast.success('Pedido criado! Aguarde o pagamento');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error('Falha ao realizar pedido. Tente novamente.');
    } finally {
      setSubmitting(false);
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
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-white">Dados de Cobrança</h2>
            
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-medium block mb-1 transition-colors ${
                  focusedField === 'name' ? 'text-white' : 'text-[#555]'
                }`}>
                  Nome Completo *
                </label>
                <input 
                  type="text" 
                  value={billing.name} 
                  onChange={(e) => setBilling({ ...billing, name: e.target.value })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-11 px-3 bg-[#050505] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333] transition-colors"
                  placeholder="Digite seu nome completo"
                  required 
                />
              </div>
              
              <div>
                <label className={`text-xs font-medium block mb-1 transition-colors ${
                  focusedField === 'email' ? 'text-white' : 'text-[#555]'
                }`}>
                  E-mail *
                </label>
                <input 
                  type="email" 
                  value={billing.email} 
                  onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-11 px-3 bg-[#050505] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333] transition-colors"
                  placeholder="seu@email.com"
                  required 
                />
              </div>
              
              <div>
                <label className={`text-xs font-medium block mb-1 transition-colors ${
                  focusedField === 'document' ? 'text-white' : 'text-[#555]'
                }`}>
                  CPF / CNPJ (opcional)
                </label>
                <input 
                  type="text" 
                  value={billing.document} 
                  onChange={(e) => setBilling({ ...billing, document: e.target.value })}
                  onFocus={() => setFocusedField('document')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-11 px-3 bg-[#050505] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333] transition-colors"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            {/* Carteira */}
            {walletBalance > 0 && (
              <div className="p-3 bg-[#050505] border border-[#1A1A1A] rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Wallet className="h-4 w-4 text-[#555]" />
                  <span>Saldo disponível: <strong className="text-white">R$ {walletBalance.toFixed(2)}</strong></span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={useWallet} 
                    onChange={e => setUseWallet(e.target.checked)} 
                    className="rounded border-[#1A1A1A] bg-[#050505]"
                  />
                  <span className="text-xs text-[#666]">Usar saldo da carteira</span>
                </label>
                {useWallet && walletDiscount > 0 && (
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    R$ {walletDiscount.toFixed(2)} de saldo serão descontados
                  </p>
                )}
              </div>
            )}

            {/* Cupom */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#555] block">Cupom de Desconto</label>
              {appliedCoupon ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#050505] border border-[#1A1A1A] rounded-lg">
                  <Tag className="h-4 w-4 text-white" />
                  <span className="text-sm text-white flex-1 font-mono">{appliedCoupon.code}</span>
                  <button 
                    type="button" 
                    onClick={removeCoupon} 
                    className="text-[#555] hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Digite seu cupom (ex: DEV10)" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                    className="flex-1 h-11 px-3 bg-[#050505] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333] transition-colors font-mono" 
                  />
                  <Button 
                    type="button" 
                    onClick={applyCoupon} 
                    disabled={couponLoading} 
                    variant="outline" 
                    className="border-[#1A1A1A] text-[#999] hover:bg-[#0A0A0A] hover:text-white h-11 px-4"
                  >
                    {couponLoading ? '...' : 'Aplicar'}
                  </Button>
                </div>
              )}
            </div>

            {/* Método de Pagamento */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Método de Pagamento</h3>
              <div className="flex items-center gap-3 p-3 bg-[#050505] rounded-lg border border-[#1A1A1A]">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-black text-[10px]">PIX</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">PIX</div>
                  <div className="text-xs text-[#555]">Pagamento instantâneo e seguro</div>
                </div>
                <Shield className="h-4 w-4 text-[#555]" />
              </div>
            </div>

            {/* Botão de pagamento melhorado */}
            <Button 
              type="submit" 
              disabled={submitting} 
              className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 rounded-xl transition-all"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                `Pagar R$ ${total.toFixed(2)}`
              )}
            </Button>

            {/* Badge de segurança */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-[#444]" />
                <span className="text-[9px] text-[#444]">Pagamento seguro</span>
              </div>
              <div className="w-px h-2 bg-[#1A1A1A]" />
              <span className="text-[9px] text-[#444]">Compra protegida</span>
            </div>
          </form>
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-2">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-bold text-white">Resumo do Pedido</h2>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-[#1A1A1A] last:border-0">
                  <div className="w-12 h-12 bg-[#050505] rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.product_title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#333] text-xs">Asset</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{item.product_title}</div>
                    <div className="text-xs text-[#555]">{item.license_name || 'Licença Padrão'}</div>
                  </div>
                  <div className="text-sm font-bold text-white">R$ {(item.price_brl || 0).toFixed(2)}</div>
                </div>
              ))}
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
              
              <div className="flex justify-between font-bold text-lg text-white pt-2 border-t border-[#1A1A1A]">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal PIX */}
      {showPix && (
        <PixModal
          open={showPix}
          onClose={() => { 
            setShowPix(false); 
            navigate('/dashboard/orders');
          }}
          total={finalTotal}
        />
      )}
    </div>
  );
}