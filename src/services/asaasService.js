// src/services/asaasService.js
const FUNCTION_URL = '/api/asaas'; // Chama a API que você criou na Vercel

export const createCustomer = async (customer) => {
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createCustomer', ...customer }),
  });
  return response.json();
};

export const createPayment = async (data) => {
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createPayment', ...data }),
  });
  return response.json();
};

export const getPixQrCode = async (paymentId) => {
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getPixQrCode', paymentId }),
  });
  return response.json();
};