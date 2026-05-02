// src/services/asaasService.js
// Esse arquivo agora chama as API Routes do Next.js, não o Asaas diretamente

const API_BASE = '/api/asaas';

export const createCustomer = async (customer) => {
  const response = await fetch(`${API_BASE}/customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar cliente');
  }
  
  return response.json();
};

export const createPayment = async ({ customerId, value, paymentMethod, orderId, description }) => {
  const response = await fetch(`${API_BASE}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, value, paymentMethod, orderId, description }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar pagamento');
  }
  
  return response.json();
};

export const getPixQrCode = async (paymentId) => {
  const response = await fetch(`${API_BASE}/pix-qrcode/${paymentId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar QR Code');
  }
  
  return response.json();
};

export const getPaymentStatus = async (paymentId) => {
  // Implementar similar se necessário
};

export const sendPixTransfer = async (pixKey, pixKeyType, amount, description, externalReference) => {
  // Implementar similar se necessário
};