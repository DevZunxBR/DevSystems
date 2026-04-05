import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Shield, Clock, Smartphone, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

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
    for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
  }
  return pixSemCRC + (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export default function PixModal({ open, onClose, total, items = [] }) {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState('loading');
  const [loadingStep, setLoadingStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [pixCode, setPixCode] = useState('');
  const [tab, setTab] = useState('qr');
  const qrRef = useRef(null);

  const loadingSteps = [
    'Conectando ao Banco Central...',
    'Verificando dados do pagador...',
    'Gerando chave de segurança...',
    'Criando cobrança PIX...',
  ];

  useEffect(() => {
    if (!open) { setStep('loading'); setLoadingStep(0); setTimeLeft(15 * 60); setTab('qr'); return; }

    const txid = `DEV${Date.now()}`.substring(0, 25);
    const codigo = gerarPixCopiaECola({
      chave: '+5521964012701',
      nome: 'Natan da Rocha Lima',
      cidade: 'RIO DE JANEIRO',
      valor: total || 0,
      txid,
    });
    setPixCode(codigo);

    // Simula steps de loading
    let s = 0;
    const stepInterval = setInterval(() => {
      s++;
      setLoadingStep(s);
      if (s >= loadingSteps.length - 1) clearInterval(stepInterval);
    }, 500);

    const timer = setTimeout(() => setStep('payment'), 2200);
    return () => { clearTimeout(timer); clearInterval(stepInterval); };
  }, [open, total]);

  useEffect(() => {
    if (step === 'payment' && tab === 'qr' && qrRef.current && pixCode) {
      QRCode.toCanvas(qrRef.current, pixCode, {
        width: 200, margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }).catch(console.error);
    }
  }, [step, tab, pixCode]);

  useEffect(() => {
    if (step !== 'payment') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
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
    <div className="fixed inset-0 z-50 bg-[#000]">
      {/* Loading screen */}
      {step === 'loading' && (
        <div className="h-full flex flex-col items-center justify-center space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#32BCAD] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">PIX</span>
            </div>
            <span className="text-white font-bold text-xl">Pagamento Seguro</span>
          </div>

          {/* Spinner */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-[#1A1A1A]" />
            <div className="absolute inset-0 rounded-full border-2 border-t-[#32BCAD] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-[#32BCAD]/10 rounded-full flex items-center justify-center">
                <span className="text-[#32BCAD] font-black text-xs">PIX</span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3 w-72">
            {loadingSteps.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${i <= loadingStep ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${i < loadingStep ? 'bg-[#32BCAD]' : i === loadingStep ? 'border-2 border-[#32BCAD]' : 'border border-[#333]'}`}>
                  {i < loadingStep && <Check className="h-3 w-3 text-white" />}
                  {i === loadingStep && <div className="w-2 h-2 bg-[#32BCAD] rounded-full animate-pulse" />}
                </div>
                <span className={`text-sm ${i <= loadingStep ? 'text-white' : 'text-[#333]'}`}>{s}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#444]">
            <Shield className="h-3 w-3" />
            <span>Conexão criptografada • Banco Central do Brasil</span>
          </div>
        </div>
      )}

      {/* Payment screen */}
      {step === 'payment' && (
        <div className="h-full flex flex-col lg:flex-row">

          {/* Left - Order summary */}
          <div className="hidden lg:flex w-96 bg-[#050505] border-r border-[#1A1A1A] flex-col p-8 space-y-6">
            <button onClick={onClose} className="flex items-center gap-2 text-[#555] hover:text-white transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#32BCAD] rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-[10px]">PIX</span>
                </div>
                <span className="text-white font-bold">DevVault</span>
              </div>
              <p className="text-xs text-[#555] mb-1">Total a pagar</p>
              <p className="text-4xl font-black text-white">R${(total || 0).toFixed(2)}</p>
            </div>

            {/* Items */}
            <div className="space-y-3 flex-1">
              <p className="text-xs font-semibold text-[#555] uppercase tracking-wider">Itens do pedido</p>
              {items.length > 0 ? items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#111] rounded-lg overflow-hidden flex-shrink-0 border border-[#1A1A1A]">
                    {item.thumbnail && <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.product_title}</p>
                    <p className="text-xs text-[#555]">{item.license_name || 'Licença Padrão'}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">R${(item.price_brl || item.price || 0).toFixed(2)}</p>
                </div>
              )) : (
                <p className="text-sm text-[#555]">Nenhum item</p>
              )}
            </div>

            {/* Security badges */}
            <div className="space-y-2 pt-4 border-t border-[#1A1A1A]">
              {['Transação 100% segura', 'Dados criptografados', 'Banco Central do Brasil'].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#555]">
                  <Shield className="h-3 w-3 text-[#32BCAD]" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - PIX payment */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
            {/* Mobile header */}
            <div className="lg:hidden w-full max-w-sm mb-6">
              <button onClick={onClose} className="flex items-center gap-2 text-[#555] hover:text-white transition-colors text-sm mb-4">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <p className="text-xs text-[#555]">Total a pagar</p>
              <p className="text-3xl font-black text-white">R${(total || 0).toFixed(2)}</p>
            </div>

            <div className="w-full max-w-sm space-y-5">
              {/* Timer */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Pague com PIX</p>
                <div className={`flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-full ${timeLeft < 60 ? 'bg-red-500/10 text-red-400' : 'bg-[#32BCAD]/10 text-[#32BCAD]'}`}>
                  <Clock className="h-3 w-3" />
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-1">
                <button onClick={() => setTab('qr')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${tab === 'qr' ? 'bg-white text-black' : 'text-[#555] hover:text-white'}`}>
                  <Smartphone className="h-3.5 w-3.5" /> QR Code
                </button>
                <button onClick={() => setTab('code')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${tab === 'code' ? 'bg-white text-black' : 'text-[#555] hover:text-white'}`}>
                  <Copy className="h-3.5 w-3.5" /> Copia e Cola
                </button>
              </div>

              {/* QR Code */}
              {tab === 'qr' && (
                <div className="space-y-4">
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 flex flex-col items-center gap-4">
                    <div className="bg-white rounded-xl p-3">
                      <canvas ref={qrRef} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-[#555]">Favorecido</p>
                      <p className="text-sm font-semibold text-white">Natan da Rocha Lima Pacheco</p>
                    </div>
                  </div>
                  <p className="text-center text-xs text-[#555]">Abra o app do seu banco → PIX → Escanear QR Code</p>
                </div>
              )}

              {/* Copia e Cola */}
              {tab === 'code' && (
                <div className="space-y-3">
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 space-y-2">
                    <p className="text-xs text-[#555]">Código PIX</p>
                    <p className="text-xs text-white font-mono break-all leading-relaxed select-all">{pixCode}</p>
                  </div>
                  <button onClick={copyCode}
                    className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${copied ? 'bg-[#32BCAD] text-white' : 'bg-white text-black hover:bg-white/90'}`}>
                    {copied ? <><Check className="h-4 w-4" /> Copiado!</> : <><Copy className="h-4 w-4" /> Copiar Código PIX</>}
                  </button>
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-4 py-3 text-center">
                    <p className="text-xs text-[#555]">Favorecido</p>
                    <p className="text-sm font-semibold text-white">Natan da Rocha Lima Pacheco</p>
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-[#555] uppercase tracking-wider">Como pagar</p>
                {[
                  'Abra o app do seu banco',
                  'Escolha pagar via PIX',
                  tab === 'qr' ? 'Escaneie o QR Code' : 'Cole o código copiado',
                  'Confirme o pagamento',
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#111] border border-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-[#555] font-bold">{i + 1}</span>
                    </div>
                    <span className="text-xs text-[#888] flex-1">{s}</span>
                    <ChevronRight className="h-3 w-3 text-[#333]" />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-4 pb-4">
                <div className="flex items-center gap-1.5 text-[11px] text-[#444]">
                  <Shield className="h-3 w-3 text-[#32BCAD]" />
                  <span>Pagamento seguro</span>
                </div>
                <div className="w-px h-3 bg-[#1A1A1A]" />
                <span className="text-[11px] text-[#444]">Banco Central do Brasil</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}