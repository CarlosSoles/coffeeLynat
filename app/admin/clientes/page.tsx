import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default async function ClientesPage() {
  const supabase = await createClient()

  // Fetch all customers along with their current stamps
  const { data: customers } = await supabase
    .from('customers')
    .select(`
      id,
      name,
      email,
      phone,
      created_at,
      status,
      customer_loyalty(current_stamps, total_visits)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Directorio de Clientes</h1>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-200">
        <CardHeader className="bg-white rounded-t-xl border-b border-gray-100">
          <CardTitle>Listado General</CardTitle>
          <CardDescription>Visualiza a todos los clientes registrados en tu cafetería y su progreso.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {customers && customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Nombre</th>
                    <th className="px-6 py-3 font-semibold">Contacto</th>
                    <th className="px-6 py-3 font-semibold">Registro</th>
                    <th className="px-6 py-3 text-center font-semibold">Sellos / Visitas</th>
                    <th className="px-6 py-3 text-right font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => {
                    const loyalty = Array.isArray(c.customer_loyalty) ? c.customer_loyalty[0] : c.customer_loyalty
                    return (
                      <tr key={c.id} className="bg-white border-b hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm">{c.email || '—'}</span>
                            <span className="text-xs text-gray-500">{c.phone || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {loyalty?.current_stamps || 0} sellos
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50/50 rounded-b-xl">
              No hay clientes registrados aún.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
