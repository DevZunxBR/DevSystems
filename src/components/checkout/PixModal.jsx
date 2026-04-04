import { useState, useEffect } from 'react';
import { Copy, Check, ArrowLeft, Shield, Clock, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export default function PixModal({ open, onClose, pixCode, total, currency }) {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState('loading'); // 'loading' | 'qr' | 'code'
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos

  useEffect(() => {
    if (!open) { setStep('loading'); setTimeLeft(15 * 60); return; }
    const timer = setTimeout(() => setStep('qr'), 2000);
    return () => clearTimeout(timer);
  }, [open]);

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
  const symbol = currency === 'BRL' ? 'R$' : '$';

  const copyCode = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-[#050505] border border-[#1A1A1A] rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-black font-black text-[8px]">PIX</span>
            </div>
            <span className="text-sm font-semibold text-white">Pagamento PIX</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#555]">
            <Shield className="h-3 w-3" />
            <span>Seguro</span>
          </div>
        </div>

        {/* Loading state */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-[#1A1A1A]" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-t-white animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-white">Gerando cobrança...</p>
              <p className="text-xs text-[#555]">Conectando ao Banco Central do Brasil</p>
            </div>
          </div>
        )}

        {/* QR / Payment state */}
        {(step === 'qr' || step === 'code') && (
          <div className="p-6 space-y-5">
            {/* Amount */}
            <div className="text-center space-y-1">
              <p className="text-xs text-[#555]">Valor a pagar</p>
              <p className="text-4xl font-black text-white">{symbol}{total?.toFixed(2)}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-[#555]">
                <Clock className="h-3 w-3" />
                <span>Expira em <span className={`font-mono font-semibold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>{formatTime(timeLeft)}</span></span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-1">
              <button onClick={() => setStep('qr')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${step === 'qr' ? 'bg-white text-black' : 'text-[#555] hover:text-white'}`}>
                <Smartphone className="h-3.5 w-3.5" /> QR Code
              </button>
              <button onClick={() => setStep('code')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${step === 'code' ? 'bg-white text-black' : 'text-[#555] hover:text-white'}`}>
                <Copy className="h-3.5 w-3.5" /> Copia e Cola
              </button>
            </div>

            {/* QR Code */}
            {step === 'qr' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-52 h-52 bg-white rounded-xl p-3 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" width="180" height="180" xmlns="http://www.w3.org/2000/svg">
                      {/* QR Code simulado mas visual */}
                      <rect width="200" height="200" fill="white"/>
                      {/* Corner squares */}
                      <rect x="10" y="10" width="50" height="50" fill="none" stroke="black" strokeWidth="8"/>
                      <rect x="18" y="18" width="34" height="34" fill="black"/>
                      <rect x="140" y="10" width="50" height="50" fill="none" stroke="black" strokeWidth="8"/>
                      <rect x="148" y="18" width="34" height="34" fill="black"/>
                      <rect x="10" y="140" width="50" height="50" fill="none" stroke="black" strokeWidth="8"/>
                      <rect x="18" y="148" width="34" height="34" fill="black"/>
                      {/* Data pattern */}
                      {[70,80,90,100,110,120,130].map((x, xi) =>
                        [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180].map((y, yi) =>
                          ((xi * 7 + yi * 3 + xi * yi) % 3 === 0) ? (
                            <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="black"/>
                          ) : null
                        )
                      )}
                      {[10,20,30,40,50,60].map((x, xi) =>
                        [70,80,90,100,110,120,130].map((y, yi) =>
                          ((xi + yi * 2) % 3 === 0) ? (
                            <rect key={`l-${x}-${y}`} x={x} y={y} width="8" height="8" fill="black"/>
                          ) : null
                        )
                      )}
                      {[140,150,160,170,180].map((x, xi) =>
                        [70,80,90,100,110,120,130].map((y, yi) =>
                          ((xi * 2 + yi) % 3 === 0) ? (
                            <rect key={`r-${x}-${y}`} x={x} y={y} width="8" height="8" fill="black"/>
                          ) : null
                        )
                      )}
                      {/* Center logo */}
                      <rect x="82" y="82" width="36" height="36" rx="4" fill="white"/>
                      <rect x="86" y="86" width="28" height="28" rx="3" fill="#32BCAD"/>
                      <text x="100" y="106" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">PIX</text>
                    </svg>
                  </div>
                </div>
                <p className="text-center text-xs text-[#555]">Abra o app do seu banco e escaneie o QR Code</p>
              </div>
            )}

            {/* Copia e Cola */}
            {step === 'code' && (
              <div className="space-y-3">
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 space-y-2">
                  <p className="text-xs text-[#555]">Código PIX</p>
                  <p className="text-xs text-white font-mono break-all leading-relaxed">{pixCode}</p>
                </div>
                <button onClick={copyCode}
                  className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-white/90'}`}>
                  {copied ? <><Check className="h-4 w-4" /> Copiado!</> : <><Copy className="h-4 w-4" /> Copiar Código</>}
                </button>
              </div>
            )}

            {/* Steps */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-white">Como pagar</p>
              {['Abra o app do seu banco', 'Escolha pagar via PIX', step === 'qr' ? 'Escaneie o QR Code' : 'Cole o código copiado', 'Confirme o pagamento'].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#111] border border-[#333] flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-[#666] font-semibold">{i + 1}</span>
                  </div>
                  <span className="text-xs text-[#888]">{s}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-4 pt-2">
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