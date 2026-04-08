// src/components/products/GiftModal.jsx - Versão tela cheia
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, X, Send, Heart, ArrowLeft, Mail, MessageSquare, User, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GiftModal({ open, onClose, product, license, price }) {
  const navigate = useNavigate();
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
    <div className="fixed inset-0 z-50 bg-black">
      {/* Tela cheia */}
      <div className="min-h-screen bg-gradient-to-b from-[#050505] to-black flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-[#1A1A1A]">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <button 
              onClick={handleClose} 
              className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center hover:bg-[#1A1A1A] transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-pink-500 rounded-md flex items-center justify-center">
                <Gift className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-base font-semibold text-white">Presentear</span>
            </div>
            
            <div className="w-10 h-10 opacity-0" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            
            {step === 'form' ? (
              <div className="space-y-6">
                {/* Produto preview */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#111] rounded-xl overflow-hidden flex-shrink-0">
                      {product.thumbnail && <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-white">{product.title}</p>
                      <p className="text-xs text-[#555] mt-0.5">{license?.name || 'Standard'}</p>
                      <p className="text-sm font-bold text-white mt-1">R$ {(price.brl || 0).toFixed(2)}</p>
                    </div>
                    <Heart className="h-5 w-5 text-pink-400" />
                  </div>
                </div>

                {/* Informação */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 space-y-4">
                  <h3 className="text-base font-bold text-white">Informações do presente</h3>
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#555] flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email do destinatário *
                    </label>
                    <input
                      type="email"
                      placeholder="amigo@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full h-11 px-4 bg-[#111] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-pink-500/50 transition-colors"
                    />
                    <p className="text-[10px] text-[#444]">O destinatário receberá uma notificação por email</p>
                  </div>

                  {/* Mensagem */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#555] flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Mensagem especial (opcional)
                    </label>
                    <textarea
                      placeholder="Escreva uma mensagem especial para quem vai receber..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      maxLength={200}
                      className="w-full px-4 py-3 bg-[#111] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-pink-500/50 transition-colors resize-none"
                    />
                    <p className="text-[10px] text-[#444] text-right">{form.message.length}/200</p>
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="bg-pink-500/5 border border-pink-500/20 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-pink-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">Como funciona?</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#666]">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400">•</span>
                      Você paga pelo presente normalmente no checkout
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400">•</span>
                      O destinatário recebe uma notificação por email
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400">•</span>
                      Ele terá que aceitar o presente no dashboard
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400">•</span>
                      Após aceitar, o download fica disponível
                    </li>
                  </ul>
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 h-12 border border-[#1A1A1A] text-[#666] hover:text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={loading}
                    className="flex-1 h-12 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send className="h-4 w-4" /> Adicionar ao carrinho</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Success */
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-pink-500/10 border border-pink-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Gift className="h-10 w-10 text-pink-400" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white">Presente adicionado! 🎁</h2>
                  <p className="text-sm text-[#555]">
                    O presente foi adicionado ao carrinho.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#555]" />
                    <span className="text-xs text-[#555]">Destinatário</span>
                  </div>
                  <p className="text-sm text-white font-medium">{form.email}</p>
                  
                  {form.message && (
                    <>
                      <div className="flex items-center gap-2 pt-2">
                        <MessageSquare className="h-4 w-4 text-[#555]" />
                        <span className="text-xs text-[#555]">Mensagem</span>
                      </div>
                      <p className="text-sm text-[#888] italic">"{form.message}"</p>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 h-12 border border-[#1A1A1A] text-[#666] hover:text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Continuar comprando
                  </button>
                  <button
                    onClick={() => { handleClose(); navigate('/cart'); }}
                    className="flex-1 h-12 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors"
                  >
                    Ir para o carrinho
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}