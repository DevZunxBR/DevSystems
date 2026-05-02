import axios from 'axios';
import { asaasConfig } from '@/config/asaas';

const api = axios.create({
  baseURL: asaasConfig.baseURL,
  headers: { access_token: asaasConfig.apiKey }
});

export const createCustomer = async (customer) => {
  try {
    const response = await api.post('/customers', {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      cpfCnpj: customer.document || '00000000000',
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cliente:', error.response?.data || error.message);
    throw error;
  }
};

export const createPayment = async ({ customerId, value, paymentMethod, orderId, description }) => {
  try {
    const paymentData = {
      customer: customerId,
      billingType: paymentMethod,
      value: value,
      dueDate: new Date().toISOString().split('T')[0],
      description: description || `Pedido #${orderId}`,
      externalReference: orderId,
    };
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cobrança:', error.response?.data || error.message);
    throw error;
  }
};

export const getPixQrCode = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}/pixQrCode`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter QR Code:', error.response?.data || error.message);
    throw error;
  }
};

export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar status:', error.response?.data || error.message);
    throw error;
  }
};

export const sendPixTransfer = async (pixKey, pixKeyType, amount, description, externalReference) => {
  try {
    const response = await api.post('/transfers', {
      value: amount,
      pixAddressKey: pixKey,
      pixAddressKeyType: pixKeyType,
      description: description,
      externalReference: externalReference
    });
    return response.data;
  } catch (error) {
    console.error('Erro na transferência PIX:', error.response?.data || error.message);
    throw error;
  }
};

export const handleWebhook = async (event, payment) => {
  if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
    console.log(`Pagamento recebido: ${payment.id} - Pedido: ${payment.externalReference}`);
    return { status: 'paid', paymentId: payment.id, orderId: payment.externalReference };
  }
  return { status: 'pending' };
};