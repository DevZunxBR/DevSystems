// src/services/asaasService.js
// ATENÇÃO: Em produção, use o caminho completo da Vercel
const isDev = window.location.hostname === 'localhost';
const API_URL = isDev ? '/api/asaas' : 'https://devassetsstore.vercel.app/api/asaas';

export const createCustomer = async (customer) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createCustomer', ...customer }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar cliente');
  }
  
  return response.json();
};

export const createPayment = async (data) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createPayment', ...data }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar pagamento');
  }
  
  return response.json();
};

export const getPixQrCode = async (paymentId) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getPixQrCode', paymentId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar QR Code');
  }
  
  return response.json();
};