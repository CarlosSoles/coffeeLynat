'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addStampToCustomer(customerId: string) {
  const supabase = await createClient()

  // 1. Obtener la fidelización actual
  const { data: loyalty, error: loyaltyError } = await supabase
    .from('customer_loyalty')
    .select('*, loyalty_programs(*)')
    .eq('customer_id', customerId)
    .single()

  if (loyaltyError || !loyalty) {
    return { error: 'No se encontró el programa de fidelidad para este cliente. Asegúrate de configurar un programa primero.' }
  }

  const program = loyalty.loyalty_programs
  let newStamps = loyalty.current_stamps + 1
  let rewardEarned = false

  // 2. Verificar si alcanza la meta
  if (newStamps >= program.required_stamps) {
    rewardEarned = true
    newStamps = 0 // Reiniciar sellos porque se ganó la recompensa
  }

  // 3. Actualizar sellos
  const { error: updateError } = await supabase
    .from('customer_loyalty')
    .update({ current_stamps: newStamps })
    .eq('id', loyalty.id)

  if (updateError) {
    return { error: 'Ocurrió un error al actualizar los sellos.' }
  }

  // 4. Registrar la visita en historial (opcional según reglas, pero bueno tenerlo)
  // No creamos tabla de historial de visitas, actualizamos last_visit_at
  await supabase
    .from('customers')
    .update({ last_visit_at: new Date().toISOString() })
    .eq('id', customerId)

  // 5. Si ganó recompensa, insertar en customer_rewards
  if (rewardEarned) {
    const { data: rewardTemplate } = await supabase
      .from('rewards')
      .select('id')
      .eq('loyalty_program_id', program.id)
      .limit(1)
      .single()

    if (rewardTemplate) {
      await supabase
        .from('customer_rewards')
        .insert({
          customer_id: customerId,
          reward_id: rewardTemplate.id,
          status: 'EARNED'
        })
    }
  }

  revalidatePath('/admin/visitas/[token]')
  return { success: true, rewardEarned }
}

export async function redeemReward(customerRewardId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('customer_rewards')
    .update({ status: 'REDEEMED', redeemed_at: new Date().toISOString() })
    .eq('id', customerRewardId)

  if (error) {
    return { error: 'No se pudo canjear la recompensa.' }
  }

  revalidatePath('/admin/visitas/[token]')
  return { success: true }
}
