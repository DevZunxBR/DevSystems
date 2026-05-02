// src/services/asaasService.js
const ASAAS_API_KEY = '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojk3NzZhYWZjLTI4MDctNDUwYy05NjU4LTAzMGYwMTAyYmY3NDo6JGFhY2hfZTc4NjEwNDYtMzFlMS00ZTlhLTk0ZDQtODYzOWI3YWEyZTk5'
const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3'

export const createPixPayment = async (customer, amount, orderId) => {
  try {
    // 1. Criar cliente no Asaas
    const customerResponse = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.document || '00000000000',
      }),
    })
    const asaasCustomer = await customerResponse.json()

    // 2. Criar cobrança PIX
    const paymentResponse = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify({
        customer: asaasCustomer.id,
        billingType: 'PIX',
        value: amount,
        dueDate: new Date().toISOString().split('T')[0],
        description: `Pedido #${orderId}`,
      }),
    })
    const payment = await paymentResponse.json()

    // 3. Buscar QR Code
    const qrResponse = await fetch(`${ASAAS_BASE_URL}/payments/${payment.id}/pixQrCode`, {
      headers: { 'access_token': ASAAS_API_KEY },
    })
    const qrData = await qrResponse.json()

    return {
      qrCode: qrData.encodedImage,
      payload: qrData.payload,
      paymentId: payment.id,
      status: payment.status
    }
  } catch (error) {
    console.error('Erro ao gerar PIX:', error)
    throw error
  }
}