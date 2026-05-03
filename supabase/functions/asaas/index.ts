import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ASAAS_API_KEY = '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojk3NzZhYWZjLTI4MDctNDUwYy05NjU4LTAzMGYwMTAyYmY3NDo6JGFhY2hfZTc4NjEwNDYtMzFlMS00ZTlhLTk0ZDQtODYzOWI3YWEyZTk5'
const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3'

serve(async (req) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  // Resposta para preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers })
  }

  try {
    const body = await req.json()
    const { action } = body

    // Criar cliente
    if (action === 'createCustomer') {
      const res = await fetch(`${ASAAS_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          cpfCnpj: body.document || '00000000000',
        }),
      })
      const data = await res.json()
      return new Response(JSON.stringify(data), { status: res.status, headers })
    }

    // Criar pagamento
    if (action === 'createPayment') {
      const res = await fetch(`${ASAAS_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify({
          customer: body.customerId,
          billingType: body.paymentMethod,
          value: body.value,
          dueDate: new Date().toISOString().split('T')[0],
          description: body.description || `Pedido #${body.orderId}`,
        }),
      })
      const data = await res.json()
      return new Response(JSON.stringify(data), { status: res.status, headers })
    }

    // Buscar QR Code
    if (action === 'getPixQrCode') {
      const res = await fetch(`${ASAAS_BASE_URL}/payments/${body.paymentId}/pixQrCode`, {
        headers: { 'access_token': ASAAS_API_KEY },
      })
      const data = await res.json()
      return new Response(JSON.stringify(data), { status: res.status, headers })
    }

    return new Response(JSON.stringify({ error: 'Ação inválida' }), { status: 400, headers })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers })
  }
})