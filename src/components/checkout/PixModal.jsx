import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Shield, CheckCircle, Info, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">M</span>
          </div>
          <span className="text-white font-bold text-sm tracking-tight">Marketplace</span>
        </div>
        <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body - Layout responsivo */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conteúdo principal - scrollável */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {!ready ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
              <p className="text-sm text-[#555]">Gerando código PIX...</p>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-6">
              {/* Título */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-7 w-7 text-green-500" />
                </div>
                <h2 className="text-xl font-black text-white">Pedido realizado com sucesso</h2>
                <p className="text-sm text-[#555]">Estamos quase lá! Finalize o pagamento.</p>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-2xl p-4 flex justify-center">
                <div ref={qrContainerRef} className="w-52 h-52" />
              </div>
              <div className="text-center">
                <span className="text-[10px] text-[#555] bg-[#0A0A0A] px-3 py-1 rounded-full border border-[#1A1A1A]">
                  PIX
                </span>
              </div>

              {/* Código PIX */}
              <div className="space-y-2">
                <label className="text-xs text-[#555]">Código PIX (Copia e Cola)</label>
                <div className="flex border border-[#1A1A1A] rounded-xl overflow-hidden">
                  <div className="flex-1 bg-[#0A0A0A] px-4 py-3 font-mono text-xs text-[#555] break-all max-h-24 overflow-y-auto">
                    {pixCode}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex-shrink-0 px-5 transition-all ${
                      copied
                        ? 'bg-green-500/10 text-green-500 border-l border-green-500/20'
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Passo a passo */}
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-white">Como pagar via PIX</p>
                <div className="space-y-2">
                  {[
                    'Acesse o aplicativo do seu banco',
                    'Escolha pagar com PIX Copia e Cola',
                    'Cole o código e confirme o pagamento'
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#111] border border-[#1A1A1A] flex items-center justify-center">
                        <span className="text-[10px] text-[#555] font-bold">{i + 1}</span>
                      </div>
                      <span className="text-sm text-[#666]">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nota informativa */}
              <div className="flex items-start gap-3 p-3 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl">
                <Info className="h-4 w-4 text-[#555] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#555] leading-relaxed">
                  <span className="text-white font-medium">Este código tem validade de 15 minutos.</span>{' '}
                  Após o pagamento, o pedido será aprovado em até 30 minutos em dias úteis.
                </p>
              </div>

              {/* Botão voltar */}
              <button
                onClick={onClose}
                className="w-full py-3 border border-[#1A1A1A] rounded-xl bg-transparent text-[#666] text-sm font-medium hover:border-[#333] hover:text-white transition-all"
              >
                Voltar
              </button>
            </div>
          )}
        </div>

        {/* Sidebar direita - Desktop */}
        <aside className="hidden lg:flex flex-col w-80 flex-shrink-0 border-l border-[#1A1A1A] bg-[#0A0A0A] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Resumo */}
            <div>
              <h3 className="text-xs font-semibold text-white mb-4">Resumo do pedido</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">{itemName}</span>
                  <span className="text-white">R$ {total?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">Forma de pagamento</span>
                  <span className="text-white">PIX</span>
                </div>
                <div className="border-t border-[#1A1A1A] pt-3 mt-2">
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-black text-lg">R$ {total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Código da transação */}
            <div>
              <h3 className="text-xs font-semibold text-white mb-2">Código da transação</h3>
              <div className="bg-[#050505] border border-[#1A1A1A] rounded-lg p-3">
                <p className="text-[10px] text-[#555] font-mono break-all">{txid}</p>
              </div>
            </div>

            {/* Detalhes */}
            <div>
              <h3 className="text-xs font-semibold text-white mb-3">Detalhes</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-[#555]">Favorecido</span>
                  <span className="text-xs text-white">Natan Lima</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#555]">Chave PIX</span>
                  <span className="text-xs text-white break-all text-right max-w-[150px]">natanpacheco@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#555]">Instituição</span>
                  <span className="text-xs text-white">Banco Central</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}