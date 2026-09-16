'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
}).refine(data => data.email || data.phone, {
  message: "Debes proporcionar un correo o un teléfono",
  path: ["email"]
})

export async function registerCustomer(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  const parsed = registerSchema.safeParse({ name, email, phone })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const { data: business } = await supabase.from('businesses').select('id').limit(1).single()
  
  if (!business) {
    return { error: 'Error del sistema: Cafetería no configurada.' }
  }

  const { data: newCustomer, error } = await supabase
    .from('customers')
    .insert({
      business_id: business.id,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
    })
    .select('public_token')
    .single()

  if (error) {
    return { error: 'Ocurrió un error al registrar tus datos. ' + error.message }
  }

  redirect(`/tarjeta/${newCustomer.public_token}`)
}
