import { NextResponse } from 'next/server';
import { asaasConfig } from '@/config/asaas';

export async function POST(request) {
  try {
    const customerData = await request.json();

    const response = await fetch(`${asaasConfig.baseURL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasConfig.apiKey,
      },
      body: JSON.stringify(customerData),
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