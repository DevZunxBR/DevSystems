import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Shield, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
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
  const [ready, setReady]     = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [txid, setTxid]       = useState('');
  const [copied, setCopied]   = useState(false);
  const qrContainerRef        = useRef(null);
  const qrRendered            = useRef(false);

  // reset + gera código
  useEffect(() => {
    if (!open) {
      setReady(false);
      setCopied(false);
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
    const t = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(t);
  }, [open, total]);

  // renderiza QR — usa toDataURL e injeta uma única <img> quadrada
  useEffect(() => {
    if (!ready || !qrContainerRef.current || !pixCode || qrRendered.current) return;
    qrRendered.current = true;
    QRCode.toDataURL(pixCode, {
      width: 180,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).then((url) => {
      if (!qrContainerRef.current) return;
      // limpa e injeta somente 1 img, sem arredondamento
      qrContainerRef.current.innerHTML = '';
      const img = document.createElement('img');
      img.src = url;
      img.width = 180;
      img.height = 180;
      img.style.display = 'block';
      img.style.borderRadius = '0';
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

  const itemName = cartItems?.[0]?.name ?? 'Asset digital';

  return (
    <div className="fixed inset-0 z-50 bg-[#060606] flex flex-col">

      {/* ── Topbar ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-[#141414] bg-[#080808]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-[10px] tracking-tighter">M</span>
          </div>
          <span className="text-white font-bold text-[13px] tracking-tight">Marketplace</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0f0f0f] border border-[#1e1e1e] rounded-full px-3 py-1.5">
          <Shield className="h-2.5 w-2.5 text-[#333]" />
          <span className="text-[10px] text-[#333] font-semibold">SSL · Banco Central</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Main ── */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 py-10">

          {/* Loading */}
          {!ready && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border border-[#1c1c1c] border-t-[#555] rounded-full animate-spin" />
              <p className="text-[12px] text-[#333]">Gerando código PIX...</p>
            </div>
          )}

          {/* Conteúdo */}
          {ready && (
            <div className="w-full max-w-[380px] flex flex-col items-center gap-5">

              {/* Ícone + título */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-[#2a2a2a] flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-[#666]" strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <h2 className="text-[18px] font-black text-white tracking-tight mb-1">
                    Pedido realizado com sucesso
                  </h2>
                  <p className="text-[12px] text-[#444]">Estamos quase lá! Finalize o pagamento.</p>
                </div>
              </div>

              {/* QR Code — 1 img quadrada, sem border-radius */}
              <div style={{ background: '#fff', padding: '12px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div ref={qrContainerRef} style={{ lineHeight: 0, fontSize: 0 }} />
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00c2ff]" />
                  <span className="text-[9px] font-black text-[#777] tracking-widest uppercase">pix</span>
                </div>
              </div>

              {/* Campo código + botão copiar (só ícone) */}
              <div className="w-full flex border border-[#1e1e1e] rounded-xl overflow-hidden">
                <div className="flex-1 bg-[#0a0a0a] px-3.5 py-3 font-mono text-[11px] text-[#555] overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                  {pixCode}
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex-shrink-0 flex items-center justify-center w-12 transition-all
                    ${copied
                      ? 'bg-[#0f1a0f] text-[#4ade80] border-l border-[#1e3a1e]'
                      : 'bg-white text-black hover:opacity-90'
                    }`}
                >
                  {copied
                    ? <Check className="h-4 w-4" />
                    : <Copy className="h-4 w-4" />
                  }
                </button>
              </div>

              {/* Passo a passo */}
              <div className="w-full flex flex-col gap-2">
                {[
                  'Acesse o aplicativo do seu banco',
                  'Escolha pagar com Pix Copia e Cola',
                  'Copie e cole o código e confirme o pagamento',
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-[11px] text-[#444] font-bold">{i + 1}.</span>
                    <span className="text-[12px] text-[#3a3a3a]">{s}</span>
                  </div>
                ))}
              </div>

              {/* Nota informativa */}
              <div className="w-full flex items-start gap-2.5 bg-[#0a0a0a] border border-[#151515] rounded-lg px-3.5 py-3">
                <Info className="h-3.5 w-3.5 text-[#2a2a2a] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-[11px] text-[#333] leading-relaxed">
                  <span className="text-[#444] font-semibold">Este código tem validade de 15 minutos.</span>{' '}
                  Assim que realizar o pagamento, o pedido será aprovado e você receberá um e-mail de confirmação.
                </p>
              </div>

              {/* Botão voltar */}
              <button
                onClick={onClose}
                className="w-full py-3.5 border border-[#222] rounded-xl bg-transparent text-[#888] text-[13px] font-bold hover:border-[#444] hover:text-white transition-all"
              >
                Voltar ao dashboard
              </button>

            </div>
          )}
        </div>

        {/* ── Sidebar direita ── */}
        <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 border-l border-[#111] bg-[#080808]">

          {/* Resumo */}
          <div className="px-5 py-5 border-b border-[#111]">
            <p className="text-[9px] text-[#282828] font-bold uppercase tracking-widest mb-3">Resumo do pedido</p>
            <div className="flex justify-between items-baseline mb-2.5">
              <span className="text-[11px] text-[#333]">{itemName}</span>
              <span className="text-[11px] text-[#666] font-semibold">R$ {(total || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-baseline mb-2.5">
              <span className="text-[11px] text-[#333]">Forma de pagamento</span>
              <span className="text-[11px] text-[#666] font-semibold">Pix</span>
            </div>
            <div className="flex justify-between items-baseline pt-2.5 border-t border-[#141414]">
              <span className="text-[12px] text-white font-bold">Total</span>
              <span className="text-[16px] text-white font-black tracking-tight">
                R$ {(total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Código da transação */}
          <div className="px-5 py-5 border-b border-[#111]">
            <p className="text-[9px] text-[#282828] font-bold uppercase tracking-widest mb-2">Código da transação</p>
            <div className="bg-[#060606] border border-[#161616] rounded-lg px-3 py-2.5">
              <p className="text-[9px] text-[#2e2e2e] font-mono break-all leading-relaxed">{txid}</p>
            </div>
          </div>

          {/* Detalhes */}
          <div className="px-5 py-5">
            <p className="text-[9px] text-[#282828] font-bold uppercase tracking-widest mb-3">Detalhes</p>
            {[
              { k: 'Favorecido',  v: 'Natan Lima' },
              { k: 'Chave PIX',   v: 'natanpacheco@gmail.com' },
              { k: 'Instituição', v: 'Banco Central' },
            ].map(({ k, v }) => (
              <div key={k} className="flex justify-between items-baseline mb-2.5 last:mb-0">
                <span className="text-[11px] text-[#2e2e2e]">{k}</span>
                <span className="text-[11px] text-[#555] font-medium max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-right">{v}</span>
              </div>
            ))}
          </div>

        </aside>
      </div>
    </div>
  );
}