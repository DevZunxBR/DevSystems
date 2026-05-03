// api/asaas.js - Esta é uma API Serverless da Vercel
const ASAAS_API_KEY = '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojk3NzZhYWZjLTI4MDctNDUwYy05NjU4LTAzMGYwMTAyYmY3NDo6JGFhY2hfZTc4NjEwNDYtMzFlMS00ZTlhLTk0ZDQtODYzOWI3YWEyZTk5';
const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3';

export default async function handler(req, res) {
  // Configurar CORS para a resposta
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

    // Criar cliente
    if (action === 'createCustomer') {
      const response = await fetch(`${ASAAS_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY },
        body: JSON.stringify({ name: data.name, email: data.email, cpfCnpj: data.document || '00000000000' }),
      });
      const result = await response.json();
      return res.status(response.status).json(result);
    }

    // Criar pagamento
    if (action === 'createPayment') {
      const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY },
        body: JSON.stringify({
          customer: data.customerId,
          billingType: data.paymentMethod,
          value: data.value,
          dueDate: new Date().toISOString().split('T')[0],
          description: data.description || `Pedido #${data.orderId}`,
          externalReference: String(data.orderId),
        }),
      });
      const result = await response.json();
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

    return res.status(400).json({ error: 'Ação inválida' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}