import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateConfiguration } from './actions'

export default async function ConfiguracionPage() {
  const supabase = await createClient()

  // Get current config
  const { data: business } = await supabase.from('businesses').select('*').limit(1).single()
  let program = null
  if (business) {
    const { data } = await supabase.from('loyalty_programs').select('*').eq('business_id', business.id).limit(1).single()
    program = data
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3">
        <div className="bg-gray-100 p-2 rounded-lg">
          <Settings className="h-6 w-6 text-gray-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Configuración del Sistema</h1>
      </div>

      <div className="max-w-2xl">
        <Card className="border-none shadow-sm ring-1 ring-gray-200">
          <CardHeader className="bg-gray-50 rounded-t-xl border-b border-gray-100">
            <CardTitle>Ajustes Generales</CardTitle>
            <CardDescription>Modifica la información de tu cafetería y las reglas de fidelidad.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={updateConfiguration} className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Datos del Negocio</h3>
                <div className="space-y-2">
                  <label htmlFor="businessName" className="text-sm font-medium text-gray-700">Nombre de la Cafetería</label>
                  <Input id="businessName" name="businessName" defaultValue={business?.name || ''} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="businessDesc" className="text-sm font-medium text-gray-700">Descripción</label>
                  <Input id="businessDesc" name="businessDesc" defaultValue={business?.description || ''} />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-lg border-b pb-2">Programa de Fidelidad</h3>
                <div className="space-y-2">
                  <label htmlFor="programName" className="text-sm font-medium text-gray-700">Nombre del Programa</label>
                  <Input id="programName" name="programName" defaultValue={program?.name || ''} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="requiredStamps" className="text-sm font-medium text-gray-700">Meta: Sellos requeridos para completarlo</label>
                  <Input id="requiredStamps" name="requiredStamps" type="number" min="1" defaultValue={program?.required_stamps || 7} required />
                  <p className="text-sm text-gray-500">Ejemplo: Si pones 7, el cliente necesitará 7 visitas antes de poder canjear su primer premio.</p>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
