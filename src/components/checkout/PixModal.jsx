import { useState, useEffect, useRef } from 'react';
import { Copy, Check, CheckCircle, Info, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';

// ─── PIX EMV generator (NÃO MODIFICADO) ─────────────────────────────────────
function gerarPixCopiaECola({ chave, nome, cidade, valor, txid }) {
  const formatField = (id, value) => {
    const len = String(value.length).padStart(2, '0');
    return `${id}${len}${value}`;
  };
  const pixKey               = formatField('01', chave);
  const merchantAccount      = formatField('00', 'BR.GOV.BCB.PIX') + pixKey;
  const merchantAccountField = formatField('26', merchantAccount);
  const merchantCategoryCode = formatField('52', '0000');
  const currency             = formatField('53', '986');
  const amount               = formatField('54', valor.toFixed(2));
  const country              = formatField('58', 'BR');
  const merchantName         = formatField('59', nome.substring(0, 25));
  const merchantCity         = formatField('60', cidade.substring(0, 15));
  const txidField            = formatField('05', txid.substring(0, 25).replace(/[^a-zA-Z0-9]/g, ''));
  const additionalData       = formatField('62', txidField);
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

function CountdownTimer({ startTime }) {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 15 * 60 - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const isExpiring = timeLeft < 60;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isExpiring ? 'bg-red-500/10' : 'bg-[#0a0a0a]'} border ${isExpiring ? 'border-red-500/20' : 'border-[#1e1e1e]'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isExpiring ? 'bg-red-500 animate-pulse' : 'bg-[#555]'}`} />
      <span className={`text-xs font-mono font-bold ${isExpiring ? 'text-red-400' : 'text-white'}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

export default function PixModal({ open, onClose, total, cartItems = [] }) {
  const [ready, setReady]         = useState(false);
  const [pixCode, setPixCode]     = useState('');
  const [txid, setTxid]           = useState('');
  const [copied, setCopied]       = useState(false);
  const [startTime, setStartTime] = useState(null);
  const qrContainerRef            = useRef(null);
  const qrRendered                = useRef(false);

  // reset + gera código
  useEffect(() => {
    if (!open) {
      setReady(false);
      setCopied(false);
      setStartTime(null);
      qrRendered.current = false;
      return;
    }
    const id = `DEV${Date.now()}`.substring(0, 25);
    setTxid(id);
    const code = gerarPixCopiaECola({
      chave: 'natanpachecorocha@gmail.com',
      nome: 'Natan da Rocha Lima',
      cidade: 'RIO DE JANEIRO',
      valor: total || 0,
      txid: id,
    });
    setPixCode(code);
    const t = setTimeout(() => {
      setReady(true);
      setStartTime(Date.now());
    }, 1800);
    return () => clearTimeout(t);
  }, [open, total]);

  // renderiza QR
  useEffect(() => {
    if (!ready || !qrContainerRef.current || !pixCode || qrRendered.current) return;
    qrRendered.current = true;
    QRCode.toDataURL(pixCode, {
      width: 200,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).then((url) => {
      if (!qrContainerRef.current) return;
      qrContainerRef.current.innerHTML = '';
      const img = document.createElement('img');
      img.src = url;
      img.width = 200;
      img.height = 200;
      img.style.display = 'block';
      img.style.borderRadius = '12px';
      qrContainerRef.current.appendChild(img);
    }).catch(console.error);
  }, [ready, pixCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (!open) return null;

  const itemName = cartItems?.[0]?.name ?? cartItems?.[0]?.product_title ?? 'Asset digital';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header com botão fechar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-xs">M</span>
            </div>
            <span className="text-white font-bold tracking-tight text-sm">Marketplace</span>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Loading */}
            {!ready && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-12 gap-5"
              >
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-[#1A1A1A]" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-white animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-white font-medium">Gerando código PIX</p>
                  <p className="text-xs text-[#555] mt-1">Isso leva apenas alguns segundos...</p>
                </div>
              </motion.div>
            )}

            {/* Conteúdo */}
            {ready && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-5"
              >
                {/* Ícone + título */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-7 w-7 text-green-500" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-black text-white">Pagamento PIX</h2>
                    <p className="text-xs text-[#555]">Escaneie o QR Code ou copie o código</p>
                  </div>
                </div>

                {/* Valor */}
                <div className="text-center">
                  <p className="text-xs text-[#555]">Valor a pagar</p>
                  <p className="text-3xl font-black text-white">R$ {(total || 0).toFixed(2)}</p>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-xl p-3">
                  <div ref={qrContainerRef} className="w-48 h-48" />
                </div>

                {/* Timer */}
                <CountdownTimer startTime={startTime} />

                {/* Código + botão copiar */}
                <div className="w-full">
                  <p className="text-[9px] text-[#444] font-bold uppercase tracking-wider mb-2 ml-1">
                    Código PIX Copia e Cola
                  </p>
                  <div className="w-full flex border border-[#1A1A1A] rounded-xl overflow-hidden hover:border-[#333] transition-colors">
                    <div className="flex-1 bg-[#0A0A0A] px-3 py-3 font-mono text-[10px] text-[#555] overflow-x-auto whitespace-nowrap select-all">
                      {pixCode}
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`flex-shrink-0 flex items-center justify-center gap-2 px-5 transition-all duration-300 ${
                        copied
                          ? 'bg-green-500/10 text-green-500 border-l border-green-500/20'
                          : 'bg-white text-black hover:bg-white/90'
                      }`}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Passo a passo */}
                <div className="w-full">
                  <p className="text-[9px] text-[#444] font-bold uppercase tracking-wider mb-3 ml-1">
                    Como pagar
                  </p>
                  <div className="space-y-2">
                    {[
                      'Abra o app do seu banco',
                      'Escolha pagar via PIX',
                      'Escaneie o QR Code ou cole o código',
                      'Confirme o pagamento'
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#111] border border-[#1A1A1A] flex items-center justify-center">
                          <span className="text-[9px] text-[#555] font-bold">{i + 1}</span>
                        </div>
                        <span className="text-xs text-[#555]">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nota informativa */}
                <div className="w-full flex items-start gap-2 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-3 py-3">
                  <Info className="h-3.5 w-3.5 text-[#555] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[#555] leading-relaxed">
                    Após o pagamento, seu pedido será aprovado em até <span className="text-white">30 minutos</span> em dias úteis.
                  </p>
                </div>

                {/* Botão voltar */}
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-[#1A1A1A] rounded-xl bg-transparent text-[#666] text-sm font-medium hover:border-[#333] hover:text-white hover:bg-[#0A0A0A] transition-all duration-300"
                >
                  Voltar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}