import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const asaasConfig = {
  baseURL: 'https://sandbox.asaas.com/api/v3',
  apiKey: Deno.env.get('sb_publishable_pFuK7qtATFFlEEECALCIPQ_lLWsNDy5') || '',
}

serve(async (req) => {
  const { action, ...data } = await req.json()
  
  if (action === 'createCustomer') {
    const response = await fetch(`${asaasConfig.baseURL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasConfig.apiKey,
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()
    return new Response(JSON.stringify(result), { status: 200 })
  }
  
  // ... outros actions
  
  return new Response(JSON.stringify({ error: 'Ação não reconhecida' }), { status: 400 })
})