import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Shield, Clock, Smartphone, QrCode, ArrowLeft, CheckCircle, CreditCard, Banknote, Building, X } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const qrRef = useRef(null);

  // Loading inicial ao abrir
  useEffect(() => {
    if (open) {
      setInitialLoading(true);
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) { 
      setStep('loading'); 
      setTimeLeft(15 * 60);
      setShowSuccess(false);
      setInitialLoading(true);
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

  useEffect(() => {
    if (step === 'qr' && qrRef.current && pixCode) {
      QRCode.toCanvas(qrRef.current, pixCode, {
        width: 200,
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

  const handleClose = () => {
    onClose();
    setTimeout(() => setShowSuccess(false), 300);
  };

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 3000);
  };

  if (!open) return null;

  // Loading inicial
  if (initialLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-[#1A1A1A]" />
            <div className="absolute inset-0 rounded-full border-2 border-t-white animate-spin" />
          </div>
          <p className="text-sm text-white/60 animate-pulse">Preparando pagamento...</p>
        </div>
      </div>
    );
  }

  // Tela de sucesso
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 text-center space-y-5 max-w-md mx-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-black text-white">Pagamento Confirmado!</h2>
          <p className="text-sm text-[#666]">
            Seu pedido foi registrado com sucesso.
          </p>
          <p className="text-xs text-[#555]">
            Aguarde a aprovação para fazer o download dos seus arquivos.
          </p>
          <Button onClick={handleClose} className="bg-white text-black hover:bg-white/90 font-semibold w-full">
            Voltar para a loja
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Sidebar Esquerda - Informações */}
          <div className="md:w-80 bg-[#050505] p-6 space-y-6">
            {/* Logo e Fechar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-black text-sm">M</span>
                </div>
                <span className="text-white font-bold tracking-tight text-sm">Marketplace</span>
              </div>
              <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Valor */}
            <div>
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Valor a pagar</p>
              <p className="text-3xl font-black text-white">R$ {(total || 0).toFixed(2)}</p>
            </div>

            {/* Informações */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-[#555]">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Pagamento via PIX</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#555]">
                <Building className="h-3.5 w-3.5" />
                <span>Banco Central do Brasil</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#555]">
                <Shield className="h-3.5 w-3.5" />
                <span>Transação segura</span>
              </div>
            </div>

            {/* Favorecido */}
            <div className="border-t border-[#1A1A1A] pt-4">
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Favorecido</p>
              <p className="text-sm font-semibold text-white">Natan da Rocha Lima Pacheco</p>
              <p className="text-xs text-[#555] mt-0.5">natanpachecorocha@gmail.com</p>
            </div>

            {/* Timer */}
            <div className="border-t border-[#1A1A1A] pt-4">
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Prazo de pagamento</p>
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${timeLeft < 60 ? 'text-red-400' : 'text-[#555]'}`} />
                <span className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Conteúdo Direita - Pagamento */}
          <div className="flex-1 p-6">
            {/* Título */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-black text-[8px]">PIX</span>
              </div>
              <span className="text-sm font-semibold text-white">Pagamento PIX</span>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-1 mb-6">
              <button
                onClick={() => setStep('qr')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  step === 'qr' ? 'bg-white text-black' : 'text-[#555] hover:text-white'
                }`}
              >
                <Smartphone className="h-4 w-4" /> QR Code
              </button>
              <button
                onClick={() => setStep('code')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  step === 'code' ? 'bg-white text-black' : 'text-[#555] hover:text-white'
                }`}
              >
                <Copy className="h-4 w-4" /> Copiar código
              </button>
            </div>

            {/* QR Code */}
            {step === 'qr' && (
              <div className="bg-white rounded-2xl p-6 flex justify-center mb-6">
                <div className="w-52 h-52">
                  <canvas ref={qrRef} className="w-full h-full" />
                </div>
              </div>
            )}

            {/* Copia e Cola */}
            {step === 'code' && (
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 mb-6">
                <p className="text-xs text-[#555] mb-2">Código PIX (Copia e Cola)</p>
                <p className="text-xs text-white font-mono break-all select-all bg-[#111] p-3 rounded-lg">
                  {pixCode}
                </p>
                <button
                  onClick={copyCode}
                  className={`w-full mt-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Código copiado!' : 'Copiar código PIX'}
                </button>
              </div>
            )}

            {/* Passo a passo */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-white mb-3">Como pagar via PIX</p>
              <div className="space-y-2">
                {[
                  'Abra o app do seu banco',
                  'Escolha pagar via PIX',
                  step === 'qr' ? 'Escaneie o QR Code' : 'Cole o código copiado',
                  'Confirme o pagamento'
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#111] border border-[#333] flex items-center justify-center">
                      <span className="text-[9px] text-[#555] font-semibold">{i + 1}</span>
                    </div>
                    <span className="text-xs text-[#666]">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão de confirmação */}
            <button
              onClick={handleSuccess}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all"
            >
              Já paguei, confirmar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}