'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateConfiguration(formData: FormData) {
  const businessName = formData.get('businessName') as string
  const businessDesc = formData.get('businessDesc') as string
  const programName = formData.get('programName') as string
  const requiredStamps = parseInt(formData.get('requiredStamps') as string)
  
  const supabase = await createClient()

  // 1. Update business
  const { data: business } = await supabase.from('businesses').select('id').limit(1).single()
  if (business) {
    await supabase.from('businesses').update({
      name: businessName,
      description: businessDesc
    }).eq('id', business.id)
    
    // 2. Update loyalty program
    const { data: program } = await supabase.from('loyalty_programs').select('id').eq('business_id', business.id).limit(1).single()
    if (program) {
      await supabase.from('loyalty_programs').update({
        name: programName,
        required_stamps: requiredStamps
      }).eq('id', program.id)
    }
  }

  revalidatePath('/admin/configuracion')
  return { success: true }
}
