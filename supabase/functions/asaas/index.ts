import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY') || ''
const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3'

serve(async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

  try {
    const { action, ...data } = await req.json()

    // Criar cliente
    if (action === 'createCustomer') {
      const res = await fetch(`${ASAAS_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          cpfCnpj: data.cpfCnpj || '00000000000',
        }),
      })
      const result = await res.json()
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    // Criar cobrança PIX ou CARTÃO
    if (action === 'createPayment') {
      const res = await fetch(`${ASAAS_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY },
        body: JSON.stringify({
          customer: data.customerId,
          billingType: data.method,
          value: data.value,
          dueDate: new Date().toISOString().split('T')[0],
          description: `Pedido #${data.orderId}`,
        }),
      })
      const result = await res.json()
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    // Buscar QR Code PIX
    if (action === 'getPixQrCode') {
      const res = await fetch(`${ASAAS_BASE_URL}/payments/${data.paymentId}/pixQrCode`, {
        headers: { 'access_token': ASAAS_API_KEY },
      })
      const result = await res.json()
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    return new Response(JSON.stringify({ error: 'Ação inválida' }), { status: 400 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})