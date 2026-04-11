import { useState, useEffect, useRef } from 'react';
import { Copy, Check, CheckCircle, Shield, X, ArrowLeft, Zap } from 'lucide-react';
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

function useAutoScale(targetW, targetH, padding = 32) {
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

const MODAL_W = 860;
const MODAL_H = 540;

const stagger = (i) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] } });

export default function PixModal({ open, onClose, total, cartItems = [] }) {
  const [ready, setReady]     = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [txid, setTxid]       = useState('');
  const [copied, setCopied]   = useState(false);
  const qrContainerRef        = useRef(null);
  const qrRendered            = useRef(false);
  const scale                 = useAutoScale(MODAL_W, MODAL_H);

  useEffect(() => {
    if (!open) {
      setReady(false); setCopied(false);
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
    const t = setTimeout(() => setReady(true), 1600);
    return () => clearTimeout(t);
  }, [open, total]);

  useEffect(() => {
    if (!ready || !qrContainerRef.current || !pixCode || qrRendered.current) return;
    qrRendered.current = true;
    QRCode.toDataURL(pixCode, { width: 156, margin: 2, color: { dark: '#000', light: '#fff' } })
      .then((url) => {
        if (!qrContainerRef.current) return;
        qrContainerRef.current.innerHTML = '';
        const img = document.createElement('img');
        img.src = url; img.width = 156; img.height = 156;
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.88)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: MODAL_W, height: MODAL_H, transform: `scale(${scale})`, transformOrigin: 'center center' }}
            className="relative bg-[#070707] border border-[#161616] rounded-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── Topbar ── */}
            <div className="flex-shrink-0 flex items-center justify-between px-7 py-3.5 border-b border-[#111] bg-[#050505]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-black text-[10px] tracking-tighter">M</span>
                </div>
                <span className="text-white font-bold text-[13px] tracking-tight">Marketplace</span>
                <div className="w-px h-4 bg-[#1a1a1a]" />
                <span className="text-[11px] text-[#2e2e2e] font-medium">Checkout seguro</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 border border-[#1a1a1a] rounded-full px-3 py-1 bg-[#0a0a0a]">
                  <Shield className="h-2.5 w-2.5 text-[#2e2e2e]" />
                  <span className="text-[9px] text-[#2e2e2e] font-semibold tracking-wide">SSL · Banco Central</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] text-[#333] hover:text-[#aaa] hover:border-[#333] transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 min-h-0">

              {/* ── LEFT: Main ── */}
              <div className="flex-1 flex items-center justify-center px-10 overflow-hidden">
                <AnimatePresence mode="wait">

                  {/* Loading */}
                  {!ready && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center gap-5"
                    >
                      <div className="relative w-11 h-11">
                        <div className="absolute inset-0 border border-[#1c1c1c] border-t-[#444] rounded-full animate-spin" />
                        <div className="absolute inset-[5px] border border-[#1c1c1c] border-b-[#2a2a2a] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.4s' }} />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[13px] text-[#3a3a3a] font-semibold">Gerando código PIX</p>
                        <p className="text-[10px] text-[#222]">Conectando ao Banco Central...</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Ready */}
                  {ready && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-full flex flex-col gap-4"
                    >
                      {/* Status badge + title */}
                      <motion.div {...stagger(0)} className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-[#4ade80]" strokeWidth={1.5} />
                          </div>
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.35, type: 'spring', stiffness: 500, damping: 20 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-[#4ade80] rounded-full flex items-center justify-center"
                          >
                            <Check className="h-2.5 w-2.5 text-black" strokeWidth={3.5} />
                          </motion.span>
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-white tracking-tight leading-none mb-0.5">
                            Pedido confirmado
                          </p>
                          <p className="text-[11px] text-[#3a3a3a]">
                            Conclua o pagamento para liberar o acesso
                          </p>
                        </div>
                      </motion.div>

                      {/* Divider */}
                      <div className="w-full h-px bg-[#111]" />

                      {/* QR + instruções */}
                      <div className="flex items-start gap-6">
                        {/* QR */}
                        <motion.div {...stagger(1)} className="flex-shrink-0 flex flex-col items-center gap-2">
                          <div className="p-3 bg-white rounded-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                            <div ref={qrContainerRef} style={{ lineHeight: 0, fontSize: 0 }} />
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#1a1a1a] bg-[#0a0a0a]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00c2ff] animate-pulse" />
                            <span className="text-[8px] font-black text-[#555] tracking-[0.2em] uppercase">Pix</span>
                          </div>
                        </motion.div>

                        {/* Right column */}
                        <div className="flex-1 flex flex-col gap-3.5">
                          {/* Código */}
                          <motion.div {...stagger(2)}>
                            <p className="text-[8px] text-[#252525] font-bold uppercase tracking-[0.18em] mb-1.5">
                              Pix Copia e Cola
                            </p>
                            <div className="flex border border-[#1a1a1a] rounded-xl overflow-hidden hover:border-[#252525] transition-colors">
                              <div className="flex-1 bg-[#0a0a0a] px-3.5 py-2.5 font-mono text-[10px] text-[#4a4a4a] overflow-hidden text-ellipsis whitespace-nowrap select-all">
                                {pixCode}
                              </div>
                              <button
                                onClick={handleCopy}
                                className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-4 text-[11px] font-semibold transition-all duration-300
                                  ${copied
                                    ? 'bg-[#0d1f0d] text-[#4ade80] border-l border-[#1e3a1e]'
                                    : 'bg-white text-black hover:bg-[#f0f0f0] active:scale-95'
                                  }`}
                              >
                                {copied
                                  ? <><Check className="h-3.5 w-3.5" /><span>Copiado</span></>
                                  : <><Copy className="h-3.5 w-3.5" /><span>Copiar</span></>
                                }
                              </button>
                            </div>
                          </motion.div>

                          {/* Steps */}
                          <motion.div {...stagger(3)} className="flex flex-col gap-px">
                            <p className="text-[8px] text-[#252525] font-bold uppercase tracking-[0.18em] mb-2">
                              Como pagar
                            </p>
                            {[
                              { n: '1', text: 'Abra o app do seu banco' },
                              { n: '2', text: 'Selecione Pix → Copia e Cola' },
                              { n: '3', text: 'Cole o código e confirme o valor' },
                            ].map(({ n, text }) => (
                              <div key={n} className="flex items-center gap-2.5 py-1.5 group">
                                <div className="w-5 h-5 rounded-full border border-[#1e1e1e] bg-[#0a0a0a] flex items-center justify-center flex-shrink-0 group-hover:border-[#333] transition-colors">
                                  <span className="text-[9px] text-[#444] font-bold">{n}</span>
                                </div>
                                <span className="text-[11px] text-[#3a3a3a] group-hover:text-[#555] transition-colors">{text}</span>
                              </div>
                            ))}
                          </motion.div>

                          {/* Info strip */}
                          <motion.div {...stagger(4)} className="flex items-center gap-2.5 bg-[#0a0a0a] border border-[#141414] rounded-xl px-3.5 py-2.5">
                            <Zap className="h-3.5 w-3.5 text-[#222] flex-shrink-0" strokeWidth={1.5} />
                            <p className="text-[10px] text-[#2e2e2e] leading-relaxed">
                              Aprovação <span className="text-[#444] font-semibold">instantânea</span> após o pagamento. Acesso liberado por e-mail automaticamente.
                            </p>
                          </motion.div>
                        </div>
                      </div>

                      {/* Back btn */}
                      <motion.button
                        {...stagger(5)}
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full py-2.5 border border-[#161616] rounded-xl bg-transparent text-[#333] text-[11px] font-semibold hover:border-[#333] hover:text-[#888] hover:bg-[#0a0a0a] active:scale-[0.99] transition-all duration-300"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Voltar ao dashboard
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── RIGHT: Sidebar ── */}
              <aside className="w-[210px] flex-shrink-0 border-l border-[#0f0f0f] bg-[#050505] flex flex-col">

                {/* Order summary */}
                <div className="px-5 py-5 border-b border-[#0f0f0f]">
                  <p className="text-[8px] text-[#1e1e1e] font-bold uppercase tracking-[0.22em] mb-4">
                    Resumo do pedido
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-[#333] flex-1 mr-2 overflow-hidden text-ellipsis whitespace-nowrap">{itemName}</span>
                      <span className="text-[10px] text-[#555] font-semibold tabular-nums flex-shrink-0">R$ {(total || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-[#333]">Taxa</span>
                      <span className="text-[10px] text-[#4ade80] font-semibold">Grátis</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-[#333]">Método</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-[#00c2ff]" />
                        <span className="text-[10px] text-[#555] font-semibold">Pix</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3.5 mt-3.5 border-t border-[#111]">
                    <span className="text-[11px] text-white font-bold">Total</span>
                    <span className="text-[17px] text-white font-black tracking-tight tabular-nums">
                      R$ {(total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="px-5 py-4 border-b border-[#0f0f0f]">
                  <p className="text-[8px] text-[#1e1e1e] font-bold uppercase tracking-[0.22em] mb-2.5">
                    ID da transação
                  </p>
                  <div className="bg-[#070707] border border-[#141414] rounded-lg px-3 py-2">
                    <p className="text-[8px] text-[#252525] font-mono break-all leading-relaxed select-all">
                      {txid}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="px-5 py-4 flex-1">
                  <p className="text-[8px] text-[#1e1e1e] font-bold uppercase tracking-[0.22em] mb-4">
                    Detalhes
                  </p>
                  <div className="space-y-3.5">
                    {[
                      { k: 'Favorecido',  v: 'Natan Lima' },
                      { k: 'Chave PIX',   v: 'natanpacheco@...' },
                      { k: 'Instituição', v: 'Banco Central' },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex flex-col gap-0.5">
                        <span className="text-[8px] text-[#1e1e1e] font-bold uppercase tracking-wider">{k}</span>
                        <span className="text-[10px] text-[#3a3a3a] font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-[#0f0f0f]">
                  <div className="flex items-center justify-center gap-1.5">
                    <Shield className="h-2.5 w-2.5 text-[#1a1a1a]" />
                    <p className="text-[8px] text-[#1a1a1a] font-medium">Checkout 100% seguro</p>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}