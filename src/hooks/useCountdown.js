import { useState, useEffect } from 'react';

export function useCountdown(targetDate) {
  const getTimeLeft = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return null;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, diff };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    if (!targetDate) return;
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return timeLeft;
}