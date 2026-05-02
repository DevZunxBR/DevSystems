import { NextResponse } from 'next/server';
import { asaasConfig } from '@/config/asaas';

// Garantir que aceita POST
export async function POST(request) {
  try {
    const customerData = await request.json();
    
    console.log('Criando cliente no Asaas:', customerData);

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
      console.error('Erro Asaas:', data);
      return NextResponse.json(
        { error: data.errors?.[0]?.description || 'Erro ao criar cliente' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}

// Adicionar OPTIONS para CORS (opcional)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}