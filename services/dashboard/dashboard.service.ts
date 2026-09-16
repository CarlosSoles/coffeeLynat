import { createClient } from '@/lib/supabase/server'

export async function getDashboardMetrics() {
  const supabase = await createClient()

  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true })

  const { count: totalRewardsEarned } = await supabase
    .from('customer_rewards')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'EARNED')

  const { count: totalRewardsRedeemed } = await supabase
    .from('customer_rewards')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'REDEEMED')

  const { data: recentCustomers } = await supabase
    .from('customers')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  // Altas de clientes recientes para el gráfico (últimos 100)
  const { data: recentSignups } = await supabase
    .from('customers')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  // Agrupar por fecha local sencilla
  const chartDataMap: Record<string, number> = {}
  if (recentSignups) {
    recentSignups.forEach(s => {
      const date = new Date(s.created_at).toISOString().split('T')[0]
      chartDataMap[date] = (chartDataMap[date] || 0) + 1
    })
  }
  
  const chartData = Object.keys(chartDataMap).sort().map(date => ({
    date,
    clientes: chartDataMap[date]
  }))

  return {
    kpis: {
      totalCustomers: totalCustomers || 0,
      totalRewardsEarned: totalRewardsEarned || 0,
      totalRewardsRedeemed: totalRewardsRedeemed || 0,
    },
    recentCustomers: recentCustomers || [],
    chartData
  }
}
