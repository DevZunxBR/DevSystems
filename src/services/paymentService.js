// src/services/paymentService.js
// Este arquivo agora chama as SUAS APIs, não o Asaas diretamente

export const createCustomer = async (customer) => {
  const response = await fetch('/api/asaas/customers', {
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
  const response = await fetch('/api/asaas/payments', {
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
  const response = await fetch(`/api/asaas/pix-qrcode/${paymentId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar QR Code');
  }
  
  return response.json();
};