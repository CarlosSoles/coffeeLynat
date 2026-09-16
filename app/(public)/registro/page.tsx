'use client'

import React, { useActionState } from 'react'
import { registerCustomer } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coffee } from 'lucide-react'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => await registerCustomer(formData),
    null
  )

  return (
    <div className="flex flex-col items-center justify-center pt-8">
      <div className="mb-8 bg-blue-600 p-4 rounded-3xl shadow-xl transform rotate-3">
        <Coffee className="h-12 w-12 text-white" />
      </div>
      
      <div className="w-full">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-extrabold text-gray-900 tracking-tight">¡Únete al Club!</CardTitle>
            <p className="text-gray-500 mt-2 text-sm">Regístrate en segundos y comienza a ganar café gratis.</p>
          </CardHeader>
          <CardContent className="mt-6">
            <form action={formAction} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="name">¿Cómo te llamas?</label>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  required 
                  placeholder="Tu nombre y apellido"
                  className="h-12 text-base rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="email">Correo Electrónico</label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="tu@email.com (Opcional si usas teléfono)"
                  className="h-12 text-base rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="phone">Teléfono (WhatsApp)</label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="Tu número (Opcional si usas correo)"
                  className="h-12 text-base rounded-xl"
                />
              </div>

              {state?.error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl font-medium border border-red-100">
                  {state.error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-lg font-bold rounded-xl shadow-lg mt-4" disabled={isPending}>
                {isPending ? 'Creando tu tarjeta...' : '¡Quiero mi tarjeta!'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
