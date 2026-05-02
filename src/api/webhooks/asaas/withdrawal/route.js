// src/app/api/webhooks/asaas/withdrawal/route.js
import { supabase } from '@/api/base44Client';

export async function POST(req) {
  try {
    const body = await req.json();
    const { event, transfer } = body;

    console.log('📥 Webhook de saque recebido:', event);

    // Só vamos autorizar saques
    if (event === 'TRANSFER_REQUESTED') {
      const pixKey = transfer?.pixAddressKey;
      const valor = transfer?.value;

      // Verifica se a chave PIX existe no banco
      const { data: creator } = await supabase
        .from('creator_profiles')
        .select('id, display_name')
        .eq('pix_key', pixKey)
        .single();

      if (!creator) {
        // BLOQUEIA o saque
        return Response.json({ 
          authorized: false, 
          reason: 'Chave PIX não cadastrada na plataforma' 
        });
      }

      // Valor mínimo de R$ 10 (ajuste conforme quiser)
      if (valor < 10) {
        return Response.json({ 
          authorized: false, 
          reason: 'Valor mínimo para saque é R$ 10,00' 
        });
      }

      // ✅ AUTORIZA O SAQUE
      console.log(`✅ Saque autorizado para ${creator.display_name} - R$ ${valor}`);
      return Response.json({ authorized: true });
    }

    // Qualquer outro evento, autoriza por padrão
    return Response.json({ authorized: true });
    
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return Response.json({ 
      authorized: false, 
      reason: 'Erro interno no servidor' 
    });
  }
}