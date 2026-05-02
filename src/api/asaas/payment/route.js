import { NextResponse } from 'next/server';
import { createPayment } from '@/services/asaasService';

export async function POST(req) {
  try {
    const body = await req.json();
    const payment = await createPayment(body);
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Erro na API de pagamento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar pagamento' },
      { status: 500 }
    );
  }
}