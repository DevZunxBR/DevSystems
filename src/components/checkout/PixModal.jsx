import { useState, useEffect, useRef } from 'react';
import {
  Copy, Check, Shield, Clock, Smartphone, QrCode,
  ArrowLeft, CheckCircle, CreditCard, Building, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

// ─── PIX EMV generator (NOT modified) ───────────────────────────────────────
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
  crc = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return pixSemCRC + crc;
}
// ────────────────────────────────────────────────────────────────────────────

const TOTAL_SECONDS = 15 * 60;

export default function PixModal({ open, onClose, total }) {
  const [tab, setTab] = useState('qr');
  const [step, setStep] = useState('loading');
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [pixCode, setPixCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const qrRef = useRef(null);

  // Init / reset
  useEffect(() => {
    if (!open) {
      setStep('loading');
      setTab('qr');
      setTimeLeft(TOTAL_SECONDS);
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
    const t = setTimeout(() => setStep('ready'), 2000);
    return () => clearTimeout(t);
  }, [open, total]);

  // Render QR
  useEffect(() => {
    if (step === 'ready' && tab === 'qr' && qrRef.current && pixCode) {
      QRCode.toCanvas(qrRef.current, pixCode, {
        width: 180,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }).catch(console.error);
    }
  }, [step, tab, pixCode]);

  // Countdown
  useEffect(() => {
    if (step !== 'ready') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); onClose(); }, 3000);
  };

  if (!open) return null;

  // ── Tela de sucesso ──────────────────────────────────────────────────────
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center space-y-5 max-w-sm mx-auto px-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white mb-2">Pagamento confirmado!</h2>
            <p className="text-[#555] text-sm leading-relaxed">
              Seu pedido foi registrado. Assim que o pagamento for aprovado, seus arquivos estarão disponíveis em <span className="text-white font-semibold">Meus Pedidos</span>.
            </p>
          </div>
          <button
            onClick={() => { setShowSuccess(false); onClose(); }}
            className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-opacity"
          >
            Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  // ── Modal principal ──────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <div className="h-full flex flex-col lg:flex-row">

        {/* ── Sidebar esquerda ── */}
        <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 bg-[#080808] border-r border-[#161616] px-7 py-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-[11px] tracking-tight">M</span>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">Marketplace</span>
          </div>

          {/* Valor */}
          <div className="mb-8">
            <p className="text-[10px] text-[#333] uppercase tracking-widest font-semibold mb-1">Total a pagar</p>
            <p className="text-4xl font-black text-white tracking-tight">
              R$ {(total || 0).toFixed(2)}
            </p>
          </div>

          {/* Detalhes */}
          <div className="flex flex-col divide-y divide-[#111]">
            {[
              { label: 'Método', value: 'PIX instantâneo' },
              { label: 'Favorecido', value: 'Natan da Rocha Lima' },
              { label: 'Chave PIX', value: 'natanpacheco...@gmail.com', mono: true },
              { label: 'Instituição', value: 'Banco Central do Brasil' },
            ].map(({ label, value, mono }) => (
              <div key={label} className="py-3.5">
                <p className="text-[10px] text-[#333] uppercase tracking-widest font-semibold mb-1">{label}</p>
                <p className={`text-sm text-[#aaa] font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Timer */}
          <div className="mt-auto pt-6 border-t border-[#161616]">
            <p className="text-[10px] text-[#333] uppercase tracking-widest font-semibold mb-2">Expira em</p>
            <p className={`text-2xl font-bold font-mono tracking-wider ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </p>
            <div className="h-px bg-[#1a1a1a] rounded mt-3 overflow-hidden">
              <div
                className="h-full bg-white rounded transition-all duration-1000"
                style={{ width: `${(timeLeft / TOTAL_SECONDS) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        {/* ── Conteúdo direito ── */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex-shrink-0 border-b border-[#161616] bg-[#050505] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-[#444] hover:text-white transition-colors lg:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="bg-[#111] border border-[#222] rounded-md px-2.5 py-1 text-[11px] font-bold text-[#777] tracking-widest">PIX</span>
                <span className="text-sm text-[#444] font-medium">Escaneie ou copie o código</span>
              </div>
            </div>
            {/* Mobile: timer */}
            <div className="lg:hidden flex items-center gap-1.5">
              <Clock className={`h-3.5 w-3.5 ${timeLeft < 60 ? 'text-red-400' : 'text-[#444]'}`} />
              <span className={`text-sm font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 gap-5">

            {/* Loading */}
            {step === 'loading' && (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border border-[#1a1a1a]" />
                  <div className="absolute inset-0 rounded-full border border-t-white animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white mb-1">Gerando código PIX</p>
                  <p className="text-xs text-[#444]">Conectando ao Banco Central...</p>
                </div>
              </div>
            )}

            {/* Tabs + conteúdo */}
            {step === 'ready' && (
              <>
                {/* Tabs */}
                <div className="flex bg-[#0e0e0e] border border-[#1c1c1c] rounded-xl p-1 w-full max-w-sm">
                  {[
                    { id: 'qr', label: 'QR Code', Icon: QrCode },
                    { id: 'copy', label: 'Copia e Cola', Icon: Copy },
                  ].map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-xs font-bold transition-all
                        ${tab === id ? 'bg-white text-black' : 'text-[#555] hover:text-[#999]'}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* QR */}
                {tab === 'qr' && (
                  <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3">
                    <canvas ref={qrRef} className="rounded" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#00b2ff]" />
                      <span className="text-xs font-black text-[#222] tracking-tight">PIX</span>
                    </div>
                  </div>
                )}

                {/* Copia e Cola */}
                {tab === 'copy' && (
                  <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 flex flex-col gap-3">
                    <p className="text-[10px] text-[#333] uppercase tracking-widest font-semibold">Código PIX</p>
                    <div className="bg-[#050505] border border-[#1c1c1c] rounded-lg p-3 font-mono text-[11px] text-[#555] break-all leading-relaxed select-all">
                      {pixCode}
                    </div>
                    <button
                      onClick={copyCode}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
                        ${copied
                          ? 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa]'
                          : 'bg-white text-black hover:opacity-90'
                        }`}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copiado!' : 'Copiar código PIX'}
                    </button>
                  </div>
                )}

                {/* Passo a passo */}
                <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
                  <p className="text-[10px] text-[#333] uppercase tracking-widest font-semibold mb-3">Como pagar</p>
                  <div className="flex flex-col gap-2.5">
                    {[
                      'Abra o app do seu banco',
                      'Acesse a área PIX',
                      tab === 'qr' ? 'Escaneie o QR Code' : 'Cole o código copiado',
                      'Confirme o pagamento',
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] text-[#555] font-bold">{i + 1}</span>
                        </div>
                        <span className="text-xs text-[#555]">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleSuccess}
                  className="w-full max-w-sm bg-white text-black py-3.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Já paguei — confirmar pedido
                </button>

                {/* Trust badge */}
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-[#333]" />
                  <span className="text-[11px] text-[#333]">Transação protegida · SSL · Banco Central</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}