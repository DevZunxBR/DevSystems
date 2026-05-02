// src/components/checkout/PaymentModal.jsx
import { useState, useEffect } from 'react';
import { CreditCard, QrCode, Copy, Check, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { createCustomer, createPayment, getPixQrCode } from '@/services/paymentService';
import { supabase } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function PaymentModal({ open, onClose, total, orderId, customerData, sellerWalletId }) {
  const navigate = useNavigate();
  const [method, setMethod] = useState('pix');
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);

  const processPayment = async () => {
    setLoading(true);
    try {
      // 1. Criar cliente no Asaas
      const customer = await createCustomer({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        document: customerData.document,
      });

      // 2. Criar cobrança
      const payment = await createPayment({
        customerId: customer.id,
        value: total,
        paymentMethod: method.toUpperCase(),
        orderId: orderId,
        sellerWalletId: sellerWalletId,
      });

      // 3. Salvar no banco
      await supabase
        .from('orders')
        .update({
          payment_id: payment.id,
          asaas_payment_id: payment.id,
          payment_method: method,
        })
        .eq('id', orderId);

      // 4. Se for PIX, buscar QR Code
      if (method === 'pix') {
        const qrData = await getPixQrCode(payment.id);
        setPixData({
          qrCode: qrData.encodedImage,
          payload: qrData.payload,
        });
      } else {
        // Cartão de crédito - redireciona para checkout do Asaas
        window.location.href = payment.invoiceUrl;
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(pixData?.payload);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#1A1A1A]">
            <button onClick={onClose} className="text-[#555] hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-white">Pagamento</span>
            <div className="w-4" />
          </div>

          {/* Valor */}
          <div className="text-center py-4 border-b border-[#1A1A1A]">
            <p className="text-xs text-[#555]">Valor a pagar</p>
            <p className="text-3xl font-bold text-white">R$ {total?.toFixed(2)}</p>
          </div>

          {/* Sem PIX gerado ainda */}
          {!pixData && !loading && (
            <div className="p-6 space-y-4">
              {/* Métodos de pagamento */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMethod('pix')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                    method === 'pix' 
                      ? 'border-white bg-white/5 text-white' 
                      : 'border-[#1A1A1A] text-[#555] hover:border-white/50'
                  }`}
                >
                  <QrCode className="h-5 w-5" />
                  <span className="text-sm">PIX</span>
                </button>
                <button
                  onClick={() => setMethod('credit_card')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                    method === 'credit_card' 
                      ? 'border-white bg-white/5 text-white' 
                      : 'border-[#1A1A1A] text-[#555] hover:border-white/50'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-sm">Cartão</span>
                </button>
              </div>

              {/* Botão pagar */}
              <button
                onClick={processPayment}
                className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Pagar R$ {total?.toFixed(2)}
              </button>

              <p className="text-center text-[10px] text-[#555]">
                Pagamento seguro via Asaas • PIX • Cartão
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
              <p className="text-xs text-[#555] mt-3">Gerando pagamento...</p>
            </div>
          )}

          {/* PIX Gerado */}
          {pixData && !loading && (
            <div className="p-6 space-y-4">
              <div className="bg-white p-4 rounded-lg flex justify-center">
                <img src={pixData.qrCode} alt="QR Code" className="w-48 h-48" />
              </div>

              <div className="bg-black border border-[#1A1A1A] rounded-lg p-3">
                <p className="text-xs text-[#555] mb-2">Código PIX</p>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-white font-mono break-all flex-1">
                    {pixData.payload?.substring(0, 50)}...
                  </code>
                  <button onClick={copyCode} className="p-1 hover:bg-white/10 rounded">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-[#555]" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard/orders')}
                className="w-full py-2.5 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90"
              >
                Acompanhar Pedido
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}