// src/components/products/GiftModal.jsx - Versão profissional
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Send, Heart, ArrowLeft, Mail, MessageSquare, User, AlertCircle, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GiftModal({ open, onClose, product, license, price }) {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({ email: '', message: '' });

  // Loading inicial ao abrir o modal (efeito de grandes empresas)
  useEffect(() => {
    if (open) {
      setInitialLoading(true);
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  // Tela de loading inicial
  if (initialLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-[#1A1A1A]" />
            <div className="absolute inset-0 rounded-full border-2 border-t-white animate-spin" />
          </div>
          <p className="text-sm text-white/60 animate-pulse">Preparando presente...</p>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!form.email.trim()) { 
      toast.error('Digite o email do destinatário'); 
      return; 
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { 
      toast.error('Email inválido'); 
      return; 
    }
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
      {/* Tela cheia com fundo embaçado */}
      <div className="min-h-screen flex flex-col">
        
        {/* Header com blur */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#1A1A1A]">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <button 
              onClick={handleClose} 
              className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center hover:bg-[#1A1A1A] transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <Gift className="h-3.5 w-3.5 text-black" />
              </div>
              <span className="text-base font-semibold text-white">Presentear</span>
            </div>
            
            <div className="w-10 h-10 opacity-0" />
          </div>
        </div>

        {/* Conteúdo centralizado */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            
            {step === 'form' ? (
              <div className="space-y-5">
                {/* Card do produto */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#111] rounded-xl overflow-hidden flex-shrink-0 border border-[#1A1A1A]">
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gift className="h-6 w-6 text-[#333]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{product.title}</p>
                      <p className="text-xs text-[#555] mt-0.5">{license?.name || 'Licença Padrão'}</p>
                      <p className="text-base font-bold text-white mt-1">R$ {(price.brl || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Formulário */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 space-y-5">
                  <h3 className="text-base font-bold text-white">Informações do presente</h3>
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#666] flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email do destinatário
                    </label>
                    <input
                      type="email"
                      placeholder="amigo@exemplo.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full h-11 px-4 bg-[#111] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/50 transition-colors"
                    />
                    <p className="text-[10px] text-[#444]">O destinatário receberá uma notificação</p>
                  </div>

                  {/* Mensagem */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#666] flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Mensagem especial
                    </label>
                    <textarea
                      placeholder="Escreva uma mensagem especial..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      maxLength={200}
                      className="w-full px-4 py-3 bg-[#111] border border-[#1A1A1A] rounded-xl text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-white/50 transition-colors resize-none"
                    />
                    <p className="text-[10px] text-[#444] text-right">{form.message.length}/200</p>
                  </div>
                </div>

                {/* Como funciona */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#555]" />
                    <span className="text-xs font-medium text-white">Como funciona?</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#555]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-white mt-0.5 flex-shrink-0" />
                      Você paga pelo presente no checkout
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-white mt-0.5 flex-shrink-0" />
                      O destinatário recebe uma notificação
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-white mt-0.5 flex-shrink-0" />
                      Ele aceita o presente no dashboard
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-white mt-0.5 flex-shrink-0" />
                      Após aceitar, o download é liberado
                    </li>
                  </ul>
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 h-11 border border-[#1A1A1A] text-[#666] hover:text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={loading}
                    className="flex-1 h-11 bg-white text-black hover:bg-white/90 text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <><Send className="h-4 w-4" /> Adicionar ao carrinho</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Tela de sucesso */
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Gift className="h-10 w-10 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white">Presente adicionado!</h2>
                  <p className="text-sm text-[#666]">
                    O presente foi adicionado ao seu carrinho
                  </p>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 space-y-3 text-left">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#1A1A1A]">
                    <User className="h-4 w-4 text-[#555]" />
                    <span className="text-xs text-[#555]">Destinatário</span>
                  </div>
                  <p className="text-sm text-white font-medium break-all">{form.email}</p>
                  
                  {form.message && (
                    <>
                      <div className="flex items-center gap-2 pt-2">
                        <MessageSquare className="h-4 w-4 text-[#555]" />
                        <span className="text-xs text-[#555]">Mensagem</span>
                      </div>
                      <p className="text-sm text-[#888] italic break-words">"{form.message}"</p>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 h-11 border border-[#1A1A1A] text-[#666] hover:text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Continuar comprando
                  </button>
                  <button
                    onClick={() => { handleClose(); navigate('/cart'); }}
                    className="flex-1 h-11 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 transition-colors"
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