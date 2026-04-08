import { useState } from 'react';
import { Gift, X, Send, Heart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GiftModal({ open, onClose, product, license, price }) {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', message: '' });

  if (!open) return null;

  const handleSend = async () => {
    if (!form.email.trim()) { toast.error('Digite o email do destinatário'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error('Email inválido'); return; }
    setLoading(true);
    try {
      const me = await base44.auth.me();
      if (form.email.toLowerCase() === me.email.toLowerCase()) {
        toast.error('Você não pode presentear a si mesmo!');
        setLoading(false);
        return;
      }

      // Adiciona ao carrinho com info de presente
      await base44.entities.CartItem.create({
        user_email: me.email,
        product_id: product.id,
        product_title: product.title,
        license_name: license?.name || 'Standard',
        price_usd: price.usd || product.price_usd,
        price_brl: price.brl || product.price_brl,
        thumbnail: product.thumbnail,
        file_url: product.file_url,
        is_gift: true,
        gift_recipient_email: form.email.toLowerCase(),
        gift_message: form.message,
        gift_sender_name: me.full_name || me.email,
      });

      setStep('success');
    } catch (e) {
      toast.error('Erro ao preparar presente');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setForm({ email: '', message: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-pink-500/10 border border-pink-500/20 rounded-lg flex items-center justify-center">
              <Gift className="h-4 w-4 text-pink-400" />
            </div>
            <span className="text-sm font-semibold text-white">Presentear alguém</span>
          </div>
          <button onClick={handleClose} className="text-[#555] hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-6 space-y-5">
            {/* Product preview */}
            <div className="flex items-center gap-3 bg-[#111] border border-[#1A1A1A] rounded-xl p-3">
              <div className="w-12 h-12 bg-[#0A0A0A] rounded-lg overflow-hidden flex-shrink-0">
                {product.thumbnail && <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{product.title}</p>
                <p className="text-xs text-[#555]">{license?.name || 'Standard'} — R${(price.brl || 0).toFixed(2)}</p>
              </div>
              <Heart className="h-4 w-4 text-pink-400 flex-shrink-0" />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#666]">Email do destinatário *</label>
              <input
                type="email"
                placeholder="amigo@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 px-4 bg-[#111] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333] transition-colors"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#666]">Mensagem (opcional)</label>
              <textarea
                placeholder="Escreva uma mensagem especial..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 bg-[#111] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#333] transition-colors resize-none"
              />
              <p className="text-[10px] text-[#444] text-right">{form.message.length}/200</p>
            </div>

            <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3 text-xs text-[#555] space-y-1">
              <p>• Você será redirecionado para o checkout para pagar</p>
              <p>• O destinatário receberá uma notificação</p>
              <p>• Ele poderá aceitar ou recusar o presente</p>
            </div>

            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full h-11 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Send className="h-4 w-4" /> Adicionar ao Carrinho como Presente</>
              )}
            </button>
          </div>
        ) : (
          /* Success */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/20 rounded-full flex items-center justify-center mx-auto">
              <Gift className="h-8 w-8 text-pink-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">Presente adicionado!</h3>
              <p className="text-sm text-[#555]">
                O presente foi adicionado ao carrinho. Finalize o pagamento para enviar!
              </p>
            </div>
            <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-3 text-xs text-[#666]">
              Destinatário: <span className="text-white font-medium">{form.email}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={handleClose} className="flex-1 h-10 border border-[#1A1A1A] text-[#666] hover:text-white text-sm rounded-xl transition-colors">
                Continuar comprando
              </button>
              <button onClick={() => { handleClose(); window.location.href = '/cart'; }}
                className="flex-1 h-10 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors">
                Ir para o carrinho
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}