// src/services/paymentService.js
const API_BASE = '/api/asaas';

export const createCustomer = async (customer) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createCustomer', ...customer }),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao criar cliente');
  }
  
  return response.json();
};

export const createPayment = async ({ customerId, value, paymentMethod, orderId, description }) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'createPayment',
      customerId, 
      value, 
      paymentMethod, 
      orderId, 
      description 
    }),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao criar pagamento');
  }
  
  return response.json();
};

export const getPixQrCode = async (paymentId) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getPixQrCode', paymentId }),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao buscar QR Code');
  }
  
  return response.json();
};