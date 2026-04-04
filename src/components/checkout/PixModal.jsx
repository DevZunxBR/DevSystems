import { useState } from 'react';
import { Copy, Check, QrCode, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function PixModal({ open, onClose, pixCode, total, currency }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('PIX code copied!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-secondary/50 px-6 py-5 text-center border-b border-border">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-xs">PIX</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-foreground">Pay with PIX</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Scan the QR Code or copy the code below
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* QR Code placeholder */}
          <div className="mx-auto w-48 h-48 bg-white rounded-xl flex items-center justify-center">
            <QrCode className="h-32 w-32 text-black" />
          </div>

          {/* Total */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">Total: </span>
            <span className="text-xl font-black text-foreground">
              {currency === 'BRL' ? 'R$' : '$'}{total?.toFixed(2)}
            </span>
          </div>

          {/* Copy & Paste code */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Copia e Cola</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={pixCode}
                className="flex-1 h-10 px-3 bg-secondary border border-border rounded-lg text-xs text-foreground font-mono truncate"
              />
              <Button
                onClick={copyCode}
                className="bg-white text-black hover:bg-white/90 gap-2 flex-shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Waiting */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm bg-secondary rounded-lg p-3">
            <Clock className="h-4 w-4 animate-pulse" />
            <span>Awaiting payment confirmation...</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}