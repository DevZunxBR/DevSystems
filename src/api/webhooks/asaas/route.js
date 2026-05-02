// src/app/api/webhooks/asaas/route.js (Next.js API route)
import { supabase } from '@/api/base44Client';

export async function POST(req) {
  const body = await req.json();
  const { event, payment } = body;

  if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
    // Atualizar pedido no banco
    await supabase
      .from('orders')
      .update({ 
        status: 'completed',
        payment_confirmed_at: new Date().toISOString()
      })
      .eq('payment_id', payment.id);

    // Notificar criador (opcional)
    console.log(`Pedido ${payment.externalReference} pago com sucesso!`);
  }

  return Response.json({ received: true });
}