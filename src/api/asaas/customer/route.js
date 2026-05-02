import { NextResponse } from 'next/server';
import { createCustomer } from '@/services/asaasService';

export async function POST(req) {
  try {
    const body = await req.json();
    const customer = await createCustomer(body);
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Erro na API de cliente:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar cliente' },
      { status: 500 }
    );
  }
}