import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RotateCcw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function RefundModal({ open, order, onClose, onSuccess }) {
  const [reason, setReason] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim() || !pixKey.trim()) { toast.error('Preencha todos os campos'); return; }
    setSubmitting(true);
    try {
      const me = await base44.auth.me();
      const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      await base44.entities.RefundRequest.create({
        user_email: me.email,
        user_name: me.full_name || me.email,
        order_id: order.id,
        order_items: order.items?.map(i => i.product_title).join(', ') || '',
        amount_brl: order.total_amount,
        reason,
        status: 'pending',
        expires_at: expires,
        downloaded: false,
        pix_key: pixKey,
      });
      toast.success('Solicitação de reembolso enviada! Responderemos em até 48h.');
      onSuccess(order.id);
    } catch { toast.error('Falha ao enviar solicitação'); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-md p-0 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Solicitar Reembolso</h3>
              <p className="text-xs text-[#555]">Valor: R${order?.total_amount?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-[#111] rounded-lg border border-[#1A1A1A]">
            <AlertCircle className="h-4 w-4 text-[#555] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#666] leading-relaxed">
              Reembolsos são processados manualmente em até 48 horas. Esta solicitação expira em 48h ou se você baixar os arquivos.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-[#555] mb-1 block">Motivo do Reembolso *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Descreva o motivo do reembolso..."
              className="w-full px-3 py-2 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-[#333] resize-none placeholder:text-[#444]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#555] mb-1 block">Sua Chave PIX para receber o reembolso *</label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
              className="w-full h-10 px-3 bg-[#111] border border-[#1A1A1A] rounded-lg text-sm text-white focus:outline-none focus:border-[#333] placeholder:text-[#444]"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting} className="flex-1 bg-white text-black hover:bg-white/90 font-semibold">
              {submitting ? 'Enviando...' : 'Enviar Solicitação'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-[#1A1A1A] text-[#666] hover:bg-[#111] hover:text-white">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}