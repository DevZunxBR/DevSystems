import { useState, useEffect, useRef } from 'react';
import { Copy, Check, CheckCircle, Info, X } from 'lucide-react';
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

  useEffect(() => {
    if (!ready || !qrContainerRef.current || !pixCode || qrRendered.current) return;
    qrRendered.current = true;
    QRCode.toDataURL(pixCode, {
      width: 180,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).then((url) => {
      if (!qrContainerRef.current) return;
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

      {/* Header simples - sem borda extra */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-[#060606]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-[10px] tracking-tighter">M</span>
          </div>
          <span className="text-white font-bold text-[13px] tracking-tight">Marketplace</span>
        </div>
        <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Main */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 py-6">
          {!ready ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <div className="w-8 h-8 border border-[#1c1c1c] border-t-[#555] rounded-full animate-spin" />
              <p className="text-[12px] text-[#333]">Gerando código PIX...</p>
            </div>
          ) : (
            <div className="w-full max-w-[400px] flex flex-col items-center gap-5">
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

              {/* QR Code */}
              <div className="bg-white p-3 rounded-xl">
                <div ref={qrContainerRef} className="w-[180px] h-[180px]" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00c2ff]" />
                <span className="text-[9px] font-black text-[#777] tracking-widest uppercase">pix</span>
              </div>

              {/* Campo código + botão copiar */}
              <div className="w-full">
                <p className="text-[10px] text-[#444] mb-2 ml-1">Código PIX (Copia e Cola)</p>
                <div className="flex border border-[#1e1e1e] rounded-xl overflow-hidden">
                  <div className="flex-1 bg-[#0a0a0a] px-3.5 py-3 font-mono text-[11px] text-[#555] break-all max-h-32 overflow-y-auto leading-relaxed">
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
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Passo a passo */}
              <div className="w-full">
                <p className="text-[10px] text-[#444] mb-2 ml-1">Como pagar</p>
                <div className="flex flex-col gap-2">
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
              </div>

              {/* Nota informativa */}
              <div className="w-full flex items-start gap-2.5 bg-[#0a0a0a] border border-[#151515] rounded-lg px-3.5 py-3">
                <Info className="h-3.5 w-3.5 text-[#2a2a2a] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-[11px] text-[#333] leading-relaxed">
                  <span className="text-[#444] font-semibold">Este código tem validade de 15 minutos.</span>{' '}
                  Assim que realizar o pagamento, o pedido será aprovado.
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

        {/* Sidebar direita */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-l border-[#111] bg-[#080808] overflow-y-auto">
          <div className="px-5 py-5 border-b border-[#111]">
            <p className="text-[9px] text-[#282828] font-bold uppercase tracking-widest mb-3">Resumo do pedido</p>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-[#333]">{itemName}</span>
                <span className="text-[11px] text-[#666] font-semibold">R$ {(total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-[#333]">Forma de pagamento</span>
                <span className="text-[11px] text-[#666] font-semibold">Pix</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#141414]">
                <span className="text-[12px] text-white font-bold">Total</span>
                <span className="text-[16px] text-white font-black">
                  R$ {(total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 py-5 border-b border-[#111]">
            <p className="text-[9px] text-[#282828] font-bold uppercase tracking-widest mb-2">Código da transação</p>
            <div className="bg-[#060606] border border-[#161616] rounded-lg px-3 py-2.5">
              <p className="text-[9px] text-[#2e2e2e] font-mono break-all leading-relaxed">{txid}</p>
            </div>
          </div>

          <div className="px-5 py-5">
            <p className="text-[9px] text-[#282828] font-bold uppercase tracking-widest mb-3">Detalhes</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[11px] text-[#2e2e2e]">Favorecido</span>
                <span className="text-[11px] text-[#555]">Natan Lima</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-[#2e2e2e]">Chave PIX</span>
                <span className="text-[11px] text-[#555] break-all text-right max-w-[130px]">natanpacheco@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-[#2e2e2e]">Instituição</span>
                <span className="text-[11px] text-[#555]">Banco Central</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}