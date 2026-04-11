import { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Check, CheckCircle, Info, X, Clock, Shield } from 'lucide-react';
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

// Hook: calcula scale para caber na tela
function useAutoScale(targetW, targetH, padding = 24) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => {
      const scaleX = (window.innerWidth  - padding * 2) / targetW;
      const scaleY = (window.innerHeight - padding * 2) / targetH;
      setScale(Math.min(1, scaleX, scaleY));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [targetW, targetH, padding]);
  return scale;
}

// Timer
function CountdownTimer({ startTime }) {
  const [remaining, setRemaining] = useState(15 * 60);
  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const left = Math.max(0, 15 * 60 - elapsed);
      setRemaining(left);
      if (left <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const isLow = remaining < 120;
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${isLow ? 'border-[#3a1a1a] bg-[#1a0a0a]' : 'border-[#1e1e1e] bg-[#0a0a0a]'}`}>
      <Clock className={`h-3 w-3 ${isLow ? 'text-[#ef4444]' : 'text-[#444]'}`} />
      <span className={`text-[11px] font-mono font-bold tabular-nums ${isLow ? 'text-[#ef4444]' : 'text-[#555]'}`}>
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </span>
      <span className="text-[10px] text-[#2a2a2a]">restantes</span>
    </div>
  );
}

// Dimensões base do modal (design source-of-truth)
const MODAL_W = 820;
const MODAL_H = 580;

export default function PixModal({ open, onClose, total, cartItems = [] }) {
  const [ready, setReady]         = useState(false);
  const [pixCode, setPixCode]     = useState('');
  const [txid, setTxid]           = useState('');
  const [copied, setCopied]       = useState(false);
  const [startTime, setStartTime] = useState(null);
  const qrContainerRef            = useRef(null);
  const qrRendered                = useRef(false);
  const scale                     = useAutoScale(MODAL_W, MODAL_H);

  useEffect(() => {
    if (!open) {
      setReady(false); setCopied(false); setStartTime(null);
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
    const t = setTimeout(() => { setReady(true); setStartTime(Date.now()); }, 1800);
    return () => clearTimeout(t);
  }, [open, total]);

  useEffect(() => {
    if (!ready || !qrContainerRef.current || !pixCode || qrRendered.current) return;
    qrRendered.current = true;
    QRCode.toDataURL(pixCode, {
      width: 160, margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).then((url) => {
      if (!qrContainerRef.current) return;
      qrContainerRef.current.innerHTML = '';
      const img = document.createElement('img');
      img.src = url; img.width = 160; img.height = 160;
      img.style.display = 'block'; img.style.borderRadius = '0';
      qrContainerRef.current.appendChild(img);
    }).catch(console.error);
  }, [ready, pixCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  const itemName = cartItems?.[0]?.name ?? 'Asset digital';

  return (
    <AnimatePresence>
      {open && (
        /* Backdrop */
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Modal auto-scale wrapper */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: MODAL_W,
              height: MODAL_H,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
            className="relative bg-[#080808] border border-[#141414] rounded-2xl overflow-hidden flex flex-col shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
          >
            {/* ── Topbar ── */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-[#111] bg-[#060606]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                  <span className="text-black font-black text-[9px] tracking-tighter">M</span>
                </div>
                <span className="text-white font-bold text-[12px] tracking-tight">Marketplace</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#0f0f0f] border border-[#1e1e1e] rounded-full px-3 py-1">
                  <Shield className="h-2.5 w-2.5 text-[#333]" />
                  <span className="text-[9px] text-[#333] font-semibold">SSL · Banco Central</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#1e1e1e] bg-[#0f0f0f] text-[#444] hover:text-white hover:border-[#333] transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 min-h-0">

              {/* ── Main ── */}
              <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* Loading */}
                  {!ready && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="relative w-10 h-10">
                        <div className="absolute inset-0 border border-[#1c1c1c] border-t-[#555] rounded-full animate-spin" />
                        <div className="absolute inset-[4px] border border-[#1c1c1c] border-b-[#333] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
                      </div>
                      <div className="text-center">
                        <p className="text-[12px] text-[#444] font-medium">Gerando código PIX</p>
                        <p className="text-[10px] text-[#222] mt-0.5">Aguarde um momento...</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Conteúdo */}
                  {ready && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-full flex flex-col items-center gap-4"
                    >
                      {/* Header */}
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <div className="relative w-10 h-10 rounded-full border border-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-[#4ade80]" strokeWidth={1.5} />
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#4ade80] rounded-full flex items-center justify-center"
                          >
                            <Check className="h-2.5 w-2.5 text-black" strokeWidth={3} />
                          </motion.div>
                        </div>
                        <div>
                          <h2 className="text-[16px] font-black text-white tracking-tight leading-tight">
                            Pedido realizado!
                          </h2>
                          <p className="text-[11px] text-[#444]">Finalize o pagamento via PIX</p>
                        </div>
                      </motion.div>

                      {/* QR + Code row */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-full flex items-center gap-5"
                      >
                        {/* QR */}
                        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                          <div className="bg-white p-3 rounded-xl">
                            <div ref={qrContainerRef} style={{ lineHeight: 0, fontSize: 0 }} />
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00c2ff] animate-pulse" />
                            <span className="text-[8px] font-black text-[#555] tracking-[0.15em] uppercase">pix</span>
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex-1 flex flex-col gap-3.5">
                          {/* Timer */}
                          <CountdownTimer startTime={startTime} />

                          {/* Código */}
                          <div>
                            <p className="text-[8px] text-[#282828] font-bold uppercase tracking-[0.15em] mb-1.5">
                              Pix Copia e Cola
                            </p>
                            <div className="flex border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#2a2a2a] transition-colors">
                              <div className="flex-1 bg-[#0a0a0a] px-3 py-2.5 font-mono text-[10px] text-[#555] overflow-hidden text-ellipsis whitespace-nowrap min-w-0 select-all">
                                {pixCode}
                              </div>
                              <button
                                onClick={handleCopy}
                                className={`flex-shrink-0 flex items-center justify-center w-10 transition-all duration-300
                                  ${copied ? 'bg-[#0f1a0f] text-[#4ade80] border-l border-[#1e3a1e]' : 'bg-white text-black hover:opacity-90 active:scale-95'}`}
                              >
                                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Passos */}
                          <div className="flex flex-col gap-0">
                            {[
                              'Abra o app do seu banco',
                              'Escolha Pix Copia e Cola',
                              'Cole o código e confirme',
                            ].map((s, i) => (
                              <div key={i} className="flex items-center gap-2 py-1.5">
                                <div className="w-5 h-5 rounded-full bg-[#0f0f0f] border border-[#1e1e1e] flex items-center justify-center flex-shrink-0">
                                  <span className="text-[9px] text-[#555] font-bold">{i + 1}</span>
                                </div>
                                <span className="text-[11px] text-[#444]">{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* Nota */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full flex items-start gap-2.5 bg-[#0a0a0a] border border-[#151515] rounded-xl px-4 py-3"
                      >
                        <Info className="h-3.5 w-3.5 text-[#2a2a2a] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                        <p className="text-[11px] text-[#333] leading-relaxed">
                          <span className="text-[#555] font-semibold">Pagamento instantâneo.</span>{' '}
                          Após confirmação você receberá um e-mail com o acesso ao produto.
                        </p>
                      </motion.div>

                      {/* Botão voltar */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        onClick={onClose}
                        className="w-full py-3 border border-[#1e1e1e] rounded-xl bg-transparent text-[#555] text-[12px] font-bold hover:border-[#444] hover:text-white hover:bg-[#0a0a0a] active:scale-[0.98] transition-all duration-300"
                      >
                        Voltar ao dashboard
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Sidebar ── */}
              <aside className="w-[200px] flex-shrink-0 border-l border-[#111] bg-[#060606] flex flex-col">
                {/* Resumo */}
                <div className="px-5 py-5 border-b border-[#111]">
                  <p className="text-[8px] text-[#222] font-bold uppercase tracking-[0.2em] mb-3">
                    Resumo
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-[#3a3a3a]">{itemName}</span>
                      <span className="text-[10px] text-[#555] font-semibold tabular-nums">
                        R$ {(total || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-[#3a3a3a]">Taxa</span>
                      <span className="text-[10px] text-[#4ade80] font-semibold">Grátis</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-[#3a3a3a]">Método</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-[#00c2ff]" />
                        <span className="text-[10px] text-[#555] font-semibold">Pix</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 mt-3 border-t border-[#141414]">
                    <span className="text-[11px] text-white font-bold">Total</span>
                    <span className="text-[16px] text-white font-black tracking-tight tabular-nums">
                      R$ {(total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Transação */}
                <div className="px-5 py-4 border-b border-[#111]">
                  <p className="text-[8px] text-[#222] font-bold uppercase tracking-[0.2em] mb-2">
                    Transação
                  </p>
                  <div className="bg-[#060606] border border-[#161616] rounded-lg px-2.5 py-2">
                    <p className="text-[8px] text-[#2e2e2e] font-mono break-all leading-relaxed select-all">
                      {txid}
                    </p>
                  </div>
                </div>

                {/* Detalhes */}
                <div className="px-5 py-4 flex-1">
                  <p className="text-[8px] text-[#222] font-bold uppercase tracking-[0.2em] mb-3">
                    Detalhes
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { k: 'Favorecido', v: 'Natan Lima' },
                      { k: 'Chave PIX',  v: 'natanpacheco@gmail.com' },
                      { k: 'Instituição', v: 'Banco Central' },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex flex-col gap-0.5">
                        <span className="text-[8px] text-[#2a2a2a] font-semibold uppercase tracking-wide">{k}</span>
                        <span className="text-[10px] text-[#444] font-medium overflow-hidden text-ellipsis whitespace-nowrap">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-[#111]">
                  <p className="text-[8px] text-[#1a1a1a] text-center">Marketplace · v2.0</p>
                </div>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}