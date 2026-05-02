import { NextResponse } from 'next/server';
import { asaasConfig } from '@/config/asaas';

export async function GET(request, { params }) {
  try {
    const { paymentId } = params;
    
    console.log('Buscando QR Code para paymentId:', paymentId);

    const response = await fetch(`${asaasConfig.baseURL}/payments/${paymentId}/pixQrCode`, {
      headers: {
        'access_token': asaasConfig.apiKey,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro Asaas:', data);
      return NextResponse.json(
        { error: data.errors?.[0]?.description || 'Erro ao buscar QR Code' },
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

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}