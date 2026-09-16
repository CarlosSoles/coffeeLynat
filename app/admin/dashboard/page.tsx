import React from 'react'
import { getDashboardMetrics } from '@/services/dashboard/dashboard.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Gift, TicketCheck } from 'lucide-react'
import { DashboardChart } from './DashboardChart'

export default async function DashboardPage() {
  const data = await getDashboardMetrics()
  const { kpis, recentCustomers, chartData } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Resumen operativo del programa de fidelización.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Clientes</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">{kpis.totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Premios Entregados</CardTitle>
            <TicketCheck className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">{kpis.totalRewardsRedeemed}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Premios Pendientes</CardTitle>
            <Gift className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">{kpis.totalRewardsEarned}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full shadow-sm border-gray-100">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="text-lg">Alta de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardChart data={chartData} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full shadow-sm border-gray-100">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="text-lg">Últimos Clientes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {recentCustomers.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Aún no hay clientes.</p>
                ) : (
                  recentCustomers.map((customer) => (
                    <div key={customer.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-400 font-medium">
                          {new Date(customer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold">
                        Nuevo
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
