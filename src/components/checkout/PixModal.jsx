import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ArrowLeft, Shield, Clock, Smartphone } from 'lucide-react';
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
    if (!open) { setStep('loading'); setTimeLeft(15 * 60); return; }

    const txid = `DEV${Date.now()}`.substring(0, 25);
    const codigo = gerarPixCopiaECola({
      chave: '+5521964012701',
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
        width: 160,
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
      <div className="w-full max-w-sm bg-[#050505] border border-[#1A1A1A] rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1A1A1A]">
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
              <span className="text-black font-black text-[7px]">PIX</span>
            </div>
            <span className="text-sm font-semibold text-white">Pagamento PIX</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#555]">
            <Shield className="h-3 w-3" />
            <span>Seguro</span>
          </div>
        </div>

        {/* Loading */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-[#1A1A1A]" />
              <div className="absolute inset-0 rounded-full border-2 border-t-white animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-white">Gerando cobrança...</p>
              <p className="text-xs text-[#555]">Conectando ao Banco Central do Brasil</p>
            </div>
          </div>
        )}

        {/* Payment */}
        {(step === 'qr' || step === 'code') && (
          <div className="p-5 space-y-4">
            {/* Amount */}
            <div className="text-center space-y-0.5">
              <p className="text-xs text-[#555]">Valor a pagar</p>
              <p className="text-3xl font-black text-white">R${(total || 0).toFixed(2)}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-[#555]">
                <Clock className="h-3 w-3" />
                <span>Expira em <span className={`font-mono font-semibold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>{formatTime(timeLeft)}</span></span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-0.5">
              <button onClick={() => setStep('qr')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${step === 'qr' ? 'bg-white text-black' : 'text-[#555] hover:text-white'}`}>
                <Smartphone className="h-3 w-3" /> QR Code
              </button>
              <button onClick={() => setStep('code')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${step === 'code' ? 'bg-white text-black' : 'text-[#555] hover:text-white'}`}>
                <Copy className="h-3 w-3" /> Copia e Cola
              </button>
            </div>

            {/* QR Code */}
            {step === 'qr' && (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="w-44 h-44 bg-white rounded-xl p-2 flex items-center justify-center">
                    <canvas ref={qrRef} />
                  </div>
                </div>
                <p className="text-center text-xs text-[#555]">Abra o app do seu banco e escaneie o QR Code</p>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-4 py-2 text-center">
                  <p className="text-[11px] text-[#555]">Favorecido</p>
                  <p className="text-xs font-semibold text-white">Natan da Rocha Lima Pacheco</p>
                </div>
              </div>
            )}

            {/* Copia e Cola */}
            {step === 'code' && (
              <div className="space-y-3">
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3 space-y-1">
                  <p className="text-[11px] text-[#555]">Código PIX (Copia e Cola)</p>
                  <p className="text-[11px] text-white font-mono break-all leading-relaxed select-all">{pixCode}</p>
                </div>
                <button onClick={copyCode}
                  className={`w-full h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-white/90'}`}>
                  {copied ? <><Check className="h-4 w-4" /> Copiado!</> : <><Copy className="h-4 w-4" /> Copiar Código</>}
                </button>
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-4 py-2 text-center">
                  <p className="text-[11px] text-[#555]">Favorecido</p>
                  <p className="text-xs font-semibold text-white">Natan da Rocha Lima Pacheco</p>
                </div>
              </div>
            )}

            {/* Steps */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-3 space-y-2">
              <p className="text-xs font-semibold text-white">Como pagar</p>
              {['Abra o app do seu banco', 'Escolha pagar via PIX', step === 'qr' ? 'Escaneie o QR Code' : 'Cole o código copiado', 'Confirme o pagamento'].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#111] border border-[#333] flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] text-[#666] font-semibold">{i + 1}</span>
                  </div>
                  <span className="text-[11px] text-[#888]">{s}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1 text-[10px] text-[#444]">
                <Shield className="h-3 w-3" />
                <span>Transação segura</span>
              </div>
              <div className="w-px h-3 bg-[#1A1A1A]" />
              <span className="text-[10px] text-[#444]">Banco Central do Brasil</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}