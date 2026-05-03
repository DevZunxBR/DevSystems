import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders })
  }

  try {
    // Buscar a chave do Asaas do Vault
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    const { data: secretData, error: secretError } = await supabaseClient
      .from('secrets')
      .select('secret')
      .eq('name', 'asaas_api_key')
      .single()

    if (secretError || !secretData) {
      console.error('Erro ao buscar chave do Vault:', secretError)
      return new Response(JSON.stringify({ error: 'Chave ASAAS_API_KEY não encontrada no Vault' }), {
        status: 500,
        headers: corsHeaders,
      })
    }

    const ASAAS_API_KEY = secretData.secret
    const { action, ...data } = await req.json()

    // Criar cliente
    if (action === 'createCustomer') {
      const response = await fetch(`${ASAAS_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          cpfCnpj: data.document || '00000000000',
        }),
      })
      const result = await response.json()
      return new Response(JSON.stringify(result), { status: response.status, headers: corsHeaders })
    }

    // Criar pagamento
    if (action === 'createPayment') {
      const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify({
          customer: data.customerId,
          billingType: data.paymentMethod,
          value: Number(data.value),
          dueDate: new Date().toISOString().split('T')[0],
          description: data.description || `Pedido #${data.orderId}`,
          externalReference: String(data.orderId),
        }),
      })
      const result = await response.json()
      return new Response(JSON.stringify(result), { status: response.status, headers: corsHeaders })
    }

    // Buscar QR Code
    if (action === 'getPixQrCode') {
      const response = await fetch(`${ASAAS_BASE_URL}/payments/${data.paymentId}/pixQrCode`, {
        headers: { 'access_token': ASAAS_API_KEY },
      })
      const result = await response.json()
      return new Response(JSON.stringify(result), { status: response.status, headers: corsHeaders })
    }

    return new Response(JSON.stringify({ error: 'Ação não reconhecida' }), {
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