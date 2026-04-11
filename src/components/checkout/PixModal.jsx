import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ArrowLeft, Shield, Clock, Smartphone, AlertCircle, CheckCircle, Lock, Building, CreditCard } from 'lucide-react';
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
    <>
      {/* Overlay com blur */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#0F0F0F] border-b border-[#1A1A1A]">
            <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-black text-[8px]">PIX</span>
              </div>
              <span className="text-sm font-semibold text-white">Pagamento Instantâneo</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 rounded-full">
              <Shield className="h-3 w-3 text-green-500" />
              <span className="text-[9px] text-green-500">Seguro</span>
            </div>
          </div>

          {/* Loading */}
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-[#1A1A1A]" />
                <div className="absolute inset-0 rounded-full border-2 border-t-white animate-spin" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-white">Gerando código PIX</p>
                <p className="text-xs text-[#555]">Aguarde alguns segundos...</p>
              </div>
            </div>
          )}

          {/* Payment */}
          {(step === 'qr' || step === 'code') && (
            <div className="p-5 space-y-5">
              {/* Tags de segurança */}
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-2 py-1 bg-[#111] border border-[#1A1A1A] rounded-full text-[9px] text-[#555] flex items-center gap-1">
                  <Lock className="h-2.5 w-2.5" /> Criptografado
                </span>
                <span className="px-2 py-1 bg-[#111] border border-[#1A1A1A] rounded-full text-[9px] text-[#555] flex items-center gap-1">
                  <Building className="h-2.5 w-2.5" /> Banco Central
                </span>
                <span className="px-2 py-1 bg-[#111] border border-[#1A1A1A] rounded-full text-[9px] text-[#555] flex items-center gap-1">
                  <CreditCard className="h-2.5 w-2.5" /> PIX Instantâneo
                </span>
              </div>

              {/* Valor */}
              <div className="text-center">
                <p className="text-[10px] text-[#555] uppercase tracking-wider">Valor a pagar</p>
                <p className="text-3xl font-black text-white">R$ {(total || 0).toFixed(2)}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Clock className={`h-3 w-3 ${timeLeft < 60 ? 'text-red-400' : 'text-[#555]'}`} />
                  <span className={`text-[10px] font-mono ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-[9px] text-[#555]">restantes</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-1">
                <button
                  onClick={() => setStep('qr')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    step === 'qr' ? 'bg-white text-black' : 'text-[#555] hover:text-white'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" /> QR Code
                </button>
                <button
                  onClick={() => setStep('code')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    step === 'code' ? 'bg-white text-black' : 'text-[#555] hover:text-white'
                  }`}
                >
                  <Copy className="h-3.5 w-3.5" /> Copia e Cola
                </button>
              </div>

              {/* QR Code */}
              {step === 'qr' && (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white rounded-xl p-3">
                    <canvas ref={qrRef} className="w-40 h-40" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#555]">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>QR Code válido por {formatTime(timeLeft)}</span>
                  </div>
                </div>
              )}

              {/* Copia e Cola */}
              {step === 'code' && (
                <div className="space-y-3">
                  <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] text-[#555] uppercase tracking-wider">Código PIX</p>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[8px] text-green-500">Ativo</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-white font-mono break-all leading-relaxed bg-[#0A0A0A] p-2 rounded-lg">
                      {pixCode}
                    </p>
                  </div>
                  <button
                    onClick={copyCode}
                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Código copiado!' : 'Copiar código PIX'}
                  </button>
                </div>
              )}

              {/* Informações do favorecido */}
              <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-3">
                <p className="text-[9px] text-[#555] uppercase tracking-wider mb-2">Favorecido</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-white">Natan da Rocha Lima Pacheco</p>
                    <p className="text-[10px] text-[#555]">CPF: ***.123.456-**</p>
                  </div>
                  <div className="px-2 py-1 bg-[#1A1A1A] rounded-lg">
                    <p className="text-[8px] text-[#555]">Conta verificada</p>
                  </div>
                </div>
              </div>

              {/* Passo a passo detalhado */}
              <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-3">
                <p className="text-[9px] text-[#555] uppercase tracking-wider mb-3">Como pagar via PIX</p>
                <div className="space-y-2">
                  {[
                    { step: '1', text: 'Abra o aplicativo do seu banco', icon: '🏦' },
                    { step: '2', text: 'Selecione a opção "Pagar com PIX"', icon: '📱' },
                    { step: '3', text: step === 'qr' ? 'Escaneie o QR Code acima' : 'Cole o código PIX copiado', icon: step === 'qr' ? '📷' : '📋' },
                    { step: '4', text: 'Confirme os dados e finalize o pagamento', icon: '✅' }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3 py-1">
                      <div className="w-6 h-6 rounded-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center">
                        <span className="text-[9px] text-[#555] font-bold">{item.step}</span>
                      </div>
                      <span className="text-[11px] text-[#666]">{item.text}</span>
                      <span className="ml-auto text-[11px]">{item.icon}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avisos de segurança */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  <AlertCircle className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] text-[#555] leading-relaxed">
                    <span className="text-blue-400">Após o pagamento:</span> O pedido será aprovado em até 30 minutos em dias úteis.
                  </p>
                </div>
                <div className="flex items-start gap-2 p-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                  <AlertCircle className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] text-[#555] leading-relaxed">
                    <span className="text-yellow-400">Importante:</span> Não compartilhe este código com ninguém.
                  </p>
                </div>
              </div>

              {/* Botão voltar */}
              <button
                onClick={onClose}
                className="w-full py-3 border border-[#1A1A1A] rounded-xl bg-transparent text-[#666] text-sm font-medium hover:border-[#333] hover:text-white transition-all"
              >
                Cancelar pagamento
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}