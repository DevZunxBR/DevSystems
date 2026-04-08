// src/components/checkout/PixModal.jsx - Tela inteira estilo grande empresas
import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ArrowLeft, Shield, Clock, Smartphone, X, AlertCircle, Banknote, QrCode } from 'lucide-react';
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
        width: 280,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }).catch(console.error);
    }
  }, [step, pixCode]);

  useEffect(() => {
    if (step !== 'qr' && step !== 'code') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { 
          clearInterval(interval); 
          toast.error('Tempo expirado, gere um novo código');
          return 0; 
        }
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
    <div className="fixed inset-0 z-50 bg-black">
      {/* Tela inteira */}
      <div className="min-h-screen bg-gradient-to-b from-[#050505] to-black flex flex-col">
        
        {/* Header - Estilo App */}
        <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-[#1A1A1A]">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center hover:bg-[#1A1A1A] transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-black text-[8px]">PIX</span>
              </div>
              <span className="text-base font-semibold text-white">Pagamento PIX</span>
            </div>
            
            <div className="w-10 h-10 opacity-0" />
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            
            {/* Loading */}
            {step === 'loading' && (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-[#1A1A1A]" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-white animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-semibold text-white">Gerando cobrança...</p>
                  <p className="text-sm text-[#555]">Conectando ao Banco Central do Brasil</p>
                </div>
              </div>
            )}

            {/* Payment */}
            {(step === 'qr' || step === 'code') && (
              <div className="space-y-6">
                
                {/* Card do Valor */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 text-center space-y-3">
                  <p className="text-sm text-[#555]">Valor a pagar</p>
                  <p className="text-5xl font-black text-white">R$ {(total || 0).toFixed(2)}</p>
                  
                  {/* Timer */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                      timeLeft < 60 ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#111] border border-[#1A1A1A]'
                    }`}>
                      <Clock className={`h-3.5 w-3.5 ${timeLeft < 60 ? 'text-red-400' : 'text-[#555]'}`} />
                      <span className={`text-xs font-mono font-semibold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs Estilo Moderno */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-1.5">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setStep('qr')}
                      className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        step === 'qr' 
                          ? 'bg-white text-black' 
                          : 'text-[#555] hover:text-white'
                      }`}
                    >
                      <QrCode className="h-4 w-4" /> 
                      QR Code
                    </button>
                    <button 
                      onClick={() => setStep('code')}
                      className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        step === 'code' 
                          ? 'bg-white text-black' 
                          : 'text-[#555] hover:text-white'
                      }`}
                    >
                      <Copy className="h-4 w-4" /> 
                      Copiar Código
                    </button>
                  </div>
                </div>

                {/* QR Code Section - Maior e mais visível */}
                {step === 'qr' && (
                  <div className="bg-white rounded-2xl p-8 flex justify-center">
                    <div className="w-72 h-72">
                      <canvas ref={qrRef} className="w-full h-full" />
                    </div>
                  </div>
                )}

                {/* Copia e Cola Section */}
                {step === 'code' && (
                  <div className="space-y-4">
                    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5">
                      <p className="text-xs text-[#555] mb-2">Código PIX (Copia e Cola)</p>
                      <p className="text-xs text-white font-mono break-all leading-relaxed select-all">
                        {pixCode}
                      </p>
                    </div>
                    
                    <button 
                      onClick={copyCode}
                      className={`w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all ${
                        copied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white text-black hover:bg-white/90'
                      }`}
                    >
                      {copied ? (
                        <><Check className="h-5 w-5" /> Código copiado!</>
                      ) : (
                        <><Copy className="h-5 w-5" /> Copiar código PIX</>
                      )}
                    </button>
                  </div>
                )}

                {/* Informações do Favorecido */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-[#555]" />
                    <p className="text-xs font-semibold text-white">Favorecido</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Natan da Rocha Lima Pacheco</p>
                    <p className="text-xs text-[#555] mt-0.5">CPF: ***.123.456-**</p>
                  </div>
                </div>

                {/* Como pagar - Passo a passo */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 space-y-4">
                  <p className="text-xs font-semibold text-white">Como pagar via PIX</p>
                  <div className="space-y-3">
                    {[
                      'Abra o aplicativo do seu banco',
                      'Selecione a opção "Pagar com PIX"',
                      step === 'qr' ? 'Escaneie o QR Code acima' : 'Cole o código PIX copiado',
                      'Confirme os dados e finalize o pagamento'
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#111] border border-[#333] flex items-center justify-center flex-shrink-0">
                          <span className="text-[9px] text-[#666] font-bold">{i + 1}</span>
                        </div>
                        <span className="text-xs text-[#888]">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aviso de segurança */}
                <div className="flex items-center justify-center gap-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-[#444]" />
                    <span className="text-[10px] text-[#444]">Transação segura</span>
                  </div>
                  <div className="w-px h-3 bg-[#1A1A1A]" />
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-[#444]" />
                    <span className="text-[10px] text-[#444]">PIX instantâneo</span>
                  </div>
                  <div className="w-px h-3 bg-[#1A1A1A]" />
                  <span className="text-[10px] text-[#444]">Banco Central</span>
                </div>

                {/* Botão de fechar */}
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl text-sm font-medium text-[#555] hover:text-white transition-colors"
                >
                  Cancelar pagamento
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}