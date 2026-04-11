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
      width: 160,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).then((url) => {
      if (!qrContainerRef.current) return;
      qrContainerRef.current.innerHTML = '';
      const img = document.createElement('img');
      img.src = url;
      img.width = 160;
      img.height = 160;
      img.style.display = 'block';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-xs">M</span>
            </div>
            <span className="text-white font-bold tracking-tight text-sm">Marketplace</span>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5">
          {!ready ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-white rounded-full animate-spin" />
              <p className="text-xs text-[#555]">Gerando código PIX...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Ícone + título */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-base font-black text-white">Pedido realizado</h2>
                <p className="text-xs text-[#555]">Finalize o pagamento via PIX</p>
              </div>

              {/* Valor */}
              <div className="text-center">
                <p className="text-[10px] text-[#555]">Valor a pagar</p>
                <p className="text-2xl font-black text-white">R$ {(total || 0).toFixed(2)}</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-2 rounded-lg">
                  <div ref={qrContainerRef} className="w-40 h-40" />
                </div>
              </div>

              {/* Código PIX */}
              <div>
                <p className="text-[10px] text-[#555] mb-1">Código PIX</p>
                <div className="flex border border-[#1A1A1A] rounded-lg overflow-hidden">
                  <div className="flex-1 bg-[#0A0A0A] px-3 py-2 font-mono text-[10px] text-[#555] break-all max-h-20 overflow-y-auto">
                    {pixCode}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex-shrink-0 px-4 transition-all ${
                      copied
                        ? 'bg-green-500/10 text-green-500 border-l border-green-500/20'
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Passo a passo simplificado */}
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-3">
                <p className="text-[10px] font-semibold text-white mb-2">Como pagar</p>
                <div className="space-y-1.5">
                  {[
                    'Abra o app do seu banco',
                    'Escolha pagar via PIX',
                    'Escaneie o QR Code ou cole o código',
                    'Confirme o pagamento'
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[9px] text-[#555] font-bold">{i + 1}.</span>
                      <span className="text-[10px] text-[#555]">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão voltar */}
              <button
                onClick={onClose}
                className="w-full py-2.5 border border-[#1A1A1A] rounded-lg bg-transparent text-[#666] text-xs font-medium hover:border-[#333] hover:text-white transition-all"
              >
                Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}