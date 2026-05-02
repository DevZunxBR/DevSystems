import { NextResponse } from 'next/server';
import { getPixQrCode } from '@/services/asaasService';

export async function GET(req, { params }) {
  try {
    const { paymentId } = params;
    const qrData = await getPixQrCode(paymentId);
    return NextResponse.json(qrData);
  } catch (error) {
    console.error('Erro na API de QR Code:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar QR Code' },
      { status: 500 }
    );
  }
}