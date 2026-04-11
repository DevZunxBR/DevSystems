import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Shield, Clock, Smartphone, QrCode, ArrowLeft, CheckCircle, CreditCard, Banknote, Building } from 'lucide-react';
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
  const [showSuccess, setShowSuccess] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    if (!open) { 
      setStep('loading'); 
      setTimeLeft(15 * 60);
      setShowSuccess(false);
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

  // Tela de sucesso
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Pagamento Confirmado!</h2>
          <p className="text-[#666] text-sm">
            Seu pedido foi registrado com sucesso. Você receberá uma confirmação por email.
          </p>
          <p className="text-[#555] text-xs">
            Aguarde a aprovação do pagamento para fazer o download dos seus arquivos.
          </p>
          <Button onClick={handleClose} className="bg-white text-black hover:bg-white/90 font-semibold px-8">
            Voltar para a loja
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="min-h-screen flex flex-col lg:flex-row">
        
        {/* Sidebar Esquerda - Informações do Pedido */}
        <div className="lg:w-80 bg-[#0A0A0A] border-r border-[#1A1A1A] p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-sm">M</span>
            </div>
            <span className="text-white font-bold tracking-tight">Marketplace</span>
          </div>

          {/* Informações do pagamento */}
          <div className="space-y-6">
            <div>
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-2">Valor a pagar</p>
              <p className="text-3xl font-black text-white">R$ {(total || 0).toFixed(2)}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#555]">
                <CreditCard className="h-4 w-4" />
                <span>Pagamento via PIX</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#555]">
                <Building className="h-4 w-4" />
                <span>Banco Central do Brasil</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#555]">
                <Shield className="h-4 w-4" />
                <span>Transação segura</span>
              </div>
            </div>

            <div className="border-t border-[#1A1A1A] pt-4">
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-2">Favorecido</p>
              <p className="text-sm font-semibold text-white">Natan da Rocha Lima Pacheco</p>
              <p className="text-xs text-[#555] mt-1">natanpachecorocha@gmail.com</p>
            </div>

            <div className="border-t border-[#1A1A1A] pt-4">
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-2">Prazo de pagamento</p>
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${timeLeft < 60 ? 'text-red-400' : 'text-[#555]'}`} />
                <span className={`text-lg font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal - Direita */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-[#1A1A1A] bg-[#0A0A0A] p-4 flex items-center gap-4">
            <button onClick={onClose} className="p-2 text-[#555] hover:text-white transition-colors lg:hidden">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-black text-[8px]">PIX</span>
              </div>
              <span className="text-sm font-semibold text-white">Pagamento PIX</span>
            </div>
          </div>

          {/* Loading */}
          {step === 'loading' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-[#1A1A1A]" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-white animate-spin" />
                </div>
                <p className="text-sm text-white">Gerando código PIX...</p>
                <p className="text-xs text-[#555]">Conectando ao Banco Central</p>
              </div>
            </div>
          )}

          {/* Conteúdo do Pagamento */}
          {(step === 'qr' || step === 'code') && (
            <div className="flex-1 p-6">
              <div className="max-w-md mx-auto space-y-6">
                {/* Tabs */}
                <div className="flex bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-1">
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
                  <div className="bg-white rounded-2xl p-6 flex justify-center">
                    <div className="w-56 h-56">
                      <canvas ref={qrRef} className="w-full h-full" />
                    </div>
                  </div>
                )}

                {/* Copia e Cola */}
                {step === 'code' && (
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
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
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
                  <p className="text-xs font-semibold text-white mb-3">Como pagar via PIX</p>
                  <div className="space-y-2">
                    {[
                      'Abra o app do seu banco',
                      'Escolha pagar via PIX',
                      step === 'qr' ? 'Escaneie o QR Code' : 'Cole o código copiado',
                      'Confirme o pagamento'
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#111] border border-[#333] flex items-center justify-center">
                          <span className="text-[9px] text-[#555] font-semibold">{i + 1}</span>
                        </div>
                        <span className="text-xs text-[#666]">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão de confirmar pagamento (simula) */}
                <button
                  onClick={handleSuccess}
                  className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all"
                >
                  Já paguei, confirmar pedido
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}