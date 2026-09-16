import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Gift, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createPromotion, togglePromotionStatus } from './actions'

export default async function PromocionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let rewards: any[] = []
  if (user) {
    const { data: publicUser } = await supabase
      .from('users')
      .select('business_id')
      .eq('auth_user_id', user.id)
      .single()

    if (publicUser?.business_id) {
      const { data } = await supabase
        .from('promotions')
        .select('*')
        .eq('business_id', publicUser.business_id)
        .order('required_stamps', { ascending: true })
      if (data) rewards = data
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Gift className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Catálogo de Promociones</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {rewards.map((reward) => (
            <Card key={reward.id} className={`border-none shadow-sm ring-1 ring-gray-200 transition-all ${reward.status !== 'ACTIVE' && 'opacity-60 grayscale'}`}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                    {reward.required_stamps || 0}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{reward.title}</h3>
                    <p className="text-gray-500 text-sm">{reward.description || 'Sin descripción'}</p>
                  </div>
                </div>
                <form action={async () => {
                  'use server'
                  await togglePromotionStatus(reward.id, reward.status)
                }}>
                  <Button variant={reward.status === 'ACTIVE' ? "outline" : "default"} size="sm">
                    {reward.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
          {rewards.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No hay promociones creadas. ¡Crea una para motivar a tus clientes!
            </div>
          )}
        </div>

        <div>
          <Card className="border-none shadow-sm ring-1 ring-gray-200 sticky top-6">
            <CardHeader className="bg-gray-50 rounded-t-xl border-b border-gray-100">
              <CardTitle className="text-lg">Nueva Promoción</CardTitle>
              <CardDescription>Crea un nuevo premio o promoción para canjear por sellos.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form action={async (formData: FormData) => {
                'use server'
                await createPromotion({ error: '', success: false }, formData)
              }} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre del premio</label>
                  <Input id="name" name="name" placeholder="Ej. Frappé Gratis" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción breve</label>
                  <Input id="description" name="description" placeholder="Válido por cualquier tamaño" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="required_stamps" className="text-sm font-medium text-gray-700">Sellos necesarios</label>
                  <Input id="required_stamps" name="required_stamps" type="number" min="1" placeholder="Ej. 10" required />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Promoción
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
