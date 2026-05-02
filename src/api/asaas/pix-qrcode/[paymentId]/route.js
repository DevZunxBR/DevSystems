import { NextResponse } from 'next/server';
import { asaasConfig } from '@/config/asaas';

export async function GET(request, { params }) {
  try {
    const { paymentId } = params;

    const response = await fetch(`${asaasConfig.baseURL}/payments/${paymentId}/pixQrCode`, {
      headers: {
        'access_token': asaasConfig.apiKey,
      },
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