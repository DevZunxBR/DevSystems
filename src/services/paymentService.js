// src/services/paymentService.js
const API_BASE = '/api/asaas';

export const createCustomer = async (customer) => {
  try {
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(customer),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar cliente');
    }
    
    return data;
  } catch (error) {
    console.error('createCustomer error:', error);
    throw error;
  }
};

export const createPayment = async ({ customerId, value, paymentMethod, orderId, description }) => {
  try {
    const response = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        customerId, 
        value, 
        paymentMethod, 
        orderId, 
        description 
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar pagamento');
    }
    
    return data;
  } catch (error) {
    console.error('createPayment error:', error);
    throw error;
  }
};

export const getPixQrCode = async (paymentId) => {
  try {
    const response = await fetch(`${API_BASE}/pix-qrcode/${paymentId}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao buscar QR Code');
    }
    
    return data;
  } catch (error) {
    console.error('getPixQrCode error:', error);
    throw error;
  }
};