import { NextResponse } from 'next/server';
import { asaasConfig } from '@/config/asaas';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;
    
    // Roteamento manual baseado no campo 'action'
    if (action === 'createCustomer') {
      const response = await fetch(`${asaasConfig.baseURL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasConfig.apiKey,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return NextResponse.json(result);
    }
    
    if (action === 'createPayment') {
      const response = await fetch(`${asaasConfig.baseURL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasConfig.apiKey,
        },
        body: JSON.stringify({
          customer: data.customerId,
          billingType: data.paymentMethod,
          value: data.value,
          dueDate: new Date().toISOString().split('T')[0],
          description: data.description || `Pedido #${data.orderId}`,
          externalReference: data.orderId,
        }),
      });
      const result = await response.json();
      return NextResponse.json(result);
    }
    
    if (action === 'getPixQrCode') {
      const response = await fetch(`${asaasConfig.baseURL}/payments/${data.paymentId}/pixQrCode`, {
        headers: {
          'access_token': asaasConfig.apiKey,
        },
      });
      const result = await response.json();
      return NextResponse.json(result);
    }
    
    return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}