import { NextResponse } from 'next/server';
import { asaasConfig } from '@/config/asaas';

export async function POST(request) {
  try {
    const paymentData = await request.json();

    const response = await fetch(`${asaasConfig.baseURL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasConfig.apiKey,
      },
      body: JSON.stringify({
        customer: paymentData.customerId,
        billingType: paymentData.paymentMethod,
        value: paymentData.value,
        dueDate: new Date().toISOString().split('T')[0],
        description: paymentData.description || `Pedido #${paymentData.orderId}`,
        externalReference: paymentData.orderId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.errors?.[0]?.description || 'Erro Asaas' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}