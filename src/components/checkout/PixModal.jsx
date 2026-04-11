import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ArrowLeft, Shield, Clock, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

// Gera código PIX real no padrão EMV do Banco Central (NÃO MODIFICADO)
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
      chave: 'natanpachecorocha@gmail.com',
      nome: 'Natan da Rocha Lima',
      cidade: 'RIO DE JANEIRO',
      valor: total || 0,
      txid,
    });
    setPixCode(codigo);

    const timer = setTimeout(() => setStep('qr'), 1500);
    return () => clearTimeout(timer);
  }, [open, total]);

  useEffect(() => {
    if (step === 'qr' && qrRef.current && pixCode) {
      QRCode.toCanvas(qrRef.current, pixCode, {
        width: 140,
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center">
      <div className="w-full max-w-sm bg-[#050505] border border-[#1A1A1A] rounded-xl overflow-hidden mx-4">

        {/* Header simplificado */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A]">
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
              <span className="text-black font-black text-[7px]">PIX</span>
            </div>
            <span className="text-xs font-semibold text-white">Pagamento</span>
          </div>
          <div className="w-4" />
        </div>

        {/* Loading */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-[#1A1A1A]" />
              <div className="absolute inset-0 rounded-full border-2 border-t-white animate-spin" />
            </div>
            <p className="text-xs text-[#555]">Gerando código...</p>
          </div>
        )}

        {/* Payment */}
        {(step === 'qr' || step === 'code') && (
          <div className="p-4 space-y-4">
            {/* Valor e Timer */}
            <div className="text-center">
              <p className="text-[10px] text-[#555]">Valor</p>
              <p className="text-2xl font-black text-white">R$ {(total || 0).toFixed(2)}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Clock className={`h-3 w-3 ${timeLeft < 60 ? 'text-red-400' : 'text-[#555]'}`} />
                <span className={`text-[10px] font-mono ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-0.5">
              <button
                onClick={() => setStep('qr')}
                className={`flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                  step === 'qr' ? 'bg-white text-black' : 'text-[#555] hover:text-white'
                }`}
              >
                <Smartphone className="h-3 w-3" /> QR Code
              </button>
              <button
                onClick={() => setStep('code')}
                className={`flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                  step === 'code' ? 'bg-white text-black' : 'text-[#555] hover:text-white'
                }`}
              >
                <Copy className="h-3 w-3" /> Copiar
              </button>
            </div>

            {/* QR Code */}
            {step === 'qr' && (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white rounded-lg p-2">
                  <canvas ref={qrRef} className="w-36 h-36" />
                </div>
                <p className="text-[9px] text-[#555]">Escaneie com o app do banco</p>
              </div>
            )}

            {/* Copia e Cola */}
            {step === 'code' && (
              <div className="space-y-2">
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-2">
                  <p className="text-[9px] text-[#555] mb-1">Código PIX</p>
                  <p className="text-[9px] text-white font-mono break-all leading-relaxed">{pixCode}</p>
                </div>
                <button
                  onClick={copyCode}
                  className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            )}

            {/* Favorecido */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-2 text-center">
              <p className="text-[9px] text-[#555]">Favorecido</p>
              <p className="text-[10px] font-semibold text-white">Natan da Rocha Lima Pacheco</p>
            </div>

            {/* Passo a passo */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-2">
              <p className="text-[9px] font-semibold text-white mb-1">Como pagar</p>
              <div className="space-y-1">
                {[
                  'Abra o app do banco',
                  'Pague via PIX',
                  step === 'qr' ? 'Escaneie o QR Code' : 'Cole o código',
                  'Confirme'
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-[8px] text-[#555] font-bold">{i + 1}</span>
                    <span className="text-[9px] text-[#666]">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <Shield className="h-2.5 w-2.5 text-[#444]" />
              <span className="text-[8px] text-[#444]">Seguro</span>
              <span className="text-[8px] text-[#444]">•</span>
              <span className="text-[8px] text-[#444]">Banco Central</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}