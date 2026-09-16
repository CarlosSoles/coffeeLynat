import { createClient } from '@/lib/supabase/server'

export async function getCustomerByToken(publicToken: string) {
  const supabase = await createClient()
  
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*, businesses(name, logo_url)')
    .eq('public_token', publicToken)
    .single()

  if (customerError || !customer) {
    return null
  }

  const { data: loyalty } = await supabase
    .from('customer_loyalty')
    .select('*, loyalty_programs(name, required_stamps, reward_description)')
    .eq('customer_id', customer.id)
    .single()

  const { data: rewards } = await supabase
    .from('customer_rewards')
    .select('*, rewards(name, description)')
    .eq('customer_id', customer.id)
    .eq('status', 'EARNED')

  return {
    customer,
    loyalty: loyalty || null,
    earnedRewards: rewards || []
  }
}
