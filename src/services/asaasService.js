// src/services/asaasService.js
const SUPABASE_URL = 'https://mjzrhbfrnngewtgddbvu.supabase.co/functions/v1/asaas'

export const createCustomer = async (customer) => {
  console.log('createCustomer chamado:', customer)
  
  const response = await fetch(SUPABASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createCustomer', ...customer }),
  })
  
  const data = await response.json()
  console.log('Resposta createCustomer:', data)
  
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao criar cliente')
  }
  
  return data
}

export const createPayment = async ({ customerId, paymentMethod, value, orderId, description }) => {
  console.log('createPayment chamado:', { customerId, paymentMethod, value, orderId })
  
  const response = await fetch(SUPABASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'createPayment', 
      customerId, 
      paymentMethod, 
      value: Number(value), 
      orderId,
      description 
    }),
  })
  
  const data = await response.json()
  console.log('Resposta createPayment:', data)
  
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao criar pagamento')
  }
  
  return data
}

export const getPixQrCode = async (paymentId) => {
  console.log('getPixQrCode chamado:', paymentId)
  
  const response = await fetch(SUPABASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getPixQrCode', paymentId }),
  })
  
  const data = await response.json()
  console.log('Resposta getPixQrCode:', data)
  
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao buscar QR Code')
  }
  
  return data
}