// src/services/paymentService.js
// SOLUÇÃO: Usa um proxy CORS público (apenas para teste)

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'
const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3'
const ASAAS_API_KEY = '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojk3NzZhYWZjLTI4MDctNDUwYy05NjU4LTAzMGYwMTAyYmY3NDo6JGFhY2hfZTc4NjEwNDYtMzFlMS00ZTlhLTk0ZDQtODYzOWI3YWEyZTk5'

const fetchWithProxy = (url, options) => {
  // Se estiver em produção (Vercel), não usa proxy
  if (window.location.hostname !== 'localhost') {
    return fetch(url, options)
  }
  // Localmente, usa proxy
  return fetch(PROXY_URL + url, options)
}

export const createCustomer = async (customer) => {
  const response = await fetchWithProxy(`${ASAAS_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY,
    },
    body: JSON.stringify({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      cpfCnpj: customer.document || '00000000000',
    }),
  })
  return response.json()
}

export const createPayment = async ({ customerId, value, paymentMethod, orderId, description }) => {
  const response = await fetchWithProxy(`${ASAAS_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY,
    },
    body: JSON.stringify({
      customer: customerId,
      billingType: paymentMethod,
      value: value,
      dueDate: new Date().toISOString().split('T')[0],
      description: description || `Pedido #${orderId}`,
      externalReference: orderId,
    }),
  })
  return response.json()
}

export const getPixQrCode = async (paymentId) => {
  const response = await fetchWithProxy(`${ASAAS_BASE_URL}/payments/${paymentId}/pixQrCode`, {
    headers: { 'access_token': ASAAS_API_KEY },
  })
  return response.json()
}