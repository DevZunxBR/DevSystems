import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ startTime }) {
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

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining < 120;

  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-3 w-3 ${isLow ? 'text-[#ef4444]' : 'text-[#333]'}`} />
      <span className={`text-[11px] font-mono font-bold tabular-nums ${isLow ? 'text-[#ef4444]' : 'text-[#555]'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      <span className="text-[10px] text-[#2a2a2a]">restantes</span>
    </div>
  );
}