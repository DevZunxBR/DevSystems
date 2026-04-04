import { useState, useEffect } from 'react';

export function useCurrency() {
  const [currency, setCurrencyState] = useState(
    () => localStorage.getItem('marketplace_currency') || 'USD'
  );

  useEffect(() => {
    const handler = () => {
      setCurrencyState(localStorage.getItem('marketplace_currency') || 'USD');
    };
    window.addEventListener('currencyChange', handler);
    return () => window.removeEventListener('currencyChange', handler);
  }, []);

  const setCurrency = (c) => {
    localStorage.setItem('marketplace_currency', c);
    setCurrencyState(c);
    window.dispatchEvent(new Event('currencyChange'));
  };

  return [currency, setCurrency];
}