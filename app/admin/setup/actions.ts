'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function setupBusiness(prevState: { error: string }, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  
  if (!name) {
    return { error: 'El nombre de la cafetería es obligatorio.' }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  // 1. Crear el negocio
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .insert({ name, description })
    .select('id')
    .single()

  if (businessError || !business) {
    return { error: businessError?.message || 'Error al crear la cafetería.' }
  }

  // 2. Crear un programa de lealtad por defecto
  const { error: programError } = await supabase
    .from('loyalty_programs')
    .insert({
      business_id: business.id,
      name: `Club de ${name}`,
      required_stamps: 7,
      reward_description: '¡Premio gratis al completar!'
    })

  if (programError) {
    // Si falla, en un sistema real haríamos un rollback, pero para simplificar seguimos.
    console.error('Error al crear programa de lealtad:', programError)
  }

  // 3. Crear el usuario público vinculado a este negocio
  const { error: userError } = await supabase
    .from('users')
    .insert({
      auth_user_id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
      email: user.email!,
      role: 'ADMIN',
      business_id: business.id
    })

  if (userError) {
    return { error: userError.message || 'Error al vincular el administrador.' }
  }

  revalidatePath('/')
  redirect('/admin/dashboard')
}
