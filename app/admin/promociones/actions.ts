'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPromotion(prevState: { error?: string, success?: boolean }, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const required_stamps = parseInt(formData.get('required_stamps') as string)

  if (!name || !required_stamps) {
    return { error: 'Nombre y Sellos Requeridos son obligatorios' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: publicUser } = await supabase
    .from('users')
    .select('business_id')
    .eq('auth_user_id', user.id)
    .single()

  if (!publicUser?.business_id) {
    return { error: 'No se encontró tu cafetería.' }
  }

  const { error } = await supabase.from('promotions').insert({
    business_id: publicUser.business_id,
    title: name,
    description,
    required_stamps,
    status: 'ACTIVE'
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/promociones')
  return { success: true }
}

export async function togglePromotionStatus(promotionId: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'
  
  await supabase
    .from('promotions')
    .update({ status: newStatus })
    .eq('id', promotionId)
    
  revalidatePath('/admin/promociones')
}
