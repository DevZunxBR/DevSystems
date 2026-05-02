// src/services/asaasService.js
const SUPABASE_URL = 'https://seu-projeto.supabase.co/functions/v1/asaas'

export const createCustomer = async (customer) => {
  const res = await fetch(SUPABASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createCustomer', ...customer }),
  })
  return res.json()
}

export const createPayment = async ({ customerId, method, value, orderId }) => {
  const res = await fetch(SUPABASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createPayment', customerId, method, value, orderId }),
  })
  return res.json()
}

export const getPixQrCode = async (paymentId) => {
  const res = await fetch(SUPABASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getPixQrCode', paymentId }),
  })
  return res.json()
}