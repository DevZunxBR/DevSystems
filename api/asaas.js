// api/asaas.js
export default async function handler(req, res) {
  const ASAAS_API_KEY = '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojk3NzZhYWZjLTI4MDctNDUwYy05NjU4LTAzMGYwMTAyYmY3NDo6JGFhY2hfZTc4NjEwNDYtMzFlMS00ZTlhLTk0ZDQtODYzOWI3YWEyZTk5';
  const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3';

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, ...data } = req.body;
    console.log('Action:', action);
    console.log('Data recebida:', JSON.stringify(data, null, 2));

    // Criar cliente
    if (action === 'createCustomer') {
      const requestBody = {
        name: data.name,
        email: data.email,
        cpfCnpj: data.document || '00000000000',
      };
      
      console.log('Enviando para Asaas:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${ASAAS_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'access_token': ASAAS_API_KEY 
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('Resposta Asaas:', JSON.stringify(result, null, 2));

      return res.status(response.status).json(result);
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
      };

      console.log('Enviando pagamento:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'access_token': ASAAS_API_KEY 
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('Resposta pagamento:', JSON.stringify(result, null, 2));

      return res.status(response.status).json(result);
    }

    // Buscar QR Code
    if (action === 'getPixQrCode') {
      const response = await fetch(`${ASAAS_BASE_URL}/payments/${data.paymentId}/pixQrCode`, {
        headers: { 'access_token': ASAAS_API_KEY },
      });
      const result = await response.json();
      return res.status(response.status).json(result);
    }

    return res.status(400).json({ error: 'Ação inválida: ' + action });
  } catch (error) {
    console.error('Erro interno:', error);
    return res.status(500).json({ error: error.message });
  }
}