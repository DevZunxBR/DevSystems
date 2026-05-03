import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY') || ''
const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3'

// Headers CORS corretos
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  // Handle preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      status: 200,
      headers: corsHeaders 
    })
  }

  try {
    const { action, ...data } = await req.json()
    console.log('Action:', action, 'Data:', data)

    // Criar cliente
    if (action === 'createCustomer') {
      const requestBody = {
        name: data.name,
        email: data.email,
        cpfCnpj: data.document || '00000000000',
      }
      
      if (data.phone) requestBody.phone = data.phone

      const response = await fetch(`${ASAAS_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log('Resposta Asaas cliente:', result)

      return new Response(JSON.stringify(result), {
        status: response.status,
        headers: corsHeaders,
      })
    }

    // Criar pagamento
    if (action === 'createPayment') {
      const requestBody = {
        customer: data.customerId,
        billingType: data.paymentMethod,
        value: Number(data.value),
        dueDate: new Date().toISOString().split('T')[0],
        description: data.description || `Pedido #${data.orderId}`,
        externalReference: String(data.orderId),
      }

      console.log('Enviando pagamento Asaas:', requestBody)

      const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log('Resposta Asaas pagamento:', result)

      return new Response(JSON.stringify(result), {
        status: response.status,
        headers: corsHeaders,
      })
    }

    // Buscar QR Code
    if (action === 'getPixQrCode') {
      const response = await fetch(`${ASAAS_BASE_URL}/payments/${data.paymentId}/pixQrCode`, {
        headers: {
          'access_token': ASAAS_API_KEY,
        },
      })

      const result = await response.json()
      console.log('Resposta Asaas QR Code:', result)

      return new Response(JSON.stringify(result), {
        status: response.status,
        headers: corsHeaders,
      })
    }

    return new Response(JSON.stringify({ error: 'Ação não reconhecida: ' + action }), {
      status: 400,
      headers: corsHeaders,
    })

  } catch (error) {
    console.error('Erro:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})