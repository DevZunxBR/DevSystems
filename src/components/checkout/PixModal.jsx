// src/components/checkout/PixModal.jsx - Modal pequeno com melhorias
import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ArrowLeft, Shield, Clock, Smartphone, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

// Gera código PIX real no padrão EMV do Banco Central
function gerarPixCopiaECola({ chave, nome, cidade, valor, txid }) {
  const formatField = (id, value) => {
    const len = String(value.length).padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const pixKey = formatField('01', chave);
  const merchantAccount = formatField('00', 'BR.GOV.BCB.PIX') + pixKey;
  const merchantAccountField = formatField('26', merchantAccount);

  const merchantCategoryCode = formatField('52', '0000');
  const currency = formatField('53', '986');
  const amount = formatField('54', valor.toFixed(2));
  const country = formatField('58', 'BR');
  const merchantName = formatField('59', nome.substring(0, 25));
  const merchantCity = formatField('60', cidade.substring(0, 15));
  const txidField = formatField('05', txid.substring(0, 25).replace(/[^a-zA-Z0-9]/g, ''));
  const additionalData = formatField('62', txidField);

  const pixSemCRC = `000201${merchantAccountField}${merchantCategoryCode}${currency}${amount}${country}${merchantName}${merchantCity}${additionalData}6304`;

  let crc = 0xFFFF;
  for (let i = 0; i < pixSemCRC.length; i++) {
    crc ^= pixSemCRC.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  crc = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');

  return pixSemCRC + crc;
}

export default function PixModal({ open, onClose, total }) {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState('loading');
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [pixCode, setPixCode] = useState('');
  const qrRef = useRef(null);

  useEffect(() => {
    if (!open) { 
      setStep('loading'); 
      setTimeLeft(15 * 60); 
      return; 
    }

    const txid = `DEV${Date.now()}`.substring(0, 25);
    const codigo = gerarPixCopiaECola({
      chave: 'natanpachecorocha@gmail.com',
      nome: 'Natan da Rocha Lima',
      cidade: 'RIO DE JANEIRO',
      valor: total || 0,
      txid,
    });
    setPixCode(codigo);

    const timer = setTimeout(() => setStep('qr'), 2000);
    return () => clearTimeout(timer);
  }, [open, total]);

  // Gera QR Code real quando muda para step qr
  useEffect(() => {
    if (step === 'qr' && qrRef.current && pixCode) {
      QRCode.toCanvas(qrRef.current, pixCode, {
        width: 180,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }).catch(console.error);
    }
  }, [step, pixCode]);

  useEffect(() => {
    if (step !== 'qr' && step !== 'code') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#050505] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header melhorado */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A] bg-[#0A0A0A]/50">
          <button 
            onClick={onClose} 
            className="text-[#555] hover:text-white transition-colors p-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
              <span className="text-black font-black text-[7px]">PIX</span>
            </div>
            <span className="text-sm font-semibold text-white">Pagamento PIX</span>
          </div>
          
          <div className="flex items-center gap-1 text-[11px] text-[#555]">
            <Shield className="h-3 w-3" />
            <span>Seguro</span>
          </div>
        </div>

        {/* Loading melhorado */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-[#1A1A1A]" />
              <div className="absolute inset-0 rounded-full border-2 border-t-white animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-white">Gerando cobrança...</p>
              <p className="text-xs text-[#555]">Conectando ao Banco Central</p>
            </div>
          </div>
        )}

        {/* Payment com melhorias */}
        {(step === 'qr' || step === 'code') && (
          <div className="p-5 space-y-5">
            
            {/* Valor e Timer */}
            <div className="text-center space-y-2">
              <p className="text-xs text-[#555]">Valor a pagar</p>
              <p className="text-3xl font-black text-white">R$ {(total || 0).toFixed(2)}</p>
              
              <div className="flex items-center justify-center gap-1 pt-1">
                <Clock className={`h-3 w-3 ${timeLeft < 60 ? 'text-red-400' : 'text-[#555]'}`} />
                <span className="text-xs text-[#555]">Expira em </span>
                <span className={`text-xs font-mono font-semibold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Tabs melhoradas */}
            <div className="flex bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-1">
              <button 
                onClick={() => setStep('qr')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                  step === 'qr' 
                    ? 'bg-white text-black' 
                    : 'text-[#555] hover:text-white'
                }`}
              >
                <QrCode className="h-3.5 w-3.5" /> 
                QR Code
              </button>
              <button 
                onClick={() => setStep('code')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                  step === 'code' 
                    ? 'bg-white text-black' 
                    : 'text-[#555] hover:text-white'
                }`}
              >
                <Copy className="h-3.5 w-3.5" /> 
                Copiar
              </button>
            </div>

            {/* QR Code melhorado */}
            {step === 'qr' && (
              <div className="space-y-3">
                <div className="flex justify-center py-2">
                  <div className="w-44 h-44 bg-white rounded-xl p-3 flex items-center justify-center shadow-lg">
                    <canvas ref={qrRef} />
                  </div>
                </div>
                <p className="text-center text-xs text-[#555]">
                  Escaneie o QR Code com seu banco
                </p>
              </div>
            )}

            {/* Copia e Cola melhorado */}
            {step === 'code' && (
              <div className="space-y-3">
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3">
                  <p className="text-[10px] text-[#555] mb-1">Código PIX (Copia e Cola)</p>
                  <p className="text-[11px] text-white font-mono break-all select-all leading-relaxed">
                    {pixCode}
                  </p>
                </div>
                <button 
                  onClick={copyCode}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {copied ? (
                    <><Check className="h-4 w-4" /> Copiado!</>
                  ) : (
                    <><Copy className="h-4 w-4" /> Copiar código</>
                  )}
                </button>
              </div>
            )}

            {/* Favorecido melhorado */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3">
              <p className="text-[10px] text-[#555] mb-1">Favorecido</p>
              <p className="text-xs font-semibold text-white">Natan da Rocha Lima Pacheco</p>
              <p className="text-[10px] text-[#555] mt-0.5">natanpachecorocha@gmail.com</p>
            </div>

            {/* Como pagar - mais compacto */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3 space-y-2">
              <p className="text-xs font-semibold text-white">Como pagar</p>
              <div className="space-y-1.5">
                {[
                  'Abra o app do seu banco',
                  'Escolha pagar via PIX',
                  step === 'qr' ? 'Escaneie o QR Code' : 'Cole o código copiado',
                  'Confirme o pagamento'
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#111] border border-[#333] flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] text-[#666] font-bold">{i + 1}</span>
                    </div>
                    <span className="text-[10px] text-[#888]">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer mais clean */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-[9px] text-[#444]">
                <Shield className="h-2.5 w-2.5" />
                <span>Transação segura</span>
              </div>
              <div className="w-px h-2.5 bg-[#1A1A1A]" />
              <span className="text-[9px] text-[#444]">Banco Central</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}