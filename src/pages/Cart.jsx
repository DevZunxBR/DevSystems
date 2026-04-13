// src/pages/Cart.jsx - Com resumo detalhado
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, AlertCircle, RefreshCw, Gift, Tag } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me();
      const cartItems = await base44.entities.CartItem.filter({ user_email: me.email });
      setItems(cartItems);
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
        toast.error('Cupom esgotado'); 
        return; 
      }
      setAppliedCoupon(c);
      toast.success(`Cupom ${c.code} aplicado!`);
      setCouponInput('');
    } catch {
      toast.error('Falha ao verificar cupom');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Cupom removido');
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price_brl || 0), 0);
  
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_percent) {
      couponDiscount = subtotal * (appliedCoupon.discount_percent / 100);
    } else if (appliedCoupon.discount_fixed_usd) {
      couponDiscount = appliedCoupon.discount_fixed_usd;
    }
  }
  
  const total = Math.max(0, subtotal - couponDiscount);
  
  // Verificar se tem presente no carrinho
  const hasGift = items.some(item => item.is_gift === true);

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
            <p className="text-[#444] text-sm mt-1">Adicione assets para começar</p>
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

          {/* Resumo do Pedido - Detalhado */}
          <div>
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-5 sticky top-24">
              <h3 className="text-lg font-bold text-white">Resumo do Pedido</h3>

              {/* Lista de itens no resumo */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span className="text-[#666]">{item.product_title}</span>
                      {item.is_gift && (
                        <span className="text-[10px] text-white/50 ml-1">(Presente)</span>
                      )}
                    </div>
                    <span className="text-white">R$ {item.price_brl?.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1A1A1A] pt-3 space-y-2 text-sm">
                {/* Subtotal */}
                <div className="flex justify-between text-[#666]">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                
                {/* Desconto do cupom */}
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" /> Cupom ({appliedCoupon.code})
                    </span>
                    <span>- R$ {couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Total */}
                <div className="flex justify-between font-bold text-white pt-2 border-t border-[#1A1A1A] text-base">
                  <span>Total</span>
                  <span className="text-xl">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Cupom de desconto */}
              <div className="pt-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-[#111] border border-[#1A1A1A] rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-xs text-white">{appliedCoupon.code}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#555] hover:text-red-500 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cupom de desconto"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                      className="flex-1 h-9 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-xs text-white placeholder:text-[#444] focus:outline-none focus:border-white/30"
                    />
                    <Button
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      variant="outline"
                      size="sm"
                      className="border-[#1A1A1A] text-[#666] hover:text-white text-xs h-9"
                    >
                      {couponLoading ? '...' : 'Aplicar'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Aviso */}
              <div className="flex items-start gap-2 p-2 bg-[#111] rounded-lg">
                <AlertCircle className="h-3 w-3 text-[#555] mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-[#555]">
                  Entrega manual via download após confirmação do pagamento
                </p>
              </div>

              {/* Botões de ação */}
              <div className="space-y-2 pt-2">
                <Button 
                  onClick={() => navigate('/checkout')} 
                  className="w-full bg-white text-black hover:bg-white/90 font-bold gap-2 h-12"
                >
                  Finalizar Compra
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
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