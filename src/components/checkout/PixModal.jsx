import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Shield, Lock, ChevronRight, Smartphone, RefreshCw, CheckCircle2, AlertCircle, ArrowLeft, Star, Zap, Eye, EyeOff } from 'lucide-react';
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

export default function PixModal({ open, onClose, total, cartItems = [] }) {
  const [ready, setReady]       = useState(false);
  const [pixCode, setPixCode]   = useState('');
  const [txid, setTxid]         = useState('');
  const [copied, setCopied]     = useState(false);
  const [showCode, setShowCode] = useState(false);
  const qrContainerRef          = useRef(null);
  const qrRendered              = useRef(false);

  useEffect(() => {
    if (!open) {
      setReady(false); setCopied(false); setShowCode(false);
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
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, [open, total]);

  useEffect(() => {
    if (!ready || !qrContainerRef.current || !pixCode || qrRendered.current) return;
    qrRendered.current = true;
    QRCode.toDataURL(pixCode, { width: 200, margin: 2, color: { dark: '#000', light: '#fff' } })
      .then((url) => {
        if (!qrContainerRef.current) return;
        qrContainerRef.current.innerHTML = '';
        const img = document.createElement('img');
        img.src = url; img.width = 200; img.height = 200;
        img.style.display = 'block'; img.style.borderRadius = '0';
        qrContainerRef.current.appendChild(img);
      }).catch(console.error);
  }, [ready, pixCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código PIX copiado com sucesso!');
    setTimeout(() => setCopied(false), 4000);
  };

  if (!open) return null;

  const itemName = cartItems?.[0]?.name ?? 'Asset digital';
  const maskedCode = pixCode ? pixCode.substring(0, 24) + '••••••••••••••••••••••••' : '';

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col overflow-hidden">

      {/* ── TOPBAR ── */}
      <div className="flex-shrink-0 bg-[#080808] border-b border-[#161616]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-black font-black text-[11px] tracking-tighter">M</span>
            </div>
            <div>
              <span className="text-white font-black text-[14px] tracking-tight">Marketplace</span>
              <span className="text-[#2e2e2e] text-[11px] font-medium ml-2">· Checkout</span>
            </div>
          </div>

          {/* Center breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-[11px]">
            <span className="text-[#333]">Carrinho</span>
            <ChevronRight className="h-3 w-3 text-[#222]" />
            <span className="text-[#333]">Identificação</span>
            <ChevronRight className="h-3 w-3 text-[#222]" />
            <span className="text-white font-semibold">Pagamento</span>
            <ChevronRight className="h-3 w-3 text-[#222]" />
            <span className="text-[#333]">Confirmação</span>
          </div>

          {/* Security badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-[#2a2a2a]" />
              <span className="text-[10px] text-[#2a2a2a] font-medium">256-bit SSL</span>
            </div>
            <div className="w-px h-4 bg-[#1a1a1a]" />
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-[#2a2a2a]" />
              <span className="text-[10px] text-[#2a2a2a] font-medium">Banco Central</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="flex-shrink-0 h-[2px] bg-[#111]">
        <motion.div
          initial={{ width: '60%' }}
          animate={{ width: ready ? '85%' : '65%' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#1a1a1a] via-white to-[#1a1a1a]"
        />
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">

          <AnimatePresence mode="wait">
            {/* Loading */}
            {!ready && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-2 border-[#1a1a1a] border-t-[#555] rounded-full animate-spin" />
                  <div className="absolute inset-[6px] border-2 border-[#1a1a1a] border-b-[#333] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.3s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-[#2a2a2a]" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-center space-y-1.5">
                  <p className="text-[15px] text-[#555] font-semibold">Preparando seu pagamento</p>
                  <p className="text-[12px] text-[#252525]">Gerando código PIX com criptografia...</p>
                </div>
                <div className="flex items-center gap-6 mt-2">
                  {['Dados criptografados', 'Conexão segura', 'Banco Central'].map((label) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#252525] animate-pulse" />
                      <span className="text-[10px] text-[#252525]">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Ready */}
            {ready && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col lg:flex-row gap-8 items-start"
              >

                {/* ── LEFT ── */}
                <div className="flex-1 min-w-0 space-y-5">

                  {/* Status banner */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="flex items-center gap-4 bg-[#0d1a0d] border border-[#1a3a1a] rounded-2xl px-5 py-4"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl border border-[#2a4a2a] bg-[#0a1a0a] flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-[#4ade80]" strokeWidth={1.5} />
                      </div>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#4ade80] rounded-full flex items-center justify-center"
                      >
                        <Check className="h-3 w-3 text-black" strokeWidth={3} />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-black text-white tracking-tight">Pedido gerado com sucesso!</p>
                      <p className="text-[12px] text-[#3a5a3a] mt-0.5">Código PIX criado e pronto para pagamento · ID: <span className="font-mono text-[#2a4a2a]">{txid.substring(0, 12)}...</span></p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 bg-[#0a1a0a] border border-[#1a3a1a] rounded-full px-3 py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                      <span className="text-[10px] text-[#4ade80] font-bold">Aguardando pagamento</span>
                    </div>
                  </motion.div>

                  {/* Main payment card */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#080808] border border-[#161616] rounded-2xl overflow-hidden"
                  >
                    {/* Card header */}
                    <div className="px-6 py-4 border-b border-[#111] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#0f0f0f] border border-[#1e1e1e] flex items-center justify-center">
                          <Smartphone className="h-4 w-4 text-[#444]" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-white">Pix Copia e Cola</p>
                          <p className="text-[10px] text-[#333]">Aprovação instantânea • 24/7</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full px-3 py-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00c2ff] animate-pulse" />
                        <span className="text-[9px] font-bold text-[#00c2ff] tracking-wide uppercase">Pix</span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
                      {/* QR Code */}
                      <div className="flex-shrink-0 flex flex-col items-center gap-3">
                        <div className="relative">
                          <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.04)]">
                            <div ref={qrContainerRef} style={{ lineHeight: 0, fontSize: 0 }} />
                          </div>
                          {/* Corner accents */}
                          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-[#333] rounded-tl-lg" />
                          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-[#333] rounded-tr-lg" />
                          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-[#333] rounded-bl-lg" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-[#333] rounded-br-lg" />
                        </div>
                        <p className="text-[10px] text-[#333] text-center">Escaneie com o app do banco</p>
                      </div>

                      {/* Right side */}
                      <div className="flex-1 w-full flex flex-col gap-5">
                        {/* Divider with OR */}
                        <div className="hidden md:flex items-center gap-3">
                          <div className="flex-1 h-px bg-[#141414]" />
                          <span className="text-[10px] text-[#252525] font-semibold uppercase tracking-widest">ou use o código</span>
                          <div className="flex-1 h-px bg-[#141414]" />
                        </div>

                        {/* Code field */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] text-[#2a2a2a] font-bold uppercase tracking-[0.15em]">Código Pix</p>
                            <button
                              onClick={() => setShowCode(!showCode)}
                              className="flex items-center gap-1 text-[10px] text-[#333] hover:text-[#666] transition-colors"
                            >
                              {showCode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              {showCode ? 'Ocultar' : 'Mostrar'}
                            </button>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="bg-[#060606] border border-[#1a1a1a] rounded-xl px-4 py-3 font-mono text-[11px] text-[#3a3a3a] overflow-hidden text-ellipsis whitespace-nowrap select-all min-h-[44px] flex items-center">
                              {showCode ? pixCode : maskedCode}
                            </div>
                            <button
                              onClick={handleCopy}
                              className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-[13px] transition-all duration-300 active:scale-[0.98]
                                ${copied
                                  ? 'bg-[#0d1f0d] text-[#4ade80] border border-[#1e4a1e]'
                                  : 'bg-white text-black hover:bg-[#f2f2f2] shadow-[0_2px_16px_rgba(255,255,255,0.06)]'
                                }`}
                            >
                              {copied
                                ? <><Check className="h-4 w-4" /><span>Código copiado!</span></>
                                : <><Copy className="h-4 w-4" /><span>Copiar código Pix</span></>
                              }
                            </button>
                          </div>
                        </div>

                        {/* Steps */}
                        <div className="space-y-1">
                          <p className="text-[10px] text-[#2a2a2a] font-bold uppercase tracking-[0.15em] mb-3">Como pagar</p>
                          {[
                            { icon: Smartphone,    text: 'Abra o aplicativo do seu banco' },
                            { icon: Copy,          text: 'Acesse Pix → Pagar → Copia e Cola' },
                            { icon: CheckCircle2,  text: 'Cole o código, confirme o valor e pague' },
                          ].map(({ icon: Icon, text }, i) => (
                            <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[#0a0a0a] transition-colors group">
                              <div className="w-7 h-7 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center flex-shrink-0 group-hover:border-[#282828] transition-colors">
                                <span className="text-[10px] text-[#444] font-black">{i + 1}</span>
                              </div>
                              <div className="flex-1">
                                <span className="text-[12px] text-[#3a3a3a] group-hover:text-[#555] transition-colors">{text}</span>
                              </div>
                              <Icon className="h-3.5 w-3.5 text-[#1e1e1e] flex-shrink-0" strokeWidth={1.5} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Trust badges */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  >
                    {[
                      { icon: Shield,        label: 'Pagamento Seguro',     sub: 'Criptografia SSL' },
                      { icon: Zap,           label: 'Aprovação Instantânea', sub: 'Menos de 10 seg' },
                      { icon: RefreshCw,     label: 'Disponível 24/7',      sub: 'Qualquer horário' },
                      { icon: Star,          label: 'Banco Central',        sub: 'Regulamentado' },
                    ].map(({ icon: Icon, label, sub }) => (
                      <div key={label} className="flex items-center gap-2.5 bg-[#080808] border border-[#131313] rounded-xl p-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                          <Icon className="h-3.5 w-3.5 text-[#333]" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[10px] text-[#444] font-semibold leading-none mb-0.5">{label}</p>
                          <p className="text-[9px] text-[#252525]">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Alert info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-start gap-3 bg-[#0a0f0a] border border-[#141f14] rounded-xl px-5 py-4"
                  >
                    <AlertCircle className="h-4 w-4 text-[#2a3a2a] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <p className="text-[11px] text-[#2e3e2e] leading-relaxed">
                      <span className="text-[#3a5a3a] font-semibold">Pagamento instantâneo via Banco Central.</span>{' '}
                      Ao confirmar o pagamento no seu banco, o acesso ao produto é liberado automaticamente e você receberá um e-mail de confirmação.
                    </p>
                  </motion.div>

                  {/* Back button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={onClose}
                    className="flex items-center gap-2 text-[12px] text-[#2a2a2a] hover:text-[#555] transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Voltar ao dashboard
                  </motion.button>
                </div>

                {/* ── RIGHT: Order Summary ── */}
                <motion.aside
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full lg:w-[320px] flex-shrink-0 space-y-4"
                >
                  {/* Order card */}
                  <div className="bg-[#080808] border border-[#161616] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#111]">
                      <p className="text-[11px] text-white font-bold">Resumo do pedido</p>
                    </div>

                    {/* Item */}
                    <div className="px-5 py-4 border-b border-[#0f0f0f]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                          <Zap className="h-4 w-4 text-[#333]" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-white font-semibold truncate">{itemName}</p>
                          <p className="text-[10px] text-[#333]">Licença digital · Acesso imediato</p>
                        </div>
                        <p className="text-[12px] text-white font-bold flex-shrink-0 tabular-nums">
                          R$ {(total || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="px-5 py-4 space-y-2.5 border-b border-[#0f0f0f]">
                      <div className="flex justify-between">
                        <span className="text-[11px] text-[#333]">Subtotal</span>
                        <span className="text-[11px] text-[#555] tabular-nums">R$ {(total || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[11px] text-[#333]">Taxa de processamento</span>
                        <span className="text-[11px] text-[#4ade80] font-semibold">Grátis</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[11px] text-[#333]">Método de pagamento</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00c2ff]" />
                          <span className="text-[11px] text-[#555] font-semibold">Pix</span>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="px-5 py-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-white font-bold">Total a pagar</span>
                        <span className="text-[22px] text-white font-black tracking-tight tabular-nums">
                          R$ {(total || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction details */}
                  <div className="bg-[#080808] border border-[#161616] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#111]">
                      <p className="text-[11px] text-white font-bold">Detalhes da transação</p>
                    </div>
                    <div className="px-5 py-4 space-y-3.5">
                      {[
                        { k: 'Favorecido',    v: 'Natan da Rocha Lima' },
                        { k: 'Chave PIX',     v: 'natanpacheco@gmail.com' },
                        { k: 'Instituição',   v: 'Banco Central do Brasil' },
                        { k: 'Tipo',          v: 'E-mail' },
                      ].map(({ k, v }) => (
                        <div key={k} className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-[#222] font-bold uppercase tracking-widest">{k}</span>
                          <span className="text-[11px] text-[#444] font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div className="bg-[#080808] border border-[#161616] rounded-2xl px-5 py-4">
                    <p className="text-[9px] text-[#222] font-bold uppercase tracking-widest mb-2">ID da transação</p>
                    <div className="bg-[#060606] border border-[#141414] rounded-xl px-3.5 py-2.5">
                      <p className="text-[9px] text-[#2a2a2a] font-mono break-all leading-relaxed select-all">{txid}</p>
                    </div>
                  </div>

                  {/* Security note */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Lock className="h-3 w-3 text-[#1e1e1e]" />
                    <p className="text-[10px] text-[#1e1e1e]">Checkout protegido com criptografia de ponta a ponta</p>
                  </div>
                </motion.aside>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="flex-shrink-0 border-t border-[#111] bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6 h-10 flex items-center justify-between">
          <p className="text-[10px] text-[#1a1a1a]">© 2025 Marketplace. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            {['Termos de uso', 'Privacidade', 'Suporte'].map((l) => (
              <span key={l} className="text-[10px] text-[#1a1a1a] cursor-pointer hover:text-[#333] transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}